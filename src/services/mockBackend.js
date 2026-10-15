import { INITIAL_HOTELS, INITIAL_RESERVATIONS, DEMO_USERS } from './mockData';

// Storage keys
const STORAGE_KEYS = {
  HOTELS: 'luxehaven_hotels_v1',
  RESERVATIONS: 'luxehaven_reservations_v1',
  AUTH_TOKEN: 'luxehaven_auth_token_v1',
  AUTH_USER: 'luxehaven_auth_user_v1',
  DEBUG_SETTINGS: 'luxehaven_debug_settings_v1'
};

// Initialize Storage if empty
const getStoredData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('Storage parse error:', e);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error:', e);
  }
};

// In-memory / storage sync
let hotelsData = getStoredData(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
let reservationsData = getStoredData(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);

// Simulated controls for testing error handling & expired tokens (Exp 1f, 3f, 4f)
export const apiSimulationConfig = {
  latencyMs: 400,
  forceError: false,
  forceExpiredToken: false,
  networkOnline: true
};

export const resetBackendToDefault = () => {
  hotelsData = [...INITIAL_HOTELS];
  reservationsData = [...INITIAL_RESERVATIONS];
  setStoredData(STORAGE_KEYS.HOTELS, hotelsData);
  setStoredData(STORAGE_KEYS.RESERVATIONS, reservationsData);
};

// Helper to simulate network latency
const sleep = (ms = apiSimulationConfig.latencyMs) => new Promise(res => setTimeout(res, ms));

// Helper to validate Bearer token
const validateBearerToken = (authHeader) => {
  if (apiSimulationConfig.forceExpiredToken) {
    return { valid: false, status: 401, message: 'ExpiredTokenError: Your authentication token has expired. Please log in again.' };
  }
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, status: 401, message: 'Unauthorized: Authorization token is required for this operation.' };
  }
  const token = authHeader.replace('Bearer ', '').trim();
  if (token === 'EXPIRED_TOKEN' || token.length < 5) {
    return { valid: false, status: 401, message: 'Unauthorized: Invalid or expired token.' };
  }
  return { valid: true, token };
};

/**
 * Mock Backend Handler for Axios Interceptor
 * Simulates standard RESTful API endpoints
 */
export const mockBackendHandler = async (config) => {
  await sleep();

  const method = (config.method || 'get').toLowerCase();
  const cleanUrl = (config.url || '').split('?')[0];
  const { params, data, headers } = config;

  // Global simulated network failure
  if (apiSimulationConfig.forceError) {
    const error = new Error('Network Error: Simulated 500 Server Unreachable');
    error.response = {
      status: 500,
      config,
      data: { message: 'Internal Server Error: Database connection timeout (Simulated Error)' }
    };
    error.config = config;
    throw error;
  }

  // ==========================================
  // EXPERIMENT 1: REST API & Async Data
  // ==========================================

  // a, b, c) GET /api/hotels (Search, Filter, Availability, Location)
  if (method === 'get' && cleanUrl === '/api/hotels') {
    let results = [...hotelsData];
    const { search, location, minPrice, maxPrice, rating, amenity, onlyAvailable } = params || {};

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.tagline.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }

    if (location && location !== 'all') {
      const loc = location.toLowerCase();
      results = results.filter(h =>
        h.location.toLowerCase().includes(loc) ||
        h.city.toLowerCase().includes(loc) ||
        h.country.toLowerCase().includes(loc)
      );
    }

    if (minPrice) {
      results = results.filter(h => h.basePrice >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter(h => h.basePrice <= Number(maxPrice));
    }

    if (rating) {
      results = results.filter(h => h.rating >= Number(rating));
    }

    if (amenity && amenity !== 'all') {
      results = results.filter(h =>
        h.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      );
    }

    if (onlyAvailable === 'true' || onlyAvailable === true) {
      results = results.filter(h => h.availableRooms > 0);
    }

    return {
      status: 200,
      data: {
        success: true,
        count: results.length,
        hotels: results
      }
    };
  }

  // d) GET /api/hotels/:id (Fetch individual hotel & rooms details)
  const hotelMatch = cleanUrl.match(/^\/api\/hotels\/([a-zA-Z0-9-]+)$/);
  if (method === 'get' && hotelMatch) {
    const hotelId = hotelMatch[1];
    const hotel = hotelsData.find(h => h.id === hotelId);

    if (!hotel) {
      const err = new Error('Hotel not found');
      err.response = { status: 404, data: { message: `Hotel with ID ${hotelId} was not found.` } };
      throw err;
    }

    return {
      status: 200,
      data: {
        success: true,
        hotel
      }
    };
  }

  // GET /api/hotels/:id/rooms/:roomId
  const roomMatch = cleanUrl.match(/^\/api\/hotels\/([a-zA-Z0-9-]+)\/rooms\/([a-zA-Z0-9-]+)$/);
  if (method === 'get' && roomMatch) {
    const [, hotelId, roomId] = roomMatch;
    const hotel = hotelsData.find(h => h.id === hotelId);
    const room = hotel?.rooms?.find(r => r.id === roomId);

    if (!hotel || !room) {
      const err = new Error('Room not found');
      err.response = { status: 404, data: { message: 'Requested room or hotel was not found.' } };
      throw err;
    }

    return {
      status: 200,
      data: {
        success: true,
        hotel: { id: hotel.id, name: hotel.name, location: hotel.location },
        room
      }
    };
  }

  // ==========================================
  // EXPERIMENT 4: Auth & Token Management
  // ==========================================

  // a) POST /api/auth/login
  if (method === 'post' && cleanUrl === '/api/auth/login') {
    const body = typeof data === 'string' ? JSON.parse(data) : data;
    const { email, password } = body || {};

    // Check demo users or allow demo access
    const matchedUser = DEMO_USERS.find(u => u.email.toLowerCase() === email?.toLowerCase()) || {
      id: `user-${Date.now()}`,
      name: email?.split('@')[0] || 'Luxury Guest',
      email: email || 'guest@luxehaven.com',
      role: 'Registered Guest',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      token: `jwt-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };

    return {
      status: 200,
      data: {
        success: true,
        message: 'Authentication successful. Token issued.',
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          avatar: matchedUser.avatar
        },
        token: matchedUser.token,
        tokenType: 'Bearer',
        expiresIn: 3600 // 1 hour
      }
    };
  }

  // e) POST /api/auth/logout
  if (method === 'post' && cleanUrl === '/api/auth/logout') {
    return {
      status: 200,
      data: {
        success: true,
        message: 'Successfully logged out. Session invalidated.'
      }
    };
  }

  // ==========================================
  // EXPERIMENT 3: Reservation CRUD Operations
  // ==========================================

  // All reservation operations require valid Bearer token
  const authHeader = headers?.Authorization || headers?.authorization;

  // e) GET /api/reservations (Retrieve reservation history)
  if (method === 'get' && cleanUrl === '/api/reservations') {
    const authCheck = validateBearerToken(authHeader);
    if (!authCheck.valid) {
      const err = new Error(authCheck.message);
      err.response = { status: authCheck.status, data: { message: authCheck.message } };
      throw err;
    }

    return {
      status: 200,
      data: {
        success: true,
        count: reservationsData.length,
        reservations: [...reservationsData]
      }
    };
  }

  // b) POST /api/reservations (Create a hotel reservation)
  if (method === 'post' && cleanUrl === '/api/reservations') {
    const authCheck = validateBearerToken(authHeader);
    if (!authCheck.valid) {
      const err = new Error(authCheck.message);
      err.response = { status: authCheck.status, data: { message: authCheck.message } };
      throw err;
    }

    const payload = typeof data === 'string' ? JSON.parse(data) : data;

    // Validation
    if (!payload.hotelId || !payload.roomId || !payload.checkInDate || !payload.checkOutDate) {
      const err = new Error('Missing required booking details');
      err.response = { status: 400, data: { message: 'Hotel, room, and check-in/out dates are required.' } };
      throw err;
    }

    const newReservation = {
      id: `res-${Date.now()}`,
      bookingCode: `LX-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      ...payload
    };

    reservationsData = [newReservation, ...reservationsData];
    setStoredData(STORAGE_KEYS.RESERVATIONS, reservationsData);

    return {
      status: 201,
      data: {
        success: true,
        message: 'Reservation created successfully!',
        reservation: newReservation
      }
    };
  }

  // c) PUT /api/reservations/:id (Update reservation details)
  const resMatch = cleanUrl.match(/^\/api\/reservations\/([a-zA-Z0-9-]+)$/);
  if ((method === 'put' || method === 'patch') && resMatch) {
    const authCheck = validateBearerToken(authHeader);
    if (!authCheck.valid) {
      const err = new Error(authCheck.message);
      err.response = { status: authCheck.status, data: { message: authCheck.message } };
      throw err;
    }

    const resId = resMatch[1];
    const index = reservationsData.findIndex(r => r.id === resId);

    if (index === -1) {
      const err = new Error('Reservation not found');
      err.response = { status: 404, data: { message: `Reservation with ID ${resId} not found.` } };
      throw err;
    }

    const updates = typeof data === 'string' ? JSON.parse(data) : data;
    const existing = reservationsData[index];

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      status: updates.status || 'MODIFIED'
    };

    reservationsData[index] = updated;
    setStoredData(STORAGE_KEYS.RESERVATIONS, reservationsData);

    return {
      status: 200,
      data: {
        success: true,
        message: 'Reservation updated successfully!',
        reservation: updated
      }
    };
  }

  // d) DELETE /api/reservations/:id (Cancel a reservation)
  if (method === 'delete' && resMatch) {
    const authCheck = validateBearerToken(authHeader);
    if (!authCheck.valid) {
      const err = new Error(authCheck.message);
      err.response = { status: authCheck.status, data: { message: authCheck.message } };
      throw err;
    }

    const resId = resMatch[1];
    const index = reservationsData.findIndex(r => r.id === resId);

    if (index === -1) {
      const err = new Error('Reservation not found');
      err.response = { status: 404, data: { message: `Reservation with ID ${resId} not found.` } };
      throw err;
    }

    // Instead of hard deleting, we can either remove or mark as CANCELED
    const canceledReservation = {
      ...reservationsData[index],
      status: 'CANCELED',
      canceledAt: new Date().toISOString()
    };

    reservationsData[index] = canceledReservation;
    setStoredData(STORAGE_KEYS.RESERVATIONS, reservationsData);

    return {
      status: 200,
      data: {
        success: true,
        message: 'Reservation canceled successfully.',
        reservationId: resId,
        refundStatus: 'FULL_REFUND_PROCESSED'
      }
    };
  }

  // Fallback 404 for unknown endpoint
  const err = new Error('Not Found');
  err.response = { status: 404, data: { message: `Endpoint ${method.toUpperCase()} ${cleanUrl} not found.` } };
  throw err;
};

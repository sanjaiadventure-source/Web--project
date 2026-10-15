import { createSlice } from '@reduxjs/toolkit';

// Helper to compute dates
const getTomorrowDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const getFutureDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

// ============================================================================
// EXPERIMENT 2d: Mathematical calculation of duration, cost, taxes, total
// ============================================================================
export const calculatePricing = ({ ratePerNight = 500, checkInDate, checkOutDate, roomsCount = 1, discountAmount = 0 }) => {
  let nights = 1;
  if (checkInDate && checkOutDate) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    nights = diffDays > 0 ? diffDays : 1;
  }

  const roomCost = Math.round(ratePerNight * nights * roomsCount * 100) / 100;
  const serviceFee = 45; // Luxury resort & wellness fee
  const taxes = Math.round(roomCost * 0.12 * 100) / 100; // 12% Hospitality Tax / VAT
  const totalAmount = Math.max(0, Math.round((roomCost + taxes + serviceFee - discountAmount) * 100) / 100);

  return {
    nights,
    ratePerNight,
    roomCost,
    serviceFee,
    taxes,
    discount: discountAmount,
    totalAmount
  };
};

// Safe storage rehydration (Exp 2f)
const loadStoredDraft = () => {
  try {
    const raw = localStorage.getItem('luxehaven_booking_draft_v1');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not rehydrate booking draft:', e);
  }
  return null;
};

const storedDraft = loadStoredDraft();

const initialCheckIn = storedDraft?.checkInDate || getTomorrowDate();
const initialCheckOut = storedDraft?.checkOutDate || getFutureDate(4);

const initialPricing = calculatePricing({
  ratePerNight: storedDraft?.selectedRoom?.pricePerNight || 520,
  checkInDate: initialCheckIn,
  checkOutDate: initialCheckOut,
  roomsCount: storedDraft?.guests?.roomsCount || 1,
  discountAmount: storedDraft?.pricing?.discount || 0
});

const initialState = {
  // EXPERIMENT 2b: Manage selected hotel, room, dates, and guest info
  selectedHotel: storedDraft?.selectedHotel || null,
  selectedRoom: storedDraft?.selectedRoom || null,
  checkInDate: initialCheckIn,
  checkOutDate: initialCheckOut,
  guests: storedDraft?.guests || {
    adults: 2,
    children: 0,
    roomsCount: 1
  },
  specialRequests: storedDraft?.specialRequests || '',
  promoCode: storedDraft?.promoCode || '',
  promoApplied: storedDraft?.promoApplied || false,
  stayDuration: initialPricing.nights,
  pricing: initialPricing,
  isModalOpen: false,
  validationError: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // EXPERIMENT 2c: Booking actions
    openBookingModal: (state, action) => {
      const { hotel, room } = action.payload || {};
      if (hotel) state.selectedHotel = hotel;
      if (room) state.selectedRoom = room;

      const rate = room?.pricePerNight || hotel?.basePrice || 520;
      state.pricing = calculatePricing({
        ratePerNight: rate,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        roomsCount: state.guests.roomsCount,
        discountAmount: state.pricing.discount
      });
      state.stayDuration = state.pricing.nights;
      state.isModalOpen = true;
      state.validationError = null;
    },
    closeBookingModal: (state) => {
      state.isModalOpen = false;
      state.validationError = null;
    },
    setBookingHotel: (state, action) => {
      state.selectedHotel = action.payload;
      const rate = state.selectedRoom?.pricePerNight || action.payload?.basePrice || 500;
      state.pricing = calculatePricing({
        ratePerNight: rate,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        roomsCount: state.guests.roomsCount,
        discountAmount: state.pricing.discount
      });
      state.stayDuration = state.pricing.nights;
    },
    setBookingRoom: (state, action) => {
      state.selectedRoom = action.payload;
      const rate = action.payload?.pricePerNight || state.selectedHotel?.basePrice || 500;
      state.pricing = calculatePricing({
        ratePerNight: rate,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        roomsCount: state.guests.roomsCount,
        discountAmount: state.pricing.discount
      });
      state.stayDuration = state.pricing.nights;
    },
    setDates: (state, action) => {
      const { checkInDate, checkOutDate } = action.payload;
      if (checkInDate) state.checkInDate = checkInDate;
      if (checkOutDate) state.checkOutDate = checkOutDate;

      // Recalculate duration & pricing
      const rate = state.selectedRoom?.pricePerNight || state.selectedHotel?.basePrice || 500;
      state.pricing = calculatePricing({
        ratePerNight: rate,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        roomsCount: state.guests.roomsCount,
        discountAmount: state.pricing.discount
      });
      state.stayDuration = state.pricing.nights;
    },
    setGuests: (state, action) => {
      state.guests = { ...state.guests, ...action.payload };
      const rate = state.selectedRoom?.pricePerNight || state.selectedHotel?.basePrice || 500;
      state.pricing = calculatePricing({
        ratePerNight: rate,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        roomsCount: state.guests.roomsCount,
        discountAmount: state.pricing.discount
      });
    },
    setSpecialRequests: (state, action) => {
      state.specialRequests = action.payload;
    },
    applyCoupon: (state, action) => {
      const code = (action.payload || '').trim().toUpperCase();
      state.promoCode = code;

      let discount = 0;
      if (code === 'LUXE20') {
        // 20% off room rate
        const nights = state.stayDuration || 2;
        const rooms = state.guests?.roomsCount || 1;
        const rate = state.selectedRoom?.pricePerNight || state.selectedHotel?.basePrice || 500;
        const base = rate * nights * rooms;
        discount = Math.round(base * 0.2);
        state.promoApplied = true;
        state.validationError = null;
      } else if (code === 'VIP100') {
        discount = 100;
        state.promoApplied = true;
        state.validationError = null;
      } else if (code === '') {
        state.promoApplied = false;
        state.validationError = null;
      } else {
        state.promoApplied = false;
        state.validationError = 'Invalid promo code. Try LUXE20 or VIP100';
      }

      const rate = state.selectedRoom?.pricePerNight || state.selectedHotel?.basePrice || 500;
      state.pricing = calculatePricing({
        ratePerNight: rate,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        roomsCount: state.guests.roomsCount,
        discountAmount: discount
      });
    },
    resetBookingDraft: (state) => {
      state.selectedHotel = null;
      state.selectedRoom = null;
      state.specialRequests = '';
      state.promoCode = '';
      state.promoApplied = false;
      state.isModalOpen = false;
      state.validationError = null;
      localStorage.removeItem('luxehaven_booking_draft_v1');
    }
  }
});

export const {
  openBookingModal,
  closeBookingModal,
  setBookingHotel,
  setBookingRoom,
  setDates,
  setGuests,
  setSpecialRequests,
  applyCoupon,
  resetBookingDraft
} = bookingSlice.actions;

export default bookingSlice.reducer;

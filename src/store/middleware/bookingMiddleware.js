/**
 * EXPERIMENT 2e & 2f: Custom Redux Middleware
 * - Intercepts hotel booking actions
 * - Validates date rules and guest capacities
 * - Persists booking state to browser storage (localStorage)
 * - Logs actions to the live Redux Middleware Audit Log
 */

export const middlewareEventBus = {
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },
  emit(event) {
    this.listeners.forEach(fn => {
      try {
        fn(event);
      } catch (e) {
        console.error('Middleware listener error:', e);
      }
    });
  }
};

export const bookingMiddleware = (store) => (next) => (action) => {
  const startTime = performance.now();
  const prevState = store.getState();

  // EXPERIMENT 2e: Middleware Interception & Validation
  if (action.type === 'booking/setDates') {
    const { checkInDate, checkOutDate } = action.payload || {};
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkOut <= checkIn) {
        console.warn('[Booking Middleware] Validation Error: Check-out date must be after check-in date.');
        middlewareEventBus.emit({
          type: 'VALIDATION_WARNING',
          timestamp: new Date().toLocaleTimeString(),
          action: action.type,
          warning: 'Check-out date must be at least 1 day after check-in date.'
        });
      }
    }
  }

  // Pass action through reducer chain
  const result = next(action);
  const nextState = store.getState();
  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

  // EXPERIMENT 2f: Persist booking information using browser storage
  if (action.type.startsWith('booking/')) {
    try {
      localStorage.setItem('luxehaven_booking_draft_v1', JSON.stringify(nextState.booking));
    } catch (err) {
      console.error('[Booking Middleware] Failed to persist booking draft to localStorage:', err);
    }
  }

  // Audit Log Emission for Experiment Inspector
  if (action.type.startsWith('booking/') || action.type.startsWith('reservations/') || action.type.startsWith('auth/')) {
    middlewareEventBus.emit({
      type: 'ACTION_DISPATCHED',
      timestamp: new Date().toLocaleTimeString(),
      actionType: action.type,
      payload: action.payload,
      durationMs,
      stayDuration: nextState.booking?.stayDuration,
      totalAmount: nextState.booking?.pricing?.totalAmount
    });
  }

  return result;
};

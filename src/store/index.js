import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import hotelsReducer from './slices/hotelsSlice';
import bookingReducer from './slices/bookingSlice';
import reservationsReducer from './slices/reservationsSlice';
import inspectorReducer from './slices/inspectorSlice';
import { bookingMiddleware } from './middleware/bookingMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelsReducer,
    booking: bookingReducer,
    reservations: reservationsReducer,
    inspector: inspectorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(bookingMiddleware)
});

export default store;

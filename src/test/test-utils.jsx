import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import hotelsReducer from '../store/slices/hotelsSlice';
import bookingReducer from '../store/slices/bookingSlice';
import reservationsReducer from '../store/slices/reservationsSlice';
import inspectorReducer from '../store/slices/inspectorSlice';

export function setupTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      hotels: hotelsReducer,
      booking: bookingReducer,
      reservations: reservationsReducer,
      inspector: inspectorReducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = setupTestStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

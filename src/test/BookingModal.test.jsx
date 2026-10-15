import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import BookingModal from '../components/BookingModal';

const mockHotel = {
  id: 'hotel-1',
  name: 'The Ritz-Carlton Paris',
  location: 'Paris, France',
  featuredImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
};

const mockRoom = {
  id: 'room-1',
  name: 'Prestige Paris Suite',
  pricePerNight: 850
};

describe('EXPERIMENT 1c & 1d & 1e: BookingModal & Guest Information Testing', () => {
  it('does not render when modal is closed', () => {
    const { container } = renderWithProviders(<BookingModal openAuthModal={vi.fn()} />, {
      preloadedState: {
        booking: { isModalOpen: false, selectedHotel: null }
      }
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders selected hotel, room tier, date inputs, and guest selectors', () => {
    renderWithProviders(<BookingModal openAuthModal={vi.fn()} />, {
      preloadedState: {
        booking: {
          isModalOpen: true,
          selectedHotel: mockHotel,
          selectedRoom: mockRoom,
          checkInDate: '2026-11-01',
          checkOutDate: '2026-11-04',
          guests: { adults: 2, children: 0, roomsCount: 1 },
          pricing: { ratePerNight: 850, roomCost: 2550, taxes: 306, serviceFee: 45, discount: 0, totalAmount: 2901 }
        }
      }
    });

    expect(screen.getByText('The Ritz-Carlton Paris')).toBeInTheDocument();
    expect(screen.getByText(/Prestige Paris Suite/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-11-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-11-04')).toBeInTheDocument();
    expect(screen.getByLabelText(/adults/i)).toBeInTheDocument();
    expect(screen.getByText('$2901.00')).toBeInTheDocument();
  });

  it('updates guest count when select changes', () => {
    const { store } = renderWithProviders(<BookingModal openAuthModal={vi.fn()} />, {
      preloadedState: {
        booking: {
          isModalOpen: true,
          selectedHotel: mockHotel,
          selectedRoom: mockRoom,
          checkInDate: '2026-11-01',
          checkOutDate: '2026-11-04',
          guests: { adults: 2, children: 0, roomsCount: 1 },
          pricing: { ratePerNight: 850, roomCost: 2550, taxes: 306, serviceFee: 45, discount: 0, totalAmount: 2901 }
        }
      }
    });

    const adultsSelect = screen.getByLabelText(/adults/i);
    fireEvent.change(adultsSelect, { target: { value: '4' } });

    expect(store.getState().booking.guests.adults).toBe(4);
  });

  it('applies promo code LUXE20 and updates discount pricing', () => {
    const { store } = renderWithProviders(<BookingModal openAuthModal={vi.fn()} />, {
      preloadedState: {
        booking: {
          isModalOpen: true,
          selectedHotel: mockHotel,
          selectedRoom: mockRoom,
          checkInDate: '2026-11-01',
          checkOutDate: '2026-11-03', // 2 nights => roomCost 1700
          guests: { adults: 2, children: 0, roomsCount: 1 },
          pricing: { ratePerNight: 850, roomCost: 1700, taxes: 204, serviceFee: 45, discount: 0, totalAmount: 1949 }
        }
      }
    });

    const promoInput = screen.getByPlaceholderText(/promo code/i);
    fireEvent.change(promoInput, { target: { value: 'LUXE20' } });

    const applyBtn = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyBtn);

    const bookingState = store.getState().booking;
    expect(bookingState.promoApplied).toBe(true);
    expect(bookingState.pricing.discount).toBeGreaterThan(0);
  });

  it('prompts user to authenticate if unauthenticated when confirming reservation', () => {
    const openAuthMock = vi.fn();
    renderWithProviders(<BookingModal openAuthModal={openAuthMock} />, {
      preloadedState: {
        auth: { isAuthenticated: false, user: null, token: null },
        booking: {
          isModalOpen: true,
          selectedHotel: mockHotel,
          selectedRoom: mockRoom,
          checkInDate: '2026-11-01',
          checkOutDate: '2026-11-04',
          guests: { adults: 2, children: 0, roomsCount: 1 },
          pricing: { ratePerNight: 850, roomCost: 2550, taxes: 306, serviceFee: 45, discount: 0, totalAmount: 2901 }
        }
      }
    });

    const confirmBtn = screen.getByRole('button', { name: /sign in & confirm reservation/i });
    fireEvent.click(confirmBtn);

    expect(openAuthMock).toHaveBeenCalledTimes(1);
  });
});

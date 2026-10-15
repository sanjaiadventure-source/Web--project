import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import ReservationsView from '../components/ReservationsView';

const mockReservations = [
  {
    id: 'res-101',
    bookingCode: 'LX-88910',
    hotelId: 'hotel-1',
    hotelName: 'The Ritz-Carlton Paris',
    hotelLocation: 'Paris, France',
    hotelImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    roomId: 'room-1',
    roomName: 'Prestige Paris Suite',
    checkInDate: '2026-11-01',
    checkOutDate: '2026-11-04',
    nights: 3,
    guests: { adults: 2, children: 0, roomsCount: 1 },
    guestName: 'Praveen Kumar',
    guestEmail: 'praveen@luxehaven.com',
    specialRequests: 'High floor, feather pillows.',
    pricing: {
      ratePerNight: 850,
      roomCost: 2550,
      taxes: 306,
      serviceFee: 45,
      discount: 0,
      totalAmount: 2901
    },
    status: 'CONFIRMED',
    createdAt: '2026-10-15T12:00:00Z'
  },
  {
    id: 'res-102',
    bookingCode: 'LX-44129',
    hotelId: 'hotel-2',
    hotelName: 'Soneva Jani',
    hotelLocation: 'Noonu Atoll, Maldives',
    hotelImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
    roomId: 'room-2',
    roomName: 'Water Reserve with Slide',
    checkInDate: '2026-12-10',
    checkOutDate: '2026-12-15',
    nights: 5,
    guests: { adults: 2, children: 1, roomsCount: 1 },
    guestName: 'Praveen Kumar',
    guestEmail: 'praveen@luxehaven.com',
    specialRequests: 'Airport speedboat transfer.',
    pricing: {
      ratePerNight: 1200,
      roomCost: 6000,
      taxes: 720,
      serviceFee: 45,
      discount: 100,
      totalAmount: 6665
    },
    status: 'CANCELED',
    createdAt: '2026-10-10T09:30:00Z'
  }
];

describe('EXPERIMENT 1e: Reservation Confirmation & Cancellation Testing', () => {
  it('prompts user to sign in when unauthenticated', () => {
    const openAuthMock = vi.fn();
    renderWithProviders(<ReservationsView openAuthModal={openAuthMock} />, {
      preloadedState: {
        auth: { isAuthenticated: false, user: null, token: null },
        reservations: { items: [], loading: false, error: null }
      }
    });

    expect(screen.getByText(/authentication required to access reservations/i)).toBeInTheDocument();
  });

  it('renders list of confirmed and canceled reservations for authenticated user', async () => {
    renderWithProviders(<ReservationsView openAuthModal={vi.fn()} />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { name: 'Praveen Kumar' }, token: 'mock-jwt-token-valid-abc' },
        reservations: { items: mockReservations, loading: false, error: null }
      }
    });

    expect(screen.getByText(/LX-88910/)).toBeInTheDocument();
    expect(screen.getByText('The Ritz-Carlton Paris')).toBeInTheDocument();
    expect(screen.getByText(/LX-44129/)).toBeInTheDocument();
    expect(screen.getByText('Soneva Jani')).toBeInTheDocument();
  });

  it('filters reservations by status tabs (All, Confirmed, Canceled)', async () => {
    renderWithProviders(<ReservationsView openAuthModal={vi.fn()} />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { name: 'Praveen Kumar' }, token: 'mock-jwt-token-valid-abc' },
        reservations: { items: mockReservations, loading: false, error: null }
      }
    });

    // Click 'confirmed' tab
    const confirmedTab = screen.getByRole('button', { name: /^confirmed$/i });
    fireEvent.click(confirmedTab);

    expect(screen.getByText(/LX-88910/)).toBeInTheDocument();
    expect(screen.queryByText(/LX-44129/)).not.toBeInTheDocument();

    // Click 'canceled' tab
    const canceledTab = screen.getByRole('button', { name: /^canceled$/i });
    fireEvent.click(canceledTab);

    expect(screen.getByText(/LX-44129/)).toBeInTheDocument();
    expect(screen.queryByText(/LX-88910/)).not.toBeInTheDocument();
  });

  it('allows user to trigger cancellation on a confirmed booking', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { store } = renderWithProviders(<ReservationsView openAuthModal={vi.fn()} />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { name: 'Praveen Kumar' }, token: 'mock-jwt-token-valid-abc' },
        reservations: { items: mockReservations, loading: false, error: null }
      }
    });

    const cancelActionBtn = screen.getByRole('button', { name: /cancel \(delete\)/i });
    fireEvent.click(cancelActionBtn);

    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});

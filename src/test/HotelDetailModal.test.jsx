import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import HotelDetailModal from '../components/HotelDetailModal';

const mockSelectedHotel = {
  id: 'hotel-1',
  name: 'The Ritz-Carlton Paris',
  location: 'Paris, France',
  rating: 4.9,
  reviewCount: 342,
  description: 'An iconic palace hotel situated at Place Vendôme.',
  amenities: ['Free High-Speed Wi-Fi', 'Luxury Spa & Sauna'],
  images: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
  ],
  rooms: [
    {
      id: 'room-1',
      name: 'Prestige Paris Suite',
      pricePerNight: 850,
      sizeSqFt: 650,
      bedType: '1 King Bed',
      maxGuests: 2,
      features: ['Balcony with Garden View', 'Marble Bath']
    },
    {
      id: 'room-2',
      name: 'Imperial Presidential Suite',
      pricePerNight: 1650,
      sizeSqFt: 1200,
      bedType: '2 King Beds',
      maxGuests: 4,
      features: ['Private Butler Service', 'Panoramic View']
    }
  ]
};

describe('EXPERIMENT 1a & 1c: HotelDetailModal & Room Selection Testing', () => {
  it('does not render when no hotel is selected and not loading', () => {
    const { container } = renderWithProviders(<HotelDetailModal />, {
      preloadedState: {
        hotels: { selectedHotel: null, detailsLoading: false, detailsError: null }
      }
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders hotel details, description, amenities, and available rooms', () => {
    renderWithProviders(<HotelDetailModal />, {
      preloadedState: {
        hotels: { selectedHotel: mockSelectedHotel, detailsLoading: false, detailsError: null }
      }
    });

    expect(screen.getByText('The Ritz-Carlton Paris')).toBeInTheDocument();
    expect(screen.getByText(/An iconic palace hotel/i)).toBeInTheDocument();
    expect(screen.getByText('Prestige Paris Suite')).toBeInTheDocument();
    expect(screen.getByText('Imperial Presidential Suite')).toBeInTheDocument();
    expect(screen.getByText('$850')).toBeInTheDocument();
    expect(screen.getByText('$1650')).toBeInTheDocument();
  });

  it('allows user to select and book a specific room tier', () => {
    const { store } = renderWithProviders(<HotelDetailModal />, {
      preloadedState: {
        hotels: { selectedHotel: mockSelectedHotel, detailsLoading: false, detailsError: null }
      }
    });

    const bookSuiteButtons = screen.getAllByRole('button', { name: /select suite/i });
    expect(bookSuiteButtons.length).toBe(2);

    // Click the second suite (Imperial Presidential Suite)
    fireEvent.click(bookSuiteButtons[1]);

    const bookingState = store.getState().booking;
    expect(bookingState.isModalOpen).toBe(true);
    expect(bookingState.selectedHotel.id).toBe('hotel-1');
    expect(bookingState.selectedRoom.name).toBe('Imperial Presidential Suite');
    expect(bookingState.pricing.ratePerNight).toBe(1650);
  });

  it('renders loading skeleton when detailsLoading is true', () => {
    renderWithProviders(<HotelDetailModal />, {
      preloadedState: {
        hotels: { selectedHotel: null, detailsLoading: true, detailsError: null }
      }
    });

    expect(screen.getByText(/Fetching individual hotel and room specifications/i)).toBeInTheDocument();
  });

  it('renders error state when detailsError is set', () => {
    renderWithProviders(<HotelDetailModal />, {
      preloadedState: {
        hotels: { selectedHotel: null, detailsLoading: false, detailsError: 'Network 500 Failure' }
      }
    });

    expect(screen.getByText('API Fetch Error')).toBeInTheDocument();
    expect(screen.getByText('Network 500 Failure')).toBeInTheDocument();
  });
});

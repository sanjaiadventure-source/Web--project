import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import HotelCard from '../components/HotelCard';

const mockHotel = {
  id: 'hotel-1',
  name: 'The Ritz-Carlton Paris',
  location: 'Paris, France',
  rating: 4.9,
  reviewCount: 342,
  basePrice: 850,
  availableRooms: 5,
  featuredImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
  amenities: ['Free High-Speed Wi-Fi', 'Luxury Spa & Sauna'],
  rooms: [
    { id: 'room-1-1', name: 'Deluxe Suite', pricePerNight: 850 }
  ]
};

describe('EXPERIMENT 1a: HotelCard Component Testing', () => {
  it('renders hotel details including name, location, price, and rating', () => {
    renderWithProviders(<HotelCard hotel={mockHotel} />);

    expect(screen.getByText('The Ritz-Carlton Paris')).toBeInTheDocument();
    expect(screen.getByText('Paris, France')).toBeInTheDocument();
    expect(screen.getByText('$850')).toBeInTheDocument();
    expect(screen.getByText(/4.9/)).toBeInTheDocument();
    expect(screen.getByText(/5 Suites Left/i)).toBeInTheDocument();
  });

  it('displays "Fully Booked" badge when availableRooms is 0', () => {
    const soldOutHotel = { ...mockHotel, availableRooms: 0 };
    renderWithProviders(<HotelCard hotel={soldOutHotel} />);

    expect(screen.getByText(/Fully Booked/i)).toBeInTheDocument();
  });

  it('opens booking modal when Book button is clicked', () => {
    const { store } = renderWithProviders(<HotelCard hotel={mockHotel} />);

    const bookBtn = screen.getByRole('button', { name: /book suite at the ritz-carlton paris/i });
    fireEvent.click(bookBtn);

    const bookingState = store.getState().booking;
    expect(bookingState.isModalOpen).toBe(true);
    expect(bookingState.selectedHotel.id).toBe('hotel-1');
  });

  it('triggers hotel details fetch when Details button is clicked', () => {
    const { store } = renderWithProviders(<HotelCard hotel={mockHotel} />);

    const detailsBtn = screen.getByRole('button', { name: /view details for the ritz-carlton paris/i });
    fireEvent.click(detailsBtn);

    const hotelsState = store.getState().hotels;
    expect(hotelsState.detailsLoading).toBe(true);
  });
});

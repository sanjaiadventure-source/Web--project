import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import HeroSearch from '../components/HeroSearch';
import FilterSidebar from '../components/FilterSidebar';

describe('EXPERIMENT 1b: Hotel Search & Filtering Testing', () => {
  it('renders search input and updates text', () => {
    renderWithProviders(<HeroSearch />);

    const searchInput = screen.getByPlaceholderText(/e\.g\. ritz-carlton/i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Paris' } });
    expect(searchInput.value).toBe('Paris');
  });

  it('updates location filter when popular location pills are clicked', () => {
    const { store } = renderWithProviders(<HeroSearch />);

    const parisPill = screen.getByRole('button', { name: 'Paris' });
    fireEvent.click(parisPill);

    const hotelsState = store.getState().hotels;
    expect(hotelsState.filters.location).toBe('Paris');

    const maldivesPill = screen.getByRole('button', { name: 'Maldives' });
    fireEvent.click(maldivesPill);

    expect(store.getState().hotels.filters.location).toBe('Maldives');
  });

  it('FilterSidebar updates star rating filter', () => {
    const { store } = renderWithProviders(<FilterSidebar />);

    const ratingBtn = screen.getByRole('button', { name: /minimum 4.8 stars/i });
    fireEvent.click(ratingBtn);

    expect(store.getState().hotels.filters.rating).toBe(4.8);
  });

  it('FilterSidebar resets all filters when Reset button is clicked', () => {
    const { store } = renderWithProviders(<FilterSidebar />, {
      preloadedState: {
        hotels: {
          filters: {
            search: 'Kyoto',
            location: 'Kyoto',
            minPrice: 500,
            maxPrice: 1500,
            rating: 4.8,
            amenity: 'Spa',
            onlyAvailable: true,
            sortBy: 'price-low'
          }
        }
      }
    });

    const resetBtn = screen.getByRole('button', { name: /reset all filters/i });
    fireEvent.click(resetBtn);

    const filters = store.getState().hotels.filters;
    expect(filters.location).toBe('all');
    expect(filters.rating).toBe(0);
    expect(filters.search).toBe('');
  });
});

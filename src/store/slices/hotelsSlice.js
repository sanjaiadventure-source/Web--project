import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// ============================================================================
// EXPERIMENT 1a, 1b, 1c: Fetch hotels with search, location, and filters
// ============================================================================
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (filterParams = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/hotels', { params: filterParams });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch hotels';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// EXPERIMENT 1d: Fetch individual hotel details
// ============================================================================
export const fetchHotelDetails = createAsyncThunk(
  'hotels/fetchHotelDetails',
  async (hotelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/hotels/${hotelId}`);
      return response.data.hotel;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch hotel details';
      return rejectWithValue(message);
    }
  }
);

// EXPERIMENT 1d: Fetch individual room details
export const fetchRoomDetails = createAsyncThunk(
  'hotels/fetchRoomDetails',
  async ({ hotelId, roomId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/hotels/${hotelId}/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch room details';
      return rejectWithValue(message);
    }
  }
);

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState: {
    items: [],
    totalCount: 0,
    selectedHotel: null,
    selectedRoom: null,
    loading: false,
    detailsLoading: false,
    error: null,
    detailsError: null,
    filters: {
      search: '',
      location: 'all',
      minPrice: 0,
      maxPrice: 2000,
      rating: 0,
      amenity: 'all',
      onlyAvailable: false,
      sortBy: 'recommended' // 'recommended', 'price-low', 'price-high', 'rating'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        location: 'all',
        minPrice: 0,
        maxPrice: 2000,
        rating: 0,
        amenity: 'all',
        onlyAvailable: false,
        sortBy: 'recommended'
      };
    },
    setSelectedHotel: (state, action) => {
      state.selectedHotel = action.payload;
    },
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
      state.selectedRoom = null;
      state.detailsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels list
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.hotels || [];
        state.totalCount = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while loading hotels.';
      })
      // Fetch Hotel Details
      .addCase(fetchHotelDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchHotelDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedHotel = action.payload;
        state.detailsError = null;
      })
      .addCase(fetchHotelDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || 'Failed to load hotel specifications.';
      })
      // Fetch Room Details
      .addCase(fetchRoomDetails.fulfilled, (state, action) => {
        state.selectedRoom = action.payload.room;
      });
  }
});

export const {
  setFilters,
  resetFilters,
  setSelectedHotel,
  setSelectedRoom,
  clearSelectedHotel
} = hotelsSlice.actions;

export default hotelsSlice.reducer;

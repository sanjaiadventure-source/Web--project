import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// ============================================================================
// EXPERIMENT 3e: Retrieve reservation history using GET
// ============================================================================
export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/reservations');
      return response.data.reservations;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch reservations';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// EXPERIMENT 3b: Create a hotel reservation using POST
// ============================================================================
export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (reservationPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/reservations', reservationPayload);
      return response.data.reservation;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create reservation';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// EXPERIMENT 3c: Update reservation details using PUT / PATCH
// ============================================================================
export const updateReservation = createAsyncThunk(
  'reservations/updateReservation',
  async ({ reservationId, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/reservations/${reservationId}`, updateData);
      return response.data.reservation;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update reservation';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// EXPERIMENT 3d: Cancel a reservation using DELETE
// ============================================================================
export const cancelReservation = createAsyncThunk(
  'reservations/cancelReservation',
  async (reservationId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/reservations/${reservationId}`);
      return { reservationId, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to cancel reservation';
      return rejectWithValue(message);
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: {
    items: [],
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
    editingReservation: null,
    isEditModalOpen: false
  },
  reducers: {
    clearReservationFeedback: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setEditingReservation: (state, action) => {
      state.editingReservation = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.editingReservation = null;
      state.isEditModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET: fetchReservations
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // POST: createReservation
      .addCase(createReservation.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
        state.successMessage = `Reservation ${action.payload.bookingCode} confirmed successfully!`;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // PUT: updateReservation
      .addCase(updateReservation.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.isEditModalOpen = false;
        state.editingReservation = null;
        state.successMessage = `Reservation ${action.payload.bookingCode} was updated successfully!`;
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // DELETE: cancelReservation
      .addCase(cancelReservation.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex(r => r.id === action.payload.reservationId);
        if (index !== -1) {
          state.items[index].status = 'CANCELED';
        }
        state.successMessage = 'Reservation canceled and refund recorded.';
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearReservationFeedback, setEditingReservation, closeEditModal } = reservationsSlice.actions;
export default reservationsSlice.reducer;

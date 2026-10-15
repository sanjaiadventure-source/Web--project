import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

// Safe localStorage rehydration
const loadInitialAuth = () => {
  try {
    const token = JSON.parse(localStorage.getItem('luxehaven_auth_token_v1') || 'null');
    const user = JSON.parse(localStorage.getItem('luxehaven_auth_user_v1') || 'null');
    return {
      token,
      user,
      isAuthenticated: !!token
    };
  } catch {
    return {
      token: null,
      user: null,
      isAuthenticated: false
    };
  }
};

const initialAuth = loadInitialAuth();

// ============================================================================
// EXPERIMENT 4a: User Authentication Using Login API
// ============================================================================
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// EXPERIMENT 4e: Logout Functionality
// ============================================================================
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/api/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialAuth.user,
    token: initialAuth.token,
    isAuthenticated: initialAuth.isAuthenticated,
    loading: false,
    error: null,
    sessionExpiredNotice: false,
    sessionExpiredMessage: ''
  },
  reducers: {
    // EXPERIMENT 4b: Secure Storage Sync
    clearAuthSession: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('luxehaven_auth_token_v1');
      localStorage.removeItem('luxehaven_auth_user_v1');
    },
    // EXPERIMENT 4f: Handle Expired Token notification
    triggerSessionExpired: (state, action) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.sessionExpiredNotice = true;
      state.sessionExpiredMessage = action.payload || 'Your session has expired. Please log in again to continue.';
      localStorage.removeItem('luxehaven_auth_token_v1');
      localStorage.removeItem('luxehaven_auth_user_v1');
    },
    dismissSessionNotice: (state) => {
      state.sessionExpiredNotice = false;
      state.sessionExpiredMessage = '';
    },
    // Fast switch demo accounts for evaluator convenience
    setDemoAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      state.sessionExpiredNotice = false;
      localStorage.setItem('luxehaven_auth_token_v1', JSON.stringify(token));
      localStorage.setItem('luxehaven_auth_user_v1', JSON.stringify(user));
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.sessionExpiredNotice = false;
        // EXPERIMENT 4b: Securely store token
        localStorage.setItem('luxehaven_auth_token_v1', JSON.stringify(action.payload.token));
        localStorage.setItem('luxehaven_auth_user_v1', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Authentication failed.';
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('luxehaven_auth_token_v1');
        localStorage.removeItem('luxehaven_auth_user_v1');
      });
  }
});

export const { clearAuthSession, triggerSessionExpired, dismissSessionNotice, setDemoAuth } = authSlice.actions;
export default authSlice.reducer;

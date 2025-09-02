/**
 * Authentication Redux slice
 * Manages authentication state including user data, tokens, and login status
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../Api/authApi';
import type { AuthState, User } from '../Interface';

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Load persisted auth data from localStorage on app initialization
 */
const loadPersistedAuthData = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem('marma_auth_token');
    const userData = localStorage.getItem('marma_user_data');
    
    if (token && userData) {
      return {
        token,
        user: JSON.parse(userData),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading persisted auth data:', error);
    // Clear corrupted data
    localStorage.removeItem('marma_auth_token');
    localStorage.removeItem('marma_user_data');
  }
  
  return {};
};

/**
 * Authentication slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    ...loadPersistedAuthData(),
  },
  reducers: {
    /**
     * Clear authentication state and localStorage
     */
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('marma_auth_token');
      localStorage.removeItem('marma_user_data');
    },

    /**
     * Set authentication error
     */
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear authentication error
     */
    clearAuthError: (state) => {
      state.error = null;
    },

    /**
     * Update user data without full re-authentication
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        localStorage.setItem('marma_user_data', JSON.stringify(state.user));
      }
    },

    /**
     * Set loading state
     */
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle login mutation
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        if (action.payload.success) {
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Handle logout mutation
    builder
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if logout fails on server, clear local state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });

    // Handle getCurrentUser query
    builder
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.success) {
          state.user = action.payload.data;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state, action) => {
        state.isLoading = false;
        
        // If user query fails, likely token is invalid
        if (action.error.status === 401) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('marma_auth_token');
          localStorage.removeItem('marma_user_data');
        }
        
        state.error = action.error.message || 'Failed to fetch user data';
      });

    // Handle token refresh
    builder
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
        if (action.payload.success) {
          state.token = action.payload.data.token;
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state) => {
        // Refresh failed, clear auth state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('marma_auth_token');
        localStorage.removeItem('marma_user_data');
      });

    // Handle password change
    builder
      .addMatcher(authApi.endpoints.changePassword.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.changePassword.matchFulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.changePassword.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to change password';
      });
  },
});

// Export actions
export const {
  clearAuth,
  setAuthError,
  clearAuthError,
  updateUser,
  setAuthLoading,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

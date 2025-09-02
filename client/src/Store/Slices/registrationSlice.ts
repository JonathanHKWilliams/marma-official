/**
 * Registration Redux slice
 * Manages registration state including filters, current registration, and UI state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { registrationApi } from '../Api/registrationApi';
import type { RegistrationState, Registration, RegistrationFilters, RegistrationStats } from '../Interface';

/**
 * Initial registration state
 */
const initialState: RegistrationState = {
  registrations: [],
  currentRegistration: null,
  filters: {
    country: '',
    status: '',
    dateRange: { start: '', end: '' },
    search: '',
    page: 1,
    limit: 20,
  },
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Registration slice
 */
const registrationSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    /**
     * Update registration filters
     */
    setFilters: (state, action: PayloadAction<Partial<RegistrationFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      if (action.payload.country || action.payload.status || action.payload.search || action.payload.dateRange) {
        state.filters.page = 1;
      }
    },

    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.filters = {
        country: '',
        status: '',
        dateRange: { start: '', end: '' },
        search: '',
        page: 1,
        limit: 20,
      };
    },

    /**
     * Set current registration for detailed view
     */
    setCurrentRegistration: (state, action: PayloadAction<Registration | null>) => {
      state.currentRegistration = action.payload;
    },

    /**
     * Update a specific registration in the list
     */
    updateRegistrationInList: (state, action: PayloadAction<Registration>) => {
      const index = state.registrations.findIndex(reg => reg.id === action.payload.id);
      if (index !== -1) {
        state.registrations[index] = action.payload;
      }
    },

    /**
     * Remove a registration from the list
     */
    removeRegistrationFromList: (state, action: PayloadAction<string>) => {
      state.registrations = state.registrations.filter(reg => reg.id !== action.payload);
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set page number for pagination
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },

    /**
     * Set items per page
     */
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset to first page
    },

    /**
     * Update last updated timestamp
     */
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Handle getRegistrations query
    builder
      .addMatcher(registrationApi.endpoints.getRegistrations.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(registrationApi.endpoints.getRegistrations.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        if (action.payload.success) {
          state.registrations = action.payload.data.registrations;
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addMatcher(registrationApi.endpoints.getRegistrations.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch registrations';
      });

    // Handle getRegistrationStats query
    builder
      .addMatcher(registrationApi.endpoints.getRegistrationStats.matchFulfilled, (state, action) => {
        if (action.payload.success) {
          state.stats = action.payload.data;
        }
      })
      .addMatcher(registrationApi.endpoints.getRegistrationStats.matchRejected, (state, action) => {
        console.error('Failed to fetch registration stats:', action.error.message);
      });

    // Handle createRegistration mutation
    builder
      .addMatcher(registrationApi.endpoints.createRegistration.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(registrationApi.endpoints.createRegistration.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        if (action.payload.success) {
          // Add new registration to the beginning of the list
          state.registrations.unshift(action.payload.data);
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addMatcher(registrationApi.endpoints.createRegistration.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create registration';
      });

    // Handle updateRegistration mutation
    builder
      .addMatcher(registrationApi.endpoints.updateRegistration.matchPending, (state) => {
        state.error = null;
      })
      .addMatcher(registrationApi.endpoints.updateRegistration.matchFulfilled, (state, action) => {
        state.error = null;
        
        if (action.payload.success) {
          // Update registration in the list
          const index = state.registrations.findIndex(reg => reg.id === action.payload.data.id);
          if (index !== -1) {
            state.registrations[index] = action.payload.data;
          }
          
          // Update current registration if it's the same one
          if (state.currentRegistration?.id === action.payload.data.id) {
            state.currentRegistration = action.payload.data;
          }
          
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addMatcher(registrationApi.endpoints.updateRegistration.matchRejected, (state, action) => {
        state.error = action.error.message || 'Failed to update registration';
      });

    // Handle deleteRegistration mutation
    builder
      .addMatcher(registrationApi.endpoints.deleteRegistration.matchFulfilled, (state, action) => {
        // Remove registration from list
        const registrationId = action.meta.arg.originalArgs;
        state.registrations = state.registrations.filter(reg => reg.id !== registrationId);
        
        // Clear current registration if it was deleted
        if (state.currentRegistration?.id === registrationId) {
          state.currentRegistration = null;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addMatcher(registrationApi.endpoints.deleteRegistration.matchRejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete registration';
      });

    // Handle bulkUpdateRegistrations mutation
    builder
      .addMatcher(registrationApi.endpoints.bulkUpdateRegistrations.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(registrationApi.endpoints.bulkUpdateRegistrations.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        if (action.payload.success) {
          // Update multiple registrations in the list
          action.payload.data.forEach(updatedReg => {
            const index = state.registrations.findIndex(reg => reg.id === updatedReg.id);
            if (index !== -1) {
              state.registrations[index] = updatedReg;
            }
          });
          
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addMatcher(registrationApi.endpoints.bulkUpdateRegistrations.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to bulk update registrations';
      });

    // Handle getRegistrationById query
    builder
      .addMatcher(registrationApi.endpoints.getRegistrationById.matchFulfilled, (state, action) => {
        if (action.payload.success) {
          state.currentRegistration = action.payload.data;
        }
      })
      .addMatcher(registrationApi.endpoints.getRegistrationById.matchRejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch registration details';
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setCurrentRegistration,
  updateRegistrationInList,
  removeRegistrationFromList,
  setLoading,
  setError,
  clearError,
  setPage,
  setLimit,
  updateLastUpdated,
} = registrationSlice.actions;

// Export reducer
export default registrationSlice.reducer;

// Selectors
export const selectRegistrations = (state: { registrations: RegistrationState }) => state.registrations.registrations;
export const selectCurrentRegistration = (state: { registrations: RegistrationState }) => state.registrations.currentRegistration;
export const selectRegistrationFilters = (state: { registrations: RegistrationState }) => state.registrations.filters;
export const selectRegistrationStats = (state: { registrations: RegistrationState }) => state.registrations.stats;
export const selectRegistrationLoading = (state: { registrations: RegistrationState }) => state.registrations.isLoading;
export const selectRegistrationError = (state: { registrations: RegistrationState }) => state.registrations.error;
export const selectRegistrationLastUpdated = (state: { registrations: RegistrationState }) => state.registrations.lastUpdated;

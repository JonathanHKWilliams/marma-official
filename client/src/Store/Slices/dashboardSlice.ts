/**
 * Dashboard Redux slice
 * Manages dashboard state including analytics data, notifications, and system health
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dashboardApi } from '../Api/dashboardApi';
import type { DashboardState, DashboardData, Notification } from '../Interface';

/**
 * Initial dashboard state
 */
const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
  lastRefresh: null,
};

/**
 * Dashboard slice
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
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
     * Update last refresh timestamp
     */
    updateLastRefresh: (state) => {
      state.lastRefresh = new Date().toISOString();
    },

    /**
     * Update notifications in dashboard data
     */
    updateNotifications: (state, action: PayloadAction<Notification[]>) => {
      if (state.data) {
        state.data.notifications = action.payload;
      }
    },

    /**
     * Mark notification as read in dashboard data
     */
    markNotificationRead: (state, action: PayloadAction<string>) => {
      if (state.data?.notifications) {
        const notification = state.data.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.isRead = true;
        }
      }
    },

    /**
     * Remove notification from dashboard data
     */
    removeNotification: (state, action: PayloadAction<string>) => {
      if (state.data?.notifications) {
        state.data.notifications = state.data.notifications.filter(n => n.id !== action.payload);
      }
    },

    /**
     * Clear dashboard data
     */
    clearDashboardData: (state) => {
      state.data = null;
      state.lastRefresh = null;
    },
  },
  extraReducers: (builder) => {
    // Handle getDashboardData query
    builder
      .addMatcher(dashboardApi.endpoints.getDashboardData.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(dashboardApi.endpoints.getDashboardData.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        if (action.payload.success) {
          state.data = action.payload.data;
          state.lastRefresh = new Date().toISOString();
        }
      })
      .addMatcher(dashboardApi.endpoints.getDashboardData.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });

    // Handle getNotifications query
    builder
      .addMatcher(dashboardApi.endpoints.getNotifications.matchFulfilled, (state, action) => {
        if (action.payload.success && state.data) {
          state.data.notifications = action.payload.data;
        }
      });

    // Handle markNotificationAsRead mutation
    builder
      .addMatcher(dashboardApi.endpoints.markNotificationAsRead.matchFulfilled, (state, action) => {
        const notificationId = action.meta.arg.originalArgs;
        if (state.data?.notifications) {
          const notification = state.data.notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.isRead = true;
          }
        }
      });

    // Handle markAllNotificationsAsRead mutation
    builder
      .addMatcher(dashboardApi.endpoints.markAllNotificationsAsRead.matchFulfilled, (state) => {
        if (state.data?.notifications) {
          state.data.notifications.forEach(notification => {
            notification.isRead = true;
          });
        }
      });

    // Handle deleteNotification mutation
    builder
      .addMatcher(dashboardApi.endpoints.deleteNotification.matchFulfilled, (state, action) => {
        const notificationId = action.meta.arg.originalArgs;
        if (state.data?.notifications) {
          state.data.notifications = state.data.notifications.filter(n => n.id !== notificationId);
        }
      });

    // Handle getSystemHealth query
    builder
      .addMatcher(dashboardApi.endpoints.getSystemHealth.matchFulfilled, (state, action) => {
        if (action.payload.success && state.data) {
          state.data.systemHealth = action.payload.data;
        }
      });

    // Handle createNotification mutation
    builder
      .addMatcher(dashboardApi.endpoints.createNotification.matchFulfilled, (state, action) => {
        if (action.payload.success && state.data?.notifications) {
          state.data.notifications.unshift(action.payload.data);
        }
      });
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  updateLastRefresh,
  updateNotifications,
  markNotificationRead,
  removeNotification,
  clearDashboardData,
} = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;

// Selectors
export const selectDashboardData = (state: { dashboard: DashboardState }) => state.dashboard.data;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;
export const selectDashboardLastRefresh = (state: { dashboard: DashboardState }) => state.dashboard.lastRefresh;
export const selectDashboardNotifications = (state: { dashboard: DashboardState }) => state.dashboard.data?.notifications || [];
export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.data?.stats;
export const selectSystemHealth = (state: { dashboard: DashboardState }) => state.dashboard.data?.systemHealth;

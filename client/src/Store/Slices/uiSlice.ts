/**
 * UI Redux slice
 * Manages global UI state including sidebar, modals, notifications, and app-wide UI preferences
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, Notification } from '../Interface';

/**
 * Initial UI state
 */
const initialState: UIState = {
  sidebarCollapsed: false,
  activeTab: 'dashboard',
  showFilters: false,
  notifications: [],
  isOnline: navigator.onLine,
};

/**
 * UI slice
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      // Persist sidebar state to localStorage
      localStorage.setItem('marma_sidebar_collapsed', state.sidebarCollapsed.toString());
    },

    /**
     * Set sidebar collapsed state
     */
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('marma_sidebar_collapsed', action.payload.toString());
    },

    /**
     * Set active tab
     */
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
      // Persist active tab to localStorage
      localStorage.setItem('marma_active_tab', action.payload);
    },

    /**
     * Toggle filters visibility
     */
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },

    /**
     * Set filters visibility
     */
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },

    /**
     * Add a UI notification (toast)
     */
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      state.notifications.unshift(notification);
      
      // Limit to 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },

    /**
     * Remove a UI notification
     */
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    /**
     * Clear all UI notifications
     */
    clearNotifications: (state) => {
      state.notifications = [];
    },

    /**
     * Mark notification as read
     */
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },

    /**
     * Set online/offline status
     */
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    /**
     * Load persisted UI preferences
     */
    loadPersistedUIState: (state) => {
      try {
        const sidebarCollapsed = localStorage.getItem('marma_sidebar_collapsed');
        const activeTab = localStorage.getItem('marma_active_tab');
        
        if (sidebarCollapsed !== null) {
          state.sidebarCollapsed = sidebarCollapsed === 'true';
        }
        
        if (activeTab) {
          state.activeTab = activeTab;
        }
      } catch (error) {
        console.error('Error loading persisted UI state:', error);
      }
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarCollapsed,
  setActiveTab,
  toggleFilters,
  setShowFilters,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  setOnlineStatus,
  loadPersistedUIState,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;

// Selectors
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectActiveTab = (state: { ui: UIState }) => state.ui.activeTab;
export const selectShowFilters = (state: { ui: UIState }) => state.ui.showFilters;
export const selectUINotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectIsOnline = (state: { ui: UIState }) => state.ui.isOnline;
export const selectUnreadNotificationsCount = (state: { ui: UIState }) => 
  state.ui.notifications.filter(n => !n.isRead).length;

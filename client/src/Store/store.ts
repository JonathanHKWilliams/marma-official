/**
 * Redux Store Configuration with RTK Query
 * Central store setup for the MARMA application with API integration
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './Api/authApi';
import { registrationApi } from './Api/registrationApi';
import { dashboardApi } from './Api/dashboardApi';
import authSlice from './Slices/authSlice';
import registrationSlice from './Slices/registrationSlice';
import dashboardSlice from './Slices/dashboardSlice';
import uiSlice from './Slices/uiSlice';

/**
 * Configure the Redux store with RTK Query APIs and slices
 */
export const store = configureStore({
  reducer: {
    // API slices
    [authApi.reducerPath]: authApi.reducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    
    // State slices
    auth: authSlice,
    registrations: registrationSlice,
    dashboard: dashboardSlice,
    ui: uiSlice,
  },
  
  // Adding the API middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for RTK Query actions
      serializableCheck: {
        ignoredActions: [
          // RTK Query actions
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(
      authApi.middleware,
      registrationApi.middleware,
      dashboardApi.middleware
    ),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional: Set up listeners for automatic refetching
setupListeners(store.dispatch);

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store as default
export default store;

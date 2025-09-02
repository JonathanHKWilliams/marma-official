/**
 * Redux hooks and utilities
 * Provides typed hooks for Redux store access and common authentication utilities
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from './store';
import { useLoginMutation, useGetCurrentUserQuery } from './Api/authApi';
import { clearAuth, setAuthError } from './Slices/authSlice';
import { loadPersistedUIState } from './Slices/uiSlice';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Authentication hook that replaces the old AuthContext
 * Provides authentication state and methods
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  
  // RTK Query hooks
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const { 
    data: currentUserData, 
    isLoading: isUserLoading, 
    error: userError 
  } = useGetCurrentUserQuery(undefined, {
    skip: !authState.token, // Only fetch if we have a token
  });

  /**
   * Login function
   * @param email - User email
   * @param password - User password
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const result = await loginMutation({ email, password }).unwrap();
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || error.message || 'Login failed';
      dispatch(setAuthError(errorMessage));
      throw new Error(errorMessage);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    dispatch(clearAuth());
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = authState.isAuthenticated && !!authState.user;

  /**
   * Check if authentication is loading
   */
  const isLoading = isLoginLoading || isUserLoading || authState.isLoading;

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated,
    isLoading,
    error: authState.error,
    login,
    logout,
  };
};

/**
 * Hook to initialize the application
 * Loads persisted state and sets up event listeners
 */
export const useAppInitialization = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load persisted UI state
    dispatch(loadPersistedUIState());

    // Set up online/offline event listeners
    const handleOnline = () => {
      dispatch({ type: 'ui/setOnlineStatus', payload: true });
    };

    const handleOffline = () => {
      dispatch({ type: 'ui/setOnlineStatus', payload: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);
};

/**
 * Hook for managing UI notifications
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  const addNotification = (notification: {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    expiresAt?: string;
  }) => {
    dispatch({
      type: 'ui/addNotification',
      payload: notification,
    });
  };

  const removeNotification = (id: string) => {
    dispatch({
      type: 'ui/removeNotification',
      payload: id,
    });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'ui/clearNotifications' });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};

/**
 * Hook for managing registration filters and state
 */
export const useRegistrationFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.registrations.filters);

  const setFilters = (newFilters: Partial<typeof filters>) => {
    dispatch({
      type: 'registrations/setFilters',
      payload: newFilters,
    });
  };

  const clearFilters = () => {
    dispatch({ type: 'registrations/clearFilters' });
  };

  const setPage = (page: number) => {
    dispatch({
      type: 'registrations/setPage',
      payload: page,
    });
  };

  return {
    filters,
    setFilters,
    clearFilters,
    setPage,
  };
};

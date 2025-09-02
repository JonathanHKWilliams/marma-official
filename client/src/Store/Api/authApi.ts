/**
 * Authentication API slice using RTK Query
 * Handles all authentication-related API calls and caching
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type { 
  LoginRequest, 
  AuthResponse, 
  User, 
  ApiResponse 
} from '../Interface';

// Base query configuration with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = (getState() as RootState).auth.token;
    
    // Set content type
    headers.set('Content-Type', 'application/json');
    
    // Add authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

/**
 * Enhanced base query with automatic token refresh and error handling
 */
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 Unauthorized responses
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: {
          refreshToken: (api.getState() as RootState).auth.token,
        },
      },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      // Store new token and retry original request
      api.dispatch(authApi.util.upsertQueryData('getCurrentUser', undefined, refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      api.dispatch(authApi.util.resetApiState());
    }
  }
  
  return result;
};

/**
 * Authentication API slice
 */
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    
    /**
     * Login endpoint
     * @param credentials - Email and password
     * @returns Authentication response with user data and token
     */
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
      transformResponse: (response: ApiResponse<AuthResponse>) => {
        // Store token in localStorage for persistence
        if (response.success && response.data.token) {
          localStorage.setItem('marma_auth_token', response.data.token);
          localStorage.setItem('marma_user_data', JSON.stringify(response.data.user));
        }
        return response;
      },
      transformErrorResponse: (response: any) => {
        return {
          success: false,
          message: response.data?.message || 'Login failed',
          errors: response.data?.errors || [],
        };
      },
    }),

    /**
     * Logout endpoint
     * Clears server-side session and local storage
     */
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          // Clear local storage regardless of API response
          localStorage.removeItem('marma_auth_token');
          localStorage.removeItem('marma_user_data');
          
          // Reset all API state
          dispatch(authApi.util.resetApiState());
        }
      },
    }),

    /**
     * Get current authenticated user
     * @returns Current user data
     */
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
      transformResponse: (response: ApiResponse<User>) => response,
      transformErrorResponse: (response: any) => ({
        success: false,
        message: response.data?.message || 'Failed to fetch user data',
        errors: response.data?.errors || [],
      }),
    }),

    /**
     * Refresh authentication token
     * @param refreshToken - Current refresh token
     * @returns New authentication response
     */
    refreshToken: builder.mutation<ApiResponse<AuthResponse>, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: ApiResponse<AuthResponse>) => {
        // Update stored token
        if (response.success && response.data.token) {
          localStorage.setItem('marma_auth_token', response.data.token);
          localStorage.setItem('marma_user_data', JSON.stringify(response.data.user));
        }
        return response;
      },
    }),

    /**
     * Change password endpoint
     * @param passwordData - Current and new password
     */
    changePassword: builder.mutation<ApiResponse<void>, {
      currentPassword: string;
      newPassword: string;
    }>({
      query: (passwordData) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: passwordData,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Request password reset
     * @param email - User email address
     */
    requestPasswordReset: builder.mutation<ApiResponse<void>, { email: string }>({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    /**
     * Reset password with token
     * @param resetData - Reset token and new password
     */
    resetPassword: builder.mutation<ApiResponse<void>, {
      token: string;
      newPassword: string;
    }>({
      query: (resetData) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: resetData,
      }),
    }),

    /**
     * Verify authentication token
     * Used to check if current token is still valid
     */
    verifyToken: builder.query<ApiResponse<{ valid: boolean }>, void>({
      query: () => '/auth/verify',
      providesTags: ['Auth'],
    }),

  }),
});

// Export hooks for use in components
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useVerifyTokenQuery,
} = authApi;

/**
 * Registration API slice using RTK Query
 * Handles all registration-related API calls, caching, and data management
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  Registration,
  CreateRegistrationRequest,
  UpdateRegistrationRequest,
  RegistrationListResponse,
  RegistrationFilters,
  RegistrationStats,
  ApiResponse,
  ExportRequest,
  ExportResponse,
} from '../Interface';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Registration API slice
 */
export const registrationApi = createApi({
  reducerPath: 'registrationApi',
  baseQuery,
  tagTypes: ['Registration', 'RegistrationStats', 'RegistrationList'],
  endpoints: (builder) => ({

    /**
     * Create a new registration
     * @param registrationData - Complete registration form data
     * @returns Created registration with generated IDs
     */
    createRegistration: builder.mutation<ApiResponse<Registration>, CreateRegistrationRequest>({
      query: (registrationData) => ({
        url: '/registrations',
        method: 'POST',
        body: registrationData,
      }),
      invalidatesTags: ['RegistrationList', 'RegistrationStats'],
      transformResponse: (response: ApiResponse<Registration>) => response,
      transformErrorResponse: (response: any) => ({
        success: false,
        message: response.data?.message || 'Failed to create registration',
        errors: response.data?.errors || [],
      }),
    }),

    /**
     * Get paginated list of registrations with filtering
     * @param filters - Filter criteria including pagination, search, status, etc.
     * @returns Paginated list of registrations
     */
    getRegistrations: builder.query<ApiResponse<RegistrationListResponse>, RegistrationFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        // Add filter parameters
        if (filters.country) params.append('country', filters.country);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start);
        if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end);

        return `/registrations?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data.registrations
          ? [
              ...result.data.registrations.map(({ id }) => ({ type: 'Registration' as const, id })),
              { type: 'RegistrationList', id: 'LIST' },
            ]
          : [{ type: 'RegistrationList', id: 'LIST' }],
      transformResponse: (response: ApiResponse<RegistrationListResponse>) => response,
      // Keep cached data for 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * Get a single registration by ID
     * @param id - Registration ID
     * @returns Registration details
     */
    getRegistrationById: builder.query<ApiResponse<Registration>, string>({
      query: (id) => `/registrations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Registration', id }],
      transformResponse: (response: ApiResponse<Registration>) => response,
    }),

    /**
     * Update registration status and details
     * @param updateData - Registration ID and update fields
     * @returns Updated registration
     */
    updateRegistration: builder.mutation<ApiResponse<Registration>, UpdateRegistrationRequest>({
      query: ({ id, ...updateData }) => ({
        url: `/registrations/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Registration', id },
        { type: 'RegistrationList', id: 'LIST' },
        'RegistrationStats',
      ],
      transformResponse: (response: ApiResponse<Registration>) => response,
    }),

    /**
     * Delete a registration
     * @param id - Registration ID to delete
     */
    deleteRegistration: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/registrations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Registration', id },
        { type: 'RegistrationList', id: 'LIST' },
        'RegistrationStats',
      ],
    }),

    /**
     * Get registration statistics
     * @returns Comprehensive registration statistics
     */
    getRegistrationStats: builder.query<ApiResponse<RegistrationStats>, void>({
      query: () => '/registrations/stats',
      providesTags: ['RegistrationStats'],
      transformResponse: (response: ApiResponse<RegistrationStats>) => response,
      // Refresh stats every 2 minutes
      keepUnusedDataFor: 120,
    }),

    /**
     * Bulk update multiple registrations
     * @param updates - Array of registration updates
     */
    bulkUpdateRegistrations: builder.mutation<ApiResponse<Registration[]>, {
      ids: string[];
      updates: Partial<UpdateRegistrationRequest>;
    }>({
      query: ({ ids, updates }) => ({
        url: '/registrations/bulk-update',
        method: 'PUT',
        body: { ids, updates },
      }),
      invalidatesTags: ['RegistrationList', 'RegistrationStats'],
    }),

    /**
     * Export registrations to various formats
     * @param exportConfig - Export configuration (format, filters, fields)
     * @returns Download URL and file information
     */
    exportRegistrations: builder.mutation<ApiResponse<ExportResponse>, ExportRequest>({
      query: (exportConfig) => ({
        url: '/registrations/export',
        method: 'POST',
        body: exportConfig,
      }),
      transformResponse: (response: ApiResponse<ExportResponse>) => response,
    }),

    /**
     * Get registrations by country
     * @param country - Country name
     * @returns List of registrations from specified country
     */
    getRegistrationsByCountry: builder.query<ApiResponse<Registration[]>, string>({
      query: (country) => `/registrations/country/${encodeURIComponent(country)}`,
      providesTags: (result, error, country) => [
        { type: 'RegistrationList', id: `country-${country}` },
      ],
    }),

    /**
     * Get recent registrations
     * @param limit - Number of recent registrations to fetch
     * @returns Most recent registrations
     */
    getRecentRegistrations: builder.query<ApiResponse<Registration[]>, number>({
      query: (limit = 10) => `/registrations/recent?limit=${limit}`,
      providesTags: [{ type: 'RegistrationList', id: 'recent' }],
      // Refresh recent registrations every minute
      keepUnusedDataFor: 60,
    }),

    /**
     * Search registrations with advanced criteria
     * @param searchQuery - Advanced search parameters
     * @returns Matching registrations
     */
    searchRegistrations: builder.query<ApiResponse<Registration[]>, {
      query: string;
      filters?: RegistrationFilters;
    }>({
      query: ({ query, filters = {} }) => {
        const params = new URLSearchParams({ q: query });
        if (filters.country) params.append('country', filters.country);
        if (filters.status) params.append('status', filters.status);
        return `/registrations/search?${params.toString()}`;
      },
      providesTags: [{ type: 'RegistrationList', id: 'search' }],
    }),

    /**
     * Validate registration data before submission
     * @param registrationData - Data to validate
     * @returns Validation results
     */
    validateRegistration: builder.mutation<ApiResponse<{
      isValid: boolean;
      errors: string[];
      warnings: string[];
    }>, Partial<CreateRegistrationRequest>>({
      query: (registrationData) => ({
        url: '/registrations/validate',
        method: 'POST',
        body: registrationData,
      }),
    }),

    /**
     * Check for duplicate registrations
     * @param checkData - Email and phone to check
     * @returns Information about potential duplicates
     */
    checkDuplicates: builder.query<ApiResponse<{
      hasDuplicates: boolean;
      duplicateFields: string[];
      existingRegistrations: Registration[];
    }>, { email?: string; phone?: string }>({
      query: ({ email, phone }) => {
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (phone) params.append('phone', phone);
        return `/registrations/check-duplicates?${params.toString()}`;
      },
    }),

  }),
});

// Export hooks for use in components
export const {
  useCreateRegistrationMutation,
  useGetRegistrationsQuery,
  useGetRegistrationByIdQuery,
  useUpdateRegistrationMutation,
  useDeleteRegistrationMutation,
  useGetRegistrationStatsQuery,
  useBulkUpdateRegistrationsMutation,
  useExportRegistrationsMutation,
  useGetRegistrationsByCountryQuery,
  useGetRecentRegistrationsQuery,
  useSearchRegistrationsQuery,
  useValidateRegistrationMutation,
  useCheckDuplicatesQuery,
  useLazyGetRegistrationsQuery,
  useLazySearchRegistrationsQuery,
} = registrationApi;

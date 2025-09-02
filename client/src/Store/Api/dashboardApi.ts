/**
 * Dashboard API slice using RTK Query
 * Handles dashboard analytics, notifications, and system health data
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  DashboardData,
  ActivityLog,
  Notification,
  SystemHealth,
  ApiResponse,
} from '../Interface';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
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
 * Dashboard API slice
 */
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['Dashboard', 'ActivityLog', 'Notification', 'SystemHealth'],
  endpoints: (builder) => ({

    /**
     * Get complete dashboard data
     * @returns Dashboard overview with stats, activity, and notifications
     */
    getDashboardData: builder.query<ApiResponse<DashboardData>, void>({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
      transformResponse: (response: ApiResponse<DashboardData>) => response,
      // Refresh dashboard data every 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * Get activity logs with pagination
     * @param params - Pagination and filter parameters
     * @returns Paginated activity logs
     */
    getActivityLogs: builder.query<ApiResponse<{
      logs: ActivityLog[];
      total: number;
      page: number;
      totalPages: number;
    }>, {
      page?: number;
      limit?: number;
      type?: string;
      userId?: string;
    }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.type) searchParams.append('type', params.type);
        if (params.userId) searchParams.append('userId', params.userId);
        
        return `/dashboard/activity?${searchParams.toString()}`;
      },
      providesTags: ['ActivityLog'],
      transformResponse: (response: ApiResponse<any>) => response,
      keepUnusedDataFor: 180, // 3 minutes
    }),

    /**
     * Get notifications for current user
     * @param params - Filter parameters for notifications
     * @returns User notifications
     */
    getNotifications: builder.query<ApiResponse<Notification[]>, {
      unreadOnly?: boolean;
      limit?: number;
    }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.unreadOnly) searchParams.append('unreadOnly', 'true');
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/dashboard/notifications?${searchParams.toString()}`;
      },
      providesTags: ['Notification'],
      transformResponse: (response: ApiResponse<Notification[]>) => response,
      keepUnusedDataFor: 60, // 1 minute
    }),

    /**
     * Mark notification as read
     * @param notificationId - ID of notification to mark as read
     */
    markNotificationAsRead: builder.mutation<ApiResponse<void>, string>({
      query: (notificationId) => ({
        url: `/dashboard/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    /**
     * Mark all notifications as read
     */
    markAllNotificationsAsRead: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/dashboard/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    /**
     * Delete a notification
     * @param notificationId - ID of notification to delete
     */
    deleteNotification: builder.mutation<ApiResponse<void>, string>({
      query: (notificationId) => ({
        url: `/dashboard/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),

    /**
     * Get system health status
     * @returns Current system health metrics
     */
    getSystemHealth: builder.query<ApiResponse<SystemHealth>, void>({
      query: () => '/dashboard/health',
      providesTags: ['SystemHealth'],
      transformResponse: (response: ApiResponse<SystemHealth>) => response,
      // Refresh health status every 30 seconds
      keepUnusedDataFor: 30,
    }),

    /**
     * Get dashboard analytics for a specific date range
     * @param dateRange - Start and end dates for analytics
     * @returns Analytics data for the specified period
     */
    getAnalytics: builder.query<ApiResponse<{
      registrationTrends: Array<{ date: string; count: number }>;
      countryDistribution: Array<{ country: string; count: number; percentage: number }>;
      statusDistribution: Array<{ status: string; count: number; percentage: number }>;
      monthlyGrowth: Array<{ month: string; registrations: number; growth: number }>;
    }>, {
      startDate: string;
      endDate: string;
      granularity?: 'day' | 'week' | 'month';
    }>({
      query: ({ startDate, endDate, granularity = 'day' }) => {
        const params = new URLSearchParams({
          startDate,
          endDate,
          granularity,
        });
        return `/dashboard/analytics?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 600, // 10 minutes
    }),

    /**
     * Create a new notification (admin only)
     * @param notification - Notification data
     */
    createNotification: builder.mutation<ApiResponse<Notification>, {
      type: 'info' | 'warning' | 'error' | 'success';
      title: string;
      message: string;
      expiresAt?: string;
    }>({
      query: (notification) => ({
        url: '/dashboard/notifications',
        method: 'POST',
        body: notification,
      }),
      invalidatesTags: ['Notification'],
    }),

    /**
     * Get recent activity summary
     * @param hours - Number of hours to look back (default 24)
     * @returns Summary of recent activity
     */
    getRecentActivitySummary: builder.query<ApiResponse<{
      newRegistrations: number;
      statusUpdates: number;
      adminLogins: number;
      totalActivity: number;
    }>, number>({
      query: (hours = 24) => `/dashboard/activity/summary?hours=${hours}`,
      providesTags: ['ActivityLog'],
      keepUnusedDataFor: 300, // 5 minutes
    }),

    /**
     * Get performance metrics
     * @returns System performance data
     */
    getPerformanceMetrics: builder.query<ApiResponse<{
      responseTime: number;
      uptime: number;
      memoryUsage: number;
      cpuUsage: number;
      activeConnections: number;
      requestsPerMinute: number;
    }>, void>({
      query: () => '/dashboard/metrics',
      providesTags: ['SystemHealth'],
      keepUnusedDataFor: 60, // 1 minute
    }),

    /**
     * Export activity logs
     * @param params - Export parameters
     * @returns Download URL for exported logs
     */
    exportActivityLogs: builder.mutation<ApiResponse<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>, {
      startDate: string;
      endDate: string;
      format: 'csv' | 'json';
      types?: string[];
    }>({
      query: (params) => ({
        url: '/dashboard/activity/export',
        method: 'POST',
        body: params,
      }),
    }),

  }),
});

// Export hooks for use in components
export const {
  useGetDashboardDataQuery,
  useGetActivityLogsQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useGetSystemHealthQuery,
  useGetAnalyticsQuery,
  useCreateNotificationMutation,
  useGetRecentActivitySummaryQuery,
  useGetPerformanceMetricsQuery,
  useExportActivityLogsMutation,
  useLazyGetAnalyticsQuery,
} = dashboardApi;

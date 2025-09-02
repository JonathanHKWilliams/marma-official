/**
 * TypeScript interfaces for the MARMA application
 * Defines all data structures for API responses, state management, and component props
 */

// =============================================================================
// USER & AUTHENTICATION INTERFACES
// =============================================================================

/**
 * User interface for authenticated admin users
 */
export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'super_admin';
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Authentication request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Authentication state in Redux store
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// REGISTRATION INTERFACES
// =============================================================================

/**
 * Complete registration data structure
 */
export interface RegistrationData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  maritalStatus: string;
  gender: string;
  photo?: string; // Base64 encoded image or URL
  
  // Education & Professional Information
  educationLevel: string;
  churchOrganization: string;
  position: string;
  
  // Recommendation Information
  recommendationName: string;
  recommendationContact: string;
  recommendationRelationship: string;
  recommendationChurch: string;
  
  // Membership Information
  membershipPurpose: string;
  
  // Authorization Fields (filled by admin)
  signedBy?: string;
  approvedBy?: string;
  attestedBy?: string;
  
  // Generated Fields (server-side)
  regionalCode?: string; // ML001, ML002, etc.
  identificationNumber?: string; // LIB001, SLE001, etc.
}

/**
 * Registration record with metadata
 */
export interface Registration extends RegistrationData {
  id: string;
  status: 'pending' | 'approved' | 'declined' | 'under_review';
  statusMessage?: string;
  createdAt: string;
  updatedAt?: string;
  statusUpdatedAt?: string;
  reviewedBy?: string;
}

/**
 * Registration creation request
 */
export interface CreateRegistrationRequest extends RegistrationData {}

/**
 * Registration update request
 */
export interface UpdateRegistrationRequest {
  id: string;
  status: 'approved' | 'declined' | 'under_review';
  statusMessage?: string;
  reviewedBy?: string;
  signedBy?: string;
  approvedBy?: string;
  attestedBy?: string;
}

/**
 * Registration list response with pagination
 */
export interface RegistrationListResponse {
  registrations: Registration[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Registration filters for API queries
 */
export interface RegistrationFilters {
  country?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Registration statistics
 */
export interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  declined: number;
  underReview: number;
  byCountry: Record<string, number>;
  byMonth: Record<string, number>;
  recentRegistrations: Registration[];
}

// =============================================================================
// API RESPONSE INTERFACES
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
  statusCode?: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// =============================================================================
// DASHBOARD & ANALYTICS INTERFACES
// =============================================================================

/**
 * Dashboard overview data
 */
export interface DashboardData {
  stats: RegistrationStats;
  recentActivity: ActivityLog[];
  notifications: Notification[];
  systemHealth: SystemHealth;
}

/**
 * Activity log entry
 */
export interface ActivityLog {
  id: string;
  type: 'registration_created' | 'status_updated' | 'admin_login' | 'export_generated';
  description: string;
  userId?: string;
  registrationId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

/**
 * System notification
 */
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

/**
 * System health status
 */
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  database: 'connected' | 'disconnected';
  emailService: 'operational' | 'degraded' | 'down';
  lastBackup?: string;
  uptime: number;
}

// =============================================================================
// FORM & UI INTERFACES
// =============================================================================

/**
 * Form validation error
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * Form state for multi-step registration
 */
export interface FormState {
  currentStep: number;
  totalSteps: number;
  isValid: boolean;
  errors: FormError[];
  isSubmitting: boolean;
}

/**
 * Filter panel state
 */
export interface FilterState {
  country: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  search: string;
}

/**
 * Table sorting configuration
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// =============================================================================
// EXPORT & REPORTING INTERFACES
// =============================================================================

/**
 * Export request configuration
 */
export interface ExportRequest {
  format: 'csv' | 'excel' | 'pdf';
  filters?: RegistrationFilters;
  fields?: string[];
  includePhotos?: boolean;
}

/**
 * Export response
 */
export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  size: number;
  expiresAt: string;
}

// =============================================================================
// SETTINGS & CONFIGURATION INTERFACES
// =============================================================================

/**
 * Application settings
 */
export interface AppSettings {
  emailNotifications: boolean;
  autoApproval: boolean;
  requirePhotoUpload: boolean;
  maxRegistrationsPerDay: number;
  allowedCountries: string[];
  adminEmails: string[];
}

/**
 * Email template configuration
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'registration_confirmation' | 'status_update' | 'admin_notification';
  isActive: boolean;
}

// =============================================================================
// REDUX STATE INTERFACES
// =============================================================================

/**
 * Root state interface for the Redux store
 */
export interface RootState {
  auth: AuthState;
  registrations: RegistrationState;
  dashboard: DashboardState;
  ui: UIState;
}

/**
 * Registration slice state
 */
export interface RegistrationState {
  registrations: Registration[];
  currentRegistration: Registration | null;
  filters: RegistrationFilters;
  stats: RegistrationStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Dashboard slice state
 */
export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: string | null;
}

/**
 * UI slice state for global UI state management
 */
export interface UIState {
  sidebarCollapsed: boolean;
  activeTab: string;
  showFilters: boolean;
  notifications: Notification[];
  isOnline: boolean;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Generic loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic API query parameters
 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * File upload interface
 */
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

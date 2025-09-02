/**
 * Admin Dashboard Component
 * Main dashboard interface for managing registrations and system overview
 * Uses Redux for state management and RTK Query for data fetching
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth, useAppSelector, useRegistrationFilters } from '../../Store/hooks';
import { useGetRegistrationsQuery, useGetRegistrationStatsQuery } from '../../Store/Api/registrationApi';
import RegistrationTable from './RegistrationTable';
import StatsCards from './StatsCards';
import FilterPanel from './FilterPanel';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Redux state and filters
  const { filters, setFilters } = useRegistrationFilters();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const showFilters = useAppSelector((state) => state.ui.showFilters);
  const isOnline = useAppSelector((state) => state.ui.isOnline);

  // RTK Query hooks for data fetching
  const {
    data: registrationsResponse,
    isLoading: registrationsLoading,
    error: registrationsError,
    refetch: refetchRegistrations,
  } = useGetRegistrationsQuery(filters, {
    skip: !isAuthenticated,
    pollingInterval: 300000, // Poll every 5 minutes
  });

  const {
    data: statsResponse,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetRegistrationStatsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 120000, // Poll every 2 minutes
  });

  // Extract data from API responses
  const registrations = registrationsResponse?.success ? registrationsResponse.data.registrations : [];
  const stats = statsResponse?.success ? statsResponse.data : null;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Filter registrations based on search term (client-side filtering for immediate feedback)
  const filteredRegistrations = registrations.filter(reg => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      reg.fullName.toLowerCase().includes(searchLower) ||
      reg.email.toLowerCase().includes(searchLower) ||
      reg.country.toLowerCase().includes(searchLower) ||
      reg.churchOrganization?.toLowerCase().includes(searchLower)
    );
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Handle search term changes with debouncing effect
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refetchRegistrations();
    refetchStats();
  };

  // Loading state
  const isLoading = registrationsLoading || statsLoading;

  // Error handling with fallback messages
  const hasError = registrationsError || statsError;
  const errorMessage = !isOnline 
    ? 'No internet connection. Please check your network and try again.'
    : hasError 
    ? 'Unable to load dashboard data. Please try refreshing the page.'
    : null;

  // Loading screen
  if (isLoading && !registrations.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          {!isOnline && (
            <p className="text-red-600 text-sm mt-2">Waiting for internet connection...</p>
          )}
        </div>
      </div>
    );
  }

  // Calculate registration stats with fallback
  const registrationStats = stats || {
    total: registrations.length,
    pending: registrations.filter(reg => !reg.status || reg.status === 'pending').length,
    approved: registrations.filter(reg => reg.status === 'approved').length,
    declined: registrations.filter(reg => reg.status === 'declined').length,
    underReview: registrations.filter(reg => reg.status === 'under_review').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={(tab) => {
          // Update active tab in Redux store
          // This will be handled by the sidebar component
        }}
        registrationStats={registrationStats}
      />
      
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header with Error Display */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {activeTab === 'dashboard' ? 'Dashboard Overview' : 
                   activeTab === 'registrations' ? 'Registration Management' : 
                   activeTab === 'settings' ? 'Settings' : 'Notifications'}
                </h1>
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Updating...</span>
                  </div>
                )}
              </div>

              {/* Refresh button and connection status */}
              <div className="flex items-center space-x-3">
                {!isOnline && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Offline</span>
                  </div>
                )}
                
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <p className="text-red-700 font-medium">Connection Issue</p>
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview registrations={registrations} />
          )}
          
          {activeTab === 'registrations' && (
            <>
              {/* Stats Cards */}
              <div className="mb-8">
                <StatsCards registrations={registrations} />
              </div>

              {/* Controls */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search by name, email, country, or organization..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Toggle filters visibility in Redux store
                      // This will be handled by dispatching an action
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="h-5 w-5 text-gray-500" />
                    <span>Filters</span>
                    {showFilters && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Active</span>}
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mb-6">
                  <FilterPanel 
                    onChange={handleFilterChange}
                    filters={filters}
                    registrations={registrations}
                  />
                </div>
              )}

              {/* Registration Table with Fallback */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {filteredRegistrations.length === 0 && !isLoading ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || Object.values(filters).some(v => v) 
                        ? 'Try adjusting your search or filters to find what you\'re looking for.'
                        : 'No registration data is currently available. This could be due to a connection issue or no registrations have been submitted yet.'
                      }
                    </p>
                    {(searchTerm || Object.values(filters).some(v => v)) && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilters({
                            country: '',
                            status: '',
                            dateRange: { start: '', end: '' },
                            search: '',
                            page: 1,
                            limit: 20,
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <RegistrationTable 
                    registrations={filteredRegistrations} 
                    onUpdate={handleRefresh}
                  />
                )}
              </div>
            </>
          )}
          
          {activeTab === 'notifications' && (
            <NotificationsPage registrations={registrations} />
          )}
          
          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
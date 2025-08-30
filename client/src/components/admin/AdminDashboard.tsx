import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RegistrationTable from './RegistrationTable';
import StatsCards from './StatsCards';
import FilterPanel from './FilterPanel';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';
import { getRegistrations } from '../../services/registrationService';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('registrations');
  const [filters, setFilters] = useState({
    country: '',
    status: '',
    dateRange: { start: '', end: '' }
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    loadRegistrations();
  }, [user, navigate]);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchTerm, filters]);

  const loadRegistrations = async () => {
    try {
      const data = await getRegistrations();
      setRegistrations(data as any);
    } catch (error) {
      console.error('Error loading registrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        (reg as any).fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg as any).email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(reg => (reg as any).country === filters.country);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(reg => (reg as any).status === filters.status);
    }

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(reg => new Date((reg as any).createdAt) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(reg => new Date((reg as any).createdAt) <= new Date(filters.dateRange.end));
    }

    setFilteredRegistrations(filtered);
  };

  // Logout function moved to sidebar

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate registration stats for sidebar
  const registrationStats = {
    total: registrations.length,
    pending: registrations.filter((reg: any) => !reg.status || reg.status === 'pending').length,
    approved: registrations.filter((reg: any) => reg.status === 'approved').length,
    declined: registrations.filter((reg: any) => reg.status === 'declined').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        registrationStats={registrationStats}
      />
      
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {activeTab === 'dashboard' ? 'Dashboard Overview' : 
                 activeTab === 'registrations' ? 'Registration Management' : 
                 activeTab === 'settings' ? 'Settings' : 'Notifications'}
              </h1>
            </div>
          </div>
        </header>

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
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="h-5 w-5 text-gray-500" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mb-6">
                  <FilterPanel 
                    onChange={(newFilters: any) => {
                      setFilters(newFilters);
                      filterRegistrations();
                    }}
                    filters={filters}
                    registrations={registrations}
                  />
                </div>
              )}

              {/* Registration Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <RegistrationTable 
                  registrations={filteredRegistrations} 
                  onUpdate={() => {
                    loadRegistrations();
                  }}
                />
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
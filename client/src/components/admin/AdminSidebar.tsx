/**
 * Admin Sidebar Component
 * Navigation sidebar for admin dashboard with Redux integration
 */

import React from 'react';
import { Users, Settings, LogOut, Bell, Home } from 'lucide-react';
import { useAuth, useAppDispatch } from '../../Store/hooks';
import { setActiveTab } from '../../Store/Slices/uiSlice';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  registrationStats: {
    total: number;
    pending: number;
    approved: number;
    declined: number;
    underReview?: number;
  };
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange, registrationStats }) => {
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleTabChange = (tab: string) => {
    dispatch(setActiveTab(tab));
    onTabChange(tab);
  };
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { id: 'registrations', label: 'Registrations', icon: <Users className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Marma Admin
        </h2>
        <p className="text-sm text-gray-500 mt-1">Registration Management</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                
                {item.id === 'registrations' && registrationStats.pending > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {registrationStats.pending}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Registration Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-medium">{registrationStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-medium text-yellow-600">{registrationStats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approved</span>
              <span className="font-medium text-green-600">{registrationStats.approved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Declined</span>
              <span className="font-medium text-red-600">{registrationStats.declined}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

/**
 * Stats Cards Component
 * Displays registration statistics with Redux integration and fallback messages
 */

import React from 'react';
import { Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../../Store/hooks';

interface StatsCardsProps {
  registrations: any[];
  isLoading?: boolean;
  error?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ registrations, isLoading = false, error }) => {
  // Get UI state from Redux
  const isOnline = useAppSelector((state) => state.ui?.isOnline ?? true);
  
  // Calculate stats with fallback for empty data
  const totalRegistrations = registrations?.length || 0;
  const pendingRegistrations = registrations?.filter(r => r.status === 'pending').length || 0;
  const approvedRegistrations = registrations?.filter(r => r.status === 'approved').length || 0;
  const declinedRegistrations = registrations?.filter(r => r.status === 'declined').length || 0;

  const stats = [
    {
      title: 'Total Registrations',
      value: totalRegistrations,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Pending Review',
      value: pendingRegistrations,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Approved',
      value: approvedRegistrations,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Declined',
      value: declinedRegistrations,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  // Show error state if there's an error
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-red-600">--</p>
                <p className="text-xs text-red-500 mt-1">Data unavailable</p>
              </div>
              <div className="bg-red-500 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show offline state if not online
  if (!isOnline) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-500">--</p>
                <p className="text-xs text-gray-400 mt-1">Offline mode</p>
              </div>
              <div className="bg-gray-400 p-3 rounded-xl">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 ${isLoading ? 'animate-pulse' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {isLoading ? '--' : stat.value}
              </p>
              {isLoading && <p className="text-xs text-gray-400 mt-1">Loading...</p>}
            </div>
            <div className={`${stat.color} p-3 rounded-xl`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
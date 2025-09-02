/**
 * Notifications Page Component
 * Displays system notifications with Redux integration and fallback states
 */

import React from 'react';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAppSelector, useNotifications } from '../../Store/hooks';

interface NotificationsPageProps {
  isLoading?: boolean;
  error?: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ isLoading = false, error }) => {
  const { notifications } = useNotifications();
  const isOnline = useAppSelector((state) => (state as any).ui?.isOnline ?? true);

  // Use actual notifications from Redux store
  const displayNotifications = notifications || [];
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'new':
        return 'bg-blue-50 border-blue-200';
      case 'reminder':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'system':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            Mark all as read
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
            Clear all
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-red-200 p-10 text-center">
          <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-700 mb-1">Error Loading Notifications</h3>
          <p className="text-red-500">{error}</p>
        </div>
      ) : !isOnline ? (
        <div className="bg-white rounded-xl border border-yellow-200 p-10 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-700 mb-1">No Internet Connection</h3>
          <p className="text-yellow-600">Please check your connection to view notifications.</p>
        </div>
      ) : displayNotifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 border rounded-lg ${getNotificationClass(notification.type)} ${!notification.isRead ? 'border-l-4' : ''}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'} mt-1`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

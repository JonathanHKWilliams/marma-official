import React from 'react';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface NotificationsPageProps {
  registrations: any[];
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ registrations }) => {
  // Generate mock notifications based on registrations
  const generateNotifications = () => {
    const notifications = [];
    
    // Recent registrations (last 7 days)
    const recentRegistrations = registrations.filter(reg => {
      const regDate = new Date(reg.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return regDate >= sevenDaysAgo;
    });
    
    // Add new registration notifications
    recentRegistrations.forEach(reg => {
      notifications.push({
        id: `new-${reg._id || Math.random().toString(36).substr(2, 9)}`,
        type: 'new',
        title: 'New Registration',
        message: `${reg.fullName} has submitted a new registration form.`,
        date: new Date(reg.createdAt),
        read: false
      });
    });
    
    // Add pending approval reminders for registrations older than 3 days
    const pendingOldRegistrations = registrations.filter(reg => {
      const regDate = new Date(reg.createdAt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return (!reg.status || reg.status === 'pending') && regDate <= threeDaysAgo;
    });
    
    pendingOldRegistrations.forEach(reg => {
      notifications.push({
        id: `pending-${reg._id || Math.random().toString(36).substr(2, 9)}`,
        type: 'reminder',
        title: 'Pending Approval',
        message: `${reg.fullName}'s registration has been pending for more than 3 days.`,
        date: new Date(),
        read: false
      });
    });
    
    // Add system notifications
    if (registrations.length > 0) {
      notifications.push({
        id: 'system-1',
        type: 'system',
        title: 'System Update',
        message: 'The registration system has been updated with new security features.',
        date: new Date(),
        read: true
      });
    }
    
    // Sort notifications by date (newest first)
    return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
  const notifications = generateNotifications();
  
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
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 border rounded-lg ${getNotificationClass(notification.type)} ${!notification.read ? 'border-l-4' : ''}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {notification.date.toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'} mt-1`}>
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

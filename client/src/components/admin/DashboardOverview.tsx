import React, { useMemo } from 'react';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, MapPin, Calendar } from 'lucide-react';

interface DashboardOverviewProps {
  registrations: any[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ registrations }) => {
  // Calculate statistics
  const totalRegistrations = registrations.length;
  const pendingRegistrations = registrations.filter(reg => !reg.status || reg.status === 'pending').length;
  const approvedRegistrations = registrations.filter(reg => reg.status === 'approved').length;
  const declinedRegistrations = registrations.filter(reg => reg.status === 'declined').length;
  
  // Calculate recent activity
  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
    
  // Calculate country distribution
  const countryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    registrations.forEach(reg => {
      if (reg.country) {
        distribution[reg.country] = (distribution[reg.country] || 0) + 1;
      }
    });
    
    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [registrations]);
  
  // Calculate registration trend (last 7 days)
  const registrationTrend = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyCounts: Record<string, number> = {};
    last7Days.forEach(day => {
      dailyCounts[day] = 0;
    });
    
    registrations.forEach(reg => {
      const regDate = new Date(reg.createdAt).toISOString().split('T')[0];
      if (dailyCounts[regDate] !== undefined) {
        dailyCounts[regDate]++;
      }
    });
    
    return Object.entries(dailyCounts).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    }));
  }, [registrations]);

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h2>
        <p className="text-gray-600">Here's an overview of your registration data and analytics</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Registrations</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-900">{totalRegistrations}</p>
          <p className="text-sm text-gray-500 mt-2">All time registrations</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Pending</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{pendingRegistrations}</p>
          <p className="text-sm text-gray-500 mt-2">Awaiting approval</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Approved</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{approvedRegistrations}</p>
          <p className="text-sm text-gray-500 mt-2">Approved members</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Declined</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{declinedRegistrations}</p>
          <p className="text-sm text-gray-500 mt-2">Declined applications</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-700">Registration Trend</h3>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {registrationTrend.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-500 rounded-t w-full" 
                  style={{ 
                    height: `${Math.max(15, (day.count / Math.max(...registrationTrend.map(d => d.count))) * 150)}px`,
                    minHeight: day.count > 0 ? '15px' : '5px',
                    backgroundColor: day.count > 0 ? '#3b82f6' : '#e5e7eb'
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                <div className="text-xs font-medium">{day.count}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">Registration activity over the last 7 days</p>
        </div>

        {/* Country Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-700">Top Countries</h3>
          </div>
          <div className="space-y-4">
            {countryDistribution.length > 0 ? (
              countryDistribution.map(([country, count], index) => (
                <div key={index} className="flex items-center">
                  <div className="w-32 truncate text-sm font-medium">{country}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${(count / registrations.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{count}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No country data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-700">Recent Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRegistrations.length > 0 ? recentRegistrations.map((reg, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.country || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${reg.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        reg.status === 'declined' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {reg.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No recent registrations</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

/**
 * Filter Panel Component
 * Provides filtering controls with Redux integration
 */

import React from 'react';
import { Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setFilters, clearFilters } from '../../Store/Slices/registrationSlice';

interface FilterPanelProps {
  registrations: any[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ registrations }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => (state as any).registrations?.filters || {
    country: '',
    status: '',
    dateRange: { start: '', end: '' }
  });
  const uniqueCountries = Array.from(new Set(registrations.map(r => r.country))).sort();
  
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'declined', label: 'Declined' }
  ];

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
        <select
          value={filters.country}
          onChange={(e) => handleFilterChange('country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Countries</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-end">
        <button
          onClick={handleClearFilters}
          className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
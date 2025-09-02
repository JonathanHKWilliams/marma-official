/**
 * Admin Login Component
 * Provides secure authentication interface for admin users
 * Uses Redux for state management and RTK Query for API calls
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth, useAppSelector } from '../../Store/hooks';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const isOnline = useAppSelector((state) => state.ui.isOnline);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Check if online
    if (!isOnline) {
      setLocalError('No internet connection. Please check your network and try again.');
      return;
    }

    // Basic validation
    if (!email.trim()) {
      setLocalError('Email address is required');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (err: any) {
      // Error is handled by Redux, but we can set additional context
      setLocalError(err.message || 'Authentication failed. Please try again.');
    }
  };

  // Determine which error to show
  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Connection Status Indicator */}
        {!isOnline && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
            <WifiOff className="h-5 w-5 text-red-600" />
            <span className="text-red-700 text-sm">No internet connection</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Admin Portal
            </h2>
            <p className="text-gray-600">
              MARMA Registration Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="admin@marma.org"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Display with Enhanced Styling */}
            {displayError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm font-medium">Authentication Error</p>
                  <p className="text-red-600 text-sm mt-1">{displayError}</p>
                  {!isOnline && (
                    <p className="text-red-600 text-xs mt-2">
                      Please check your internet connection and try again.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Connection Status in Button */}
            <button
              type="submit"
              disabled={isLoading || !isOnline}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : !isOnline ? (
                <div className="flex items-center justify-center space-x-2">
                  <WifiOff className="h-4 w-4" />
                  <span>No Connection</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Wifi className="h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </button>

            {/* Development Mode Notice */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-xs text-center">
                  Development Mode: API calls will be made to backend server
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
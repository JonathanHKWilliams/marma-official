import React, { useState } from 'react';
import { Save, Lock, User, Bell } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    adminName: 'Admin User',
    adminEmail: 'admin@marma.org',
    notificationsEnabled: true,
    emailNotifications: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [approvalSettings, setApprovalSettings] = useState({
    requirePassword: true,
    autoDeclineAfterDays: 30,
    sendEmailOnApproval: true,
    sendEmailOnDecline: true
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleApprovalSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setApprovalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Save general settings logic would go here
    alert('General settings saved!');
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic would go here
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setSecuritySettings({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handleSaveApprovalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Save approval settings logic would go here
    alert('Approval settings saved!');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Admin Settings</h2>
      
      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <User className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-700">General Settings</h3>
        </div>
        
        <form onSubmit={handleSaveGeneralSettings}>
          <div className="space-y-4">
            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Name
              </label>
              <input
                type="text"
                id="adminName"
                name="adminName"
                value={generalSettings.adminName}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                id="adminEmail"
                name="adminEmail"
                value={generalSettings.adminEmail}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="notificationsEnabled"
                checked={generalSettings.notificationsEnabled}
                onChange={handleGeneralSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-700">
                Enable Dashboard Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={generalSettings.emailNotifications}
                onChange={handleGeneralSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Enable Email Notifications
              </label>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Lock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-700">Security Settings</h3>
        </div>
        
        <form onSubmit={handleChangePassword}>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={securitySettings.currentPassword}
                onChange={handleSecuritySettingsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={securitySettings.newPassword}
                onChange={handleSecuritySettingsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={securitySettings.confirmPassword}
                onChange={handleSecuritySettingsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Approval Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-700">Approval Settings</h3>
        </div>
        
        <form onSubmit={handleSaveApprovalSettings}>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requirePassword"
                name="requirePassword"
                checked={approvalSettings.requirePassword}
                onChange={handleApprovalSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requirePassword" className="ml-2 block text-sm text-gray-700">
                Require Password for Approval/Decline Actions
              </label>
            </div>
            
            <div>
              <label htmlFor="autoDeclineAfterDays" className="block text-sm font-medium text-gray-700 mb-1">
                Auto-Decline After (days)
              </label>
              <input
                type="number"
                id="autoDeclineAfterDays"
                name="autoDeclineAfterDays"
                value={approvalSettings.autoDeclineAfterDays}
                onChange={handleApprovalSettingsChange}
                min="0"
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 to disable auto-decline</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendEmailOnApproval"
                name="sendEmailOnApproval"
                checked={approvalSettings.sendEmailOnApproval}
                onChange={handleApprovalSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sendEmailOnApproval" className="ml-2 block text-sm text-gray-700">
                Send Email Notification on Approval
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendEmailOnDecline"
                name="sendEmailOnDecline"
                checked={approvalSettings.sendEmailOnDecline}
                onChange={handleApprovalSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sendEmailOnDecline" className="ml-2 block text-sm text-gray-700">
                Send Email Notification on Decline
              </label>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Approval Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Camera, GraduationCap, FileText, Download, UserCircle } from 'lucide-react';
import PasswordAuthModal from './PasswordAuthModal';
import MemberDetailSidebar from './MemberDetailSidebar';
import RegistrationModal from './RegistrationModal';
import { updateRegistrationStatus } from '../../services/registrationService';

interface RegistrationTableProps {
  registrations: any[];
  onUpdate: () => void;
}

const RegistrationTable: React.FC<RegistrationTableProps> = ({ registrations, onUpdate }) => {
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportPasswordModal, setShowExportPasswordModal] = useState(false);
  const [sidebarRegistration, setSidebarRegistration] = useState(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(registrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegistrations = registrations.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'declined', message: string) => {
    try {
      await updateRegistrationStatus(id, status, message);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const exportToCSV = () => {
    // Convert registrations to CSV format
    const headers = [
      'Full Name', 'Date of Birth', 'Email', 'Phone', 'Country', 'Address',
      'Education Level', 'Church/Organization', 'Position',
      'Recommendation Name', 'Recommendation Contact', 'Recommendation Relationship',
      'Recommendation Church', 'Membership Purpose', 'Marital Status', 'Gender',
      'Regional Code', 'Identification Number', 'Status', 'Created At'
    ];
    
    const csvRows = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.fullName || ''}"`,
        `"${reg.dateOfBirth || ''}"`,
        `"${reg.email || ''}"`,
        `"${reg.phone || ''}"`,
        `"${reg.country || ''}"`,
        `"${reg.address || ''}"`,
        `"${reg.educationLevel || ''}"`,
        `"${reg.churchOrganization || ''}"`,
        `"${reg.position || ''}"`,
        `"${reg.recommendationName || ''}"`,
        `"${reg.recommendationContact || ''}"`,
        `"${reg.recommendationRelationship || ''}"`,
        `"${reg.recommendationChurch || ''}"`,
        `"${reg.membershipPurpose || ''}"`,
        `"${reg.maritalStatus || ''}"`,
        `"${reg.gender || ''}"`,
        `"${reg.regionalCode || ''}"`,
        `"${reg.identificationNumber || ''}"`,
        `"${reg.status || 'pending'}"`,
        `"${new Date(reg.createdAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Registration Management
        </h3>
        <p className="text-gray-600 mt-1">
          {registrations.length} total registrations
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ministry
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personal Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommendation
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRegistrations.map((registration) => (
              <tr key={registration.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{registration.fullName}</div>
                    {registration.dateOfBirth && (
                      <div className="text-sm text-gray-500">DOB: {new Date(registration.dateOfBirth).toLocaleDateString()}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{registration.email}</div>
                  <div className="text-sm text-gray-500">{registration.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{registration.country}</div>
                  {registration.address && (
                    <div className="text-sm text-gray-500 truncate max-w-[150px]">{registration.address}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{registration.churchOrganization || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{registration.position || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {registration.gender ? `${registration.gender}` : ''}
                    {registration.maritalStatus ? ` • ${registration.maritalStatus}` : ''}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                    <GraduationCap className="h-3 w-3" />
                    <span>{registration.educationLevel || 'N/A'}</span>
                    {registration.photo && (
                      <span className="ml-2 flex items-center">
                        <Camera className="h-3 w-3 text-blue-500" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{registration.identificationNumber || registration.regionalCode || 'ID pending'}</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 truncate max-w-[150px]">{registration.recommendationName || 'N/A'}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[150px]">{registration.recommendationChurch || 'N/A'}</div>
                  <div className="text-sm text-gray-500 italic truncate max-w-[150px]" title={registration.membershipPurpose}>
                    {registration.membershipPurpose ? `Purpose: ${registration.membershipPurpose.substring(0, 20)}${registration.membershipPurpose.length > 20 ? '...' : ''}` : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(registration.status || 'pending')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(registration.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedRegistration(registration)}
                      className="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => setSidebarRegistration(registration)}
                      className="inline-flex items-center px-2 py-1 text-green-600 hover:text-green-800 transition-colors"
                    >
                      <UserCircle className="h-4 w-4 mr-1" />
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* Export and Pagination Controls */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExportPasswordModal(true)}
            className="inline-flex items-center px-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-1" />
            Export to CSV
          </button>
          <div className="text-sm text-gray-700 ml-4">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, registrations.length)} of {registrations.length} registrations
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedRegistration && (
        <RegistrationModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      
      {/* Password Authentication Modal for CSV Export */}
      {showExportPasswordModal && (
        <PasswordAuthModal
          onClose={() => setShowExportPasswordModal(false)}
          onConfirm={() => {
            setShowExportPasswordModal(false);
            exportToCSV();
          }}
          title="Confirm CSV Export"
          description="Please enter your admin password to export all registration data to CSV."
        />
      )}

      {/* Member Detail Sidebar */}
      {sidebarRegistration && (
        <MemberDetailSidebar
          registration={sidebarRegistration}
          onClose={() => setSidebarRegistration(null)}
        />
      )}
    </div>
  );
};

export default RegistrationTable;
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Mail, Phone, MapPin, User, Church, GraduationCap, Heart, Users, Camera, FileCheck } from 'lucide-react';
import PasswordAuthModal from './PasswordAuthModal';

interface RegistrationModalProps {
  registration: any;
  onClose: () => void;
  onStatusUpdate: (id: string, status: 'approved' | 'declined', message: string) => Promise<void>;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ registration, onClose, onStatusUpdate }) => {
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'declined'>('approved');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Show password modal instead of immediately updating
    setShowPasswordModal(true);
  };
  
  const handlePasswordConfirm = async () => {
    setIsUpdating(true);
    setShowPasswordModal(false);
    
    try {
      await onStatusUpdate(registration.id, selectedStatus, message);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Registration Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Personal Information</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{registration.fullName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                <p className="text-gray-900">{registration.dateOfBirth ? new Date(registration.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{registration.email}</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{registration.phone}</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{registration.country}</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Education</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{registration.educationLevel || 'Not provided'}</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{registration.maritalStatus || 'Not provided'}</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{registration.gender || 'Not provided'}</span>
                </p>
              </div>
            </div>
            {registration.address && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                <p className="text-gray-900">{registration.address}</p>
              </div>
            )}
            {registration.photo && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Profile Photo</span>
                </label>
                <div className="mt-2">
                  <img 
                    src={registration.photo} 
                    alt="Profile" 
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ministry Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Church className="h-5 w-5 text-blue-600" />
              <span>Ministry Information</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Church/Organization</label>
                <p className="text-gray-900">{registration.churchOrganization || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Position/Role</label>
                <p className="text-gray-900">{registration.position || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Pastoral Recommendation */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Pastoral Recommendation</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Recommender Name</label>
                <p className="text-gray-900">{registration.recommendationName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Contact</label>
                <p className="text-gray-900">{registration.recommendationContact}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Relationship</label>
                <p className="text-gray-900">{registration.recommendationRelationship || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Church/Ministry</label>
                <p className="text-gray-900">{registration.recommendationChurch || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Purpose of Membership</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 leading-relaxed">{registration.membershipPurpose}</p>
            </div>
          </div>

          {/* Authorization Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              <span>Authorization Information</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Signed By</label>
                <p className="text-gray-900">{registration.signedBy || 'Not signed'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Approved By</label>
                <p className="text-gray-900">{registration.approvedBy || 'Not approved'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Attested By</label>
                <p className="text-gray-900">{registration.attestedBy || 'Not attested'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Regional Code</label>
                <p className="text-gray-900">{registration.regionalCode || 'Not generated'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">Identification Number</label>
                <p className="text-gray-900">{registration.identificationNumber || 'Not generated'}</p>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          {!showStatusUpdate ? (
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedStatus('approved');
                  setShowStatusUpdate(true);
                }}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Approve Membership</span>
              </button>
              <button
                onClick={() => {
                  setSelectedStatus('declined');
                  setShowStatusUpdate(true);
                }}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors duration-200"
              >
                <XCircle className="h-5 w-5" />
                <span>Decline Membership</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleStatusSubmit} className="pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedStatus === 'approved' ? 'Approve' : 'Decline'} Membership
              </h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Member
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    selectedStatus === 'approved'
                      ? 'Welcome message and next steps...'
                      : 'Reason for decline and guidance...'
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-semibold transition-colors duration-200 ${
                    selectedStatus === 'approved'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : selectedStatus === 'approved' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span>{isUpdating ? 'Updating...' : selectedStatus === 'approved' ? 'Approve' : 'Decline'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusUpdate(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Password Authentication Modal */}
      {showPasswordModal && (
        <PasswordAuthModal
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handlePasswordConfirm}
          title={`Confirm ${selectedStatus === 'approved' ? 'Approval' : 'Decline'}`}
          description={`Please enter your admin password to ${selectedStatus === 'approved' ? 'approve' : 'decline'} this membership application.`}
        />
      )}
    </div>
  );
};

export default RegistrationModal;
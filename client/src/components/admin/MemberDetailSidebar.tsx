import React from 'react';
import { X, User, Mail, Phone, MapPin, Building, Briefcase, Users, FileText, Calendar, Award } from 'lucide-react';

interface MemberDetailSidebarProps {
  registration: any;
  onClose: () => void;
}

const MemberDetailSidebar: React.FC<MemberDetailSidebarProps> = ({ registration, onClose }) => {
  if (!registration) return null;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Default image if no photo is provided
  const defaultImage = 'https://www.shareicon.net/data/128x128/2016/09/15/829472_man_512x512.png';
  
  // Use photo URL if available, otherwise use default
  const photoUrl = registration.photo ? registration.photo : defaultImage;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-900">Member Details</h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6">
        {/* Member Photo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100 mb-4">
            <img 
              src={photoUrl} 
              alt={registration.fullName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </div>
          <h2 className="text-xl font-bold text-center">{registration.fullName}</h2>
          <div className="mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {registration.status === 'approved' ? 'Approved Member' : 
             registration.status === 'declined' ? 'Declined' : 'Pending Approval'}
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h4 className="text-sm uppercase text-gray-500 font-medium mb-3 border-b pb-2">Personal Information</h4>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{registration.gender || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{registration.dateOfBirth ? formatDate(registration.dateOfBirth) : 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Award className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="font-medium">{registration.maritalStatus || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{registration.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{registration.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{registration.country}</p>
                <p className="text-sm text-gray-600">{registration.address}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Education Level</p>
                <p className="font-medium">{registration.educationLevel || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ministry Information */}
        <div className="mb-6">
          <h4 className="text-sm uppercase text-gray-500 font-medium mb-3 border-b pb-2">Ministry Information</h4>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Building className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Church/Organization</p>
                <p className="font-medium">{registration.churchOrganization || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Briefcase className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{registration.position || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Information */}
        <div className="mb-6">
          <h4 className="text-sm uppercase text-gray-500 font-medium mb-3 border-b pb-2">Recommendation</h4>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Recommender</p>
                <p className="font-medium">{registration.recommendationName || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Building className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Recommender's Church</p>
                <p className="font-medium">{registration.recommendationChurch || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Recommender's Contact</p>
                <p className="font-medium">{registration.recommendationContact || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Relationship</p>
                <p className="font-medium">{registration.recommendationRelationship || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div className="mb-6">
          <h4 className="text-sm uppercase text-gray-500 font-medium mb-3 border-b pb-2">Membership Purpose</h4>
          <p className="text-gray-700">{registration.membershipPurpose || 'Not specified'}</p>
        </div>

        {/* Authorization Information */}
        <div className="mb-6">
          <h4 className="text-sm uppercase text-gray-500 font-medium mb-3 border-b pb-2">Authorization</h4>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Regional Code</p>
                <p className="font-medium">{registration.regionalCode || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Identification Number</p>
                <p className="font-medium">{registration.identificationNumber || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Signed By</p>
                <p className="font-medium">{registration.signedBy || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Approved By</p>
                <p className="font-medium">{registration.approvedBy || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Attested By</p>
                <p className="font-medium">{registration.attestedBy || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div>
          <h4 className="text-sm uppercase text-gray-500 font-medium mb-3 border-b pb-2">Registration Info</h4>
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Registration Date</p>
              <p className="font-medium">{registration.createdAt ? formatDate(registration.createdAt) : 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailSidebar;

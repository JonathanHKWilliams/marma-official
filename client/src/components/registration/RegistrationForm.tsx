import React, { useState, useRef } from 'react';
import { UserPlus, Mail, Phone, MapPin, GraduationCap, Church, User, FileText, CheckCircle, Camera, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import FormField from '../ui/FormField';
import CountrySelect from '../ui/CountrySelect';
import { createRegistration } from '../../services/registrationService';
import SuccessMessage from '../ui/SuccessMessage';

interface RegistrationData {
  fullName: string;
  age: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  educationLevel: string;
  churchOrganization: string;
  position: string;
  recommendationName: string;
  recommendationContact: string;
  recommendationRelationship: string;
  recommendationChurch: string;
  membershipPurpose: string;
  // New fields
  maritalStatus: string;
  gender: string;
  photo: string;
  signedBy: string;
  approvedBy: string;
  attestedBy: string;
  regionalCode?: string; // Generated on server
  identificationNumber?: string; // Generated on server
}

const RegistrationForm: React.FC = () => {
  // Add step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    educationLevel: '',
    churchOrganization: '',
    position: '',
    recommendationName: '',
    recommendationContact: '',
    recommendationRelationship: '',
    recommendationChurch: '',
    membershipPurpose: '',
    // New fields
    maritalStatus: '',
    gender: '',
    photo: '',
    signedBy: 'Pst Peter Flourish', // Default values as requested
    approvedBy: 'Pst Peter Flourish',
    attestedBy: 'Peter Williams',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Step navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Validate only the fields in the current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Step 1: Personal Information
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      
      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
      }
      
      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
      }
      
      if (!formData.maritalStatus) {
        newErrors.maritalStatus = 'Marital status is required';
      }
    }
    
    // Step 2: Ministry Information
    else if (currentStep === 2) {
      // Ministry info is optional, no validation needed
    }
    
    // Step 3: Recommendation
    else if (currentStep === 3) {
      if (!formData.recommendationName.trim()) {
        newErrors.recommendationName = 'Pastoral recommendation name is required';
      }
      
      if (!formData.recommendationContact.trim()) {
        newErrors.recommendationContact = 'Pastoral recommendation contact is required';
      }
    }
    
    // Step 4: Purpose and Authorization
    else if (currentStep === 4) {
      if (!formData.membershipPurpose.trim()) {
        newErrors.membershipPurpose = 'Purpose of membership is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset the form data
  const resetForm = () => {
    setFormData({
      fullName: '',
      age: '',
      email: '',
      phone: '',
      country: '',
      address: '',
      educationLevel: '',
      churchOrganization: '',
      position: '',
      recommendationName: '',
      recommendationContact: '',
      recommendationRelationship: '',
      recommendationChurch: '',
      membershipPurpose: '',
      maritalStatus: '',
      gender: '',
      photo: '',
      signedBy: 'Pst Peter Flourish',
      approvedBy: 'Pst Peter Flourish',
      attestedBy: 'Peter Flourish',
    });
    setCurrentStep(1);
    setErrors({});
  };

  const educationLevels = [
    'Elementary School',
    'High School',
    'Some College',
    "Bachelor's Degree",
    "Master's Degree",
    'Doctorate/PhD',
    'Theological Seminary',
    'Other'
  ];

  // Complete validation of all fields - used when submitting the final form
  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Personal Information
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Marital status is required';
    }
    
    if (!formData.photo) {
      newErrors.photo = 'Profile photo is required';
    }
    
    // Recommendation
    if (!formData.recommendationName.trim()) {
      newErrors.recommendationName = 'Pastoral recommendation name is required';
    }
    
    if (!formData.recommendationContact.trim()) {
      newErrors.recommendationContact = 'Pastoral recommendation contact is required';
    }
    
    // Purpose
    if (!formData.membershipPurpose.trim()) {
      newErrors.membershipPurpose = 'Purpose of membership is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    // If not on the last step, go to next step
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }

    // Validate all fields before final submission
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createRegistration(formData);
      // Set success state only - don't reset form yet
      setShowSuccess(true);
      // Form will be reset when user clicks to register another member
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Define marital status options
  const maritalStatusOptions = [
    'Single',
    'Married',
    'Widow',
    'Widower'
  ];

  // Define gender options
  const genderOptions = [
    'Male',
    'Female'
  ];

  // Progress bar for steps
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${currentStep > index ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-900 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Personal Info</span>
          <span>Ministry Details</span>
          <span>Recommendation</span>
          <span>Finalize</span>
        </div>
      </div>
    );
  };

  // Render photo upload section
  const renderPhotoUpload = () => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo *
        </label>
        <div className="flex items-center space-x-4">
          {formData.photo ? (
            <div className="relative">
              <img 
                src={formData.photo} 
                alt="Profile" 
                className="w-24 h-24 object-cover rounded-lg border border-gray-300" 
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{formData.photo ? 'Change Photo' : 'Upload Photo'}</span>
            </button>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF, max 5MB</p>
            {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
          </div>
        </div>
      </div>
    );
  };

  // Render authorization section
  const renderAuthorization = () => {
    return (
      <div className="space-y-4 border p-4 rounded-xl bg-gray-50">
        <h4 className="font-medium text-gray-800">Authorization</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Signed:</p>
            <p className="text-sm text-blue-900">{formData.signedBy}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Approved:</p>
            <p className="text-sm text-blue-900">{formData.approvedBy}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Attested:</p>
            <p className="text-sm text-blue-900">{formData.attestedBy}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render step navigation buttons
  const renderStepButtons = () => {
    return (
      <div className="flex justify-between pt-6">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border border-blue-900 text-blue-900 rounded-xl hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
        )}
        <div className="flex-1"></div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl font-medium hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : currentStep < totalSteps ? (
            <>
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Submit Registration</span>
            </>
          )}
        </button>
      </div>
    );
  };

  if (showSuccess) {
    return <SuccessMessage onClose={() => {
      setShowSuccess(false);
      resetForm();
    }} />;
  }

  return (
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-blue-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Membership Registration
        </h2>
        <p className="text-gray-600 text-lg">
          Join our community of faith and regional collaboration
        </p>
      </div>

      {renderProgressBar()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </h3>
            
            {renderPhotoUpload()}
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Full Name *"
                type="text"
                value={formData.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
                error={errors.fullName}
                placeholder="Enter your full name"
              />
              <FormField
                label="Age"
                type="number"
                value={formData.age}
                onChange={(value) => handleInputChange('age', value)}
                placeholder="Enter your age"
                min="16"
                max="100"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status *
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.maritalStatus ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white`}
                >
                  <option value="">Select marital status</option>
                  {maritalStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email}
                placeholder="your.email@example.com"
                icon={<Mail className="h-5 w-5" />}
              />
              <FormField
                label="Phone Number *"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                error={errors.phone}
                placeholder="+231 XXX XXX XXXX"
                icon={<Phone className="h-5 w-5" />}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <CountrySelect
                label="Country *"
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                error={errors.country}
              />
              <FormField
                label="Home Address"
                type="text"
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                placeholder="Enter your home address"
                icon={<MapPin className="h-5 w-5" />}
              />
            </div>
          </div>
        )}

        {/* Step 2: Ministry Information */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
              <Church className="h-5 w-5" />
              <span>Ministry Information</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Church/Organization/Ministry"
                type="text"
                value={formData.churchOrganization}
                onChange={(value) => handleInputChange('churchOrganization', value)}
                placeholder="Name of your church or ministry"
              />
              <FormField
                label="Position/Role"
                type="text"
                value={formData.position}
                onChange={(value) => handleInputChange('position', value)}
                placeholder="e.g., Pastor, Elder, Deacon, Minister"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Educational Level
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select education level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Additional Ministry Information"
              type="textarea"
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
              placeholder="Any additional information about your ministry or role"
              rows={3}
            />
          </div>
        )}

        {/* Step 3: Pastoral Recommendation */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Pastoral Recommendation *</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Recommender Name *"
                type="text"
                value={formData.recommendationName}
                onChange={(value) => handleInputChange('recommendationName', value)}
                error={errors.recommendationName}
                placeholder="Pastor/Leader name"
              />
              <FormField
                label="Contact Information *"
                type="text"
                value={formData.recommendationContact}
                onChange={(value) => handleInputChange('recommendationContact', value)}
                error={errors.recommendationContact}
                placeholder="Email or phone"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="Relationship"
                type="text"
                value={formData.recommendationRelationship}
                onChange={(value) => handleInputChange('recommendationRelationship', value)}
                placeholder="e.g., Senior Pastor, Mentor"
              />
              <FormField
                label="Church/Ministry"
                type="text"
                value={formData.recommendationChurch}
                onChange={(value) => handleInputChange('recommendationChurch', value)}
                placeholder="Name of recommender's church"
              />
            </div>
          </div>
        )}

        {/* Step 4: Purpose and Authorization */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Purpose of Membership *</span>
            </h3>
            
            <FormField
              label="Describe your purpose for joining MARMA"
              type="textarea"
              value={formData.membershipPurpose}
              onChange={(value) => handleInputChange('membershipPurpose', value)}
              error={errors.membershipPurpose}
              placeholder="Please share your motivation for joining and how you hope to contribute to the alliance..."
              rows={4}
            />

            {renderAuthorization()}

            {/* Display generated codes (these will be generated on the server) */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Regional Code:</p>
                <p className="text-sm text-blue-900">Will be generated upon submission</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Identification Number:</p>
                <p className="text-sm text-blue-900">Will be generated upon submission</p>
              </div>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {renderStepButtons()}

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          By registering, you agree to participate in the spirit of unity and faith that defines the 
          Mano River Ministerial Alliance. * Required fields
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
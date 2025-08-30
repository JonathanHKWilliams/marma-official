import React from 'react';
import { CheckCircle, Mail, RefreshCw, X } from 'lucide-react';

interface SuccessMessageProps {
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-blue-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Registration Successful!
        </h2>
        <p className="text-gray-600 text-lg">
          Welcome to the Mano River Ministerial Alliance family
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Confirmation Email Sent</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          Please check your email for a confirmation message with your registration details. 
          Our admin team will review your application and notify you of the approval status.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <X className="h-4 w-4 text-blue-600" />
            {/* <span>Faith</span> */}
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
            {/* <span>Unity</span> */}
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
            {/* <span>Collaboration</span> */}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Register Another Member</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
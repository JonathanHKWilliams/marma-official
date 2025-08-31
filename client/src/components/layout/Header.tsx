import React from 'react';
import CountryFlags from '../ui/CountryFlags';
import marmaLogo from '../../Assets/MARMA Logo.png';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={marmaLogo}
                alt="MARMA Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Mano River Ministerial Alliance
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Unity • Faith • Regional Collaboration
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-blue-900">
              {/* <Users className="h-5 w-5" /> */}
              <span className="font-medium">Membership Registration Form </span>
            </div>
          </div>
        </div>
      </div>
      <CountryFlags />
    </header>
  );
};

export default Header;
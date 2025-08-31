import React from 'react';

const CountryFlags: React.FC = () => {
  const manoRiverCountries = [
    { name: 'Liberia', flag: 'https://flagcdn.com/w80/lr.png', code: 'LR' },
    { name: 'Sierra Leone', flag: 'https://flagcdn.com/w80/sl.png', code: 'SL' },
    { name: 'Guinea', flag: 'https://flagcdn.com/w80/gn.png', code: 'GN' },
    { name: 'Ivory Coast', flag: 'https://flagcdn.com/w80/ci.png', code: 'CI' },
  ];

  return (
    <div className="bg-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8">
          <span className="text-black font-medium text-sm">
            {/* Mano River Union Countries: */}
          </span>
          <div className="flex items-center space-x-4">
            {manoRiverCountries.map((country) => (
              <div key={country.code} className="flex items-center space-x-2 group">
                <img 
                  src={country.flag} 
                  alt={`${country.name} flag`} 
                  className="w-6 h-4 object-cover rounded-100 border border-gray-200 group-hover:scale-110 transition-transform duration-200" 
                />
                <span className="text-black text-sm font-medium- transition-colors duration-200">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryFlags;
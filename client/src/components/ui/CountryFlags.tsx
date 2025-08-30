import React from 'react';

const CountryFlags: React.FC = () => {
  const manoRiverCountries = [
    { name: 'Liberia', flag: '🇱🇷', code: 'LR' },
    { name: 'Sierra Leone', flag: '🇸🇱', code: 'SL' },
    { name: 'Guinea', flag: '🇬🇳', code: 'GN' },
    { name: 'Ivory Coast', flag: '🇨🇮', code: 'CI' },
  ];

  return (
    <div className="bg-blue-900 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8">
          <span className="text-white font-medium text-sm">
            Mano River Union Countries:
          </span>
          <div className="flex items-center space-x-4">
            {manoRiverCountries.map((country) => (
              <div key={country.code} className="flex items-center space-x-2 group">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {country.flag}
                </span>
                <span className="text-white text-sm font-medium group-hover:text-yellow-300 transition-colors duration-200">
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
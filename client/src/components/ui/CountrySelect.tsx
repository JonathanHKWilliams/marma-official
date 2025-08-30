import React from 'react';
import { Globe } from 'lucide-react';

interface CountrySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ label, value, onChange, error }) => {
  const manoRiverCountries = [
    { name: 'Liberia', code: 'LR', flag: '🇱🇷' },
    { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱' },
    { name: 'Guinea', code: 'GN', flag: '🇬🇳' },
    { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
  ];

  const allAfricanCountries = [
    { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
    { name: 'Angola', code: 'AO', flag: '🇦🇴' },
    { name: 'Benin', code: 'BJ', flag: '🇧🇯' },
    { name: 'Botswana', code: 'BW', flag: '🇧🇼' },
    { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫' },
    { name: 'Burundi', code: 'BI', flag: '🇧🇮' },
    { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
    { name: 'Cape Verde', code: 'CV', flag: '🇨🇻' },
    { name: 'Central African Republic', code: 'CF', flag: '🇨🇫' },
    { name: 'Chad', code: 'TD', flag: '🇹🇩' },
    { name: 'Comoros', code: 'KM', flag: '🇰🇲' },
    { name: 'Democratic Republic of the Congo', code: 'CD', flag: '🇨🇩' },
    { name: 'Republic of the Congo', code: 'CG', flag: '🇨🇬' },
    { name: 'Djibouti', code: 'DJ', flag: '🇩🇯' },
    { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
    { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶' },
    { name: 'Eritrea', code: 'ER', flag: '🇪🇷' },
    { name: 'Eswatini', code: 'SZ', flag: '🇸🇿' },
    { name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
    { name: 'Gabon', code: 'GA', flag: '🇬🇦' },
    { name: 'Gambia', code: 'GM', flag: '🇬🇲' },
    { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
    { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼' },
    { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
    { name: 'Lesotho', code: 'LS', flag: '🇱🇸' },
    { name: 'Libya', code: 'LY', flag: '🇱🇾' },
    { name: 'Madagascar', code: 'MG', flag: '🇲🇬' },
    { name: 'Malawi', code: 'MW', flag: '🇲🇼' },
    { name: 'Mali', code: 'ML', flag: '🇲🇱' },
    { name: 'Mauritania', code: 'MR', flag: '🇲🇷' },
    { name: 'Mauritius', code: 'MU', flag: '🇲🇺' },
    { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
    { name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
    { name: 'Namibia', code: 'NA', flag: '🇳🇦' },
    { name: 'Niger', code: 'NE', flag: '🇳🇪' },
    { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
    { name: 'Rwanda', code: 'RW', flag: '🇷🇼' },
    { name: 'São Tomé and Príncipe', code: 'ST', flag: '🇸🇹' },
    { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
    { name: 'Seychelles', code: 'SC', flag: '🇸🇨' },
    { name: 'Somalia', code: 'SO', flag: '🇸🇴' },
    { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
    { name: 'South Sudan', code: 'SS', flag: '🇸🇸' },
    { name: 'Sudan', code: 'SD', flag: '🇸🇩' },
    { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
    { name: 'Togo', code: 'TG', flag: '🇹🇬' },
    { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
    { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
    { name: 'Zambia', code: 'ZM', flag: '🇿🇲' },
    { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Globe className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <option value="">Select your country</option>
          <optgroup label="Mano River Union Countries">
            {manoRiverCountries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Other African Countries">
            {allAfricanCountries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CountrySelect;
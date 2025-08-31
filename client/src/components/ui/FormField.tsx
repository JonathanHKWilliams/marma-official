import React from 'react';

interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'date';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  rows?: number;
  min?: string;
  max?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  icon,
  rows = 3,
  min,
  max
}) => {
  const inputClasses = `w-full px-4 py-3 ${icon ? 'pl-11' : ''} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
    error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={inputClasses}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClasses}
            min={min}
            max={max}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
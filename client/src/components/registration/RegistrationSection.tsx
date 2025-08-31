import React from 'react';
import RegistrationForm from './RegistrationForm';

const RegistrationSection: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-8 lg:items-center">
      <div className="max-w-7xl mx-auto">
        <div className="gap-12 items-center">
          {/* Right side - Registration form */}
          <div className="lg:items-center">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
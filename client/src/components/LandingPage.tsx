import React from 'react';
import Header from './layout/Header';
import RegistrationSection from './registration/RegistrationSection';
import Footer from './layout/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main>
        <RegistrationSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
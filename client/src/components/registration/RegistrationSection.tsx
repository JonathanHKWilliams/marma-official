import React from 'react';
import RegistrationForm from './RegistrationForm';

const RegistrationSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content with image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-yellow-400/10 rounded-3xl"></div>
            <div 
              className="relative h-96 lg:h-[600px] rounded-3xl bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.pexels.com/photos/8674748/pexels-photo-8674748.jpeg?auto=compress&cs=tinysrgb&w=800')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent rounded-3xl"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Join the Unity of Faith
                </h2>
                <p className="text-lg lg:text-xl leading-relaxed opacity-90">
                  Be part of a transformative movement bringing together Christian leaders 
                  across the Mano River Union for fellowship, growth, and regional collaboration.
                </p>
                <div className="mt-6 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {/* <div className="h-2 w-2 bg-yellow-400 rounded-full"></div> */}
                    {/* <span className="text-sm font-medium">Regional Unity</span> */}
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* <div className="h-2 w-2 bg-yellow-400 rounded-full"></div> */}
                    {/* <span className="text-sm font-medium">Spiritual Growth</span> */}
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* <div className="h-2 w-2 bg-yellow-400 rounded-full"></div> */}
                    {/* <span className="text-sm font-medium">Leadership Development</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Registration form */}
          <div className="lg:pl-8">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
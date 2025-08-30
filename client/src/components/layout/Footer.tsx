import React from 'react';
// import { Cross, Heart, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {/* <Cross className="h-6 w-6 text-yellow-400" /> */}
              <h3 className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Mano River Ministerial Alliance
              </h3>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Bringing together Christian leaders across the Mano River Union for 
              fellowship, growth, and regional collaboration in faith.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-yellow-400">Our Mission</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {/* <Heart className="h-4 w-4 text-yellow-400" /> */}
                <span className="text-blue-100">Unity in Faith</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Globe className="h-4 w-4 text-yellow-400" /> */}
                <span className="text-blue-100">Regional Collaboration</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Cross className="h-4 w-4 text-yellow-400" /> */}
                <span className="text-blue-100">Spiritual Growth</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-yellow-400">Contact</h4>
            <div className="space-y-2 text-blue-100">
              <p>Email: info@marma.org</p>
              <p>Phone: +231 XXX XXX XXXX</p>
              <p>Serving: Liberia, Sierra Leone, Guinea, Ivory Coast</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 pt-8 mt-8 text-center">
          <p className="text-blue-200">
            © 2025 Mano River Ministerial Alliance. All rights reserved. 
            {/* <span className="text-yellow-400 font-medium"> Walking in Unity and Faith</span> */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
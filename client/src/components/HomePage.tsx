import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { ArrowRight, Users, Globe, BookOpen, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="h-[40rem] relative flex items-center justify-center py-20 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/10 z-0"></div>
          <div 
            className="absolute inset-0 bg-overlay-200 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1649365810751-270da3b29bc4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
            }}
          ></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Mano River Basin<br /> Christian Fellowship
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10">
              </p>
              <button 
                onClick={handleRegisterClick}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl text-lg flex items-center space-x-2 mx-auto transition-all duration-300 transform hover:scale-105"
              >
                <span>Register as Member</span>
                <ArrowRight className="h-5 w-" />
              </button>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Who we are?</h2>
              <div className="h-1 w-20 bg-yellow-400 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
              <h3 className="text-xl font-bold text-black mb-4">Our Mission Statement</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  To restore our last heritage across border lines.
                </p>

                <h3 className="text-xl font-bold text-black mb-4">Our Goal</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                To engage and strengthen the capacity of those on the walls of our nation and reprogram our social institution for divine intervention and spiritual inoculation.
                </p>
                
                <h3 className="text-xl font-bold text-black mb-4">Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                That the prophetic heritage of our nations will realign with heaven’s blueprint for earthly relevance.
                Therefore, we engage prayerfully in dialogue with minded leaders and strategically position ourselves as change agents.
                </p>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.squarespace-cdn.com/content/v1/5c421a36266c072621f38024/1547852520235-GZAFLAL4FYSPD5XY3LGH/tmpc-newyear-0340.jpg?format=2500w" 
                    alt="Christian Fellowship" 
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-yellow-400 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Our Core Values</h2>
              <div className="h-1 w-20 bg-yellow-400 mx-auto"></div>
            </div>
            {/* <p className="text-gray-700 leading-relaxed mb-6">
            <ul className="list-disc list-inside" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <li>Missions awareness and engagements.</li>
              <li>Leadership Developmental at all levels.</li>
              <li>Mutual Intercessory Consultation.</li>
              <li>Socio economic empowerment.</li>
              <li>Engaging women and girls to arise and uphold values.</li>
            </ul>
            </p> */}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-red-200 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Unity</h3>
                <p className="text-gray-900 opacity-90">
                  Fostering collaboration and harmony among Christian leaders across national boundaries.
                </p>
              </div>
              
              <div className="bg-green-200 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Regional Impact</h3>
                <p className="text-gray-600">
                  Working together to address shared challenges and opportunities in the Mano River region.
                </p>
              </div>
              
              <div className="bg-blue-200 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Spiritual Growth</h3>
                <p className="text-gray-600">
                  Encouraging continuous spiritual development and biblical understanding.
                </p>
              </div>
              
              <div className="bg-yellow-200 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Heart className="h-7 w-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Compassion</h3>
                <p className="text-gray-600">
                  Demonstrating Christ's love through service and care for communities in need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-200 text-blue">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Join Our Fellowship Today</h2>
            <p className="text-lg mb-8 opacity-90 text-gray">
              Be part of a transformative movement bringing together Christian leaders for fellowship, growth, and regional collaboration.
            </p>
            <button 
              onClick={handleRegisterClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold py-3 px-4 rounded-xl text-lg flex items-center space-x-2 mx-auto transition-all duration-300"
            >
              <span>Register as Member</span>
              <ArrowRight className="h- w-5" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

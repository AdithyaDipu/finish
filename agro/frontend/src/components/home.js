import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import homebg from '../images/homepgbg.jpeg';
import marketlogo from '../images/marketplace.png';
import leaflogo from '../images/leafdisease.png';
import croprec from '../images/croprec.png';
import crophealth from '../images/crophealth.png';
import homebg3 from '../images/homebg3.png';
import { UserContext } from '../UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const marketLink = user?.role === 'farmer' ? '/marketplace' : '/marketplace-list';

  // Function to handle navigation with role checks
  const handleNavigation = (path, restricted = false) => {
    if (!user) {
      navigate('/login'); // Redirect to login if not logged in
    } else if (restricted && user.role === 'buyer') {
      alert('Access restricted! Buyers cannot access this service.');
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header
        className="relative h-[504px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50">
          <h1 className="text-4xl font-bold fade-in">
            Turning urban spaces into green oases, and farmers into entrepreneurs.
          </h1>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-12">
        <h2 className="text-center text-3xl font-semibold text-green-500 mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Service 1 - Marketplace (Accessible to all logged-in users) */}
          <div
            className="text-center bg-green-100 p-6 rounded-lg shadow-md cursor-pointer hover:bg-green-200"
            onClick={() => handleNavigation(marketLink)}
          >
            <img src={marketlogo} alt="Market Place" className="mx-auto h-16 w-16 mb-4" />
            <h3 className="text-lg font-semibold text-green-700">Market Place</h3>
          </div>

          {/* Service 2 - Leaf Disease Detection (Accessible to all) */}
          <div
            className="text-center bg-green-100 p-6 rounded-lg shadow-md cursor-pointer hover:bg-green-200"
            onClick={() => navigate('/plant-disease')}
          >
            <img src={leaflogo} alt="Leaf Disease Detection" className="mx-auto h-16 w-16 mb-4" />
            <h3 className="text-lg font-semibold text-green-700">Leaf Disease Detection</h3>
          </div>

          {/* Service 3 - Crop Recommendation (Restricted for buyers) */}
          <div
            className="text-center bg-green-100 p-6 rounded-lg shadow-md cursor-pointer hover:bg-green-200"
            onClick={() => handleNavigation('/createproj', true)}
          >
            <img src={croprec} alt="Crop Recommendation" className="mx-auto h-16 w-16 mb-4" />
            <h3 className="text-lg font-semibold text-green-700">Crop Recommendation for Rooftop</h3>
          </div>

          {/* Service 4 - Soil Health Monitoring (Restricted for buyers) */}
          <div
            className="text-center bg-green-100 p-6 rounded-lg shadow-md cursor-pointer hover:bg-green-200"
            onClick={() => handleNavigation('/soilhealth', true)}
          >
            <img src={crophealth} alt="Soil Health Monitoring" className="mx-auto h-16 w-16 mb-4" />
            <h3 className="text-lg font-semibold text-green-700">Soil Health Monitoring System</h3>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-green-500 mb-6 text-center md:text-left">
              How It Works
            </h2>
            <ul className="list-disc list-inside text-green-600 text-lg space-y-2">
              <li>Sign-up to the platform</li>
              <li>Get Crop Recommendations</li>
              <li>Monitor Soil Health</li>
              <li>Detect Leaf Diseases</li>
              <li>Sell Your Products</li>
              <li>Stay Informed</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <img src={homebg3} alt="How It Works" className="w-3/4 md:w-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-green-500 font-semibold mb-4">MENU</h3>
            <ul className="text-green-600 space-y-2">
              <li>Home</li>
              <li>Market</li>
              <li>Crop Recommendation</li>
              <li>Soil Health Monitoring</li>
              <li>Leaf Disease Detection</li>
            </ul>
          </div>
          <div>
            <h3 className="text-green-500 font-semibold mb-4">CONTACT US</h3>
            <ul className="text-green-600 space-y-2">
              <li><span role="img" aria-label="Phone">📞</span> 8075207598</li>
              <li><span role="img" aria-label="Email">✉</span> agroassist@gmail.com</li>
              <li className="flex space-x-4">
                <a href="#" className="text-green-600"><span role="img" aria-label="Facebook">🌐</span></a>
                <a href="#" className="text-green-600"><span role="img" aria-label="LinkedIn">🔗</span></a>
                <a href="#" className="text-green-600"><span role="img" aria-label="Instagram">📸</span></a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
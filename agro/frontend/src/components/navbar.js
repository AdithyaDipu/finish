import React, { useContext, useState } from 'react';
import logo from '../images/agrologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import ContactPopup from './ContactPopup';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const marketLink = user?.role === "farmer" ? "/marketplace" : "/marketplace-list";

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black text-white flex items-center justify-between p-4">
      <div className="flex items-center pl-5">
        <img src={logo} alt="Agroassist Logo" className="h-8 w-8 mr-2" />
        <span className="text-2xl font-bold text-green-400 font-jeju">AGROASSIST</span>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="hover:text-green-300">Home</Link>
        </li>
        <li>
          <a href="#menu" className="hover:text-green-300">Menu</a>
        </li>
        <li>
          <Link to="/about" className="hover:text-green-300">About Us</Link>
        </li>
        <li>
          <Link to={marketLink} className="hover:text-green-300 ml-5">Market</Link>
        </li>
        <li>
          <button onClick={() => setIsPopupOpen(true)} className="hover:text-green-300">Contact</button>
        </li>
      </ul>
      <div>
        {user ? (
          <>
            <span className="mr-4">{`Welcome, ${user.firstName}`}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-300 ml-5">Login</Link>
            <Link to="/signup" className="hover:text-green-300 ml-5">Sign Up</Link>
          </>
        )}
      </div>
      <ContactPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </nav>
  );
};

export default Navbar;

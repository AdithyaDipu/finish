import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home'; // Import the Home component
import SignUp from './components/signup';
import Navbar from './components/navbar';
import Login from './components/login';
import { UserProvider } from './UserContext';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import Marketplace from './components/marketplace';
import MarketplaceList from './components/marketplacelist';
import AdminDashboard from './components/admindash';
import UserCrops from './components/usercrops';
import AboutUs from './components/about';
import ProjectSelection from './components/divide';
import AgroAssistant from './components/AgroAssistant';
import ProjectEntries from './components/desc';
import SoilDataPage from './components/iot';

const App = () => {
  return (
    <UserProvider>
    <Router>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace-list" element={<MarketplaceList />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users/:userId" element={<UserCrops />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/createproj" element={<ProjectSelection />} />
      <Route path="/croprec" element={< AgroAssistant/>} />
      <Route path="/existproj" element={< ProjectEntries/>} />
      <Route path="/soilhealth" element={<SoilDataPage />} />
    </Routes>
  </Router>
  </UserProvider>
  );
};

export default App;

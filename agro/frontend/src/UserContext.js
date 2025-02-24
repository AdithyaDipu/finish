import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    console.log('User logged in:', userData); // Debugging log

    const formattedUser = {
      _id: userData._id, // Correct _id
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
    };

    setUser(formattedUser);
    localStorage.setItem('user', JSON.stringify(formattedUser)); // Persist in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear from localStorage
  };

  // Update localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
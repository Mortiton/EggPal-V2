"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, login } from '../services/authService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null); // Ensure user is set to null if there's an error
      }
    };

    fetchUser();
  }, []);

  

  const handleLogin = async (values) => {
    try {
      await login(values);
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/auth/signout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
      } else {
        console.error('Failed to logout:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogin, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

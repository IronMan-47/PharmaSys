import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`}/api/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('adminToken', response.data.token);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid username or password' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

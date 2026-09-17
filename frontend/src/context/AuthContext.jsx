import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        setToken(response.data.token);
        sessionStorage.setItem('adminToken', response.data.token);
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
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminToken'); // Just in case an old one is stuck
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getUser();
    setIsAuthenticated(!!token);
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data && data.token) {
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      return data;
    }
    throw new Error('Login failed: Invalid response from server');
  };

  const register = async (registerData) => {
    const data = await authService.register(registerData);
    if (data && data.token) {
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      return data;
    }
    throw new Error('Registration failed: Invalid response from server');
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

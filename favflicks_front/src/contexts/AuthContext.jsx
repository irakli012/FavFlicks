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
    let user = authService.getUser();
    
    if (token && user) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        user = {
          ...user,
          id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid,
          roles: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || []
        };
        // Ensure roles is an array
        if (!Array.isArray(user.roles)) user.roles = [user.roles];
      } catch (e) {
        console.error("Failed to parse token", e);
      }
    }
    
    setIsAuthenticated(!!token);
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data && data.token) {
      let user = data.user;
      try {
        const decoded = JSON.parse(atob(data.token.split('.')[1]));
        user = {
          ...user,
          id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid,
          roles: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || []
        };
        if (!Array.isArray(user.roles)) user.roles = [user.roles];
      } catch (e) {
        console.error("Failed to parse token", e);
      }
      setIsAuthenticated(true);
      setCurrentUser(user);
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

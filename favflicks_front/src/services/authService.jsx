// src/services/authService.jsx
const API_BASE_URL = 'https://localhost:7245/api/Auth';

const authService = {
  getToken: () => localStorage.getItem('token'),
  getUser: () => JSON.parse(localStorage.getItem('user')),

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Registration failed');

    const result = await response.json();
    localStorage.setItem('token', result.token);
    
    // Create a user object with consistent structure
    const user = {
      userName: data.username,
      email: data.email
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      ...result,
      user: user
    };
  },

  logout: () => {
    localStorage.clear();
  },
};

export default authService;

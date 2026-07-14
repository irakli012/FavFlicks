// src/services/authService.jsx
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/Auth`;

const authService = {
  getToken: () => localStorage.getItem('token'),
  getUser: () => JSON.parse(localStorage.getItem('user')),

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = 'Login failed';
      if (text) {
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            errorMessage = json.map(e => e.description || e.errorMessage || JSON.stringify(e)).join(', ');
          } else if (json.errors) {
            errorMessage = Object.values(json.errors).flat().join(', ');
          } else {
            errorMessage = json.message || json.title || text;
          }
        } catch {
          errorMessage = text;
        }
      }
      throw new Error(errorMessage);
    }

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

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = 'Registration failed';
      if (text) {
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            errorMessage = json.map(e => e.description || e.errorMessage || JSON.stringify(e)).join(', ');
          } else if (json.errors) {
            errorMessage = Object.values(json.errors).flat().join(', ');
          } else {
            errorMessage = json.message || json.title || text;
          }
        } catch {
          errorMessage = text;
        }
      }
      throw new Error(errorMessage);
    }

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

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = 'Forgot password failed';
      try {
        const json = JSON.parse(text);
        errorMessage = json.message || text;
      } catch {
        errorMessage = text;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  resetPassword: async (data) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = 'Reset password failed';
      try {
        const json = JSON.parse(text);
        if (json.message) errorMessage = json.message;
        else errorMessage = text;
      } catch {
        errorMessage = text;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  logout: () => {
    localStorage.clear();
  },
};

export default authService;

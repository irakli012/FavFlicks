import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { id: 'userName', label: 'Username' },
    { id: 'password', label: 'Password', type: 'password' }
  ];

  return (
    <AuthForm
      title="Login"
      fields={fields}
      values={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      isLoading={isLoading}
    >
      <div className="mt-4 text-center">
        <Link to="/forgot-password" className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
          Forgot Password?
        </Link>
      </div>
    </AuthForm>
  );
};

export default LoginPage;
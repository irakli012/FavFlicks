import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await authService.forgotPassword(formData.email);
      // For development, backend returns the token directly.
      if (response.token) {
        // Redirect to reset password page with email and token pre-filled
        navigate(`/reset-password?email=${encodeURIComponent(formData.email)}&token=${encodeURIComponent(response.token)}`);
      } else {
        // If not returning token, we'd normally just show a success message.
        alert(response.message || 'Check your email for the reset link.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { id: 'email', label: 'Email', type: 'email' }
  ];

  return (
    <AuthForm
      title="Forgot Password"
      fields={fields}
      values={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      isLoading={isLoading}
    />
  );
};

export default ForgotPasswordPage;

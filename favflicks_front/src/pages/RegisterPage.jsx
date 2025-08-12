import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [registerDto, setRegisterDto] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegisterDto({
      ...registerDto,
      [e.target.id]: e.target.value
    });
  };

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerDto.password !== registerDto.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registrationData } = registerDto;
      await register(registrationData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { id: 'username', label: 'Username' },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'password', label: 'Password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password' }
  ];

  return (
    <AuthForm
      title="Register"
      fields={fields}
      values={registerDto}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      isLoading={isLoading}
    />
  );
};

export default RegisterPage;
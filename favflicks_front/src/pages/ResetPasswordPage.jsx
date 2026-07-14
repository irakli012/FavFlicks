import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const ResetPasswordPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [formData, setFormData] = useState({
    email: queryParams.get('email') || '',
    token: queryParams.get('token') || '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...resetData } = formData;
      await authService.resetPassword(resetData);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // We hide the token field in the form array since the user shouldn't edit it.
  const fields = [
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'newPassword', label: 'New Password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password' }
  ];

  return (
    <>
      <AuthForm
        title="Reset Password"
        fields={fields}
        values={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      >
          {/* Hidden token field */}
          <input type="hidden" id="token" value={formData.token} />
      </AuthForm>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2a2121] p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-white/10 transform transition-all text-center animate-fade-in-up">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100/10 mb-4">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
            <p className="text-gray-300 mb-6 text-sm">Your password has been successfully updated. Please login with your new password to continue.</p>
            <div className="flex justify-center gap-3">
              <Link 
                to="/login"
                className="w-full px-6 py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(232,38,38,0.4)]"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPasswordPage;

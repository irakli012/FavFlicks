import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRequiredModal = ({ isOpen, onClose, title = "Login Required", message = "You need to log in or register to request Watch With sessions with your friends!" }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#241a1a] border border-[#382929] rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl relative transform transition-all scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="size-16 rounded-full bg-[#e82626]/20 border border-[#e82626]/40 flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-red-500/20">
          🍿
        </div>

        {/* Header */}
        <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="w-full py-3 px-6 rounded-xl bg-[#e82626] hover:bg-[#ff3b3b] text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
          >
            Log In
          </button>
          
          <button
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            className="w-full py-3 px-6 rounded-xl bg-[#382929] hover:bg-[#4a3636] text-white font-bold text-sm border border-white/10 transition-all hover:scale-[1.02]"
          >
            Create New Account
          </button>

          <button
            onClick={onClose}
            className="mt-1 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;

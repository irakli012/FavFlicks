// components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  console.log(currentUser);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#382929] px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Your logo SVG */}
            </svg>
          </div>
          <Link to="/" className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            FavFlicks
          </Link>
        </div>
        <div className="flex items-center gap-9">
          <Link to="/" className="text-white text-sm font-medium leading-normal">Home</Link>
          <Link to="/movies" className="text-white text-sm font-medium leading-normal">Movies</Link>
          <Link to="/tv-shows" className="text-white text-sm font-medium leading-normal">TV Shows</Link>
          <Link to="/feed" className="text-white text-sm font-normal leading-normal">Feed</Link>
          {isAuthenticated && (
            <Link to="/profile" className="text-white text-sm font-medium leading-normal">Profile</Link>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 justify-end gap-8">
        {/* Search bar */}
        <label className="flex flex-col min-w-40 !h-10 max-w-64" htmlFor="search-header">
          {/* Your search input */}
        </label>
        
        {/* Auth buttons */}
        <div className="flex gap-2 items-center">
          {isAuthenticated ? (
            <>
              <div className="text-white mr-4">
                Welcome, {currentUser?.userName || currentUser?.username || 'User'}!
              </div>
              <button
                onClick={handleLogout}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e82626] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e82626] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Register</span>
              </Link>
              <Link
                to="/login"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#382929] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
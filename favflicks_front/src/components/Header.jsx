import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#382929] px-4 md:px-10 py-3 glass-panel">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Your logo SVG */}
            </svg>
          </div>
          <Link to="/" className="text-white text-lg font-bold leading-tight tracking-[-0.015em] hover:text-[#e82626] transition-colors">
            FavFlicks
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9">
          <Link to="/" className="text-white text-sm font-medium hover:text-[#e82626] transition-colors">Home</Link>
          <Link to="/movies" className="text-white text-sm font-medium hover:text-[#e82626] transition-colors">Movies</Link>
          <Link to="/tv-shows" className="text-white text-sm font-medium hover:text-[#e82626] transition-colors">TV Shows</Link>
          <Link to="/feed" className="text-white text-sm font-medium hover:text-[#e82626] transition-colors">Feed</Link>
          {isAuthenticated && (
            <>
              <Link to="/profile" className="text-white text-sm font-medium hover:text-[#e82626] transition-colors">Profile</Link>
              {currentUser?.roles?.includes('Admin') && (
                <Link to="/admin" className="text-white text-sm font-medium hover:text-[#e82626] transition-colors">Admin Dashboard</Link>
              )}
            </>
          )}
        </nav>
      </div>
      
      <div className="flex flex-1 justify-end gap-8 items-center">
        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Auth buttons */}
        <div className="hidden md:flex gap-2 items-center">
          {isAuthenticated ? (
            <>
              <div className="text-white mr-4 text-sm">
                Welcome, <span className="font-semibold text-[#e82626]">{currentUser?.userName || currentUser?.username || 'User'}</span>!
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center rounded-full h-10 px-6 bg-[#e82626] hover:bg-[#ff3b3b] text-white text-sm font-bold transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(232,38,38,0.4)]"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center justify-center rounded-full h-10 px-6 bg-[#e82626] hover:bg-[#ff3b3b] text-white text-sm font-bold transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(232,38,38,0.4)]"
              >
                <span>Register</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-full h-10 px-6 bg-[#382929] hover:bg-[#4a3636] text-white text-sm font-bold transition-all hover:scale-105"
              >
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#181111]/95 backdrop-blur-xl border-b border-[#382929] flex flex-col p-4 gap-4 md:hidden shadow-2xl z-50">
          <Link to="/" onClick={closeMenu} className="text-white text-base font-medium p-2 hover:bg-[#2a1b1b] rounded-lg transition-colors">Home</Link>
          <Link to="/movies" onClick={closeMenu} className="text-white text-base font-medium p-2 hover:bg-[#2a1b1b] rounded-lg transition-colors">Movies</Link>
          <Link to="/tv-shows" onClick={closeMenu} className="text-white text-base font-medium p-2 hover:bg-[#2a1b1b] rounded-lg transition-colors">TV Shows</Link>
          <Link to="/feed" onClick={closeMenu} className="text-white text-base font-medium p-2 hover:bg-[#2a1b1b] rounded-lg transition-colors">Feed</Link>
          {isAuthenticated && (
            <>
              <Link to="/profile" onClick={closeMenu} className="text-white text-base font-medium p-2 hover:bg-[#2a1b1b] rounded-lg transition-colors">Profile</Link>
              {currentUser?.roles?.includes('Admin') && (
                <Link to="/admin" onClick={closeMenu} className="text-white text-base font-medium p-2 hover:bg-[#2a1b1b] rounded-lg transition-colors">Admin Dashboard</Link>
              )}
            </>
          )}
          <hr className="border-[#382929] my-2" />
          {isAuthenticated ? (
             <div className="flex flex-col gap-4">
                <div className="text-white text-sm px-2">
                  Welcome, <span className="font-semibold text-[#e82626]">{currentUser?.userName || currentUser?.username || 'User'}</span>!
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center rounded-lg h-12 bg-[#e82626] text-white font-bold w-full transition-colors active:bg-[#ff3b3b]"
                >
                  Logout
                </button>
             </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-lg h-12 bg-[#e82626] text-white font-bold w-full transition-colors active:bg-[#ff3b3b]"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-lg h-12 bg-[#382929] text-white font-bold w-full transition-colors active:bg-[#4a3636]"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
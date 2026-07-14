import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';

const AdminDashboardPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [pendingMovies, setPendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = currentUser?.roles?.includes('Admin');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }

    fetchPendingMovies();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchPendingMovies = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending movies');
      }

      const data = await response.json();
      setPendingMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (movieId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/${movieId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} movie`);
      }

      // Remove from list
      setPendingMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-20 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-400 mb-8">Review and approve custom movie submissions.</p>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e82626]"></div>
        </div>
      ) : pendingMovies.length === 0 ? (
        <div className="text-center py-16 bg-[#181111]/50 rounded-2xl border border-[#382929]">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-300">No Pending Movies</h2>
          <p className="text-gray-500 mt-2">All submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pendingMovies.map(movie => (
            <div key={movie.id} className="bg-[#2a1b1b] rounded-xl overflow-hidden border border-[#382929] flex flex-col">
              <div className="relative aspect-[2/3] w-full">
                {movie.imagePath ? (
                  <img src={movie.imagePath} alt={movie.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#181111] text-gray-500 text-sm">
                    No Poster
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{movie.description}</p>
                
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => handleAction(movie.id, 'approve')}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(movie.id, 'reject')}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

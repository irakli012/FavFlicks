import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AddMoviePage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imagePath: '',
    releaseDate: '',
    youTubeTrailerUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

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
    setSuccess(false);

    try {
      let extractedId = null;
      if (formData.youTubeTrailerUrl) {
        const urlParams = new URLSearchParams(new URL(formData.youTubeTrailerUrl).search);
        extractedId = urlParams.get('v') || formData.youTubeTrailerUrl.split('/').pop();
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          imagePath: formData.imagePath,
          releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : null,
          youTubeTrailerId: extractedId
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to submit movie.');
      }

      setSuccess(true);
      setFormData({ name: '', description: '', imagePath: '', releaseDate: '', youTubeTrailerUrl: '' });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = currentUser?.roles?.includes('Admin');

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-20 min-h-screen text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add Custom Movie</h1>
        <p className="text-gray-400 mb-8">
          Submit a movie that isn't available on TMDB. 
          {!isAdmin && " Note: Your submission will require Admin approval before it appears on the website."}
        </p>

        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 p-4 rounded-xl mb-6">
            {isAdmin 
              ? "Movie added successfully! It is now visible on the website." 
              : "Movie submitted successfully! It will appear on the website once an Admin approves it."}
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#181111]/50 p-6 md:p-8 rounded-2xl border border-[#382929]">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Movie Title *</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#2a1b1b] border border-[#382929] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e82626] transition-all"
              placeholder="Enter movie title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#2a1b1b] border border-[#382929] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e82626] transition-all resize-none"
              placeholder="Enter movie description"
            />
          </div>

          <div>
            <label htmlFor="imagePath" className="block text-sm font-medium text-gray-300 mb-2">Poster Image URL</label>
            <input
              type="url"
              id="imagePath"
              value={formData.imagePath}
              onChange={handleChange}
              className="w-full bg-[#2a1b1b] border border-[#382929] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e82626] transition-all"
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
            <input
              type="date"
              id="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="w-full bg-[#2a1b1b] border border-[#382929] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e82626] transition-all"
            />
          </div>

          <div>
            <label htmlFor="youTubeTrailerUrl" className="block text-sm font-medium text-gray-300 mb-2">YouTube Trailer URL</label>
            <input
              type="url"
              id="youTubeTrailerUrl"
              value={formData.youTubeTrailerUrl}
              onChange={handleChange}
              className="w-full bg-[#2a1b1b] border border-[#382929] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e82626] transition-all"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e82626] hover:bg-[#ff3b3b] text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(232,38,38,0.4)]"
          >
            {isLoading ? 'Submitting...' : 'Submit Movie'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMoviePage;

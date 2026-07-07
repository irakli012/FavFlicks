const API_URL = import.meta.env.VITE_API_BASE_URL;

const ratingService = {
  getRatingsForMovie: async (movieId) => {
    const response = await fetch(`${API_URL}/api/Ratings/movie/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ratings');
    }
    return response.json();
  },

  getCurrentUserRating: async (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/api/Ratings/movie/${movieId}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 404) return null; // No rating found for user
    if (!response.ok) throw new Error('Failed to fetch user rating');
    
    return response.json();
  },

  addOrUpdateRating: async (movieId, value) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/Ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId, value }) // Value should be 1-10 enum equivalent
    });

    if (!response.ok) {
      throw new Error('Failed to submit rating');
    }
  }
};

export default ratingService;

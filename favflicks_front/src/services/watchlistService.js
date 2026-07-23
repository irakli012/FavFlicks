const API_URL = import.meta.env.VITE_API_BASE_URL;

const watchlistService = {
  getWatchlist: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/WatchLater`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch watchlist');
    }
    return response.json();
  },

  checkWatchlist: async (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) return { inWatchlist: false };
    const response = await fetch(`${API_URL}/api/WatchLater/check/${movieId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      return { inWatchlist: false };
    }
    return response.json();
  },

  addToWatchlist: async (movieId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/WatchLater/${movieId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('401_UNAUTHORIZED');
      throw new Error('Failed to add to watchlist');
    }
    return response.json();
  },

  removeFromWatchlist: async (movieId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/WatchLater/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('401_UNAUTHORIZED');
      throw new Error('Failed to remove from watchlist');
    }
  }
};

export default watchlistService;

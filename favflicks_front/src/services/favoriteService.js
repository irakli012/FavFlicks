const API_URL = import.meta.env.VITE_API_BASE_URL;

const favoriteService = {
  getFavorites: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/Favorites/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    return response.json();
  },

  checkFavorite: async (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) return { isFavorite: false };
    const response = await fetch(`${API_URL}/api/Favorites/check/${movieId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      return { isFavorite: false };
    }
    return response.json();
  },

  addFavorite: async (movieId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/Favorites/${movieId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('401_UNAUTHORIZED');
      throw new Error('Failed to add to favorites');
    }
    return response.json();
  },

  removeFavorite: async (movieId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/Favorites/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('401_UNAUTHORIZED');
      throw new Error('Failed to remove from favorites');
    }
  }
};

export default favoriteService;

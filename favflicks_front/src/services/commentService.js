const API_URL = import.meta.env.VITE_API_BASE_URL;

const commentService = {
  getCommentsByMovieId: async (movieId) => {
    const response = await fetch(`${API_URL}/api/Comments?movie=${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return response.json();
  },

  addComment: async (movieId, content) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/Comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId, content })
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    return response.json();
  },

  updateComment: async (id, movieId, content) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/Comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, movieId, content })
    });

    if (!response.ok) {
      throw new Error('Failed to update comment');
    }
    return response.json();
  },

  deleteComment: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/Comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  }
};

export default commentService;

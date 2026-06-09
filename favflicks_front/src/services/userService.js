const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const userService = {
    searchUsers: async (query) => {
        if (!query) return [];
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to search users');
        return await response.json();
    }
};

export default userService;

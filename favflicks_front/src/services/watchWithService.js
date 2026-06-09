const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/watchwith`;

const watchWithService = {
    getWatchWiths: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(API_BASE_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch watch with list');
        return await response.json();
    },
    
    addWatchWith: async (targetUserId, movieId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ targetUserId, movieId })
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to add watch with');
        }
        return await response.json();
    },
    
    removeWatchWith: async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to remove watch with');
        return true;
    },

    updateWatchWithStatus: async (id, status) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${id}/status`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update watch with status');
        return true;
    }
};

export default watchWithService;

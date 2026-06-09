const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/friends`;

const friendService = {
    getFriends: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(API_BASE_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch friends');
        return await response.json();
    },
    
    getPendingRequests: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch pending requests');
        return await response.json();
    },

    sendRequest: async (targetUserId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/request/${targetUserId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to send request');
        }
        return await response.json();
    },

    acceptRequest: async (requesterId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/accept/${requesterId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to accept request');
        }
        return await response.json();
    },
    
    removeFriendOrRequest: async (otherUserId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${otherUserId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to remove friend');
        return true;
    }
};

export default friendService;

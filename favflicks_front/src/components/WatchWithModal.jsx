import React, { useState, useEffect } from 'react';
import friendService from '../services/friendService';
import watchWithService from '../services/watchWithService';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const WatchWithModal = ({ isOpen, onClose, onAddSuccess }) => {
    const { currentUser } = useAuth();
    const [step, setStep] = useState(1); // 1: Search User, 2: Search Movie
    const [userQuery, setUserQuery] = useState('');
    const [movieQuery, setMovieQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [userResults, setUserResults] = useState([]);
    const [movieResults, setMovieResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setUserQuery('');
            setMovieQuery('');
            setUserResults([]);
            setFriends([]);
            setSelectedUser(null);
            setSelectedMovie(null);
            setError(null);
            fetchFriends();
        }
    }, [isOpen]);

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const data = await friendService.getFriends();
            setFriends(data);
            setUserResults(data); // initially show all friends
            setError(null);
        } catch (err) {
            setError('Failed to load friends.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchUser = (e) => {
        e.preventDefault();
        if (!userQuery.trim()) {
            setUserResults(friends);
            return;
        }
        const query = userQuery.toLowerCase();
        const filtered = friends.filter(f => {
            const name = f.requesterId === currentUser?.id ? f.addresseeUsername : f.requesterUsername;
            return name.toLowerCase().includes(query);
        });
        setUserResults(filtered);
    };

    const handleSearchMovie = async (e) => {
        e.preventDefault();
        if (!movieQuery.trim()) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/movies/search?query=${encodeURIComponent(movieQuery)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to search movies');
            const data = await response.json();
            setMovieResults(data);
            setError(null);
        } catch (err) {
            setError('Failed to search movies.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedUser || !selectedMovie) return;
        setIsLoading(true);
        try {
            // Check if movie needs to be imported first
            let movieId = selectedMovie.id;
            if (selectedMovie.source === 1) { // 1 is MovieSource.TMDB
                const token = localStorage.getItem('token');
                const importRes = await fetch(`${API_BASE_URL}/api/movies/tmdb/${selectedMovie.externalId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!importRes.ok) throw new Error('Failed to import movie');
                const importData = await importRes.json();
                movieId = importData.id;
            }

            await watchWithService.addWatchWith(selectedUser.id, movieId);
            onAddSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to add watch with item.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Watch With A Friend</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

                {step === 1 && (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <h3 className="text-lg text-white font-bold mb-2">Step 1: Select a Friend</h3>
                        <form onSubmit={handleSearchUser} className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                value={userQuery} 
                                onChange={(e) => {
                                    setUserQuery(e.target.value);
                                    if(e.target.value === '') setUserResults(friends);
                                }}
                                placeholder="Search your friends..." 
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500"
                            />
                            <button type="submit" disabled={isLoading} className="bg-red-600 px-4 py-2 rounded-xl text-white font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
                                Search
                            </button>
                        </form>
                        
                        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-2">
                            {userResults.length === 0 && !isLoading && (
                                <p className="text-white/50 text-center py-8">
                                    {friends.length === 0 ? "You haven't added any friends yet." : "No friends found matching your search."}
                                </p>
                            )}
                            {userResults.map(friend => {
                                const friendId = friend.requesterId === currentUser?.id ? friend.addresseeId : friend.requesterId;
                                const friendName = friend.requesterId === currentUser?.id ? friend.addresseeUsername : friend.requesterUsername;
                                return (
                                <div 
                                    key={friend.id} 
                                    onClick={() => {
                                        setSelectedUser({ id: friendId, userName: friendName });
                                        setStep(2);
                                        setError(null);
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:border-red-500/50 hover:bg-white/5 cursor-pointer transition-all"
                                >
                                    <div className="size-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold uppercase">
                                        {friendName.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">{friendName}</span>
                                        <span className="text-white/50 text-xs">Friends since {new Date(friend.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 text-sm text-white/50">
                            <button onClick={() => setStep(1)} className="hover:text-red-500 transition-colors flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Back
                            </button>
                            <span>| Watching with <strong className="text-red-500">{selectedUser?.userName}</strong></span>
                        </div>
                        
                        <h3 className="text-lg text-white font-bold mb-2">Step 2: Find a Movie</h3>
                        <form onSubmit={handleSearchMovie} className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                value={movieQuery} 
                                onChange={(e) => setMovieQuery(e.target.value)}
                                placeholder="Search for a movie..." 
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500"
                            />
                            <button type="submit" disabled={isLoading} className="bg-red-600 px-4 py-2 rounded-xl text-white font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
                                Search
                            </button>
                        </form>

                        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-2">
                            {movieResults.length === 0 && movieQuery && !isLoading && (
                                <p className="text-white/50 text-center py-8">No movies found.</p>
                            )}
                            {movieResults.map(movie => {
                                const isSelected = movie.externalId 
                                    ? selectedMovie?.externalId === movie.externalId 
                                    : selectedMovie?.id === movie.id;
                                
                                return (
                                <div 
                                    key={movie.externalId || movie.id} 
                                    onClick={() => setSelectedMovie(isSelected ? null : movie)}
                                    className={`flex gap-3 p-2 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-red-500 bg-red-600/10' : 'border-white/5 hover:border-red-500/50 hover:bg-white/5'}`}
                                >
                                    <div 
                                        className="w-12 rounded-lg aspect-[2/3] bg-cover bg-center"
                                        style={{backgroundImage: `url('${movie.imagePath}')`}}
                                    ></div>
                                    <div className="flex flex-col justify-center flex-1">
                                        <h4 className="text-white font-bold text-sm line-clamp-1">{movie.name}</h4>
                                        <p className="text-white/50 text-xs">
                                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}
                                        </p>
                                    </div>
                                    {isSelected ? (
                                        <div className="flex items-center text-red-500 px-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                                        </div>
                                    ) : null}
                                </div>
                            )})}
                        </div>

                        {selectedMovie && (
                            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isLoading}
                                    className="bg-red-600 px-6 py-3 rounded-xl text-white font-bold hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-500/20 w-full"
                                >
                                    {isLoading ? 'Adding...' : `Add to Watch With ${selectedUser?.userName}`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchWithModal;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import watchWithService from '../services/watchWithService';
import friendService from '../services/friendService';
import userService from '../services/userService';
import watchlistService from '../services/watchlistService';
import favoriteService from '../services/favoriteService';
import WatchWithModal from '../components/WatchWithModal';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('watchlist');
  const [realWatchlist, setRealWatchlist] = useState([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  const [realFavorites, setRealFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [watchWithList, setWatchWithList] = useState([]);
  const [showWatchWithModal, setShowWatchWithModal] = useState(false);
  const [isLoadingWatchWith, setIsLoadingWatchWith] = useState(false);

  // Friends state
  const [friendsList, setFriendsList] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [sentRequests, setSentRequests] = useState({});

  useEffect(() => {
    if (activeTab === 'watchlist') {
      fetchWatchlist();
    } else if (activeTab === 'favorites') {
      fetchFavorites();
    } else if (activeTab === 'watch with') {
      fetchWatchWiths();
    } else if (activeTab === 'friends') {
      fetchFriendsData();
    }
  }, [activeTab]);

  const fetchWatchlist = async () => {
    setIsLoadingWatchlist(true);
    try {
      const data = await watchlistService.getWatchlist();
      setRealWatchlist(data);
    } catch (err) {
      console.error("Failed to load watchlist", err);
    } finally {
      setIsLoadingWatchlist(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistService.removeFromWatchlist(movieId);
      setRealWatchlist(prev => prev.filter(item => item.movieId !== movieId));
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
    }
  };

  const fetchFavorites = async () => {
    setIsLoadingFavorites(true);
    try {
      const data = await favoriteService.getFavorites();
      setRealFavorites(data);
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const handleRemoveFromFavorites = async (movieId) => {
    try {
      await favoriteService.removeFavorite(movieId);
      setRealFavorites(prev => prev.filter(item => item.movieId !== movieId));
    } catch (err) {
      console.error("Failed to remove from favorites", err);
    }
  };

  const fetchWatchWiths = async () => {
    setIsLoadingWatchWith(true);
    try {
      const data = await watchWithService.getWatchWiths();
      setWatchWithList(data);
    } catch (err) {
      console.error("Failed to load Watch With list", err);
    } finally {
      setIsLoadingWatchWith(false);
    }
  };

  const fetchFriendsData = async () => {
    setIsLoadingFriends(true);
    try {
      const friends = await friendService.getFriends();
      const pending = await friendService.getPendingRequests();
      setFriendsList(friends);
      setPendingRequests(pending);
    } catch (err) {
      console.error("Failed to load friends data", err);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    if (!userSearchQuery.trim()) return;
    setIsSearchingUsers(true);
    try {
      const results = await userService.searchUsers(userSearchQuery);
      // Filter out self and existing friends/requests from results
      const filtered = results.filter(u => 
        u.id !== currentUser?.id && 
        !friendsList.some(f => f.requesterId === u.id || f.addresseeId === u.id) &&
        !pendingRequests.some(p => p.requesterId === u.id || p.addresseeId === u.id)
      );
      setUserSearchResults(filtered);
    } catch (err) {
      console.error("Failed to search users", err);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Sample data for demonstration
  const profileData = {
    name: currentUser?.userName || 'User',
    location: 'New York, NY',
    joinDate: 'May 2021',
    bio: 'Binging the classics and hunting for the next indie gem. 🍿',
    stats: {
      moviesWatched: 124,
      followers: 1200,
      following: 45,
      reviewsWritten: 82
    },
    watchlist: [
      { id: 1, title: 'The Godfather', year: 1972, genre: 'Crime, Drama', rating: 9.2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZaZ7HJonPRoRQbF6cqPpKNFhWFCtoVkW4uev842VY6tlmzr1aa2Ikd3WF3p9mJPxx5_rB3Am1hiyQ21sF2S7VL6P9TqXqdFo2oD3TOEuJ4NLS8VkDTAakVryzHzFRDJrcHwiT3Ln0zntOuJpSb4PIsCIg2bwmFTBXrlzdJPon1ddAK0kUtBkGCD7ugrgP2LWTutEjrg7vtA9WfxaQLfLAcXlewm0-DEalYFLNRjihec1zyMnstYwtNyf-FXy4s8tbfE_Aluz_8dbX' },
      { id: 2, title: 'Interstellar', year: 2014, genre: 'Sci-Fi, Adventure', rating: 8.7, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4RdtKjeJGkTAvz8ZymHGYLFFvs5ifT_ORDMEfZGa3ey8tiBa5fs3gMc_lopBreLk-XDeIqK9L5KfGOE1SQj-7z1NRrhJkqiVVyXPRZ3X4A9_TN5gbh14mbfSvzsmLSw7dzU7hWjMZh-l2zIYbhyQZFVaOUVXOCwz54acd1Bi82yHcxQaaTwMa7HchNMSdsvPTBRc0-6o6mZa1uqlOMgqHHb1MPkBHq0OU32d3D1Kf1d97Gfj0PXMhh9OAK5SqY4aR-xMks2CggL0c' },
      { id: 3, title: 'Pulp Fiction', year: 1994, genre: 'Crime, Drama', rating: 8.9, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhMJrpCOzjpTcPeSMmLGhf1waIKyCWBuKKS_wINM-HXyTEd9il7y2dcJkhpqUkwH3acBlsKHlW-3Yyf7_aggSIt4bK8HZ80jKPD-qjR3TriP6umj9OIn4l3cjX6ac2v8Gts_RhGYHJA3hBgMxhXrnDa0e3z99S1qcDr5baYMR3D-_rDJOBFLE57vVC5lHz6ZNmrev8jTY_y65AM7AgvMK4jbO32qLYkaC-kH6TydQde3ZGRhhF-OzOT9v1T_qb1AzFrNjeHQPUB8WM' },
      { id: 4, title: 'The Matrix', year: 1999, genre: 'Action, Sci-Fi', rating: 8.7, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4c8M6GjAcEUOwD8UF0yyjNTL3FrXSZXTuo7LLgHMzuKHvRoAocl_5IXrfM6V7XYarGreQChVwrBuA58-MI3jJcWEleXzoQjlMWJcNSp7t2ISlB_gR6TyMWT8hMy7ns-Ztg9VySxIduwl2YHf75FOAhdZpIUnXyekqTzMqsF4shLYc46ohy92O9ROkIQHKeRAMDb6JTSleEPQE5g9kFcRIgc4mnf1P5VElac824JSJe7eChBeh8s3ma7Qgr3aLqiC3x6S_5FQUlYNk' },
      { id: 5, title: 'Parasite', year: 2019, genre: 'Thriller, Comedy', rating: 8.5, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJIbq4HaANXM_mKiUNt3FuqnoyTrkIUTcrroj7DoIfXY6wDV6cjbJfdaISjH4V80UApJrGQEMkynvopIVBf41pYdRNePW6SwQfiPkt5jkRzmwNA0gTtY7GC0rmeMdPgqF9EXoQsZRvtu5DYwB014mkGCW167O6A1FzBf-ep3hVUE2dJQoGKqBzc7TCjiN-NsZ8oiGItbg6MEZIet12a8W4XVFIoGX_vP-SNumt1sbQbBTAj40dPwnt6rHVD4TVTfz0dGlLTzE7_PG0' }
    ]
  };

  const tabs = ['watchlist', 'favorites', 'reviews', 'lists', 'watch with', 'friends'];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Profile Header Section */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-surface-dark mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-red-500/40 to-surface-dark relative">
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="px-6 pb-8 -mt-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                {/* Profile Avatar */}
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-background-dark shadow-2xl" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4B725K-lqiSKWiBFFYz2sauPlmWUQEOiptSscXio1Lp3qIhyLFxR6rZxz0tA_sjBXD-lb2vAve-kihsgrLcGJ1apXDcB7GPWRt8ZzASjQx94t27807_YE7vaXHB74TVXqQpWTNCFidbI4epCEo8ZS6AYI91brWLnGUGZMLny3_th-ZrswDrlbrMO6wEmPwE0t47dh-zf8fgWc9DEfHTdeq79uqHSQhjQuLWgm5qcQRVva1DtvuaEOFAasyRSV2e1No-L5t5_FRzWC')`}}></div>
                
                {/* Profile Info */}
                <div className="flex flex-col text-center md:text-left mb-2">
                  <h1 className="text-white text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2">
                    {profileData.name}
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </h1>
                  <p className="text-[#b99d9e] text-lg font-medium mt-1">{profileData.bio}</p>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-[#b99d9e] text-sm flex-wrap">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {profileData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined {profileData.joinDate}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none min-w-[120px] cursor-pointer items-center justify-center rounded-xl h-11 px-6 bg-border-dark text-white text-sm font-bold hover:bg-slate-700 transition-colors">
                  Edit Profile
                </button>
                <button className="flex-1 md:flex-none min-w-[120px] cursor-pointer items-center justify-center rounded-xl h-11 px-6 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                  Share List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-red-500/50">
            <p className="text-red-500 text-3xl font-extrabold leading-tight">{profileData.stats.moviesWatched}</p>
            <p className="text-slate-500 dark:text-[#b99d9e] text-sm font-semibold uppercase tracking-wider">Movies Watched</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-red-500/50">
            <p className="text-red-500 text-3xl font-extrabold leading-tight">{(profileData.stats.followers / 1000).toFixed(1)}k</p>
            <p className="text-slate-500 dark:text-[#b99d9e] text-sm font-semibold uppercase tracking-wider">Followers</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-red-500/50">
            <p className="text-red-500 text-3xl font-extrabold leading-tight">{profileData.stats.following}</p>
            <p className="text-slate-500 dark:text-[#b99d9e] text-sm font-semibold uppercase tracking-wider">Following</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-red-500/50">
            <p className="text-red-500 text-3xl font-extrabold leading-tight">{profileData.stats.reviewsWritten}</p>
            <p className="text-slate-500 dark:text-[#b99d9e] text-sm font-semibold uppercase tracking-wider">Reviews Written</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 dark:border-border-dark mb-8">
          <div className="flex gap-8 overflow-x-auto custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-4 pt-2 whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-slate-500 dark:text-[#b99d9e] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-widest">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Watch Later</h2>
              <span className="text-red-500 font-bold text-sm">({realWatchlist.length} movies)</span>
            </div>

            {isLoadingWatchlist ? (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-[#b99d9e]">Loading watchlist...</p>
              </div>
            ) : realWatchlist.length === 0 ? (
              <div className="text-center py-12 border border-white/5 rounded-2xl bg-surface-dark/50">
                <p className="text-slate-500 dark:text-[#b99d9e]">Your watchlist is empty.</p>
                <p className="text-slate-500 dark:text-[#b99d9e] text-sm mt-1">Browse movies and click "Add to Watch Later" to save them!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {realWatchlist.map(item => {
                  const m = item.movie;
                  if (!m) return null;
                  const year = m.releaseDate ? new Date(m.releaseDate).getFullYear() : 'N/A';
                  return (
                    <div key={item.id} className="group relative flex flex-col gap-3">
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-dark shadow-lg ring-1 ring-white/10 cursor-pointer" onClick={() => navigate(`/movie/${m.id}`)}>
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{backgroundImage: `url('${m.imagePath}')`}}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/movie/${m.id}`); }} className="w-full bg-red-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-700 transition-colors">
                            View Movie
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromWatchlist(m.id);
                            }}
                            className="size-8 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Remove from watchlist"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/movie/${m.id}`)}>
                        <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">{m.name}</h3>
                        <p className="text-slate-500 dark:text-[#b99d9e] text-xs">{year} • {m.genre || 'Movie'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight flex items-center gap-2">
                Favorites
                <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </h2>
              <span className="text-red-500 font-bold text-sm">({realFavorites.length} movies)</span>
            </div>

            {isLoadingFavorites ? (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-[#b99d9e]">Loading favorites...</p>
              </div>
            ) : realFavorites.length === 0 ? (
              <div className="text-center py-12 border border-white/5 rounded-2xl bg-surface-dark/50">
                <p className="text-slate-500 dark:text-[#b99d9e]">Your favorites list is empty.</p>
                <p className="text-slate-500 dark:text-[#b99d9e] text-sm mt-1">Browse movies and click "Favorite" to save your top picks!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {realFavorites.map(item => {
                  const m = item.movie;
                  if (!m) return null;
                  const year = m.releaseDate ? new Date(m.releaseDate).getFullYear() : 'N/A';
                  return (
                    <div key={item.id} className="group relative flex flex-col gap-3">
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-dark shadow-lg ring-1 ring-white/10 cursor-pointer" onClick={() => navigate(`/movie/${m.id}`)}>
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{backgroundImage: `url('${m.imagePath}')`}}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/movie/${m.id}`); }} className="w-full bg-red-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-700 transition-colors">
                            View Movie
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromFavorites(m.id);
                            }}
                            className="size-8 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Remove from favorites"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/movie/${m.id}`)}>
                        <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">{m.name}</h3>
                        <p className="text-slate-500 dark:text-[#b99d9e] text-xs">{year} • {m.genre || 'Movie'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-[#b99d9e]">Your reviews will appear here</p>
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-[#b99d9e]">Your lists will appear here</p>
          </div>
        )}

        {activeTab === 'watch with' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Watch With Friends</h2>
              <button onClick={() => setShowWatchWithModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Movie
              </button>
            </div>
            
            {isLoadingWatchWith ? (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-[#b99d9e]">Loading...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Pending Requests Received */}
                {watchWithList.filter(item => item.status === 0 && item.targetUsername === currentUser?.userName).length > 0 && (
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4 border-b border-white/10 pb-2">Pending Requests</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {watchWithList.filter(item => item.status === 0 && item.targetUsername === currentUser?.userName).map(item => (
                        <div key={item.id} className="group relative flex flex-col gap-3">
                          <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-dark shadow-lg ring-1 ring-white/10">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: `url('${item.movieImagePath}')`}}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 flex flex-col justify-end p-4">
                              <p className="text-white text-xs font-bold mb-2 text-center">{item.initiatorUsername} wants to watch</p>
                              <div className="flex gap-2">
                                <button onClick={async () => { await watchWithService.updateWatchWithStatus(item.id, 1); fetchWatchWiths(); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">Accept</button>
                                <button onClick={async () => { await watchWithService.updateWatchWithStatus(item.id, 2); fetchWatchWiths(); }} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">Decline</button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1">{item.movieTitle}</h3>
                            <p className="text-slate-500 dark:text-[#b99d9e] text-xs">{item.movieYear} • {item.movieGenre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sent Requests */}
                {watchWithList.filter(item => item.status === 0 && item.initiatorUsername === currentUser?.userName).length > 0 && (
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4 border-b border-white/10 pb-2">Sent Requests</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 opacity-60">
                      {watchWithList.filter(item => item.status === 0 && item.initiatorUsername === currentUser?.userName).map(item => (
                        <div key={item.id} className="group relative flex flex-col gap-3">
                          <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-dark shadow-lg ring-1 ring-white/10">
                            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${item.movieImagePath}')`}}></div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <button onClick={async () => { await watchWithService.removeWatchWith(item.id); fetchWatchWiths(); }} className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 mb-2 hover:bg-slate-700 transition-colors border border-white/10">
                                Cancel
                              </button>
                            </div>
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                              <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                              {item.targetUsername}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1">{item.movieTitle}</h3>
                            <p className="text-slate-500 dark:text-[#b99d9e] text-xs">{item.movieYear} • {item.movieGenre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accepted Watch Withs */}
                {watchWithList.filter(item => item.status === 1).length > 0 && (
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4 border-b border-white/10 pb-2">Watching With</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {watchWithList.filter(item => item.status === 1).map(item => (
                        <div key={item.id} className="group relative flex flex-col gap-3">
                          <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-dark shadow-lg ring-1 ring-white/10">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: `url('${item.movieImagePath}')`}}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <button onClick={async () => { await watchWithService.removeWatchWith(item.id); fetchWatchWiths(); }} className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 mb-2 hover:bg-slate-700 transition-colors border border-white/10">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Remove
                              </button>
                            </div>
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                              <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                              {item.initiatorUsername === currentUser?.userName ? item.targetUsername : item.initiatorUsername}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">{item.movieTitle}</h3>
                            <p className="text-slate-500 dark:text-[#b99d9e] text-xs">{item.movieYear} • {item.movieGenre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {watchWithList.filter(item => item.status !== 2).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-[#b99d9e]">You haven't added any movies to watch with friends yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-12">
            {/* Find Friends Section */}
            <div>
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight mb-4">Find Friends</h2>
              <form onSubmit={handleSearchUsers} className="flex gap-2 max-w-md mb-6">
                <input 
                  type="text" 
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search by username or email..." 
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500 shadow-inner"
                />
                <button type="submit" disabled={isSearchingUsers} className="bg-red-600 px-6 py-3 rounded-xl text-white font-bold hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-600/20">
                  {isSearchingUsers ? 'Searching...' : 'Search'}
                </button>
              </form>

              {userSearchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {userSearchResults.map(user => (
                    <div key={user.id} className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase">
                          {user.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{user.userName}</p>
                        </div>
                      </div>
                      {sentRequests[user.id] ? (
                        <button 
                          disabled
                          className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-default">
                          Request Sent!
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault();
                            setSentRequests(prev => ({...prev, [user.id]: true}));
                            try {
                              await friendService.sendRequest(user.id);
                              setTimeout(() => {
                                setUserSearchResults(prev => prev.filter(u => u.id !== user.id));
                              }, 1500);
                            } catch (err) {
                              setSentRequests(prev => ({...prev, [user.id]: false}));
                              alert(err.message || 'Failed to send friend request.');
                            }
                        }} className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-colors">
                          Add Friend
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                  Pending Requests 
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="bg-surface-dark rounded-xl p-4 border border-red-500/20 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase">
                          {req.requesterUsername.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{req.requesterUsername}</p>
                          <p className="text-white/40 text-xs">Wants to be friends</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          await friendService.acceptRequest(req.requesterId);
                          fetchFriendsData();
                        }} className="flex-1 text-xs bg-red-600 text-white hover:bg-red-700 py-2 rounded-lg font-bold transition-colors">
                          Accept
                        </button>
                        <button onClick={async () => {
                          await friendService.removeFriendOrRequest(req.requesterId);
                          fetchFriendsData();
                        }} className="flex-1 text-xs bg-white/5 text-white hover:bg-white/10 py-2 rounded-lg font-bold transition-colors">
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Friends */}
            <div>
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight mb-4">My Friends</h2>
              {isLoadingFriends ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-[#b99d9e]">Loading friends...</p>
                </div>
              ) : friendsList.length === 0 ? (
                <div className="text-center py-12 border border-white/5 rounded-2xl bg-surface-dark/50">
                  <p className="text-slate-500 dark:text-[#b99d9e]">You haven't added any friends yet.</p>
                  <p className="text-slate-500 dark:text-[#b99d9e] text-sm mt-1">Use the search above to find people!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {friendsList.map(friend => {
                    const friendId = friend.requesterId === currentUser?.id ? friend.addresseeId : friend.requesterId;
                    const friendName = friend.requesterId === currentUser?.id ? friend.addresseeUsername : friend.requesterUsername;
                    return (
                      <div key={friend.id} className="bg-surface-dark rounded-xl p-4 border border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold uppercase">
                            {friendName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{friendName}</p>
                            <p className="text-white/40 text-xs">Friends since {new Date(friend.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={async () => {
                          await friendService.removeFriendOrRequest(friendId);
                          fetchFriendsData();
                        }} className="opacity-0 group-hover:opacity-100 text-xs bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg font-bold transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggestion Section */}
        <div className="mt-16 p-8 rounded-2xl bg-red-600/5 border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-extrabold text-white">Find your next favorite</h3>
            <p className="text-[#b99d9e] mt-1">Discover trending movies based on your taste and community ratings.</p>
          </div>
          <button className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-500/20">
            Explore Discover Feed
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-border-dark py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-red-500/60">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5V7h2v5.5h2V7h2v8H9z"/>
            </svg>
            <span className="text-slate-900 dark:text-white font-bold">favflicks</span>
          </div>
          <div className="flex gap-8 text-[#b99d9e] text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-[#b99d9e] text-xs">© 2024 FavFlicks Social Inc. All rights reserved.</p>
        </div>
      </footer>
      
      <WatchWithModal 
        isOpen={showWatchWithModal} 
        onClose={() => setShowWatchWithModal(false)}
        onAddSuccess={fetchWatchWiths}
      />
    </div>
  );
};

export default ProfilePage;

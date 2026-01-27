import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('watchlist');

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

  const tabs = ['watchlist', 'favorites', 'reviews', 'lists'];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Profile Header Section */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-surface-dark mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-primary/40 to-surface-dark relative">
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
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
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
                <button className="flex-1 md:flex-none min-w-[120px] cursor-pointer items-center justify-center rounded-xl h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20">
                  Share List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-primary/50">
            <p className="text-primary text-3xl font-extrabold leading-tight">{profileData.stats.moviesWatched}</p>
            <p className="text-slate-500 dark:text-[#b99d9e] text-sm font-semibold uppercase tracking-wider">Movies Watched</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-primary/50">
            <p className="text-primary text-3xl font-extrabold leading-tight">{(profileData.stats.followers / 1000).toFixed(1)}k</p>
            <p className="text-slate-500 dark:text-[#b99d9e] text-sm font-semibold uppercase tracking-wider">Followers</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-primary/50">
            <p className="text-primary text-3xl font-extrabold leading-tight">{profileData.stats.following}</p>
            <p className="text-slate-500 dark:text-[#b99d9e] text-sm font-semibold uppercase tracking-wider">Following</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-border-dark p-5 bg-white dark:bg-surface-dark transition-all hover:border-primary/50">
            <p className="text-primary text-3xl font-extrabold leading-tight">{profileData.stats.reviewsWritten}</p>
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
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 dark:text-[#b99d9e] hover:text-white'
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
              <a href="#" className="text-primary font-bold text-sm hover:underline">View All (18)</a>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {profileData.watchlist.map(movie => (
                <div key={movie.id} className="group relative flex flex-col gap-3">
                  <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-dark shadow-lg ring-1 ring-white/10">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{backgroundImage: `url('${movie.image}')`}}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <button className="w-full bg-primary text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 mb-2 hover:bg-red-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        Mark Watched
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <button className="size-8 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-yellow-500 text-black text-[10px] font-black flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {movie.rating}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                    <p className="text-slate-500 dark:text-[#b99d9e] text-xs">{movie.year} • {movie.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-[#b99d9e]">Your favorite movies will appear here</p>
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

        {/* Suggestion Section */}
        <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-extrabold text-white">Find your next favorite</h3>
            <p className="text-[#b99d9e] mt-1">Discover trending movies based on your taste and community ratings.</p>
          </div>
          <button className="whitespace-nowrap bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20">
            Explore Discover Feed
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-border-dark py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary/60">
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
    </div>
  );
};

export default ProfilePage;

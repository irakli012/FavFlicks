import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';

const TV_GENRES = [
  'All',
  'Action & Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Documentary',
  'Mystery',
  'Sci-Fi & Fantasy'
];

const TvShowsPage = () => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTvShows();
  }, []);

  const fetchTvShows = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/tv/popular`);
      if (!res.ok) throw new Error('Failed to fetch TV series');
      const data = await res.json();
      setTvShows(data);
    } catch (err) {
      console.error('Error loading TV shows:', err);
      setError('Failed to load TV series. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedShows = useMemo(() => {
    let result = [...tvShows];

    // 1. Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name?.toLowerCase().includes(q) || 
        s.description?.toLowerCase().includes(q)
      );
    }

    // 2. Genre Filter
    if (selectedGenre !== 'All') {
      result = result.filter(s => {
        if (!s.genre && !s.description) return false;
        const genreStr = s.genre ? s.genre.toLowerCase() : '';
        const descStr = s.description ? s.description.toLowerCase() : '';
        return genreStr.includes(selectedGenre.toLowerCase()) || descStr.includes(selectedGenre.toLowerCase());
      });
    }

    // 3. Sort
    switch (sortBy) {
      case 'rated':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
        break;
      case 'title':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'popular':
      default:
        break;
    }

    return result;
  }, [tvShows, selectedGenre, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-[#181111] text-white px-4 md:px-10 lg:px-20 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <span>📺</span> Explore TV Series
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Discover binge-worthy shows, trending TV series, and all-time fan favorites.
          </p>
        </div>
      </div>

      {/* Controls Container: Search, Genre Pills, Sort */}
      <div className="bg-[#241a1a] p-4 md:p-6 rounded-2xl border border-[#382929] mb-8 space-y-5">
        {/* Search Bar */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          {/* Genre Pills */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0 flex-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">Genre:</span>
            {TV_GENRES.map((g) => {
              const isSelected = selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-[#382929] text-gray-300 hover:bg-[#4a3636] hover:text-white'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#382929] text-white border border-[#4a3636] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rated">Highest Rated</option>
              <option value="newest">Newest Air Date</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* TV Shows Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div key={n} className="aspect-[2/3] bg-[#2a1b1b] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-[#2a1b1b]/40 rounded-2xl border border-white/5">
          {error}
        </div>
      ) : filteredAndSortedShows.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-[#2a1b1b]/40 rounded-2xl border border-white/5">
          <p className="text-lg font-bold">No TV series found matching your filters.</p>
          <button 
            onClick={() => { setSelectedGenre('All'); setSearchTerm(''); setSortBy('popular'); }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-xs font-medium">
              Showing <strong className="text-white">{filteredAndSortedShows.length}</strong> TV series
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredAndSortedShows.map((show) => {
              const year = show.releaseDate ? new Date(show.releaseDate).getFullYear() : 'TV';
              return (
                <div 
                  key={show.externalId || show.id}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Poster Container */}
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#2a1b1b] border border-[#382929] group-hover:border-indigo-500 transition-all group-hover:scale-[1.03] shadow-lg">
                    {show.imagePath ? (
                      <img 
                        src={show.imagePath} 
                        alt={show.name} 
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">No Poster</div>
                    )}

                    {/* TV Badge */}
                    <div className="absolute top-2 left-2 bg-indigo-600/90 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm">
                      TV Series
                    </div>

                    {show.averageRating > 0 && (
                      <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                        ★ {show.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3 flex flex-col">
                    <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {show.name}
                    </h3>
                    <span className="text-gray-400 text-xs mt-0.5">{year}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TvShowsPage;

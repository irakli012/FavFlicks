import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const TV_GENRES = [
  'All',
  'Action & Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Mystery',
  'Sci-Fi & Fantasy'
];

const ITEMS_PER_PAGE = 15;

const TvShowsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Persisted state via URL search parameters
  const selectedGenre = searchParams.get('genre') || 'All';
  const sortBy = searchParams.get('sort') || 'popular';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const setSelectedGenre = (g) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (g === 'All') p.delete('genre');
      else p.set('genre', g);
      p.set('page', '1');
      return p;
    });
  };

  const setSortBy = (s) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('sort', s);
      p.set('page', '1');
      return p;
    });
  };

  const setCurrentPage = (pVal) => {
    const nextP = typeof pVal === 'function' ? pVal(currentPage) : pVal;
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('page', nextP.toString());
      return p;
    });
  };

  useEffect(() => {
    fetchTvShows(selectedGenre, sortBy);
  }, [selectedGenre, sortBy]);

  const fetchTvShows = async (genre, sort) => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_BASE_URL}/api/Movies/tv/popular?1=1`;
      if (genre && genre !== 'All') {
        url += `&genre=${encodeURIComponent(genre)}`;
      }
      if (sort) {
        url += `&sortBy=${encodeURIComponent(sort)}`;
      }

      const res = await fetch(url);
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
        s.description?.toLowerCase().includes(q) ||
        s.genre?.toLowerCase().includes(q)
      );
    }

    // 2. Strict Genre Filter
    if (selectedGenre !== 'All') {
      const target = selectedGenre.toLowerCase();
      result = result.filter(s => {
        const genreStr = s.genre ? s.genre.toLowerCase() : '';
        return genreStr.includes(target);
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

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedShows.length / ITEMS_PER_PAGE));
  const currentShows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedShows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedShows, currentPage]);

  // Page Numbers Windowing
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [totalPages, currentPage]);

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
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0 flex-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">Genre:</span>
            {TV_GENRES.map((g) => {
              const isSelected = selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-[#382929] text-gray-300 hover:bg-[#4a3636] hover:text-white'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>

          {/* Custom Styled Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#382929] hover:bg-[#4a3636] text-white border border-[#4a3636] text-xs font-bold rounded-xl pl-3 py-2 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors"
              >
                <option value="popular">Most Popular</option>
                <option value="rated">Highest Rated</option>
                <option value="newest">Newest Air Date</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TV Shows Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
            <div key={n} className="aspect-[2/3] bg-[#2a1b1b] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-[#2a1b1b]/40 rounded-2xl border border-white/5">
          {error}
        </div>
      ) : filteredAndSortedShows.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-[#2a1b1b]/40 rounded-2xl border border-white/5">
          <p className="text-lg font-bold">No TV series found matching "{selectedGenre}" genre.</p>
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
              Showing <strong className="text-white">{currentShows.length}</strong> of <strong className="text-white">{filteredAndSortedShows.length}</strong> TV series
            </span>
            {totalPages > 1 && (
              <span className="text-gray-400 text-xs font-medium">
                Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {currentShows.map((show, idx) => {
              const year = show.releaseDate ? new Date(show.releaseDate).getFullYear() : 'TV';
              return (
                <div 
                  key={show.externalId ? `tv_${show.externalId}` : (show.id || show.Id || `tv_card_${idx}`)}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="size-10 rounded-full bg-[#382929] border border-[#4a3636] text-white flex items-center justify-center hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-[#382929] transition-all"
                title="Previous Page"
              >
                &larr;
              </button>

              {pageNumbers.map((pageNum) => {
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-10 rounded-full font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110'
                        : 'bg-[#382929] text-gray-300 hover:bg-[#4a3636] hover:text-white border border-[#4a3636]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="size-10 rounded-full bg-[#382929] border border-[#4a3636] text-white flex items-center justify-center hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-[#382929] transition-all"
                title="Next Page"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TvShowsPage;

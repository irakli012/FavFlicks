import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';

const MOVIE_GENRES = [
  'All',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller'
];

const MoviesPage = () => {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // popular, rated, newest, title
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies?includeTmdb=true`);
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error('Error loading movies page data:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    // 1. Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.name?.toLowerCase().includes(q) || 
        m.description?.toLowerCase().includes(q) ||
        m.genre?.toLowerCase().includes(q)
      );
    }

    // 2. Genre Filter
    if (selectedGenre !== 'All') {
      result = result.filter(m => {
        if (!m.genre && !m.tags) return false;
        const genreStr = m.genre ? m.genre.toLowerCase() : '';
        const tagStr = m.tags ? m.tags.map(t => t.name.toLowerCase()).join(' ') : '';
        return genreStr.includes(selectedGenre.toLowerCase()) || tagStr.includes(selectedGenre.toLowerCase());
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
        // Default TMDB / custom order
        break;
    }

    return result;
  }, [movies, selectedGenre, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-[#181111] text-white px-4 md:px-10 lg:px-20 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <span>🍿</span> Explore Movies
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Browse our full catalog of films, filter by genre, and discover your next favorite movie.
          </p>
        </div>

        {isAuthenticated && (
          <Link
            to="/add-movie"
            className="flex items-center justify-center rounded-xl h-11 px-6 bg-[#e82626] hover:bg-[#ff3b3b] text-white text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-red-500/20 whitespace-nowrap self-start md:self-auto"
          >
            + Add Custom Movie
          </Link>
        )}
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
            {MOVIE_GENRES.map((g) => {
              const isSelected = selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#e82626] text-white shadow-lg shadow-red-500/30'
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
              className="bg-[#382929] text-white border border-[#4a3636] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#e82626]"
            >
              <option value="popular">Most Popular</option>
              <option value="rated">Highest Rated</option>
              <option value="newest">Newest Release</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
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
      ) : filteredAndSortedMovies.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-[#2a1b1b]/40 rounded-2xl border border-white/5">
          <p className="text-lg font-bold">No movies found matching your filters.</p>
          <button 
            onClick={() => { setSelectedGenre('All'); setSearchTerm(''); setSortBy('popular'); }}
            className="mt-4 px-4 py-2 bg-[#e82626] text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-xs font-medium">
              Showing <strong className="text-white">{filteredAndSortedMovies.length}</strong> movies
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <MovieCard key={movie.Id || movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;

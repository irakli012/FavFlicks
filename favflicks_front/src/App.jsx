import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PopularMoviesSection from './components/PopularMoviesSection';
import HeroSpotlight from './components/HeroSpotlight';
import TvSeriesSlider from './components/TvSeriesSlider';
import WatchWithModal from './components/WatchWithModal';
import MovieDetailsPage from './components/MovieDetailsPage';
import ToggleSwitch from './components/ToggleSwitch';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AddMoviePage from './pages/AddMoviePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import MoviesPage from './pages/MoviesPage';
import TvShowsPage from './pages/TvShowsPage';
import './index.css';
import Snowfall from 'react-snowfall'

function App() {
  console.log("App rendered");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Constants for pagination and display
  const POPULAR_MOVIES_PER_PAGE = 10;
  const MOVIES_PER_ROW = 5;

  // State for Popular Movies Pagination
  const [popularCurrentPage, setPopularCurrentPage] = useState(1);

  const [tvShows, setTvShows] = useState([]);
  const [loadingTv, setLoadingTv] = useState(false);
  const [selectedWatchWithItem, setSelectedWatchWithItem] = useState(null);
  const [showWatchWithModal, setShowWatchWithModal] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies?includeTmdb=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const sortedData = [...data].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      setMovies(sortedData);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTvShows = async () => {
    try {
      setLoadingTv(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/tv/popular`);
      if (response.ok) {
        const data = await response.json();
        setTvShows(data);
      }
    } catch (err) {
      console.error("Error fetching TV shows:", err);
    } finally {
      setLoadingTv(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTvShows();
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/search?query=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
  };

  // Popular Movies Pagination Logic
  const totalPopularPages = Math.ceil(movies.length / POPULAR_MOVIES_PER_PAGE);
  const indexOfLastPopularMovie = popularCurrentPage * POPULAR_MOVIES_PER_PAGE;
  const indexOfFirstPopularMovie = indexOfLastPopularMovie - POPULAR_MOVIES_PER_PAGE;
  const currentPopularMovies = movies.slice(indexOfFirstPopularMovie, indexOfLastPopularMovie);

  const paginatePopular = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPopularPages) {
      setPopularCurrentPage(pageNumber);
    }
  };

  const spotlightItems = movies.filter(m => m.backdropPath || m.imagePath).slice(0, 5);

  return (
    <Router>
      <AppContent 
        movies={movies}
        tvShows={tvShows}
        loadingTv={loadingTv}
        spotlightItems={spotlightItems}
        loading={loading}
        error={error}
        popularCurrentPage={popularCurrentPage}
        totalPopularPages={totalPopularPages}
        paginatePopular={paginatePopular}
        currentPopularMovies={currentPopularMovies}
        MOVIES_PER_ROW={MOVIES_PER_ROW}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchResults={searchResults}
        isSearching={isSearching}
        selectedWatchWithItem={selectedWatchWithItem}
        setSelectedWatchWithItem={setSelectedWatchWithItem}
        showWatchWithModal={showWatchWithModal}
        setShowWatchWithModal={setShowWatchWithModal}
      />
    </Router>
  );
}

function AppContent({ 
  movies, 
  tvShows,
  loadingTv,
  spotlightItems,
  loading, 
  error, 
  popularCurrentPage, 
  totalPopularPages, 
  paginatePopular, 
  currentPopularMovies, 
  MOVIES_PER_ROW,
  searchTerm,
  onSearchChange,
  searchResults,
  isSearching,
  selectedWatchWithItem,
  setSelectedWatchWithItem,
  showWatchWithModal,
  setShowWatchWithModal
}) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#181111] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <Header />

      <div className="layout-container flex h-full grow flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <div className="px-4 md:px-8 lg:px-20 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col w-full flex-1">
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">Popular Movies</h1>
                      <p className="text-gray-400">Discover what's trending and find your next favorite.</p>
                    </div>
                    {isAuthenticated && (
                      <Link
                        to="/add-movie"
                        className="flex items-center justify-center rounded-full h-10 px-6 bg-[#e82626] hover:bg-[#ff3b3b] text-white text-sm font-bold transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(232,38,38,0.4)] whitespace-nowrap"
                      >
                        + Add Custom Movie
                      </Link>
                    )}
                  </div>
                  <SearchBar value={searchTerm} onChange={onSearchChange} />
                  
                  {searchTerm.trim() !== '' ? (
                    <div className="mt-6">
                      <h2 className="text-2xl font-bold text-white mb-4">Search Results for "{searchTerm}"</h2>
                      {isSearching ? (
                        <div className="flex justify-center py-10">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e82626]"></div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {searchResults.map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
                              <div className="bg-[#2a1b1b] rounded-xl overflow-hidden border border-[#382929] transition-all group-hover:scale-105 group-hover:border-[#e82626]">
                                <div className="aspect-[2/3] w-full relative">
                                  {movie.imagePath ? (
                                    <img src={movie.imagePath} alt={movie.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#181111] text-gray-500">No Poster</div>
                                  )}
                                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-yellow-400 flex items-center gap-1">
                                    ★ {movie.averageRating > 0 ? movie.averageRating.toFixed(1) : 'NR'}
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h3 className="text-white font-medium text-sm line-clamp-1">{movie.name}</h3>
                                  <p className="text-gray-400 text-xs mt-1">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-400">
                          No movies found matching your search.
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <HeroSpotlight 
                        items={spotlightItems} 
                        onWatchWithClick={(item) => {
                          setSelectedWatchWithItem(item);
                          setShowWatchWithModal(true);
                        }}
                      />
                      
                      <TvSeriesSlider tvShows={tvShows} loading={loadingTv} />
                      
                      <PopularMoviesSection
                        movies={movies}
                        loading={loading}
                        error={error}
                      />

                      <WatchWithModal
                        isOpen={showWatchWithModal}
                        onClose={() => setShowWatchWithModal(false)}
                        initialMovie={selectedWatchWithItem}
                        onAddSuccess={() => alert('Watch With request sent!')}
                      />
                    </>
                  )}
                </div>
              </div>
            }
          />
          <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv-shows" element={<TvShowsPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-movie" element={<AddMoviePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
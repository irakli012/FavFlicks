import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import HighestRatedSlider from './components/HighestRatedSlider';
import PopularMoviesSection from './components/PopularMoviesSection';
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

  useEffect(() => {
    fetchMovies();
  }, []);

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

  return (
    <Router>
      <AppContent 
        movies={movies}
        loading={loading}
        error={error}
        popularCurrentPage={popularCurrentPage}
        totalPopularPages={totalPopularPages}
        paginatePopular={paginatePopular}
        currentPopularMovies={currentPopularMovies}
        MOVIES_PER_ROW={MOVIES_PER_ROW}
      />
    </Router>
  );
}

function AppContent({ 
  movies, 
  loading, 
  error, 
  popularCurrentPage, 
  totalPopularPages, 
  paginatePopular, 
  currentPopularMovies, 
  MOVIES_PER_ROW 
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
                  <SearchBar />
                  <HighestRatedSlider movies={movies} loading={loading} error={error} />
                  <PopularMoviesSection
                    movies={movies}
                    loading={loading}
                    error={error}
                    popularCurrentPage={popularCurrentPage}
                    totalPopularPages={totalPopularPages}
                    paginatePopular={paginatePopular}
                    currentPopularMovies={currentPopularMovies}
                    MOVIES_PER_ROW={MOVIES_PER_ROW}
                  />
                </div>
              </div>
            }
          />
          <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
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
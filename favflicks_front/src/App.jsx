import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import HighestRatedSlider from './components/HighestRatedSlider';
import PopularMoviesSection from './components/PopularMoviesSection';
import MovieDetailsPage from './components/MovieDetailsPage';
import ToggleSwitch from './components/ToggleSwitch';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

function App() {
  console.log("App rendered");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTmdbMovies, setShowTmdbMovies] = useState(true); // New state for toggle

  // Constants for pagination and display
  const POPULAR_MOVIES_PER_PAGE = 10;
  const MOVIES_PER_ROW = 5;

  // State for Popular Movies Pagination
  const [popularCurrentPage, setPopularCurrentPage] = useState(1);

  // Define your API URL (base URL)
  const API_URL = "https://localhost:7245/api/Movies";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = showTmdbMovies 
          ? `${API_URL}?includeTmdb=true` 
          : API_URL;
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Sort movies by averageRating for the "Highest Rated" section
        const sortedData = [...data].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        setMovies(sortedData);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [showTmdbMovies]); // Add showTmdbMovies to dependency array

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
      <div className="relative flex size-full min-h-screen flex-col bg-[#181111] dark group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
        <Header />
        
        <div className="layout-container flex h-full grow flex-col">
          {/* Toggle switch */}
          <div className="flex justify-end px-20 py-2">
            <ToggleSwitch 
              isOn={showTmdbMovies}
              handleToggle={() => setShowTmdbMovies(!showTmdbMovies)}
              label="Show TMDB Movies"
            />
          </div>

          <Routes>
            <Route path="/" element={
              <div className="px-20 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col w-full flex-1">
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
            } />
            <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
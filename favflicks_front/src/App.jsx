// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, Route
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import HighestRatedSlider from './components/HighestRatedSlider';
import PopularMoviesSection from './components/PopularMoviesSection';
import MovieDetailsPage from './components/MovieDetailsPage.jsx';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch(API_URL); // Fetch all movies for home sections
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
    <Router> {/* Wrap your entire app with Router */}
      <div
        className="relative flex size-full min-h-screen flex-col bg-[#181111] dark group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <Header /> {/* Render Header component, it will be visible on all routes */}

          {/* Define your routes here */}
          <Routes>
            <Route
              path="/"
              element={
                // This is the main content for your homepage
                <div className="px-20 flex flex-1 justify-center py-5">
                  <div className="layout-content-container flex flex-col w-full flex-1">
                    <SearchBar />
                    {/* Make sure HighestRatedSlider and PopularMoviesSection use your MovieCard component */}
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
            {/* Route for Movie Details Page */}
            {/* The :movieId part captures the ID from the URL */}
            <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import MovieCard from './MovieCard'; // Import MovieCard

// PopularMoviesSection component for the paginated popular movies
function PopularMoviesSection({ movies, loading, error, popularCurrentPage, totalPopularPages, paginatePopular, currentPopularMovies, MOVIES_PER_ROW }) {
  return (
    <>
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular Movies</h2>
      {loading && <p className="text-white">Loading popular movies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && movies.length === 0 && (
          <p className="text-white">No popular movies found.</p>
      )}
      {!loading && !error && movies.length > 0 && (
        <>
          {/* Hardcoded grid-cols-5 for consistent 5 movies per row */}
          <div className={`grid grid-cols-${MOVIES_PER_ROW} gap-6 p-4`}>
            {currentPopularMovies.map(movie => (
              <MovieCard key={movie.Id} movie={movie} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center p-4">
            <button
              onClick={() => paginatePopular(popularCurrentPage - 1)}
              disabled={popularCurrentPage === 1}
              className="flex size-10 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-white" data-icon="CaretLeft" data-size="18px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
              </div>
            </button>
            {[...Array(totalPopularPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginatePopular(index + 1)}
                className={`text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-full ${popularCurrentPage === index + 1 ? 'bg-[#382929]' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginatePopular(popularCurrentPage + 1)}
              disabled={popularCurrentPage === totalPopularPages}
              className="flex size-10 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-white" data-icon="CaretRight" data-size="18px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default PopularMoviesSection;
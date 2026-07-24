import React from 'react';
import MovieCard from './MovieCard';

function PopularMoviesSection({ movies, loading, error }) {
  return (
    <section className="my-8">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-2">Popular Movies</h2>
      {loading && <p className="text-white px-4">Loading popular movies...</p>}
      {error && <p className="text-red-500 px-4">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-white px-4">No popular movies found.</p>
      )}
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 p-2 md:p-4">
          {movies.slice(0, 15).map(movie => (
            <MovieCard key={movie.Id || movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PopularMoviesSection;
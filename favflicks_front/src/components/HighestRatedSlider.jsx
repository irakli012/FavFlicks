import React, { useRef } from 'react';
import MovieCard from '../components/MovieCard'; // Import MovieCard

// HighestRatedSlider component for the scrollable section of large movie cards
function HighestRatedSlider({ movies, loading, error }) {
  const highestRatedSliderRef = useRef(null);
  const HIGHEST_RATED_DISPLAY_COUNT = 5; // Display 5 movies at a time in the slider

  const scrollHighestRated = (direction) => {
    if (highestRatedSliderRef.current) {
      // Calculate scroll amount based on the width of the container divided by the number of items to display
      const scrollAmount = highestRatedSliderRef.current.offsetWidth / HIGHEST_RATED_DISPLAY_COUNT;
      highestRatedSliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Highest Rated</h2>
      <div className="relative flex items-center">
        {/* Left Slider Button */}
        <button
          onClick={() => scrollHighestRated(-1)}
          className="absolute left-0 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
          </svg>
        </button>

        <div
          ref={highestRatedSliderRef}
          className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          <div className="flex items-stretch p-4 gap-6"> {/* Adjusted gap to gap-6 for slider */}
            {loading && <p className="text-white">Loading highest rated movies...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && movies.map(movie => (
              <MovieCard key={movie.Id} movie={movie} isLarge={true} />
            ))}
            {!loading && !error && movies.length === 0 && (
              <p className="text-white">No highest rated movies found.</p>
            )}
          </div>
        </div>

        {/* Right Slider Button */}
        <button
          onClick={() => scrollHighestRated(1)}
          className="absolute right-0 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
          </svg>
        </button>
      </div>
    </>
  );
}

export default HighestRatedSlider;
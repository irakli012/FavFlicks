import React, { useState, useEffect, useRef } from 'react'; // Import useRef for slider

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Highest Rated Slider
  const highestRatedSliderRef = useRef(null);
  const [highestRatedStartIndex, setHighestRatedStartIndex] = useState(0);
  const HIGHEST_RATED_DISPLAY_COUNT = 5; // Display 5 movies at a time in the slider

  // State for Popular Movies Pagination
  const [popularCurrentPage, setPopularCurrentPage] = useState(1);
  const POPULAR_MOVIES_PER_PAGE = 10; // 5 per row, 2 rows = 10 movies per page
  const MOVIES_PER_ROW = 5; // For the grid layout

  // Define your API URL
  const API_URL = "https://localhost:7245/api/Movies";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Sort movies by averageRating for the "Highest Rated" section
        // Note: This sorts ALL movies. Ideally, your API would provide a sorted endpoint.
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

  // Helper function to render a single movie card
  const MovieCard = ({ movie, isLarge = false }) => {
    const outerDivClasses = `flex flex-col gap-3 ${isLarge ? 'pb-4' : 'pb-3'} ${isLarge ? 'min-w-[200px]' : 'w-full'}`;
    const imageDivClasses = `bg-center bg-no-repeat bg-cover rounded-xl ${isLarge ? 'aspect-[2/3] w-[200px]' : 'aspect-[3/4] w-full'}`;

    return (
      <div className={outerDivClasses}>
        <div
          className={imageDivClasses}
          style={{
            backgroundImage: `url(${
              movie.imagePath
                ? `https://localhost:7245${movie.imagePath}`
                : 'https://via.placeholder.com/150x200?text=No+Image'})`
          }}
        ></div>
        <div className="flex-grow min-h-[77px] pl-1">
          <p className="text-white text-base font-medium leading-normal">{movie.name}</p>
          <p className="text-[#b89d9d] text-sm font-normal leading-normal">
            Rating: {movie.averageRating != null ? movie.averageRating.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>
    );
  };

  // Highest Rated Slider Navigation Logic
  const scrollHighestRated = (direction) => {
    if (highestRatedSliderRef.current) {
      const scrollAmount = highestRatedSliderRef.current.offsetWidth / HIGHEST_RATED_DISPLAY_COUNT;
      highestRatedSliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
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

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#181111] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header Section (unchanged) */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#382929] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_330)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_330"><rect width="48" height="48" fill="white"></rect></clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">FavFlicks</h2>
            </div>
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Movies</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">TV Shows</a>
              <a className="text-white text-sm font-normal leading-normal" href="#">People</a>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64" htmlFor="search-header">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#b89d9d] flex border-none bg-[#382929] items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                    ></path>
                  </svg>
                </div>
                <input
                  id="search-header"
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#382929] focus:border-none h-full placeholder:text-[#b89d9d] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value=""
                  readOnly
                />
              </div>
            </label>
            <div className="flex gap-2">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e82626] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Register</span>
              </button>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#382929] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full flex-1">
            {/* Main Search Bar (unchanged) */}
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full" htmlFor="main-search">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#b89d9d] flex border-none bg-[#382929] items-center justify-center pl-4 rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    id="main-search"
                    placeholder="Search for movies, TV shows, people..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#382929] focus:border-none h-full placeholder:text-[#b89d9d] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value=""
                    readOnly
                  />
                </div>
              </label>
            </div>

            {/* Highest Rated Movies Section (Slider) */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Highest Rated</h2>
            <div className="relative flex items-center"> {/* Added relative for absolute positioning of buttons */}
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
                ref={highestRatedSliderRef} // Attach ref here
                className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" // Added scroll-smooth
              >
                <div className="flex items-stretch p-4 gap-6"> {/* Adjusted gap to gap-4 for slider */}
                  {loading && <p className="text-white">Loading highest rated movies...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {!loading && !error && movies.map(movie => ( // Display all movies for slider for now, will slice if needed
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

            {/* Popular Movies Section (Pagination) */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular Movies</h2>
            {loading && <p className="text-white">Loading popular movies...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && movies.length === 0 && (
                <p className="text-white">No popular movies found.</p>
            )}
            {!loading && !error && movies.length > 0 && (
              <>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
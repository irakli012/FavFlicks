// src/components/MovieDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link

function MovieDetailsPage() {
  const { movieId } = useParams(); // Get the movieId from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define your API URL (base URL for single movie details)
  const API_DETAIL_URL = "https://localhost:7245/api/Movies"; // Assuming endpoint is /api/Movies/{id}

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        // Construct the URL for the specific movie ID
        const response = await fetch(`${API_DETAIL_URL}/${movieId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map backend fields to expected frontend fields
        const mappedMovie = {
          title: data.Name || data.name || '',
          description: data.Description || '',
          posterUrl: data.ImagePath ? `https://localhost:7245${data.ImagePath}` : '',
          imagePath: data.ImagePath || data.imagePath || '',
          averageRating: data.AverageRating ?? null,
          tags: Array.isArray(data.Tags) ? data.Tags.map(t => t.Name || t.name || t) : [],
          comments: Array.isArray(data.Comments) ? data.Comments.map(c => ({
            author: c.User?.userName || c.User?.UserName || 'User',
            text: c.Content || c.Text || '',
            timestamp: c.Timestamp || '',
            avatarUrl: c.User?.avatarUrl || '',
            likes: c.Likes || 0,
            dislikes: c.Dislikes || 0,
            id: c.Id || c.id
          })) : [],
          // Fallbacks for fields not present in backend yet
          releaseYear: '',
          runtime: '',
          rating: '',
          genre: '',
          director: '',
          writers: '',
          stars: '',
          releaseDate: '',
          countryOfOrigin: '',
          language: '',
          productionCompany: '',
          userRatings: null,
        };
        setMovie(mappedMovie);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) { // Only fetch if movieId is available
      fetchMovieDetail();
    }
  }, [movieId]); // Re-run effect if movieId changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#171212] text-white text-xl">
        Loading movie details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#171212] text-red-500 text-xl">
        {error}
        <Link to="/" className="ml-4 text-blue-400 hover:underline">Go back to Home</Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#171212] text-white text-xl">
        Movie not found.
        <Link to="/" className="ml-4 text-blue-400 hover:underline">Go back to Home</Link>
      </div>
    );
  }

  // Helper function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <div key={`full-${i}`} className="text-yellow-500" data-icon="Star" data-size="18px" data-weight="fill">
          {/* Your SVG for filled star */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
          </svg>
        </div>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="text-yellow-500" data-icon="StarHalf" data-size="18px" data-weight="fill">
          {/* Your SVG for half star if you have one, or another full star for simplicity */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"></path>
          </svg>
        </div>
      );
    }
    // You might want to add empty stars as well to show a 5-star scale
    return stars;
  };


  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#171212] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* The Header component is already rendered in App.jsx and persists across routes,
            so you don't need to re-render it here within MovieDetailsPage.
            If you want a back button, you can add a Link to "/" here. */}
        {/* Example Back Button */}
        <div className="px-20 py-5">
            <Link to="/" className="text-white text-lg hover:underline">
                &larr; Back to Home
            </Link>
        </div>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">{movie.title}</p>
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">
                  {movie.releaseYear} • {movie.runtime} • {movie.averageRating} • {movie.genre}
                </p>
              </div>
            </div>
            <div className="flex w-full grow bg-[#171212] @container p-4">
              <div className="w-full gap-1 overflow-hidden bg-[#171212] @[480px]:gap-2 aspect-[3/2] rounded-xl flex">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                  style={{
                    backgroundImage: `url(${
                      movie.imagePath
                        ? `https://localhost:7245${movie.imagePath}`
                        : 'https://via.placeholder.com/150x200?text=No+Image'})`
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e8b4b4] text-[#171212] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Watch Later</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#362b2b] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Add to Favorites</span>
                </button>
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Movie Info</h2>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Director</p>
                <p className="text-white text-sm font-normal leading-normal">{movie.director}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Writers</p>
                <p className="text-white text-sm font-normal leading-normal">{movie.writers}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Stars</p>
                <p className="text-white text-sm font-normal leading-normal">{movie.stars}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Release Date</p>
                <p className="text-white text-sm font-normal leading-normal">{movie.releaseDate || movie.releaseYear}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Country of Origin</p>
                <p className="text-white text-sm font-normal leading-normal">{movie.countryOfOrigin}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Language</p>
                <p className="text-white text-sm font-normal leading-normal">{movie.language}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Production Co</p>
                <p className="text-white text-sm font-normal leading-normal">{movie.productionCompany}</p>
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Tags</h2>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              {movie.tags && movie.tags.map((tag, index) => (
                <div key={index} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#362b2b] pl-4 pr-4">
                  <p className="text-white text-sm font-medium leading-normal">{tag}</p>
                </div>
              ))}
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Comments</h2>
            {movie.comments && movie.comments.map((comment, index) => (
              <div key={comment.id || index} className="flex w-full flex-row items-start justify-start gap-3 p-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                  style={{ backgroundImage: `url("${comment.avatarUrl || 'https://via.placeholder.com/40'}")` }}
                ></div>
                <div className="flex h-full flex-1 flex-col items-start justify-start">
                  <div className="flex w-full flex-row items-start justify-start gap-x-3">
                    <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">{comment.author}</p>
                    <p className="text-[#b4a2a2] text-sm font-normal leading-normal">{comment.timestamp}</p>
                  </div>
                  <p className="text-white text-sm font-normal leading-normal">{comment.text}</p>
                  <div className="flex w-full flex-row items-center justify-start gap-9 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="text-[#b4a2a2]" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                        {/* ThumbsUp SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                        </svg>
                      </div>
                      <p className="text-[#b4a2a2] text-sm font-normal leading-normal">{comment.likes}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[#b4a2a2]" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
                        {/* ThumbsDown SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                        </svg>
                      </div>
                      <p className="text-[#b4a2a2] text-sm font-normal leading-normal">{comment.dislikes}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">User Ratings</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-6 p-4">
              <div className="flex flex-col gap-2">
                <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  {movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'}
                </p>
                <div className="flex gap-0.5">
                  {renderStars(movie.averageRating || 0)}
                </div>
                <p className="text-white text-base font-normal leading-normal">{movie.userRatings?.totalReviews || 0} reviews</p>
              </div>
              <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
                {movie.userRatings && Object.entries(movie.userRatings.distribution || {}).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([star, percentage]) => (
                  <React.Fragment key={star}>
                    <p className="text-white text-sm font-normal leading-normal">{star.split('_')[0]}</p>
                    <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#4f4040]">
                      <div className="rounded-full bg-white" style={{ width: percentage }}></div>
                    </div>
                    <p className="text-[#b4a2a2] text-sm font-normal leading-normal text-right">{percentage}</p>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
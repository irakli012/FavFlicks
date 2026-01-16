import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MovieDetailsPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  const [userRatings, setUserRatings] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const TMDB_API_KEY = '826e79d27b08eb6b49dee84d220f1dad';

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try direct TMDB API since backend returns minimal data
        try {
          const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
          );
          
          if (tmdbResponse.ok) {
            const tmdbData = await tmdbResponse.json();
            setMovie(transformMovieData(tmdbData));
            return;
          }
        } catch (tmdbError) {
          console.log('Direct TMDB API failed:', tmdbError);
        }

        // If direct TMDB failed, try backend endpoint
        const backendResponse = await fetch(`https://localhost:7245/api/Movies/tmdb/${movieId}`);
        
        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          
          // If backend has externalId but minimal data, use it to get full TMDB data
          if (backendData.externalId) {
            try {
              const tmdbResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${backendData.externalId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
              );
              
              if (tmdbResponse.ok) {
                const tmdbData = await tmdbResponse.json();
                setMovie(transformMovieData(tmdbData));
                return;
              }
            } catch (enrichError) {
              console.log('Failed to enrich with TMDB data:', enrichError);
            }
          }
          
          // Fallback to backend data if we can't enrich it
          setMovie(transformMovieData(backendData));
          return;
        }

        throw new Error('Movie not found in any source');

      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const transformMovieData = (data) => {
      // Default empty data structure
      const defaultData = {
        id: movieId,
        title: 'Untitled Movie',
        description: 'No description available',
        imagePath: '/no-image.jpg',
        backdropPath: '/no-backdrop.jpg',
        director: 'Unknown',
        writers: 'Unknown',
        stars: 'Unknown',
        genres: 'Unknown',
        releaseDate: 'Unknown',
        runtime: 'N/A',
        averageRating: 0,
        youtubeTrailerId: null,
        imdbUrl: null,
        externalUrl: data.externalId ? `https://www.themoviedb.org/movie/${data.externalId}` : null,
        releaseYear: 'N/A',
        runtimeFormatted: 'N/A',
        releaseDateFormatted: 'Unknown'
      };

      // If we got no meaningful data, return defaults
      if (!data || (data.name === 'Untitled Movie' && data.description === 'No description available')) {
        return defaultData;
      }

      // Process TMDB data structure
      if (data.title || data.overview) {
        return {
          ...defaultData,
          id: data.id || movieId,
          title: data.title || data.name || defaultData.title,
          description: data.overview || data.description || defaultData.description,
          imagePath: data.poster_path 
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : (data.imagePath || defaultData.imagePath),
          backdropPath: data.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : (data.backdropPath || defaultData.backdropPath),
          director: data.director || 
                   (data.credits?.crew?.find(c => c.job === "Director")?.name) || 
                   defaultData.director,
          writers: data.writers || 
                  (data.credits?.crew
                    ?.filter(c => c.job === "Screenplay" || c.job === "Writer")
                    ?.map(c => c.name)
                    ?.join(", ")) || 
                  defaultData.writers,
          stars: data.stars || 
                (data.credits?.cast
                  ?.slice(0, 5)
                  ?.map(c => c.name)
                  ?.join(", ")) || 
                defaultData.stars,
          genres: data.genres?.map(g => g.name)?.join(", ") || 
                 data.genre || 
                 defaultData.genres,
          releaseDate: data.release_date || data.releaseDate || defaultData.releaseDate,
          runtime: data.runtime || data.runtimeMinutes || defaultData.runtime,
          averageRating: data.vote_average || data.averageRating || defaultData.averageRating,
          youtubeTrailerId: data.videos?.results?.find(v => v.site === "YouTube" && v.type === "Trailer")?.key ||
                           data.youTubeTrailerId ||
                           defaultData.youtubeTrailerId,
          imdbUrl: data.imdb_id 
            ? `https://www.imdb.com/title/${data.imdb_id}/` 
            : (data.imdbUrl || defaultData.imdbUrl),
          externalUrl: data.homepage || 
                     (data.externalUrl || 
                      (data.id ? `https://www.themoviedb.org/movie/${data.id}` : null)),
          releaseYear: data.release_date || data.releaseDate 
            ? new Date(data.release_date || data.releaseDate).getFullYear() 
            : 'N/A',
          runtimeFormatted: data.runtime || data.runtimeMinutes 
            ? `${data.runtime || data.runtimeMinutes} min` 
            : 'N/A',
          releaseDateFormatted: data.release_date || data.releaseDate 
            ? new Date(data.release_date || data.releaseDate).toLocaleDateString() 
            : 'Unknown'
        };
      }

      // Process backend minimal data structure
      return {
        ...defaultData,
        id: data.id || movieId,
        title: data.name || defaultData.title,
        description: data.description || defaultData.description,
        externalUrl: data.externalUrl || defaultData.externalUrl,
      };
    };

    if (movieId) {
      fetchMovieDetail();
      fetchTagsAndComments();
    }
  }, [movieId]);

  // Fetch tags, comments, and user ratings
  const fetchTagsAndComments = async () => {
    try {
      // TODO: Replace with actual API calls
      // For now, using mock data
      const mockTags = ['Suspenseful', 'Intriguing', 'Character-driven', 'Twisty', 'Emotional'];
      setTags(mockTags);

      const mockComments = [
        {
          id: 1,
          userName: 'Ava Harper',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkGzmDFlelfQVhL8HVUOJNTMK1QKxyk_r4Z-U3ztG5cJYwsX5_4kEI-DQbHprKWbs6fWWruyjNTOAsLIGpE9p9QfxQSRj9oGb9PfOe4K3lPw4vo0aGwHRbzlibVDk-TuuwgpLI82WDUKiGbAcc9wgvrf6dbxIT3RA7MkrC82-p_BfV2ALVyoURAPSMhWjHzmcoqcfdrS8zNY3rzcANeQT18Rwq-fKWvxAsXB0sE3K4AolzhKJ7gBzRQC4t36HkYLT8rO5glqaTfH1B',
          comment: 'The Silent Echo is a masterpiece of suspense. The plot twists kept me on the edge of my seat, and the performances were outstanding. A must-watch!',
          timestamp: '2 weeks ago',
          likes: 12,
          dislikes: 2
        },
        {
          id: 2,
          userName: 'Noah Bennett',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyUpyuSXhfoiRPQxxL5UHFwjU1k6bVr2wiB1OeNA7lcbsPpH8CL_CvpkpjsjndowAIYxsCyiaHUHXubKV-9I9Ox5CZdODM_ZlpkZZbBtqNnNSRKRMtaQqXI-_mWSrq8eh3CI23W-06wmzT60FuHU6wxOtqu4r1KU8JaI4giDDZ5LS1AyDkwkIMnxs8lcXIxdpMI03cMeAc7JT0nvahh4z7qpui3eMIxG5dGY4xXfuiE_U5Y7P_P8DGu3cs_OwepJ_w-3TYVFLfAuC0',
          comment: 'I was captivated by the emotional depth of this film. The characters were so well-developed, and the story was both thrilling and heartbreaking. Highly recommend!',
          timestamp: '3 weeks ago',
          likes: 8,
          dislikes: 1
        }
      ];
      setComments(mockComments);

      const mockRatings = {
        averageRating: 4.5,
        totalReviews: 150,
        distribution: { 5: 70, 4: 20, 3: 5, 2: 3, 1: 2 }
      };
      setUserRatings(mockRatings);
    } catch (err) {
      console.error('Error fetching tags and comments:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[#171212] text-white">Loading...</div>;
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#171212] text-red-500">
        {error || 'Movie not found'}
        <Link to="/" className="ml-4 text-blue-400 hover:underline">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#171212] text-white">
      {/* Back button */}
      <div className="px-20 py-5">
        <Link to="/" className="text-white text-lg hover:underline">
          &larr; Back to Home
        </Link>
      </div>

      {/* Movie Header */}
      <div className="px-40 py-5">
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <div className="flex items-center mt-2 text-gray-400">
          <span>{movie.releaseYear}</span>
          {movie.runtimeFormatted && <span className="mx-2">•</span>}
          <span>{movie.runtimeFormatted}</span>
          {movie.averageRating > 0 && <span className="mx-2">•</span>}
          {movie.averageRating > 0 && (
            <span className="flex items-center">
              {movie.averageRating.toFixed(1)}
              <span className="ml-1 text-yellow-400">★</span>
            </span>
          )}
        </div>
      </div>

      {/* Movie Backdrop */}
      <div className="w-full h-[25rem] bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdropPath})` }}>
      </div>

      {/* Movie Poster */}
      <div className="flex justify-center -mt-32 mb-8"> {/* Adjusted margin to match new height */}
        <div className="w-48 h-72 bg-cover bg-center rounded-lg shadow-lg"
          style={{ backgroundImage: `url(${movie.imagePath})` }}>
        </div>
      </div>

      {/* Movie Details Container */}
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          {/* Movie Info Section */}
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
              <p className="text-white text-sm font-normal leading-normal">{movie.releaseDateFormatted}</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
              <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Runtime</p>
              <p className="text-white text-sm font-normal leading-normal">{movie.runtimeFormatted}</p>
            </div>
            {movie.imdbUrl && (
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">IMDb</p>
                <a 
                  href={movie.imdbUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 text-sm font-normal leading-normal hover:text-blue-300 transition-colors"
                >
                  View on IMDb
                </a>
              </div>
            )}
            {movie.youtubeTrailerId && (
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Trailer</p>
                <a 
                  href={`https://www.youtube.com/watch?v=${movie.youtubeTrailerId}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 text-sm font-normal leading-normal hover:text-blue-300 transition-colors"
                >
                  Watch Trailer
                </a>
              </div>
            )}
            {movie.externalUrl && (
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#4f4040] py-5">
                <p className="text-[#b4a2a2] text-sm font-normal leading-normal">Official Site</p>
                <a 
                  href={movie.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 text-sm font-normal leading-normal hover:text-blue-300 transition-colors"
                >
                  Visit Official Site
                </a>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Tags</h2>
          <div className="flex gap-3 p-3 flex-wrap pr-4">
            {tags.map((tag, index) => (
              <div key={index} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#362b2b] pl-4 pr-4">
                <p className="text-white text-sm font-medium leading-normal">{tag}</p>
              </div>
            ))}
          </div>

          {/* Comments Section */}
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Comments</h2>
          {comments.map((comment) => (
            <div key={comment.id} className="flex w-full flex-row items-start justify-start gap-3 p-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                style={{ backgroundImage: `url("${comment.avatar}")` }}
              ></div>
              <div className="flex h-full flex-1 flex-col items-start justify-start">
                <div className="flex w-full flex-row items-start justify-start gap-x-3">
                  <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">{comment.userName}</p>
                  <p className="text-[#b4a2a2] text-sm font-normal leading-normal">{comment.timestamp}</p>
                </div>
                <p className="text-white text-sm font-normal leading-normal">{comment.comment}</p>
                <div className="flex w-full flex-row items-center justify-start gap-9 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="text-[#b4a2a2]" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#b4a2a2] text-sm font-normal leading-normal">{comment.likes}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[#b4a2a2]" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
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

          {/* User Ratings Section */}
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">User Ratings</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-6 p-4">
            <div className="flex flex-col gap-2">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{userRatings.averageRating.toFixed(1)}</p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="text-white" data-icon="Star" data-size="18px" data-weight={star <= Math.round(userRatings.averageRating) ? "fill" : "regular"}>
                    {star <= Math.round(userRatings.averageRating) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"></path>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-white text-base font-normal leading-normal">{userRatings.totalReviews} reviews</p>
            </div>
            <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = userRatings.distribution[rating] || 0;
                return (
                  <React.Fragment key={rating}>
                    <p className="text-white text-sm font-normal leading-normal">{rating}</p>
                    <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#4f4040]">
                      <div className="rounded-full bg-white" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-[#b4a2a2] text-sm font-normal leading-normal text-right">{percentage}%</p>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
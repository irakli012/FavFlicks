import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MovieDetailsPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    }
  }, [movieId]);

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

      {/* Movie Details */}
      <div className="px-40 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Overview */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300">{movie.description}</p>
            
            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-400 text-sm">Director</h3>
                <p>{movie.director}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Writers</h3>
                <p>{movie.writers}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Stars</h3>
                <p>{movie.stars}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Genres</h3>
                <p>{movie.genres}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="space-y-6">
            <div>
              <h3 className="text-gray-400 text-sm">Release Date</h3>
              <p>{movie.releaseDateFormatted}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Runtime</h3>
              <p>{movie.runtimeFormatted}</p>
            </div>
            {movie.imdbUrl && (
              <div>
                <h3 className="text-gray-400 text-sm">IMDb</h3>
                <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:underline">
                  View on IMDb
                </a>
              </div>
            )}
            {movie.youtubeTrailerId && (
              <div>
                <h3 className="text-gray-400 text-sm">Trailer</h3>
                <a href={`https://www.youtube.com/watch?v=${movie.youtubeTrailerId}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:underline">
                  Watch Trailer
                </a>
              </div>
            )}
            {movie.externalUrl && (
              <div>
                <h3 className="text-gray-400 text-sm">More Info</h3>
                <a href={movie.externalUrl} target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:underline">
                  Official Site
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
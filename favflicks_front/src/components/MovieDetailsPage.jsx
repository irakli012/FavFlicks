import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import commentService from '../services/commentService';
import ratingService from '../services/ratingService';
import watchlistService from '../services/watchlistService';
import favoriteService from '../services/favoriteService';
import WatchWithModal from './WatchWithModal';

function MovieDetailsPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
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
  const { isAuthenticated, currentUser } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState(0);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [showWatchWithModal, setShowWatchWithModal] = useState(false);
  const TMDB_API_KEY = '826e79d27b08eb6b49dee84d220f1dad';

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let backendData = null;
        
        // 1. First try to fetch from backend as a local DB movie
        try {
          const backendResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/${movieId}`);
          if (backendResponse.ok) {
            backendData = await backendResponse.json();
          }
        } catch (e) {
          console.log("Local backend fetch failed:", e);
        }

        // 2. If it's a TMDB movie (either not in our DB yet, or in our DB with Source=1), fetch from TMDB
        const isTmdb = !backendData || backendData.source === 1;
        const tmdbIdToFetch = backendData ? backendData.externalId : movieId;

        if (isTmdb && tmdbIdToFetch) {
          try {
            const tmdbResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${tmdbIdToFetch}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
            );
            
            if (tmdbResponse.ok) {
              const tmdbData = await tmdbResponse.json();
              // Preserve local backend ID if it exists so we don't mix up IDs for comments/ratings
              if (backendData) {
                 tmdbData.localDbId = backendData.id; 
              } else {
                 // Even if we don't have it locally, we should query the backend to import/get the local ID
                 // so that we can show comments and ratings immediately.
                 try {
                   const importResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/tmdb/${tmdbIdToFetch}`);
                   if (importResponse.ok) {
                     const importData = await importResponse.json();
                     tmdbData.localDbId = importData.id;
                   }
                 } catch (importErr) {
                   console.log("Silent import failed", importErr);
                 }
              }
              setMovie(transformMovieData(tmdbData));
              return;
            }
          } catch (tmdbError) {
            console.log('Direct TMDB API failed:', tmdbError);
          }
        }

        // 3. Fallback to backend data (for UserImport movies or if TMDB failed)
        if (backendData) {
          // Pass the backend data
          backendData.localDbId = backendData.id;
          setMovie(transformMovieData(backendData));
          return;
        }

        // 4. Try backend import endpoint as a last resort (in case it was a tmdb id but TMDB api failed directly?)
        try {
          const importResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/tmdb/${movieId}`);
          if (importResponse.ok) {
            const importData = await importResponse.json();
            importData.localDbId = importData.id;
            setMovie(transformMovieData(importData));
            return;
          }
        } catch (importError) {
          console.log('Backend TMDB import failed:', importError);
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
          id: data.localDbId || data.id || movieId,
          localDbId: data.localDbId,
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
        id: data.localDbId || data.id || movieId,
        localDbId: data.localDbId,
        title: data.name || defaultData.title,
        description: data.description || defaultData.description,
        externalUrl: data.externalUrl || defaultData.externalUrl,
      };
    };

    if (movieId) {
      fetchMovieDetail();
      setTags(['Suspenseful', 'Intriguing', 'Character-driven']); // Mock tags for now
    }
  }, [movieId]);

  // Fetch comments, ratings, watchlist status, and favorite status when localDbId is available
  useEffect(() => {
    if (movie?.localDbId) {
      loadCommentsAndRatings(movie.localDbId);
      if (isAuthenticated) {
        checkWatchlistStatus(movie.localDbId);
        checkFavoriteStatus(movie.localDbId);
      }
    }
  }, [movie?.localDbId, isAuthenticated]);

  const checkWatchlistStatus = async (localDbId) => {
    try {
      const res = await watchlistService.checkWatchlist(localDbId);
      setIsInWatchlist(res.inWatchlist);
    } catch (e) {
      console.error("Error checking watchlist status:", e);
    }
  };

  const checkFavoriteStatus = async (localDbId) => {
    try {
      const res = await favoriteService.checkFavorite(localDbId);
      setIsFavorite(res.isFavorite);
    } catch (e) {
      console.error("Error checking favorite status:", e);
    }
  };

  const loadCommentsAndRatings = async (localDbId) => {
    try {
      const [fetchedComments, fetchedRatings] = await Promise.all([
        commentService.getCommentsByMovieId(localDbId),
        ratingService.getRatingsForMovie(localDbId)
      ]);
      setComments(fetchedComments);

      if (fetchedRatings.length > 0) {
        let sum = 0;
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        fetchedRatings.forEach(r => {
            const starValue = Math.ceil(r.value / 2); // Map 1-10 to 1-5
            sum += r.value;
            dist[starValue] = (dist[starValue] || 0) + 1;
        });
        for (const star in dist) {
            dist[star] = Math.round((dist[star] / fetchedRatings.length) * 100);
        }
        setUserRatings({
            averageRating: (sum / fetchedRatings.length) / 2, // Map to 1-5 scale for display
            totalReviews: fetchedRatings.length,
            distribution: dist
        });
      } else {
        setUserRatings({ averageRating: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
      }

      if (isAuthenticated) {
        const userRating = await ratingService.getCurrentUserRating(localDbId);
        if (userRating) {
           setCurrentUserRating(Math.ceil(userRating.value / 2));
        }
      }
    } catch(err) {
      console.error("Error loading comments/ratings:", err);
    }
  };

  const ensureLocalDbId = async () => {
    if (movie.localDbId) return movie.localDbId;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const importResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movies/tmdb/${movie.id || movieId}`, { headers });
      if (importResponse.ok) {
        const importData = await importResponse.json();
        setMovie(prev => ({...prev, localDbId: importData.id}));
        return importData.id;
      }
    } catch (e) {
      console.error("Failed to auto-import movie", e);
    }
    return null;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !newComment.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      const dbId = await ensureLocalDbId();
      if (!dbId) throw new Error("Could not ensure local movie existence.");
      
      const added = await commentService.addComment(dbId, newComment);
      setNewComment('');
      setComments(prev => [...prev, {
        id: added.id,
        content: added.content,
        userId: currentUser.id,
        userName: currentUser.userName || 'You',
        dateAdded: new Date().toISOString()
      }]);
    } catch(err) {
      console.error(err);
      if (err.message === '401_UNAUTHORIZED') {
        setShowLoginModal(true);
      } else {
        alert('Failed to add comment');
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment');
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleRatingClick = async (star) => {
    if (!isAuthenticated) {
       setShowLoginModal(true);
       return;
    }
    const dbId = await ensureLocalDbId();
    if (!dbId) return;

    try {
      const value = star * 2; // Map 1-5 to 2-10
      await ratingService.addOrUpdateRating(dbId, value);
      setCurrentUserRating(star);
      loadCommentsAndRatings(dbId); // Reload to reflect new average
    } catch(err) {
      console.error(err);
      if (err.message === '401_UNAUTHORIZED') {
        setShowLoginModal(true);
      } else {
        alert('Failed to submit rating');
      }
    }
  };

  const handleToggleWatchlist = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    const dbId = await ensureLocalDbId();
    if (!dbId) return;

    setIsUpdatingWatchlist(true);
    try {
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(dbId);
        setIsInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(dbId);
        setIsInWatchlist(true);
      }
    } catch (err) {
      console.error("Watchlist update failed:", err);
      if (err.message === '401_UNAUTHORIZED') {
        setShowLoginModal(true);
      } else {
        alert('Failed to update watchlist');
      }
    } finally {
      setIsUpdatingWatchlist(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    const dbId = await ensureLocalDbId();
    if (!dbId) return;

    setIsUpdatingFavorite(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(dbId);
        setIsFavorite(false);
      } else {
        await favoriteService.addFavorite(dbId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favorite update failed:", err);
      if (err.message === '401_UNAUTHORIZED') {
        setShowLoginModal(true);
      } else {
        alert('Failed to update favorites');
      }
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const handleOpenWatchWith = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    const dbId = await ensureLocalDbId();
    if (!dbId) return;
    setShowWatchWithModal(true);
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
      <div className="px-4 md:px-10 lg:px-20 py-5">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium text-sm bg-[#271d1d] hover:bg-[#382929] px-4 py-2 rounded-xl transition-all border border-white/5 shadow-md"
        >
          &larr; Back
        </button>
      </div>

      {/* Movie Header */}
      <div className="px-4 md:px-10 lg:px-40 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
          <div className="flex flex-wrap items-center mt-3 text-gray-400 gap-3 text-sm">
            <span className="bg-[#271d1d] px-2.5 py-1 rounded-md border border-white/5 font-semibold text-white">{movie.releaseYear}</span>
            {movie.runtimeFormatted && <span>{movie.runtimeFormatted}</span>}
            
            {/* TMDB / IMDb Rating */}
            <div className="flex items-center gap-1 bg-[#271d1d] px-3 py-1 rounded-md border border-yellow-500/20 text-yellow-400 font-bold">
              <span>TMDB/IMDb:</span>
              <span>{movie.averageRating > 0 ? movie.averageRating.toFixed(1) : 'N/A'}</span>
              <span>★</span>
            </div>

            {/* FavFlicks Rating */}
            <div className="flex items-center gap-1 bg-[#271d1d] px-3 py-1 rounded-md border border-red-500/20 text-red-400 font-bold">
              <span>FavFlicks:</span>
              <span>{userRatings.averageRating > 0 ? userRatings.averageRating.toFixed(1) : 'No ratings'}</span>
              <span className="text-yellow-400">★</span>
              {userRatings.totalReviews > 0 && <span className="text-gray-400 font-normal text-xs">({userRatings.totalReviews})</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleOpenWatchWith}
            className="px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-600/30"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            Watch With...
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={isUpdatingFavorite}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
              isFavorite
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <svg className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none stroke-currentColor'}`} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>

          <button
            onClick={handleToggleWatchlist}
            disabled={isUpdatingWatchlist}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
              isInWatchlist
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/20'
            }`}
          >
            {isInWatchlist ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                In Watchlist
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add to Watch Later
              </>
            )}
          </button>
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
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          {/* Movie Info Section */}
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Movie Info</h2>
          <div className="p-4 grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6">
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
          
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="px-4 mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-[#362b2b] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-red-500 min-h-[100px]"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="mt-2 bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="px-4 text-[#b4a2a2] mb-6">Log in to leave a comment.</p>
          )}

          {comments.length === 0 && <p className="px-4 text-[#b4a2a2]">No comments yet. Be the first to comment!</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="flex w-full flex-row items-start justify-start gap-3 p-4">
              <div className="size-10 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase shrink-0">
                 {comment.userName ? comment.userName.charAt(0) : '?'}
              </div>
              <div className="flex h-full flex-1 flex-col items-start justify-start w-full">
                <div className="flex w-full flex-row items-center justify-between gap-x-3">
                  <div className="flex flex-row items-center gap-x-2">
                    <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">{comment.userName}</p>
                    {comment.dateAdded && (
                      <p className="text-[#b4a2a2] text-xs font-normal">
                        • {new Date(comment.dateAdded).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                  {isAuthenticated && currentUser && (currentUser.id === comment.userId || currentUser.roles?.includes('Admin')) && (
                    <button 
                      onClick={() => setCommentToDelete(comment.id)}
                      className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-white text-sm font-normal leading-normal mt-1">{comment.content}</p>
              </div>
            </div>
          ))}

          {/* User Ratings Section */}
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">User Ratings</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-6 p-4">
            <div className="flex flex-col gap-2">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{userRatings.averageRating.toFixed(1)}</p>
              <div className="flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => {
                  // If logged in, user's rating dictates filled stars; else use average
                  const isFilled = isAuthenticated && currentUserRating > 0 
                    ? star <= currentUserRating 
                    : star <= Math.round(userRatings.averageRating);
                    
                  return (
                    <div 
                      key={star} 
                      className={`text-white transition-colors ${isAuthenticated ? 'hover:text-red-400' : ''}`}
                      data-icon="Star" 
                      data-size="24px" 
                      data-weight={isFilled ? "fill" : "regular"}
                      onClick={() => handleRatingClick(star)}
                    >
                      {isFilled ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"></path>
                        </svg>
                      )}
                    </div>
                  );
                })}
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

      {/* Delete Confirmation Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2a2121] p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-white/10 transform transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Delete Comment</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setCommentToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteComment(commentToDelete)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2a2121] p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-white/10 transform transition-all text-center">
            <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
            <p className="text-gray-300 mb-6">Your session has expired or you need to log in to perform this action.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <Link 
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      )}
      <WatchWithModal
        isOpen={showWatchWithModal}
        onClose={() => setShowWatchWithModal(false)}
        initialMovie={movie}
        onAddSuccess={() => {
          alert(`Watch With request sent! Check your profile's 'Watch With' tab for status.`);
        }}
      />
    </div>
  );
}

export default MovieDetailsPage;
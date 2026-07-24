import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie, isLarge = false }) {
  const outerDivClasses = `flex flex-col gap-3 ${isLarge ? 'pb-4' : 'pb-3'} ${isLarge ? 'w-[140px] md:w-[200px] min-w-[140px] md:min-w-[200px]' : 'w-full'} transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl cursor-pointer group relative`;
  const imageDivClasses = `bg-center bg-no-repeat bg-cover rounded-xl ${isLarge ? 'aspect-[2/3] w-full' : 'aspect-[3/4] w-full'} transition-transform duration-500 group-hover:scale-[1.03] shadow-md group-hover:shadow-[0_0_20px_rgba(232,38,38,0.2)]`;

  // Use externalId for TMDB movies (source === 1) when id is 0
  const movieIdentifier = movie.source === 1 && movie.id === 0 ? movie.externalId : (movie.id || movie.externalId);

  // Handle image URL
  const imageUrl = movie.imagePath?.startsWith('http') 
    ? movie.imagePath 
    : movie.imagePath 
      ? `${import.meta.env.VITE_API_BASE_URL}${movie.imagePath}`
      : 'https://via.placeholder.com/150x200?text=No+Image';

  const isUserAdded = movie.source === 0 || movie.source === 'UserImport' || movie.addedByUser != null;
  const ratingValue = movie.averageRating > 0 ? movie.averageRating.toFixed(1) : 'N/A';

  return (
    <Link 
      to={`/movie/${movieIdentifier}`}
      className={outerDivClasses} 
      style={{ textDecoration: 'none' }}
    >
      <div
        className={imageDivClasses}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Rating Badge */}
        {ratingValue !== 'N/A' && (
          <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1 shadow-md">
            ★ {ratingValue}
          </div>
        )}
      </div>

      <div className="flex-grow min-h-[60px] pl-1 flex flex-col justify-between">
        <div>
          <p className="text-white text-sm md:text-base font-semibold leading-snug line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.name || movie.title || 'Untitled Movie'}
          </p>
          <p className="text-[#b89d9d] text-xs font-normal mt-0.5">
            Rating: <strong className="text-yellow-400">{ratingValue}</strong>
          </p>
        </div>

        {/* User Badge if movie was added by user */}
        {isUserAdded && (
          <p className="text-[11px] text-amber-400 font-medium truncate mt-1">
            Added by @{movie.addedByUser?.userName || movie.addedByUserName || 'Community User'}
          </p>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;
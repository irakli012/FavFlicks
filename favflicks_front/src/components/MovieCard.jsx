import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie, isLarge = false }) {
  const outerDivClasses = `flex flex-col gap-3 ${isLarge ? 'pb-4' : 'pb-3'} ${isLarge ? 'min-w-[200px]' : 'w-full'} transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer`;
  const imageDivClasses = `bg-center bg-no-repeat bg-cover rounded-xl ${isLarge ? 'aspect-[2/3] w-[200px]' : 'aspect-[3/4] w-full'}`;

  // Use externalId for TMDB movies (source === 1) when id is 0
  const movieIdentifier = movie.source === 1 && movie.id === 0 ? movie.externalId : movie.id;

  // Handle image URL
  const imageUrl = movie.imagePath?.startsWith('http') 
    ? movie.imagePath 
    : movie.imagePath 
      ? `https://localhost:7245${movie.imagePath}`
      : 'https://via.placeholder.com/150x200?text=No+Image';

  return (
    <Link 
      to={`/movie/${movieIdentifier}`}
      className={outerDivClasses} 
      style={{ textDecoration: 'none' }}
    >
      <div
        className={imageDivClasses}
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="flex-grow min-h-[77px] pl-1">
        <p className="text-white text-base font-medium leading-normal">
          {movie.name || movie.title || 'Untitled Movie'}
        </p>
        <p className="text-[#b89d9d] text-sm font-normal leading-normal">
          Rating: {movie.averageRating != null ? movie.averageRating.toFixed(1) : 'N/A'}
        </p>
        {movie.source === 1 && (
          <span className="text-xs text-gray-400">TMDB</span>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;
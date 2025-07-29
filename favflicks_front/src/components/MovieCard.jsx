import React from 'react';
import { Link } from 'react-router-dom';

// MovieCard component to display individual movie details
function MovieCard({ movie, isLarge = false }) {
  const outerDivClasses = `flex flex-col gap-3 ${isLarge ? 'pb-4' : 'pb-3'} ${isLarge ? 'min-w-[200px]' : 'w-full'} transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer`;
  const imageDivClasses = `bg-center bg-no-repeat bg-cover rounded-xl ${isLarge ? 'aspect-[2/3] w-[200px]' : 'aspect-[3/4] w-full'}`;

  return (
    <Link to={`/movie/${movie.id || movie.Id}`}
      className={outerDivClasses} style={{ textDecoration: 'none' }}>
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
    </Link>
  );
}

export default MovieCard;
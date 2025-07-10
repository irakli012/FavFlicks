import React from 'react';

const MovieCard = ({ movie }) => {
  // Assuming 'movie' prop will contain data from your API
  // You'll replace static Stitch content with dynamic data here
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
      <img src={movie.imageUrl} alt={movie.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{movie.genre}</p>
        <div className="flex items-center justify-between">
          <span className="text-yellow-500 font-bold">{movie.averageRating} ★</span>
          {/* This button needs logic for adding/removing from favorites */}
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            {movie.isFavorite ? 'Remove from Fav' : 'Add to Fav'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
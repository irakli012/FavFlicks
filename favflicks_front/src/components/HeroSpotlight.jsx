import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSpotlight = ({ items = [], onWatchWithClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto advance hero banner every 6s
  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const backdrop = currentItem.backdropPath || currentItem.imagePath || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200';

  const targetId = currentItem.id || currentItem.externalId;

  return (
    <div className="relative w-full h-[460px] md:h-[520px] rounded-3xl overflow-hidden mb-10 shadow-2xl group border border-white/10">
      {/* Background Image with Dark Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105 group-hover:scale-100"
        style={{ backgroundImage: `url('${backdrop}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#181111] via-[#181111]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181111]/85 via-[#181111]/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 max-w-3xl">
        {/* Rating & Category Badge */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="bg-[#e82626] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/30">
            🔥 Featured Spotlight
          </span>
          {currentItem.averageRating > 0 && (
            <span className="bg-black/60 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              ★ {currentItem.averageRating.toFixed(1)} / 10
            </span>
          )}
          {currentItem.releaseDate && (
            <span className="text-gray-300 text-xs font-medium">
              {new Date(currentItem.releaseDate).getFullYear()}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
          {currentItem.name}
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6 font-normal max-w-2xl leading-relaxed">
          {currentItem.description || 'An extraordinary cinematic journey awaits. Discover ratings, reviews, and watch details now on FavFlicks.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            to={targetId ? `/movie/${targetId}` : '#'}
            className="px-6 py-3 rounded-xl bg-[#e82626] hover:bg-[#ff3b3b] text-white text-sm font-bold transition-all shadow-lg shadow-red-500/30 hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            View Details
          </Link>

          {onWatchWithClick && (
            <button
              onClick={() => onWatchWithClick(currentItem)}
              className="px-5 py-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-sm font-bold transition-all backdrop-blur-md flex items-center gap-2 hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              Watch With...
            </button>
          )}
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-[#e82626]' : 'w-2.5 bg-white/30 hover:bg-white/60'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSpotlight;

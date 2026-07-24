import React, { useRef } from 'react';

const TvSeriesSlider = ({ tvShows = [], loading = false }) => {
  const sliderRef = useRef(null);
  const DISPLAY_COUNT = 5;

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth / DISPLAY_COUNT;
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="my-8">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-2 flex items-center gap-2">
        <span>📺</span> Trending TV Series
      </h2>

      <div className="relative flex items-center">
        {/* Left Floating Overlay Button */}
        <button
          onClick={() => scrollSlider(-1)}
          className="absolute left-0 z-10 p-3 bg-[#382929] hover:bg-[#e82626] border border-[#4a3636] text-white rounded-full focus:outline-none transition-all hidden md:block shadow-2xl hover:scale-110 active:scale-95 -ml-4"
          title="Scroll Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
          </svg>
        </button>

        {/* Scrollable Container */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-stretch py-4 gap-4 md:gap-6 px-4 md:px-0">
            {loading && <p className="text-white px-4">Loading trending TV series...</p>}
            {!loading && tvShows.length === 0 && (
              <p className="text-white px-4">No TV series found.</p>
            )}
            {!loading && tvShows.map((show) => {
              const year = show.releaseDate ? new Date(show.releaseDate).getFullYear() : 'TV';
              return (
                <div
                  key={show.externalId || show.id}
                  className="w-[180px] sm:w-[210px] flex-shrink-0 group flex flex-col cursor-pointer"
                >
                  {/* Poster Container */}
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#2a1b1b] border border-[#382929] group-hover:border-[#e82626] transition-all group-hover:scale-[1.03] shadow-lg">
                    {show.imagePath ? (
                      <img
                        src={show.imagePath}
                        alt={show.name}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">No Poster</div>
                    )}

                    {/* TV Badge */}
                    <div className="absolute top-2 left-2 bg-indigo-600/90 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm">
                      TV Series
                    </div>

                    {show.averageRating > 0 && (
                      <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                        ★ {show.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3 flex flex-col">
                    <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-[#e82626] transition-colors">
                      {show.name}
                    </h3>
                    <span className="text-gray-400 text-xs mt-0.5">{year}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Floating Overlay Button */}
        <button
          onClick={() => scrollSlider(1)}
          className="absolute right-0 z-10 p-3 bg-[#382929] hover:bg-[#e82626] border border-[#4a3636] text-white rounded-full focus:outline-none transition-all hidden md:block shadow-2xl hover:scale-110 active:scale-95 -mr-4"
          title="Scroll Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TvSeriesSlider;

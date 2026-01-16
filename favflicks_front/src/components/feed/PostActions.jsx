import React from 'react';

function PostActions({ likes, comments, shares, isLiked, onLike, onComment }) {
  return (
    <div className="flex flex-wrap gap-4 px-4 py-2">
      <button
        onClick={onLike}
        className="flex items-center justify-center gap-2 px-3 py-2 hover:bg-[#271c1c] rounded-lg transition-colors"
      >
        <div className={`${isLiked ? 'text-[#d4111b]' : 'text-[#b99d9e]'}`}>
          {isLiked ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
            </svg>
          )}
        </div>
        <p className={`text-[13px] font-bold leading-normal tracking-[0.015em] ${isLiked ? 'text-[#d4111b]' : 'text-[#b99d9e]'}`}>
          {likes}
        </p>
      </button>

      <button
        onClick={onComment}
        className="flex items-center justify-center gap-2 px-3 py-2 hover:bg-[#271c1c] rounded-lg transition-colors"
      >
        <div className="text-[#b99d9e]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
          </svg>
        </div>
        <p className="text-[#b99d9e] text-[13px] font-bold leading-normal tracking-[0.015em]">
          {comments}
        </p>
      </button>

      <button className="flex items-center justify-center gap-2 px-3 py-2 hover:bg-[#271c1c] rounded-lg transition-colors">
        <div className="text-[#b99d9e]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z"></path>
          </svg>
        </div>
        <p className="text-[#b99d9e] text-[13px] font-bold leading-normal tracking-[0.015em]">
          {shares}
        </p>
      </button>
    </div>
  );
}

export default PostActions;

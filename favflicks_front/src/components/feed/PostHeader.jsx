import React from 'react';

function PostHeader({ user, timestamp }) {
  return (
    <div className="flex items-center gap-4 bg-[#181111] px-4 min-h-[72px] py-2 justify-between border-b border-[#392829]">
      <div className="flex items-center gap-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 shrink-0"
          style={{ backgroundImage: `url("${user.avatar}")` }}
        ></div>
        <div className="flex flex-col justify-center">
          <p className="text-white text-base font-medium leading-normal line-clamp-1">
            {user.name}
          </p>
          <p className="text-[#b99d9e] text-sm font-normal leading-normal line-clamp-2">
            {user.username}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <p className="text-[#b99d9e] text-sm font-normal leading-normal">{timestamp}</p>
      </div>
    </div>
  );
}

export default PostHeader;

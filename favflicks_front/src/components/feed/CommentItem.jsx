import React from 'react';

function CommentItem({ comment }) {
  return (
    <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0"
        style={{ backgroundImage: `url("${comment.user.avatar}")` }}
      ></div>
      <div className="flex h-full flex-1 flex-col items-start justify-start">
        <div className="flex w-full flex-row items-start justify-start gap-x-3">
          <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">
            {comment.user.name}
          </p>
          <p className="text-[#b99d9e] text-sm font-normal leading-normal">{comment.timestamp}</p>
        </div>
        <p className="text-white text-sm font-normal leading-normal">{comment.content}</p>
      </div>
    </div>
  );
}

export default CommentItem;

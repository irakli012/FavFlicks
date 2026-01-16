import React, { useState } from 'react';

function CommentInput({ postId, onSubmit }) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      // TODO: Call API to submit comment
      console.log('Submitting comment:', comment, 'for post:', postId);
      onSubmit?.(comment, postId);
      setComment('');
    }
  };

  return (
    <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
      <form onSubmit={handleSubmit} className="flex flex-col min-w-40 flex-1">
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#543b3c] bg-[#271c1c] focus:border-[#543b3c] h-14 placeholder:text-[#b99d9e] p-[15px] text-base font-normal leading-normal"
        />
      </form>
    </div>
  );
}

export default CommentInput;

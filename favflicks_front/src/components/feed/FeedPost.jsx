import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

function FeedPost({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="flex flex-col bg-[#181111] rounded-xl overflow-hidden border border-[#392829]">
      {/* Post Header */}
      <PostHeader user={post.user} timestamp={post.timestamp} />

      {/* Movie Card */}
      <div className="p-4 @container">
        <Link to={`/movie/${post.movie.id}`} className="block">
          <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-[#271c1c] hover:bg-[#2d2121] transition-all duration-200 cursor-pointer">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{ backgroundImage: `url("${post.movie.imagePath}")` }}
            ></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4 px-4">
              <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                {post.movie.title}
              </p>
              <div className="flex items-end gap-3 justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-[#b99d9e] text-base font-normal leading-normal">
                    {post.movie.genres}
                  </p>
                  <p className="text-[#b99d9e] text-base font-normal leading-normal">
                    {post.movie.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Post Actions */}
      <PostActions
        likes={likes}
        comments={post.comments}
        shares={post.shares}
        isLiked={isLiked}
        onLike={handleLike}
        onComment={handleCommentClick}
      />

      {/* Comment Input */}
      <CommentInput postId={post.id} />

      {/* Comments List */}
      {showComments && post.commentsList && post.commentsList.length > 0 && (
        <div className="flex flex-col">
          {post.commentsList.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedPost;

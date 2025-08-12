'use client';

import { FaThumbsUp, FaCommentDots, FaShare } from "react-icons/fa";

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';


type Video = {
  _id: string;
  caption: string;
  videoUrl: string;
  userId: string;
  username: string;
  likes: string[];
  comments: {
    userId: string;
    username: string;
    text: string;
    createdAt: Date;

  }[];
};

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const { user } = useUser();
  const userId = user?.id;
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);

  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const toggleComments = (videoId: string) => {
    setOpenCommentId(prev => (prev === videoId ? null : videoId));
  };


  useEffect(() => {
    const fetchVideos = async () => {
      if (!userId) return;



      try {
        const res = await axios.get(`/api/videos?userId=${userId}`);

        setVideos(res.data.videos);
        console.log('Fetched videos:', res.data.videos);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };


    fetchVideos();
  }, [userId]);


  // Handle scroll-based auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const targetVideo = entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {
            // Pause all videos
            videoRefs.current.forEach((video) => {
              if (video && video !== targetVideo) {
                video.pause();
              }
            });

            // Play the one in view from start
            targetVideo.currentTime = 0;
            targetVideo
              .play()
              .catch((err) => console.warn("Autoplay failed:", err.message));
          } else {
            targetVideo.pause();
          }
        });
      },
      {
        threshold: 0.6, // Trigger when ~60% in view
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);


  const handleLike = async (videoId: string) => {
    if (!userId) return;

    try {
      const res = await axios.post(`/api/videos/${videoId}/like`, { userId });
      const updatedLikes = res.data.likes;

      // Update the video in state
      setVideos((prev) =>
        prev.map((vid) =>
          vid._id === videoId ? { ...vid, likes: updatedLikes } : vid
        )
      );
    } catch (error) {
      console.error('Like failed:', error);
    }
  };


  const handleShare = (video: Video) => {
  const shareData = {
    title: video.caption,
    text: `Check out this video from @${video.username}!`,
    url: window.location.origin + "/video/" + video._id, // adjust to your routing
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log("Video shared successfully"))
      .catch((err) => console.error("Share failed:", err));
  } else {
    navigator.clipboard.writeText(shareData.url)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  }
};





  const handleAddComment = async (videoId: string) => {
    const text = commentText[videoId];
    const username = user?.username || user?.firstName || 'Unknown';
    if (!text || !userId) return;

    try {
      const res = await axios.post(`/api/videos/${videoId}/comments`, {
        userId,
        username,
        text,
      });

      const updatedComments = res.data.comments;

      // Update that video's comments in state
      setVideos((prev) =>
        prev.map((vid) =>
          vid._id === videoId ? { ...vid, comments: updatedComments } : vid
        )
      );

      // Clear input
      setCommentText((prev) => ({ ...prev, [videoId]: '' }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };




  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {videos.map((video, index) => (
        <div
          key={video._id}
          className="h-screen snap-start flex items-center justify-center bg-black text-white"
        >
          {/* Video and Buttons Container */}
          <div className="flex items-center gap-6">
            {/* Video */}
            <div className="relative h-[80vh] w-auto">
              <video
                ref={(el) => {
                  if (el) videoRefs.current[index] = el;
                }}
                src={video.videoUrl}
                muted
                loop
                playsInline
                className="h-full w-auto"
              />

              {/* Caption + UserId (bottom-left inside video) */}
              <div className="absolute bottom-4 left-4 text-left">
                <p className="font-semibold">@{video.username}</p>
                <p className="text-sm">{video.caption}</p>
              </div>
            </div>

            {/* Like & Comment Buttons (stacked beside video) */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => handleLike(video._id)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full"
              >
                <FaThumbsUp
                  size={20}
                  color={userId && video.likes?.includes(userId) ? "red" : "white"}

                />
                {video.likes?.length || 0}
              </button>
              <button
                onClick={() => toggleComments(video._id)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full"
              >
                <FaCommentDots size={20} />
                {video.comments?.length || 0}
              </button>
              {/* Share Button */}
              <button
                onClick={() => handleShare(video)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full"
              >
                <FaShare size={20} />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {openCommentId === video._id && (
            <div className="absolute bottom-20 bg-white text-black p-4 rounded max-w-sm w-full space-y-2">
              <p className="font-semibold">Comments</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {video.comments?.length ? (
                  video.comments.map((comment, idx) => (
                    <p key={idx} className="text-sm border-b py-1">
                      <strong>{comment.username}:</strong> {comment.text}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[video._id] || ''}
                  onChange={(e) =>
                    setCommentText((prev) => ({ ...prev, [video._id]: e.target.value }))
                  }
                  className="flex-1 border px-2 py-1 rounded text-sm"
                />
                <button
                  onClick={() => handleAddComment(video._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );


}

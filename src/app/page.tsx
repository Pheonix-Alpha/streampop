'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';


type Video = {
  _id: string;
  caption: string;
  videoUrl: string;
  userId: string;
};

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const { user } = useUser();
const userId = user?.id;


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
    const handleScroll = () => {
      videoRefs.current.forEach((video) => {
        if (!video) return;

        const rect = video.getBoundingClientRect();
        const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (inView) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [videos]);

  return (
    <div className="space-y-10">
      {videos.map((video, index) => (
        <div
          key={video._id}
          className="h-screen flex flex-col items-center justify-center bg-black text-white"
        >
          <video
  ref={(el) => {
    if (el) videoRefs.current[index] = el;
  }}
  src={video.videoUrl}
  muted
  loop
  playsInline
  className="h-[80vh] w-auto"
/>

          <p className="mt-4 text-lg font-semibold">{video.caption}</p>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Router } from 'next/router';

const UploadForm = () => {
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!videoFile || !caption || !userId) {
      alert('Please provide a caption, select a video, and sign in.');
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', 'streampop');

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/dlqcykydq/video/upload`,
        formData
      );

      const videoUrl = cloudRes.data.secure_url;

      // Step 2: Save to DB with correct userId
      await axios.post('/api/videos', {
        caption,
        videoUrl,
        userId,
        username: user?.username || user?.firstName || 'Anonymous',
      });

      alert('Upload successful!');
      setCaption('');
      setVideoFile(null);
     

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>

      <input
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        className="mb-2"
      />

      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadForm;

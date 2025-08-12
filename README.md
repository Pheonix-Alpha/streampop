# Video Sharing App

A Next.js + MongoDB app for uploading, viewing, liking, commenting, and sharing short videos, similar to TikTok.

---

## Features

- Upload videos with captions
- Auto-play videos on scroll with smooth snapping
- Like and unlike videos (with live count)
- Add and view comments on videos
- Share videos via shareable link
- User authentication integrated with Clerk

---

## Tech Stack

- Next.js (React, TypeScript)
- MongoDB + Mongoose
- Clerk for Authentication
- Cloudinary for video storage
- Tailwind CSS + React Icons for UI

---

## Setup Instructions

1. Clone repo and install dependencies:

   ```bash
   git clone https://github.com/yourusername/video-sharing-app.git
   cd video-sharing-app
   npm install



Route                         	Method	                                                      Description
/api/videos                   	GET	                                  Fetch all videos (optionally filtered by userId query param)
/api/videos	                    POST	                                Upload/save a new video with caption, URL, userId
/api/videos/[videoId]/like    	POST	                                Like or unlike a video by userId
/api/videos/[videoId]/comments	POST	                                Add a comment on a video with userId, username, text
/api/videos/[videoId]/comments	GET	                                  (Optional) Fetch comments for a video



   npm run dev

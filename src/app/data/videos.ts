// src/data/videos.ts

export interface Video {
  id: string;
  url: string;
  caption: string;
  user: string;
}

export const videos: Video[] = [
  {
    id: "1",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Big Buck Bunny!",
    user: "bunny_creator",
  },
  {
    id: "2",
    url: "https://www.w3schools.com/html/movie.mp4",
    caption: "Bear in the wild 🐻",
    user: "wildlife_lover",
  },
  {
    id: "3",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Time-lapse sky 🌌",
    user: "skygazer",
  },
];

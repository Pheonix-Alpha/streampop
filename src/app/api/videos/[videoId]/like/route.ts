import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Extract videoId from the URL
    const urlParts = req.nextUrl.pathname.split('/');
    const videoId = urlParts[urlParts.indexOf('videos') + 1];

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const alreadyLiked = video.likes.includes(userId);

    if (alreadyLiked) {
      video.likes = video.likes.filter((id: string) => id !== userId);
    } else {
      video.likes.push(userId);
    }

    await video.save();

    return NextResponse.json({
      message: alreadyLiked ? 'Unliked' : 'Liked',
      likes: video.likes,
    });
  } catch (error) {
    console.error('Like Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

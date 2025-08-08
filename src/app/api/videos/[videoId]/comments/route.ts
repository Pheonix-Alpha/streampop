import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';

export async function POST(req: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    await dbConnect();
    const { videoId } = params;
    const { userId, text,username} = await req.json();

    if (!userId || !text) {
      return NextResponse.json({ error: 'Missing userId or text' }, { status: 400 });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    video.comments.push({ userId, text,username});
    await video.save();

    return NextResponse.json({ message: 'Comment added', comments: video.comments });
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

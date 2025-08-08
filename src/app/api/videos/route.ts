import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Video from '@/models/Video';

// POST: Save video to MongoDB
export async function POST(req: NextRequest) {
  try {
    console.log('Connecting to DB...');
    await dbConnect();
    console.log('DB connected.');

    const body = await req.json();
    console.log('Request Body:', body);

    const { caption, videoUrl, userId,username } = body;

    const newVideo = new Video({ caption, videoUrl, userId,username });
    await newVideo.save();

    return NextResponse.json({ message: 'Video saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('❌ API ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET: Fetch videos from MongoDB
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ videos: [] });
    }

 
const videos = await Video.find().sort({ createdAt: -1 });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ videos: [] }, { status: 500 });
  }
}


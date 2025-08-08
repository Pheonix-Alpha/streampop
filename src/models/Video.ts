import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  caption: string;
  videoUrl: string;
  userId: string;
  username: String, 
  likes:string[];
  comments: {
    userId: string;
    username:string;
    text:string;
    createdAt: Date;
  }[];
}

const VideoSchema = new Schema<IVideo>(
  {
    caption: { type: String, required: true },
    videoUrl: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
   
    likes: [{ type: String}],
      comments: [
      {
        userId: { type: String, required: true },
        text: { type: String, required: true },
         username: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

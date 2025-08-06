import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  caption: string;
  videoUrl: string;
  userId: string;
}

const VideoSchema = new Schema<IVideo>(
  {
    caption: { type: String, required: true },
    videoUrl: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

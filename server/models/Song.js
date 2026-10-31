import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  genre: { type: String },
  coverUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  lyrics: [{
    text: { type: String, required: true }
  }],
  categories: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Song', songSchema);
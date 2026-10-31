import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  coverUrl: { type: String, default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400' }, // Default image
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Playlist', playlistSchema);
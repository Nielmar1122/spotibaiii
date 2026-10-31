import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: { type: String, default: 'Spotibaiii Partner Ad' },
  videoUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Ad', adSchema);
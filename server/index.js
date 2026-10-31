import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import songRoutes from './routes/songRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import adRoutes from './routes/adRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS (Allow both localhost and the live Render URL)
app.use(cors({
  origin: ['http://localhost:5173', 'https://spotibaiii.onrender.com'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// THIS IS THE EXACT LINE THAT ALLOWS THE BROWSER TO SEE THE FILES (Locally)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/ads', adRoutes);

// --- PRODUCTION STATIC FILE SERVING ---
if (process.env.NODE_ENV === 'production') {
  // Serve the built React app
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Any route that doesn't match the API goes to React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  // Local development root route
  app.get('/', (req, res) => {
    res.send('Spotibaiii API is running...');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
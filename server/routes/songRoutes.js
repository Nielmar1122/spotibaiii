import express from 'express';
import Song from '../models/Song.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET all songs (with Search functionality)
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    if (req.query.search) {
      query = {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { artist: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }

    const songs = await Song.find(query).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new song
router.post(
  '/', 
  upload.fields([
    { name: 'cover', maxCount: 1 }, 
    { name: 'audio', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      const { title, artist, album, genre, lyricsText } = req.body;
      
      const coverFile = req.files && req.files['cover'] ? req.files['cover'][0] : null;
      const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

      if (!audioFile) {
        return res.status(400).json({ message: 'Music file is required' });
      }

      // USE THE CLOUDINARY PATH DIRECTLY
      const coverUrl = coverFile ? coverFile.path : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400';
      const audioUrl = audioFile.path;

      // Parse lyrics: just split by new line
      const lyrics = lyricsText ? lyricsText.split('\n')
        .filter(line => line.trim() !== '') 
        .map((line) => {
          return { text: line.trim() };
        }) : [];

      const song = new Song({
        title, 
        artist,
        album,
        genre, 
        coverUrl, 
        audioUrl, 
        duration: 180, 
        lyrics
      });

      const createdSong = await song.save();
      res.status(201).json(createdSong);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
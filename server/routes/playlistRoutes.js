import express from 'express';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// GET all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new playlist
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlist = new Playlist({ name, description });
    const createdPlaylist = await playlist.save();
    res.status(201).json(createdPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
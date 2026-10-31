import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // SEND EVERYTHING REACT NEEDS, INCLUDING FAVORITES
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      favorites: user.favorites || [], // <-- THIS WAS LIKELY MISSING
      token: generateToken(user._id),
    });
    
  } catch (error) {
    console.log("🚨 REGISTER ERROR:", error.message); 
    res.status(500).json({ message: error.message });
  }
});
// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log("LOGIN ATTEMPT:", email); // <-- Look at your terminal for this!

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("✅ User found:", user.email);
    console.log("Typed Password:", password);
    console.log("Hashed Password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("✅ Password matches! Sending token.");
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      favorites: user.favorites || [],
      token: generateToken(user._id),
    });
    
  } catch (error) {
    console.log("🚨 LOGIN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});
    
// @route GET /api/auth/favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    // Find the user and populate the favorites array with actual song data
    const user = await User.findById(req.user._id).populate('favorites');
    
    console.log("FETCHING FAVORITES FOR:", user.username);
    console.log("FAVORITES FOUND:", user.favorites.length);

    res.json(user.favorites);
  } catch (error) {
    console.log("🚨 FAVORITES ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});
// @route POST /api/auth/favorites/:songId
router.post('/favorites/:songId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(req.params.songId)) {
      user.favorites.push(req.params.songId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/auth/favorites/:songId
router.delete('/favorites/:songId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.songId);
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/recent/:songId (Add to recently played)
router.post('/recent/:songId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Remove the song if it's already in the history so we don't have duplicates
    user.recentlyPlayed = user.recentlyPlayed.filter(
      item => item.song.toString() !== req.params.songId
    );

    // Add it to the beginning of the array
    user.recentlyPlayed.unshift({ song: req.params.songId });
    
    // Keep only the last 50 songs
    if (user.recentlyPlayed.length > 50) {
      user.recentlyPlayed.pop();
    }

    await user.save();
    res.json(user.recentlyPlayed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/recent (Get recently played)
router.get('/recent', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('recentlyPlayed.song');
    // Filter out any songs that might have been deleted from the database
    const validHistory = user.recentlyPlayed.filter(item => item.song != null);
    res.json(validHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/auth/avatar
router.put('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.file) {
      // Save the path to the uploaded image
      const videoUrl = req.file.path;
      await user.save();
    }
    res.json({ avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
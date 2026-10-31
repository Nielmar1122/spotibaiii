import express from 'express';
import Ad from '../models/Ad.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ad = await Ad.findOne({ isActive: true });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
import express from "express";
const router = express.Router();
import NewsItem from "../models/NewsItem.js";

router.get('/:subpageId', async (req, res) => {
  try {
    const news = await NewsItem.find({ subpageId: req.params.subpageId })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(news);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

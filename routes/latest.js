import express from "express";
import NewsItem from "../models/NewsItem.js";

const router = express.Router();

/**
 * GET /api/new/random?limit=10
 * "Browse all" feed — random items from the whole collection,
 * shuffled fresh on every request.
 */
router.get("/random", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const news = await NewsItem.aggregate([
      { $sample: { size: limit } },
    ]);

    res.status(200).json(news);
  } catch (err) {
    console.error("Random API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
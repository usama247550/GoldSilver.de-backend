import express from "express";
import NewsItem from "../models/NewsItem.js";

const router = express.Router();

/**
 * GET /api/summary/:subpageId
 * Fetch latest news summaries for a subpage (NO AI processing here)
 */
router.get("/:subpageId", async (req, res) => {
  try {
    const { subpageId } = req.params;



    // 1️⃣ Fetch latest 10 news items
    const newsItems = await NewsItem.find({ subpageId })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!newsItems.length) {
      return res.status(404).json({ error: "No news items found" });
    }

    // 2️⃣ Return clean data (already processed by agents)
    res.json({
      subpageId,
      count: newsItems.length,
      data: newsItems,
    });
  } catch (err) {
    console.error("Summary route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

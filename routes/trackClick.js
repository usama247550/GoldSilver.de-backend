import express from "express";
const router = express.Router();
import NewsItem from "../models/NewsItem.js";

router.post("/:id/click", async (req, res) => {
  try {
    await NewsItem.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (err) {
    console.error("Click tracking error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
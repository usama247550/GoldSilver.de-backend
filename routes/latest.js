import express from "express";
import NewsItem from "../models/NewsItem.js";

const router = express.Router();

router.get("/latest", async (req, res) => {
  try {
    const perCategory = parseInt(req.query.perCategory) || 1;

    const latestNews = await NewsItem.aggregate([
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$subpageId",
          items: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          items: { $slice: ["$items", perCategory] },
        },
      },
      { $unwind: "$items" },
      { $replaceRoot: { newRoot: "$items" } },
      { $sort: { date: -1 } },
    ]);

    res.json(latestNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
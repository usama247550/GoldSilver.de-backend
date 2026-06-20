import express from "express";
import Price from "../models/Price.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase().trim();

    if (!q) {
      return res.json([]);
    }

    const price = await Price.findOne().sort({ createdAt: -1 });

    if (!price) {
      return res.json([]);
    }

    const searchableItems = [
      {
        name: "Gold",
        key: "gold_usd",
        value: price.gold_usd,
      },
      {
        name: "Silver",
        key: "silver_usd",
        value: price.silver_usd,
      },
      {
        name: "Bitcoin",
        key: "btc_usd",
        value: price.btc_usd ,
      },
      {
        name: "Ethereum",
        key: "eth_usd",
        value: price.eth_usd,
      },
      {
        name: "EUR/USD",
        key: "eur_usd",
        value: price.eur_usd,
      },
      {
        name: "CPI",
        key: "cpi",
        value: price.cpi,
      },
    ];

    const results = searchableItems.filter((item) =>
      item.name.toLowerCase().includes(q)
    );

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Search failed",
    });
  }
});

export default router;
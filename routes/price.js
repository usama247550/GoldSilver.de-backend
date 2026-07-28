import express from "express";
import Price from "../models/Price.js";

const router = express.Router();

// Helper: percentage change calculate karo
function calcChange(current, prev) {
  if (!prev || prev === 0) return 0;
  return parseFloat((((current - prev) / prev) * 100).toFixed(2));
}

router.get("/", async (req, res) => {
  try {
    const prices = await Price.findOne();

    if (!prices) {
      return res.status(404).json({ message: "No price data yet" });
    }

    // ───────── Clean response — only what frontend needs ─────────
    // const response = {
    //   gold_usd:   { value: prices.gold_usd,   change: calcChange(prices.gold_usd,   prices.gold_usd_prev)   },
    //   silver_usd: { value: prices.silver_usd, change: calcChange(prices.silver_usd, prices.silver_usd_prev) },
    //   btc_usd:    { value: prices.btc_usd,    change: calcChange(prices.btc_usd,    prices.btc_usd_prev)    },
    //   eth_usd:    { value: prices.eth_usd,    change: calcChange(prices.eth_usd,    prices.eth_usd_prev)    },
    //   eur_usd:    { value: prices.eur_usd,    change: calcChange(prices.eur_usd,    prices.eur_usd_prev)    },
    //   cpi:        { value: prices.cpi,        change: calcChange(prices.cpi,        prices.cpi_prev)        },
    //   updatedAt:  prices.updatedAt,
    // };
const response = {
  gold_usd:   { value: prices.gold_usd,   change: calcChange(prices.gold_usd,   prices.gold_usd_prev)   },
  silver_usd: { value: prices.silver_usd, change: calcChange(prices.silver_usd, prices.silver_usd_prev) },
  btc_usd:    { value: prices.btc_usd,    change: calcChange(prices.btc_usd,    prices.btc_usd_prev)    },
  eth_usd:    { value: prices.eth_usd,    change: calcChange(prices.eth_usd,    prices.eth_usd_prev)    },
  eur_usd:    { value: prices.eur_usd,    change: calcChange(prices.eur_usd,    prices.eur_usd_prev)    },
  cpi:        { value: prices.cpi,        change: calcChange(prices.cpi,        prices.cpi_prev)        },
  updatedAt: prices.updatedAt, // raw UTC — ISO string, database ka original
  updatedAtPKT: new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(prices.updatedAt)),
};
    res.json(response);
  } catch (err) {
    console.error("[PRICE ROUTE ERROR]", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;



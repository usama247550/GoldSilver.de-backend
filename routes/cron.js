import express from "express";
import priceAgent from "../agents/priceAgent.js";
import { runAllAgents } from "../runAgents.js";
import { sendWeeklyNewslettersTimezoneAware } from "../agents/newsletterAgent.js";

const router = express.Router();

// Middleware to verify Vercel Cron secret
const verifyCronSecret = (req, res, next) => {
  const cronSecret = process.env.CRON_SECRET;
  // If CRON_SECRET is set in environment variables, verify it
  if (cronSecret) {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON] Unauthorized request attempt to trigger cron job");
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  next();
};

// GET /api/cron/prices
router.get("/prices", verifyCronSecret, async (req, res) => {
  console.log("[CRON] Triggered price update...");
  try {
    await priceAgent();
    res.json({ success: true, message: "Prices updated successfully" });
  } catch (err) {
    console.error("[CRON PRICE ERROR]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cron/news
router.get("/news", verifyCronSecret, async (req, res) => {
  console.log("[CRON] Triggered news scrape...");
  try {
    await runAllAgents();
    res.json({ success: true, message: "News agents run successfully" });
  } catch (err) {
    console.error("[CRON NEWS ERROR]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cron/newsletter — temporary test endpoint for timezone-aware newsletter delivery
router.get("/newsletter", verifyCronSecret, async (req, res) => {
  console.log("[CRON] Triggered timezone-aware newsletter send...");
  try {
    await sendWeeklyNewslettersTimezoneAware();
    res.json({ success: true });
  } catch (err) {
    console.error("[CRON NEWSLETTER ERROR]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;

// import express from "express";
// import priceAgent from "../agents/priceAgent.js";
// import { runAllAgents } from "../runAgents.js";
// import { sendWeeklyNewslettersTimezoneAware } from "../agents/newsletterAgent.js";

// const router = express.Router();

// // GET /api/cron/prices — every 15 min via cron-job.org
// router.get("/prices", async (req, res) => {
//   res.json({ success: true, message: "Price update started" });
//   try {
//     await priceAgent();
//   } catch (err) {
//     console.error("[CRON PRICE ERROR]", err.message);
//   }
// });

// // GET /api/cron/news — daily 06:00 via cron-job.org
// router.get("/news", async (req, res) => {
//   res.json({ success: true, message: "News scrape started" });
//   try {
//     await runAllAgents();
//   } catch (err) {
//     console.error("[CRON NEWS ERROR]", err.message);
//   }
// });

// // GET /api/cron/newsletter — every hour via cron-job.org
// router.get("/newsletter", async (req, res) => {
//   res.json({ success: true, message: "Newsletter check started" });
//   try {
//     await sendWeeklyNewslettersTimezoneAware();
//   } catch (err) {
//     console.error("[CRON NEWSLETTER ERROR]", err.message);
//   }
// });

// export default router;


import express from "express";
import priceAgent from "../agents/priceAgent.js";
import { runAllAgents } from "../runAgents.js";
import { sendWeeklyNewslettersTimezoneAware } from "../agents/newsletterAgent.js";

const router = express.Router();

// GET /api/cron/prices — every 15 min via cron-job.org
router.get("/prices", async (req, res) => {
  try {
    await priceAgent();
    res.json({ success: true, message: "Price update completed" });
  } catch (err) {
    console.error("[CRON PRICE ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cron/news — daily 06:00 via cron-job.org
router.get("/news", async (req, res) => {
  try {
    await runAllAgents();
    res.json({ success: true, message: "News scrape completed" });
  } catch (err) {
    console.error("[CRON NEWS ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cron/newsletter — every hour via cron-job.org
router.get("/newsletter", async (req, res) => {
  try {
    await sendWeeklyNewslettersTimezoneAware();
    res.json({ success: true, message: "Newsletter check completed" });
  } catch (err) {
    console.error("[CRON NEWSLETTER ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
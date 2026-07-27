import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDataBase from "./config/db.js";

import news from "./routes/news.js";
import price from "./routes/price.js";
import subscribe from "./routes/subscribe.js";
import summary from "./routes/summary.js";
import searchRoutes from "./routes/searchRoutes.js";
import latest from "./routes/latest.js";
import cronRoutes from "./routes/cron.js";
import trackClickRoute from "./routes/trackClick.js";

const app = express();

// Robust CORS origin setup (strips trailing slashes and handles standard/dev origins)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "https://www.goldsilver.de",
  "https://goldsilver.de",
]
  .map((url) => (url ? url.trim().replace(/\/$/, "") : null))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());


app.use(async (req, res, next) => {
  try {
    await connectDataBase();
    next();
  } catch (err) {
    console.error("DB connection failed for request:", err.message);
    res.status(503).json({ error: "Database temporarily unavailable" });
  }
});

app.use("/api/news", news);
app.use("/api/prices", price);
app.use("/api/subscribe", subscribe);
app.use("/api/summary", summary);
app.use("/api/search", searchRoutes);
app.use("/api/new", latest);
app.use("/api/cron", cronRoutes);
app.use("/api/news", trackClickRoute);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB FIRST, then start listening
const start = async () => {
  await connectDataBase();

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    import("./agents/scheduler.js").then(() => {
      console.log("[SERVER] Scheduler loaded successfully");
    });
  } else {
    console.log("[SERVER] Serverless mode: Scheduler execution bypassed");
  }
};

start().catch((err) => {
  console.error("[SERVER] Startup error:", err.message);
});

export default app;
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDataBase from "./config/db.js";

import news from "./routes/news.js";
import price from "./routes/price.js";
import subscribe from "./routes/subscribe.js";
import summary from "./routes/summary.js";
import searchRoutes from "./routes/searchRoutes.js";
import latest from "./routes/latest.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.use("/api/news", news);
app.use("/api/prices", price);
app.use("/api/subscribe", subscribe);
app.use("/api/summary", summary);
app.use("/api/search", searchRoutes);
app.use("/api/new", latest);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDataBase().then(() => {
  import("./agents/scheduler.js").then(() => {
    console.log("[SERVER] Scheduler loaded successfully");
  });
});
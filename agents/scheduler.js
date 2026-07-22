



// import cron from "node-cron";
// import priceAgent from "./priceAgent.js";
// import { runAllAgents } from "../runAgents.js";
// //  Bootstrap function
// const startScheduler = async () => {
//   console.log("[SCHEDULER] Starting...");

//   try {
//     await priceAgent();
//   } catch (err) {
//     console.error("[STARTUP PRICE ERROR]", err.message);
//   }

//   //  RUN ON SERVER START
//   console.log("[STARTUP] Running all agents...");
//   await runAllAgents();

//   console.log("[SCHEDULER] Initialized ");

//   // ───── DAILY NEWS AGENTS ─────
//   cron.schedule(
//     "0 6 * * *",
//     async () => {
//       console.log("[SCHEDULER] Running daily agents...");
//       await runAllAgents();
//       console.log("[SCHEDULER] All agents done ");
//     },
//     { timezone: "Europe/Berlin" }
//   );

//   // ───── PRICE AGENT (15 min) ─────
//   cron.schedule("*/15 * * * *", async () => {
//     try {
//       await priceAgent();
//     } catch (err) {
//       console.error("[PRICE AGENT ERROR]", err.message);
//     }
//   });
// };

// startScheduler();

import cron from "node-cron";
import priceAgent from "./priceAgent.js";
import { runAllAgents } from "../runAgents.js";
import sendWeeklyNewsletters from "./newsletterAgent.js";

const startScheduler = async () => {
  console.log("[SCHEDULER] Starting...");

  try {
    await priceAgent();
  } catch (err) {
    console.error("[STARTUP PRICE ERROR]", err.message);
  }

  console.log("[STARTUP] Running all agents...");
  await runAllAgents();

  console.log("[SCHEDULER] Initialized ");

  cron.schedule("0 6 * * *", async () => {
    console.log("[SCHEDULER] Running daily agents...");
    await runAllAgents();
    console.log("[SCHEDULER] All agents done ");
  }, { timezone: "Europe/Berlin" });

  cron.schedule("*/15 * * * *", async () => {
    try {
      await priceAgent();
    } catch (err) {
      console.error("[PRICE AGENT ERROR]", err.message);
    }
  });

  cron.schedule("59 17 * * 0", async () => {
    console.log("[SCHEDULER] Sending weekly newsletters...");
    try {
      await sendWeeklyNewsletters();
    } catch (err) {
      console.error("[NEWSLETTER ERROR]", err.message);
    }
  }, { timezone: "Europe/Berlin" });
};

startScheduler();
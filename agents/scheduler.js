// import cron from "node-cron";
// import sp1 from "./subpages/agent_sp1_macro";
// import sp2 from "./subpages/agent_sp2_ai";
// import sp3 from "./subpages/agent_sp3_storage";
// import sp4 from "./subpages/agent_sp4_estate";
// import sp5 from "./subpages/agent_sp5_green";
// import sp6 from "./subpages/agent_sp6_scrap";
// import sp7 from "./subpages/agent_sp7_offgrid";
// import sp8 from "./subpages/agent_sp8_numismatics";
// import sp9 from "./subpages/agent_sp9_detecting";
// import sp10 from "./subpages/agent_sp10_goldsmith";
// import sp11 from "./subpages/agent_sp11_jewelry";
// import sp12 from "./subpages/agent_sp12_bullion";

// console.log("[SCHEDULER] Initialized ✅");

// // ─── Daily News Agents — 06:00 AM Berlin time ───────────────────────────────
// cron.schedule(
//   "0 6 * * *",
//   async () => {
//     console.log("[SCHEDULER] Starting daily content agents...");

//     const agents = [
//       sp1,
//       sp2,
//       sp3,
//       sp4,
//       sp5,
//       sp6,
//       sp7,
//       sp8,
//       sp9,
//       sp10,
//       sp11,
//       sp12,
//     ];

//     for (const agent of agents) {
//       try {
//         await agent.run();
//       } catch (err) {
//         console.error("[AGENT ERROR]", err.message);
//       }
//     }

//     console.log("[SCHEDULER] All agents done ✅");
//   },
//   { timezone: "Europe/Berlin" },
// );

// // ─── Price Agent — har 15 minutes ───────────────────────────────────────────
// cron.schedule("*/15 * * * *", async () => {
//   try {
//     const priceAgent = require("./priceAgent");
//     await priceAgent.run();
//   } catch (err) {
//     console.error("[PRICE AGENT ERROR]", err.message);
//   }
// });

import cron from "node-cron";

import sp1 from "./subpages/agent_sp1_macro.js";
import sp2 from "./subpages/agent_sp2_ai.js";
import sp3 from "./subpages/agent_sp3_storage.js";
import sp4 from "./subpages/agent_sp4_estate.js";
import sp5 from "./subpages/agent_sp5_green.js";
import sp6 from "./subpages/agent_sp6_scrap.js";
import sp7 from "./subpages/agent_sp7_offgrid.js";
import sp8 from "./subpages/agent_sp8_numismatics.js";
import sp9 from "./subpages/agent_sp9_detecting.js";
import sp10 from "./subpages/agent_sp10_goldsmith.js";
import sp11 from "./subpages/agent_sp11_jewelry.js";
import sp12 from "./subpages/agent_sp12_bullion.js";

import priceAgent from "./priceAgent.js";

console.log("[SCHEDULER] Initialized ✅");

// ─── Daily Agents ─────────────────────────────
cron.schedule(
  "0 6 * * *",
  async () => {
    console.log("[SCHEDULER] Starting daily content agents...");

    const agents = [
      sp1,
      sp2,
      sp3,
      sp4,
      sp5,
      sp6,
      sp7,
      sp8,
      sp9,
      sp10,
      sp11,
      sp12,
    ];

    for (const agent of agents) {
      try {
        await agent.run();
      } catch (err) {
        console.error("[AGENT ERROR]", err.message);
      }
    }

    console.log("[SCHEDULER] All agents done ✅");
  },
  { timezone: "Europe/Berlin" },
);

// ─── Price Agent ─────────────────────────────
cron.schedule("*/15 * * * *", async () => {
  try {
    await priceAgent.run();
  } catch (err) {
    console.error("[PRICE AGENT ERROR]", err.message);
  }
});

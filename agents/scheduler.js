

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

const agents = [
  sp1, sp2, sp3, sp4, sp5, sp6,
  sp7, sp8, sp9, sp10, sp11, sp12,
];

// 🚀 Bootstrap function
const startScheduler = async () => {
  console.log("[SCHEDULER] Starting...");

  try {
    await priceAgent(); // startup run once
  } catch (err) {
    console.error("[STARTUP PRICE ERROR]", err.message);
  }

  console.log("[SCHEDULER] Initialized ✅");

  // ───── DAILY NEWS AGENTS ─────
  cron.schedule(
    "0 6 * * *",
    async () => {
      console.log("[SCHEDULER] Running daily agents...");

      for (const agent of agents) {
        try {
          await agent();
        } catch (err) {
          console.error("[AGENT ERROR]", err.message);
        }
      }

      console.log("[SCHEDULER] All agents done ✅");
    },
    { timezone: "Europe/Berlin" }
  );

  // ───── PRICE AGENT (15 min) ─────
  cron.schedule(
    "*/15 * * * *",
    async () => {
      try {
        await priceAgent();
      } catch (err) {
        console.error("[PRICE AGENT ERROR]", err.message);
      }
    }
  );
};

// auto start
startScheduler();
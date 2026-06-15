import cron from "node-cron"

console.log('[SCHEDULER] Initialized ✅');

// ─── Daily News Agents — 06:00 AM Berlin time ───────────────────────────────
cron.schedule('0 6 * * *', async () => {
  console.log('[SCHEDULER] Starting daily content agents...');

  const agents = [
    require('./subpages/agent_sp1_macro'),
    require('./subpages/agent_sp2_ai'),
    require('./subpages/agent_sp3_storage'),
    require('./subpages/agent_sp4_estate'),
    require('./subpages/agent_sp5_green'),
    require('./subpages/agent_sp6_scrap'),
    require('./subpages/agent_sp7_offgrid'),
    require('./subpages/agent_sp8_numismatics'),
    require('./subpages/agent_sp9_detecting'),
    require('./subpages/agent_sp10_goldsmith'),
    require('./subpages/agent_sp11_jewelry'),
    require('./subpages/agent_sp12_bullion'),
  ];

  for (const agent of agents) {
    try {
      await agent.run();
    } catch (err) {
      console.error('[AGENT ERROR]', err.message);
    }
  }

  console.log('[SCHEDULER] All agents done ✅');

}, { timezone: 'Europe/Berlin' });


// ─── Price Agent — har 15 minutes ───────────────────────────────────────────
cron.schedule('*/15 * * * *', async () => {
  try {
    const priceAgent = require('./priceAgent');
    await priceAgent.run();
  } catch (err) {
    console.error('[PRICE AGENT ERROR]', err.message);
  }
});
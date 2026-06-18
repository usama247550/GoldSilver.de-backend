import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import sp1 from './agents/subpages/agent_sp1_macro.js';
import sp2 from './agents/subpages/agent_sp2_ai.js';
import sp3 from './agents/subpages/agent_sp3_storage.js';
import sp4 from './agents/subpages/agent_sp4_estate.js';
import sp5 from './agents/subpages/agent_sp5_green.js';
import sp6 from './agents/subpages/agent_sp6_scrap.js';
import sp7 from './agents/subpages/agent_sp7_offgrid.js';
import sp8 from './agents/subpages/agent_sp8_numismatics.js';
import sp9 from './agents/subpages/agent_sp9_detecting.js';
import sp10 from './agents/subpages/agent_sp10_goldsmith.js';
import sp11 from './agents/subpages/agent_sp11_jewelry.js';
import sp12 from './agents/subpages/agent_sp12_bullion.js';

await mongoose.connect(process.env.MONGODB_URL);
console.log('MongoDB Connected!');

const agents = [sp1, sp2, sp3, sp4, sp5, sp6, sp7, sp8, sp9, sp10, sp11, sp12];

for (const agent of agents) {
  try {
    await agent();
  } catch (err) {
    console.error(' Agent Error:', err.message);
  }
}

console.log(' All Agents Done!');
await mongoose.disconnect();
process.exit(0);
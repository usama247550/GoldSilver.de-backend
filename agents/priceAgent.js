import fetch from 'node-fetch';
import Price from '../models/Price.js';

async function run() {
  console.log('[PRICE AGENT] Fetching prices...');

  try {
    // Gold
    const goldRes = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': process.env.METALS_API_KEY }
    });
    const goldData = await goldRes.json();
    console.log('[GOLD]', goldData);

    // Silver
    const silverRes = await fetch('https://www.goldapi.io/api/XAG/USD', {
      headers: { 'x-access-token': process.env.METALS_API_KEY }
    });
    const silverData = await silverRes.json();

    // Crypto
    const cryptoRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'
    );
    const cryptoData = await cryptoRes.json();

  

    // EUR/USD — ECB direct endpoint
const fxRes = await fetch('https://open.er-api.com/v6/latest/EUR');
const fxData = await fxRes.json();

    await Price.findOneAndUpdate(
      {},
      {
        gold_usd:   goldData.price || null,
        silver_usd: silverData.price || null,
        btc_usd:    cryptoData.bitcoin?.usd || null,
        eth_usd:    cryptoData.ethereum?.usd || null,
        sol_usd:    cryptoData.solana?.usd || null,
       
        eur_usd: fxData.rates?.USD || null,
        updatedAt:  new Date()
      },
      { upsert: true, returnDocument: 'after' }
    );

    console.log('[PRICE AGENT] Prices updated ✅');

  } catch (err) {
    console.error('[PRICE AGENT ERROR]', err.message);
  }
}

export default run;
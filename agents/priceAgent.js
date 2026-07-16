import fetch from "node-fetch";
import Price from "../models/Price.js";

async function run() {
  console.log("[PRICE AGENT] Fetching prices...");

  try {
    // ───────── GOLD & SILVER ─────────
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://www.goldapi.io/api/XAU/USD", {
        headers: { "x-access-token": process.env.METALS_API_KEY },
      }),
      fetch("https://www.goldapi.io/api/XAG/USD", {
        headers: { "x-access-token": process.env.METALS_API_KEY },
      }),
    ]);

    const [goldData, silverData] = await Promise.all([
      goldRes.json(),
      silverRes.json(),
    ]);
 
    // ───────── CRYPTO ─────────
    const cryptoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
    );
    const cryptoData = await cryptoRes.json();

    // ───────── FOREX ─────────
    const fxRes = await fetch("https://open.er-api.com/v6/latest/EUR");
    const fxData = await fxRes.json();

    // ───────── CPI — static/annual, World Bank se last valid value ─────────
    let cpiValue = 0;
    try {
      const cpiRes = await fetch(
        "https://api.worldbank.org/v2/country/EU/indicator/FP.CPI.TOTL.ZG?format=json&mrv=1",
      );
      const cpiData = await cpiRes.json();
      // mrv=1 → most recent value, null skip karo
      const entries = cpiData?.[1] ?? [];
      const valid = entries.find((e) => e.value !== null);
      cpiValue = valid?.value ?? 0;
    } catch (err) {
      console.warn("[CPI ERROR]", err.message);
    }

    // ───────── EXISTING VALUES FETCH (for _prev) ─────────
    const existing = await Price.findOne();

    const newGold = goldData.price ?? 0;
    const newSilver = silverData.price ?? 0;
    const newBtc = cryptoData.bitcoin?.usd ?? 0;
    const newEth = cryptoData.ethereum?.usd ?? 0;
    const newEur = fxData.rates?.USD ?? 0;
    const newCpi = cpiValue;
    
    

    console.log("[FINAL VALUES] gold:", newGold, "silver:", newSilver);
    // ───────── DB UPDATE ─────────
    await Price.findOneAndUpdate(
      {},
      {
        // Previous values (old current ban jata hai prev)
        gold_usd_prev: existing?.gold_usd || newGold,
        silver_usd_prev: existing?.silver_usd || newSilver,
        btc_usd_prev: existing?.btc_usd || newBtc,
        eth_usd_prev: existing?.eth_usd || newEth,
        eur_usd_prev: existing?.eur_usd || newEur,
        cpi_prev: existing?.cpi || newCpi,

        // New current values
        gold_usd: newGold,
        silver_usd: newSilver,
        btc_usd: newBtc,
        eth_usd: newEth,
        eur_usd: newEur,
        cpi: newCpi,
      },
      { upsert: true, new: true },
    );

    console.log("[PRICE AGENT] Prices updated");
  } catch (err) {
    console.error("[PRICE AGENT ERROR]", err.message);
      console.error(err.stack);
  }
}

export default run;

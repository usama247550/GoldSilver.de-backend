import scrapeUrl from "../scraper.js";
import summarize from "../summarizer.js";
import NewsItem from "../../models/NewsItem.js";

const SUBPAGE_ID = "sp1";
const TOPIC = "Central Bank Macro-Tracking & Geopolitical Forecasting";

const SOURCES = [
  "https://www.handelsblatt.com/finanzen",
  "https://www.faz.net/aktuell/finanzen",
  "https://www.cashkurs.com",
  "https://www.godmode-trader.de",
  "https://www.makroskop.eu",
];

async function run() {
  console.log(`[SP1] Starting macro agent...`);

  // 1. Scrape all sources
  const allArticles = [];

  for (const url of SOURCES) {
    try {
      const articles = await scrapeUrl(url);

      if (Array.isArray(articles)) {
        allArticles.push(...articles);
      }
    } catch (err) {
      console.error(`[SP1] Failed source ${url}: ${err.message}`);
    }
  }

  console.log(`[SP1] Total articles collected: ${allArticles.length}`);

  const cleaned = [
    ...new Map(
      allArticles
        .map((a) => ({
          title: (a.title || a.headline || a.text || "").trim(),
          url: (a.url || a.link || "").trim(),
          source: a.source || "unknown",
        }))
        .filter((a) => a.title.length > 5 && a.url.length > 5)
        .map((a) => [a.url, a]), // 🔥 URL is unique key
    ).values(),
  ];
  console.log(`[SP1] After dedup: ${cleaned.length}`);

  // 3. Take only top 3 latest articles
  const finalArticles = cleaned.slice(0, 3);

  console.log(`[SP1] Final articles selected: ${finalArticles.length}`);

  // 4. Save each article separately in DB

  for (const article of finalArticles) {
    try {
      const summary = await summarize([article], TOPIC);

      await NewsItem.create({
        subpageId: SUBPAGE_ID,

        //  model ke hisaab se correct fields
        headline: article.title,
        sourceUrl: article.url || article.link,
        summary: summary?.summary || "no-summary",

        // REQUIRED fields (must)
        conclusion: summary?.conclusion || "neutral",
        direction: summary?.direction || "neutral",

        date: new Date(),
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("SAVE ERROR:", err.message);
    }
  }
  console.log(
    `[SP1] Done  Saved ${finalArticles.length} articles for ${SUBPAGE_ID}`,
  );
}

export default run;

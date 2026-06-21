import scrapeUrl from "../scraper.js";
import summarize from "../summarizer.js";
import NewsItem from "../../models/NewsItem.js";

const SUBPAGE_ID = "sp8";
const TOPIC = "Heritage Numismatics & Coins";

const SOURCES = [
  "https://coinsweekly.com/",
  "https://www.worldnumismaticnews.com/",
  "https://www.coinworld.com/news",
  "https://www.numismaticnews.net/",
];

async function run() {
  console.log(`[SP8] Starting agent...`);

  const allArticles = [];

  // 1. Scrape
  for (const url of SOURCES) {
    try {
      const articles = await scrapeUrl(url);

      if (Array.isArray(articles)) {
        allArticles.push(...articles.slice(0, 3));
      }
    } catch (err) {
      console.error(`[SP8] Failed source ${url}: ${err.message}`);
    }
  }

  console.log(`[SP8] Total articles collected: ${allArticles.length}`);

  // 2. Normalize + Deduplicate (IMPORTANT FIX)
  const cleaned = [
    ...new Map(
      allArticles
        .map((a) => ({
          title: (a.title || a.headline || a.text || "").trim(),
          url: (a.url || a.link || "").trim(),
          source: a.source || "unknown",
        }))
        .filter((a) => a.title.length > 5 && a.url.length > 5)
        .map((a) => [a.url, a]) // unique key
    ).values(),
  ];

  console.log(`[SP8] After dedup: ${cleaned.length}`);

  if (!cleaned.length) {
    console.log(`[SP8] No articles found, skipping DB save`);
    return;
  }

  const finalArticles = cleaned.slice(0, 3);

  console.log(`[SP8] Final articles selected: ${finalArticles.length}`);

  // 3. Save each article separately
  for (const article of finalArticles) {
    try {
      const summary = await summarize([article], TOPIC);

      await NewsItem.create({
        subpageId: SUBPAGE_ID,

        headline: article.title,
        sourceUrl: article.url,

        summary: summary?.summary || "no-summary",
        conclusion: summary?.conclusion || "neutral",
        direction: summary?.direction || "neutral",

        date: new Date(),
        createdAt: new Date(),
      });

      console.log(`[SP8] Saved: ${article.title}`);
    } catch (err) {
      console.error(`[SP8] SAVE ERROR:`, err.message);
    }
  }

  console.log(
    `[SP8] Done ✅ Saved ${finalArticles.length} articles for ${SUBPAGE_ID}`
  );
}

export default run;
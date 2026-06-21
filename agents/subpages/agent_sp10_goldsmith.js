import scrapeUrl from "../scraper.js";
import summarize from "../summarizer.js";
import NewsItem from "../../models/NewsItem.js";

const SUBPAGE_ID = "sp10";
const TOPIC = "Artisanal Goldsmithing";

const SOURCES = [
  "https://www.ganoksin.com/topic/jewelry-design/",
  "https://www.ganoksin.com/article/",
  "https://www.jewellerybusiness.com/",
  "https://www.retail-jeweller.com/",
];

async function run() {
  console.log(`[SP10] Starting agent...`);

  const allArticles = [];

  // 1. Scrape
  for (const url of SOURCES) {
    try {
      const articles = await scrapeUrl(url);

      if (Array.isArray(articles)) {
        allArticles.push(...articles.slice(0, 3));
      }
    } catch (err) {
      console.error(`[SP10] Failed source ${url}: ${err.message}`);
    }
  }

  console.log(`[SP10] Total articles collected: ${allArticles.length}`);

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
        .map((a) => [a.url, a]), // unique key = URL
    ).values(),
  ];

  console.log(`[SP10] After dedup: ${cleaned.length}`);

  if (!cleaned.length) {
    console.log(`[SP10] No articles found, skipping DB save`);
    return;
  }

  const finalArticles = cleaned.slice(0, 3);

  console.log(`[SP10] Final articles selected: ${finalArticles.length}`);

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

      console.log(`[SP10] Saved: ${article.title}`);
    } catch (err) {
      console.error(`[SP10] SAVE ERROR:`, err.message);
    }
  }

  console.log(
    `[SP10] Done ✅ Saved ${finalArticles.length} articles for ${SUBPAGE_ID}`,
  );
}

export default run;

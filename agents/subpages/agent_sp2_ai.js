import scrapeUrl from "../scraper.js";
import summarize from "../summarizer.js";
import NewsItem from "../../models/NewsItem.js";

const SUBPAGE_ID = "sp2";
const TOPIC = "AI, Semiconductors & Tech";
const SOURCES = [
  "https://www.heise.de/themen/ki",
  "https://t3n.de/tag/künstliche-intelligenz",
  "https://www.golem.de/specials/künstliche-intelligenz",
  "https://www.elektroniknet.de",
];



async function run() {
  console.log(`[SP2] Starting macro agent...`);

  // 1. Scrape all sources
  const allArticles = [];

  for (const url of SOURCES) {
    try {
      const articles = await scrapeUrl(url);
      allArticles.push(...articles.slice(0, 3));
    } catch (err) {
      console.error(`[SP2] Failed source ${url}: ${err.message}`);
    }
  }

  console.log(`[SP2] Total articles collected: ${allArticles.length}`);

  // 2. Remove duplicates
  const cleaned = [
    ...new Map(allArticles.map((a) => [a.title.toLowerCase(), a])).values(),
  ];
  if (!cleaned.length) {
    console.log(`[${SUBPAGE_ID}] No articles found, skipping DB save`);

    return;
  }
  // 3. Summarize
  const result = await summarize(cleaned, TOPIC);

  // 4. Save to DB
  await NewsItem.create({
    subpageId: SUBPAGE_ID,
    date: new Date(),
    summary: result.summary,
    conclusion: result.conclusion,
    direction: result.direction,
    createdAt: new Date(),
  });

  console.log(`[SP2] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run;

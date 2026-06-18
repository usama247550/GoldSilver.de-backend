import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp9';
const TOPIC = 'Metal Detecting & Prospecting';
const SOURCES = [
  'https://www.sondengaenger.de',
  'https://www.minelab.com/blog',
  'https://www.treasurenet.com',
];


async function run() {
  console.log(`[sp9] Starting macro agent...`);

  // 1. Scrape all sources
  const allArticles = [];

  for (const url of SOURCES) {
    try {
      const articles = await scrapeUrl(url);
      allArticles.push(...articles.slice(0, 3));
    } catch (err) {
      console.error(`[sp9] Failed source ${url}: ${err.message}`);
    }
  }

  console.log(`[sp9] Total articles collected: ${allArticles.length}`);

  // 2. Remove duplicates
  const cleaned = [...new Map(
    allArticles.map(a => [a.title, a])
  ).values()];

  // 3. Summarize
  const result = await summarize(cleaned, TOPIC);

  // 4. Save to DB
  await NewsItem.create({
    subpageId: SUBPAGE_ID,
    date: new Date(),
    summary: result.summary,
    conclusion: result.conclusion,
    direction: result.direction,
    createdAt: new Date()
  });

  console.log(`[sp9] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
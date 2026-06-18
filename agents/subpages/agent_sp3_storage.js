

import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp3';
const TOPIC = 'High-Security Home Storage';
const SOURCES = [
  'https://www.security-insider.de',
  'https://www.smarthomeassistent.de',
  'https://www.baulinks.de',
];


async function run() {
  console.log(`[sp3] Starting macro agent...`);

  // 1. Scrape all sources
  const allArticles = [];

  for (const url of SOURCES) {
    try {
      const articles = await scrapeUrl(url);
      allArticles.push(...articles.slice(0, 3));
    } catch (err) {
      console.error(`[sp3] Failed source ${url}: ${err.message}`);
    }
  }

  console.log(`[sp3] Total articles collected: ${allArticles.length}`);

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

  console.log(`[sp3] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
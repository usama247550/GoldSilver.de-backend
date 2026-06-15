

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
  console.log(`[SP3] Starting Storage agent...`);
  const allArticles = [];
  for (const url of SOURCES) {
    const articles = await scrapeUrl(url);
    allArticles.push(...articles.slice(0, 3));
  }
  const result = await summarize(allArticles, TOPIC);
  await NewsItem.create({
    subpageId: SUBPAGE_ID, date: new Date(),
    summary: result.summary, conclusion: result.conclusion,
    direction: result.direction, createdAt: new Date()
  });
  console.log(`[SP3] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
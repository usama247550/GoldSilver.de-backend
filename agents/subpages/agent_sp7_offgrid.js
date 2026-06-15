import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp7';
const TOPIC = 'Off-Grid Security & Homesteading';
const SOURCES = [
  'https://www.selbst.de',
  'https://www.landlust.de',
  'https://www.agrarheute.com',
];

async function run() {
  console.log(`[SP7] Starting Off-Grid agent...`);
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
  console.log(`[SP7] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
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
  console.log(`[SP9] Starting Metal Detecting agent...`);
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
  console.log(`[SP9] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
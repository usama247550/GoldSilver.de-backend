import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp8';
const TOPIC = 'Heritage Numismatics & Coins';
const SOURCES = [
  'https://www.muenzenwoche.de',
  'https://www.kuenker.de/blog',
  'https://www.ma-shops.de/news',
];

async function run() {
  console.log(`[SP8] Starting Numismatics agent...`);
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
  console.log(`[SP8] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
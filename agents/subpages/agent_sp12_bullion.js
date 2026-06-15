import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp12';
const TOPIC = 'Gold & Silver Coins and Bars';
const SOURCES = [
  'https://www.gold.de/news',
  'https://www.goldreporter.de',
  'https://www.kitco.com/news/gold',
  'https://www.lbma.org.uk/news',
];

async function run() {
  console.log(`[SP12] Starting Bullion agent...`);
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
  console.log(`[SP12] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp6';
const TOPIC = 'Precious Metal Scrap Recycling';
const SOURCES = [
  'https://www.recyclingtoday.com',
  'https://www.scrapmonster.com',
  'https://www.kitco.com/news/gold',
];

async function run() {
  console.log(`[SP6] Starting Scrap agent...`);
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
  console.log(`[SP6] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
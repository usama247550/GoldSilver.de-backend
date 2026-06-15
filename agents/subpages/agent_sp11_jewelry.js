import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp11';
const TOPIC = 'Fine Jewelry Resale & Wearable Wealth';
const SOURCES = [
  'https://www.therealreal.com/blog',
  'https://www.sothebys.com/en/articles',
  'https://www.1stdibs.com/blogs',
];

async function run() {
  console.log(`[SP11] Starting Jewelry agent...`);
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
  console.log(`[SP11] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
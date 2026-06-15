import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp10';
const TOPIC = 'Artisanal Goldsmithing';
const SOURCES = [
  'https://www.ganoksin.com/article',
  'https://www.gz-online.de',
  'https://www.benchpeg.com/news',
];

async function run() {
  console.log(`[SP10] Starting Goldsmith agent...`);
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
  console.log(`[SP10] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
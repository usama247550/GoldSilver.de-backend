import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp4';
const TOPIC = 'Estate Planning & Wealth Transfer';
const SOURCES = [
  'https://www.haufe.de/steuern',
  'https://www.erbrecht-ratgeber.de',
  'https://www.anwalt.de/rechtstipps/erbrecht',
];

async function run() {
  console.log(`[SP4] Starting Estate agent...`);
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
  console.log(`[SP4] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
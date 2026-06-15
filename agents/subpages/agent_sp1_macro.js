import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp1';
const TOPIC = 'Central Bank Macro-Tracking & Geopolitical Forecasting';
const SOURCES = [
  'https://www.handelsblatt.com/finanzen',
  'https://www.faz.net/aktuell/finanzen',
  'https://www.cashkurs.com',
  'https://www.godmode-trader.de',
  'https://www.makroskop.eu',
];

async function run() {
  console.log(`[SP1] Starting macro agent...`);

  // Scrape all sources
  const allArticles = [];
  for (const url of SOURCES) {
    const articles = await scrapeUrl(url);
    allArticles.push(...articles.slice(0, 3)); // max 3 per source
  }

  console.log(`[SP1] Total articles collected: ${allArticles.length}`);

  // AI summarize
  const result = await summarize(allArticles, TOPIC);

  // MongoDB mein save karo
  await NewsItem.create({
    subpageId: SUBPAGE_ID,
    date: new Date(),
    summary: result.summary,
    conclusion: result.conclusion,
    direction: result.direction,
    createdAt: new Date()
  });

  console.log(`[SP1] Done ✅ Conclusion: ${result.conclusion}`);
}


export default run
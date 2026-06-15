import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp5';
const TOPIC = 'Green Energy & Solar Infrastructure';
const SOURCES = [
  'https://www.pv-magazine.de',
  'https://www.cleanthinking.de',
  'https://www.energiezukunft.eu',
];

async function run() {
  console.log(`[SP5] Starting Green Energy agent...`);
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
  console.log(`[SP5] Done ✅ Conclusion: ${result.conclusion}`);
}
export default run
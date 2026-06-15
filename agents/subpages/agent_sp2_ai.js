import scrapeUrl from '../scraper.js';
import summarize from '../summarizer.js';
import NewsItem from '../../models/NewsItem.js';

const SUBPAGE_ID = 'sp2';
const TOPIC = 'AI, Semiconductors & Tech';
const SOURCES = [
  'https://www.heise.de/themen/ki',
  'https://t3n.de/tag/künstliche-intelligenz',
  'https://www.golem.de/specials/künstliche-intelligenz',
  'https://www.elektroniknet.de',
];

async function run() {
  console.log(`[SP2] Starting AI & Tech agent...`);
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
  console.log(`[SP2] Done ✅ Conclusion: ${result.conclusion}`);
}


export default run
import axios  from 'axios';
// import { Cheerio } from 'cheerio';
import { load } from "cheerio";

async function scrapeUrl(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      timeout: 10000
    });

    // const $ = cheerio.load(data);
        const $ = load(data); 
    const articles = [];

    $('article, .article, .news-item, h2, h3').slice(0, 5).each((i, el) => {
      const title = $(el).find('h2, h3, .title').first().text().trim()
        || $(el).text().trim();
      const snippet = $(el).find('p, .description, .summary').first().text().trim();
      const link = $(el).find('a').first().attr('href') || url;

      if (title.length > 20) {
        articles.push({ title, snippet, link });
      }
    });

    console.log(`[SCRAPER] ${url} → ${articles.length} articles found`);
    return articles;

  } catch (err) {
    // Site down ya block kare toh crash na ho — empty return karo
    console.error(`[SCRAPER ERROR] ${url} → ${err.message}`);
    return [];
  }
}

export default scrapeUrl
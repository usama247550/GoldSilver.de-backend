import axios from "axios";
import { load } from "cheerio";

async function scrapeUrl(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)" },
      timeout: 10000,
    });

    const $ = load(data);
    const articles = [];
    const seen = new Set();

    const normalize = (t) => t.toLowerCase().replace(/\s+/g, " ").trim();

    // STEP 1: Try strict method first (article containers)a
    $("article, .article, .news-item")
      .slice(0, 5)
      .each((i, el) => {
        const title =
          $(el).find("h2, h3, .title").first().text().trim() ||
          $(el).text().trim();

        const snippet = $(el)
          .find("p, .description, .summary")
          .first()
          .text()
          .trim();

        const href = $(el).find("a").first().attr("href");
        const link = href ? new URL(href, url).href : url;

        if (title.length > 20) {
          const key = normalize(title);
          if (seen.has(key)) return;
          seen.add(key);
          articles.push({ title, snippet, link });
        }
      });

    // STEP 2: Agar strict method se kuch na mile, generic fallback try karo
    if (articles.length === 0) {
      $("h1, h2, h3")
        .slice(0, 30)
        .each((i, el) => {
          const title = $(el).text().trim();
          if (title.length < 20) return;

          // Link is heading ke andar ya uske parent ke andar dhoondo
          let href = $(el).find("a").first().attr("href");
          if (!href) href = $(el).closest("a").attr("href");
          if (!href) href = $(el).parent().find("a").first().attr("href");
          if (!href) return;

          const link = new URL(href, url).href;
          const key = normalize(title);
          if (seen.has(key)) return;
          seen.add(key);

          // Snippet: heading ke baad wala paragraph dhoondne ki koshish
          const snippet = $(el).next("p").text().trim() || "";

          articles.push({ title, snippet, link });

          if (articles.length >= 5) return false; // stop after 5
        });
    }

    console.log(`[SCRAPER] ${url} → ${articles.length} articles found`);
    return articles;
  } catch (err) {
    console.error(`[SCRAPER ERROR] ${url} → ${err.message}`);
    return [];
  }
}

export default scrapeUrl;
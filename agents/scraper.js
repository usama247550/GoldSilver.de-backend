// import axios from "axios";
// import { load } from "cheerio";

// async function scrapeUrl(url) {
//   try {
//     const { data } = await axios.get(url, {
//       headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)" },
//       timeout: 10000,
//     });

//     const $ = load(data);
//     const articles = [];
//     const seen = new Set();
//     const normalize = (t) => t.toLowerCase().replace(/\s+/g, "").trim();

//     $("article, .article, .news-item, h2, h3")
//       .slice(0, 5)
//       .each((i, el) => {
//         const title =
//           $(el).find("h2, h3, .title").first().text().trim() ||
//           $(el).text().trim();

//         const snippet = $(el)
//           .find("p, .description, .summary")
//           .first()
//           .text()
//           .trim();
//         // const link = $(el).find('a').first().attr('href') || url;
//         const link = new URL($(el).find("a").first().attr("href") || url, url)
//           .href:url;

//         if (title.length > 20) {
//           const key = normalize(title);

//           if (seen.has(key)) return;
//           seen.add(key);

//           articles.push({ title, snippet, link });
//         }
//       });

//     console.log(`[SCRAPER] ${url} → ${articles.length} articles found`);
//     return articles;
//   } catch (err) {
//     // Site down ya block kare toh crash na ho — empty return karo
//     console.error(`[SCRAPER ERROR] ${url} → ${err.message}`);
//     return [];
//   }
// }

// export default scrapeUrl;
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

    const normalize = (t) =>
      t.toLowerCase().replace(/\s+/g, " ").trim();

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

    console.log(`[SCRAPER] ${url} → ${articles.length} articles found`);
    return articles;
  } catch (err) {
    console.error(`[SCRAPER ERROR] ${url} → ${err.message}`);
    return [];
  }
}

export default scrapeUrl;
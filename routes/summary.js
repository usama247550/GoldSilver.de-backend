// // backend/routes/summary.js
// import express from "express";
// import NewsItem from "../models/NewsItem.js";
// import summarize from "../agents/summarizer.js";

// const router = express.Router();

// /**
//  * POST /api/summary/:subpageId
//  * Generate a market summary for the latest 10 news items of a subpage
//  * and store the result in each NewsItem document.
//  */
// router.post('/:subpageId', async (req, res) => {
//   try {
//     const { subpageId } = req.params;

//     // 1️⃣ Fetch the latest 10 news items (no date filter)
//     const newsItems = await NewsItem.find({ subpageId })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     if (!newsItems.length) {
//       return res.status(404).json({ error: 'No news items found' });
//     }

//     // 2️⃣ Build the articles array expected by the summarizer
//     const articles = newsItems.map((item) => ({
//       title: item.headline,
//       snippet: item.summary, // use existing short summary field as snippet
//     }));

//     // 3️⃣ Call the summarizer (xAI only)
//     const topic = `Gold and Silver market update for subpage ${subpageId}`;
//     const summaryResult = await summarize(articles, topic);

//     // 4️⃣ Persist the generated summary data back to each NewsItem
//     const bulkOps = newsItems.map((doc) => ({
//       updateOne: {
//         filter: { _id: doc._id },
//         update: {
//           summary: summaryResult.summary,
//           conclusion: summaryResult.conclusion,
//           direction: summaryResult.direction,
//         },
//       },
//     }));
//     await NewsItem.bulkWrite(bulkOps);

//     res.json({ message: 'Summary generated and saved', summary: summaryResult });
//   } catch (err) {
//     console.error('Summary route error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// export default router;
// backend/routes/summary.js
import express from "express";
import NewsItem from "../models/NewsItem.js";

const router = express.Router();

/**
 * GET /api/summary/:subpageId
 * Fetch latest news summaries for a subpage (NO AI processing here)
 */
router.get('/:subpageId', async (req, res) => {
  try {
    const { subpageId } = req.params;

    // 1️⃣ Fetch latest 10 news items
    const newsItems = await NewsItem.find({ subpageId })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!newsItems.length) {
      return res.status(404).json({ error: 'No news items found' });
    }

    // 2️⃣ Return clean data (already processed by agents)
    res.json({
      subpageId,
      count: newsItems.length,
      data: newsItems
    });

  } catch (err) {
    console.error('Summary route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
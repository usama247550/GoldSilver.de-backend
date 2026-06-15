import express from "express"
const router = express.Router();
import NewsItem from "../models/NewsItem.js"

router.get('/:subpageId', async (req, res) => {

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const news = await NewsItem
      .find({ 
        subpageId: req.params.subpageId, 
        date: { $gte: today } 
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



// router.get('/:subpageId', async (req, res) => {
//   try {
//     const news = await NewsItem
//       .find({ subpageId: req.params.subpageId })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     res.json(news);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// export default router;

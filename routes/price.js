import express from "express"
const router = express.Router();
import Price from "../models/Price.js"

router.get('/', async (req, res) => {
  try {
    const prices = await Price.findOne().sort({ updatedAt: -1 });
    if (!prices) return res.json({ message: 'No price data yet' });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default  router;
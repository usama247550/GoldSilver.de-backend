import express from "express"
const router = express.Router();
import Subscriber from '../models/Subscriber.js';


router.post('/', async (req, res) => {
  const { email, source, gdprConsent } = req.body;

  // Validation
  if (!gdprConsent) 
    return res.status(400).json({ error: 'GDPR consent required' });
  if (!email || !email.includes('@')) 
    return res.status(400).json({ error: 'Invalid email' });

  try {
    await Subscriber.create({ 
      email, 
      source: source || 'homepage', 
      gdprConsent 
    });
    res.json({ success: true });
  } catch (err) {
    // Duplicate email — silent success
    if (err.code === 11000) return res.json({ success: true });
    res.status(500).json({ error: 'Server error' });
  }
});

export default  router;
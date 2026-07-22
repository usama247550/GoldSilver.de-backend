// import express from "express"
// const router = express.Router();
// import Subscriber from '../models/Subscriber.js';


// router.post('/', async (req, res) => {
//   const { email, source, gdprConsent } = req.body;

//   // Validation
//   if (!gdprConsent) 
//     return res.status(400).json({ error: 'GDPR consent required' });
//   if (!email || !email.includes('@')) 
//     return res.status(400).json({ error: 'Invalid email' });

//   try {
//     await Subscriber.create({ 
//       email, 
//       source: source || 'homepage', 
//       gdprConsent 
//     });
//     res.json({ success: true });
//   } catch (err) {
//     // Duplicate email — silent success
//     if (err.code === 11000) return res.json({ success: true });
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// export default  router;


import express from "express"
const router = express.Router();
import Subscriber from '../models/Subscriber.js';

// Subpage source -> Brevo List ID mapping
const LIST_ID_MAP = {
  macro: 3,
  AiTech: 4,
  storage: 5,
  estate: 6,
  GreenEnergy: 7,
  scrapMetal: 8,
  offgrid: 9,
  numismatics: 10,
  coinsBars: 11,
  Goldsmithing: 12,
  JewelryResale: 13,
  MetalDetecting: 14,
  homepage:15
};

router.post('/', async (req, res) => {
  const { email, source, gdprConsent } = req.body;

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

    try {
      const listId = LIST_ID_MAP[source];
      const listIds = listId ? [listId] : [];

      const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: email,
          attributes: {
            SOURCE: source || 'homepage',
          },
          listIds: listIds,
          updateEnabled: true,
        }),
      });

      if (!brevoRes.ok) {
        const errData = await brevoRes.json();
        console.error('Brevo sync failed:', errData);
      }
    } catch (brevoErr) {
      console.error('Brevo sync error:', brevoErr.message);
    }

    res.json({ success: true });
  } catch (err) {
    if (err.code === 11000) return res.json({ success: true });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
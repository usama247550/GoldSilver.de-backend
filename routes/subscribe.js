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


import express from "express";
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
  homepage: 15
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  const { email, source, timezone, gdprConsent } = req.body;

  if (!gdprConsent) {
    return res.status(400).json({ error: 'GDPR consent required' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const subSource = source || 'homepage';
  const userTimezone = timezone || 'Europe/Berlin';

  try {
    // Upsert to handle duplicates cleanly and update source/timezone
    await Subscriber.findOneAndUpdate(
      { email: cleanEmail },
      {
        email: cleanEmail,
        source: subSource,
        timezone: userTimezone,
        gdprConsent: true,
        active: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sync to Brevo contact list
    try {
      const listId = LIST_ID_MAP[subSource];
      const listIds = listId ? [listId] : [];

      if (process.env.BREVO_API_KEY) {
        const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
          },
          body: JSON.stringify({
            email: cleanEmail,
            attributes: {
              SOURCE: subSource,
              TIMEZONE: userTimezone
            },
            listIds: listIds,
            updateEnabled: true,
          }),
        });

        if (!brevoRes.ok) {
          const errData = await brevoRes.json().catch(() => null);
          console.error('Brevo sync failed:', errData);
        }
      }
    } catch (brevoErr) {
      console.error('Brevo sync error:', brevoErr.message);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Subscription DB error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
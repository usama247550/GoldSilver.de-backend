import dotenv from 'dotenv';
dotenv.config();

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.Gemini_API_KEY}`,
  
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Say hello' }] }]
    })
  }
);

const data = await response.json();
console.log(JSON.stringify(data, null, 2));
// async function summarize(articles, topic) {
//   if (!articles.length) {
//     return {
//       summary: 'No news data available for today.',
//       conclusion: 'neutral',
//       direction: 'neutral'
//     };
//   }

//   const content = articles
//     .map(a => `HEADLINE: ${a.title}\nSNIPPET: ${a.snippet || 'N/A'}`)
//     .join('\n\n');

//   const prompt = `You are a gold and silver financial analyst writing for German investors.

// Topic: ${topic}

// Here are today's news headlines:
// ${content}

// Respond in this EXACT format, nothing else:
// SUMMARY: [2-3 sentence summary in English]
// CONCLUSION: [bullish OR bearish OR neutral]
// DIRECTION: [up OR down OR neutral]`;

//   // Flag to enable/disable Grok usage (default true). Set USE_GROK=false in .env to bypass Grok.
//   const ENABLE_GROK = process.env.USE_GROK !== 'false';

// let textContent = '';

//   if (ENABLE_GROK) {
//     // ─── GROK AI ──────────────────────────────────────────────
//     try {
//       const grokResponse = await fetch(
//         'https://api.x.ai/v1/chat/completions',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${process.env.XAI_API_KEY}`
//           },
//           body: JSON.stringify({
//             model: 'grok-3-mini',
//             messages: [
//               { role: 'system', content: 'You are a financial news analyst.' },
//               { role: 'user', content: prompt }
//             ],
//             temperature: 0.3
//           })
//         }
//       );

//       console.log('Grok Status:', grokResponse.status);

//       if (grokResponse.ok) {
//         const grokData = await grokResponse.json();
//         console.log('Grok Response:', JSON.stringify(grokData, null, 2));
//         textContent = grokData?.choices?.[0]?.message?.content?.trim() || '';
//       } else if (grokResponse.status === 403) {
//         // Specific handling for permission errors – likely missing credits.
//         const errText = await grokResponse.text();
//         console.warn('Grok permission denied (403):', errText);
//       } else {
//         const errText = await grokResponse.text();
//         console.error('Grok non‑OK response:', errText);
//       }
//     } catch (err) {
//       console.error('Grok API Error:', err.message);
//     }
//   }

//   // ─── FALLBACK IF GROK FAILS OR DISABLED ───────────────────────
//   if (!textContent) {
//     // If Grok was disabled or failed, use a deterministic fallback.
//     // Option A: simple title list (current behavior).
//     // Option B: explicit placeholder indicating missing credits.
//     const placeholder = process.env.USE_GROK === 'false' ?
//       'Summary unavailable – XAI credits are not configured.' :
//       null;

//     if (placeholder) {
//       return {
//         summary: placeholder,
//         conclusion: 'neutral',
//         direction: 'neutral'
//       };
//     }

//     const fallback = articles
//       .slice(0, 3)
//       .map(a => a.title)
//       .join('. ');
//     return {
//       summary: fallback || 'No summary available.',
//       conclusion: 'neutral',
//       direction: 'neutral'
//     };
//   }

//   const summaryMatch = textContent.match(/SUMMARY:\s*(.+?)(?=CONCLUSION:|$)/s);
//   const conclusionMatch = textContent.match(/CONCLUSION:\s*(bullish|bearish|neutral)/i);
//   const directionMatch = textContent.match(/DIRECTION:\s*(up|down|neutral)/i);

//   return {
//     summary: summaryMatch ? summaryMatch[1].trim() : textContent,
//     conclusion: conclusionMatch ? conclusionMatch[1].toLowerCase() : 'neutral',
//     direction: directionMatch ? directionMatch[1].toLowerCase() : 'neutral'
//   };
// }

// export default summarize;

async function summarize(articles, topic) {
  if (!articles.length) {
    return {
      summary: "No news data available for today.",
      conclusion: "neutral",
      direction: "neutral",
    };
  }

  // ✅ STEP 1: REMOVE DUPLICATES FIRST
  const uniqueArticles = [
    ...new Map(articles.map((a) => [a.title, a])).values(),
  ];

  // ✅ STEP 2: BUILD CLEAN CONTENT
  const content = uniqueArticles
    .map((a) => `HEADLINE: ${a.title}\nSNIPPET: ${a.snippet || "N/A"}`)
    .join("\n\n");

  const prompt = `
You are a gold and silver financial analyst writing for German investors.

Topic: ${topic}

Here are today's news headlines:
${content}

Respond in this EXACT format, nothing else:
SUMMARY: [2-3 sentence summary in English]
CONCLUSION: [bullish OR bearish OR neutral]
DIRECTION: [up OR down OR neutral]
`;

  const ENABLE_GROK = process.env.USE_GROK !== "false";
  let textContent = "";

  if (ENABLE_GROK) {
    try {
      const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-3-mini",
          messages: [
            { role: "system", content: "You are a financial news analyst." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      if (grokResponse.ok) {
        const data = await grokResponse.json();
        textContent = data?.choices?.[0]?.message?.content?.trim() || "";
      } else {
        console.warn("Grok error:", await grokResponse.text());
      }
    } catch (err) {
      console.error("Grok API Error:", err.message);
    }
  }

  // fallback
  if (!textContent) {
    const fallback = uniqueArticles
      .slice(0, 3)
      .map((a) => a.title)
      .join(". ");

    return {
      summary: fallback || "No summary available.",
      conclusion: "neutral",
      direction: "neutral",
    };
  }

  const summaryMatch = textContent.match(/SUMMARY:\s*(.+?)(?=CONCLUSION:|$)/s);
  const conclusionMatch = textContent.match(
    /CONCLUSION:\s*(bullish|bearish|neutral)/i,
  );
  const directionMatch = textContent.match(/DIRECTION:\s*(up|down|neutral)/i);

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : textContent,
    conclusion: conclusionMatch ? conclusionMatch[1].toLowerCase() : "neutral",
    direction: directionMatch ? directionMatch[1].toLowerCase() : "neutral",
  };
}

export default summarize;

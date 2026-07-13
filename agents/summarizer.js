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
          model: "grok-4.3",
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

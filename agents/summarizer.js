async function summarize(articles, topic) {
  if (!articles.length) {
    return {
      summary: 'No news data available for today.',
      conclusion: 'neutral',
      direction: 'neutral'
    };
  }

  const content = articles
    .map(a => `HEADLINE: ${a.title}\nSNIPPET: ${a.snippet || 'N/A'}`)
    .join('\n\n');

  const prompt = `You are a gold and silver financial analyst writing for German investors.
      
Topic: ${topic}

Here are today's news headlines:
${content}

Respond in this EXACT format, nothing else:
SUMMARY: [2-3 sentence summary in English]
CONCLUSION: [bullish OR bearish OR neutral]
DIRECTION: [up OR down OR neutral]`;

  const models = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b'
  ];

  let textContent = '';

  for (const modelName of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      textContent = data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || '')
        .join('\n')
        .trim() || '';

      if (textContent) break;

    } catch (err) {
      continue;
    }
  }

  if (!textContent) {
    return {
      summary: 'No summary available.',
      conclusion: 'neutral',
      direction: 'neutral'
    };
  }

  const summaryMatch = textContent.match(/SUMMARY:\s*(.+?)(?=CONCLUSION:|$)/s);
  const conclusionMatch = textContent.match(/CONCLUSION:\s*(bullish|bearish|neutral)/i);
  const directionMatch = textContent.match(/DIRECTION:\s*(up|down|neutral)/i);

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : textContent,
    conclusion: conclusionMatch ? conclusionMatch[1].toLowerCase() : 'neutral',
    direction: directionMatch ? directionMatch[1].toLowerCase() : 'neutral'
  };
}

export default summarize;
import NewsItem from "../models/NewsItem.js";

const LIST_ID_MAP = {
  sp1: 3,
  sp2: 4,
  sp3: 5,
  sp4: 6,
  sp5: 7,
  sp6: 8,
  sp7: 9,
  sp8: 10,
  sp9: 14,
  sp10: 12,
  sp11: 13,
  sp12: 11,
};

const SUBPAGE_LABELS = {
  sp1: "Macro & Central Bank Trends",
  sp2: "AI & Tech",
  sp3: "Precious Metals Storage",
  sp4: "Estate Planning",
  sp5: "Green Energy",
  sp6: "Scrap Metal Recycling",
  sp7: "Off-Grid Security",
  sp8: "Numismatics",
  sp9: "Metal Detecting",
  sp10: "Goldsmithing",
  sp11: "Jewelry Resale",
  sp12: "Coins & Bars",
};

const SUBPAGE_URLS = {
  sp1: "macro",
  sp2: "AiTech",
  sp3: "storage",
  sp4: "estate",
  sp5: "GreenEnergy",
  sp6: "scrapMetal",
  sp7: "offgrid",
  sp8: "numismatics",
  sp9: "MetalDetecting",
  sp10: "Goldsmithing",
  sp11: "JewelryResale",
  sp12: "coinsBars",
};

function buildEmailHtml(subpageId, items) {
  const label = SUBPAGE_LABELS[subpageId] || subpageId;
  const urlPath = SUBPAGE_URLS[subpageId] || subpageId;

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #2a2a2a;">
          <p style="color:#B8860B;font-size:12px;letter-spacing:1px;margin:0 0 6px;">
            ${item.conclusion?.toUpperCase() || ""}
          </p>
          <h3 style="color:#1A1A1A;font-size:18px;margin:0 0 6px;">
            ${item.headline || item.summary?.slice(0, 80)}
          </h3>
          <p style="color:#555;font-size:14px;line-height:1.5;margin:0;">
            ${item.summary}
          </p>
        </td>
      </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAF8F0;padding:24px;">
      <h1 style="color:#1A1A1A;font-size:24px;border-bottom:2px solid #B8860B;padding-bottom:12px;">
        This Week in ${label}
      </h1>
      <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      <p style="margin-top:24px;text-align:center;">
        <a href="https://www.goldsilver.de/${urlPath}" style="background:#B8860B;color:#fff;padding:10px 24px;text-decoration:none;border-radius:6px;display:inline-block;">
          Read More on GoldSilver.de
        </a>
      </p>
    </div>`;
}

async function sendCampaignToList(subpageId, listId, htmlContent) {
  const dateLabel = new Date().toISOString().slice(0, 10);
  const label = SUBPAGE_LABELS[subpageId] || subpageId;

  const createRes = await fetch("https://api.brevo.com/v3/emailCampaigns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      name: `Weekly ${label} Newsletter - ${dateLabel}`,
      subject: `Your Weekly ${label} Update from GoldSilver.de`,
      sender: {
        name: "GoldSilver.de",
        email: process.env.NEWSLETTER_SENDER_EMAIL,
      },
      type: "classic",
      htmlContent,
      recipients: { listIds: [listId] },
    }),
  });

  const createData = await createRes.json();

  if (!createRes.ok) {
    console.error(
      `[NEWSLETTER] Campaign creation failed for ${subpageId}:`,
      createData,
    );
    return;
  }

  const campaignId = createData.id;

  const sendRes = await fetch(
    `https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`,
    {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY },
    },
  );

  if (!sendRes.ok) {
    const sendData = await sendRes.json().catch(() => null);
    console.error(`[NEWSLETTER] Send failed for ${subpageId}:`, sendData);
  } else {
    console.log(
      `[NEWSLETTER] Sent successfully for ${subpageId} (list ${listId})`,
    );
  }
}

async function sendWeeklyNewsletters() {
  console.log("[NEWSLETTER] Starting weekly newsletter run...");
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  for (const [subpageId, listId] of Object.entries(LIST_ID_MAP)) {
    try {
      // const items = await NewsItem.find({
      //   subpageId,
      //   createdAt: { $gte: oneWeekAgo },
      // })
      //   .sort({ createdAt: -1 })
      //   .limit(5);

      const items = await NewsItem.find({
        subpageId,
        createdAt: { $gte: oneWeekAgo },
      })
        .sort({ clicks: -1, createdAt: -1 }) 
        .limit(5);

      if (!items.length) {
        console.log(
          `[NEWSLETTER] No news this week for ${subpageId}, skipping.`,
        );
        continue;
      }

      const html = buildEmailHtml(subpageId, items);
      await sendCampaignToList(subpageId, listId, html);
    } catch (err) {
      console.error(`[NEWSLETTER] Error processing ${subpageId}:`, err.message);
    }
  }

  console.log("[NEWSLETTER] Weekly newsletter run complete.");
}

export default sendWeeklyNewsletters;

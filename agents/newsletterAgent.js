import NewsItem from "../models/NewsItem.js";
import Subscriber from "../models/Subscriber.js";

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

const SOURCE_TO_SUBPAGE = {
  macro: "sp1",
  AiTech: "sp2",
  storage: "sp3",
  estate: "sp4",
  GreenEnergy: "sp5",
  scrapMetal: "sp6",
  offgrid: "sp7",
  numismatics: "sp8",
  MetalDetecting: "sp9",
  Goldsmithing: "sp10",
  JewelryResale: "sp11",
  coinsBars: "sp12",
  homepage: "sp1",
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

export async function getTopNewsItems(subpageId) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  let items = await NewsItem.find({
    subpageId,
    createdAt: { $gte: oneWeekAgo },
  })
    .sort({ clicks: -1, createdAt: -1 })
    .limit(5);

  if (!items || items.length === 0) {
    items = await NewsItem.find({ subpageId })
      .sort({ clicks: -1, createdAt: -1 })
      .limit(5);
  }

  return items;
}

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

function getISOWeekString(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function isSunday1759InTimezone(timeZone, date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || "Europe/Berlin",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    let weekday, hour;
    for (const part of parts) {
      if (part.type === "weekday") weekday = part.value;
      if (part.type === "hour") hour = parseInt(part.value, 10);
    }
    return weekday === "Sun" && hour === 8;
  } catch (err) {
    return false;
  }
}

export async function sendWeeklyNewslettersTimezoneAware() {
  const currentWeek = getISOWeekString();

  try {
    const activeSubscribers = await Subscriber.find({ active: true });

  

    if (activeSubscribers && activeSubscribers.length > 0) {
      for (const sub of activeSubscribers) {
        const isSunday = isSunday1759InTimezone(sub.timezone);
        console.log(
          `[NEWSLETTER-TZ][DEBUG] Subscriber: email=${sub.email} | source=${sub.source} | timezone=${sub.timezone} | lastSentWeek=${sub.lastSentWeek || "null"} | isSunday1759=${isSunday}`
        );
      }
    }
    // ── END DEBUG LOGS ──────────────────────────────────────────────────────

    if (!activeSubscribers || activeSubscribers.length === 0) {
      return;
    }

    const eligibleSubscribers = activeSubscribers.filter((sub) => {
      if (sub.lastSentWeek === currentWeek) return false;
      return isSunday1759InTimezone(sub.timezone);
    });

    if (eligibleSubscribers.length === 0) {
      return;
    }

    console.log(`[NEWSLETTER-TZ] Found ${eligibleSubscribers.length} eligible subscriber(s) for Sunday 17:59.`);

    const grouped = {};
    for (const sub of eligibleSubscribers) {
      const subpageId = SOURCE_TO_SUBPAGE[sub.source] || "sp1";
      if (!grouped[subpageId]) grouped[subpageId] = [];
      grouped[subpageId].push(sub);
    }

    for (const [subpageId, subs] of Object.entries(grouped)) {
      const items = await getTopNewsItems(subpageId);
      if (!items || items.length === 0) continue;

      const html = buildEmailHtml(subpageId, items);
      const label = SUBPAGE_LABELS[subpageId] || subpageId;

      if (process.env.BREVO_API_KEY) {
        for (const sub of subs) {
          try {
            await fetch("https://api.brevo.com/v3/smtp/email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY,
              },
              body: JSON.stringify({
                sender: {
                  name: "GoldSilver.de",
                  email: process.env.NEWSLETTER_SENDER_EMAIL,
                },
                to: [{ email: sub.email }],
                subject: `Your Weekly ${label} Update from GoldSilver.de`,
                htmlContent: html,
              }),
            });
          } catch (sendErr) {
            console.error(`[NEWSLETTER-TZ] Error sending to ${sub.email}:`, sendErr.message);
          }
        }
      }

      const subIds = subs.map((s) => s._id);
      await Subscriber.updateMany(
        { _id: { $in: subIds } },
        { lastSentWeek: currentWeek, lastNewsletterSentAt: new Date() }
      );
    }
  } catch (err) {
    console.error("[NEWSLETTER-TZ] Timezone newsletter error:", err.message);
  }
}

export async function sendWeeklyNewsletters() {
  console.log("[NEWSLETTER] Starting weekly newsletter run...");
  const currentWeek = getISOWeekString();

  for (const [subpageId, listId] of Object.entries(LIST_ID_MAP)) {
    try {
      const items = await getTopNewsItems(subpageId);

      if (!items.length) {
        console.log(
          `[NEWSLETTER] No news this week for ${subpageId}, skipping.`,
        );
        continue;
      }

      const html = buildEmailHtml(subpageId, items);
      await sendCampaignToList(subpageId, listId, html);

      const sourceName = Object.keys(SOURCE_TO_SUBPAGE).find(
        (key) => SOURCE_TO_SUBPAGE[key] === subpageId
      );
      if (sourceName) {
        await Subscriber.updateMany(
          { source: sourceName, active: true },
          { lastSentWeek: currentWeek, lastNewsletterSentAt: new Date() }
        );
      }
    } catch (err) {
      console.error(`[NEWSLETTER] Error processing ${subpageId}:`, err.message);
    }
  }

  console.log("[NEWSLETTER] Weekly newsletter run complete.");
}

export default sendWeeklyNewsletters;

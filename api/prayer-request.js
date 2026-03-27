const ALLOWED_ORIGINS = [
  "https://www.brotherhyeok.com",
  "https://brotherhyeok.com",
];

function getCorsHeaders(origin) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default async function handler(req, res) {
  const cors = getCorsHeaders(req.headers.origin);
  Object.entries(cors).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "tblKWNy2dlaJXBN5I";

  console.log("DEBUG env:", { hasKey: !!AIRTABLE_API_KEY, hasBase: !!AIRTABLE_BASE_ID, table: AIRTABLE_TABLE_NAME });

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("Missing env vars:", { hasKey: !!AIRTABLE_API_KEY, hasBase: !!AIRTABLE_BASE_ID });
    return res.status(500).json({ error: "Server configuration error." });
  }

  const { name, email, country, language, prayerRequest, agreedToNewsletter } = req.body || {};

  if (!email || !prayerRequest) {
    return res.status(400).json({ error: "Email and prayer request are required." });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

    const airtableRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: name || "",
              Email: email,
              Content: prayerRequest,
              Source: "Website",
              Status: "New",
              Created_at: new Date().toISOString().split("T")[0],
            },
          },
        ],
      }),
    });

    if (!airtableRes.ok) {
      const errorData = await airtableRes.text();
      console.error("Airtable URL:", url);
      console.error("Airtable status:", airtableRes.status);
      console.error("Airtable error:", errorData);
      return res.status(502).json({ error: "Failed to save prayer request.", debug: errorData });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

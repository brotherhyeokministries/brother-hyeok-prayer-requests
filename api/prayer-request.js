function getCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
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
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Prayer Requests";

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
              "General P name": name || "",
              email: email,
              content: prayerRequest,
              type: "public",
              priority: "normal_public",
              status: "active",
              source: "website",
              created_at: new Date().toISOString().split("T")[0],
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
      return res.status(502).json({ error: "Failed to save prayer request." });
    }

    // Send transactional confirmation email via Loops
    const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
    console.log("LOOPS_API_KEY present:", !!LOOPS_API_KEY);
    if (LOOPS_API_KEY) {
      try {
        const loopsRes = await fetch("https://app.loops.so/api/v1/transactional", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionalId: "cmmi3mcuq5r3m0iz1d00ncar1",
            email: email,
            dataVariables: {
              name: name || "Friend",
            },
          }),
        });
        const loopsData = await loopsRes.text();
        console.log("Loops response status:", loopsRes.status);
        console.log("Loops response body:", loopsData);
      } catch (loopsError) {
        // Log but don't fail the request if email fails
        console.error("Loops email error:", loopsError);
      }
    } else {
      console.log("Skipping Loops - no API key");
    }

    // Add to Loops newsletter contact list if they agreed
    if (agreedToNewsletter && LOOPS_API_KEY) {
      try {
        await fetch("https://app.loops.so/api/v1/contacts/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            firstName: name || "",
            source: "prayer_request_form",
          }),
        });
      } catch (contactError) {
        console.error("Loops contact error:", contactError);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

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
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "tblKWNy2dlaJXBN5I";

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("Missing env vars:", { hasKey: !!AIRTABLE_API_KEY, hasBase: !!AIRTABLE_BASE_ID });
    return res.status(500).json({ error: "Server configuration error." });
  }

  const { name, email, country, language, prayerRequest, agreedToNewsletter } = req.body || {};

  if (!email || !prayerRequest) {
    return res.status(400).json({ error: "Email and prayer request are required." });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblKWNy2dlaJXBN5I`;

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

    // Save contact to Loops and fire event to trigger the Loop
    const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
    if (LOOPS_API_KEY) {
      // Step 1: Create or update contact with all properties
      try {
        const contactRes = await fetch("https://app.loops.so/api/v1/contacts/update", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            firstName: name ? name.split(" ")[0] : "",
            fullName: name || "",
            source: "prayer_request_form",
            subscribed: agreedToNewsletter || false,
            country: country || "",
            locale: language || "en-us",
          }),
        });
        console.log("Loops contact status:", contactRes.status);
      } catch (contactError) {
        console.error("Loops contact error:", contactError);
      }

      // Step 2: Fire event to trigger the Loop workflow
      try {
        const eventRes = await fetch("https://app.loops.so/api/v1/events/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            eventName: "prayer.request.created",
            eventProperties: {
              name: name || "Friend",
              prayerRequest: prayerRequest,
              language: language || "en-us",
              country: country || "",
            },
          }),
        });
        console.log("Loops event status:", eventRes.status);
      } catch (eventError) {
        console.error("Loops event error:", eventError);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

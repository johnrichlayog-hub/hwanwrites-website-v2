export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, service, details } = req.body || {};
  const clean = {
    name: typeof name === "string" ? name.trim() : "",
    email: typeof email === "string" ? email.trim() : "",
    service: typeof service === "string" ? service.trim() : "",
    details: typeof details === "string" ? details.trim() : ""
  };

  if (
    clean.name.length < 1 || clean.name.length > 120 ||
    clean.email.length < 3 || clean.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) ||
    clean.service.length < 1 || clean.service.length > 100 ||
    clean.details.length < 1 || clean.details.length > 5000
  ) {
    return res.status(400).json({ error: "Please check your details and try again." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "The inquiry service is not configured yet." });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(clean)
    });
    if (!response.ok) {
      const message = await response.text();
      console.error("Supabase inquiry insert failed:", response.status, message);
      return res.status(502).json({ error: "Unable to submit your inquiry right now. Please try again later." });
    }
    return res.status(201).json({ message: "Inquiry submitted successfully." });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
}

// Vercel Serverless Function for OpenRouter API
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return res
        .status(500)
        .json({
          error: "Server configuration error: OPENROUTER_API_KEY not set",
        });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            req.headers.origin ||
            req.headers.referer ||
            "https://codefossil.tech",
          "X-Title": "CodeFossil",
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData.error?.message || `API Error: ${response.status}`,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({ error: error.message });
  }
}

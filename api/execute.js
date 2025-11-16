// Vercel Serverless Function for Piston API
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
    const { source_code, language_id } = req.body;

    const languageMap = {
      50: { language: "c", version: "10.2.0" },
      54: { language: "c++", version: "10.2.0" },
      71: { language: "python", version: "3.10.0" },
    };

    const langConfig = languageMap[language_id] || languageMap[71];

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: source_code }],
      }),
    });

    const data = await response.json();

    const transformedResponse = {
      stdout: data.run?.stdout || "",
      stderr: data.run?.stderr || "",
      compile_output: data.compile?.stderr || "",
      status: {
        id: data.run?.code === 0 ? 3 : 6,
        description: data.run?.code === 0 ? "Accepted" : "Runtime Error",
      },
    };

    res.status(200).json(transformedResponse);
  } catch (error) {
    console.error("Piston API Error:", error);
    res.status(500).json({ error: error.message });
  }
}

// Simple proxy server to handle CORS and HIDE API keys
// Run with: node server/proxy.js
// This keeps your API keys SECRET on the server!

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "CodeCRT Proxy Server",
    endpoints: ["/api/openrouter", "/api/execute"],
  });
});

// OpenRouter API proxy (Grok Code Fast 1)
app.post("/api/openrouter", async (req, res) => {
  try {
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
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
          "HTTP-Referer": req.headers.origin || "http://localhost:5173",
          "X-Title": "CodeCRT",
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
    res.json(data);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Piston API proxy - FREE code execution (no API key needed!)
app.post("/api/execute", async (req, res) => {
  try {
    const { source_code, language_id } = req.body;

    // Map Judge0 language IDs to Piston language names
    const languageMap = {
      50: { language: "c", version: "10.2.0" }, // C
      54: { language: "c++", version: "10.2.0" }, // C++
      71: { language: "python", version: "3.10.0" }, // Python
      63: { language: "javascript", version: "18.15.0" }, // JavaScript
      62: { language: "java", version: "15.0.2" }, // Java
    };

    const langConfig = languageMap[language_id] || languageMap[71]; // Default to Python

    console.log(`Executing ${langConfig.language} code via Piston API...`);

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            content: source_code,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Piston Response:", data);

    // Transform Piston response to match Judge0 format
    const transformedResponse = {
      stdout: data.run?.stdout || "",
      stderr: data.run?.stderr || "",
      compile_output: data.compile?.stderr || "",
      status: {
        id: data.run?.code === 0 ? 3 : 6, // 3 = success, 6 = error
        description: data.run?.code === 0 ? "Accepted" : "Runtime Error",
      },
    };

    res.json(transformedResponse);
  } catch (error) {
    console.error("Piston API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CodeCRT Proxy Server running on http://localhost:${PORT}`);
  console.log(`✅ Using FREE Piston API for code execution`);
  console.log(`🔐 API keys are SECURE (not exposed to client)`);
  console.log(``);
  console.log(`Environment variables loaded:`);
  console.log(
    `  - OPENROUTER_API_KEY: ${
      process.env.OPENROUTER_API_KEY ? "✅ Set" : "❌ Missing"
    }`
  );
  console.log(``);
  console.log(`Make sure your .env file contains:`);
  console.log(`  OPENROUTER_API_KEY=your_key_here`);
});

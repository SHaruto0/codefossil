import { API_CONFIG } from "../config/api";

export const analyzeCode = async (code, filename) => {
  const response = await fetch(API_CONFIG.OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: API_CONFIG.MODEL,
      messages: [
        {
          role: "user",
          content: `You are an AI code archaeologist. Analyze this legacy code:

\`\`\`
${code}
\`\`\`

Return ONLY valid JSON (no markdown):
{
  "language": "string",
  "era": "string (e.g., '1970s', '1980s')",
  "linesOfCode": number,
  "complexity": "Low/Medium/High",
  "summary": "string (2-3 sentences)",
  "purpose": "string",
  "modernCode": "string (Python translation)",
  "translationNotes": "string",
  "vulnerabilities": [{"type":"","description":"","severity":"High/Medium/Low","fix":""}],
  "historicalContext": "string (3-4 sentences about the era)",
  "migrationStrategy": "string",
  "interestingFacts": ["string", "string", "string"]
}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const cleaned = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  return JSON.parse(cleaned);
};

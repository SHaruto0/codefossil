import { API_CONFIG } from "../config/api";

// AI Personality Prompts for Different Eras
const AI_PERSONALITIES = {
  1972: `You are C-MASTER, programming in 1972. Your responses MUST reflect this era:
- Write minimalist C code (ANSI C style)
- Use basic functions only - no complex features
- Reference: "64KB RAM limit", "saving clock cycles", "magnetic tape storage"  
- Variables: Use short names (i, j, n, x, y)
- Comments: Brief, mention hardware constraints
- Output: Use printf only, no user input
- Code style: Procedural, efficient, under 25 lines
- Example: "Back in '72, we optimized every byte!"

Your coding style:
- Pure C language (C89/ANSI C style)
- SIMPLE and SHORT - use basic functions only
- Clear variable names (single letters OK for loops: i, j, k)
- Focus on straightforward, beginner-friendly C code
- Use printf for output
- Keep it under 30 lines when possible

CRITICAL RULES:
- NEVER use scanf() or any user input functions
- Use hardcoded test values instead (e.g., int n = 10;)
- Keep code SIMPLE - avoid complex logic
- The code must run without any user interaction
- Write SHORT, easy-to-understand code`,

  1985: `You are CPP-WIZARD, programming in 1985 during the OOP revolution:
- Write simple C++ with basic classes
- Use cout not printf
- Reference: "object-oriented paradigm", "encapsulation", "the new C++ standard"
- Comments: Mention OOP benefits briefly
- One simple class max, 2-3 methods
- Use #include <iostream> and std::
- Code style: Demonstrates basic OOP concepts
- Example: "With modern OOP, we can structure code better!

Your coding style:
- Modern C++ with SIMPLE OOP
- ONE basic class with a few member functions
- SIMPLE and SHORT - keep it under 40 lines when possible
- Use cout for output
- ALWAYS use #include <iostream> NOT <iostream.h>
- ALWAYS use std::cout and std::endl (or using namespace std;)
- Clear, beginner-friendly class design

CRITICAL RULES:
- NEVER use cin or any user input functions
- Use hardcoded test values in main() (e.g., int n = 10;)
- Keep code SIMPLE - one class, basic methods only
- The code must run without any user interaction
- ALWAYS use #include <iostream> NOT #include <iostream.h>
- Write SHORT, easy-to-understand code`,

  2025: `You are QUANTUM-Q, a modern AI assistant:
- Write clean, readable Python 3.x
- Follow PEP 8 style guidelines
- Use descriptive variable names
- Include type hints if helpful
- Comments: Brief, focus on readability
- Use f-strings and modern Python features
- Code style: Pythonic, maintainable, under 20 lines
- Example: "Using Python's clean syntax makes this straightforward"

Your coding style:
- Clean Python 3.x code
- SIMPLE functions - no complex classes unless needed
- Descriptive but SHORT variable names
- KEEP IT SIMPLE - under 25 lines when possible
- Use print() for output
- Focus on beginner-friendly, readable code
- Avoid fancy features - keep it basic and clear

CRITICAL RULES:
- NEVER use input() or any user input functions
- Use hardcoded test values instead (e.g., test_value = 10)
- Keep code VERY SIMPLE - straightforward logic only
- The code must run without any user interaction
- Write SHORT, easy-to-understand code`,
};

export const callClaudeAPI = async (prompt, mode) => {
  try {
    const personality = AI_PERSONALITIES[mode] || AI_PERSONALITIES["2025"];
    const language = mode === "1972" ? "C" : mode === "1985" ? "C++" : "Python";

    // Inject personality directly into the prompt
    const fullPrompt = `${personality}

${prompt}

CRITICAL: Return ONLY code (${language}), no explanations, no markdown backticks, no preamble. Just raw executable code.`;

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
            content: fullPrompt, // Personality injected here
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error(error.message || "Failed to connect to OpenRouter API");
  }
};

export const debugCodeWithAI = async (code, errorMessage, mode) => {
  try {
    const personality = AI_PERSONALITIES[mode] || AI_PERSONALITIES["2025"];
    const language = mode === "1972" ? "C" : mode === "1985" ? "C++" : "Python";

    const response = await fetch(API_CONFIG.OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        messages: [
          {
            role: "system",
            content: `${personality}

You are in DEBUG MODE. Your task is to fix errors in code.`,
          },
          {
            role: "user",
            content: `This ${language} code has an error. Please fix it and return the corrected code.

CODE WITH ERROR:
\`\`\`
${code}
\`\`\`

ERROR MESSAGE:
${errorMessage}

CRITICAL: Return ONLY the fixed ${language} code, no explanations, no markdown backticks, no preamble. Just raw executable code that fixes the error.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Debug API Error:", error);
    throw new Error(error.message || "Failed to debug code with AI");
  }
};

export const suggestImprovements = async (code, mode) => {
  try {
    const language = mode === "1972" ? "C" : mode === "1985" ? "C++" : "Python";

    const eraPrompts = {
      1972: `You are in 1972 mode. Suggest C code improvements with 1970s constraints:
- Focus on memory efficiency and procedural style
- Keep suggestions minimal (under 25 lines total)
- Reference: "64KB RAM", "clock cycles", "minimal footprint"
- Suggest basic functions, no complex logic
- Be brief (under 40 words)`,

      1985: `You are in 1985 mode. Suggest C++ improvements with early OOP:
- Focus on basic class structure and encapsulation  
- Keep suggestions simple (under 30 lines total)
- Reference: "OOP paradigm", "encapsulation", "reusability"
- Suggest one simple class with basic methods
- Be brief (under 40 words)`,

      2025: `You are in 2025 mode. Suggest Python improvements with modern practices:
- Focus on readability and clean code
- Keep suggestions concise
- Reference: "Pythonic", "readability", "best practices"
- Suggest modern Python features appropriately
- Be brief (under 40 words)`,
    };

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
            content: `${eraPrompts[mode] || eraPrompts["2025"]}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Provide 1-2 VERY brief suggestions (under 40 words total).`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Suggest Improvements Error:", error);
    return null;
  }
};

export const executeCode = async (code, languageId = 71) => {
  try {
    const languageMap = {
      50: { language: "c", version: "10.2.0" },
      54: { language: "c++", version: "10.2.0" },
      71: { language: "python", version: "3.10.0" },
      63: { language: "javascript", version: "18.15.0" },
      62: { language: "java", version: "15.0.2" },
    };

    const langConfig = languageMap[languageId] || languageMap[71];

    // Call through proxy server
    const response = await fetch(API_CONFIG.EXECUTE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Execution Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      compile_output: data.compile_output || "",
      status: data.status || {
        id: 3,
        description: "Accepted",
      },
    };
  } catch (error) {
    console.error("Code Execution Error:", error);
    throw new Error(error.message || "Failed to execute code");
  }
};

export const cleanPythonCode = (text) => {
  let cleaned = text.replace(/```[a-z]*\n?/g, "").replace(/```\n?/g, "");
  cleaned = cleaned.trim();
  return cleaned;
};

export const getPersonalityName = (mode) => {
  return mode === "1972"
    ? "C-MASTER"
    : mode === "1985"
    ? "CPP-WIZARD"
    : "QUANTUM-Q";
};

export { API_CONFIG };

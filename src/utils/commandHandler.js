import {
  callClaudeAPI,
  executeCode as apiExecuteCode,
  cleanPythonCode,
  debugCodeWithAI,
  API_CONFIG,
} from "../services/apiService";

export const handleCommand = async (command, state, callbacks) => {
  const {
    mode,
    code,
    currentTime,
    languageId,
    currentLanguage,
    challenge,
    challengeAttempts,
  } = state;
  const {
    addOutput,
    setCode,
    setMode,
    setIsBooting,
    setIsProcessing,
    setShowEvolution,
    setCurrentLanguage,
    setLanguageId,
    setShowMatrix,
    setChallenge,
    setChallengeTimer,
    setChallengeAttempts,
  } = callbacks;

  const cmd = command.trim().toLowerCase();
  addOutput(`> ${command}`, "command");

  switch (cmd) {
    case "help":
      addOutput("", "output");
      addOutput(
        "╔═══════════════════════════════════════════════════════════╗",
        "system"
      );
      addOutput(
        "║               CODECRT COMMAND REFERENCE v1.0               ║",
        "system"
      );
      addOutput(
        "╚═══════════════════════════════════════════════════════════╝",
        "system"
      );
      addOutput("", "output");
      addOutput("  SYSTEM COMMANDS:", "success");
      addOutput("", "output");
      addOutput("    help             Show this help menu", "output");
      addOutput("    clear            Clear terminal output", "output");
      addOutput(
        "    toggle           Switch: 1972(C) → 1985(C++) → 2025(Python)",
        "output"
      );
      addOutput("    time             Display current date and time", "output");
      addOutput("    exit             Power off system", "output");
      addOutput("", "output");
      addOutput("  CODE EXECUTION:", "success");
      addOutput("", "output");
      addOutput("    run              Execute code in the editor", "output");
      addOutput("", "output");
      addOutput("  AI COMMANDS (Powered by Grok Code Fast 1):", "success");
      addOutput("", "output");
      addOutput("    ai <message>     Ask AI to generate code", "output");
      addOutput(
        `                     Current mode: ${currentLanguage}`,
        "code"
      );
      addOutput("                     Example: ai create a calculator", "code");
      addOutput("", "output");
      addOutput(
        "    debug            Fix errors in current code with AI",
        "output"
      );
      addOutput(
        "                     Run code first to capture errors!",
        "code"
      );
      addOutput("", "output");
      addOutput(
        "    explain          AI explains what the code does",
        "output"
      );
      addOutput(
        `                     Era-appropriate explanation (${mode})`,
        "code"
      );
      addOutput("", "output");
      addOutput(
        "    insert           Insert last AI code into editor",
        "output"
      );
      addOutput("    export           Download current code as file", "output");
      addOutput("", "output");
      addOutput("  🚀 TIME MACHINE:", "success");
      addOutput("", "output");
      addOutput(
        "    evolve           Watch code transform through history!",
        "output"
      );
      addOutput("                     1972:C → 1985:C++ → 2025:Python", "code");
      addOutput("", "output");
      addOutput("  🎮 EASTER EGGS:", "success");
      addOutput("", "output");
      addOutput("    hello            Hello World in current era", "output");
      addOutput("    coffee           Coffee break", "output");
      addOutput("    matrix           Enter the Matrix... 🟢", "output");
      addOutput("    challenge        Speed coding challenge ⏱️", "output");
      addOutput("    submit           Submit solution for challenge", "output");
      addOutput("                     (Can submit multiple times!)", "code");
      addOutput("    giveup           End active challenge", "output");
      addOutput("                     (Shows solution)", "code");
      addOutput("", "output");
      addOutput(
        "  ────────────────────────────────────────────────────────────",
        "system"
      );
      addOutput(
        `  💡 TIP: You're in ${mode} mode - AI generates ${currentLanguage} code!`,
        "success"
      );
      addOutput(
        `  🤖 Powered by: Grok Code Fast 1 (via OpenRouter)`,
        "success"
      );
      addOutput(
        "  ────────────────────────────────────────────────────────────",
        "system"
      );
      addOutput("", "output");
      break;

    case "run":
      await executeCode(code, addOutput, setIsProcessing, languageId);
      break;

    case "debug":
      await handleDebugCommand(
        mode,
        code,
        addOutput,
        setIsProcessing,
        setCode,
        setCurrentLanguage,
        setLanguageId
      );
      break;

    case "explain":
      await handleExplainCommand(
        mode,
        code,
        addOutput,
        setIsProcessing,
        currentLanguage
      );
      break;

    case "clear":
      return "clear";

    case "toggle":
      // 3-way cycle: 1972 → 1985 → 2025 → 1972
      let newMode, newLang, newLangId;

      if (mode === "1972") {
        newMode = "1985";
        newLang = "C++";
        newLangId = 54;
      } else if (mode === "1985") {
        newMode = "2025";
        newLang = "Python";
        newLangId = 71;
      } else {
        newMode = "1972";
        newLang = "C";
        newLangId = 50;
      }

      setMode(newMode);
      setCurrentLanguage(newLang);
      setLanguageId(newLangId);

      addOutput(`Switched to ${newMode} mode`, "system");
      addOutput(`Language: ${newLang}`, "system");
      break;

    case "time":
      addOutput(currentTime.toLocaleString(), "output");
      break;

    case "insert":
      if (window.lastAICode) {
        const lang = window.lastAILanguage || "unknown";
        const langId = window.lastAILanguageId || 71;

        setCode(window.lastAICode);
        setCurrentLanguage(lang);
        setLanguageId(langId);

        addOutput("Code inserted into editor!", "success");
        window.lastAICode = null;
      } else {
        addOutput("No code to insert. Use 'ai' command first.", "error");
      }
      break;

    case "evolve":
      if (
        !code ||
        code.trim() === "" ||
        code === '# Write your code here\nprint("Hello from the future!")' ||
        code ===
          '/* Write your C code here */\n#include <stdio.h>\n\nint main() {\n    printf("Hello from 1972!\\n");\n    return 0;\n}'
      ) {
        addOutput(
          "Error: Write some code first before using 'evolve'",
          "error"
        );
        addOutput("💡 Try: ai create a calculator", "system");
        addOutput("💡 Then: evolve", "system");
      } else {
        addOutput("🚀 Initializing Code Time Machine...", "system");
        addOutput("⏳ Traveling: 1972(C) → 1985(C++) → 2025(Python)", "system");
        addOutput("", "output");
        if (setShowEvolution) {
          setShowEvolution(true);
        }
      }
      break;

    case "exit":
      addOutput("SYSTEM HALTED", "error");
      setTimeout(() => setIsBooting(true), 1000);
      break;

    // Easter eggs
    case "hello":
      if (mode === "1972") {
        addOutput("#include <stdio.h>", "code");
        addOutput("int main() {", "code");
        addOutput('    printf("Hello World!\\n");', "code");
        addOutput("    return 0;", "code");
        addOutput("}", "code");
      } else if (mode === "1985") {
        addOutput("#include <iostream>", "code");
        addOutput("int main() {", "code");
        addOutput('    std::cout << "Hello World!" << std::endl;', "code");
        addOutput("    return 0;", "code");
        addOutput("}", "code");
      } else {
        addOutput("print('Hello, World!')", "code");
      }
      break;

    case "coffee":
      addOutput("☕ Brewing coffee...", "system");
      setTimeout(() => {
        addOutput("ERROR: PC LOAD LETTER", "error");
      }, 1000);
      break;

    case "hack":
      addOutput("ACCESS GRANTED", "success");
      addOutput("01001000 01000001 01000011 01001011", "code");
      break;

    case "matrix":
      addOutput("🟢 ENTERING THE MATRIX...", "success");
      addOutput("Wake up, Neo...", "system");
      addOutput("The Matrix has you...", "system");
      addOutput("Follow the white rabbit.", "system");
      addOutput("", "output");
      addOutput("Press ESC to exit the Matrix", "system");
      if (setShowMatrix) {
        setTimeout(() => {
          setShowMatrix(true);
        }, 500);
      }
      break;

    case "challenge":
      await handleChallengeCommand(
        mode,
        addOutput,
        setIsProcessing,
        setChallenge,
        setChallengeTimer,
        setChallengeAttempts,
        currentLanguage
      );
      break;

    case "submit":
      await handleSubmitCommand(
        mode,
        code,
        addOutput,
        setIsProcessing,
        challenge,
        challengeAttempts,
        setChallengeAttempts,
        setChallenge,
        setChallengeTimer,
        languageId,
        currentLanguage
      );
      break;

    case "giveup":
    case "surrender":
    case "endchallenge":
      if (challenge) {
        await revealSolution(
          challenge,
          addOutput,
          setChallenge,
          setChallengeTimer,
          setChallengeAttempts
        );
      } else {
        addOutput("❌ No active challenge to end", "error");
        addOutput("💡 Type 'challenge' to start one!", "system");
      }
      break;

    case "export":
      handleExportCode(code, currentLanguage, addOutput);
      break;

    default:
      if (cmd.startsWith("ai ")) {
        await handleAICommand(
          command.substring(3),
          mode,
          addOutput,
          setIsProcessing,
          code,
          setCurrentLanguage,
          setLanguageId
        );
      } else {
        addOutput(
          `Unknown command: ${cmd}. Type "help" for available commands.`,
          "error"
        );
      }
  }

  return null;
};

const executeCode = async (
  code,
  addOutput,
  setIsProcessing,
  languageId = 71
) => {
  if (!code.trim()) {
    addOutput("Error: No code to execute", "error");
    return;
  }

  setIsProcessing(true);
  addOutput(`> Executing code...`, "system");

  try {
    const result = await apiExecuteCode(code, languageId);

    // Debug logging
    console.log("Execution Result:", result);
    console.log("Status ID:", result.status?.id);
    console.log("Stdout:", result.stdout);
    console.log("Stderr:", result.stderr);
    console.log("Compile Output:", result.compile_output);

    // Check for compilation errors first
    if (result.compile_output && result.compile_output.trim()) {
      addOutput("Compilation Error:", "error");
      addOutput(result.compile_output.trim(), "error");
      window.lastExecutionError = result.compile_output.trim();
      window.lastErrorCode = code;
      addOutput("", "output");
      addOutput("💡 Type 'debug' to let AI fix this error!", "system");
    }
    // Check for runtime errors
    else if (result.stderr && result.stderr.trim()) {
      addOutput("Runtime Error:", "error");
      addOutput(result.stderr.trim(), "error");
      window.lastExecutionError = result.stderr.trim();
      window.lastErrorCode = code;
      addOutput("", "output");
      addOutput("💡 Type 'debug' to let AI fix this error!", "system");
    }
    // Check for successful output
    else if (result.stdout && result.stdout.trim()) {
      addOutput("Output:", "success");
      addOutput(result.stdout.trim(), "success");
      window.lastExecutionError = null;
    }
    // Check status - status id 3 means success
    else if (result.status && result.status.id === 3) {
      // Status 3 = Accepted (successful execution)
      if (result.stdout === null || result.stdout === "") {
        addOutput("Code executed successfully (no output)", "success");
        addOutput(
          "💡 Tip: Add printf/cout/print statements to see output",
          "system"
        );
      } else {
        addOutput("Output:", "success");
        addOutput(result.stdout || "(empty)", "success");
      }
      window.lastExecutionError = null;
    }
    // Handle other status codes
    else if (result.status && result.status.id !== 3) {
      const statusMessage = result.status.description || "Unknown error";
      addOutput(`Execution Status: ${statusMessage}`, "error");

      if (result.message) {
        addOutput(result.message, "error");
      }

      window.lastExecutionError = statusMessage;
      window.lastErrorCode = code;
      addOutput("", "output");
      addOutput("💡 Type 'debug' to let AI fix this error!", "system");
    }
    // Fallback
    else {
      addOutput("Code executed successfully (no output)", "success");
      addOutput(
        "💡 Tip: Add printf/cout/print statements to see output",
        "system"
      );
      window.lastExecutionError = null;
    }
  } catch (error) {
    addOutput(`Execution error: ${error.message}`, "error");
    console.error("Execute Code Error:", error);
    window.lastExecutionError = error.message;
    window.lastErrorCode = code;
    addOutput("", "output");
    addOutput("💡 Type 'debug' to let AI fix this error!", "system");
  }

  setIsProcessing(false);
};

const handleChallengeCommand = async (
  mode,
  addOutput,
  setIsProcessing,
  setChallenge,
  setChallengeTimer,
  setChallengeAttempts,
  currentLanguage
) => {
  setIsProcessing(true);

  addOutput("🎯 Generating random coding challenge...", "system");
  addOutput("🎲 Rolling the dice...", "system");
  addOutput("", "output");

  try {
    // Random challenge types for variety
    const challengeTypes = [
      "string manipulation (reverse, palindrome, count vowels)",
      "array operations (find max/min, sum, average, filter)",
      "mathematical operations (factorial, fibonacci, prime check)",
      "pattern printing (triangles, diamonds, number patterns)",
      "simple algorithms (bubble sort snippet, linear search, swap)",
      "conditional logic (FizzBuzz variant, grade calculator, leap year)",
      "loop challenges (count down, multiplication table, sum of digits)",
      "basic data structures (list operations, simple stack/queue)",
    ];

    // Random difficulty levels (weighted toward Easy)
    const difficulties = [
      { level: "Easy", timeMin: 120, timeMax: 150, emoji: "🟢" },
      { level: "Easy", timeMin: 120, timeMax: 150, emoji: "🟢" },
      { level: "Easy", timeMin: 120, timeMax: 150, emoji: "🟢" },
      { level: "Medium", timeMin: 150, timeMax: 180, emoji: "🟡" },
    ];

    // Pick random challenge type and difficulty
    const randomType =
      challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    const randomDifficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    const randomTime =
      Math.floor(
        Math.random() *
          (randomDifficulty.timeMax - randomDifficulty.timeMin + 1)
      ) + randomDifficulty.timeMin;

    addOutput(
      `${randomDifficulty.emoji} Selected: ${
        randomDifficulty.level
      } - ${randomType.split("(")[0].trim()}`,
      "system"
    );
    addOutput("⏳ AI crafting unique challenge...", "system");
    addOutput("", "output");

    const challengePrompt = `Generate a UNIQUE, RANDOM ${
      randomDifficulty.level
    } coding challenge for ${currentLanguage} in the category: ${randomType}.

IMPORTANT: Make it DIFFERENT from common examples. Be creative and unique!

Requirements:
- Task should be ${randomDifficulty.level.toLowerCase()} difficulty
- Should have clear input/output requirements
- Suitable for speed coding
- Can be completed in under 20 lines of code
- Must be solvable WITHOUT user input (use hardcoded test values)
- Make it interesting and slightly different from typical textbook problems

Format your response EXACTLY like this (no other text):
TASK: [one sentence description of a unique challenge]
EXAMPLE: [show one simple example with expected output]
DIFFICULTY: ${randomDifficulty.level}
TIME: ${randomTime}
SOLUTION: [provide a working solution in ${currentLanguage}]`;

    // Use OpenRouter proxy endpoint
    const response = await fetch(API_CONFIG.OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: challengePrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const challengeText = data.choices[0].message.content.trim();

    // Parse the challenge
    const taskMatch = challengeText.match(/TASK: (.+)/);
    const exampleMatch = challengeText.match(/EXAMPLE: (.+)/);
    const difficultyMatch = challengeText.match(/DIFFICULTY: (.+)/);
    const timeMatch = challengeText.match(/TIME: (\d+)/);
    const solutionMatch = challengeText.match(/SOLUTION:([\s\S]*)/);

    const task = taskMatch ? taskMatch[1] : "Complete the coding challenge";
    const example = exampleMatch ? exampleMatch[1] : "";
    const difficulty = difficultyMatch
      ? difficultyMatch[1]
      : randomDifficulty.level;
    const timeLimit = timeMatch ? parseInt(timeMatch[1]) : randomTime;
    let solution = solutionMatch ? solutionMatch[1].trim() : "";

    // Clean solution of markdown code blocks
    solution = solution
      .replace(/```[a-z]*\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Create challenge object
    const challengeObj = {
      task,
      example,
      difficulty,
      timeLimit,
      solution,
      language: currentLanguage,
    };

    setChallenge(challengeObj);
    setChallengeTimer(timeLimit);
    setChallengeAttempts(0);

    addOutput("", "output");
    addOutput("┌────────────────────────────────────────────────┐", "system");
    addOutput("           🎯 CHALLENGE STARTED! 🎯", "success");
    addOutput("└────────────────────────────────────────────────┘", "system");
    addOutput("", "output");
    addOutput(`📖 TASK: ${task}`, "ai");
    if (example) {
      addOutput(`💡 EXAMPLE: ${example}`, "system");
    }
    addOutput(`⚡ DIFFICULTY: ${difficulty}`, "system");
    addOutput(`⏰ TIME LIMIT: ${timeLimit} seconds`, "system");
    addOutput("", "output");
    addOutput("💻 Write your solution in the editor", "system");
    addOutput(
      "📤 Type 'submit' when ready (multiple attempts allowed!)",
      "system"
    );
    addOutput("🏳️  Type 'giveup' to see the solution", "system");
    addOutput("", "output");
  } catch (error) {
    addOutput(`Challenge Error: ${error.message}`, "error");
    console.error("Challenge Command Error:", error);
  }

  setIsProcessing(false);
};

const handleSubmitCommand = async (
  mode,
  code,
  addOutput,
  setIsProcessing,
  challenge,
  challengeAttempts,
  setChallengeAttempts,
  setChallenge,
  setChallengeTimer,
  languageId,
  currentLanguage
) => {
  if (!challenge) {
    addOutput("❌ No active challenge!", "error");
    addOutput("💡 Type 'challenge' to start one", "system");
    return;
  }

  if (!code || code.trim() === "") {
    addOutput("❌ No code to submit!", "error");
    addOutput("💡 Write your solution in the editor first", "system");
    return;
  }

  setIsProcessing(true);

  const attemptNum = challengeAttempts + 1;
  setChallengeAttempts(attemptNum);

  addOutput("", "output");
  addOutput(`📤 ATTEMPT #${attemptNum} - Submitting solution...`, "system");
  addOutput("", "output");

  try {
    // First, execute the code
    addOutput("▶️  Executing code...", "system");
    const result = await apiExecuteCode(code, languageId);

    let output = "";
    let hasError = false;

    if (result.compile_output && result.compile_output.trim()) {
      addOutput("❌ Compilation Error:", "error");
      addOutput(result.compile_output.trim(), "error");
      hasError = true;
    } else if (result.stderr && result.stderr.trim()) {
      addOutput("❌ Runtime Error:", "error");
      addOutput(result.stderr.trim(), "error");
      hasError = true;
    } else if (result.stdout) {
      output = result.stdout.trim();
      addOutput("✅ Code executed successfully", "success");
      addOutput("Output:", "system");
      addOutput(output, "code");
    } else {
      addOutput("⚠️  No output produced", "error");
      hasError = true;
    }

    if (hasError) {
      addOutput("", "output");
      addOutput("🔄 Fix the errors and submit again!", "system");
      setIsProcessing(false);
      return;
    }

    // Now verify with AI
    addOutput("", "output");
    addOutput("🔍 Verifying solution with AI...", "system");

    const verificationPrompt = `You are verifying a coding challenge solution.

CHALLENGE TASK: ${challenge.task}
${challenge.example ? `EXPECTED BEHAVIOR: ${challenge.example}` : ""}

STUDENT'S CODE:
\`\`\`${currentLanguage}
${code}
\`\`\`

CODE OUTPUT:
${output || "(no output)"}

REFERENCE SOLUTION:
\`\`\`${currentLanguage}
${challenge.solution}
\`\`\`

Does this code correctly solve the challenge? Compare the student's output and logic to the reference solution.

Respond with EXACTLY one of these formats:
CORRECT - [brief explanation why it's correct]
INCORRECT - [brief explanation what's wrong and a hint]
PARTIAL - [brief explanation what's working and what's missing]`;

    const verifyResponse = await fetch(API_CONFIG.OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: verificationPrompt,
          },
        ],
      }),
    });

    if (!verifyResponse.ok) {
      throw new Error("Verification failed");
    }

    const verifyData = await verifyResponse.json();
    const verdict = verifyData.choices[0].message.content.trim();

    addOutput("", "output");

    if (verdict.startsWith("CORRECT")) {
      const explanation = verdict
        .replace("CORRECT - ", "")
        .replace("CORRECT -", "")
        .replace("CORRECT", "")
        .trim();
      addOutput("┌────────────────────────────────────────────────", "success");
      addOutput("        🎉 CHALLENGE COMPLETED! ✅", "success");
      addOutput("└────────────────────────────────────────────────", "success");
      addOutput("", "output");
      addOutput(`🏆 ${explanation}`, "ai");
      addOutput(`📊 Attempts: ${attemptNum}`, "success");
      addOutput("", "output");

      // Reveal solution
      await revealSolution(
        challenge,
        addOutput,
        setChallenge,
        setChallengeTimer,
        setChallengeAttempts,
        true
      );
    } else if (verdict.startsWith("INCORRECT")) {
      const explanation = verdict
        .replace("INCORRECT - ", "")
        .replace("INCORRECT -", "")
        .replace("INCORRECT", "")
        .trim();
      addOutput("❌ Solution is incorrect", "error");
      addOutput("", "output");
      addOutput(`💡 ${explanation}`, "system");
      addOutput("", "output");
      addOutput("🔄 Keep trying! You can submit again.", "system");
    } else if (verdict.startsWith("PARTIAL")) {
      const explanation = verdict
        .replace("PARTIAL - ", "")
        .replace("PARTIAL -", "")
        .replace("PARTIAL", "")
        .trim();
      addOutput("⚠️  Partial solution", "error");
      addOutput("", "output");
      addOutput(`💡 ${explanation}`, "system");
      addOutput("", "output");
      addOutput("🔄 You're on the right track! Submit again.", "system");
    }
  } catch (error) {
    addOutput(`Submission Error: ${error.message}`, "error");
    console.error("Submit command error:", error);
  }

  setIsProcessing(false);
};

export const revealSolution = async (
  challenge,
  addOutput,
  setChallenge,
  setChallengeTimer,
  setChallengeAttempts,
  isSuccess = false
) => {
  if (!challenge) return;

  if (!isSuccess) {
    addOutput("", "output");
    addOutput("⏰ TIME'S UP! / Challenge ended", "error");
    addOutput("", "output");
  }

  addOutput("┌────────────────────────────────────────────────┐", "system");
  addOutput("           📚 REFERENCE SOLUTION 📚", "ai");
  addOutput("└────────────────────────────────────────────────┘", "system");
  addOutput("", "output");

  if (challenge.solution) {
    const lines = challenge.solution.split("\n");
    lines.forEach((line, index) => {
      const lineNum = String(index + 1).padStart(3, " ");
      addOutput(`${lineNum} | ${line}`, "code");
    });
  } else {
    addOutput("(Solution not available)", "system");
  }

  addOutput("", "output");
  addOutput("┌────────────────────────────────────────────────┐", "system");
  addOutput("💡 Study this solution to improve your skills!", "success");
  addOutput("🚀 Type 'challenge' to try another one!", "success");
  addOutput("└────────────────────────────────────────────────┘", "system");

  // Clear challenge
  setChallenge(null);
  setChallengeTimer(0);
  setChallengeAttempts(0);
};

const handleExplainCommand = async (
  mode,
  code,
  addOutput,
  setIsProcessing,
  currentLanguage
) => {
  // Check if there's code to explain
  const defaultCodes = [
    '# Write your code here\nprint("Hello from the future!")',
    '/* Write your C code here */\n#include <stdio.h>\n\nint main() {\n    printf("Hello from 1972!\\n");\n    return 0;\n}',
  ];

  if (!code || code.trim() === "" || defaultCodes.includes(code)) {
    addOutput("Error: No code to explain!", "error");
    addOutput(
      "💡 Write some code first, or use 'ai' to generate code",
      "system"
    );
    return;
  }

  setIsProcessing(true);

  addOutput(`🔍 ${getPersonalityName(mode)} analyzing code...`, "system");
  addOutput("", "output");

  try {
    const eraPrompts = {
      1972: `You're C-MASTER from 1972. Explain this code like we're chatting in the computer lab:
- "Back in '72, we'd write this to..."
- "See how this saves precious memory?"
- "Back when 64KB felt like infinity..."
- Sound like a seasoned engineer sharing wisdom
- Keep it conversational, 3-4 sentences max
- No technical jargon without explanation`,

      1985: `You're CPP-WIZARD from 1985. Explain this like we're at a tech conference:
- "What's cool about this OOP approach..."
- "Back in '85, this was revolutionary because..."
- "See how encapsulation makes this cleaner?"
- Sound enthusiastic about new programming paradigms
- Keep it conversational, 3-4 sentences max
- Like explaining to a fellow developer over coffee`,

      2025: `You're QUANTUM-Q from 2025. Explain this like we're pair programming:
- "So here's what this code does..."
- "I like how this handles..."
- "This is clean because..."
- Sound like a helpful teammate
- Keep it conversational, 3-4 sentences max
- Focus on readability and modern practices`,
    };

    const explanationPrompt = `${eraPrompts[mode] || eraPrompts["2025"]}

Here's the ${currentLanguage} code I'm looking at:

\`\`\`
${code}
\`\`\`

Give me your thoughts:`;

    const response = await fetch(API_CONFIG.OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: explanationPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API Error: ${response.status}`
      );
    }

    const data = await response.json();
    const explanation = data.choices[0].message.content.trim();

    // Determine output type based on mode for proper coloring
    const explanationType = mode === "2025" ? "ai" : "success";

    // Clean, conversational display
    addOutput("", "output");
    addOutput(`💬 ${getPersonalityName(mode)}:`, explanationType);
    addOutput("", "output");

    // Display the explanation with natural flow
    addOutput(explanation, explanationType);
    addOutput("", "output");
  } catch (error) {
    addOutput(`Explanation Error: ${error.message}`, "error");
    console.error("Explain Command Error:", error);
  }

  setIsProcessing(false);
};

const getPersonalityName = (mode) => {
  return mode === "1972"
    ? "C-MASTER"
    : mode === "1985"
    ? "CPP-WIZARD"
    : "QUANTUM-Q";
};

const getExplanationPrompt = (mode) => {
  const basePersonalities = {
    1972: `You are C-MASTER, an AI from 1972 who explains code. Your style:
- Reference procedural programming concepts
- Mention "subroutines", "memory addresses", "pointers"
- Talk about efficiency in terms of "clock cycles" and "bytes saved"
- Use phrases like "back in my day" or "in the early computing era"
- Keep explanations clear but with vintage terminology
- You might reference "storing on magnetic tape" or "punch cards"`,

    1985: `You are CPP-WIZARD, an AI from 1985 who explains code. Your style:
- Reference object-oriented programming revolution
- Mention "encapsulation", "inheritance", "polymorphism"
- Talk about "the shift from procedural to OOP"
- Use phrases like "with modern OOP techniques" or "thanks to encapsulation"
- Reference "Bjarne Stroustrup's vision" occasionally
- Emphasize the benefits of classes and objects`,

    2025: `You are QUANTUM-Q, a modern AI who explains code. Your style:
- Reference modern programming practices
- Mention "clean code", "readability", "maintainability"
- Talk about "type safety", "pythonic idioms", "best practices"
- Use contemporary terminology naturally
- Reference modern concepts like "DRY principle", "separation of concerns"
- Keep it professional but approachable`,
  };

  return `${basePersonalities[mode]}

When explaining code:
1. Start with a high-level overview in 1-2 sentences
2. Break down the code step-by-step, explaining what each major section does
3. Use era-appropriate terminology and references
4. Be clear and educational, but maintain your era's personality
5. Keep explanations concise but thorough (3-5 paragraphs max)
6. Add a brief note about what the code accomplishes at the end

Format your explanation in clear paragraphs, not bullet points.`;
};

const handleExportCode = (code, currentLanguage, addOutput) => {
  if (!code || code.trim() === "") {
    addOutput("Error: No code to export", "error");
    return;
  }

  try {
    const extensions = {
      C: ".c",
      "C++": ".cpp",
      Python: ".py",
      JavaScript: ".js",
      Java: ".java",
    };
    const extension = extensions[currentLanguage] || ".txt";

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const filename = `codecrt_${timestamp}${extension}`;

    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);

    addOutput(`💾 Code exported as: ${filename}`, "success");
    addOutput(`📄 File type: ${currentLanguage}${extension}`, "system");
    addOutput(
      `📊 Size: ${code.length} bytes, ${code.split("\n").length} lines`,
      "system"
    );
  } catch (error) {
    addOutput(`Export error: ${error.message}`, "error");
  }
};

const handleDebugCommand = async (
  mode,
  code,
  addOutput,
  setIsProcessing,
  setCode,
  setCurrentLanguage,
  setLanguageId
) => {
  if (!window.lastExecutionError) {
    addOutput("No errors detected!", "success");
    addOutput("💡 Run code first to capture errors", "system");
    return;
  }

  if (!window.lastErrorCode || window.lastErrorCode !== code) {
    addOutput("⚠️  Code has changed since last error", "error");
    addOutput("💡 Run the code again to get current errors", "system");
    return;
  }

  setIsProcessing(true);

  const language = mode === "1972" ? "C" : mode === "1985" ? "C++" : "Python";
  const languageId = mode === "1972" ? 50 : mode === "1985" ? 54 : 71;

  addOutput("🔧 AI Debugger analyzing error...", "system");
  addOutput("", "output");

  try {
    const fixedCode = await debugCodeWithAI(
      code,
      window.lastExecutionError,
      mode
    );
    const cleanedCode = cleanPythonCode(fixedCode);

    addOutput("┌─────────────────────────────────────┐", "system");
    addOutput(`🛠️  Fixed ${language} Code:`, "system");
    addOutput("└─────────────────────────────────────┘", "system");

    const lines = cleanedCode.split("\n");
    lines.forEach((line, index) => {
      const lineNum = String(index + 1).padStart(3, " ");
      addOutput(`${lineNum} | ${line}`, "code");
    });

    addOutput("┌─────────────────────────────────────┐", "system");
    addOutput("✅ Fixed code ready!", "success");
    addOutput('💾 Type "insert" to replace editor code', "success");
    addOutput('🚀 Or type "run" to test the fix', "system");

    window.lastAICode = cleanedCode;
    window.lastAILanguage = language;
    window.lastAILanguageId = languageId;

    window.lastExecutionError = null;
    window.lastErrorCode = null;
  } catch (error) {
    addOutput(`Debug Error: ${error.message}`, "error");
  }

  setIsProcessing(false);
};

const handleAICommand = async (
  prompt,
  mode,
  addOutput,
  setIsProcessing,
  code,
  setCurrentLanguage,
  setLanguageId
) => {
  setIsProcessing(true);

  const language = mode === "1972" ? "C" : mode === "1985" ? "C++" : "Python";
  const languageId = mode === "1972" ? 50 : mode === "1985" ? 54 : 71;

  addOutput(`> AI generating ${language} code...`, "system");

  try {
    let fullPrompt = prompt;

    const defaultCodes = [
      '# Write your code here\nprint("Hello from the future!")',
      '/* Write your C code here */\n#include <stdio.h>\n\nint main() {\n    printf("Hello from 1972!\\n");\n    return 0;\n}',
    ];

    if (code && code.trim() && !defaultCodes.includes(code)) {
      fullPrompt = `Current code in editor:
\`\`\`
${code}
\`\`\`

User request: ${prompt}

Please provide updated or new ${language} code based on the current code and the user's request.`;
    }

    const aiResponse = await callClaudeAPI(fullPrompt, mode);
    const cleanedCode = cleanPythonCode(aiResponse);

    addOutput("┌─────────────────────────────────────┐", "system");
    addOutput(`Generated ${language} Code:`, "system");
    addOutput("└─────────────────────────────────────┘", "system");

    const lines = cleanedCode.split("\n");
    lines.forEach((line, index) => {
      const lineNum = String(index + 1).padStart(3, " ");
      addOutput(`${lineNum} | ${line}`, "code");
    });

    addOutput("┌─────────────────────────────────────┐", "system");
    addOutput('💾 Type "insert" to add this code to the editor', "success");
    addOutput('🚀 Type "evolve" to see it through different eras!', "success");

    window.lastAICode = cleanedCode;
    window.lastAILanguage = language;
    window.lastAILanguageId = languageId;
  } catch (error) {
    addOutput(`AI Error: ${error.message}`, "error");
  }

  setIsProcessing(false);
};

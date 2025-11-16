import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Editor from "./components/Editor";
import Terminal from "./components/Terminal";
import StatusBar from "./components/StatusBar";
import BootScreen from "./components/BootScreen";
import CodeEvolution from "./components/CodeEvolution";
import FossilUploadZone from "./components/FossilUploadZone";
import FossilAnalysisView from "./components/FossilAnalysisView";
import { handleCommand, revealSolution } from "./utils/commandHandler";
import { executeCode as apiExecuteCode } from "./services/apiService";
import { analyzeCode } from "./services/fossilService";
import { BOOT_SEQUENCE } from "./config/api";
import "./styles/crt-effects.css";

const App = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // App mode: "crt" or "fossil"
  const [appMode, setAppMode] = useState("crt");

  // CRT mode state
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const [code, setCode] = useState(
    '/* Write your C code here */\n#include <stdio.h>\n\nint main() {\n    printf("Hello from 1972!\\n");\n    return 0;\n}'
  );
  const [currentLanguage, setCurrentLanguage] = useState("C");
  const [languageId, setLanguageId] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState("1972");
  const [showEvolution, setShowEvolution] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [challengeTimer, setChallengeTimer] = useState(0);
  const [challengeAttempts, setChallengeAttempts] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  // AI Pair Programmer state
  const [aiPairEnabled, setAiPairEnabled] = useState(false);

  // Fossil mode state
  const [fossilMode, setFossilMode] = useState("upload");
  const [fossilStatus, setFossilStatus] = useState("ready");
  const [fossilProgress, setFossilProgress] = useState(0);
  const [originalCode, setOriginalCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [fossilError, setFossilError] = useState(null);

  const isRetro = mode === "1972" || mode === "1985";
  const is1972 = mode === "1972";
  const is2025 = mode === "2025";
  const isCRT = appMode === "crt";

  // Boot sequence animation
  useEffect(() => {
    let i = 0;
    const bootInterval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        setBootText((prev) => [...prev, BOOT_SEQUENCE[i]]);
        i++;
      } else {
        clearInterval(bootInterval);
        setTimeout(() => setIsBooting(false), 1000);
      }
    }, 200);
    return () => clearInterval(bootInterval);
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set data-mode attribute for CSS styling
  useEffect(() => {
    document.body.setAttribute("data-mode", mode);
    return () => document.body.removeAttribute("data-mode");
  }, [mode]);

  // Challenge timer countdown
  useEffect(() => {
    if (challenge && challengeTimer > 0) {
      const timer = setInterval(() => {
        setChallengeTimer((prev) => {
          if (prev <= 1) {
            revealSolution(
              challenge,
              addOutput,
              setChallenge,
              setChallengeTimer,
              setChallengeAttempts
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [challenge, challengeTimer]);

  // Random screen glitches for retro modes
  useEffect(() => {
    if (!isRetro || showEvolution || showMatrix || !isCRT) return;

    const triggerGlitch = () => {
      if (Math.random() < 0.05) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }
    };

    const glitchInterval = setInterval(triggerGlitch, 1000);
    return () => clearInterval(glitchInterval);
  }, [isRetro, showEvolution, showMatrix, isCRT]);

  // Matrix mode effect
  useEffect(() => {
    if (!showMatrix) return;

    const timeout = setTimeout(() => {
      const canvas = document.getElementById("matrix-canvas");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();

      window.addEventListener("resize", resizeCanvas);

      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>/\\|";
      const fontSize = 16;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = [];

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
      }

      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillText(text, x, y);

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      };

      const interval = setInterval(draw, 33);
      const autoStop = setTimeout(() => setShowMatrix(false), 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(autoStop);
        window.removeEventListener("resize", resizeCanvas);
      };
    }, 100);

    return () => clearTimeout(timeout);
  }, [showMatrix]);

  // Escape key handlers
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showEvolution) setShowEvolution(false);
      if (e.key === "Escape" && showMatrix) setShowMatrix(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showEvolution, showMatrix]);

  const addOutput = (text, type = "output") => {
    setOutput((prev) => [...prev, { text, type, timestamp: new Date() }]);
  };

  const handleCommandSubmit = async () => {
    if (!command.trim() || isProcessing) return;

    const result = await handleCommand(
      command,
      {
        mode,
        code,
        currentTime,
        languageId,
        currentLanguage,
        challenge,
        challengeAttempts,
      },
      {
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
      }
    );

    if (result === "clear") {
      setOutput([]);
    }

    setCommand("");
  };

  const handleExecuteCode = async () => {
    if (!code.trim()) {
      addOutput("Error: No code to execute", "error");
      return;
    }

    setIsProcessing(true);
    addOutput(`> Executing ${currentLanguage} code...`, "system");

    try {
      const result = await apiExecuteCode(code, languageId);

      if (result.stdout) {
        addOutput(result.stdout, "success");

        if (challenge) {
          addOutput("", "output");
          addOutput("🔍 Verifying solution with AI...", "system");
        }
      } else if (result.stderr) {
        addOutput(result.stderr, "error");
      } else if (result.compile_output) {
        addOutput(result.compile_output, "error");
      } else {
        addOutput("Code executed successfully (no output)", "success");
      }
    } catch (error) {
      addOutput(`Execution error: ${error.message}`, "error");
    }

    setIsProcessing(false);
  };

  const handleToggleMode = () => {
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
  };

  const handleInsertEvolutionCode = (evolutionCode, language, judge0_id) => {
    setCode(evolutionCode);
    setCurrentLanguage(language);
    setLanguageId(judge0_id);

    let newMode;
    if (language === "C") {
      newMode = "1972";
    } else if (language === "C++") {
      newMode = "1985";
    } else if (language === "Python") {
      newMode = "2025";
    }

    if (newMode && newMode !== mode) {
      setMode(newMode);
    }

    addOutput(`✅ ${language} code inserted into editor!`, "success");
    addOutput(`🔄 Switched to ${newMode} mode (${language})`, "system");
  };

  // Fossil handlers
  const handleFileUpload = async (file) => {
    setFossilError(null);
    setFossilStatus("processing");
    setFossilProgress(20);

    try {
      const text = await file.text();
      setOriginalCode(text);
      setFossilProgress(40);

      const result = await analyzeCode(text, file.name);
      setFossilProgress(80);

      setAnalysis(result);
      setFossilProgress(100);
      setFossilStatus("complete");
      setFossilMode("analysis");
    } catch (err) {
      setFossilError(`⚠️ EXCAVATION FAILED: ${err.message}`);
      setFossilStatus("error");
      console.error("Analysis error:", err);
    }
  };

  const handleSampleCode = async () => {
    setFossilError(null);
    setFossilStatus("processing");
    setFossilProgress(20);

    const SAMPLE_COBOL = `       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYROLL-CALC.
       AUTHOR. LEGACY-SYSTEMS-DEPT.
       DATE-WRITTEN. 1978-03-15.
       
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 EMPLOYEE-RECORD.
          05 EMP-ID           PIC 9(6).
          05 EMP-NAME         PIC X(30).
          05 HOURLY-RATE      PIC 9(3)V99.
          05 HOURS-WORKED     PIC 9(3).
          05 GROSS-PAY        PIC 9(5)V99.
       
       PROCEDURE DIVISION.
       MAIN-LOGIC.
           ACCEPT EMP-ID.
           ACCEPT HOURLY-RATE.
           ACCEPT HOURS-WORKED.
           
           COMPUTE GROSS-PAY = HOURLY-RATE * HOURS-WORKED.
           DISPLAY "GROSS PAY: $" GROSS-PAY.
           STOP RUN.`;

    try {
      setOriginalCode(SAMPLE_COBOL);
      setFossilProgress(40);

      const result = await analyzeCode(SAMPLE_COBOL, "payroll.cob");
      setFossilProgress(80);

      setAnalysis(result);
      setFossilProgress(100);
      setFossilStatus("complete");
      setFossilMode("analysis");
    } catch (err) {
      setFossilError(`⚠️ EXCAVATION FAILED: ${err.message}`);
      setFossilStatus("error");
    }
  };

  const handleDownload = (code, ext) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modernized_code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewAnalysis = () => {
    setFossilMode("upload");
    setAnalysis(null);
    setOriginalCode("");
    setFossilStatus("ready");
    setFossilProgress(0);
    setFossilError(null);
  };

  const handleModeSwitch = () => {
    setAppMode(appMode === "crt" ? "fossil" : "crt");
  };

  const handleToggleAIPair = () => {
    setAiPairEnabled(!aiPairEnabled);
    if (!aiPairEnabled) {
      addOutput("🤖 AI Pair Programmer activated!", "success");
      addOutput("💡 I'll suggest improvements as you code", "system");
    } else {
      addOutput("🤖 AI Pair Programmer deactivated", "system");
    }
  };

  if (isBooting) {
    return <BootScreen bootText={bootText} />;
  }

  return (
    <div
      className={`w-full h-screen ${
        isCRT ? (isRetro ? "bg-black" : "bg-gray-900") : "bg-black"
      } flex flex-col font-mono ${
        isCRT && isRetro && !showEvolution && !showMatrix
          ? `crt-screen${isGlitching ? " glitch-active" : ""}`
          : isCRT
          ? ""
          : "crt-screen"
      }`}
    >
      {isCRT && isRetro && !showEvolution && !showMatrix && (
        <div className="scanline" />
      )}
      {!isCRT && <div className="scanline-amber" />}

      <Header
        currentTime={currentTime}
        mode={isCRT ? mode : "fossil"}
        onToggleMode={isCRT ? handleToggleMode : null}
        isRetro={isRetro}
        is1972={is1972}
        currentLanguage={currentLanguage}
        appMode={appMode}
        onModeSwitch={handleModeSwitch}
      />

      {!isCRT && fossilError && (
        <div className="bg-red-900 text-red-200 px-6 py-3 text-xl border-b-2 border-red-600">
          {fossilError}
        </div>
      )}

      {isCRT ? (
        <>
          <div className="flex-1 flex overflow-hidden">
            <Editor
              code={code}
              onCodeChange={setCode}
              onExecute={handleExecuteCode}
              isProcessing={isProcessing}
              isRetro={isRetro}
              is1972={is1972}
              currentLanguage={currentLanguage}
              showEvolution={showEvolution}
              showMatrix={showMatrix}
              mode={mode}
              aiPairEnabled={aiPairEnabled}
              onToggleAIPair={handleToggleAIPair}
            />

            <Terminal
              output={output}
              command={command}
              onCommandChange={setCommand}
              onCommandSubmit={handleCommandSubmit}
              isProcessing={isProcessing}
              isRetro={isRetro}
              is1972={is1972}
              is2025={is2025}
              showEvolution={showEvolution}
              showMatrix={showMatrix}
            />
          </div>

          <StatusBar
            isProcessing={isProcessing}
            code={code}
            isRetro={isRetro}
            is1972={is1972}
            currentLanguage={currentLanguage}
            challenge={challenge}
            challengeTimer={challengeTimer}
            challengeAttempts={challengeAttempts}
          />

          {showEvolution && (
            <CodeEvolution
              code={code}
              onClose={() => setShowEvolution(false)}
              isRetro={isRetro}
              onInsertCode={handleInsertEvolutionCode}
            />
          )}

          {showMatrix && (
            <div
              className="fixed inset-0 z-50 pointer-events-none"
              style={{ background: "black" }}
            >
              <canvas id="matrix-canvas" className="w-full h-full" />
            </div>
          )}
        </>
      ) : (
        <>
          {fossilMode === "upload" ? (
            <FossilUploadZone
              onFileUpload={handleFileUpload}
              onSampleCode={handleSampleCode}
              isProcessing={fossilStatus === "processing"}
            />
          ) : (
            <FossilAnalysisView
              analysis={analysis}
              originalCode={originalCode}
              onNewAnalysis={handleNewAnalysis}
              onDownload={handleDownload}
            />
          )}
          <div className="bg-black text-amber-400 px-6 py-3 text-xl flex items-center justify-between border-t-2 border-amber-700">
            <div className="flex items-center gap-4">
              <span>STATUS: {fossilStatus.toUpperCase()}</span>
              {fossilStatus === "processing" && (
                <span>PROGRESS: {fossilProgress}%</span>
              )}
            </div>
            <span>POWERED BY AI</span>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

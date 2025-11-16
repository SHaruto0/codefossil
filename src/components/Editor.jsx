import React, { useState, useEffect, useRef } from "react";
import { Code, Zap, Download, Lightbulb, X } from "lucide-react";
import { suggestImprovements } from "../services/apiService";

const Editor = ({
  code,
  onCodeChange,
  onExecute,
  isProcessing,
  isRetro,
  is1972,
  currentLanguage,
  showEvolution,
  showMatrix,
  mode,
  aiPairEnabled,
  onToggleAIPair,
}) => {
  const textareaRef = React.useRef(null);
  const [history, setHistory] = React.useState([code]);
  const [historyIndex, setHistoryIndex] = React.useState(0);

  // AI Pair Programmer state
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const suggestionTimeoutRef = useRef(null);
  const lastCodeRef = useRef(code);

  // Update history when code changes externally
  React.useEffect(() => {
    if (code !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(code);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [code]);

  // AI Pair Programmer: Debounced suggestions
  useEffect(() => {
    if (!aiPairEnabled || !code || code.trim().length < 20) {
      setAiSuggestion(null);
      return;
    }

    // Don't suggest for default code
    const defaultCodes = [
      '# Write your code here\nprint("Hello from the future!")',
      '/* Write your C code here */\n#include <stdio.h>\n\nint main() {\n    printf("Hello from 1972!\\n");\n    return 0;\n}',
    ];

    if (defaultCodes.includes(code)) {
      return;
    }

    // Clear previous timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Only trigger if code actually changed significantly
    if (lastCodeRef.current === code) {
      return;
    }

    lastCodeRef.current = code;

    // Wait 3 seconds after user stops typing
    suggestionTimeoutRef.current = setTimeout(async () => {
      setIsLoadingSuggestion(true);
      try {
        const suggestion = await suggestImprovements(code, mode);
        if (suggestion) {
          setAiSuggestion(suggestion);
        }
      } catch (error) {
        console.error("AI Pair suggestion error:", error);
      } finally {
        setIsLoadingSuggestion(false);
      }
    }, 3000);

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [code, aiPairEnabled, mode]);

  const handleCodeChange = (newCode) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onCodeChange(newCode);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onCodeChange(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onCodeChange(history[newIndex]);
    }
  };

  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "z" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleUndo();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      handleRedo();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      handleRedo();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tabChar = "    ";
      const newValue = code.substring(0, start) + tabChar + code.substring(end);
      handleCodeChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + tabChar.length;
      }, 0);
    }
  };

  const getFileExtension = () => {
    const extensions = {
      C: ".c",
      Python: ".py",
      JavaScript: ".js",
      Java: ".java",
      "C++": ".cpp",
    };
    return extensions[currentLanguage] || ".txt";
  };

  const handleDownload = () => {
    if (!code || code.trim() === "") return;

    const extension = getFileExtension();
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
  };

  return (
    <div
      className={`flex-1 flex flex-col border-r-2 ${
        is1972
          ? "border-gray-700"
          : isRetro
          ? "border-green-500"
          : "border-gray-700"
      } relative`}
    >
      {isRetro && !showEvolution && !showMatrix && <div className="scanline" />}
      {is1972 && !showEvolution && !showMatrix && <div className="scanline" />}

      <div
        className={`${
          is1972
            ? "bg-black text-gray-400"
            : isRetro
            ? "bg-green-950 text-green-400"
            : "bg-gray-800 text-gray-300"
        } px-4 py-3 flex items-center gap-2 border-b ${
          is1972
            ? "border-gray-700"
            : isRetro
            ? "border-green-500"
            : "border-gray-700"
        }`}
      >
        <Code className="w-6 h-6" />
        <span className="text-2xl">EDITOR{getFileExtension()}</span>
        <span className="text-lg ml-auto opacity-70">[{currentLanguage}]</span>

        {/* AI Pair Toggle */}
        <button
          onClick={onToggleAIPair}
          className={`ml-4 px-3 py-1 text-sm rounded transition-all flex items-center gap-2 ${
            aiPairEnabled
              ? "bg-purple-600 text-white"
              : is1972
              ? "bg-gray-700 text-gray-400"
              : isRetro
              ? "bg-green-800 text-green-400"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {aiPairEnabled ? "AI PAIR: ON" : "AI PAIR: OFF"}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-hidden relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full h-full ${
            is1972
              ? "text-gray-300"
              : isRetro
              ? "text-green-400"
              : "text-gray-100"
          } text-lg leading-relaxed resize-none bg-transparent border-none outline-none overflow-auto`}
          spellCheck="false"
          style={{ minHeight: "100%" }}
        />

        {/* AI Pair Suggestion Overlay */}
        {aiPairEnabled && (aiSuggestion || isLoadingSuggestion) && (
          <div
            className={`absolute bottom-4 right-4 max-w-md p-4 rounded-lg shadow-lg border-2 ${
              is1972
                ? "bg-gray-900 border-gray-600 text-gray-300"
                : isRetro
                ? "bg-green-950 border-green-500 text-green-400"
                : "bg-purple-900 border-purple-500 text-purple-200"
            } animate-fadeIn`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-bold">
                  {isLoadingSuggestion ? "AI THINKING..." : "AI SUGGESTS:"}
                </span>
              </div>
              <button
                onClick={() => setAiSuggestion(null)}
                className="opacity-70 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {isLoadingSuggestion ? (
              <div className="text-xs animate-pulse">
                Analyzing your code...
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap">{aiSuggestion}</div>
            )}
          </div>
        )}
      </div>

      <div
        className={`${
          is1972
            ? "bg-black text-gray-400"
            : isRetro
            ? "bg-green-950 text-green-400"
            : "bg-gray-800 text-gray-300"
        } px-4 py-4 border-t ${
          is1972
            ? "border-gray-700"
            : isRetro
            ? "border-green-500"
            : "border-gray-700"
        } flex gap-3`}
      >
        <button
          onClick={handleUndo}
          disabled={historyIndex === 0}
          className={`flex items-center gap-2 px-4 py-3 text-xl ${
            is1972
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : isRetro
              ? "bg-green-800 hover:bg-green-700"
              : "bg-gray-700 hover:bg-gray-600"
          } rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Undo (Ctrl+Z)"
        >
          UNDO
        </button>

        <button
          onClick={handleRedo}
          disabled={historyIndex === history.length - 1}
          className={`flex items-center gap-2 px-4 py-3 text-xl ${
            is1972
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : isRetro
              ? "bg-green-800 hover:bg-green-700"
              : "bg-gray-700 hover:bg-gray-600"
          } rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
        >
          REDO
        </button>

        <button
          onClick={onExecute}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-5 py-3 text-xl ${
            is1972
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : isRetro
              ? "bg-green-700 hover:bg-green-600"
              : "bg-blue-600 hover:bg-blue-500"
          } rounded transition-colors disabled:opacity-50 glow`}
        >
          <Zap className="w-5 h-5" />
          {isProcessing
            ? "PROCESSING..."
            : `RUN ${currentLanguage.toUpperCase()}`}
        </button>

        <button
          onClick={handleDownload}
          disabled={!code || code.trim() === ""}
          className={`flex items-center gap-2 px-5 py-3 text-xl ${
            is1972
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : isRetro
              ? "bg-green-800 hover:bg-green-700"
              : "bg-gray-700 hover:bg-gray-600"
          } rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Download code"
        >
          <Download className="w-5 h-5" />
          SAVE
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Editor;

import React, { useState, useEffect, useRef } from "react";
import { Clock, Zap, Loader, Code2 } from "lucide-react";
import { API_CONFIG } from "../config/api";

const CodeEvolution = ({ code, onClose, isRetro, onInsertCode }) => {
  const [timeline, setTimeline] = useState([]);
  const [currentEra, setCurrentEra] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const hasStartedRef = useRef(false);

  const ERAS = [
    {
      year: 1972,
      name: "Procedural Era",
      language: "C",
      judge0_id: 50,
      color: "text-gray-300",
      bgColor: "bg-gray-900/30",
      codeColor: "text-gray-400",
      prompt:
        "Rewrite this code in MINIMAL C (1972 style). CRITICAL REQUIREMENTS: Keep it under 25 lines total. Use ONLY basic procedural programming - simple functions, no complex logic. Add ONE brief comment about '64KB RAM' OR 'clock cycles'. Use printf for output (NO scanf). Use ONE hardcoded test value. Focus on the SIMPLEST possible implementation. Strip out any unnecessary code. KEEP IT EXTREMELY SHORT AND SIMPLE.",
      icon: "💾",
    },
    {
      year: 1985,
      name: "Object-Oriented Era",
      language: "C++",
      judge0_id: 54,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      codeColor: "text-green-400",
      prompt:
        "Rewrite this code in MINIMAL C++ (1985 style). CRITICAL REQUIREMENTS: Keep it under 30 lines total. Use ONE simple class with 2-3 basic methods maximum. Add ONE brief comment about 'encapsulation' OR 'OOP'. Use cout for output (NO cin). Use #include <iostream> and std::cout. Use ONE hardcoded test value in main(). Focus on demonstrating basic OOP without complexity. KEEP IT EXTREMELY SHORT AND SIMPLE.",
      icon: "🔧",
    },
    {
      year: 2025,
      name: "Modern Era",
      language: "Python",
      judge0_id: 71,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      codeColor: "text-white",
      prompt:
        "Rewrite this code in MINIMAL Python (modern style). CRITICAL REQUIREMENTS: Keep it under 20 lines total. Use the SIMPLEST, cleanest approach possible. Add ONE brief comment about 'pythonic' OR 'clean code'. NO input() - use ONE hardcoded test value. No complex features - just clean, readable Python. Strip everything to bare essentials. KEEP IT EXTREMELY SHORT AND SIMPLE.",
      icon: "🚀",
    },
  ];

  useEffect(() => {
    if (code && code.trim() && !hasStartedRef.current) {
      hasStartedRef.current = true;
      generateEvolution();
    }
  }, []);

  const generateEvolution = async () => {
    setIsGenerating(true);
    setError(null);
    setTimeline([]);
    setCurrentEra(0);

    try {
      for (let i = 0; i < ERAS.length; i++) {
        const era = ERAS[i];

        setCurrentEra(i);
        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log(
          `🔄 Generating era ${i + 1}/${ERAS.length}: ${era.year} (${
            era.language
          })`
        );

        const response = await fetch(API_CONFIG.OPENROUTER_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "CodeCRT",
          },
          body: JSON.stringify({
            model: API_CONFIG.MODEL,
            messages: [
              {
                role: "user",
                content: `${era.prompt}

Original code (may be in a different language - translate it):
\`\`\`
${code}
\`\`\`

CRITICAL: Return ONLY ${era.language} code, no explanations, no markdown backticks, no preamble. Just raw executable ${era.language} code.`,
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
        let evolvedCode = data.choices[0].message.content;

        // Clean up markdown
        evolvedCode = evolvedCode
          .replace(/```[a-z]*\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        console.log(`✅ Era ${i + 1} complete: ${era.year}`);

        setTimeline((prev) => [
          ...prev,
          {
            year: era.year,
            name: era.name,
            language: era.language,
            judge0_id: era.judge0_id,
            code: evolvedCode,
            color: era.color,
            bgColor: era.bgColor,
            codeColor: era.codeColor,
            icon: era.icon,
          },
        ]);

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      console.log("🎉 Evolution complete!");
    } catch (err) {
      console.error("❌ Evolution error:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = (eraCode, language, judge0_id) => {
    onInsertCode(eraCode, language, judge0_id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="w-11/12 h-5/6 bg-gray-800 border-gray-600 border-4 rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-700 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-600">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <span className="text-2xl font-bold">CODE TIME MACHINE</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded transition-colors text-xl"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="bg-gray-700 px-6 py-3 border-b-2 border-gray-600">
            <div className="flex items-center gap-3">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="text-lg text-white">
                Generating {ERAS[currentEra]?.name} (
                {ERAS[currentEra]?.language})... ({currentEra + 1}/{ERAS.length}
                )
              </span>
            </div>
            <div className="w-full bg-gray-600 h-2 mt-2 rounded">
              <div
                className="h-full bg-blue-500 transition-all duration-500 rounded"
                style={{ width: `${((currentEra + 1) / ERAS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 text-red-300 px-6 py-3 border-b-2 border-red-500">
            <span className="text-lg">⚠️ Error: {error}</span>
          </div>
        )}

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-900">
          {timeline.length === 0 && !isGenerating && (
            <div className="text-center text-gray-400 text-xl mt-20">
              <Zap className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <p>Initializing time travel sequence...</p>
              <p className="text-lg mt-2">
                1972 (C) → 1985 (C++) → 2025 (Python)
              </p>
            </div>
          )}

          {timeline.map((era, index) => (
            <div
              key={`${era.year}-${index}`}
              className={`${era.bgColor} border-2 border-gray-600 rounded-lg p-5 animate-fadeIn`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Era Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{era.icon}</span>
                  <div>
                    <div className={`text-2xl font-bold ${era.color}`}>
                      {era.year} - {era.name}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Code2 className="w-4 h-4" />
                      Language: {era.language} • Era {index + 1} of{" "}
                      {ERAS.length}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleInsert(era.code, era.language, era.judge0_id)
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors text-lg flex items-center gap-2 text-white"
                >
                  <Zap className="w-4 h-4" />
                  INSERT
                </button>
              </div>

              {/* Code Display */}
              <pre
                className={`${era.codeColor} text-base overflow-x-auto p-4 bg-black/50 rounded border border-gray-700`}
              >
                <code>{era.code}</code>
              </pre>

              {/* Line Count */}
              <div className="mt-3 text-sm text-gray-400">
                {era.code.split("\n").length} lines • {era.code.length}{" "}
                characters • {era.language}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CodeEvolution;

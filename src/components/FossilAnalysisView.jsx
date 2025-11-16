import React, { useState } from "react";
import {
  Upload,
  Download,
  History,
  Zap,
  Shield,
  BookOpen,
  Bug,
  Code2,
} from "lucide-react";

const FossilAnalysisView = ({
  analysis,
  originalCode,
  onNewAnalysis,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!analysis) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-amber-900 border-b-2 border-amber-700 px-6 py-3 flex gap-2">
        {["overview", "translation", "security", "history", "original"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-xl font-bold transition-colors ${
                activeTab === tab
                  ? "bg-amber-700 text-black"
                  : "bg-amber-900/50 text-amber-300 hover:bg-amber-800"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          )
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 bg-black/50">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="border-4 border-amber-600 bg-amber-900/20 p-6">
              <h3 className="text-3xl text-amber-400 mb-4 flex items-center gap-3">
                <History className="w-8 h-8" />
                ARTIFACT ANALYSIS
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xl text-amber-200">
                <div>
                  <span className="text-amber-500">LANGUAGE:</span>{" "}
                  <span className="text-amber-300 font-bold">
                    {analysis.language}
                  </span>
                </div>
                <div>
                  <span className="text-amber-500">ERA:</span>{" "}
                  <span className="text-amber-300 font-bold">
                    {analysis.era}
                  </span>
                </div>
                <div>
                  <span className="text-amber-500">LINES:</span>{" "}
                  <span className="text-amber-300 font-bold">
                    {analysis.linesOfCode}
                  </span>
                </div>
                <div>
                  <span className="text-amber-500">COMPLEXITY:</span>{" "}
                  <span className="text-amber-300 font-bold">
                    {analysis.complexity}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-4 border-amber-600 bg-amber-900/20 p-6">
              <h3 className="text-2xl text-amber-400 mb-3">📋 SUMMARY</h3>
              <p className="text-xl text-amber-200 leading-relaxed whitespace-pre-wrap">
                {analysis.summary}
              </p>
            </div>
          </div>
        )}

        {activeTab === "translation" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-3xl text-amber-400 flex items-center gap-3">
                <Zap className="w-8 h-8" />
                MODERNIZED CODE
              </h3>
              <button
                onClick={() => onDownload(analysis.modernCode, "py")}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-black font-bold text-xl flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                DOWNLOAD
              </button>
            </div>
            <div className="bg-gray-900 border-2 border-amber-600 p-4">
              <pre className="text-lg text-amber-100 overflow-x-auto">
                <code>{analysis.modernCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h3 className="text-3xl text-amber-400 flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              SECURITY ANALYSIS
            </h3>

            {analysis.vulnerabilities?.length > 0 ? (
              analysis.vulnerabilities.map((vuln, idx) => (
                <div
                  key={idx}
                  className="border-4 border-red-600 bg-red-900/20 p-6"
                >
                  <div className="flex items-start gap-4">
                    <Bug className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-2xl text-red-400 font-bold mb-2">
                        {vuln.type}
                      </h4>
                      <p className="text-xl text-red-200 mb-3">
                        {vuln.description}
                      </p>
                      <div className="bg-black/50 p-4 rounded">
                        <p className="text-lg text-amber-300">
                          <span className="text-amber-500 font-bold">
                            SEVERITY:
                          </span>{" "}
                          {vuln.severity}
                        </p>
                        <p className="text-lg text-amber-300 mt-2">
                          <span className="text-amber-500 font-bold">FIX:</span>{" "}
                          {vuln.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="border-4 border-green-600 bg-green-900/20 p-6">
                <p className="text-2xl text-green-400">
                  ✅ No vulnerabilities detected
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <h3 className="text-3xl text-amber-400 flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8" />
              HISTORICAL CONTEXT
            </h3>

            <div className="border-4 border-amber-600 bg-amber-900/20 p-6">
              <p className="text-xl text-amber-200 leading-relaxed whitespace-pre-wrap">
                {analysis.historicalContext}
              </p>
            </div>

            <div className="border-4 border-amber-600 bg-amber-900/20 p-6">
              <h4 className="text-2xl text-amber-400 mb-3">
                💡 INTERESTING FACTS
              </h4>
              <ul className="space-y-2 text-xl text-amber-200">
                {analysis.interestingFacts?.map((fact, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-amber-500">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "original" && (
          <div className="space-y-4">
            <h3 className="text-3xl text-amber-400 flex items-center gap-3 mb-4">
              <History className="w-8 h-8" />
              ORIGINAL ARTIFACT
            </h3>
            <div className="bg-gray-900 border-2 border-amber-600 p-4">
              <pre className="text-lg text-amber-100 overflow-x-auto">
                <code>{originalCode}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-900 border-t-2 border-amber-700 px-6 py-4 flex justify-between items-center">
        <button
          onClick={onNewAnalysis}
          className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-black font-bold text-xl flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          ANALYZE NEW ARTIFACT
        </button>
      </div>
    </div>
  );
};

export default FossilAnalysisView;

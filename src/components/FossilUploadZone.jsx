import React, { useState } from "react";
import {
  Upload,
  Zap,
  History,
  Shield,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const FossilUploadZone = ({ onFileUpload, onSampleCode, isProcessing }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <div
      className={`flex-1 flex items-center justify-center p-8 transition-all ${
        dragOver ? "bg-amber-900/30" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="text-center max-w-4xl mx-auto">
        {/* Centered Upload Icon */}
        <div className="flex justify-center mb-12">
          <Upload
            className={`w-32 h-32 text-amber-500 ${
              isProcessing ? "animate-bounce" : "animate-pulse"
            }`}
          />
        </div>

        <h2 className="text-5xl text-amber-400 mb-12 glow font-bold">
          EXCAVATION SITE READY
        </h2>
        <p className="text-3xl text-amber-300 mb-16 font-bold">
          Drop your legacy code artifacts here for analysis
        </p>

        <div className="h-3"></div>
        {/* Features with Arrow - Single Line Layout */}
        <div className="flex justify-center items-center gap-12 text-xl text-amber-200">
          {/* Legacy Languages - Single Line */}
          <div className="flex items-center gap-6 p-8 border-2 border-amber-700 bg-amber-900/20 rounded justify-center mx-4 w-96">
            <History className="w-12 h-12 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold mb-2 text-2xl">LEGACY CODE</div>
              <div className="text-xl">
                COBOL • Fortran • Pascal • BASIC • Assembly
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center mx-4">
            <ArrowRight className="w-16 h-16 text-amber-500 mb-2" />
            <div className="text-amber-400 font-bold text-xl">TO</div>
          </div>

          {/* Modern Output - Single Line */}
          <div className="flex items-center gap-6 p-8 border-2 border-amber-700 bg-amber-900/20 rounded justify-center mx-4 w-96">
            <Zap className="w-12 h-12 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold mb-2 text-2xl">MODERN CODE</div>
              <div className="text-xl">
                Python • Rust • JavaScript • TypeScript
              </div>
            </div>
          </div>
        </div>

        {/* Spacing between rows */}
        <div className="h-5"></div>

        {/* Bottom Features Row */}
        <div className="flex justify-center gap-12 text-xl text-amber-200">
          <div className="flex items-center gap-6 justify-center p-8 border-2 border-amber-700 bg-amber-900/20 rounded mx-4 w-80">
            <Shield className="w-10 h-10 flex-shrink-0" />
            <span className="text-xl">Security Vulnerability Detection</span>
          </div>
          <div className="flex items-center gap-6 justify-center p-8 border-2 border-amber-700 bg-amber-900/20 rounded mx-4 w-80">
            <BookOpen className="w-10 h-10 flex-shrink-0" />
            <span className="text-xl">Historical Context & Documentation</span>
          </div>
        </div>

        {/* Spacing between rows */}
        <div className="h-5"></div>

        {/* Action Buttons with more spacing */}
        <div className="flex gap-10 justify-center mx-4">
          <label className="inline-block">
            <input
              type="file"
              className="hidden"
              accept=".cob,.cbl,.for,.f,.pas,.bas,.asm,.s,.c,.cpp,.java,.txt"
              onChange={(e) =>
                e.target.files[0] && onFileUpload(e.target.files[0])
              }
              disabled={isProcessing}
            />
            <div className="px-12 py-6 bg-amber-700 hover:bg-amber-600 text-black font-bold text-3xl cursor-pointer inline-flex items-center gap-4 border-4 border-amber-500 transition-all rounded-lg shadow-lg hover:scale-105 transform disabled:opacity-50 w-80 justify-center">
              <Upload className="w-8 h-8" />
              {isProcessing ? "EXCAVATING..." : "BEGIN EXCAVATION"}
            </div>
          </label>

          <button
            onClick={onSampleCode}
            disabled={isProcessing}
            className="px-12 py-6 bg-green-700 hover:bg-green-600 text-black font-bold text-3xl inline-flex items-center gap-4 border-4 border-green-500 transition-all disabled:opacity-50 rounded-lg shadow-lg hover:scale-105 transform w-80 justify-center"
          >
            <Zap className="w-8 h-8" />
            TRY EXAMPLE
          </button>
        </div>

        {/* Spacing between rows */}
        <div className="h-2"></div>

        <p className="text-amber-500 text-2xl font-bold animate-pulse mx-4">
          📁 or drag and drop your file here
        </p>
      </div>
    </div>
  );
};

export default FossilUploadZone;

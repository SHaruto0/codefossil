import React from "react";
import {
  Terminal,
  Clock,
  Cpu,
  Code2,
  History,
  ArrowLeftRight,
} from "lucide-react";

const Header = ({
  currentTime,
  mode,
  onToggleMode,
  isRetro,
  is1972,
  currentLanguage,
  appMode,
  onModeSwitch,
}) => {
  const isCRT = appMode === "crt";
  const isFossil = appMode === "fossil";

  return (
    <div
      className={`${
        isFossil
          ? "bg-amber-900 text-amber-100 border-amber-700"
          : is1972
          ? "bg-black text-gray-400 border-gray-700"
          : isRetro
          ? "bg-green-950 text-green-400 border-green-500"
          : "bg-blue-600 text-white border-blue-400"
      } px-6 py-4 flex items-center justify-between border-b-4`}
    >
      {/* Left Side - Logo and Title */}
      <div className="flex items-center gap-4">
        {isFossil ? (
          <Code2 className="w-10 h-10" />
        ) : (
          <Terminal className="w-10 h-10" />
        )}
        <div>
          <span className="text-3xl font-bold glow block">
            {isFossil ? "CODEFOSSIL v1.0" : "CODECRT v1.0"}
          </span>
          <span className="text-lg opacity-75">
            {isFossil ? "// CODE ARCHAEOLOGY" : "// TIME MACHINE"}
          </span>
        </div>
      </div>

      {/* Right Side - Status and Controls */}
      <div className="flex items-center gap-6 text-xl">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6" />
          {currentTime.toLocaleTimeString()}
        </div>

        {isCRT && (
          <>
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6" />
              {currentLanguage}
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6" />
              MODE: {mode}
            </div>
            {onToggleMode && (
              <button
                onClick={onToggleMode}
                className={`px-5 py-2 text-xl ${
                  is1972
                    ? "bg-gray-800 hover:bg-gray-700 border-2 border-gray-500 text-gray-300"
                    : isRetro
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-blue-700 hover:bg-blue-600"
                } rounded transition-colors font-bold`}
              >
                TOGGLE
              </button>
            )}
          </>
        )}

        {/* BIG Mode Switch Button */}
        <button
          onClick={onModeSwitch}
          className={`px-8 py-3 text-2xl ${
            isFossil
              ? "bg-amber-700 hover:bg-amber-600 text-black border-4 border-amber-500"
              : is1972
              ? "bg-gray-800 hover:bg-gray-700 border-4 border-gray-500 text-gray-300"
              : isRetro
              ? "bg-green-700 hover:bg-green-600 border-4 border-green-500"
              : "bg-blue-700 hover:bg-blue-600 border-4 border-blue-400"
          } rounded-lg transition-all flex items-center gap-3 font-bold shadow-lg hover:scale-105 transform`}
        >
          {isCRT ? (
            <>
              <History className="w-7 h-7" />
              FOSSIL MODE
            </>
          ) : (
            <>
              <Terminal className="w-7 h-7" />
              CRT MODE
            </>
          )}
          <ArrowLeftRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;

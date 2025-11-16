import React from "react";
import { Power, Clock } from "lucide-react";

const StatusBar = ({
  isProcessing,
  code,
  isRetro,
  is1972,
  currentLanguage,
  challenge,
  challengeTimer,
  challengeAttempts,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (challengeTimer > 60) return "text-green-400";
    if (challengeTimer > 30) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div
      className={`${
        is1972
          ? "bg-black text-gray-400"
          : isRetro
          ? "bg-green-950 text-green-400"
          : "bg-gray-800 text-gray-400"
      } px-4 py-3 text-xl flex items-center justify-between border-t-2 ${
        is1972
          ? "border-gray-700"
          : isRetro
          ? "border-green-500"
          : "border-gray-700"
      }`}
    >
      <div className="flex items-center gap-4">
        <div>STATUS: {isProcessing ? "PROCESSING" : "READY"}</div>
        {challenge && (
          <div
            className={`flex items-center gap-2 ${getTimerColor()} font-bold animate-pulse`}
          >
            <Clock className="w-5 h-5" />
            ⏱️ CHALLENGE: {formatTime(challengeTimer)} | ATTEMPTS:{" "}
            {challengeAttempts}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div>LANG: {currentLanguage}</div>
        <div>LINES: {code.split("\n").length}</div>
        <div>AI: GROK CODE FAST 1</div>
        <div className="flex items-center gap-1">
          <Power className="w-5 h-5" />
          ONLINE
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

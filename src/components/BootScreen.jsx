import React from "react";

const BootScreen = ({ bootText }) => {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center font-mono transition-opacity duration-500">
      <div
        className="text-gray-300 text-lg space-y-2 p-8 crt-screen"
        data-mode="1972"
      >
        {bootText.map((line, i) => (
          <div
            key={i}
            className="boot-line"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {line}
          </div>
        ))}
        <div className="cursor-blink">█</div>
      </div>
    </div>
  );
};

export default BootScreen;

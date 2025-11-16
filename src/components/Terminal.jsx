import React, { useRef, useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

const Terminal = ({
  output,
  command,
  onCommandChange,
  onCommandSubmit,
  isProcessing,
  isRetro,
  is1972,
  showEvolution,
  showMatrix,
}) => {
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const [commandHistory, setCommandHistory] = React.useState([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [currentCommand, setCurrentCommand] = React.useState("");

  // Auto-scroll terminal to bottom when new output appears
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Auto-focus input on mount and after command submission
  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isProcessing, output]);

  const handleKeyDown = (e) => {
    console.log("Key pressed:", e.key); // Debug log

    if (e.key === "Enter" && !isProcessing) {
      if (command.trim()) {
        // Add command to history
        console.log("Adding to history:", command); // Debug log
        setCommandHistory((prev) => {
          const newHistory = [...prev, command];
          console.log("Command history:", newHistory); // Debug log
          return newHistory;
        });
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
      onCommandSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      console.log(
        "Arrow Up - History length:",
        commandHistory.length,
        "Current index:",
        historyIndex
      ); // Debug log

      if (commandHistory.length > 0) {
        if (historyIndex === -1) {
          // Save current command before navigating history
          setCurrentCommand(command);
          const newIndex = commandHistory.length - 1;
          console.log(
            "Setting index to:",
            newIndex,
            "Command:",
            commandHistory[newIndex]
          ); // Debug log
          setHistoryIndex(newIndex);
          onCommandChange(commandHistory[newIndex]);
        } else if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          console.log(
            "Moving back to index:",
            newIndex,
            "Command:",
            commandHistory[newIndex]
          ); // Debug log
          setHistoryIndex(newIndex);
          onCommandChange(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      console.log("Arrow Down - Current index:", historyIndex); // Debug log

      if (historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          console.log(
            "Moving forward to index:",
            newIndex,
            "Command:",
            commandHistory[newIndex]
          ); // Debug log
          setHistoryIndex(newIndex);
          onCommandChange(commandHistory[newIndex]);
        } else {
          // Back to current command
          console.log("Back to current command:", currentCommand); // Debug log
          setHistoryIndex(-1);
          onCommandChange(currentCommand);
        }
      }
    }
  };

  const getOutputColor = (type) => {
    if (is1972) {
      // 1972 mode: Gray scale colors
      switch (type) {
        case "command":
          return "text-gray-300";
        case "error":
          return "text-gray-500";
        case "success":
          return "text-gray-200";
        case "system":
          return "text-gray-400";
        case "ai":
          return "text-gray-300";
        case "code":
          return "text-gray-400";
        default:
          return "text-gray-400";
      }
    }

    // Retro/Modern color modes
    switch (type) {
      case "command":
        return isRetro ? "text-yellow-400" : "text-blue-400";
      case "error":
        return "text-red-500";
      case "success":
        return isRetro ? "text-green-400" : "text-purple-500";
      case "system":
        return isRetro ? "text-cyan-400" : "text-cyan-500";
      case "ai":
        return isRetro ? "text-green-400" : "text-purple-400";
      case "code":
        return isRetro ? "text-amber-300" : "text-blue-300";
      default:
        return isRetro ? "text-green-500" : "text-gray-300";
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
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
        <TerminalIcon className="w-6 h-6" />
        <span className="text-2xl">TERMINAL</span>
      </div>

      <div ref={terminalRef} className="flex-1 p-4 overflow-auto space-y-1">
        {output.map((item, i) => (
          <div
            key={i}
            className={`text-lg ${getOutputColor(item.type)}`}
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      <div
        className={`${
          is1972 ? "bg-black" : isRetro ? "bg-green-950" : "bg-gray-800"
        } px-4 py-4 border-t ${
          is1972
            ? "border-gray-700"
            : isRetro
            ? "border-green-500"
            : "border-gray-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`${
              is1972
                ? "text-gray-400"
                : isRetro
                ? "text-green-400"
                : "text-blue-400"
            } text-2xl glow`}
          >
            {">"}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => onCommandChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className={`flex-1 bg-transparent ${
              is1972
                ? "text-gray-300"
                : isRetro
                ? "text-green-400"
                : "text-gray-100"
            } text-xl border-none focus:outline-none`}
            placeholder="Type a command... (try 'help')"
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

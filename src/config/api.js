const isDevelopment = import.meta.env.DEV;
const API_BASE = isDevelopment ? "http://localhost:3001" : "";

export const API_CONFIG = {
  OPENROUTER_ENDPOINT: `${API_BASE}/api/openrouter`,
  EXECUTE_ENDPOINT: `${API_BASE}/api/execute`,
  MODEL: "x-ai/grok-code-fast-1",
};

export const BOOT_SEQUENCE = [
  "CODECRT SYSTEM v1.0",
  "Copyright (C) 1985-2025 RetroFuture Labs",
  "",
  "Initializing AI Coprocessor...",
  "Loading Neural Networks... OK",
  "Connecting to Grok Code Fast 1... OK",
  "Connecting to Piston Code Runner... OK",
  "Calibrating Flux Capacitor... OK",
  "",
  "READY.",
  'Type "help" for available commands',
  "",
];

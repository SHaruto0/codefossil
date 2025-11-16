export const API_CONFIG = {
  // Use proxy server instead of direct API calls
  // This keeps API keys SECURE on the backend
  OPENROUTER_ENDPOINT: "http://localhost:3001/api/openrouter",
  EXECUTE_ENDPOINT: "http://localhost:3001/api/execute",

  // Model selection - Grok Code Fast 1 (fast and cheap!)
  MODEL: "x-ai/grok-code-fast-1",

  // For production, change localhost to your deployed proxy URL:
  // OPENROUTER_ENDPOINT: "https://your-app.com/api/openrouter",
  // EXECUTE_ENDPOINT: "https://your-app.com/api/execute",
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

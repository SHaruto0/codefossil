# CodeCRT - Time-Traveling AI IDE

A revolutionary retro terminal IDE that enables coding across different programming eras with authentic historical constraints. Features AI-powered code generation, real-time code execution, and legacy code modernization capabilities.

## Project Overview

CodeCRT is a dual-mode development environment that combines educational programming history exploration with practical legacy code migration tools. The application simulates programming constraints from different decades while providing modern AI assistance.

## Core Features

### CRT Mode - Historical Programming Environment

**Era-Based Development**

- 1972 Mode: C programming with 4KB RAM constraints, procedural paradigm
- 1985 Mode: C++ with 64KB RAM, early object-oriented programming
- 2025 Mode: Modern Python with unlimited resources

**AI Integration**

- Real-time code generation using Grok Code Fast 1
- Era-appropriate AI personalities (C-MASTER, CPP-WIZARD, QUANTUM-Q)
- Contextual code explanations matching historical programming styles
- Automatic error detection and debugging assistance

**AI Pair Programmer**

- Debounced code analysis (3-second delay after typing stops)
- Non-intrusive suggestion overlay
- Toggle on/off capability
- Era-specific improvement recommendations

**Code Evolution System**

- Transforms code across three programming eras
- Side-by-side comparison of implementation approaches
- Interactive insertion of any era's code into editor
- Visual timeline showing language evolution

**Speed Coding Challenges**

- AI-generated random challenges with difficulty levels
- Timed competitions (120-180 seconds)
- Multiple submission attempts with AI verification
- Intelligent solution evaluation and hints
- Reference solution reveal

**Interactive Terminal**

- Full command-line interface with 20+ commands
- Command history with arrow key navigation
- Undo/redo functionality for code editing
- Export functionality for code files
- Easter eggs (matrix effect, coffee break)

### Fossil Mode - Legacy Code Archaeology

**Code Analysis**

- Automatic language detection (COBOL, Fortran, Pascal, BASIC, Assembly)
- Historical era identification
- Complexity analysis and metrics
- Purpose and functionality summary

**Modernization**

- Automatic translation to Python
- Security vulnerability detection
- Historical context documentation
- Migration strategy recommendations
- Interesting facts about the programming era

**Multi-Tab Interface**

- Overview: Language, era, complexity metrics
- Translation: Modern Python equivalent
- Security: Vulnerability analysis with severity ratings
- History: Historical context and interesting facts
- Original: Source code preservation

### Visual Effects

**Authentic CRT Experience**

- Scanline effects with synchronized animation
- Phosphor glow text rendering
- Screen flicker simulation
- Random glitch effects in retro modes
- Era-specific color palettes (grayscale for 1972, green for 1985, modern for 2025)

**Boot Sequence**

- Animated system initialization
- Period-appropriate startup messages
- Typing animation effects

## Project Structure

```
codecrt/
├── src/
│   ├── components/
│   │   ├── BootScreen.jsx           # System boot animation
│   │   ├── CodeEvolution.jsx        # Era transformation visualization
│   │   ├── Editor.jsx               # Code editor with AI pair programming
│   │   ├── FossilAnalysisView.jsx   # Legacy code analysis results
│   │   ├── FossilUploadZone.jsx     # File upload interface
│   │   ├── Header.jsx               # Navigation and mode switching
│   │   ├── StatusBar.jsx            # System status display
│   │   └── Terminal.jsx             # Command-line interface
│   ├── services/
│   │   ├── apiService.js            # OpenRouter and Piston API integration
│   │   └── fossilService.js         # Legacy code analysis logic
│   ├── utils/
│   │   └── commandHandler.js        # Terminal command processing
│   ├── config/
│   │   └── api.js                   # API configuration and boot sequence
│   ├── styles/
│   │   └── crt-effects.css          # CRT visual effects
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
├── server/
│   └── proxy.js                     # Backend proxy for API security
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                             # API keys (not in repository)
```

## API Integration

### OpenRouter (Grok Code Fast 1)

- Model: x-ai/grok-code-fast-1
- Purpose: Code generation, debugging, explanation, challenge creation
- Authentication: Bearer token via proxy server
- Endpoint: /api/openrouter (proxied)
- Features: Era-specific AI personalities, structured output parsing

### Piston API

- Purpose: Code execution for C, C++, and Python
- Cost: Free, no API key required
- Endpoint: https://emkc.org/api/v2/piston/execute (proxied through /api/execute)
- Language versions:
  - C: 10.2.0
  - C++: 10.2.0
  - Python: 3.10.0
- Response format: stdout, stderr, compile output, exit code

### Proxy Server Architecture

- Express.js server for API key security
- CORS handling for cross-origin requests
- Error handling and response transformation
- Health check endpoint
- Environment variable management
- Language ID mapping for compatibility

## Terminal Commands

### System Operations

- help: Display command reference
- clear: Clear terminal output
- toggle: Cycle through eras (1972 → 1985 → 2025)
- time: Display current date and time
- exit: Trigger system reboot

### Code Operations

- run: Execute code in editor
- export: Download code as file
- insert: Insert last AI-generated code into editor

### AI Operations

- ai [prompt]: Generate code based on prompt
- debug: AI-powered error fixing
- explain: Era-appropriate code explanation
- evolve: Trigger code evolution visualization

### Challenge System

- challenge: Start new speed coding challenge
- submit: Submit solution for verification
- giveup: End challenge and reveal solution

### Easter Eggs

- hello: Display "Hello World" in current era
- coffee: Coffee break message
- matrix: Matrix digital rain effect

## Technology Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

### Backend

- Express.js (proxy server)
- Node.js
- CORS middleware
- dotenv (environment variables)

### APIs

- OpenRouter (AI inference)
- Piston (code execution)

### Styling

- VT323 font (Google Fonts)
- Custom CRT effects
- CSS animations
- Responsive design

## Key Features Implementation

### AI Personality System

Three distinct AI personalities with era-appropriate responses:

- C-MASTER (1972): References procedural programming, memory constraints
- CPP-WIZARD (1985): Emphasizes OOP paradigms, encapsulation
- QUANTUM-Q (2025): Modern best practices, clean code principles

### Code Evolution Algorithm

1. Parse original code
2. Generate three versions via sequential API calls
3. Apply era-specific constraints in prompts
4. Clean markdown formatting from responses
5. Display with animation and insertion capability

### Challenge Verification System

1. Execute student code via Piston API
2. Capture output and errors
3. Submit to AI for verification against reference solution
4. Parse AI verdict (CORRECT/INCORRECT/PARTIAL)
5. Provide feedback and allow resubmission

### Error Debugging Flow

1. Store last execution error and code state
2. Verify code hasn't changed since error
3. Submit to AI with error context
4. Generate fixed code with explanations
5. Offer insertion into editor

## Configuration

### Environment Variables

```
OPENROUTER_API_KEY=sk-or-...
```

### API Configuration

- OpenRouter endpoint: http://localhost:3001/api/openrouter
- Execute endpoint: http://localhost:3001/api/execute
- Model: x-ai/grok-code-fast-1

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- OpenRouter API key

### Installation

```bash
npm install
```

### Development Mode

```bash
node run dev:all
```

### Production Build

```bash
npm run build
npm run preview
```

## Code Execution Flow

1. User writes code in editor
2. User types "run" command or clicks run button
3. Code sent to proxy server at /api/execute
4. Proxy transforms request to Piston API format
5. Piston executes code in sandboxed environment
6. Response includes stdout, stderr, compile errors
7. Output displayed in terminal with syntax highlighting
8. Errors captured and stored for potential debugging

## Legacy Code Analysis Flow

1. User uploads file in Fossil Mode
2. File content read as text
3. Content sent to OpenRouter API with analysis prompt
4. AI returns structured JSON with:
   - Language detection
   - Era identification
   - Code metrics
   - Python translation
   - Security vulnerabilities
   - Historical context
5. Results displayed in tabbed interface
6. User can download modernized code

## Security Considerations

- API keys stored server-side only
- Proxy server prevents key exposure to client
- CORS configured for local development
- Code execution sandboxed via Piston API
- File upload limited to text files
- No user data persistence

## Performance Optimizations

- Debounced AI pair programmer (3-second delay)
- Lazy loading of Matrix effect canvas
- CSS animations over DOM manipulation
- Memoized component renders
- Efficient terminal scrolling
- Sequential API calls for evolution feature

## Browser Compatibility

- Modern browsers with ES6+ support
- CSS Grid and Flexbox layout
- Canvas API for Matrix effect
- Local storage not used (per Claude.ai artifact restrictions)
- FileReader API for file uploads

## Known Limitations

- Proxy server required for API key security
- Limited to C, C++, and Python execution
- AI responses may vary in quality
- Rate limits apply to free tier API usage

## Future Enhancement Opportunities

- Additional programming eras (1960s Assembly, 1990s)
- Collaborative coding features
- Leaderboard system for challenges
- Code golf optimization mode
- VSCode extension integration
- More legacy languages support
- Integrate security-specific ML model for fossil mode vulnerability detection

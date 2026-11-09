# CodeFlow — JavaScript Visual Debugger

[![Live Demo](https://img.shields.io/badge/Demo-Live%20App-0ea5e9?style=for-the-badge&logo=vercel)](https://codeflow-javascript-debugger.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-1e1e1e?style=for-the-badge&logo=visualstudiocode&logoColor=007ACC)](https://microsoft.github.io/monaco-editor/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**CodeFlow** is an interactive web-based JavaScript visual debugger and execution visualizer built with **Next.js 16 (Turbopack)**, **React 19**, and **Monaco Editor**. It features an in-house recursive-descent expression parser, step-by-step state machine, time-travel history rewind, real-time variable inspection with type colorization, interactive gutter breakpoints, and virtual console logging.

🔗 **Live App:** [https://codeflow-javascript-debugger.vercel.app/](https://codeflow-javascript-debugger.vercel.app/)

---

## ⚡ What Makes CodeFlow Unique?

### 1. In-House JavaScript Execution Engine
- **No External Debugging Libraries:** Built from scratch with a custom lexical tokenizer and recursive-descent AST evaluator.
- **Variable Mutation & Expressions:** Supports variable declarations (`let`, `const`, `var`), reassignments (`=`), compound assignments (`+=`, `-=`, `*=`, `/=`, `%=`), and increment/decrement operators (`++`, `--`).
- **Complex Data Structures:** Full parsing and runtime mutation for object literals (`{ key: value }`), nested property access (`obj.user.name`), array literals (`[1, 2, 3]`), and indexed access (`arr[0]`).
- **Multi-Argument Console Logging:** Formats objects, arrays, and primitive arguments in real-time (`console.log("Score:", score)`).

### 2. Time-Travel Debugging (Step Forward & Rewind)
- **Immutable State History Stack:** Every step captures a complete execution snapshot.
- **Rewind (Back):** Step backward in time to inspect earlier variable states without rerunning code.
- **Interactive Breakpoints:** Click line numbers directly in the Monaco gutter to set red dot breakpoints.
- **Continuous Execution:** "Play" mode with adjustable speed multiplier (`0.5x`, `1x`, `2x`).

### 3. Developer Experience & UI Polish
- **VS Code Core:** Powered by the Monaco Editor with active line execution decorations (`deltaDecorations`), syntax highlighting, and auto-scrolling.
- **Visual State Diffing:** Active variables highlight in real time when mutated during a step.
- **Interactive Code Presets:** 1-click preset selector with ready-to-run examples (Tour, Object & Array Mutations, Breakpoint Debugging, Exception Handling).
- **Responsive Workspace:** Clean desktop and tablet-friendly layouts with collapsible diagnostic tabs.

---

## 🛠️ Project Architecture

```
codeflow-javascript-debugger/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout with metadata & branded favicons
│   ├── page.tsx               # Main interactive debugger workspace & state
│   └── globals.css            # Tailwind CSS v4 styling & animations
├── components/                # React Components
│   ├── Controls.tsx           # Execution action buttons (Run, Step, Play, Back, Reset)
│   ├── Editor.tsx             # Monaco Editor with gutter breakpoints & line tracking
│   ├── VariablePanel.tsx      # Real-time variable inspector with type badges & search
│   ├── ConsolePanel.tsx       # Terminal output panel with clear capability
│   ├── ErrorPanel.tsx         # Exception diagnostics with line-number context
│   └── HelpModal.tsx          # Interactive user guide & feature reference
├── engine/                    # In-House Execution Engine
│   ├── evaluator.ts           # Lexer & recursive-descent expression evaluator
│   └── executor.ts            # Step-by-step state machine & line executor
├── utils/                     # Utilities & Presets
│   ├── codeManager.ts         # Export, import, and clipboard helpers
│   └── examples.ts            # Interactive preset code examples
└── __tests__/                 # Automated Unit & Integration Tests
    └── executor.test.ts       # 12 automated test cases for parser & executor
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DikshJaswal/codeflow-javascript-debugger.git
cd codeflow-javascript-debugger

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

The engine includes automated unit tests covering expression parsing, variable reassignments, object/array mutations, breakpoints, and runtime error recovery:

```bash
# Run automated test suite
npm test

# Run ESLint check
npm run lint

# Run Next.js production build
npm run build
```

---

## 📝 Controls Guide

| Action | Function |
| :--- | :--- |
| **Run** | Executes the entire program continuously until completion or breakpoint |
| **Step** | Executes the single next line and updates variables |
| **Back** | Rewinds execution state back by one step (Time Travel) |
| **Play / Pause** | Auto-steps through code with configurable speed (`0.5x`, `1x`, `2x`) |
| **Continue** | Resumes execution from a paused breakpoint until the next breakpoint |
| **Reset** | Clears the current execution session and resets variable scopes |
| **Export / Import** | Download code as a `.js` file or load existing files into the editor |
| **Presets Dropdown** | Switch between interactive code demos with 1 click |

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

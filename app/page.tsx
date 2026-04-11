"use client";

import { useState, useEffect } from "react";
import CodeEditor from "../components/Editor";
import Controls from "../components/Controls";
import VariablePanel from "../components/VariablePanel";
import ConsolePanel from "../components/ConsolePanel";
import ErrorPanel from "../components/ErrorPanel";
import HelpModal from "../components/HelpModal";

import {
  createExecutionState,
  executeNext,
} from "../engine/executor";

import { ExecutionState } from "../types";
import { exportCode, importCode, copyToClipboard } from "../utils/codeManager";

export default function Home() {
  const [code, setCode] = useState(`let num = 42;
const str = "Hello World";
var bool = true;
let arr = [1, 2, 3];
let obj = {x: 10, y: 20};

console.log(num);
console.log(str);
console.log(bool);
console.log(arr);
console.log(obj);

// This will cause an error
let errorVar = undefinedVar;`);

  const [state, setState] = useState<ExecutionState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<ExecutionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Current step in history
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 🔴 Toggle Breakpoints
  const toggleBreakpoint = (line: number) => {
    setState((prev) => {
      if (!prev) return prev;

      const exists = prev.breakpoints.includes(line);
      const updated = exists
        ? prev.breakpoints.filter((l) => l !== line)
        : [...prev.breakpoints, line];

      return { ...prev, breakpoints: updated };
    });
  };

  // ▶ Run
  const handleRun = () => {
    let newState = createExecutionState(code);
    newState = executeNext(newState);

    setState(newState);
    setHistory([newState]);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  // ⏭ Step
  const handleStep = () => {
    setIsPlaying(false);

    if (!state) {
      let newState = createExecutionState(code);
      newState = executeNext(newState);

      setState(newState);
      setHistory([newState]);
      setCurrentIndex(0);
      return;
    }

    if (!state.isFinished) {
      const next = executeNext(state);

      setState(next);

      setHistory((prev) => {
        const updated = [...prev, next];
        setCurrentIndex(updated.length - 1);
        return updated;
      });
    }
  };

  // ⬅ BACK (FIXED)
  const handleBack = () => {
  setIsPlaying(false);

  setHistory((prev) => {
    if (prev.length <= 1) return prev;

    const newHistory = prev.slice(0, -1);
    const lastState = newHistory[newHistory.length - 1];

    setState(lastState);
    setCurrentIndex(newHistory.length - 1);

    return newHistory;
  });
};

  // ▶ Play
  const handlePlay = () => {
    if (!state) {
      let newState = createExecutionState(code);
      newState = executeNext(newState);

      setState(newState);
      setHistory([newState]);
      setCurrentIndex(0);
    }

    setIsPlaying(true);
  };

  // ⏸ Pause
  const handlePause = () => setIsPlaying(false);

  // Continue
  const handleContinue = () => {
    setState((prev) => prev && { ...prev, isContinuing: true });
    setIsPlaying(true);
  };

  // Reset
  const handleReset = () => {
    setState(null);
    setHistory([]);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  // Export code
  const handleExport = () => {
    exportCode(code);
  };

  // Import code
  const handleImport = async () => {
    try {
      const importedCode = await importCode();
      setCode(importedCode);
      handleReset(); // Reset execution when importing new code
    } catch (error) {
      console.error('Failed to import code:', error);
    }
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      await copyToClipboard(code);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Auto Play (FIXED)
  useEffect(() => {
  if (!isPlaying) return;

  const interval = setInterval(() => {
    setState((prev) => {
      if (!prev) return prev;

      const next = executeNext(prev);

      if (next === prev) {
        setIsPlaying(false);
        return prev;
      }

      setHistory((h) => [...h, next]);

      if (next.isFinished) {
        setIsPlaying(false);
      }

      return next;
    });
  }, 600);

  return () => clearInterval(interval);
}, [isPlaying]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* Logo */}
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4-4-4 4M6 16l4-4 4 4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">CodeFlow</h1>
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-400">
                    <span>JavaScript Debugger</span>
                    <span>Visual Execution</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {state && (
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                  Line {state.currentLine + 1}
                </div>
              )}
              {isPlaying && (
                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium animate-pulse">
                  Running
                </div>
              )}
              {state?.isFinished && (
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  Complete
                </div>
              )}
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full text-sm font-medium transition-colors"
              >
                Help
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="sticky top-16 z-10 bg-slate-800/50 border-b border-slate-700 px-6 py-4">
          <div className="flex flex-col space-y-4">
            <Controls
              onRun={handleRun}
              onStep={handleStep}
              onReset={handleReset}
              onPlay={handlePlay}
              onPause={handlePause}
              onContinue={handleContinue}
              onBack={handleBack}
              onExport={handleExport}
              onImport={handleImport}
              onCopy={handleCopy}
              isPlaying={isPlaying}
              disabled={state?.isFinished ?? false}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            
            {/* Code Editor */}
            <div className="flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm font-medium text-slate-300">main.js</div>
                <div className="text-xs text-slate-500">JavaScript</div>
              </div>
              
              <div className="flex-1 min-h-0">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  currentLine={state?.currentLine}
                  breakpoints={state?.breakpoints || []}
                  toggleBreakpoint={toggleBreakpoint}
                />
              </div>
              
              <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700 text-xs text-slate-500">
                Supports: let, const, var, strings, booleans, arrays, objects, console.log
              </div>
            </div>

            {/* Side Panels */}
            <div className="flex flex-col space-y-4">
              
              {/* Variables Panel */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Variables
                  </h3>
                </div>
                <div className="p-4">
                  <VariablePanel variables={state?.variables || {}} />
                </div>
              </div>

              {/* Console Panel */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Console
                  </h3>
                </div>
                <div className="p-4">
                  <ConsolePanel logs={state?.logs || []} />
                </div>
              </div>

              {/* Errors Panel */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Errors
                  </h3>
                </div>
                <div className="p-4">
                  <ErrorPanel errors={state?.errors || []} />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
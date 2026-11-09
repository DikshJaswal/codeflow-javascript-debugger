"use client";

import { useState, useEffect } from "react";
import CodeEditor from "../components/Editor";
import Controls from "../components/Controls";
import VariablePanel from "../components/VariablePanel";
import ConsolePanel from "../components/ConsolePanel";
import ErrorPanel from "../components/ErrorPanel";
import HelpModal from "../components/HelpModal";

import { createExecutionState, executeNext } from "../engine/executor";
import { ExecutionState } from "../types";
import { exportCode, importCode, copyToClipboard } from "../utils/codeManager";
import { CODE_EXAMPLES } from "../utils/examples";

export default function Home() {
  const [code, setCode] = useState(CODE_EXAMPLES[0].code);
  const [selectedExample, setSelectedExample] = useState("tour");
  const [state, setState] = useState<ExecutionState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [history, setHistory] = useState<ExecutionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"variables" | "console" | "errors">("variables");

  const toggleBreakpoint = (line: number) => {
    setBreakpoints((previous) => {
      const updated = previous.includes(line)
        ? previous.filter((item) => item !== line)
        : [...previous, line].sort((a, b) => a - b);
      setState((prev) => (prev ? { ...prev, breakpoints: updated } : prev));
      return updated;
    });
  };

  // ▶ Run full code
  const handleRun = () => {
    let newState = createExecutionState(code);
    newState.breakpoints = breakpoints;
    const snapshots: ExecutionState[] = [];
    while (!newState.isFinished) {
      const next = executeNext(newState);
      if (next === newState) break;
      newState = next;
      snapshots.push(newState);
    }

    setState(newState);
    setHistory(snapshots.length ? snapshots : [newState]);
    setCurrentIndex(Math.max(0, snapshots.length - 1));
    setIsPlaying(false);
  };

  // ⏭ Step
  const handleStep = () => {
    setIsPlaying(false);

    if (!state) {
      let newState = createExecutionState(code);
      newState.breakpoints = breakpoints;
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

  const handleCodeChange = (value: string) => {
    setCode(value);
    setState(null);
    setHistory([]);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleSelectExample = (exampleId: string) => {
    setSelectedExample(exampleId);
    const found = CODE_EXAMPLES.find((ex) => ex.id === exampleId);
    if (found) {
      handleCodeChange(found.code);
    }
  };

  // ⬅ BACK (Time-Travel)
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
    if (!state || state.isFinished) {
      let newState = createExecutionState(code);
      newState.breakpoints = breakpoints;
      newState = executeNext(newState);

      setState(newState);
      setHistory([newState]);
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  // ⏸ Pause
  const handlePause = () => setIsPlaying(false);

  // Continue past breakpoint
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

  const handleClearConsole = () => {
    setState((prev) => (prev ? { ...prev, logs: [] } : prev));
  };

  // File Utilities
  const handleExport = () => exportCode(code);
  const handleImport = async () => {
    try {
      const importedCode = await importCode();
      handleCodeChange(importedCode);
    } catch (error) {
      console.error("Failed to import code:", error);
    }
  };
  const handleCopy = async () => {
    try {
      await copyToClipboard(code);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  // Auto Play with Speed Control
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(150, Math.round(600 / speed));
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev) {
          let initial = createExecutionState(code);
          initial.breakpoints = breakpoints;
          initial = executeNext(initial);
          setHistory([initial]);
          setCurrentIndex(0);
          if (initial.isFinished) setIsPlaying(false);
          return initial;
        }

        const next = executeNext(prev);
        if (next === prev) {
          setIsPlaying(false);
          return prev;
        }

        setHistory((h) => [...h, next]);
        setCurrentIndex((i) => i + 1);

        if (next.isFinished) {
          setIsPlaying(false);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, code, breakpoints, speed]);

  const totalLines = state?.lines.length || code.split(/\r?\n/).length;
  const currentLineNumber = state ? Math.min(state.currentLine + 1, totalLines) : 0;
  const progressPercent = state && totalLines > 0 ? Math.min(100, Math.round((currentLineNumber / totalLines) * 100)) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 transition">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <span className="font-mono font-black text-slate-950 text-base">CF</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">CodeFlow</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Debugger v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                JavaScript Visual Execution &amp; Time-Travel Debugger
              </p>
            </div>
          </div>

          {/* Example Selector, Status Badges & Help */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Examples Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/70 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-slate-400 font-medium hidden md:inline">Preset:</span>
              <select
                value={selectedExample}
                onChange={(e) => handleSelectExample(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {CODE_EXAMPLES.map((ex) => (
                  <option key={ex.id} value={ex.id} className="bg-slate-900 text-white">
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Execution Status Badge */}
            {state && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-xs font-medium">
                <span className="text-slate-400 font-mono">Line {currentLineNumber}/{totalLines}</span>
                <span className="text-slate-600">·</span>
                <span className="text-cyan-400 font-mono">Step {Math.min(currentIndex + 1, history.length)}</span>
              </div>
            )}

            {isPlaying && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                Playing
              </div>
            )}

            {state?.isFinished && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Completed
              </div>
            )}

            {state?.errors && state.errors.length > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {state.errors.length} Exception{state.errors.length > 1 ? "s" : ""}
              </div>
            )}

            {/* Help Button */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs font-medium transition shadow-sm"
            >
              Help &amp; Guide
            </button>
          </div>
        </div>

        {/* Mini Execution Progress Bar */}
        {state && (
          <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </header>

      {/* Controls Bar */}
      <div className="sticky top-[61px] z-20 border-b border-slate-800/80 bg-slate-900/95 px-4 sm:px-6 py-2.5 backdrop-blur-md">
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
          speed={speed}
          setSpeed={setSpeed}
        />
      </div>

      {/* Workspace Area */}
      <div className="flex-1 p-4 sm:p-6 bg-slate-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1800px] mx-auto items-start">
          {/* Monaco Editor Container */}
          <div className="lg:col-span-7 flex flex-col h-[calc(100vh-180px)] min-h-[550px] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
            {/* Window titlebar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono font-semibold text-slate-300 ml-2">main.js</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span className="hidden sm:inline">🔴 Click gutter to toggle breakpoints</span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded text-cyan-400 font-mono">JS Engine</span>
              </div>
            </div>

            {/* Monaco Editor Component */}
            <div className="flex-1 min-h-0 bg-[#1e1e1e]">
              <CodeEditor
                code={code}
                setCode={handleCodeChange}
                currentLine={state ? state.currentLine : undefined}
                breakpoints={breakpoints}
                toggleBreakpoint={toggleBreakpoint}
              />
            </div>

            {/* Editor Footer Feature Highlights */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">Supported:</span>
                <span>let / const / var</span>
                <span>·</span>
                <span>mutations (+=, ++, =)</span>
                <span>·</span>
                <span>objects &amp; arrays</span>
                <span>·</span>
                <span>console.log</span>
              </div>
              <div className="text-slate-500">
                {code.split(/\r?\n/).length} lines
              </div>
            </div>
          </div>

          {/* Side Panels: Variables, Console, Errors */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Tabs for Mobile/Tablet */}
            <div className="flex lg:hidden rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
              <button
                onClick={() => setActiveTab("variables")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === "variables" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Variables ({Object.keys(state?.variables || {}).length})
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === "console" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Console ({state?.logs.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("errors")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === "errors" ? "bg-rose-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Errors ({state?.errors.length || 0})
              </button>
            </div>

            {/* Variables Card */}
            <div className={`rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden ${
              activeTab !== "variables" ? "hidden lg:block" : ""
            }`}>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Variables &amp; State</h2>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Active Scope
                </span>
              </div>
              <div className="p-4">
                <VariablePanel
                  variables={state?.variables || {}}
                  prevVariables={state?.prevVariables}
                />
              </div>
            </div>

            {/* Console Output Card */}
            <div className={`rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden ${
              activeTab !== "console" ? "hidden lg:block" : ""
            }`}>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Virtual Console</h2>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                  stdout
                </span>
              </div>
              <div className="p-4">
                <ConsolePanel
                  logs={state?.logs || []}
                  onClear={handleClearConsole}
                />
              </div>
            </div>

            {/* Errors Card */}
            <div className={`rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden ${
              activeTab !== "errors" ? "hidden lg:block" : ""
            }`}>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Exceptions &amp; Diagnostics</h2>
                </div>
                {state?.errors && state.errors.length > 0 && (
                  <span className="text-[11px] font-mono text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-md">
                    {state.errors.length} active
                  </span>
                )}
              </div>
              <div className="p-4">
                <ErrorPanel errors={state?.errors || []} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </main>
  );
}

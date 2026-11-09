"use client";

type Props = {
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  onContinue: () => void;
  onBack: () => void;
  onExport: () => void;
  onImport: () => void;
  onCopy: () => void;
  isPlaying: boolean;
  disabled: boolean;
  speed: number;
  setSpeed: (speed: number) => void;
};

export default function Controls({
  onRun,
  onStep,
  onReset,
  onPlay,
  onPause,
  onContinue,
  onBack,
  onExport,
  onImport,
  onCopy,
  isPlaying,
  disabled,
  speed,
  setSpeed,
}: Props) {
  const baseButton =
    "px-3.5 py-2 rounded-xl font-semibold text-xs transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 border border-white/10 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40";

  const disabledStyle = "opacity-40 cursor-not-allowed transform-none hover:translate-y-0 hover:shadow-none";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Execution Controls Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Run */}
        <button
          onClick={onRun}
          title="Run full program from start to finish"
          className={`${baseButton} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-900/30`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Run</span>
        </button>

        {/* Step Forward */}
        <button
          onClick={onStep}
          disabled={disabled || isPlaying}
          title="Execute the next line (Step Forward)"
          className={`${baseButton} ${
            disabled || isPlaying
              ? disabledStyle
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-blue-900/30"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
          <span>Step</span>
        </button>

        {/* Step Back (Time-Travel) */}
        <button
          onClick={onBack}
          disabled={isPlaying}
          title="Step backward to previous execution state (Time Travel)"
          className={`${baseButton} ${
            isPlaying
              ? disabledStyle
              : "bg-slate-700/80 hover:bg-slate-600 text-slate-200 hover:text-white shadow-slate-950/30"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
          <span>Back</span>
        </button>

        {/* Play / Pause Auto-Execution */}
        <button
          onClick={!isPlaying ? onPlay : onPause}
          title={!isPlaying ? "Auto-play execution step-by-step" : "Pause auto-execution"}
          className={`${baseButton} ${
            !isPlaying
              ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white shadow-purple-900/30"
              : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-orange-900/30"
          }`}
        >
          {!isPlaying ? (
            <>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Continue to Next Breakpoint */}
        <button
          onClick={onContinue}
          disabled={disabled || isPlaying}
          title="Continue running until the next breakpoint"
          className={`${baseButton} ${
            disabled || isPlaying
              ? disabledStyle
              : "bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white shadow-indigo-900/30"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
          <span>Continue</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset debugger and clear variables"
          className={`${baseButton} bg-gradient-to-r from-rose-500/90 to-red-600/90 hover:from-rose-500 hover:to-red-600 text-white shadow-rose-900/30`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
          <span>Reset</span>
        </button>
      </div>

      {/* Speed & File Management Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Speed Toggle */}
        <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900/80 p-1 text-xs">
          <span className="px-2 text-slate-400 font-medium text-[11px]">Speed:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded-lg px-2 py-1 font-semibold transition ${
                speed === s
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Export Code */}
        <button
          onClick={onExport}
          title="Download code as .js file"
          className={`${baseButton} bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white`}
        >
          <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export</span>
        </button>

        {/* Import Code */}
        <button
          onClick={onImport}
          title="Upload existing .js or .txt file"
          className={`${baseButton} bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white`}
        >
          <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Import</span>
        </button>

        {/* Copy Code */}
        <button
          onClick={onCopy}
          title="Copy code to clipboard"
          className={`${baseButton} bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white`}
        >
          <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
}

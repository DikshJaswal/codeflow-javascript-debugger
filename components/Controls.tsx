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
}: Props) {
  const baseButton = "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 min-w-[88px] border border-white/10 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50";
  
  const disabledStyle = "opacity-50 cursor-not-allowed transform-none hover:scale-100";

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      
      {/* Primary Controls */}
      <button
        onClick={onRun}
        title="Run the program from the beginning"
        className={`${baseButton} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-900/40`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Run</span>
      </button>

      <button
        onClick={onStep}
        disabled={disabled || isPlaying}
        title="Execute the next line"
        className={`${baseButton} ${disabled || isPlaying ? disabledStyle : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-blue-900/40'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Step</span>
      </button>

      <button
        onClick={!isPlaying ? onPlay : onPause}
        title={!isPlaying ? "Play the program automatically" : "Pause execution"}
        className={`${baseButton} ${!isPlaying ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white shadow-purple-900/40' : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-orange-900/40'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">{!isPlaying ? 'Play' : 'Pause'}</span>
      </button>

      {/* Secondary Controls */}
      <button
        onClick={onBack}
        disabled={isPlaying}
        title="Return to the previous execution step"
        className={`${baseButton} ${isPlaying ? disabledStyle : 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-950/40'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Back</span>
      </button>

      <button
        onClick={onContinue}
        disabled={disabled || isPlaying}
        title="Continue past a breakpoint"
        className={`${baseButton} ${disabled || isPlaying ? disabledStyle : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white shadow-indigo-900/40'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Continue</span>
      </button>

      <button
        onClick={onReset}
        title="Clear the execution state and start over"
        className={`${baseButton} bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-red-900/40`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Reset</span>
      </button>

      {/* Utility Controls */}
      <button
        onClick={onExport}
        title="Download the current code as a JavaScript file"
        className={`${baseButton} bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white shadow-cyan-900/40`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Export</span>
      </button>

      <button
        onClick={onImport}
        title="Load JavaScript or text from a file"
        className={`${baseButton} bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-900/40`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Import</span>
      </button>

      <button
        onClick={onCopy}
        title="Copy the current code to the clipboard"
        className={`${baseButton} bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-900/40`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Copy</span>
      </button>

    </div>
  );
}

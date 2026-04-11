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
  const baseButton = "px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-w-[80px] shadow-lg hover:shadow-xl";
  
  const disabledStyle = "opacity-50 cursor-not-allowed transform-none hover:scale-100";

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      
      {/* Primary Controls */}
      <button
        onClick={onRun}
        disabled={disabled}
        className={`${baseButton} ${disabled ? disabledStyle : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Run</span>
      </button>

      <button
        onClick={onStep}
        disabled={disabled || isPlaying}
        className={`${baseButton} ${disabled || isPlaying ? disabledStyle : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Step</span>
      </button>

      <button
        onClick={!isPlaying ? onPlay : onPause}
        className={`${baseButton} ${!isPlaying ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">{!isPlaying ? 'Play' : 'Pause'}</span>
      </button>

      {/* Secondary Controls */}
      <button
        onClick={onBack}
        disabled={disabled || isPlaying}
        className={`${baseButton} ${disabled || isPlaying ? disabledStyle : 'bg-slate-600 hover:bg-slate-700 text-white shadow-slate-600/25'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Back</span>
      </button>

      <button
        onClick={onContinue}
        disabled={disabled || isPlaying}
        className={`${baseButton} ${disabled || isPlaying ? disabledStyle : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Continue</span>
      </button>

      <button
        onClick={onReset}
        className={`${baseButton} bg-red-600 hover:bg-red-700 text-white shadow-red-600/25`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Reset</span>
      </button>

      {/* Utility Controls */}
      <button
        onClick={onExport}
        className={`${baseButton} bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/25`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Export</span>
      </button>

      <button
        onClick={onImport}
        className={`${baseButton} bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Import</span>
      </button>

      <button
        onClick={onCopy}
        className={`${baseButton} bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25`}
      >
        <span className="w-4 h-4 flex items-center justify-center">Copy</span>
      </button>

    </div>
  );
}
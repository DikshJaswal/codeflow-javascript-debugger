"use client";

type Props = {
  logs: string[];
  onClear?: () => void;
};

export default function ConsolePanel({ logs, onClear }: Props) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-2 font-mono text-sm">
          &gt;_
        </div>
        <p className="text-sm font-medium text-slate-400">No console output</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Call console.log(...) to print values in real-time</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {onClear && (
        <div className="flex items-center justify-between pb-1 border-b border-slate-700/50">
          <span className="text-[11px] text-slate-400 font-medium font-mono">
            {logs.length} {logs.length === 1 ? "log" : "logs"}
          </span>
          <button
            onClick={onClear}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition font-medium"
          >
            Clear Output
          </button>
        </div>
      )}

      <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 bg-slate-950/70 rounded-lg p-2.5 border border-slate-800 transition hover:border-slate-700 font-mono text-xs"
          >
            <span className="text-emerald-500 shrink-0 select-none font-bold">&gt;</span>
            <div className="flex-1 min-w-0">
              <pre className="text-emerald-300 whitespace-pre-wrap break-all font-mono leading-relaxed">
                {log}
              </pre>
            </div>
            <span className="text-[10px] text-slate-500 select-none shrink-0 font-sans">
              #{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

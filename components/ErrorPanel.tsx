"use client";

type Props = {
  errors: string[];
};

export default function ErrorPanel({ errors }: Props) {
  if (errors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-emerald-400 mb-2 font-mono text-sm">
          ✓
        </div>
        <p className="text-sm font-medium text-slate-400">No runtime errors</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Execution completed or proceeding with clean syntax</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
      {errors.map((error, index) => (
        <div
          key={index}
          className="flex items-start gap-3 bg-rose-950/30 border border-rose-500/30 rounded-xl p-3.5 transition hover:border-rose-500/50 shadow-sm"
        >
          <div className="w-5 h-5 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-rose-500/30">
            !
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono font-medium text-rose-300 break-all leading-relaxed">
              {error}
            </p>
            <p className="text-[10px] text-rose-400/70 mt-1 font-sans">
              Exception caught by CodeFlow execution supervisor
            </p>
          </div>
          <span className="text-[10px] font-bold text-rose-400 shrink-0 font-mono">
            #{index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

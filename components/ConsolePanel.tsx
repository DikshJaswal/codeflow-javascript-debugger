type Props = {
  logs: string[];
};

export default function ConsolePanel({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500">
        <div className="text-sm">No console output</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {logs.map((log, index) => (
        <div
          key={index}
          className="group flex items-start gap-3 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 transition-all duration-200 hover:bg-slate-700/50 hover:border-slate-600/50"
        >
          <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-mono mt-0.5">
            {">"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-sm text-emerald-400 break-all">
              {log}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Output {index + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
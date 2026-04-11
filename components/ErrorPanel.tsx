type Props = {
  errors: string[];
};

export default function ErrorPanel({ errors }: Props) {
  if (errors.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500">
        <div className="text-sm">No errors</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <div
          key={index}
          className="group flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3 transition-all duration-200 hover:bg-red-500/15 hover:border-red-500/30"
        >
          <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
            !
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-red-300 break-all font-medium">
              {error}
            </div>
            <div className="text-xs text-red-400/60 mt-1">
              Error {index + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

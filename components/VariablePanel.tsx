import { Variables, VariableValue } from "../types";

type Props = {
  variables: Variables;
  prevVariables?: Variables;
};

function formatValue(value: VariableValue): string {
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (Array.isArray(value)) {
    return `[${value.join(", ")}]`;
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

function getValueType(value: VariableValue): string {
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object" && value !== null) return "object";
  return "number";
}

function getValueColor(value: VariableValue): string {
  if (typeof value === "string") return "text-blue-400";
  if (typeof value === "boolean") return "text-purple-400";
  if (Array.isArray(value)) return "text-yellow-400";
  if (typeof value === "object" && value !== null) return "text-orange-400";
  return "text-green-400";
}

export default function VariablePanel({ variables, prevVariables }: Props) {
  if (Object.keys(variables).length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500">
        <div className="text-sm">No variables yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(variables).map(([key, value]) => {
        const changed = prevVariables && prevVariables[key] !== value;
        const type = getValueType(value);
        const formattedValue = formatValue(value);
        const valueColor = getValueColor(value);

        return (
          <div
            key={key}
            className={`group relative bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 transition-all duration-300 hover:border-slate-500/50 hover:bg-slate-700/80 ${
              changed ? 'ring-2 ring-emerald-500/50 ring-offset-1 ring-offset-slate-800' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className={`w-2 h-2 rounded-full ${valueColor} bg-opacity-80`}></div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-sm text-white truncate">{key}</div>
                  <div className="text-xs text-slate-400 capitalize">{type}</div>
                </div>
              </div>
              <div className={`font-mono text-sm ${valueColor} ml-4 flex-shrink-0`}>
                {formattedValue}
              </div>
            </div>
            {changed && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
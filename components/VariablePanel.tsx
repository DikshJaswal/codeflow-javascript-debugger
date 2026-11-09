"use client";

import { useState } from "react";
import { Variables, VariableValue } from "../types";

type Props = {
  variables: Variables;
  prevVariables?: Variables;
};

function formatValue(value: VariableValue): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function getValueType(value: VariableValue): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return `array[${value.length}]`;
  if (typeof value === "object") return "object";
  return "number";
}

function getValueBadgeClass(value: VariableValue): { bg: string; text: string; dot: string } {
  if (typeof value === "string") return { bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-300", dot: "bg-blue-400" };
  if (typeof value === "boolean") return { bg: "bg-purple-500/15 border-purple-500/30", text: "text-purple-300", dot: "bg-purple-400" };
  if (Array.isArray(value)) return { bg: "bg-amber-500/15 border-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" };
  if (typeof value === "object" && value !== null) return { bg: "bg-orange-500/15 border-orange-500/30", text: "text-orange-300", dot: "bg-orange-400" };
  if (value === undefined || value === null) return { bg: "bg-slate-500/15 border-slate-500/30", text: "text-slate-400", dot: "bg-slate-400" };
  return { bg: "bg-emerald-500/15 border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-400" };
}

export default function VariablePanel({ variables, prevVariables }: Props) {
  const [search, setSearch] = useState("");
  const keys = Object.keys(variables);

  if (keys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-2">
          {}
        </div>
        <p className="text-sm font-medium text-slate-400">No active variables</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Variables will appear here as declarations execute</p>
      </div>
    );
  }

  const filteredKeys = keys.filter(
    (key) => key.toLowerCase().includes(search.toLowerCase()) || formatValue(variables[key]).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      {/* Search Bar & Count */}
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter variables..."
          className="w-full text-xs bg-slate-900/60 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <span className="text-[11px] text-slate-400 font-medium shrink-0 bg-slate-800 px-2 py-1 rounded-md border border-slate-700/50">
          {keys.length} total
        </span>
      </div>

      {/* Variables List */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {filteredKeys.map((key) => {
          const value = variables[key];
          const hasPrev = prevVariables && key in prevVariables;
          const changed = hasPrev && JSON.stringify(prevVariables[key]) !== JSON.stringify(value);
          const type = getValueType(value);
          const formatted = formatValue(value);
          const badge = getValueBadgeClass(value);

          return (
            <div
              key={key}
              className={`relative bg-slate-900/40 rounded-xl p-3 border transition-all duration-300 hover:bg-slate-800/60 ${
                changed
                  ? "border-emerald-500/60 ring-2 ring-emerald-500/20 bg-emerald-950/20 shadow-md shadow-emerald-950/30"
                  : "border-slate-700/60 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                    <span className="font-mono text-xs font-bold text-white truncate">{key}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text}`}>
                      {type}
                    </span>
                    {changed && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                        Updated
                      </span>
                    )}
                  </div>

                  <div className="mt-2 font-mono text-xs text-slate-200 bg-slate-950/60 rounded-lg p-2 border border-slate-800 break-all overflow-x-auto">
                    {formatted}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

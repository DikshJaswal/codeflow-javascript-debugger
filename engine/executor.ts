import { ExecutionState } from "../types";
import { evaluateExpression } from "./evaluator";

function formatExecutionError(line: string, lineNumber: number, error: unknown): string {
  const unsupported = /^(if|else|for|while|function|return|switch|try|catch|class|import|export)\b/.test(line);
  const detail = error instanceof Error ? error.message : String(error);
  return unsupported
    ? `Unsupported syntax at line ${lineNumber}: this debugger currently supports basic declarations, expressions, and console.log.`
    : `Error at line ${lineNumber}: ${detail}`;
}

export function createExecutionState(code: string): ExecutionState {
  const lines = code.split(/\r?\n/);

  return {
    lines,
    currentLine: 0,
    variables: {},
    prevVariables: {},
    isFinished: false,
    logs: [],
    breakpoints: [],
    isContinuing: false,
    errors: [],
  };
}

export function executeNext(state: ExecutionState): ExecutionState {
  if (state.isFinished) return state;

  if (state.currentLine >= state.lines.length) return { ...state, isFinished: true };
  if (state.breakpoints.includes(state.currentLine) && !state.isContinuing) {
    return state;
  }

  const sourceLine = state.lines[state.currentLine];
  const line = sourceLine.trim();
  if (!line || line.startsWith("//")) {
    const nextLine = state.currentLine + 1;
    return { ...state, currentLine: nextLine, isFinished: nextLine >= state.lines.length, isContinuing: false };
  }

  const newVariables = { ...state.variables };
  const prevVariables = { ...state.variables };

  // console.log
  if (line.startsWith("console.log")) {
    const newLogs = [...state.logs];
    const match = line.match(/console\.log\((.*)\)/);

    try {
      if (!match) throw new Error("SyntaxError: invalid console.log call");
      const val = evaluateExpression(match[1].trim(), newVariables);
      newLogs.push(typeof val === "object" && val !== null ? JSON.stringify(val, null, 2) : String(val));
    } catch (error) {
      return { ...state, errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, error)], currentLine: state.currentLine + 1, isFinished: state.currentLine + 1 >= state.lines.length, isContinuing: false };
    }

    return {
      ...state,
      logs: newLogs,
      currentLine: state.currentLine + 1,
      isFinished: state.currentLine + 1 >= state.lines.length,
      prevVariables,
      isContinuing: false,
    };
  }

  // Variable declarations (let, const, var)
  const declarationMatch = line.match(/^(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.*);?$/);
  if (declarationMatch) {
    const [, , name, expr] = declarationMatch;
    try {
      const value = evaluateExpression(expr.trim(), newVariables);
      newVariables[name.trim()] = value;
    } catch (error) {
      const newErrors = [...state.errors];
      newErrors.push(formatExecutionError(line, state.currentLine + 1, error));
      return {
        ...state,
        errors: newErrors,
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }
  }

  // Handle other lines that might cause errors
  if (line.trim() && !line.startsWith("console.log") && !declarationMatch) {
    try {
      // Try to evaluate the line to catch any errors
      evaluateExpression(line.trim(), newVariables);
    } catch (error) {
      const newErrors = [...state.errors];
      newErrors.push(formatExecutionError(line, state.currentLine + 1, error));
      return {
        ...state,
        errors: newErrors,
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }
  }

  return {
    ...state,
    variables: newVariables,
    prevVariables,
    currentLine: state.currentLine + 1,
    isFinished: state.currentLine + 1 >= state.lines.length,
    isContinuing: false,
  };
}

import { ExecutionState, VariableValue } from "../types";
import { evaluateExpression } from "./evaluator";

function formatExecutionError(line: string, lineNumber: number, error: unknown): string {
  const unsupported = /^(if|else|for|while|function|return|switch|try|catch|class|import|export)\b/.test(line);
  const detail = error instanceof Error ? error.message : String(error);
  return unsupported
    ? `Unsupported syntax at line ${lineNumber}: CodeFlow focuses on declarations, expressions, mutations, and logging.`
    : `Error at line ${lineNumber}: ${detail}`;
}

function splitArguments(str: string): string[] {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  let inString: string | null = null;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (inString) {
      current += char;
      if (char === inString && str[i - 1] !== "\\") {
        inString = null;
      }
    } else if (char === '"' || char === "'") {
      inString = char;
      current += char;
    } else if (char === "(" || char === "[" || char === "{") {
      depth++;
      current += char;
    } else if (char === ")" || char === "]" || char === "}") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      args.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    args.push(current.trim());
  }
  return args;
}

function formatLogValue(val: VariableValue): string {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "object") {
    return JSON.stringify(val, null, 2);
  }
  return String(val);
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

  if (state.currentLine >= state.lines.length) {
    return { ...state, isFinished: true };
  }

  if (state.breakpoints.includes(state.currentLine) && !state.isContinuing) {
    return state;
  }

  const sourceLine = state.lines[state.currentLine];
  const line = sourceLine.trim();

  // Empty lines or comments
  if (!line || line.startsWith("//")) {
    const nextLine = state.currentLine + 1;
    return {
      ...state,
      currentLine: nextLine,
      isFinished: nextLine >= state.lines.length,
      isContinuing: false,
    };
  }

  const newVariables = { ...state.variables };
  const prevVariables = { ...state.variables };

  // 1. console.log(...)
  if (line.startsWith("console.log")) {
    const match = line.match(/^console\.log\s*\((.*)\)\s*;?$/);
    if (!match) {
      return {
        ...state,
        errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, new Error("SyntaxError: invalid console.log syntax"))],
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }

    try {
      const rawArgs = splitArguments(match[1]);
      const renderedParts = rawArgs.map((arg) => {
        const val = evaluateExpression(arg, newVariables);
        return formatLogValue(val);
      });
      const output = renderedParts.length > 0 ? renderedParts.join(" ") : "";
      const newLogs = [...state.logs, output];

      return {
        ...state,
        logs: newLogs,
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        prevVariables,
        isContinuing: false,
      };
    } catch (error) {
      return {
        ...state,
        errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, error)],
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }
  }

  // 2. Variable declarations: let / const / var
  const declarationMatch = line.match(/^(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*(.*))?;?$/);
  if (declarationMatch) {
    const [, , name, expr] = declarationMatch;
    try {
      const value = expr !== undefined ? evaluateExpression(expr.trim(), newVariables) : undefined;
      newVariables[name.trim()] = value;
      return {
        ...state,
        variables: newVariables,
        prevVariables,
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    } catch (error) {
      return {
        ...state,
        errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, error)],
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }
  }

  // 3. Postfix or Prefix Increment / Decrement: x++, ++x, x--, --x
  const incDecMatch = line.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(\+\+|--);?$/) ||
                      line.match(/^(\+\+|--)\s*([a-zA-Z_$][a-zA-Z0-9_$]*);?$/);
  if (incDecMatch) {
    const isPrefix = incDecMatch[1] === "++" || incDecMatch[1] === "--";
    const name = isPrefix ? incDecMatch[2] : incDecMatch[1];
    const op = isPrefix ? incDecMatch[1] : incDecMatch[2];

    try {
      if (!(name in newVariables)) {
        throw new Error(`ReferenceError: ${name} is not defined`);
      }
      const cur = Number(newVariables[name]);
      newVariables[name] = op === "++" ? cur + 1 : cur - 1;
      return {
        ...state,
        variables: newVariables,
        prevVariables,
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    } catch (error) {
      return {
        ...state,
        errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, error)],
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }
  }

  // 4. Member / element assignment: obj.key = expr or arr[0] = expr
  const memberAssignMatch = line.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(\.[a-zA-Z_$][a-zA-Z0-9_$]*|\[.+?\])\s*(\+=|-=|\*=|\/=|%=|=)\s*(.+?);?$/);
  if (memberAssignMatch) {
    const [, targetName, accessor, op, expr] = memberAssignMatch;
    try {
      if (!(targetName in newVariables)) {
        throw new Error(`ReferenceError: ${targetName} is not defined`);
      }
      const val = evaluateExpression(expr.trim(), newVariables);
      const target = Array.isArray(newVariables[targetName])
        ? [...(newVariables[targetName] as VariableValue[])]
        : { ...(newVariables[targetName] as Record<string, VariableValue>) };

      let key: string | number;
      if (accessor.startsWith(".")) {
        key = accessor.slice(1);
      } else {
        const indexExpr = accessor.slice(1, -1);
        const resolvedIdx = evaluateExpression(indexExpr, newVariables);
        key = Array.isArray(target) ? Number(resolvedIdx) : String(resolvedIdx);
      }

      const existingVal = (target as Record<string | number, VariableValue>)[key];
      let finalVal: VariableValue = val;
      if (op === "+=") {
        finalVal =
          typeof existingVal === "string" || typeof val === "string"
            ? String(existingVal ?? "") + String(val ?? "")
            : Number(existingVal) + Number(val);
      } else if (op === "-=") finalVal = Number(existingVal) - Number(val);
      else if (op === "*=") finalVal = Number(existingVal) * Number(val);
      else if (op === "/=") finalVal = Number(existingVal) / Number(val);
      else if (op === "%=") finalVal = Number(existingVal) % Number(val);

      (target as Record<string | number, VariableValue>)[key] = finalVal;
      newVariables[targetName] = target as unknown as VariableValue;

      return {
        ...state,
        variables: newVariables,
        prevVariables,
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    } catch (error) {
      return {
        ...state,
        errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, error)],
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }
  }

  // 5. Variable reassignment: x = expr, x += expr, x -= expr, etc.
  const assignMatch = line.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(\+=|-=|\*=|\/=|%=|=)\s*(.+?);?$/);
  if (assignMatch) {
    const [, name, op, expr] = assignMatch;
    try {
      if (!(name in newVariables)) {
        throw new Error(`ReferenceError: ${name} is not defined`);
      }
      const val = evaluateExpression(expr.trim(), newVariables);
      if (op === "=") {
        newVariables[name] = val;
      } else if (op === "+=") {
        const cur = newVariables[name];
        newVariables[name] =
          typeof cur === "string" || typeof val === "string"
            ? String(cur ?? "") + String(val ?? "")
            : Number(cur) + Number(val);
      } else if (op === "-=") {
        newVariables[name] = Number(newVariables[name]) - Number(val);
      } else if (op === "*=") {
        newVariables[name] = Number(newVariables[name]) * Number(val);
      } else if (op === "/=") {
        newVariables[name] = Number(newVariables[name]) / Number(val);
      } else if (op === "%=") {
        newVariables[name] = Number(newVariables[name]) % Number(val);
      }

      return {
        ...state,
        variables: newVariables,
        prevVariables,
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    } catch (error) {
      return {
        ...state,
        errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, error)],
        currentLine: state.currentLine + 1,
        isFinished: state.currentLine + 1 >= state.lines.length,
        isContinuing: false,
      };
    }
  }

  // 6. Generic expression evaluation (catches standalone expressions and syntax errors)
  try {
    evaluateExpression(line.trim(), newVariables);
  } catch (error) {
    return {
      ...state,
      errors: [...state.errors, formatExecutionError(line, state.currentLine + 1, error)],
      currentLine: state.currentLine + 1,
      isFinished: state.currentLine + 1 >= state.lines.length,
      isContinuing: false,
    };
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

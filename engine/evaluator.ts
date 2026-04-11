import { Variables, VariableValue } from "../types";

export function evaluateExpression(
  expr: string,
  variables: Variables
): VariableValue {
  if (!expr) return 0;

  const trimmed = expr.trim().replace(/;$/, ''); // Remove trailing semicolon

  // Handle string literals
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  // Handle boolean literals
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // Handle array literals
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return [];
    }
  }

  // Handle object literals
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Handle JavaScript object notation (unquoted keys)
      try {
        // Convert JS object notation to JSON format
        const jsonStr = trimmed
          .replace(/(\w+):/g, '"$1":')  // Quote unquoted keys
          .replace(/'/g, '"');           // Replace single quotes with double quotes
        return JSON.parse(jsonStr);
      } catch {
        return {};
      }
    }
  }

  // Handle numeric literals (before variable references)
  const numValue = Number(trimmed);
  if (!isNaN(numValue)) {
    return numValue;
  }

  // Handle variable references
  if (variables[trimmed] !== undefined) {
    return variables[trimmed];
  }
  
  // If we get here, it's an undefined variable - throw an error
  if (trimmed && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmed)) {
    throw new Error(`ReferenceError: ${trimmed} is not defined`);
  }

  // Handle arithmetic expressions only if they contain operators
  if (trimmed.includes('+') || trimmed.includes('-') || trimmed.includes('*') || trimmed.includes('/')) {
    let replaced = trimmed;

    // Replace variables
    Object.keys(variables).forEach((key) => {
      const value = variables[key];
      if (typeof value === "number") {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        replaced = replaced.replace(regex, value.toString());
      }
    });

    // Add spacing for operators
    replaced = replaced
      .replaceAll("+", " + ")
      .replaceAll("-", " - ")
      .replaceAll("*", " * ")
      .replaceAll("/", " / ");

    const tokens = replaced.split(" ").filter(Boolean);

    if (tokens.length === 0) return 0;

    let result = Number(tokens[0]);
    if (isNaN(result)) return 0;

    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const nextValue = Number(tokens[i + 1]);

      if (isNaN(nextValue)) continue;

      switch (operator) {
        case "+":
          result += nextValue;
          break;
        case "-":
          result -= nextValue;
          break;
        case "*":
          result *= nextValue;
          break;
        case "/":
          if (nextValue === 0) return result;
          result /= nextValue;
          break;
        default:
          break;
      }
    }

    return isNaN(result) ? 0 : result;
  }

  return 0;
}
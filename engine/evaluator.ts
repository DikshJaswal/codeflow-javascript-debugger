import { Variables, VariableValue } from "../types";

export type Token = {
  kind: "number" | "string" | "identifier" | "operator" | "eof";
  value: string;
};

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    // Whitespace
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    // Strings (single or double quotes)
    if (char === "'" || char === '"') {
      const quote = char;
      let value = "";
      index += 1;
      while (index < source.length && source[index] !== quote) {
        if (source[index] === "\\" && index + 1 < source.length) {
          index += 1;
          const next = source[index];
          if (next === "n") value += "\n";
          else if (next === "t") value += "\t";
          else value += next;
        } else {
          value += source[index];
        }
        index += 1;
      }
      if (index >= source.length || source[index] !== quote) {
        throw new Error("SyntaxError: unterminated string literal");
      }
      index += 1; // skip closing quote
      tokens.push({ kind: "string", value });
      continue;
    }

    // Multi-char operators: ===, !==, ==, !=, <=, >=, &&, ||, ++, --
    const threeChars = source.slice(index, index + 3);
    if (threeChars === "===" || threeChars === "!==") {
      tokens.push({ kind: "operator", value: threeChars });
      index += 3;
      continue;
    }

    const twoChars = source.slice(index, index + 2);
    if (["==", "!=", "<=", ">=", "&&", "||", "++", "--"].includes(twoChars)) {
      tokens.push({ kind: "operator", value: twoChars });
      index += 2;
      continue;
    }

    // Numbers (decimal or integer)
    const numberMatch = source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
    if (numberMatch && (char >= "0" && char <= "9" || (char === "." && source[index + 1] >= "0" && source[index + 1] <= "9"))) {
      tokens.push({ kind: "number", value: numberMatch[0] });
      index += numberMatch[0].length;
      continue;
    }

    // Identifiers & keywords
    const identifierMatch = source.slice(index).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (identifierMatch) {
      tokens.push({ kind: "identifier", value: identifierMatch[0] });
      index += identifierMatch[0].length;
      continue;
    }

    // Single-char operators and punctuation
    if ("+-*/%(),[]{}:.!?<>".includes(char)) {
      tokens.push({ kind: "operator", value: char });
      index += 1;
      continue;
    }

    throw new Error(`SyntaxError: unexpected token '${char}'`);
  }

  tokens.push({ kind: "eof", value: "" });
  return tokens;
}

export function evaluateExpression(expr: string, variables: Variables): VariableValue {
  const trimmed = expr.trim().replace(/;$/, "");
  if (!trimmed) return undefined;

  const tokens = tokenize(trimmed);
  let position = 0;

  const peek = () => tokens[position] || { kind: "eof", value: "" };
  const take = (expectedValue?: string) => {
    const token = peek();
    if (expectedValue && token.value !== expectedValue) {
      throw new Error(`SyntaxError: expected '${expectedValue}', got '${token.value}'`);
    }
    position += 1;
    return token;
  };

  // Primary: literals, identifiers, arrays, objects, parentheses
  const parsePrimary = (): VariableValue => {
    const token = peek();

    if (token.kind === "number") {
      take();
      return Number(token.value);
    }

    if (token.kind === "string") {
      take();
      return token.value;
    }

    if (token.kind === "identifier") {
      take();
      if (token.value === "true") return true;
      if (token.value === "false") return false;
      if (token.value === "null") return null;
      if (token.value === "undefined") return undefined;

      if (!(token.value in variables)) {
        throw new Error(`ReferenceError: ${token.value} is not defined`);
      }
      return variables[token.value];
    }

    // Parentheses (expr)
    if (token.value === "(") {
      take("(");
      const val = parseLogicalOr();
      take(")");
      return val;
    }

    // Array literal: [1, 2, 3]
    if (token.value === "[") {
      take("[");
      const elements: VariableValue[] = [];
      while (peek().value !== "]" && peek().kind !== "eof") {
        elements.push(parseLogicalOr());
        if (peek().value === ",") {
          take(",");
        } else {
          break;
        }
      }
      take("]");
      return elements;
    }

    // Object literal: { x: 10, y: 20 }
    if (token.value === "{") {
      take("{");
      const obj: Record<string, VariableValue> = {};
      while (peek().value !== "}" && peek().kind !== "eof") {
        const keyToken = take();
        if (keyToken.kind !== "identifier" && keyToken.kind !== "string") {
          throw new Error("SyntaxError: invalid object key");
        }
        take(":");
        obj[keyToken.value] = parseLogicalOr();
        if (peek().value === ",") {
          take(",");
        } else {
          break;
        }
      }
      take("}");
      return obj;
    }

    throw new Error(`SyntaxError: expected an expression near '${token.value || "end of input"}'`);
  };

  // Member access: expr.prop or expr[index]
  const parseMember = (): VariableValue => {
    let base = parsePrimary();

    while (peek().value === "." || peek().value === "[") {
      if (peek().value === ".") {
        take(".");
        const propToken = take();
        if (propToken.kind !== "identifier") {
          throw new Error("SyntaxError: expected identifier after '.'");
        }
        if (base === null || base === undefined) {
          throw new Error(`TypeError: cannot read property '${propToken.value}' of ${base}`);
        }
        base = (base as Record<string, VariableValue>)[propToken.value];
      } else if (peek().value === "[") {
        take("[");
        const indexVal = parseLogicalOr();
        take("]");
        if (base === null || base === undefined) {
          throw new Error(`TypeError: cannot read property of ${base}`);
        }
        if (Array.isArray(base)) {
          const numIdx = Number(indexVal);
          base = base[numIdx];
        } else {
          base = (base as Record<string, VariableValue>)[String(indexVal)];
        }
      }
    }

    return base;
  };

  // Unary: -expr, !expr
  const parseUnary = (): VariableValue => {
    if (peek().value === "-") {
      take("-");
      const val = parseUnary();
      if (typeof val !== "number") throw new Error("TypeError: unary - requires a number");
      return -val;
    }
    if (peek().value === "!") {
      take("!");
      const val = parseUnary();
      return !val;
    }
    return parseMember();
  };

  // Multiplicative: *, /, %
  const parseMultiplicative = (): VariableValue => {
    let left = parseUnary();
    while (["*", "/", "%"].includes(peek().value)) {
      const op = take().value;
      const right = parseUnary();
      if (typeof left !== "number" || typeof right !== "number") {
        throw new Error("TypeError: arithmetic requires numbers");
      }
      if (op === "*") left = left * right;
      else if (op === "/") left = left / right;
      else if (op === "%") left = left % right;
    }
    return left;
  };

  // Additive: +, -
  const parseAdditive = (): VariableValue => {
    let left = parseMultiplicative();
    while (["+", "-"].includes(peek().value)) {
      const op = take().value;
      const right = parseMultiplicative();
      if (op === "+") {
        if (typeof left === "string" || typeof right === "string") {
          left = String(left) + String(right);
        } else if (typeof left === "number" && typeof right === "number") {
          left = left + right;
        } else {
          left = String(left) + String(right);
        }
      } else {
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("TypeError: subtraction requires numbers");
        }
        left = left - right;
      }
    }
    return left;
  };

  // Relational: <, <=, >, >=
  const parseRelational = (): VariableValue => {
    let left = parseAdditive();
    while (["<", "<=", ">", ">="].includes(peek().value)) {
      const op = take().value;
      const right = parseAdditive();
      const leftNum = typeof left === "number" ? left : Number(left);
      const rightNum = typeof right === "number" ? right : Number(right);
      if (op === "<") left = leftNum < rightNum;
      else if (op === "<=") left = leftNum <= rightNum;
      else if (op === ">") left = leftNum > rightNum;
      else if (op === ">=") left = leftNum >= rightNum;
    }
    return left;
  };

  // Equality: ===, !==, ==, !=
  const parseEquality = (): VariableValue => {
    let left = parseRelational();
    while (["===", "!==", "==", "!="].includes(peek().value)) {
      const op = take().value;
      const right = parseRelational();
      if (op === "===" || op === "==") left = left === right;
      else if (op === "!==" || op === "!=") left = left !== right;
    }
    return left;
  };

  // Logical AND: &&
  const parseLogicalAnd = (): VariableValue => {
    let left = parseEquality();
    while (peek().value === "&&") {
      take("&&");
      const right = parseEquality();
      left = left && right;
    }
    return left;
  };

  // Logical OR: ||
  const parseLogicalOr = (): VariableValue => {
    let left = parseLogicalAnd();
    while (peek().value === "||") {
      take("||");
      const right = parseLogicalAnd();
      left = left || right;
    }
    return left;
  };

  const result = parseLogicalOr();
  if (peek().kind !== "eof") {
    throw new Error(`SyntaxError: unexpected token '${peek().value}'`);
  }
  return result;
}

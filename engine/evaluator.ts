import { Variables, VariableValue } from "../types";

type Token = { kind: "number" | "string" | "identifier" | "operator" | "eof"; value: string };

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) { index += 1; continue; }
    if (char === "'" || char === '"') {
      const quote = char; let value = ""; index += 1;
      while (index < source.length && source[index] !== quote) {
        if (source[index] === "\\" && index + 1 < source.length) index += 1;
        value += source[index++];
      }
      if (source[index] !== quote) throw new Error("SyntaxError: unterminated string literal");
      index += 1; tokens.push({ kind: "string", value }); continue;
    }
    const number = source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/)?.[0];
    if (number) { tokens.push({ kind: "number", value: number }); index += number.length; continue; }
    const identifier = source.slice(index).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)?.[0];
    if (identifier) { tokens.push({ kind: "identifier", value: identifier }); index += identifier.length; continue; }
    if ("+-*/(),[]{}:".includes(char)) { tokens.push({ kind: "operator", value: char }); index += 1; continue; }
    throw new Error(`SyntaxError: unexpected token '${char}'`);
  }
  tokens.push({ kind: "eof", value: "" });
  return tokens;
}

export function evaluateExpression(expr: string, variables: Variables): VariableValue {
  const tokens = tokenize(expr.trim().replace(/;$/, ""));
  let position = 0;
  const peek = () => tokens[position];
  const take = (value?: string) => {
    const token = tokens[position];
    if (value && token.value !== value) throw new Error(`SyntaxError: expected '${value}'`);
    position += 1; return token;
  };
  const primary = (): VariableValue => {
    const token = peek();
    if (token.kind === "number") { take(); return Number(token.value); }
    if (token.kind === "string") { take(); return token.value; }
    if (token.kind === "identifier") {
      take();
      if (token.value === "true") return true;
      if (token.value === "false") return false;
      if (token.value === "null") return null;
      if (!(token.value in variables)) throw new Error(`ReferenceError: ${token.value} is not defined`);
      return variables[token.value];
    }
    if (token.value === "(") { take("("); const value = additive(); take(")"); return value; }
    if (token.value === "[") {
      take("["); const values: VariableValue[] = [];
      while (peek().value !== "]") { values.push(additive()); if (peek().value !== ",") break; take(","); }
      take("]"); return values;
    }
    if (token.value === "{") {
      take("{"); const result: { [key: string]: VariableValue } = {};
      while (peek().value !== "}") {
        const key = take(); if (key.kind !== "identifier" && key.kind !== "string") throw new Error("SyntaxError: invalid object key");
        take(":"); result[key.value] = additive(); if (peek().value !== ",") break; take(",");
      }
      take("}"); return result;
    }
    throw new Error("SyntaxError: expected an expression");
  };
  const unary = (): VariableValue => { if (peek().value === "-") { take("-"); const value = unary(); if (typeof value !== "number") throw new Error("TypeError: unary - requires a number"); return -value; } return primary(); };
  const multiplicative = (): VariableValue => { let left = unary(); while (["*", "/"].includes(peek().value)) { const op = take().value; const right = unary(); if (typeof left !== "number" || typeof right !== "number") throw new Error("TypeError: arithmetic requires numbers"); left = op === "*" ? left * right : left / right; } return left; };
  function additive(): VariableValue { let left = multiplicative(); while (["+", "-"].includes(peek().value)) { const op = take().value; const right = multiplicative(); if (op === "+" && (typeof left === "string" || typeof right === "string")) left = String(left) + String(right); else if (typeof left === "number" && typeof right === "number") left = op === "+" ? left + right : left - right; else throw new Error("TypeError: incompatible operands"); } return left; }
  const value = additive();
  if (peek().kind !== "eof") throw new Error(`SyntaxError: unexpected token '${peek().value}'`);
  return value;
}

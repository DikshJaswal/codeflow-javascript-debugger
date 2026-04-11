"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateExpression = evaluateExpression;
function evaluateExpression(expr, variables) {
    if (!expr)
        return 0;
    // Handle string literals
    if (expr.startsWith('"') && expr.endsWith('"')) {
        return expr.slice(1, -1);
    }
    if (expr.startsWith("'") && expr.endsWith("'")) {
        return expr.slice(1, -1);
    }
    // Handle boolean literals
    if (expr === "true")
        return true;
    if (expr === "false")
        return false;
    // Handle array literals
    if (expr.startsWith("[") && expr.endsWith("]")) {
        try {
            return JSON.parse(expr);
        }
        catch {
            return [];
        }
    }
    // Handle object literals
    if (expr.startsWith("{") && expr.endsWith("}")) {
        try {
            return JSON.parse(expr);
        }
        catch {
            return {};
        }
    }
    // Handle variable references
    if (variables[expr] !== undefined) {
        return variables[expr];
    }
    // Handle arithmetic expressions
    let replaced = expr;
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
    if (tokens.length === 0)
        return 0;
    let result = Number(tokens[0]);
    if (isNaN(result))
        return 0;
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextValue = Number(tokens[i + 1]);
        if (isNaN(nextValue))
            continue;
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
                if (nextValue === 0)
                    return result;
                result /= nextValue;
                break;
            default:
                break;
        }
    }
    return isNaN(result) ? 0 : result;
}

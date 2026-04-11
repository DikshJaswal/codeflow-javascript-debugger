"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExecutionState = createExecutionState;
exports.executeNext = executeNext;
const evaluator_1 = require("./evaluator");
function createExecutionState(code) {
    const lines = code
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
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
function executeNext(state) {
    if (state.isFinished)
        return state;
    if (state.breakpoints.includes(state.currentLine) &&
        !state.isContinuing &&
        state.currentLine !== 0) {
        return state;
    }
    const line = state.lines[state.currentLine];
    const newVariables = { ...state.variables };
    const prevVariables = { ...state.variables };
    // console.log
    if (line.startsWith("console.log")) {
        const newLogs = [...state.logs];
        const match = line.match(/console\.log\((.*)\)/);
        if (match) {
            const expr = match[1].replace(/;/g, "").trim();
            const val = (0, evaluator_1.evaluateExpression)(expr, newVariables);
            newLogs.push(String(val));
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
        const [, declarationType, name, expr] = declarationMatch;
        try {
            const value = (0, evaluator_1.evaluateExpression)(expr.trim(), newVariables);
            newVariables[name.trim()] = value;
        }
        catch (error) {
            const newErrors = [...state.errors];
            newErrors.push(`Error at line ${state.currentLine + 1}: ${error}`);
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

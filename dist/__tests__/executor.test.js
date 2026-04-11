"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = runTests;
const executor_1 = require("../engine/executor");
// Simple test runner
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}
function test(name, fn) {
    try {
        fn();
        console.log(`\u2713 ${name}`);
    }
    catch (error) {
        console.error(`\u2717 ${name}`);
        console.error(error);
    }
}
// Test Suite
function runTests() {
    console.log('Running Executor Engine Tests...\n');
    test('createExecutionState should initialize with empty state', () => {
        const code = 'let a = 5;';
        const state = (0, executor_1.createExecutionState)(code);
        assert(state.lines.length === 1, 'Should have 1 line');
        assert(state.currentLine === 0, 'Should start at line 0');
        assert(Object.keys(state.variables).length === 0, 'Should have no variables');
        assert(state.logs.length === 0, 'Should have no logs');
        assert(state.errors.length === 0, 'Should have no errors');
        assert(!state.isFinished, 'Should not be finished');
    });
    test('executeNext should handle let declarations', () => {
        const code = 'let a = 5;';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.variables.a === 5, 'Variable a should be 5');
        assert(state.currentLine === 1, 'Should be at line 1');
    });
    test('executeNext should handle const declarations', () => {
        const code = 'const b = 10;';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.variables.b === 10, 'Variable b should be 10');
    });
    test('executeNext should handle var declarations', () => {
        const code = 'var c = 15;';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.variables.c === 15, 'Variable c should be 15');
    });
    test('executeNext should handle string literals', () => {
        const code = 'let str = "Hello World";';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.variables.str === "Hello World", 'Variable str should be "Hello World"');
    });
    test('executeNext should handle boolean literals', () => {
        const code = 'let bool = true;';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.variables.bool === true, 'Variable bool should be true');
    });
    test('executeNext should handle array literals', () => {
        const code = 'let arr = [1, 2, 3];';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(Array.isArray(state.variables.arr), 'Variable arr should be an array');
        assert(JSON.stringify(state.variables.arr) === '[1,2,3]', 'Array should contain [1,2,3]');
    });
    test('executeNext should handle console.log', () => {
        const code = 'console.log("test");';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.logs.length === 1, 'Should have 1 log');
        assert(state.logs[0] === "test", 'Log should contain "test"');
    });
    test('executeNext should handle arithmetic expressions', () => {
        const code = 'let result = 5 + 3;';
        let state = (0, executor_1.createExecutionState)(code);
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.variables.result === 8, 'Variable result should be 8');
    });
    test('executeNext should handle multiple lines', () => {
        const code = `let a = 5;
let b = 10;
let c = a + b;`;
        let state = (0, executor_1.createExecutionState)(code);
        // Execute first line
        state = (0, executor_1.executeNext)(state);
        assert(!state.isFinished, 'Should not be finished');
        assert(state.variables.a === 5, 'Variable a should be 5');
        // Execute second line
        state = (0, executor_1.executeNext)(state);
        assert(!state.isFinished, 'Should not be finished');
        assert(state.variables.b === 10, 'Variable b should be 10');
        // Execute third line
        state = (0, executor_1.executeNext)(state);
        assert(state.isFinished, 'Should be finished');
        assert(state.variables.c === 15, 'Variable c should be 15');
    });
    test('executeNext should handle breakpoints', () => {
        const code = 'let a = 5;\nlet b = 10;';
        let state = (0, executor_1.createExecutionState)(code);
        state.breakpoints = [1]; // Set breakpoint at line 1 (0-indexed)
        // Execute first line (should work)
        state = (0, executor_1.executeNext)(state);
        assert(state.currentLine === 1, 'Should be at line 1');
        assert(state.variables.a === 5, 'Variable a should be 5');
        // Try to execute second line (should stop at breakpoint)
        state = (0, executor_1.executeNext)(state);
        assert(state.currentLine === 1, 'Should still be at line 1 due to breakpoint');
        assert(state.variables.b === undefined, 'Variable b should not be set yet');
    });
    console.log('\nTest suite completed!');
}
// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    runTests();
}

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createExecutionState, executeNext } from "../engine/executor";
import { evaluateExpression } from "../engine/evaluator";

describe("CodeFlow Engine Test Suite", () => {
  describe("Evaluator Unit Tests", () => {
    it("evaluates numbers and arithmetic", () => {
      assert.equal(evaluateExpression("5 + 3 * 2", {}), 11);
      assert.equal(evaluateExpression("(5 + 3) * 2", {}), 16);
      assert.equal(evaluateExpression("10 / 2 - 1", {}), 4);
      assert.equal(evaluateExpression("14 % 4", {}), 2);
    });

    it("evaluates strings and concatenation", () => {
      assert.equal(evaluateExpression('"Hello" + " " + "World"', {}), "Hello World");
      assert.equal(evaluateExpression("'Single quote'", {}), "Single quote");
    });

    it("evaluates booleans, null, and comparisons", () => {
      assert.equal(evaluateExpression("true && false", {}), false);
      assert.equal(evaluateExpression("true || false", {}), true);
      assert.equal(evaluateExpression("!false", {}), true);
      assert.equal(evaluateExpression("5 > 3", {}), true);
      assert.equal(evaluateExpression("10 === 10", {}), true);
      assert.equal(evaluateExpression("10 !== 20", {}), true);
    });

    it("evaluates array literals and element access", () => {
      assert.deepEqual(evaluateExpression("[1, 2, 3]", {}), [1, 2, 3]);
      assert.equal(evaluateExpression("arr[0]", { arr: [100, 200] }), 100);
      assert.equal(evaluateExpression("arr[1]", { arr: [100, 200] }), 200);
    });

    it("evaluates object literals and property access", () => {
      assert.deepEqual(evaluateExpression('{ a: 10, b: "test" }', {}), { a: 10, b: "test" });
      assert.equal(evaluateExpression("user.name", { user: { name: "Alice", age: 30 } }), "Alice");
      assert.equal(evaluateExpression('user["age"]', { user: { name: "Alice", age: 30 } }), 30);
    });

    it("throws ReferenceError on undefined variables", () => {
      assert.throws(() => evaluateExpression("unknownVar", {}), /ReferenceError/);
    });
  });

  describe("Executor Step-by-Step Tests", () => {
    it("handles declarations (let, const, var)", () => {
      const code = `let a = 10;
const b = 20;
var c = a + b;`;
      let state = createExecutionState(code);
      while (!state.isFinished) {
        state = executeNext(state);
      }
      assert.equal(state.variables.a, 10);
      assert.equal(state.variables.b, 20);
      assert.equal(state.variables.c, 30);
      assert.equal(state.errors.length, 0);
    });

    it("handles variable reassignments and compound operators", () => {
      const code = `let score = 0;
score = 10;
score += 5;
score *= 2;
score--;`;
      let state = createExecutionState(code);
      while (!state.isFinished) {
        state = executeNext(state);
      }
      assert.equal(state.variables.score, 29); // ((10 + 5) * 2) - 1 = 29
      assert.equal(state.errors.length, 0);
    });

    it("handles object and array mutations", () => {
      const code = `let user = { name: "Bob", level: 1 };
user.level += 1;
let items = [10, 20, 30];
items[0] = 99;`;
      let state = createExecutionState(code);
      while (!state.isFinished) {
        state = executeNext(state);
      }
      assert.deepEqual(state.variables.user, { name: "Bob", level: 2 });
      assert.deepEqual(state.variables.items, [99, 20, 30]);
      assert.equal(state.errors.length, 0);
    });

    it("handles multi-argument console.log", () => {
      const code = `let x = 42;
console.log("The answer is", x);`;
      let state = createExecutionState(code);
      while (!state.isFinished) {
        state = executeNext(state);
      }
      assert.equal(state.logs.length, 1);
      assert.equal(state.logs[0], "The answer is 42");
    });

    it("pauses execution at breakpoints", () => {
      const code = `let line1 = 1;
let line2 = 2;
let line3 = 3;`;
      let state = createExecutionState(code);
      state.breakpoints = [1]; // Breakpoint at line index 1 (line 2)

      state = executeNext(state); // Executes line 0 -> reaches line 1
      assert.equal(state.currentLine, 1);
      assert.equal(state.variables.line1, 1);

      // Next step attempts to execute line 1, but stops because of breakpoint
      const pausedState = executeNext(state);
      assert.equal(pausedState.currentLine, 1); // Remains paused on line 1

      // Now set continuing = true
      pausedState.isContinuing = true;
      const resumed = executeNext(pausedState);
      assert.equal(resumed.currentLine, 2);
      assert.equal(resumed.variables.line2, 2);
    });

    it("captures runtime errors gracefully without crashing", () => {
      const code = `let valid = 100;
let invalid = nonexistentVar + 1;
let nextValid = 200;`;
      let state = createExecutionState(code);
      while (!state.isFinished) {
        state = executeNext(state);
      }
      assert.equal(state.variables.valid, 100);
      assert.equal(state.errors.length, 1);
      assert.match(state.errors[0], /ReferenceError: nonexistentVar is not defined/);
      assert.equal(state.variables.nextValid, 200);
    });
  });
});

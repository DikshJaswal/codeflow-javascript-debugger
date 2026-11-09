export type CodeExample = {
  id: string;
  name: string;
  description: string;
  code: string;
};

export const CODE_EXAMPLES: CodeExample[] = [
  {
    id: "tour",
    name: "🚀 Complete Debugger Tour",
    description: "Variables, arithmetic, reassignments, mutations, and logging",
    code: `// Welcome to CodeFlow - Interactive Visual Debugger!
let counter = 10;
const multiplier = 2;

// Arithmetic & Reassignments
counter += 5;
let total = counter * multiplier;
console.log("Initial total:", total);

// Arrays & Element Mutation
let scores = [85, 92, 78];
scores[0] = 95;
console.log("Updated scores array:", scores);

// Objects & Property Access
let player = { name: "Alex", level: 1, rank: "Silver" };
player.level += 1;
player.rank = "Gold";
console.log("Player profile:", player.name, "is now level", player.level);`,
  },
  {
    id: "mutation",
    name: "📦 Objects & Array Mutation",
    description: "Watch complex nested data update in real time",
    code: `// Complex Objects & Arrays in CodeFlow
let cart = {
  user: "Sarah",
  items: [19.99, 45.00, 12.50],
  discount: 10
};

// Access array elements & properties
let firstItem = cart.items[0];
let subtotal = cart.items[0] + cart.items[1] + cart.items[2];

// Mutate object values
cart.items[1] = 39.99;
cart.discount += 5;

console.log("Customer:", cart.user);
console.log("Subtotal:", subtotal);
console.log("Discount Applied:", cart.discount);`,
  },
  {
    id: "breakpoints",
    name: "🛑 Breakpoints & Continue",
    description: "Test clicking line numbers in the gutter to pause and resume",
    code: `// Set a breakpoint by clicking line 4 or line 8 in the gutter!
let step1 = "Starting pipeline...";
console.log(step1);

let step2 = "Processing data chunks...";
console.log(step2);

let step3 = "Validating checksums...";
console.log(step3);

let finalStatus = "Pipeline executed successfully!";
console.log(finalStatus);`,
  },
  {
    id: "exceptions",
    name: "⚠️ Error Catching & Diagnostics",
    description: "See how CodeFlow catches runtime & reference errors",
    code: `// CodeFlow catches syntax and reference errors cleanly
let score = 100;
let bonus = 50;
let totalScore = score + bonus;
console.log("Score so far:", totalScore);

// The next line references an undeclared variable
let invalid = undeclaredVariable + 10;

// Execution continues inspecting available state
console.log("Done checking!");`,
  },
];

// Test file for Type Safety validation - SHOULD FAIL
// Intentional violations:
// 1. Using 'any' type
// 2. Missing return type annotations

const testAny: any = "this should fail"; // Violation: using 'any'

function missingReturnType() { // Violation: missing return type
  return "test";
}

function properTyping(): string { // Correct: has return type
  return "test";
}

interface TestInterface {
  id: number;
  name: string;
}

const obj: TestInterface = {
  id: 1,
  name: "test"
};
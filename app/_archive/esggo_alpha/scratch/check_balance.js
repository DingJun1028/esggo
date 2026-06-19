
import fs from 'fs';

const content = fs.readFileSync('c:/Project/esggo_alpha/lib/context/app-context.tsx', 'utf8');
let balance = 0;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let char of line) {
    if (char === '{') balance++;
    if (char === '}') balance--;
  }
  if (balance < 0) {
    console.log(`Brace balance became negative at line ${i + 1}`);
    break;
  }
}
console.log(`Final brace balance: ${balance}`);

let parenBalance = 0;
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let char of line) {
    if (char === '(') parenBalance++;
    if (char === ')') parenBalance--;
  }
  if (parenBalance < 0) {
    console.log(`Paren balance became negative at line ${i + 1}`);
    break;
  }
}
console.log(`Final paren balance: ${parenBalance}`);

let bracketBalance = 0;
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let char of line) {
    if (char === '[') bracketBalance++;
    if (char === ']') bracketBalance--;
  }
  if (bracketBalance < 0) {
    console.log(`Bracket balance became negative at line ${i + 1}`);
    break;
  }
}
console.log(`Final bracket balance: ${bracketBalance}`);

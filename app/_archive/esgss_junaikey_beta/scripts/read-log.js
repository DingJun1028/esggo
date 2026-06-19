const fs = require('fs');
const content = fs.readFileSync('scripts/awakening_result_v2.log', 'utf16le');
console.log(content);

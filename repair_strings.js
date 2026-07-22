const fs = require('fs');
const filePath = 'c:/Project/esggo/components/views/system/guide-view.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix unterminated string literals specifically in the CHAPTER_CONTENT structure
// Look for lines that start with property names and end with a " but no ,
const lines = content.split('\n');
let fixedLines = lines.map((line, index) => {
    // If a line contains "..." but doesn't end with a " (ignoring whitespace)
    // or has corrupted characters at the end
    if (line.includes('purpose: "') && !line.trim().endsWith('"') && !line.trim().endsWith('",')) {
        return line.trim() + '",';
    }
    if (line.includes('why: "') && !line.trim().endsWith('"') && !line.trim().endsWith('",')) {
        return line.trim() + '",';
    }
    if (line.includes('template: "') && !line.trim().endsWith('"') && !line.trim().endsWith('",')) {
        return line.trim() + '",';
    }
    return line;
});

// Also fix lines that end with corrupted characters or missing commas
// Example: content: "..."
fixedLines = fixedLines.map(line => {
    if (line.trim().match(/^[a-zA-Z]+: "[^"]+$/)) {
        return line.trim() + '",';
    }
    return line;
});

// Join back
content = fixedLines.join('\n');

// Specific fix for line 343-344 area based on previous logs
// content: "?砍? 
// ],{.6 瘞貊??勗?銋 : "?
// Reconstructing the possible broken object
const brokenChapterMatch = /"([0-9\.]+ [^"]+)":\s*{[^}]*items:\s*\[\s*\]/g;
// Actually, it's easier to just replace known broken snippets if they match.

fs.writeFileSync(filePath, content, 'utf8');
console.log('Surgically repaired string literals.');

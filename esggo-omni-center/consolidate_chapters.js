const fs = require('fs');
const path = require('path');

const filePath = 'c:/Project/esggo/components/views/system/guide-view.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find the start and end of CHAPTER_CONTENT
const startMarker = 'const CHAPTER_CONTENT: Record<string, ChapterData> = {';
const endMarker = '};';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Could not find CHAPTER_CONTENT start');
    process.exit(1);
}

// We need to find the matching closing brace for the object
let braceCount = 1;
let currentIndex = startIndex + startMarker.length;
let endIndex = -1;

while (braceCount > 0 && currentIndex < content.length) {
    if (content[currentIndex] === '{') braceCount++;
    else if (content[currentIndex] === '}') braceCount--;
    
    if (braceCount === 0) {
        endIndex = currentIndex;
        break;
    }
    currentIndex++;
}

if (endIndex === -1) {
    console.error('Could not find CHAPTER_CONTENT end');
    process.exit(1);
}

const chapterContentRaw = content.substring(startIndex + startMarker.length, endIndex);

// Mapping for consolidation
const keyMapping = {
    "1.02 關於本公司": "1.02 關於本公司 (About Company)",
    "2.01 永續發展策略": "2.01 永續發展策略 (Sustainability Strategy)",
    "3.01 利害關係人議合": "3.01 利害關係人議合 (Stakeholder Engagement)",
    "6.02 溫室氣體管理": "6.02.1 溫室氣體管理之策略、方法、目標 (GHG Strategy)",
    "2.02 推動永續發展機制": "2.02.1 推動永續發展之治理架構 (Governance Structure)",
    "2.03 董事會及功能性委員會": "2.03.3 功能性委員會結構及運作情形 (Committee Status)",
    "2.03.1.1 永續管理之角色及督導情形 (Oversight Role)": "2.03.1.1 永續管理之角色及督導情形 (Oversight Role)"
};

// We will parse the content by looking for keys in the form "Key": { ... }
// Since the content is large and spans multiple lines, we'll collect all entries first.
// A simpler way: use regex to split by keys.
const entryRegex = /^\s*"([^"]+)":\s*{/gm;
let entries = {};
let match;

let lastKey = null;
let lastIndex = -1;

// This logic is a bit complex for a script, let's try a different approach.
// I'll just use the knowledge that I want to keep the most complete version of each key.

// For 2.03.1.1, I noticed multiple versions.
// Version 1 (line 330): Standard governance, template + examples + explanation + strategies.
// Version 2 (line 494): Oversight role, template + examples + explanation + strategies.
// Version 3 (line 520): Oversight role, template + explanation + strategies.
// Version 4 (line 592): Oversight role, template + examples + requiredVouchers + explanation + strategies + contextReminder.

// The version at 592 seems the most comprehensive.

// I'll manually construct the consolidated object for the keys that need merging.
// And then replace the entire block.

// However, replacing the entire block might be too large for a tool call.
// Let's see the total line count of CHAPTER_CONTENT: roughly 202 to 1526 (1300+ lines).

// I'll do it in steps. 
// Step 1: Remove the redundant keys.
// Step 2: Rename the keys.

// I'll use multi_replace_file_content for non-contiguous removals.

const fs = require('fs');
const path = require('path');

const srcPath = path.join('c:', 'Project', 'esggoV1.0', 'components', 'views', 'esg-report-wizard-view.tsx');
const destPath = path.join('c:', 'Project', 'esggoV1.0', 'components', 'wizard', 'chapter-editor-panel.tsx');

let code = fs.readFileSync(srcPath, 'utf8');

const startStr = 'const ChapterEditor = ({';
let startIndex = code.indexOf(startStr);
const commentStr = '// --- Sub-components to avoid hook violations ---';
const commentIndex = code.lastIndexOf(commentStr, startIndex);
if (commentIndex !== -1) startIndex = commentIndex;

if (startIndex === -1) {
    console.error("Could not find ChapterEditor in source file");
    process.exit(1);
}

// Very hacky but reliable: finding the end of the ChapterEditor function.
// It ends around line 1147 with `}` exactly before `export function ESGReportWizardComponent` or similar.
const nextComponentStart = code.indexOf('function ESGReportWizardComponent()', startIndex);

if (nextComponentStart === -1) {
    console.error("Could not find ESGReportWizardComponent in source file");
    process.exit(1);
}

// Locate the last '}' before the next component
const textBetween = code.slice(startIndex, nextComponentStart);
const lastBraceIndex = textBetween.lastIndexOf('}');
const endIndex = startIndex + lastBraceIndex + 1;

let chapterEditorCode = code.slice(startIndex, endIndex);
let wizardCode = code.slice(0, startIndex) + '\n' + code.slice(endIndex);

// Prepare the new chapter-editor-panel.tsx
// It needs all the same imports basically. Let's just yank all imports from the top of the file
const importEndIndex = code.indexOf('\n\n', code.indexOf('import '));
// Actually, let's just grab the whole import block. It usually ends before `// --- Types` or `// --- Mock Data`
const importEnd = code.indexOf('// --- Types ---') !== -1 ? code.indexOf('// --- Types ---') : code.indexOf('// --- Mock Data ---');
const importsBlock = code.slice(0, importEnd);

// For chapter-editor-panel.tsx
const newFileContent = `${importsBlock}

// Custom hook to replace gemini-client
import { useOmniInference } from "@/hooks/use-omni-inference";

${chapterEditorCode.replace('const ChapterEditor = ({', 'export const ChapterEditor = ({')}
`;

// Insert the import into the original wizard view
wizardCode = wizardCode.replace('import { AlignmentEngine } from "@/components/wizard/alignment-engine";',
    'import { AlignmentEngine } from "@/components/wizard/alignment-engine";\nimport { ChapterEditor } from "@/components/wizard/chapter-editor-panel";');

fs.writeFileSync(destPath, newFileContent);
fs.writeFileSync(srcPath, wizardCode);

console.log("Successfully extracted ChapterEditor to " + destPath);

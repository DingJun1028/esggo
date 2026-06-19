// File: jun-ai-key/src/generator.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { createResonanceStream } from './api.js';
// 用於提取 "### FILE: filename" 及其後的代碼塊
// 格式要求：
// ### FILE: <path>
// ```<lang>
// <code>
// ```
const FILE_REGEX = /### FILE: (.+)\n```[\w]*\n([\s\S]*?)```/g;
export const generateCode = async (prompt) => {
console.log(chalk.dim(`\n⚡ Manifesting artifacts based on: "${prompt}"...`));
// 強制注入 System Prompt，要求 AI 遵守神聖格式
const systemPromptOverride = `
[SYSTEM DIRECTIVE: CODE GENERATION MODE]
You are a Code Generator. Your ONLY goal is to output file content based on the user's request.
FORMAT RULES:
For every file you want to create, you MUST use this format strictly:
### FILE: <path/to/filename.ext>
\`\`\`<language>
<code content>
\`\`\`
- Do not output conversational filler text.
- Focus on correctness and completeness.
- If modifying an existing project, assume current directory context.
`;
const fullPrompt = `${systemPromptOverride}\n\nUSER REQUEST: ${prompt}`;
const spinner = ora('Architecting solution...').start();
let buffer = '';
try {
// 呼叫 API (複用 api.js 的串流接口)
const response = await createResonanceStream(fullPrompt);
const stream = response.data;
// 接收串流並組裝
stream.on('data', chunk => {
const lines = chunk.toString().split('\n');
lines.forEach(line => {
if (line.startsWith('data: ')) {
try {
const event = JSON.parse(line.substring(6));
if (event.type === 'text') {
buffer += event.content;
spinner.text = `Receiving transmission... (${buffer.length} bytes)`;
}
} catch (e) {}
}
});
});
// 等待串流結束
await new Promise((resolve, reject) => {
stream.on('end', resolve);
stream.on('error', reject);
});
spinner.stop();
console.log(chalk.dim('\n--- Transmission Complete ---\n'));
// --- 解析檔案 ---
let match;
const filesToCreate = [];
// 重置 Regex 索引
FILE_REGEX.lastIndex = 0;
while ((match = FILE_REGEX.exec(buffer)) !== null) {
filesToCreate.push({
path: match[1].trim(),
content: match[2] // Regex group 2 是代碼本體
});
}
if (filesToCreate.length === 0) {
console.log(chalk.yellow('⚠ No valid file artifacts detected.'));
console.log(chalk.dim('Raw Output Preview:\n' + buffer.substring(0, 500) + '...'));
return;
}
// --- 神聖裁決 (HITL) ---
console.log(chalk.bold.cyan(`📦 Proposed Artifacts:`));
filesToCreate.forEach(f => console.log(chalk.green(` + ${f.path}`)));
console.log('');
const { confirm } = await inquirer.prompt([{
type: 'confirm',
name: 'confirm',
message: 'Do you wish to materialize these files into your reality?',
default: false
}]);
if (confirm) {
filesToCreate.forEach(file => {
const targetPath = path.resolve(process.cwd(), file.path);
// 確保目錄存在
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
// 寫入檔案
fs.writeFileSync(targetPath, file.content, 'utf-8');
console.log(chalk.green(`✔ Created: ${file.path}`));
});
console.log(chalk.bold.green('\n✨ Manifestation Complete.'));
} else {
console.log(chalk.dim('❌ Manifestation Cancelled.'));
}
} catch (error) {
spinner.fail('Generation Failed');
console.error(chalk.red(error.message));
}
};
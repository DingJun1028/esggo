// File: jun-ai-key/src/chat.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createResonanceStream } from './api.js';
export const startChatSession = async () => {
console.log(chalk.dim('🔌 Neural link established.\n'));
while (true) {
const { message } = await inquirer.prompt([{ type: 'input', name: 'message', message: chalk.cyan('YOU >') }]);
if (message === 'exit') break;
try {
const response = await createResonanceStream(message);
const stream = response.data;
process.stdout.write(chalk.yellow('AI > '));
stream.on('data', chunk => {
const lines = chunk.toString().split('\n');
lines.forEach(line => {
if (line.startsWith('data: ')) {
try {
const event = JSON.parse(line.substring(6));
if (event.type === 'text') process.stdout.write(event.content);
} catch (e) {}
}
});
});
await new Promise((resolve, reject) => {
stream.on('end', resolve);
stream.on('error', reject);
});
console.log('\n');
} catch (e) {
console.error(chalk.red(e.message));
}
}
};
#!/usr/bin/env node
// File: jun-ai-key/index.js
import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { checkSystemHealth } from './src/api.js';
import { startChatSession } from './src/chat.js';
import { generateCode } from './src/generator.js';
const program = new Command();
const showBanner = () => {
console.log(boxen(chalk.bold.cyan(' 🗝 J U N - A I - K E Y ') + '\n The Omnipotent Developer Companion', { padding: 1, borderStyle: 'round', borderColor: 'cyan' }));
};
program.name('jak').version('2.0.0');
program.command('status').action(async () => {
showBanner();
const health = await checkSystemHealth();
console.log(health ? chalk.green('✔ System Operational') : chalk.red('✘ System Offline'));
});
program.command('chat').action(() => {
showBanner();
startChatSession();
});
program.command('generate <prompt>').action((prompt) => {
generateCode(prompt);
});
program.command('swarm <prompt>').action(async (prompt) => {
console.log(chalk.yellow('🐝 Deploying Swarm... (This allows long-running tasks)'));
// 這裡可以呼叫 api.js 的 post('/swarm') 並實作輪詢邏輯
});
program.parse(process.argv);
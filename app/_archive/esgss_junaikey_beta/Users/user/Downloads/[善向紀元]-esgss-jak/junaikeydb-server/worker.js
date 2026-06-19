// File: celestial-server/worker.js
require('dotenv').config();
const { Worker } = require('bullmq');
const SwarmOrchestrator = require('./utils/SwarmOrchestrator');
const swarm = new SwarmOrchestrator(process.env.GEMINI_API_KEY);
console.log('⏳JunAiKey DB Worker is watching the sands of time...');
const worker = new Worker('skills', async job => {
console.log(`[WORKER] Processing job ${job.id}: ${job.name}`);
// 1. 蜂巢任務 (Swarm)
if (job.name === 'swarm-execution') {
const { prompt } = job.data;
return await swarm.executeSwarm(prompt);
}
// 2. 排程任務 (Time Lord)
if (job.name === 'scheduled-agent-task') {
const { prompt } = job.data;
console.log(`[TIME LORD] Executing: ${prompt}`);
// 這裡可以整合 Gemini 執行具體邏輯，或發送通知
return `Executed: ${prompt}`;
}
// 3. 一般技能 (Mock)
return { status: 'executed', skill: job.name };
}, {
connection: { host: 'redis', port: 6379 }
});
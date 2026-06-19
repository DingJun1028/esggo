// File: celestial-server/utils/SwarmOrchestrator.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
class SwarmOrchestrator {
constructor(apiKey) {
this.genAI = new GoogleGenerativeAI(apiKey);
this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}
async executeSwarm(userRequest) {
console.log(`[HIVE] Awakening Swarm for: "${userRequest}"`);
// 1. PM 規劃
const pmPrompt = `As a Tech Lead, list necessary files (JSON format) to build: ${userRequest}. Format: { "files": [{"path": "...", "desc": "..."}] }`;
const pmRes = await this.model.generateContent(pmPrompt);
const planText = pmRes.response.text().replace(/```json|```/g, '').trim();
let plan;
try { plan = JSON.parse(planText); } catch(e) { plan = { files: [] }; }
let output = `[SWARM REPORT]\nPlan: ${plan.files.length} files.\n\n`;
// 2. Coder 執行
for (const file of plan.files) {
console.log(`[HIVE] Coding ${file.path}...`);
const codePrompt = `Write complete code for file "${file.path}". Desc: ${file.desc}. Wrap in markdown.`;
const codeRes = await this.model.generateContent(codePrompt);
output += `### FILE: ${file.path}\n${codeRes.response.text()}\n\n`;
}
return output;
}
}
module.exports = SwarmOrchestrator;
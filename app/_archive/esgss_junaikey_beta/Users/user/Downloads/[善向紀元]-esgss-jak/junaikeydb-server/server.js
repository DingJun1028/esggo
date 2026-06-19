// File: celestial-server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Queue } = require('bullmq');
const MemoryManager = require('./utils/MemoryManager');

// --- 初始化 ---
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 資料庫連線
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Redis 隊列
const skillQueue = new Queue('skills', {
connection: { host: 'redis', port: 6379 }
});

// AI 核心
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const memoryManager = new MemoryManager(process.env.GEMINI_API_KEY);

// --- Middleware: 安全驗證 ---
const authMiddleware = (req, res, next) => {
const token = req.headers['x-celestial-token'];
if (token !== process.env.ADMIN_SECRET) {
return res.status(403).json({ error: 'Unauthorized: Divine Access Only' });
}
next();
};

// --- API 1: 顯現 (Manifest - Init Session) ---
app.post('/api/manifest', authMiddleware, async (req, res) => {
res.json({ sessionId: 'session_' + Date.now(), status: 'manifested' });
});

// --- API 2: 學習 (Learn - RAG Ingest) ---
app.post('/api/learn', authMiddleware, async (req, res) => {
const { kbId, text, source, payload } = req.body;
try {
console.log(`[LEARN] Ingesting from: ${source}`);
const model = genAI.getGenerativeModel({ model: "embedding-001" });
const result = await model.embedContent(text);
const embedding = result.embedding.values;
const vectorString = `[${embedding.join(',')}]`;
await pool.query(
`INSERT INTO knowledge_chunks (content, embedding, metadata) VALUES ($1, $2, $3)`,
[text, vectorString, { source, kbId, payload }]
);
res.json({ status: 'engraved', source });
} catch (e) {
console.error(e);
res.status(500).json({ error: e.message });
}
});

// --- API 3: 共鳴 (Interact - Chat with RAG) ---
app.get('/api/interact', authMiddleware, async (req, res) => {
const { sessionId, message } = req.query;
// 設定 SSE Headers
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
try {
// 1. RAG 檢索
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
const embResult = await embeddingModel.embedContent(message);
const vectorStr = `[${embResult.embedding.values.join(',')}]`;
const ragQuery = await pool.query(
`SELECT content, metadata FROM knowledge_chunks ORDER BY embedding <-> $1 LIMIT 3`,
[vectorStr]
);
const context = ragQuery.rows.map(r => r.content).join('\n---\n');
// 2. 構建 Prompt
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const systemPrompt = `You are JunAiKey. Use the following context to answer.\nContext:\n${context}`;
// 3. 串流回答
const result = await model.generateContentStream([
{ role: 'user', parts: [{ text: systemPrompt + `\n\nUser: ${message}` }] }
]);
for await (const chunk of result.stream) {
const chunkText = chunk.text();
res.write(`data: ${JSON.stringify({ type: 'text', content: chunkText })}\n\n`);
}
res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
res.end();
} catch (e) {
res.write(`data: ${JSON.stringify({ type: 'error', content: e.message })}\n\n`);
res.end();
}
});

// --- API 4: 執行技能 (Execute Skill) ---
app.post('/api/execute-skill', authMiddleware, async (req, res) => {
const { skill } = req.body;
// 推入隊列
const job = await skillQueue.add(skill.name, skill);
res.json({ status: 'queued', jobId: job.id });
});

// --- API 5: 蜂巢意識 (Swarm) ---
app.post('/api/swarm', authMiddleware, async (req, res) => {
const { prompt } = req.body;
const job = await skillQueue.add('swarm-execution', { prompt });
res.json({ status: 'swarm_deployed', jobId: job.id });
});

// --- API 6: 查詢任務狀態 ---
app.get('/api/job/:id', authMiddleware, async (req, res) => {
const job = await skillQueue.getJob(req.params.id);
if (!job) return res.status(404).json({ status: 'not_found' });
const state = await job.getState();
res.json({ status: state, result: job.returnvalue });
});

app.listen(3000, () => console.log('🗝 JunAiKey DB 万能智庫 Server Online on port 3000'));
// celestial-server/server.js
// Omnipotent Think Tank - Neural Core API Server

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool, { query, healthCheck as dbHealthCheck, initializeDatabase } from './db/index.js';
import ragService from './services/rag.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support large payloads for images

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory session storage (will be replaced with Redis later)
const sessions = new Map();

// Session Cleanup Ticker (Every 30 minutes)
const SESSION_TTL = 3600000; // 1 hour
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > SESSION_TTL) {
      sessions.delete(id);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[LEGACY SYSTEM] ?摰?Cleaned ${cleaned} expired sessions`);
  }
}, 1800000); // 30 mins

// ============================================================================
// STARTUP: Initialize Database
// ============================================================================
(async () => {
  await initializeDatabase();
})();

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/api/health', async (req, res) => {
  const dbHealth = await dbHealthCheck();

  res.json({
    status: 'online',
    service: 'Celestial Neural Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    sessions: sessions.size,
    database: dbHealth,
  });
});

// ============================================================================
// 1. MANIFESTATION API - Create Agent Session
// ============================================================================
app.post('/api/manifest', async (req, res) => {
  const { source_agent, overrides } = req.body;

  if (!source_agent) {
    return res.status(400).json({ error: 'source_agent is required' });
  }

  try {
    // Generate unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // Fetch agent from database if ID provided
    let agentData = source_agent;
    if (typeof source_agent === 'string') {
      const result = await query('SELECT * FROM agents WHERE id = $1 OR name = $1', [source_agent]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      agentData = result.rows[0];
    }

    // Build System Instruction (?∵筆???)
    const systemInstruction = `
?遴????踐? "${agentData.name || agentData.metadata?.name || 'AI Assistant'}"??${agentData.system_prompt || agentData.directives?.system_prompt || ''}

[????桀??]
?止等?? ${overrides?.mask?.tone || 'Professional'}
?止筆?: ${overrides?.mask?.language || 'zh-TW'}

[?荒???秋?]
1. ?????????????對???????瞍??豲??????2. ?遴???豲?????對???脯??<thought>...</thought> XML ??????3. ?豲???賹????岳?暹???????豯???4. ??????秋撩???豢扔????ｇ????<skill_call>{"name": "...", "params": {...}}</skill_call>??`;

    // Create Gemini model instance
    const model = genAI.getGenerativeModel({
      model: agentData.base_model || 'gemini-2.0-flash',
      systemInstruction: systemInstruction,
    });

    // Start chat session
    const chat = model.startChat({
      history: [],
    });

    // Store session
    sessions.set(sessionId, {
      chat,
      agentId: agentData.id,
      agentName: agentData.name || agentData.metadata?.name,
      kbId: agentData.kb_id || overrides?.kb_id,
      createdAt: Date.now(),
    });

    // Store session in database
    await query(
      `INSERT INTO sessions (id, agent_id, kb_id, metadata, expires_at)
             VALUES ($1, $2, $3, $4, NOW() + INTERVAL '1 hour')`,
      [sessionId, agentData.id, agentData.kb_id, JSON.stringify(overrides || {})]
    );

    console.log(`[MANIFEST] ??Created session: ${sessionId} for ${agentData.name}`);

    res.json({
      sessionId,
      status: 'Awakened',
      agentName: agentData.name,
      agentId: agentData.id,
    });
  } catch (error) {
    console.error('[MANIFEST] ??Error:', error);
    res.status(500).json({ error: 'Manifestation failed', details: error.message });
  }
});

// ============================================================================
// 2. INTERACTION API - SSE Streaming Chat with RAG
// ============================================================================
app.get('/api/interact', async (req, res) => {
  const { sessionId, message } = req.query;

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found or expired' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    console.log(`[INTERACT] ???${session.agentName}: "${message}"`);

    // RAG: Retrieve relevant context if KB is configured
    let ragContext = [];
    if (session.kbId) {
      try {
        ragContext = await ragService.retrieveRelevant(session.kbId, message, 3);
        console.log(`[RAG] ?? Retrieved ${ragContext.length} relevant chunks`);

        // Send RAG context to client
        res.write(
          `data: ${JSON.stringify({
            type: 'rag_context',
            content: ragContext.map(c => ({ content: c.content, similarity: c.similarity })),
          })}\\n\\n`
        );
      } catch (error) {
        console.error('[RAG] ?蹎? Retrieval failed:', error);
      }
    }

    // Augment message with RAG context
    let augmentedMessage = message;
    if (ragContext.length > 0) {
      const contextText = ragContext.map(c => c.content).join('\\n\\n');
      augmentedMessage = `[?鞈??鈭??冽?圈?\\n${contextText}\\n\\n[??踝????]\\n${message}`;
    }

    const result = await session.chat.sendMessageStream(augmentedMessage);

    let buffer = '';
    let isThinking = false;
    let skillCalls = [];

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      buffer += chunkText;

      // Parse <thought> tags
      if (chunkText.includes('<thought>')) {
        isThinking = true;
      }

      if (isThinking) {
        const cleanText = chunkText.replace('<thought>', '').replace('</thought>', '');
        if (cleanText.trim()) {
          res.write(`data: ${JSON.stringify({ type: 'thought', content: cleanText })}\\n\\n`);
        }
      } else if (chunkText.includes('<skill_call>')) {
        // Parse skill call
        const match = buffer.match(/<skill_call>(.*?)<\/skill_call>/s);
        if (match) {
          try {
            const skillCall = JSON.parse(match[1]);
            skillCalls.push(skillCall);
            res.write(`data: ${JSON.stringify({ type: 'skill_call', content: skillCall })}\\n\\n`);
          } catch (e) {
            console.error('[SKILL] Parse error:', e);
          }
        }
      } else {
        res.write(`data: ${JSON.stringify({ type: 'text', content: chunkText })}\\n\\n`);
      }

      if (chunkText.includes('</thought>')) {
        isThinking = false;
      }
    }

    // Store conversation in database
    await query(
      `INSERT INTO conversations (session_id, agent_id, user_message, agent_response, skill_calls, rag_context)
             VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        sessionId,
        session.agentId,
        message,
        buffer,
        JSON.stringify(skillCalls),
        JSON.stringify(ragContext.map(c => ({ id: c.id, similarity: c.similarity }))),
      ]
    );

    res.end();
  } catch (error) {
    console.error('[INTERACT] ??Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', content: 'Neural Link Ruptured' })}\\n\\n`);
    res.end();
  }
});

// ============================================================================
// 3. LEARNING API - Knowledge Ingestion
// ============================================================================
app.post('/api/learn', async (req, res) => {
  const { kbId = 'default', text, source, metadata = {} } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No content provided' });
  }

  try {
    console.log(`[LEARN] ?? Ingesting knowledge from: ${source}`);

    // Use RAG service to ingest
    const result = await ragService.ingestKnowledge(kbId, text, { ...metadata, source });

    res.json({
      status: 'success',
      message: 'Knowledge ingested successfully',
      chunkId: result.id,
      source,
    });
  } catch (error) {
    console.error('[LEARN] ??Error:', error);
    res.status(500).json({ error: 'Knowledge ingestion failed', details: error.message });
  }
});

// ============================================================================
// 4. KNOWLEDGE SEARCH API
// ============================================================================
app.get('/api/knowledge/search', async (req, res) => {
  const { kbId, query: searchQuery, topK } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const results = await ragService.retrieveRelevant(
      kbId,
      searchQuery,
      topK ? parseInt(topK) : undefined
    );

    res.json({
      status: 'success',
      query: searchQuery,
      results: results.map(r => ({
        id: r.id,
        content: r.content,
        similarity: r.similarity,
        metadata: r.metadata,
        source: r.source,
      })),
    });
  } catch (error) {
    console.error('[SEARCH] ??Error:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

// ============================================================================
// 5. AGENT MANAGEMENT APIs
// ============================================================================
app.get('/api/agents', async (req, res) => {
  try {
    const result = await query('SELECT * FROM agent_full_info ORDER BY name');
    res.json({ agents: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

app.get('/api/agents/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM agent_full_info WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use((err, req, res, next) => {
  console.error('?? Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`
?????????????????????????????????????????????????????????????????????????????????????????????????                                             ????  ?? CELESTIAL NEURAL CORE                   ????  Omnipotent Think Tank v1.0.0               ????                                             ????  Status: ONLINE                             ????  Port: ${PORT}                                  ????  Environment: ${process.env.NODE_ENV || 'development'}                  ????  RAG: ENABLED                               ????  Database: CONNECTED                        ????                                             ?????????????????????????????????????????????????????????????????????????????????????????????????  `);

  if (!process.env.GEMINI_API_KEY) {
    console.warn('?蹎?  WARNING: GEMINI_API_KEY not set in environment');
  }

  if (!process.env.VECTOR_DB_PASSWORD) {
    console.warn('?蹎?  WARNING: VECTOR_DB_PASSWORD not set in environment');
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Celestial Neural Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    sessions: sessions.size,
  });
});

// ============================================================================
// 1. MANIFESTATION API - Create Agent Session
// ============================================================================
app.post('/api/manifest', (req, res) => {
  const { source_agent, overrides } = req.body;

  if (!source_agent) {
    return res.status(400).json({ error: 'source_agent is required' });
  }

  // Generate unique session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // Build System Instruction (?∵筆???)
  const systemInstruction = `
?遴????踐? "${source_agent.metadata?.name || 'AI Assistant'}"??${source_agent.directives?.system_prompt || ''}

[????桀??]
?止等?? ${overrides?.mask?.tone || 'Professional'}
?止筆?: ${overrides?.mask?.language || 'zh-TW'}

[?荒???秋?]
1. ?????????????對???????瞍??豲??????2. ?遴???豲?????對???脯??<thought>...</thought> XML ??????3. ?豲???賹????岳?暹???????豯???4. ??????秋撩???豢扔????ｇ????<skill_call>{"name": "...", "params": {...}}</skill_call>??`;

  // Create Gemini model instance
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemInstruction,
  });

  // Start chat session
  const chat = model.startChat({
    history: [],
  });

  // Store session
  sessions.set(sessionId, {
    chat,
    agentName: source_agent.metadata?.name || 'Unknown',
    createdAt: Date.now(),
  });

  console.log(`[MANIFEST] ??Created session: ${sessionId} for ${source_agent.metadata?.name}`);

  res.json({
    sessionId,
    status: 'Awakened',
    agentName: source_agent.metadata?.name,
  });
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================
async function gracefulShutdown(signal) {
  console.log(`\n[LEGACY SYSTEM] ?? Received ${signal}. Starting graceful shutdown...`);

  try {
    console.log('[LEGACY SYSTEM] ?? Closing Database Pool...');
    await pool.end();
    console.log('[LEGACY SYSTEM] ??Database Pool closed.');
  } catch (err) {
    console.error('[LEGACY SYSTEM] ??Error closing DB pool:', err);
  }

  console.log('[LEGACY SYSTEM] ?? Legacy Core offline. Goodbye.');
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`
?????????????????????????????????????????????????????????????????????????????????????????????????                                             ????  ?? CELESTIAL NEURAL CORE (LEGACY)          ????  Omnipotent Think Tank v1.0.0               ????                                             ????  Status: ONLINE                             ????  Port: ${PORT}                                  ????  Environment: ${process.env.NODE_ENV || 'development'}                  ????                                             ?????????????????????????????????????????????????????????????????????????????????????????????????  `);

  if (!process.env.GEMINI_API_KEY) {
    console.warn('?蹎?  WARNING: GEMINI_API_KEY not set in environment');
  }
});

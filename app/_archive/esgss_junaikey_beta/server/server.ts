// server/server.js
// Omnipotent Think Tank - Neural Core API Server

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// [CRITICAL] Load env vars BEFORE any other imports that might use them
dotenv.config({ path: path.join(__dirname, '../.env') });
// Also try loading from root if above fails or to be safe
dotenv.config();


// [GUARDIAN] Global Error Handlers to prevent background crashes
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
  // Give logger a chance to flush if it exists
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiRateLimiter, readLimiter, writeLimiter, sensitiveOperationLimiter, uploadLimiter, slowDownMiddleware, aiChatLimiter } from './middleware/rateLimitersEnhanced.ts';
import pool, { query, healthCheck as dbHealthCheck, initializeDatabase } from './db/index.ts';
import ragService from './services/rag.ts';
import redisService from './services/redisService.ts';
import { cacheMiddleware, invalidateCache } from './middleware/cacheMiddleware.ts';
import { getMetrics } from './controllers/metricsController.ts';
import { getSystemStats } from './controllers/cacheStatsController.ts';
import { getGlobalNews } from './services/newsService.ts';
import amiceService from './services/amice.ts';
import sessionService from './services/sessionService.ts';
import { runSwarm } from './services/swarmService.ts';
import blockchainService from './services/blockchain.ts';
import zkpService from './services/zkpService.ts';
import omniAgentService from './services/omniAgentService.ts';
import agentRoutes from './routes/agentRoutes.ts';
import evidenceRoutes from './routes/evidenceRoutes.ts';
import profileRoutes from './routes/profileRoutes.ts';
import taskRoutes from './routes/taskRoutes.ts';
import junAiKeyRoutes from './api/jun-ai-key.ts';
import marketIntelligenceRoutes from './routes/marketIntelligenceRoutes.ts';
import visualizerRoutes from './routes/visualizerRoutes.ts';
import behaviorRoutes from './routes/behaviorRoutes.ts';
import unifiedAdvancementRoutes from './src/routes/unifiedAdvancementRoutes.ts';
import junaikeyServiceRoutes from './routes/junaikey.ts';
import gameRoutes from './routes/gameRoutes.ts';
import aiProxyRoutes from './routes/aiProxyRoutes.ts';
import skillRoutes from './routes/JunAiKey_Skills.ts';
import crmRoutes from './routes/JunAiKey_Skills_(OmniCRM).ts';
import syncRoutes from './routes/JunAiKey_Skills_(OmniSync).ts';
import tableRoutes from './routes/JunAiKey_Skills_(OmniTable).ts';
import spaceRoutes from './routes/JunAiKey_Skills_(OmniSpace).ts';
import authRoutes from './routes/JunAiKey_Skills_(OmniAuth).ts';
import keyRoutes from './routes/JunAiKey_Skills_(OmniKey).ts';
import omniSyncRoutes from './routes/omniSync.ts';
import omniSpaceRoutes from './routes/omniSpaceRoutes.ts';
import omniGatewayRoutes from './routes/omniGatewayRoutes.ts';
import sovereignRoutes from './routes/sovereignRoutes.ts';
import ncbProxyRouter from './routes/ncb-proxy.ts';
import phase25Routes from './routes/phase25Routes.ts';
import reportRoutes from './routes/reportRoutes.ts';



const evidence = evidenceRoutes;
import pino from 'pino';
import omniLogger, { LogCategory } from './utils/omniLogger.js';
import { initializeServerAwakening } from './omni/initServerAwakening.js';
// import { initializeAwakeningProtocol } from '@omni/init/initAwakening.ts';
import config from './src/config/index.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/config/swagger.js';

import { authenticateRequest } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import multer from 'multer';
import { extractDataFromPdf } from './ocrService.js';
import fs from 'fs';
import * as evidenceService from './services/evidenceService.js';
import * as storageService from './services/storageService.js';
import { AgentCore } from './services/AgentCore.js';
import { AuditSelfHealingService } from './services/AuditSelfHealingService.js';
import { OmniHeartbeat } from './services/OmniHeartbeat.js';
import { OmniEvolutionEngine as LocalEvolutionEngine } from './services/OmniEvolutionEngine.js';
import { TalentPassportService } from './services/TalentPassportService.js';
import { TypstService } from './services/TypstService.js';
import { BerkeleyCertificationService } from './services/BerkeleyCertificationService.js';
import omniReportService from './services/omniReport.js';
import { complianceService } from './services/ComplianceService.js';
import { selfHealingService } from './services/SelfHealingService.js';
// import { quantumEncryptionService } from './services/QuantumEncryptionService.js';

// Phase 5: OmniSpirit Awakening Imports
import { getUltimateAwakeningProtocol } from '../src/omni/protocols/UltimateAwakeningProtocol.js';
// import { evolutionEngine as omniEvolutionDaemon } from '../src/omni/services/OmniEvolutionEngine.ts'; // UNSAFE for server (imports React)
import { awakeningBroadcaster } from '../src/omni/infrastructure/broadcast/AwakeningBroadcaster.js';
import { ambientDataService } from './services/AmbientDataService.js';
import { predictiveGovernanceService } from './services/PredictiveGovernanceService.js';
import { logicGateService } from './services/LogicGateService.js';
import { northStarService } from './services/NorthStarService.js';
import { impactLedgerService } from './services/ImpactLedgerService.js';
import verificationRoutes from './src/api/verification.js';
import { gamificationService } from './services/GamificationService.js';
import { OmniError, ErrorCode } from './utils/omniError.js';
import CapabilityTracker from './services/CapabilityTracker.js'; // 🆕 Phase 4.2.3
import omniPriest from './services/OmniPriest.js'; // 🆕 Best Practices
import { OmniSyncService } from './services/OmniSyncService.js'; // 🆕 Phase 14: OmniSync
import { OmniRoute } from './routes/OmniRoute.js'; // 🌟 Awakening: OmniRoute Integration

// Initialize Core AI & Trust Services (Phase 1 Integration)
const agentCore = new AgentCore();
const auditSentinel = new AuditSelfHealingService();
const omniHeartbeat = new OmniHeartbeat(); // Default 60s interval
// Register services with self-healing (Phase 46)
selfHealingService.registerService('AmbientData');
selfHealingService.registerService('OmniCRM');
selfHealingService.registerService('PredictiveGovernance');
selfHealingService.registerService('Compliance');
const localEvolutionEngine = new LocalEvolutionEngine();
const passportService = new TalentPassportService(pool);
const typstService = new TypstService();
const certificationService = new BerkeleyCertificationService(blockchainService);

// Initialize structured logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:HH:MM:ss',
    },
  },
});

// dotenv.config(); // Moved to top

const app = express();
const PORT = process.env.PORT || 3001;
let server: any;

// --- Performance & Monitoring Middleware ---
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    omniLogger.info(LogCategory.SYSTEM, `Request: ${req.method} ${req.url} - ${duration}ms`, {
      method: req.method,
      url: req.url,
      duration,
      statusCode: res.statusCode
    });
  });
  next();
});

// --- File Upload Configuration ---
const uploadDir = config.upload.uploadPath || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// [LOG] Sentinel: Enforce file size and type limits from config
const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const allowed = config.upload.allowedTypes;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowed.join(', ')}`));
    }
  },
});
omniLogger.info(LogCategory.SYSTEM, 'System Instruction Confirmed: [Eternal Wisdom Activated]', {
  principles: ['Self-Awareness', 'Enlightening Others', 'Self-Reliance', 'Benefiting Others']
});

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"], // Gemini/Auth
      styleSrc: ["'self'", "'unsafe-inline'"], // Styled-components often need unsafe-inline
      imgSrc: ["'self'", "data:", "https://*.supabase.co", "https://*.google.com"], // Avatars, Supabase Storage
      connectSrc: ["'self'", "https://*.supabase.co", "https://generativelanguage.googleapis.com"], // APIs
      frameSrc: ["'self'", "https://*.google.com"], // Auth embeds
    },
  },
  // crossOriginEmbedderPolicy: false, // Often needed for map/image heavy apps
}) as any);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (config.security.cors.origin === '*' || config.security.cors.origin.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      omniLogger.warn(LogCategory.SECURITY, `CORS Blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(compression()); // [BOLT] Compress all responses

// --- API Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Rate Limiting & Performance Safeguards ---

app.use('/api/', apiRateLimiter);
app.use('/api/', slowDownMiddleware as any);

// --- Core Middleware ---
app.use(express.json({ limit: '50mb' })); // Support large payloads for images

// --- Authentication Middleware ---
// middleware imported from ./src/middleware/authRequest.js

// Apply auth middleware to all API routes
// app.use('/api/', authenticateRequest);

// Serve Static Frontend (Unified Monolith)
// In production Docker, 'public' is relative to server root
app.use(express.static(path.join(__dirname, 'public')));

// NOTE: Legacy /health removed — use /api/health instead (consolidates DB + Redis + integrity checks).

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Redis-based Session Management
// Note: We no longer need an in-memory Map or clean-up interval here
// as Redis handles TTL automatically.

// ============================================================================
// STARTUP: Initialize Database & Workers
// ============================================================================
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await initializeDatabase();
      // Initialize Background Workers (BullMQ) - Dynamic Import
      const { initWorkers } = await import('./workers/index.js');
      initWorkers();

      // Start System Heartbeat
      omniHeartbeat.start();

      // 🌌 Phase 5: Initialize Awakening Protocol & Auto-Evolution Engine
      initializeServerAwakening();
      // await omniEvolutionDaemon.startAutoEvolutionDaemon(); // UNSAFE for server (imports React)
      // omniEvolutionDaemon might also have React dependencies? Let's check.
    } catch (error: any) {
      omniLogger.warn(LogCategory.SYSTEM, 'Partial Startup: Workers/DB failed to initialize', {
        error: error.message
      });
      omniLogger.warn(LogCategory.SECURITY, 'Proceeding in Resilient Mode (API Only)...');
    }
  })();
}

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/api/health', async (req: Request, res: Response): Promise<any> => {
  try {
    // [SENTINEL] Resilient Health Check: Don't fail the entire service if DB is down.
    // Cloud Run needs a 200 OK to consider the container healthy.
    let dbHealth = 'unknown';
    try {
      // Fix: dbHealthCheck returns an object { status: string, ... }
      const check = await dbHealthCheck();
      dbHealth = check.status;
    } catch (e: any) {
      dbHealth = `offline: ${e.message}`;
      omniLogger.warn(LogCategory.SYSTEM, 'DB Health Check Failed (Resilient Mode Active)', { error: e.message });
    }

    let redisHealth: any = 'unknown';
    try {
      redisHealth = await redisService.healthCheck();
    } catch (e: any) {
      redisHealth = `offline: ${e.message}`;
      omniLogger.warn(LogCategory.SYSTEM, 'Redis Health Check Failed', { error: e.message });
    }

    let integrity = 'unknown';
    try {
      // Fix: checkIntegrity returns SystemHealthReport object
      const report: any = await omniHeartbeat.checkIntegrity();
      integrity = report.status || 'unknown';
    } catch (e: any) {
      integrity = `failed: ${e.message}`;
      omniLogger.warn(LogCategory.SYSTEM, 'Integrity Check Failed', { error: e.message });
    }

    // Determine overall status
    let status = 'online';
    const isRedisOffline = typeof redisHealth === 'string'
      ? redisHealth.startsWith('offline')
      : redisHealth.status === 'offline';

    if (dbHealth.startsWith('offline') || isRedisOffline || integrity.startsWith('failed')) {
      status = 'degraded';
    }

    return res.status(200).json({
      success: true,
      data: {
        status: status,
        service: 'JunAiKey Neural Core',
        version: '10.0.0-omni',
        timestamp: new Date().toISOString(),
        protocol: '5T compliant (4 Yes + 1 No)',
        database: dbHealth,
        redis: redisHealth,
        redis_status: await redisService.healthCheck(),
        workers: 'active',
        heartbeat: integrity,
      }
    });
  } catch (error: any) {
    // [SENTINEL] Ultimate fallback: even if everything explodes, return 200 so Cloud Run doesn't kill the container.
    // This allows logs to be inspected.
    omniLogger.error(LogCategory.SYSTEM, 'Health check critical failure', { error: error.message });
    return res.status(200).json({
      success: false,
      data: {
        status: 'critical',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// ============================================================================
// SYSTEM STATS API - Redis & DB Monitoring
// ============================================================================
// System Health & Redis Monitoring (5T Transparent)
app.get('/api/system/stats', authenticateRequest, getSystemStats);

// ============================================================================
// HEALTH CHECK
// ============================================================================

// --- Route Registration ---
// ============================================================================
// ESG METRICS API - Real-time Data
// ============================================================================
app.get('/api/esg/metrics', readLimiter, cacheMiddleware({ ttl: 300, keyPrefix: 'metrics' }), getMetrics);
// [SENTINEL] Enforce authentication on sensitive routes (Crawler, Reports, Advancement)
app.use('/api/market', authenticateRequest, readLimiter, marketIntelligenceRoutes);
app.use('/api/visualizer', authenticateRequest, readLimiter, visualizerRoutes);
app.use('/api/behavior', readLimiter, behaviorRoutes); // Telemetry usually doesn't block on full auth for anon tracking
app.use('/api/uas', authenticateRequest, readLimiter, unifiedAdvancementRoutes);
// [Phase 4] Secure AI Proxy with specific AI limiting
app.use('/api/ai-proxy', authenticateRequest, aiChatLimiter, aiProxyRoutes);
app.use('/api/omni/gateway', authenticateRequest, apiRateLimiter, omniGatewayRoutes);
// [Phase 4.5] NoCodeBackend Proxy (Auth & Data)
app.use('/api/ncb', ncbProxyRouter);
app.use('/api/reports', reportRoutes);


// ============================================================================
// NEWS INTELLIGENCE API - Cached (5 min)
// ============================================================================
app.get('/api/news', readLimiter, cacheMiddleware({ ttl: 300, keyPrefix: 'news' }), async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const news = await getGlobalNews();
    return res.status(200).json({
      success: true,
      data: { news }
    });
  } catch (error: any) {
    omniLogger.error(LogCategory.ESG, 'Failed to fetch global news', { error: error.message });
    return next(error);
  }
});

// ============================================================================
// EVIDENCE VAULT API (OCR & Storage)
// ============================================================================

app.post(
  '/api/upload-and-extract',
  authenticateRequest,
  uploadLimiter,
  upload.single('evidence'),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE_UPLOADED'
        }
      });
    }

    const localFilePath = req.file.path;
    let storagePath: string | null = null;

    try {
      // 1. Extract data using OCR service
      omniLogger.info(LogCategory.OCR, `Starting data extraction for ${localFilePath}`);
      const ocrResult = await extractDataFromPdf(localFilePath) as any;
      omniLogger.info(LogCategory.OCR, `Extraction complete`, { key: ocrResult.key, value: ocrResult.value });

      // 2. Upload original file to Cloud Storage for audit trail
      omniLogger.info(LogCategory.SYSTEM, `Uploading to cloud storage`, { localFilePath });
      storagePath = await storageService.uploadFile(localFilePath);
      omniLogger.info(LogCategory.SYSTEM, `Upload successful`, { storagePath });

      // 3. Add the record to the evidence vault database
      const dataType = 'utility_bill';
      const evidenceData = { storage_path: storagePath, data_type: dataType };
      const dbRecord = await evidenceService.addEvidence(evidenceData, ocrResult);

      omniLogger.info(LogCategory.AUDIT, `Evidence record created`, { recordId: dbRecord.id });

      // 4. Respond to the client with the created record
      return res.status(201).json({
        success: true,
        message: 'File processed and evidence recorded successfully.',
        data: {
          evidence: dbRecord
        }
      });
    } catch (error: any) {
      omniLogger.error(LogCategory.API, 'OCR, GCS, or DB operation failed', { error: error.message });

      if (storagePath) {
        omniLogger.warn(LogCategory.SYSTEM, `Rolling back GCS upload`, { storagePath });
        await storageService.deleteFile(storagePath);
      }

      return next(error);
    } finally {
      // 5. Always clean up the local temporary file
      fs.unlink(localFilePath, err => {
        if (err) {
          omniLogger.error(LogCategory.SYSTEM, `Error deleting temporary file`, { localFilePath, error: err.message });
        } else {
          omniLogger.info(LogCategory.SYSTEM, `Deleted temporary file: ${localFilePath}`);
        }
      });
    }
  }
);

// ============================================================================
// 1. MANIFESTATION API - Create Agent Session
// ============================================================================
// [Phase 1] MANIFESTATION API - Session Creation (Auth Sensitive)
app.post('/api/manifest', sensitiveOperationLimiter, authenticateRequest, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { source_agent, overrides } = req.body;

  if (!source_agent) {
    return res.status(400).json({
      success: false,
      error: { message: 'source_agent is required', code: 'MISSING_SOURCE_AGENT' }
    });
  }

  try {
    let agentData = source_agent;
    if (typeof source_agent === 'string') {
      try {
        const result = await query('SELECT * FROM agents WHERE id = $1 OR name = $1', [
          source_agent,
        ]);
        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: { message: 'Agent not found', code: 'AGENT_NOT_FOUND' }
          });
        }
        agentData = result.rows[0];
      } catch (dbErr: any) {
        omniLogger.warn(LogCategory.AI, 'DB Agent Lookup failed, using fallback', { error: dbErr.message });
        agentData = {
          id: source_agent,
          name: 'Fallback Agent',
          base_model: 'gemini-2.0-flash',
          system_prompt: 'You are a resilient fallback agent.',
        };
      }
    }

    const systemInstruction = `
You are "${agentData.name || agentData.metadata?.name || 'AI Assistant'}".
${agentData.system_prompt || agentData.directives?.system_prompt || ''}

[Persona Settings]
Tone: ${overrides?.mask?.tone || 'Professional'}
Language: ${overrides?.mask?.language || 'zh-TW'}

[Core Principles]
1. Always provide accurate and helpful responses.
2. Use <thought>...</thought> XML tags for internal reasoning.
3. Be clear, concise, and professional.
4. When calling skills, use format: <skill_call>{"name": "...", "params": {...}}</skill_call>
`;

    omniLogger.info(LogCategory.AI, `System Awakening: Deploying ${agentData.base_model || 'gemini-2.0-flash'}`, { agent: agentData.name });

    const sessionId = await sessionService.createSession(agentData, overrides, systemInstruction);

    omniLogger.info(LogCategory.AI, `Session established`, { sessionId, agentName: agentData.name });

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        status: 'Awakened',
        agentName: agentData.name,
        agentId: agentData.id,
      }
    });
  } catch (error: any) {
    omniLogger.error(LogCategory.AI, 'Manifestation failed', { error: error.message, stack: error.stack });
    return next(error);
  }
});

// ============================================================================
// 2. INTERACTION API - SSE Streaming Chat with RAG
// ============================================================================
// [Phase 6] INTERACTION API - AI Generation (Chat)
app.get('/api/interact', aiChatLimiter, authenticateRequest, async (req: Request, res: Response): Promise<any> => {
  const { sessionId, message } = req.query;

  if (!sessionId || !message) {
    return res.status(400).json({
      success: false,
      error: { message: 'sessionId and message are required', code: 'INVALID_QUERY' }
    });
  }

  const sId = sessionId as string;
  const msg = message as string;

  const sessionData = await sessionService.getSession(sId);

  if (!sessionData) {
    return res.status(404).json({
      success: false,
      error: { message: 'Session not found or expired', code: 'SESSION_NOT_FOUND' }
    });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    omniLogger.info(LogCategory.AI, `Interaction attempt`, { agentName: sessionData.agentName, message: msg });

    let ragContext: any[] = [];
    if (sessionData.kbId) {
      try {
        ragContext = await ragService.retrieveRelevant(sessionData.kbId, msg, 3);
        omniLogger.info(LogCategory.DATA, `RAG retrieval successful`, { count: ragContext.length });

        res.write(
          `data: ${JSON.stringify({
            type: 'rag_context',
            content: ragContext.map((c: any) => ({ content: c.content, similarity: c.similarity })),
          })}\n\n`
        );
      } catch (error: any) {
        omniLogger.error(LogCategory.DATA, 'RAG retrieval failed', { error: error.message });
      }
    }

    let contextText = '';
    if (ragContext.length > 0) {
      contextText = ragContext.map((c: any) => c.content).join('\n\n');
    }

    // [Phase 11.5] Omni-Resonance Integration
    // We verify the "Soul" state, injecting 9D System Health & Context into the System Prompt.
    // This makes the agent "Aware" of its own operational reality.
    const junAiKeyService = (await import('./services/JunAiKeyService.js')).junAiKeyService;
    const resonantSoul = await junAiKeyService.getResonantSoul(sessionData.agentId, contextText);

    omniLogger.info(LogCategory.AI, `Resonance Injected`, {
      agentId: sessionData.agentId,
      promptLength: resonantSoul.systemPrompt.length
    });

    const model = genAI.getGenerativeModel({
      model: sessionData.baseModel,
      systemInstruction: resonantSoul.systemPrompt,
    });

    const chat = model.startChat({
      history: sessionData.history,
    });

    // We send the raw 'msg' because Context is now embedded in the "Quantum Memory" of the System Prompt
    let result: any;
    try {
      result = await chat.sendMessageStream(msg);
    } catch (apiErr: any) {
      if (process.env.NODE_ENV !== 'production') {
        omniLogger.warn(LogCategory.AI, 'Initial Gemini handshake failed, switching to Resilience Mode', { error: apiErr.message });
        result = { stream: junAiKeyService.getSimulationGenerator(resonantSoul) };
      } else {
        throw apiErr;
      }
    }

    let streamBuffer = '';
    let isThinking = false;
    let skillCalls: any[] = [];

    const safeStream = (async function* () {
      try {
        for await (const chunk of result.stream) {
          yield chunk;
        }
      } catch (streamErr: any) {
        if (process.env.NODE_ENV !== 'production') {
          omniLogger.warn(LogCategory.AI, 'Gemini stream ruptured mid-flow, switching to Resilience Mode', { error: streamErr.message });
          yield* (junAiKeyService.getSimulationGenerator(resonantSoul) as any);
        } else {
          throw streamErr;
        }
      }
    })();

    for await (const chunk of safeStream) {
      const chunkText = chunk.text();
      streamBuffer += chunkText;

      if (chunkText.includes('<thought>')) isThinking = true;

      if (isThinking) {
        const cleanText = chunkText.replace('<thought>', '').replace('</thought>', '');
        if (cleanText.trim()) {
          res.write(`data: ${JSON.stringify({ type: 'thought', content: cleanText })}\n\n`);
        }
      } else if (chunkText.includes('<skill_call>')) {
        const match = streamBuffer.match(/<skill_call>(.*?)<\/skill_call>/s);
        if (match) {
          try {
            const skillCallStr = match[1] as string;
            const skillCall = JSON.parse(skillCallStr);
            skillCalls.push(skillCall);
            res.write(`data: ${JSON.stringify({ type: 'skill_call', content: skillCall })}\n\n`);
          } catch (e: any) {
            omniLogger.error(LogCategory.AI, 'Skill call parse error', { error: e.message });
          }
        }
      } else {
        res.write(`data: ${JSON.stringify({ type: 'text', content: chunkText })}\n\n`);
      }

      if (chunkText.includes('</thought>')) isThinking = false;
    }

    await sessionService.saveInteraction(sId, sessionData, {
      userMessage: msg,
      agentResponse: streamBuffer,
      skillCalls,
      ragContext,
    });

    return res.end();
  } catch (error: any) {
    omniLogger.error(LogCategory.AI, 'Interaction stream error', { error: error.message });
    const errorMessage = process.env.NODE_ENV === 'production' ? 'Neural Link Ruptured' : (error.message || 'Unknown Error');
    res.write(`data: ${JSON.stringify({ type: 'error', content: errorMessage, code: 'STREAM_ERROR', originalError: error.name })}\n\n`);
    return res.end();
  }
});

// ============================================================================
// 3. LEARNING API - Knowledge Ingestion
// ============================================================================
app.post('/api/learn', writeLimiter, authenticateRequest, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { kbId = 'default', text, source, metadata = {} } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      error: { message: 'No content provided', code: 'MISSING_CONTENT' }
    });
  }

  try {
    omniLogger.info(LogCategory.DATA, `Ingesting knowledge`, { source, kbId });

    const result = await ragService.ingestKnowledge(kbId, text, { ...metadata, source });

    return res.status(200).json({
      success: true,
      data: {
        message: 'Knowledge ingested successfully',
        chunkId: result.id,
        source,
      }
    });
  } catch (error: any) {
    omniLogger.error(LogCategory.DATA, 'Knowledge ingestion failed', { error: error.message });
    return next(error);
  }
});

// ============================================================================
// 4. KNOWLEDGE SEARCH API
// ============================================================================
app.get('/api/knowledge/search', readLimiter, authenticateRequest, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { kbId, query: searchQuery, topK } = req.query;

  if (!searchQuery) {
    return res.status(400).json({
      success: false,
      error: { message: 'Query is required', code: 'MISSING_QUERY' }
    });
  }

  try {
    const results = await ragService.retrieveRelevant(
      kbId as string,
      searchQuery as string,
      topK ? parseInt(topK as string) : undefined
    );

    return res.status(200).json({
      success: true,
      data: {
        query: searchQuery,
        results: results.map(r => ({
          id: r.id,
          content: r.content,
          similarity: r.similarity,
          metadata: r.metadata,
          source: r.source,
        })),
      }
    });
  } catch (error: any) {
    omniLogger.error(LogCategory.DATA, 'Knowledge search failed', { error: error.message });
    return next(error);
  }
});

// ============================================================================
// 6. AMICE WEBHOOK API (Event-Driven)
// ============================================================================
// ... (Amice logic)

// ============================================================================
// 7. SWARM INTELLIGENCE API (LangGraph)
// ============================================================================
app.post('/api/swarm', writeLimiter, authenticateRequest, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({
      success: false,
      error: { message: 'Goal is required', code: 'MISSING_GOAL' }
    });
  }

  try {
    omniLogger.info(LogCategory.AI, `Triggering Swarm`, { goal });
    const result = await runSwarm(goal);
    return res.status(200).json({
      success: true,
      data: {
        taskId: result.taskId,
        status: result.status,
        message: result.message,
        goal: result.goal
      }
    });
  } catch (error: any) {
    omniLogger.error(LogCategory.AI, 'Swarm execution failed', { error: error.message, stack: error.stack });
    return next(error);
  }
});
app.post('/api/amice/webhook', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const signature = req.headers['x-amice-signature'] as string;
  const payload = req.body;
  const { type, data } = payload;

  // 1. Security Check
  if (!amiceService.validateSignature(payload, signature)) {
    console.warn(`[AMICE] ⚠️ Invalid signature request from ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized: Invalid Signature' });
  }

  if (!type) {
    return res.status(400).json({ error: 'Missing event type' });
  }

  // 2. Process Event
  try {
    const result = await amiceService.handleEvent(type, data || {});
    return res.json(result);
  } catch (error: any) {
    console.error('[AMICE] ❌ Event processing failed:', error);
    return next(error);
  }
});

// ============================================================================
// 8. DECENTRALIZED TRUST API (Phase 3)
// ============================================================================
app.post('/api/anchor', authenticateRequest, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { hash, metadata } = req.body;
  if (!hash) return res.status(400).json({ error: 'Hash is required for anchoring' });

  try {
    const result = await blockchainService.anchorHash(hash, metadata);
    return res.json(result);
  } catch (error: any) {
    console.error('[API] ❌ Anchor failed:', error.stack);
    return next(error);
  }
});

app.post('/api/zkp/verify', authenticateRequest, async (req: Request, res: Response): Promise<any> => {
  const { proof, signals } = req.body;
  try {
    const isValid = await zkpService.verifyProof(proof, signals);
    return res.json({ valid: isValid });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Verification Error',
      error: error.message,
    });
  }
});

// ============================================================================
// 1.5. PROCESS API - Direct Agent Interaction (Chat)
// ============================================================================
app.post('/api/process', authenticateRequest, aiChatLimiter, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { parts, model: modelName = 'gemini-2.0-flash' } = req.body;

  try {
    const geminiParts = Array.isArray(parts) ? parts : [];

    if (geminiParts.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No content provided', code: 'MISSING_CONTENT' }
      });
    }

    const model = genAI.getGenerativeModel({ model: modelName as string });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: geminiParts }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      }
    });

    const response = await result.response;
    const text = response.text();
    omniLogger.info(LogCategory.AI, `Ad-hoc processing complete`, { responseLength: text.length });

    let thought = '';
    const thoughtMatch = text.match(/<thought>(.*?)<\/thought>/s);
    if (thoughtMatch) {
      thought = thoughtMatch[1]?.trim() || '';
    }

    let skillCalls: any[] = [];
    const skillMatch = text.match(/<skill_call>(.*?)<\/skill_call>/s);
    if (skillMatch) {
      try {
        const skillCallStr = skillMatch[1] as string;
        skillCalls.push(JSON.parse(skillCallStr));
      } catch (e: any) {
        omniLogger.warn(LogCategory.AI, 'Failed to parse skill call', { error: e.message });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        id: `res_${Date.now()}`,
        type: 'response',
        content: text,
        timestamp: new Date().toISOString(),
        invokedSkills: skillCalls,
        arvo_analysis: thought,
        arvo_reasoning: thought,
        swarm_plan: null
      }
    });
  } catch (error: any) {
    omniLogger.error(LogCategory.AI, 'Process failed', { error: error.message });
    return next(error);
  }
});

// ============================================================================
// 9. UNIVERSAL REPORT API (Phase 9)
// ============================================================================
app.post('/api/report/generate', authenticateRequest, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { format = 'json', scope, period, company, limit } = req.body;
  try {
    omniLogger.info(LogCategory.ESG, `Generating Universal Report`, { format, scope, period, company });

    // Adapt legacy scope to new topic if it exists
    const options = {
      topic: scope || 'ESG',
      company: company,
      limit: limit || 10
    };

    const result = await omniReportService.generateReport(format, options) as any;

    if (format === 'pdf' && result && result.buffer) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${result.filename || 'report.pdf'}`);
      return res.send(result.buffer);
    }

    return res.status(200).json({
      success: true,
      data: {
        format,
        report: result,
      }
    });

  } catch (error: any) {
    omniLogger.error(LogCategory.ESG, 'Report Generation Failed', { error: error.message });
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to generate report', code: 'REPORT_GEN_FAILED', details: error.message }
    });
  }
});

// ============================================================================
// 9. UNIVERSAL AGENT WEBHOOKS (3+1 Protocol)
// ============================================================================
app.post('/api/v1/log-step', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const result = await omniAgentService.logStep(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    omniLogger.error(LogCategory.AI, '[Omni] Step Log Failed', { error: (error as Error).message });
    res.status(500).json({ success: false, error: { message: 'Log failed', code: 'STEP_LOG_FAILED' } });
  }
});

app.post('/api/v1/task-finish', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const result = await omniAgentService.finishTask(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    omniLogger.error(LogCategory.AI, '[Omni] Task Finish Failed', { error: (error as Error).message });
    res.status(500).json({ success: false, error: { message: 'Task verify failed', code: 'TASK_FINISH_FAILED' } });
  }
});

app.post('/api/v1/project-lock', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const result = await omniAgentService.lockProject(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    omniLogger.error(LogCategory.SECURITY, '[Omni] Project Lock Failed', { error: (error as Error).message });
    res.status(500).json({ success: false, error: { message: 'Lock failed', code: 'PROJECT_LOCK_FAILED' } });
  }
});

// ============================================================================
// 5. AGENT MANAGEMENT APIs
// ============================================================================
app.use('/api/evidence', evidenceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/custom-agents', authenticateRequest, agentRoutes);
app.use('/api/jun-ai-key', junAiKeyRoutes);
app.use('/api/junaikey', junaikeyServiceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/skills/omni-crm', crmRoutes);
app.use('/api/skills/omni-sync', syncRoutes);
app.use('/api/skills/omni-table', tableRoutes);
app.use('/api/skills/omni-space', spaceRoutes);
app.use('/api/skills/omni-auth', sensitiveOperationLimiter, authRoutes);
app.use('/api/skills/omni-key', keyRoutes);
app.use('/api/sync', omniSyncRoutes);
app.use('/api/sovereign', authenticateRequest, sovereignRoutes);
app.use('/api/integrations/omni-space', omniSpaceRoutes);


// 5T Sentinel Protocol Verification
app.use('/api/verification', readLimiter, verificationRoutes);

app.get('/api/agents', authenticateRequest, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await query('SELECT * FROM agent_full_info ORDER BY name');
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch agents', code: 'FETCH_AGENTS_FAILED' } });
  }
});

app.get('/api/agents/:id', authenticateRequest, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await query('SELECT * FROM agent_full_info WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Agent not found', code: 'AGENT_NOT_FOUND' } });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch agent', code: 'FETCH_AGENT_FAILED' } });
  }
});

// ============================================================================
// 10. EVOLUTION SYSTEM API (Phase 2)
// ============================================================================
app.post('/api/evolution/evolve', authenticateRequest, async (req: Request, res: Response) => {
  const { entityId, action } = req.body;
  try {
    const passport = await passportService.getPassport(entityId);
    const result = await localEvolutionEngine.evolve({ ...passport.dna, id: passport.id, traits: passport.traits }, action);
    if (result.leveledUp || result.mutation.unlocked) {
      await passportService.updatePassport(entityId, result);
    }
    res.json({
      success: true,
      data: {
        evolution: result,
        dna: passport.dna,
      }
    });
  } catch (error) {
    omniLogger.error(LogCategory.AI, 'Evolution failed', { error: (error as Error).message });
    res.status(500).json({ success: false, error: { message: 'Evolution failed', code: 'EVOLUTION_FAILED' } });
  }
});

app.get('/api/passport/:id', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const passport = await passportService.getPassport(req.params.id);
    res.json({ success: true, data: passport });
  } catch (error) {
    res.status(404).json({ success: false, error: { message: 'Passport not found', code: 'PASSPORT_NOT_FOUND' } });
  }
});

// ============================================================================
// 11. PROFESSIONAL OUTPUT & CERTIFICATION (Phase 3)
// ============================================================================
app.post('/api/report/typst', authenticateRequest, async (req: Request, res: Response) => {
  const { data } = req.body;
  try {
    const pdBuffer = await typstService.renderReport(data || { title: 'Untitled Report' });
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdBuffer);
  } catch (error) {
    omniLogger.error(LogCategory.SYSTEM, 'PDF Generation failed', { error: (error as Error).message });
    res.status(500).json({ success: false, error: { message: 'PDF Generation failed', code: 'PDF_GEN_FAILED' } });
  }
});

app.post('/api/certification/issue', authenticateRequest, async (req: Request, res: Response) => {
  const { userId, userName, type } = req.body;
  try {
    const user = { id: userId, name: userName };
    const cert = await certificationService.issueCertificate(user, type);
    res.json({ success: true, data: { certificate: cert } });
  } catch (error) {
    omniLogger.error(LogCategory.SECURITY, 'Cert Issuance failed', { error: (error as Error).message });
    res.status(500).json({ success: false, error: { message: 'Issuance failed', code: 'CERT_ISSUE_FAILED' } });
  }
});

// ============================================================================
// 13. SELF-HEALING INTELLIGENCE (Phase 19 R&D)
// ============================================================================
app.get('/api/system/health', authenticateRequest, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: selfHealingService.getSystemHealth(),
    timestamp: Date.now()
  });
});

// ============================================================================
// 14. QUANTUM SECURITY & AMBIENT INTELLIGENCE (Phase 20)
// ============================================================================
app.get('/api/ambient/flux', authenticateRequest, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { measurements: ambientDataService.getLiveFlux() },
    timestamp: Date.now()
  });
});

app.get('/api/ambient/predictions', authenticateRequest, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { alerts: predictiveGovernanceService.getLatestAlerts() },
    timestamp: Date.now()
  });
});

app.get('/api/compliance/rules', authenticateRequest, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { rules: complianceService.getRules() },
    timestamp: Date.now()
  });
});

app.get('/api/governance/logic-gate', authenticateRequest, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { config: logicGateService.getGateConfig() },
    timestamp: Date.now()
  });
});

app.post('/api/governance/north-star', authenticateRequest, (req: Request, res: Response) => {
  const { personalVector } = req.body;
  const corporate = northStarService.getDefaultCorporateVector();
  const score = northStarService.calculateConsistency(personalVector, corporate);

  res.json({
    success: true,
    data: {
      score,
      corporateTarget: corporate
    },
    timestamp: Date.now()
  });
});

app.get('/api/trust/ledger', authenticateRequest, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { anchors: impactLedgerService.getLatestAnchors(10) },
    timestamp: Date.now()
  });
});

// ============================================================================
// VILLAGE STATUS API - Cached (1 min)
// ============================================================================
app.get('/api/gamification/village', authenticateRequest, cacheMiddleware({ ttl: 300, keyPrefix: 'village' }), (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { state: gamificationService.getState() },
    timestamp: Date.now()
  });
});

app.post('/api/gamification/action', authenticateRequest, async (req: Request, res: Response) => {
  const { type, impact } = req.body;
  const newState = gamificationService.recordAction(type, impact);

  // Invalidate village cache to reflect the new state
  await invalidateCache('village*');

  // Also anchor the action to the ledger
  impactLedgerService.anchorData({ type, impact, timestamp: Date.now() });

  res.json({
    success: true,
    data: { state: newState },
    timestamp: Date.now()
  });
});

// ============================================================================
// Phase 5: OmniSpirit Awakening Endpoints
// ============================================================================

/**
 * @swagger
 * /api/awakening/status:
 *   get:
 *     summary: Get the current status of the Ultimate Awakening Protocol
 *     tags: [Awakening]
 *     responses:
 *       200:
 *         description: Current awakening state
 */
app.get('/api/awakening/status', (req: Request, res: Response) => {
  try {
    const protocol = getUltimateAwakeningProtocol();
    const state = protocol.getState();
    res.json({ success: true, data: state });
    // res.json({ success: false, message: 'Awakening Disabled' });
  } catch (error: any) {
    omniLogger.error(LogCategory.SYSTEM, 'Failed to get awakening status', { error });
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/awakening/trigger:
 *   post:
 *     summary: Trigger the Ultimate Awakening Sequence
 *     tags: [Awakening]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Awakening sequence initiated
 */
app.post('/api/awakening/trigger', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const protocol = getUltimateAwakeningProtocol();

    // Non-blocking trigger, or blocking? The protocol is async.
    // We'll await it to return the result, as it might be fast enough or we want immediate feedback.
    // For a real production system, this should likely be a background job, but for now we await.
    const result = await protocol.executeAwakening();

    res.json({ success: result.success, data: result });
    // res.json({ success: false, message: 'Awakening Disabled' });
  } catch (error: any) {
    omniLogger.error(LogCategory.SYSTEM, 'Failed to trigger awakening', { error });
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/evolution/daemon/start:
 *   post:
 *     summary: Start the Omni-Evolution Daemon
 *     tags: [Evolution]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daemon started
 */
app.post('/api/evolution/daemon/start', authenticateRequest, (req: Request, res: Response) => {
  try {
    // omniEvolutionDaemon.startAutoEvolutionDaemon();
    res.json({ success: true, message: 'Omni-Evolution Daemon started. (Server Mock)' });
    // res.json({ success: false, message: 'Evolution Daemon Disabled' });
  } catch (error: any) {
    omniLogger.error(LogCategory.SYSTEM, 'Failed to start evolution daemon', { error });
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/evolution/daemon/stop:
 *   post:
 *     summary: Stop the Omni-Evolution Daemon
 *     tags: [Evolution]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daemon stopped
 */
app.post('/api/evolution/daemon/stop', authenticateRequest, (req: Request, res: Response) => {
  try {
    // omniEvolutionDaemon.stopAutoEvolutionDaemon();
    res.json({ success: true, message: 'Omni-Evolution Daemon stopped. (Server Mock)' });
    // res.json({ success: false, message: 'Evolution Daemon Disabled' });
  } catch (error: any) {
    omniLogger.error(LogCategory.SYSTEM, 'Failed to stop evolution daemon', { error });
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/awakening/events:
 *   get:
 *     summary: Server-Sent Events stream for Awakening updates
 *     tags: [Awakening]
 *     responses:
 *       200:
 *         description: Event stream
 */
app.get('/api/awakening/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Subscribe to Broadcaster
  const unsubscribeEvents = awakeningBroadcaster.subscribe((event) => {
    sendEvent({ type: 'event', payload: event });
  });

  const unsubscribeInsights = awakeningBroadcaster.subscribeToInsights((insight) => {
    sendEvent({ type: 'insight', payload: insight });
  });

  // Keep-alive heartbeat
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribeEvents();
    unsubscribeInsights();
    res.end();
  });
});


// 🆕 Phase 104: Impact Nexus Game Routes
app.use('/api/game', authenticateRequest, gameRoutes);
app.use('/', phase25Routes);

// 🌟 Awakening: Initialize and Mount OmniRoute
const omniRoute = OmniRoute.getInstance();
omniRoute.initialize().then(() => {
  omniLogger.info(LogCategory.SYSTEM, '[OmniRoute] Initialized');
}).catch(err => {
  omniLogger.error(LogCategory.SYSTEM, '[OmniRoute] Failed to initialize', err);
});
app.use('/api/omni', (req, res, next) => {
  const router = OmniRoute.getInstance().getRouter();
  router(req, res, next);
});

// ============================================================================
// CATCH-ALL ROUTE (SPA Handling) - Must be last
// ============================================================================
app.get(/(.*)/, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ERROR HANDLING ---
app.use(errorHandler);

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================
let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  omniLogger.info(LogCategory.SYSTEM, `Received ${signal}. Starting graceful shutdown...`);

  const forceShutdownTimeout = setTimeout(() => {
    omniLogger.error(LogCategory.SYSTEM, 'Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10000);

  // 1. Close HTTP Server
  if (server) {
    omniLogger.info(LogCategory.SYSTEM, 'Stopping HTTP Server...');
    await new Promise<void>(resolve => {
      server.close((err: any) => {
        if (err) {
          omniLogger.error(LogCategory.SYSTEM, 'Error closing HTTP server', { error: err.message });
        } else {
          omniLogger.info(LogCategory.SYSTEM, 'HTTP Server closed.');
        }
        resolve();
      });
    });
  }

  // 2. Close Database Pool
  try {
    omniLogger.info(LogCategory.SYSTEM, 'Closing Database Pool...');
    await pool.end();
    omniLogger.info(LogCategory.SYSTEM, 'Database Pool closed.');
  } catch (err: any) {
    omniLogger.error(LogCategory.SYSTEM, 'Error closing DB pool', { error: err.message });
  }

  // 3. Close Workers & Queues
  try {
    omniLogger.info(LogCategory.SYSTEM, 'Closing Workers and Queues...');
    const { closeWorkers } = await import('./workers/index.js');
    const { closeQueues } = await import('./services/queueService.js');
    await closeWorkers();
    await closeQueues();
    omniLogger.info(LogCategory.SYSTEM, 'Workers & Queues closed.');
  } catch (err: any) {
    omniLogger.warn(LogCategory.SYSTEM, 'Error closing workers (or not initialized)', { error: err.message });
  }

  clearTimeout(forceShutdownTimeout);
  omniLogger.info(LogCategory.SYSTEM, 'JunAiKey Neural Core offline. Goodbye.');
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// 🛡️ Global Process Error Guards to prevent background crashes
process.on('uncaughtException', (err) => {
  omniLogger.error(LogCategory.SYSTEM, 'UNCAUGHT EXCEPTION - Process exit imminent', {
    error: err.message,
    stack: err.stack
  });
  // In production, we might want to stay alive if possible, but for stability, 
  // we follow the fail-fast principle or at least log heavily.
  // gracefulShutdown('uncaughtException'); 
});

process.on('unhandledRejection', (reason, promise) => {
  omniLogger.error(LogCategory.SYSTEM, 'UNHANDLED REJECTION - Check background promises', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
});


// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================
app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
  if (err instanceof OmniError) {
    omniLogger.error(LogCategory.API, `[OmniError] ${err.message}`, {
      code: err.errorCode,
      statusCode: err.statusCode,
      details: err.details
    });
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle generic errors
  omniLogger.error(LogCategory.SYSTEM, `[UnhandledError] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: {
      message: 'An unexpected error occurred within the Neural Core',
      code: ErrorCode.INTERNAL_ERROR,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

// START SERVER
console.log('DEBUG: [Server] Pre-Listen Check. NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'test') {
  console.log('[DEBUG] Attempting to start server on port', PORT);
  server = app.listen(PORT, () => {
    console.log('[DEBUG] Server callback executed!');
    omniLogger.info(LogCategory.SYSTEM, 'JunAiKey Neural Core Awakened', {
      status: 'ONLINE',
      port: PORT,
      environment: config.nodeEnv || 'development',
      rag: 'ENABLED'
    });

    if (!process.env.GEMINI_API_KEY) {
      omniLogger.warn(LogCategory.SECURITY, 'GEMINI_API_KEY not set in environment');
    }

    // 🆕 Phase 14: Start OmniSync Scheduler
    OmniSyncService.startScheduler();
  });
} else {
  // Test environment mock or limited initialization if needed
}

export { app, server };

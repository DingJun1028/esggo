// Main Backend Server Entry Point (Universal Heart Core - Server Side)
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import path from 'path';

// Import Types (Universal Tags)
// Note: In a real monorepo we would import from packages/types
// For now we will define local interfaces that match the Universal Tags
// or duplicate them if we can't easily alias the path outside root.
// To fully satisfy "Dual TypeScript", we should ideally symlink or use project references.
// For simplicity in this environment, I will replicate the key interface or create a shared module in a later step.

// Security Middleware
import {
  ipWhitelistMiddleware,
  requestSizeLimiter,
  apiRateLimiter,
  sensitiveOperationLimiter,
  slowDownMiddleware,
  hstsMiddleware,
  cspMiddleware,
  headerValidationMiddleware,
  securityAuditMiddleware,
  sqlInjectionProtection,
  xssProtection,
  corsOptions,
} from './middleware/security.js';

// Error Handler
import { errorHandlerMiddleware } from './middleware/errorHandler.js';

// Phase 15: Input Validation & Sanitization
import { sanitizeInputMiddleware } from './middleware/validation.js';

// Health Monitor (Phase 7)
import systemHealthService from './services/SystemHealthService.js';

const app: Express = express();
const server = createServer(app);

// --- Initialization: Redis Cache Layer ---
import { redisService } from './services/RedisService.js';
redisService.initialize().catch(err => console.error('❌ Redis Initialization Error:', err));

// --- Database Connection (Persistence Layer) ---
// 使用 Supabase 作為統一資料庫（取代 MongoDB）
import { testSupabaseConnection, getDatabaseStats } from './config/supabase.js';

// 測試 Supabase 連接
testSupabaseConnection()
  .then(async (connected) => {
    if (connected) {
      console.log('✅ Supabase Persistence Layer Connected');

      // 顯示資料庫統計
      const stats = await getDatabaseStats();
      console.log('📊 Database Statistics:', stats);
    } else {
      console.error('❌ Supabase Connection Failed');
    }
  })
  .catch(err => console.error('❌ Supabase Connection Error:', err));

// --- Universal Heart Core: Security Layer ---
app.use(securityAuditMiddleware);
app.use(ipWhitelistMiddleware);
app.use(hstsMiddleware);
app.use(cspMiddleware);

// Phase 9: Response Compression (gzip/brotli)
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  threshold: 1024, // Only compress responses > 1KB
}));

// Phase 7: Health Tracking Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  systemHealthService.recordRequest();
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors(corsOptions));
app.use(requestSizeLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Added json parser explicitly if not in requestSizeLimiter

// Phase 15: Input Sanitization (after body parsing)
app.use(sanitizeInputMiddleware);

app.use(headerValidationMiddleware);
app.use(sqlInjectionProtection);
app.use(xssProtection);

// Rate Limits
app.use('/api/', slowDownMiddleware);
app.use('/api/', apiRateLimiter);

// Sensitive Operations
app.use('/api/auth/login', sensitiveOperationLimiter);
app.use('/api/auth/register', sensitiveOperationLimiter);
app.use('/api/auth/forgot-password', sensitiveOperationLimiter);

// --- Universal Knowledge Base: Routes ---
// Connecting the Neural Pathways (Routes) to the Heart Core.

import authRoutes from './routes/authRoutes.js'; // Real Auth Routes
import esgRoutes from './api/esg.js';
import aiRoutes from './api/ai.js';
import learningRoutes from './api/learning.js';
import analyticsRoutes from './api/analytics.js';
import monitoringRoutes from './api/monitoring.js';
import projectRoutes from './routes/projectRoutes.js'; // IPMS Route
import gameRoutes from './routes/gameRoutes.js'; // Game System Routes

import junAiKeyRoutes from './api/jun-ai-key.js'; // JunAi Key Runes
import verificationRoutes from './api/verification.js'; // 5T Sentinel Protocol
import collectorRoutes from './routes/collectorRoutes.js'; // Phase 113: OmniCollector
import healthRoutes from './routes/healthRoutes.js'; // Phase 10: Health Monitoring
import socialRoutes from './routes/socialRoutes.js'; // Phase 17: Social Features
import advancementRoutes from './routes/unifiedAdvancementRoutes.js'; // Phase 17: Advancement System
import { swaggerSpec } from './config/swagger.js'; // Phase 12: API Documentation

// Phase 12: Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ESGss JunAiKey API Docs',
}));
app.get('/api/docs.json', (req: Request, res: Response) => res.json(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/esg', esgRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/projects', projectRoutes); // IPMS Module
app.use('/api/game', gameRoutes); // Game System Module
app.use('/api/jun-ai-key', junAiKeyRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/health', healthRoutes); // Health Monitoring Endpoints
app.use('/api/social', socialRoutes); // Social System
app.use('/api/advancement', advancementRoutes); // Advancement System

// Error Handler
app.use(errorHandlerMiddleware);

// 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});


// Main Backend Server Entry Point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');

// 自定義安全中間件
const {
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
  corsOptions
} = require('./middleware/security');

const app = express();
const server = createServer(app);

// 安全中間件 - 按照最佳實踐順序應用
app.use(securityAuditMiddleware); // 最先記錄請求
app.use(ipWhitelistMiddleware); // IP白名單檢查
app.use(hstsMiddleware); // HSTS for HTTPS
app.use(cspMiddleware); // Content Security Policy

// Helmet安全標頭（在CSP之後應用以避免衝突）
app.use(helmet({
  contentSecurityPolicy: false, // 因為我們自定義了CSP
  crossOriginEmbedderPolicy: false
}));

// CORS配置
app.use(cors(corsOptions));

// 請求大小和解析
app.use(requestSizeLimiter);
app.use(express.urlencoded({ extended: true }));

// 安全防護中間件
app.use(headerValidationMiddleware);
app.use(sqlInjectionProtection);
app.use(xssProtection);

// 速率限制
app.use('/api/', slowDownMiddleware); // 慢速攻擊防護
app.use('/api/', apiRateLimiter); // 一般API速率限制

// 敏感操作特殊限制
app.use('/api/auth/login', sensitiveOperationLimiter);
app.use('/api/auth/register', sensitiveOperationLimiter);
app.use('/api/auth/forgot-password', sensitiveOperationLimiter);

// Routes
app.use('/api/auth', require('./api/auth'));
app.use('/api/esg', require('./api/esg'));
app.use('/api/ai', require('./api/ai'));
app.use('/api/learning', require('./api/learning'));
app.use('/api/analytics', require('./api/analytics'));
app.use('/api/monitoring', require('./api/monitoring'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 錯誤處理中間件 - 使用統一的錯誤處理服務
const { errorHandlerMiddleware } = require('./middleware/errorHandler');
app.use(errorHandlerMiddleware);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 ESG Sunshine JunAiKey Backend Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
});
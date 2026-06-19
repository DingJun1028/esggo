// Server Configuration
const config = {
  // Server settings
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database settings
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'esg_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production'
  },

  // Redis cache settings
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    ttl: 3600 // 1 hour default TTL
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'default-jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // AI services
  ai: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 4096,
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4096,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
    }
  },

  // External integrations
  integrations: {
    aitabledb: {
      apiKey: process.env.AITABLE_API_KEY,
      baseId: process.env.AITABLE_BASE_ID
    },
    straico: {
      apiKey: process.env.STRAICO_API_KEY,
      baseUrl: process.env.STRAICO_BASE_URL || 'https://api.straico.com'
    },
    boostspace: {
      webhookUrl: process.env.BOOSTSPACE_WEBHOOK_URL,
      apiKey: process.env.BOOSTSPACE_API_KEY
    }
  },

  // Security settings
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      message: 'Too many requests from this IP, please try again later.'
    },
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },

  // Monitoring settings
  monitoring: {
    enabled: process.env.MONITORING_ENABLED !== 'false',
    logLevel: process.env.LOG_LEVEL || 'info',
    metrics: {
      collectInterval: parseInt(process.env.METRICS_INTERVAL) || 30000, // 30 seconds
      retentionPeriod: parseInt(process.env.METRICS_RETENTION) || 86400 // 24 hours
    }
  },

  // Learning settings
  learning: {
    maxConcurrentUsers: parseInt(process.env.MAX_LEARNING_USERS) || 1000,
    sessionTimeout: parseInt(process.env.LEARNING_TIMEOUT) || 3600000, // 1 hour
    contentCacheTtl: parseInt(process.env.CONTENT_CACHE_TTL) || 3600 // 1 hour
  },

  // File upload settings
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(','),
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  },

  // Email settings
  email: {
    provider: process.env.EMAIL_PROVIDER || 'smtp',
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.EMAIL_FROM || 'noreply@esgss.com'
  },

  // Feature flags
  features: {
    aiInsights: process.env.FEATURE_AI_INSIGHTS !== 'false',
    advancedAnalytics: process.env.FEATURE_ADVANCED_ANALYTICS !== 'false',
    realTimeCollaboration: process.env.FEATURE_REALTIME_COLLAB !== 'false',
    personalizedLearning: process.env.FEATURE_PERSONALIZED_LEARNING !== 'false'
  }
};

// Environment validation
function validateConfig() {
  const required = [
    'jwt.secret',
    'database.name'
  ];

  const missing = required.filter(key => {
    const keys = key.split('.');
    let value = config;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return true;
    }
    return false;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
}

// Validate configuration on load
validateConfig();

module.exports = config;
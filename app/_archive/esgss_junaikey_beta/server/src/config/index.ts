import dotenv from 'dotenv';
dotenv.config();

console.log('---------------------------------------------------------');
console.log('[CONFIG] Loading server/src/config/index.ts... SOURCE FILE');
console.log('---------------------------------------------------------');

export default {
    // Database settings
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'esg_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        ssl: process.env.NODE_ENV === 'production',
    },
    // Redis cache settings
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        ttl: 3600, // 1 hour default TTL
        useMemoryFallback: process.env.REDIS_USE_MEMORY_FALLBACK === 'true'
    },
    // JWT settings
    jwt: {
        secret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('JWT_SECRET must be set in production!'); })() : 'default-jwt-secret-key'),
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    ai: {
        gemini: {
            apiKey: process.env.GEMINI_API_KEY,
            model: process.env.GEMINI_MODEL || 'gemini-2.0-flash'
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || 'gpt-4o'
        }
    },
    upload: {
        uploadPath: process.env.UPLOAD_PATH || 'uploads',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB
        allowedTypes: ['jpg', 'jpeg', 'png', 'pdf', 'csv', 'xlsx']
    },
    security: {
        cors: {
            origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('CORS_ORIGIN must be set in production!'); })() : '*')
        }
    },
    google: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET
    },
    nodeEnv: process.env.NODE_ENV || 'development'
};

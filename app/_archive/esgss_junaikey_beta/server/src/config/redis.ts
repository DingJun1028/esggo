import { Redis, RedisOptions } from 'ioredis';
import config from './index.js';
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';

/**
 * server/src/config/redis.ts
 * 
 * Redis configuration and client initialization using ioredis.
 * [Trustworthy] Implements retry strategies and connection monitoring.
 */

export const redisOptions: RedisOptions = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
};

// Initialize Redis only if not in fallback mode
let redisClient: Redis | any;

if (process.env.REDIS_FALLBACK_ONLY === 'true') {
    omniLogger.warn(LogCategory.SYSTEM, 'REDIS_FALLBACK_ONLY is enabled. Skipping real Redis connection.');
    // Provide a dummy client to avoid null pointer errors in other services
    redisClient = {
        on: () => redisClient,
        get: async () => null,
        set: async () => 'OK',
        del: async () => 0,
        scan: async () => ['0', []],
        call: async (command: string) => {
            if (command?.toLowerCase() === 'eval' || command?.toLowerCase() === 'evalsha') {
                return [1, 60000]; // Simulate rate limit script return [count, ttl]
            }
            return 'OK';
        },
        sendCommand: async (command: string) => {
            if (command?.toLowerCase() === 'eval' || command?.toLowerCase() === 'evalsha') {
                return [1, 60000];
            }
            return 'OK';
        },
        quit: async () => 'OK',
        defineCommand: () => { },
        status: 'ready'
    };
} else {
    redisClient = new Redis(redisOptions);

    redisClient.on('connect', () => {
        omniLogger.info(LogCategory.SYSTEM, 'Redis connecting...');
    });

    redisClient.on('ready', () => {
        omniLogger.info(LogCategory.SYSTEM, 'Redis client ready and connected.');
    });

    redisClient.on('error', (err: any) => {
        omniLogger.error(LogCategory.SYSTEM, 'Redis connection error', err);
    });

    redisClient.on('close', () => {
        omniLogger.warn(LogCategory.SYSTEM, 'Redis connection closed.');
    });
}

export default redisClient;

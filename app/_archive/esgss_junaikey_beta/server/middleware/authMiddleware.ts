import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../src/config/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/omniError.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

console.log('---------------------------------------------------------');
console.log('[MIDDLEWARE] Loading server/middleware/authMiddleware.ts... SOURCE FILE');
console.log('---------------------------------------------------------');

/**
 * Standard Token Authentication Middleware (TypeScript)
 * ----------------------------------------------------
 * [5T: Traceable] Logs failed attempts with context.
 * [5T: Transparent] Uses standardized OmniError for fail states.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Development Bypass for Verification Script
    if ((!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') && token === 'test_token') {
        const testUserId = process.env.TEST_USER_ID || '00000000-0000-0000-0000-000000000001';
        console.log(`[AUTH BYPASS] Valid test_token detected on ${req.method} ${req.url}. Mapping to ${testUserId}`);
        req.user = { id: testUserId, userId: testUserId, role: 'admin' };
        return next();
    }

    // Handle potential ESM default export wrapper
    const cfg = (config as any).default || config;

    if (!cfg || !cfg.jwt) {
        console.error('[AUTH CRITICAL] cfg.jwt is undefined!', cfg);
        return next(new Error('Server configuration error: JWT secret missing'));
    }

    const secret = (cfg.jwt?.secret || process.env.JWT_SECRET || 'default-jwt-secret-key') as string;

    if (!token) {
        return next(new UnauthorizedError('Authentication token is missing'));
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            omniLogger.warn(LogCategory.AUTH, 'Token verification failed', { error: err.message });
            return next(new ForbiddenError(`Invalid or expired token: ${err.message}`));
        }

        // Map 'id' from token (used by AuthController) to 'userId' (expected by many routes)
        // Express.Request is augmented in express.d.ts
        const userData = user as any;
        req.user = {
            ...userData,
            userId: userData.id || userData.userId,
        };

        next();
    });
};

/**
 * Alias for compatibility with older route definitions
 */
// Alias for compatibility
export const authenticateRequest = authenticateToken;

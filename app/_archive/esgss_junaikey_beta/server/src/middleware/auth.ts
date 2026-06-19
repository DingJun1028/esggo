/**
 * auth.ts
 * JWT 認證中間件
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../services/ErrorHandler.js';

// 優先使用 server/types/express.d.ts 中的全域定義

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * JWT 認證中間件
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError('未提供認證令牌', 401);
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            throw new AppError('認證令牌格式錯誤', 401);
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;

        req.user = {
            id: decoded.userId || decoded.id || decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError('無效的認證令牌', 401));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new AppError('認證令牌已過期', 401));
        } else {
            next(error);
        }
    }
};

/**
 * 可選的 JWT 認證（不強制要求）
 */
export const optionalAuthenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                req.user = {
                    id: decoded.userId || decoded.id || decoded.sub,
                    email: decoded.email,
                    role: decoded.role,
                };
            }
        }

        next();
    } catch (error) {
        // 忽略錯誤，繼續執行
        next();
    }
};

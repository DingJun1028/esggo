/**
 * validation.ts
 * 輸入驗證與淨化中間件
 * Phase 15: Input Validation & Sanitization
 */

import { Request, Response, NextFunction } from 'express';

/**
 * 淨化字串 - 移除潛在 XSS 攻擊向量
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') return input;

    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .replace(/\\/g, '&#x5C;')
        .replace(/`/g, '&#x60;')
        .trim();
}

/**
 * 深度淨化物件中的所有字串
 */
export function sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    if (typeof obj === 'object') {
        const sanitized: any = {};
        for (const key of Object.keys(obj)) {
            sanitized[sanitizeString(key)] = sanitizeObject(obj[key]);
        }
        return sanitized;
    }

    return obj;
}

/**
 * 輸入淨化中間件
 * 自動淨化 req.body, req.query, req.params
 */
export function sanitizeInputMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }

    if (req.query) {
        req.query = sanitizeObject(req.query);
    }

    if (req.params) {
        req.params = sanitizeObject(req.params);
    }

    next();
}

/**
 * Email 格式驗證
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 密碼強度驗證
 * 最少 8 字元，包含大小寫字母與數字
 */
export function isStrongPassword(password: string): boolean {
    if (password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * UUID 格式驗證
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * 驗證請求體欄位
 */
export function validateRequiredFields(fields: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const missingFields = fields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || value === '';
        });

        if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`,
                code: 'ESG-VAL-001',
            });
            return;
        }

        next();
    };
}

/**
 * SQL Injection 防護 - 移除危險字元
 */
export function sanitizeSqlInput(input: string): string {
    if (typeof input !== 'string') return input;

    return input
        .replace(/'/g, "''")
        .replace(/;/g, '')
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '')
        .replace(/xp_/gi, '')
        .replace(/union/gi, '')
        .replace(/select/gi, '')
        .replace(/insert/gi, '')
        .replace(/update/gi, '')
        .replace(/delete/gi, '')
        .replace(/drop/gi, '')
        .replace(/exec/gi, '');
}

export default {
    sanitizeString,
    sanitizeObject,
    sanitizeInputMiddleware,
    isValidEmail,
    isStrongPassword,
    isValidUUID,
    validateRequiredFields,
    sanitizeSqlInput,
};

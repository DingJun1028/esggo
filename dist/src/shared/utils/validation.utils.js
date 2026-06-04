/**
 * 驗證工具函數
 * 前後端通用的驗證邏輯
 */
import { z } from 'zod';
export async function validateContent(content, contentType, options = {}) {
    const errors = [];
    const warnings = [];
    const size = Buffer.isBuffer(content) ? content.length : Buffer.byteLength(content);
    const maxSize = options.maxSize || 10 * 1024 * 1024; // 預設 10MB
    // 檢查大小
    if (size > maxSize) {
        errors.push(`Content size (${size} bytes) exceeds maximum (${maxSize} bytes)`);
    }
    // 檢查類型
    if (options.allowedTypes && !options.allowedTypes.includes(contentType)) {
        errors.push(`Content type '${contentType}' is not allowed`);
    }
    // 檢查內容是否為空
    if (size === 0) {
        errors.push('Content is empty');
    }
    // 檢測潛在的惡意內容（基礎檢查）
    if (typeof content === 'string') {
        if (content.includes('<script>') || content.includes('javascript:')) {
            warnings.push('Potential XSS content detected');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        metadata: {
            size,
            type: contentType,
        },
    };
}
// ============================================
// Tag 驗證
// ============================================
export function validateTag(tag) {
    if (!tag || tag.trim().length === 0) {
        return { valid: false, error: 'Tag cannot be empty' };
    }
    if (tag.length > 200) {
        return { valid: false, error: 'Tag is too long (max 200 characters)' };
    }
    // 禁止特殊字符
    const invalidChars = /[<>{}[\]\\]/;
    if (invalidChars.test(tag)) {
        return { valid: false, error: 'Tag contains invalid characters' };
    }
    return { valid: true };
}
// ============================================
// UUID 驗證
// ============================================
export function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
// ============================================
// MIME Type 驗證
// ============================================
export function isValidMimeType(mimeType) {
    const mimeRegex = /^[a-z]+\/[a-z0-9\-\+\.]+$/i;
    return mimeRegex.test(mimeType);
}
export const ALLOWED_MIME_TYPES = {
    text: ['text/plain', 'text/html', 'text/markdown', 'text/csv'],
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm'],
    document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    archive: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    json: ['application/json'],
};
export function getMimeTypeCategory(mimeType) {
    for (const [category, types] of Object.entries(ALLOWED_MIME_TYPES)) {
        if (types.includes(mimeType)) {
            return category;
        }
    }
    return null;
}
// ============================================
// Zod 擴展驗證器
// ============================================
export const extendedValidators = {
    contentHash: z.string().regex(/^[a-f0-9]{64}$/i, 'Invalid SHA-256 hash'),
    uuid: z.string().uuid('Invalid UUID format'),
    tag: z.string()
        .min(1, 'Tag cannot be empty')
        .max(200, 'Tag is too long')
        .refine((val) => !/[<>{}[\]\\]/.test(val), 'Tag contains invalid characters'),
    mimeType: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i, 'Invalid MIME type format'),
    base64: z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/, 'Invalid Base64 format'),
    url: z.string().url('Invalid URL format'),
    ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Invalid IP address'),
    positiveNumber: z.number().positive('Must be a positive number'),
    percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
    confidence: z.number().min(0).max(1, 'Confidence score must be between 0 and 1'),
};
export async function validateBatch(items, validator) {
    const valid = [];
    const invalid = [];
    for (const item of items) {
        const result = await validator(item);
        if (result.valid) {
            valid.push(item);
        }
        else {
            invalid.push({
                item,
                errors: result.errors || ['Validation failed'],
            });
        }
    }
    return {
        valid,
        invalid,
        summary: {
            total: items.length,
            valid_count: valid.length,
            invalid_count: invalid.length,
        },
    };
}
// ============================================
// 清理與消毒
// ============================================
export function sanitizeString(input) {
    return input
        .replace(/[<>]/g, '') // 移除 HTML 標籤符號
        .replace(/javascript:/gi, '') // 移除 JavaScript 協議
        .replace(/on\w+\s*=/gi, '') // 移除事件處理器
        .trim();
}
export function sanitizeObject(obj, allowedKeys) {
    const sanitized = {};
    for (const key of allowedKeys) {
        if (key in obj) {
            const value = obj[key];
            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value);
            }
            else {
                sanitized[key] = value;
            }
        }
    }
    return sanitized;
}
// ============================================
// 檔案名稱驗證與清理
// ============================================
export function sanitizeFilename(filename) {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '') // 替換非法字符
        .replace(/\.{2,}/g, '.') // 移除多個連續點
        .replace(/^\.+|\.+$/g, '') // 移除開頭和結尾的點
        .substring(0, 255); // 限制長度
}
export function getFileExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}
export function isAllowedFileExtension(filename, allowedExtensions) {
    const ext = getFileExtension(filename);
    return allowedExtensions.includes(ext);
}
//# sourceMappingURL=validation.utils.js.map
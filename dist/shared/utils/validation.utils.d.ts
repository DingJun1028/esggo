/**
 * 驗證工具函數
 * 前後端通用的驗證邏輯
 */
import { z } from 'zod';
export interface ContentValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
        size: number;
        type: string;
        encoding?: string;
    };
}
export declare function validateContent(content: string | Buffer, contentType: string, options?: {
    maxSize?: number;
    allowedTypes?: string[];
    requireEncoding?: boolean;
}): Promise<ContentValidationResult>;
export declare function validateTag(tag: string): {
    valid: boolean;
    error?: string;
};
export declare function isValidUUID(uuid: string): boolean;
export declare function isValidMimeType(mimeType: string): boolean;
export declare const ALLOWED_MIME_TYPES: {
    text: string[];
    image: string[];
    video: string[];
    audio: string[];
    document: string[];
    archive: string[];
    json: string[];
};
export declare function getMimeTypeCategory(mimeType: string): string | null;
export declare const extendedValidators: {
    contentHash: z.ZodString;
    uuid: z.ZodString;
    tag: z.ZodString;
    mimeType: z.ZodString;
    base64: z.ZodString;
    url: z.ZodString;
    ipAddress: z.ZodString;
    positiveNumber: z.ZodNumber;
    percentage: z.ZodNumber;
    confidence: z.ZodNumber;
};
export interface BatchValidationResult<T> {
    valid: T[];
    invalid: Array<{
        item: T;
        errors: string[];
    }>;
    summary: {
        total: number;
        valid_count: number;
        invalid_count: number;
    };
}
export declare function validateBatch<T>(items: T[], validator: (item: T) => Promise<{
    valid: boolean;
    errors?: string[];
}>): Promise<BatchValidationResult<T>>;
export declare function sanitizeString(input: string): string;
export declare function sanitizeObject<T extends Record<string, unknown>>(obj: T, allowedKeys: (keyof T)[]): Partial<T>;
export declare function sanitizeFilename(filename: string): string;
export declare function getFileExtension(filename: string): string;
export declare function isAllowedFileExtension(filename: string, allowedExtensions: string[]): boolean;
//# sourceMappingURL=validation.utils.d.ts.map
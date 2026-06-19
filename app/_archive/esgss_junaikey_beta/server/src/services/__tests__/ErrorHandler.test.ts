/**
 * ErrorHandler.test.ts
 * 錯誤處理器單元測試
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError, ErrorHandler, ERROR_CODES } from '../ErrorHandler';

describe('AppError', () => {
    describe('constructor', () => {
        it('should create an error with default status code 500', () => {
            const error = new AppError('Test error');
            expect(error.message).toBe('Test error');
            expect(error.statusCode).toBe(500);
            expect(error.status).toBe('error');
            expect(error.isOperational).toBe(true);
        });

        it('should create an error with custom status code', () => {
            const error = new AppError('Not found', 404, 'ESG-DATA-100');
            expect(error.statusCode).toBe(404);
            expect(error.status).toBe('fail');
            expect(error.code).toBe('ESG-DATA-100');
        });

        it('should set status to "fail" for 4xx errors', () => {
            const error = new AppError('Bad request', 400);
            expect(error.status).toBe('fail');
        });
    });

    describe('fromCode', () => {
        it('should create AppError from error code key', () => {
            const error = AppError.fromCode('AUTH_INVALID_CREDENTIALS');
            expect(error.code).toBe('ESG-AUTH-001');
            expect(error.statusCode).toBe(401);
            expect(error.message).toBe('Invalid credentials');
            expect(error.messageTC).toBe('認證資訊無效');
        });

        it('should include details when provided', () => {
            const error = AppError.fromCode('DATA_VALIDATION_ERROR', { field: 'email' });
            expect(error.details).toEqual({ field: 'email' });
        });
    });

    describe('toJSON', () => {
        it('should return structured JSON response', () => {
            const error = AppError.fromCode('GAME_BATTLE_NOT_FOUND');
            const json = error.toJSON() as any;

            expect(json.success).toBe(false);
            expect(json.error.code).toBe('ESG-GAME-200');
            expect(json.error.message).toBe('Battle not found or expired');
            expect(json.error.messageTC).toBe('戰鬥不存在或已過期');
            expect(json.meta.statusCode).toBe(404);
            expect(json.meta.timestamp).toBeDefined();
        });
    });
});

describe('ErrorHandler', () => {
    let handler: ErrorHandler;

    beforeEach(() => {
        handler = ErrorHandler.getInstance();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    describe('getInstance', () => {
        it('should return singleton instance', () => {
            const instance1 = ErrorHandler.getInstance();
            const instance2 = ErrorHandler.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe('handle', () => {
        it('should handle AppError and return structured response', () => {
            const error = AppError.fromCode('API_RATE_LIMITED');
            const result = handler.handle(error, { requestId: 'req-123' });

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('ESG-API-300');
            expect(result.context.requestId).toBe('req-123');
            expect(result.context.statusCode).toBe(429);
        });

        it('should handle generic Error', () => {
            const error = new Error('Something went wrong');
            const result = handler.handle(error);

            expect(result.success).toBe(false);
            expect(result.error.code).toBe('ESG-SYS-400');
            expect(result.context.isOperational).toBe(false);
        });
    });
});

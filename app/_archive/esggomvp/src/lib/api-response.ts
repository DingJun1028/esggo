import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { OmniError, OmniErrorCode } from '@/core/errors/OmniError';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    metadata: {
        timestamp: number;
        path?: string;
        [key: string]: unknown;
    };
}

export function successResponse<T>(data: T, metadata: Record<string, unknown> = {}, status: number = 200) {
    const response: ApiResponse<T> = {
        success: true,
        data,
        metadata: {
            timestamp: Date.now(),
            ...metadata,
        },
    };

    return NextResponse.json(response, {
        status,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    });
}

export function errorResponse(error: unknown, request?: Request | NextRequest) {
    let statusCode = 500;
    let code = OmniErrorCode.INTERNAL_ERROR.toString();
    let message = 'An unexpected error occurred';
    let details: unknown = undefined;

    if (error instanceof OmniError) {
        statusCode = error.status;
        code = error.code;
        message = error.message;
        details = error.details;
        // Known operational errors (4xx) — warn level only
        if (statusCode < 500) {
            console.warn('[OmniError]', { code, message, status: statusCode, details });
        } else {
            console.error('[OmniError] Server Error', { code, message, status: statusCode, details });
        }
    } else if (error instanceof Error) {
        message = error.message;
        // Unexpected errors always get full error logging
        console.error('[Unhandled Error]', error);
    } else if (typeof error === 'string') {
        message = error;
        console.error('[String Error]', message);
    }

    const response: ApiResponse = {
        success: false,
        error: {
            code,
            message,
            details,
        },
        metadata: {
            timestamp: Date.now(),
            path: request ? new URL(request.url).pathname : undefined,
        },
    };

    return NextResponse.json(response, { status: statusCode });
}

/**
 * Wraps an async route handler to standardize success and error responses.
 * Typed for Next.js App Router: handler receives (req, context) where context
 * carries dynamic route params as `{ params: Promise<Record<string, string>> }`.
 */
export function withErrorHandler<
    TReq extends Request = NextRequest,
    TCtx = { params: Promise<Record<string, string>> },
>(handler: (req: TReq, ctx: TCtx) => Promise<NextResponse | Response>) {
    return async (req: TReq, ctx: TCtx) => {
        try {
            return await handler(req, ctx);
        } catch (error) {
            return errorResponse(error, req);
        }
    };
}

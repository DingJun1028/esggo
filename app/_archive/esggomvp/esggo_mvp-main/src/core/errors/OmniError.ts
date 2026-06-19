export enum OmniErrorCode {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    BAD_REQUEST = 'BAD_REQUEST',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    PROTOCOL_VIOLATION = 'PROTOCOL_VIOLATION',
}

export class OmniError extends Error {
    public code: OmniErrorCode;
    public details?: unknown;
    public status: number;

    constructor(message: string, code: OmniErrorCode = OmniErrorCode.INTERNAL_ERROR, status: number = 500, details?: unknown) {
        super(message);
        this.name = 'OmniError';
        this.code = code;
        this.status = status;
        this.details = details;

        Object.setPrototypeOf(this, OmniError.prototype);
    }

    static badRequest(message: string, details?: unknown) {
        return new OmniError(message, OmniErrorCode.BAD_REQUEST, 400, details);
    }

    static unauthorized(message: string = 'Unauthorized', details?: unknown) {
        return new OmniError(message, OmniErrorCode.UNAUTHORIZED, 401, details);
    }

    static forbidden(message: string = 'Forbidden', details?: unknown) {
        return new OmniError(message, OmniErrorCode.FORBIDDEN, 403, details);
    }

    static notFound(message: string = 'Not Found', details?: unknown) {
        return new OmniError(message, OmniErrorCode.NOT_FOUND, 404, details);
    }

    static internal(message: string = 'Internal Server Error', details?: unknown) {
        return new OmniError(message, OmniErrorCode.INTERNAL_ERROR, 500, details);
    }

    static rateLimit(message: string = 'Too Many Requests', details?: unknown) {
        return new OmniError(message, OmniErrorCode.RATE_LIMIT_EXCEEDED, 429, details);
    }

    static validationError(message: string = 'Validation Error', details?: unknown) {
        return new OmniError(message, OmniErrorCode.VALIDATION_ERROR, 422, details);
    }

    static protocolViolation(message: string = 'Protocol Violation', details?: unknown) {
        return new OmniError(message, OmniErrorCode.PROTOCOL_VIOLATION, 400, details);
    }
}

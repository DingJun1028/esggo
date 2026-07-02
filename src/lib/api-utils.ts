import { NextResponse } from 'next/server';
import { ERROR_CODES, ErrorCodeKey, HTTP_STATUS } from './errors';

export function jsonResponse<T>(data: T, status: number = HTTP_STATUS.OK): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(errorKey: ErrorCodeKey, customMessage?: string, status?: number): NextResponse {
  const error = ERROR_CODES[errorKey];
  return NextResponse.json(
    {
      success: false,
      error: customMessage || error.message,
      code: error.code,
    },
    { status: status || error.httpStatus }
  );
}

export function validateParams(params: Record<string, unknown>): { valid: boolean; missing?: string } {
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      return { valid: false, missing: key };
    }
  }
  return { valid: true };
}

export function validatePositiveNumber(value: unknown, fieldName: string): { valid: boolean; error?: string } {
  if (typeof value !== 'number' || value <= 0) {
    return { valid: false, error: `${fieldName} 必須為正數` };
  }
  return { valid: true };
}

export function sanitizeString(input: string, maxLength?: number): string {
  let result = input.trim();
  if (maxLength && result.length > maxLength) {
    result = result.slice(0, maxLength);
  }
  return result;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function computeHash(data: unknown): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}
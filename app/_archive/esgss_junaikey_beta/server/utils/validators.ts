/**
 * 🛡️ 輸入驗證工具集
 * [協議] 階段 103: 安全性強化
 * 提供全面的輸入驗證、消毒和類型檢查功能
 */

import { z } from 'zod';
import omniLogger, { LogCategory } from './omniLogger.js';

// ==================== 類型定義 ====================

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface SanitizationOptions {
  trim?: boolean;
  escapeHtml?: boolean;
  normalizeEmail?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  removeExtraSpaces?: boolean;
  allowSpecialChars?: boolean;
}

// ==================== Zod Schema 定義 ====================

// 電子郵件驗證
export const emailSchema = z.string()
  .email('請輸入有效的電子郵件地址')
  .toLowerCase()
  .trim();

// 手機號碼驗證（台灣格式）
export const taiwanPhoneSchema = z.string()
  .regex(/^09\d{8}$/, '請輸入有效的手機號碼（格式：0912345678）');

// 電話號碼驗證（國際格式）
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, '請輸入有效的電話號碼');

// 用戶名稱驗證
export const usernameSchema = z.string()
  .min(3, '用戶名稱至少需要 3 個字元')
  .max(20, '用戶名稱最多 20 個字元')
  .regex(/^[a-zA-Z0-9_]+$/, '用戶名稱只能包含英數字和底線')
  .trim();

// 密碼驗證
export const passwordSchema = z.string()
  .min(8, '密碼至少需要 8 個字元')
  .max(128, '密碼最多 128 個字元')
  .regex(/[A-Z]/, '密碼必須包含至少一個大寫字母')
  .regex(/[a-z]/, '密碼必須包含至少一個小寫字母')
  .regex(/[0-9]/, '密碼必須包含至少一個數字')
  .regex(/[^A-Za-z0-9]/, '密碼必須包含至少一個特殊字元');

// URL 驗證
export const urlSchema = z.string()
  .url('請輸入有效的 URL')
  .or(z.string().includes('localhost', { message: 'URL 格式不正確' }))
  .trim();

// UUID 驗證
export const uuidSchema = z.string()
  .uuid('請輸入有效的 UUID');

// 日期驗證
export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必須為 YYYY-MM-DD');

// 日期時間驗證
export const dateTimeSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/, '日期時間格式不正確');

// 正整數驗證
export const positiveIntSchema = z.number()
  .int('必須是整數')
  .positive('必須是正數');

// 整數範圍驗證
export const intRangeSchema = (min: number, max: number) => z.number()
  .int('必須是整數')
  .min(min, `數值必須大於等於 ${min}`)
  .max(max, `數值必須小於等於 ${max}`);

// ==================== 自訂驗證器 ====================

/**
 * 電子郵件驗證
 */
export const validateEmail = (email: string): ValidationResult<string> => {
  try {
    const result = emailSchema.parse(email);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field: 'email',
        message: error.errors?.[0]?.message || '電子郵件格式不正確',
        code: 'INVALID_EMAIL',
      }],
    };
  }
};

/**
 * 手機號碼驗證
 */
export const validateTaiwanPhone = (phone: string): ValidationResult<string> => {
  try {
    const result = taiwanPhoneSchema.parse(phone);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field: 'phone',
        message: error.errors?.[0]?.message || '手機號碼格式不正確',
        code: 'INVALID_PHONE',
      }],
    };
  }
};

/**
 * 用戶名稱驗證
 */
export const validateUsername = (username: string): ValidationResult<string> => {
  try {
    const result = usernameSchema.parse(username);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field: 'username',
        message: error.errors?.[0]?.message || '用戶名稱格式不正確',
        code: 'INVALID_USERNAME',
      }],
    };
  }
};

/**
 * 密碼強度驗證
 */
export const validatePassword = (password: string): ValidationResult<string> => {
  try {
    const result = passwordSchema.parse(password);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      errors: error.errors?.map((e: any) => ({
        field: 'password',
        message: e.message,
        code: 'INVALID_PASSWORD',
      })) || [{
        field: 'password',
        message: '密碼強度不足',
        code: 'INVALID_PASSWORD',
      }],
    };
  }
};

/**
 * URL 驗證
 */
export const validateUrl = (url: string): ValidationResult<string> => {
  try {
    const result = urlSchema.parse(url);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field: 'url',
        message: error.errors?.[0]?.message || 'URL 格式不正確',
        code: 'INVALID_URL',
      }],
    };
  }
};

/**
 * UUID 驗證
 */
export const validateUuid = (uuid: string): ValidationResult<string> => {
  try {
    const result = uuidSchema.parse(uuid);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field: 'uuid',
        message: error.errors?.[0]?.message || 'UUID 格式不正確',
        code: 'INVALID_UUID',
      }],
    };
  }
};

/**
 * 數值範圍驗證
 */
export const validateIntRange = (
  value: number,
  min: number,
  max: number,
  field: string = 'value'
): ValidationResult<number> => {
  try {
    const result = intRangeSchema(min, max).parse(value);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field,
        message: error.errors?.[0]?.message || `數值必須在 ${min} 到 ${max} 之間`,
        code: 'INVALID_RANGE',
      }],
    };
  }
};

// ==================== 物件驗證 ====================

/**
 * 物件 schema 驗證
 */
export const validateObject = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options?: { strict?: boolean }
): ValidationResult<T> => {
  try {
    const result = schema.parse(data, {
      ...options,
    });
    return { success: true, data: result };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: 'VALIDATION_ERROR',
        })),
      };
    }
    return {
      success: false,
      errors: [{
        field: 'unknown',
        message: '驗證過程發生錯誤',
        code: 'VALIDATION_ERROR',
      }],
    };
  }
};

/**
 * 創建自訂物件驗證器
 */
export const createObjectValidator = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): ValidationResult<T> => {
    return validateObject(schema, data);
  };
};

// ==================== 輸入消毒 ====================

/**
 * HTML 特殊字元轉義
 */
export const escapeHtml = (str: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char]);
};

/**
 * SQL 注入防護
 */
export const escapeSql = (str: string): string => {
  return str
    .replace(/'/g, "''")
    .replace(/"/g, '""')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
};

/**
 * 移除危險字元
 */
export const sanitizeDangerousChars = (str: string): string => {
  return str
    .replace(/[<>{}()\[\]\\^|~`]/g, '')
    .replace(/\0/g, '');
};

/**
 * 消毒輸入字串
 */
export const sanitizeInput = (
  input: unknown,
  options: SanitizationOptions = {}
): string => {
  if (typeof input !== 'string') {
    return '';
  }

  let result = input;

  if (options.trim) {
    result = result.trim();
  }

  if (options.removeExtraSpaces) {
    result = result.replace(/\s+/g, ' ').trim();
  }

  if (options.toLowerCase) {
    result = result.toLowerCase();
  }

  if (options.toUpperCase) {
    result = result.toUpperCase();
  }

  if (!options.allowSpecialChars) {
    result = sanitizeDangerousChars(result);
  }

  if (options.escapeHtml) {
    result = escapeHtml(result);
  }

  return result;
};

/**
 * 消毒物件
 */
export const sanitizeObject = <T extends Record<string, unknown>>(
  obj: T,
  options: SanitizationOptions = {}
): T => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, options);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, options);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};

/**
 * 消毒請求體
 */
export const sanitizeRequestBody = (
  body: unknown,
  options: SanitizationOptions = { trim: true, escapeHtml: true }
): Record<string, unknown> => {
  if (typeof body !== 'object' || body === null) {
    return {};
  }

  return sanitizeObject(body as Record<string, unknown>, options);
};

// ==================== XSS 防護 ====================

/**
 * 檢測潛在 XSS
 */
export const detectXss = (input: string): boolean => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /expression\(/gi,
    /data:/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
};

/**
 * XSS 過濾器
 */
export const xssFilter = (input: string): string => {
  let result = input;

  // 移除 script 標籤
  result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // 移除事件處理器
  result = result.replace(/on\w+="[^"]*"/gi, '');
  result = result.replace(/on\w+='[^']*'/gi, '');
  result = result.replace(/on\w+=\w+/gi, '');
  
  // 移除 javascript: 協議
  result = result.replace(/javascript:/gi, '');
  
  // 移除 data: 協議
  result = result.replace(/data:/gi, '');
  
  // 移除 HTML 標籤（保留換行）
  result = result.replace(/<[^>]+>/g, '\n');
  
  // 清理殘留
  result = result.replace(/&nbsp;/g, ' ');
  
  return result.trim();
};

// ==================== 檔案名稱驗證 ====================

/**
 * 安全檔案名稱
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
};

/**
 * 驗證檔案類型
 */
export const validateFileType = (
  filename: string,
  allowedTypes: string[]
): ValidationResult<{ ext: string; mime: string }> => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  if (!allowedTypes.includes(ext)) {
    return {
      success: false,
      errors: [{
        field: 'file',
        message: `不支援的檔案類型。允許的類型：${allowedTypes.join(', ')}`,
        code: 'INVALID_FILE_TYPE',
      }],
    };
  }

  return {
    success: true,
    data: { ext, mime: `application/${ext}` },
  };
};

// ==================== 通用驗證工廠 ====================

/**
 * 創建必填驗證
 */
export const required = (field: string) => {
  return (value: unknown): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return {
        success: false,
        errors: [{
          field,
          message: `${field} 為必填欄位`,
          code: 'REQUIRED',
        }],
      };
    }
    return { success: true };
  };
};

/**
 * 創建字串長度驗證
 */
export const stringLength = (field: string, min: number, max: number) => {
  return (value: string): ValidationResult => {
    if (typeof value !== 'string') {
      return {
        success: false,
        errors: [{
          field,
          message: `${field} 必須是字串`,
          code: 'INVALID_TYPE',
        }],
      };
    }

    if (value.length < min || value.length > max) {
      return {
        success: false,
        errors: [{
          field,
          message: `${field} 長度必須在 ${min} 到 ${max} 之間`,
          code: 'INVALID_LENGTH',
        }],
      };
    }

    return { success: true };
  };
};

/**
 * 創建自訂正則驗證
 */
export const regex = (field: string, pattern: RegExp, message: string) => {
  return (value: string): ValidationResult => {
    if (!pattern.test(value)) {
      return {
        success: false,
        errors: [{
          field,
          message,
          code: 'INVALID_FORMAT',
        }],
      };
    }
    return { success: true };
  };
};

// ==================== 記錄驗證錯誤 ====================

/**
 * 記錄驗證錯誤
 */
export const logValidationError = (
  context: string,
  errors: ValidationError[]
): void => {
  omniLogger.warn(LogCategory.SECURITY, 'Validation Failed', {
    context,
    errors: errors.map((e) => `${e.field}: ${e.message}`),
  });
};

// ==================== 導出 ====================

export default {
  // Schema
  emailSchema,
  taiwanPhoneSchema,
  phoneSchema,
  usernameSchema,
  passwordSchema,
  urlSchema,
  uuidSchema,
  dateSchema,
  dateTimeSchema,
  positiveIntSchema,
  intRangeSchema,

  // Validators
  validateEmail,
  validateTaiwanPhone,
  validateUsername,
  validatePassword,
  validateUrl,
  validateUuid,
  validateIntRange,
  validateObject,
  createObjectValidator,

  // Sanitization
  escapeHtml,
  escapeSql,
  sanitizeDangerousChars,
  sanitizeInput,
  sanitizeObject,
  sanitizeRequestBody,

  // XSS
  detectXss,
  xssFilter,

  // File
  sanitizeFilename,
  validateFileType,

  // Factory
  required,
  stringLength,
  regex,

  // Utils
  logValidationError,
};

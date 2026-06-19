/**
 * errorCodes.ts
 * 統一錯誤碼註冊表 (Error Code Registry)
 * 格式: ESG-{CATEGORY}-{NUMBER}
 * 
 * Categories:
 * - AUTH: 認證相關
 * - DATA: 數據相關
 * - GAME: 遊戲系統相關
 * - API: API 相關
 * - SYS: 系統相關
 */

export interface ErrorCodeDefinition {
    code: string;
    httpStatus: number;
    message: string;
    messageTC: string;
}

export const ERROR_CODES = {
    // ===== AUTH 認證相關 (001-099) =====
    AUTH_INVALID_CREDENTIALS: {
        code: 'ESG-AUTH-001',
        httpStatus: 401,
        message: 'Invalid credentials',
        messageTC: '認證資訊無效',
    },
    AUTH_TOKEN_EXPIRED: {
        code: 'ESG-AUTH-002',
        httpStatus: 401,
        message: 'Token has expired',
        messageTC: '權杖已過期',
    },
    AUTH_TOKEN_INVALID: {
        code: 'ESG-AUTH-003',
        httpStatus: 401,
        message: 'Invalid token',
        messageTC: '無效的權杖',
    },
    AUTH_INSUFFICIENT_PERMISSIONS: {
        code: 'ESG-AUTH-004',
        httpStatus: 403,
        message: 'Insufficient permissions',
        messageTC: '權限不足',
    },

    // ===== DATA 數據相關 (100-199) =====
    DATA_NOT_FOUND: {
        code: 'ESG-DATA-100',
        httpStatus: 404,
        message: 'Resource not found',
        messageTC: '找不到資源',
    },
    DATA_VALIDATION_ERROR: {
        code: 'ESG-DATA-101',
        httpStatus: 400,
        message: 'Data validation failed',
        messageTC: '數據驗證失敗',
    },
    DATA_DUPLICATE: {
        code: 'ESG-DATA-102',
        httpStatus: 409,
        message: 'Duplicate entry',
        messageTC: '資料重複',
    },
    DATA_INTEGRITY_ERROR: {
        code: 'ESG-DATA-103',
        httpStatus: 500,
        message: 'Data integrity violation',
        messageTC: '數據完整性異常',
    },

    // ===== GAME 遊戲相關 (200-299) =====
    GAME_BATTLE_NOT_FOUND: {
        code: 'ESG-GAME-200',
        httpStatus: 404,
        message: 'Battle not found or expired',
        messageTC: '戰鬥不存在或已過期',
    },
    GAME_CARD_NOT_OWNED: {
        code: 'ESG-GAME-201',
        httpStatus: 400,
        message: 'Card not in collection',
        messageTC: '卡牌不在收藏中',
    },
    GAME_INSUFFICIENT_ENERGY: {
        code: 'ESG-GAME-202',
        httpStatus: 400,
        message: 'Insufficient energy',
        messageTC: '能量不足',
    },
    GAME_NOT_YOUR_TURN: {
        code: 'ESG-GAME-203',
        httpStatus: 400,
        message: 'Not your turn',
        messageTC: '不是您的回合',
    },
    GAME_DECK_INVALID: {
        code: 'ESG-GAME-204',
        httpStatus: 400,
        message: 'Invalid deck configuration',
        messageTC: '牌組配置無效',
    },

    // ===== API 相關 (300-399) =====
    API_RATE_LIMITED: {
        code: 'ESG-API-300',
        httpStatus: 429,
        message: 'Too many requests',
        messageTC: '請求過於頻繁，請稍後再試',
    },
    API_BAD_REQUEST: {
        code: 'ESG-API-301',
        httpStatus: 400,
        message: 'Bad request',
        messageTC: '請求格式錯誤',
    },
    API_ROUTE_NOT_FOUND: {
        code: 'ESG-API-302',
        httpStatus: 404,
        message: 'Route not found',
        messageTC: '路由不存在',
    },
    API_METHOD_NOT_ALLOWED: {
        code: 'ESG-API-303',
        httpStatus: 405,
        message: 'Method not allowed',
        messageTC: '不允許的請求方法',
    },

    // ===== SYS 系統相關 (400-499) =====
    SYS_INTERNAL_ERROR: {
        code: 'ESG-SYS-400',
        httpStatus: 500,
        message: 'Internal server error',
        messageTC: '伺服器內部錯誤',
    },
    SYS_DATABASE_ERROR: {
        code: 'ESG-SYS-401',
        httpStatus: 500,
        message: 'Database operation failed',
        messageTC: '資料庫操作失敗',
    },
    SYS_EXTERNAL_SERVICE_ERROR: {
        code: 'ESG-SYS-402',
        httpStatus: 502,
        message: 'External service unavailable',
        messageTC: '外部服務不可用',
    },
    SYS_REDIS_ERROR: {
        code: 'ESG-SYS-403',
        httpStatus: 500,
        message: 'Cache operation failed',
        messageTC: '快取操作失敗',
    },
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES;

/**
 * 根據錯誤碼鍵取得完整錯誤定義
 */
export function getErrorDefinition(key: ErrorCodeKey): ErrorCodeDefinition {
    return ERROR_CODES[key];
}

/**
 * 根據錯誤碼字串反查定義
 */
export function findErrorByCode(code: string): ErrorCodeDefinition | undefined {
    return Object.values(ERROR_CODES).find((def) => def.code === code);
}

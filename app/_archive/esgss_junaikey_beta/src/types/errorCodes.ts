/**
 * 奧秘系列 統一錯誤代碼規範 (Omni Error Code Standards)
 * 遵循 5T 協議與奧秘品牌化，提供標準化、可追蹤的錯誤診斷碼。
 */

export enum OmniErrorCode {
    // 通用錯誤 (General Errors)
    UNKNOWN_ERROR = 'OMNI_ERR_000',
    INTERNAL_ERROR = 'OMNI_ERR_001',
    NOT_IMPLEMENTED = 'OMNI_ERR_002',
    TIMEOUT = 'OMNI_ERR_003',

    // 驗證與數據錯誤 (Validation & Data Errors)
    VALIDATION_ERROR = 'OMNI_ERR_100',
    INVALID_INPUT = 'OMNI_ERR_101',
    DATA_CORRUPTION = 'OMNI_ERR_102',
    SCHEMA_MISMATCH = 'OMNI_ERR_103',
    INVALID_ACTION = 'OMNI_ERR_104',

    // 認證與授權 (Auth & Authorization)
    AUTH_REQUIRED = 'OMNI_ERR_200',
    INVALID_TOKEN = 'OMNI_ERR_201',
    PERMISSION_DENIED = 'OMNI_ERR_202',
    USER_NOT_FOUND = 'OMNI_ERR_203',

    // API 與 網路錯誤 (API & Network Errors)
    NETWORK_ERROR = 'OMNI_ERR_300',
    API_FAILURE = 'OMNI_ERR_301',
    RATE_LIMIT_EXCEEDED = 'OMNI_ERR_302',
    SERVER_UNAVAILABLE = 'OMNI_ERR_303',
    DEPENDENCY_ERROR = 'OMNI_ERR_304',

    // 業務邏輯與 5T 協議 (Business Logic & 5T Protocol)
    PROTOCOL_VIOLATION = 'OMNI_ERR_400',
    TRACKING_FAILURE = 'OMNI_ERR_401',
    TRUTH_VERIFICATION_FAILED = 'OMNI_ERR_402',
    LOCK_ERROR = 'OMNI_ERR_403'
}

export interface ErrorCode {
  code: string;
  message: string;
  httpStatus: number;
  description?: string;
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const ERROR_CODES = {
  INVALID_PARAMS: {
    code: 'ERR_INVALID_PARAMS',
    message: '無效的請求參數',
    httpStatus: HTTP_STATUS.BAD_REQUEST,
    description: '請求參數驗證失敗',
  },
  UNAUTHORIZED: {
    code: 'ERR_UNAUTHORIZED',
    message: '未授權存取',
    httpStatus: HTTP_STATUS.UNAUTHORIZED,
    description: 'API Key 或認證無效',
  },
  FORBIDDEN: {
    code: 'ERR_FORBIDDEN',
    message: '禁止存取',
    httpStatus: HTTP_STATUS.FORBIDDEN,
    description: '無權限執行此操作',
  },
  NOT_FOUND: {
    code: 'ERR_NOT_FOUND',
    message: '資源不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: '請求的資源或資料不存在',
  },
  PROJECT_NOT_FOUND: {
    code: 'ERR_PROJECT_NOT_FOUND',
    message: '專案不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: 'Village 專案 ID 不存在',
  },
  MEMBER_NOT_FOUND: {
    code: 'ERR_MEMBER_NOT_FOUND',
    message: '會員不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: 'Village 會員 ID 不存在',
  },
  INSUFFICIENT_POINTS: {
    code: 'ERR_INSUFFICIENT_POINTS',
    message: 'PTS 點數不足',
    httpStatus: HTTP_STATUS.BAD_REQUEST,
    description: '投票所需點數不足',
  },
  RATE_LIMITED: {
    code: 'ERR_RATE_LIMITED',
    message: '請求頻率過高',
    httpStatus: HTTP_STATUS.TOO_MANY_REQUESTS,
    description: '超過速率限制，請稍後再試',
  },
  AI_RATE_LIMITED: {
    code: 'ERR_AI_RATE_LIMITED',
    message: 'AI 請求頻率過高',
    httpStatus: HTTP_STATUS.TOO_MANY_REQUESTS,
    description: 'AI 服務速率限制',
  },
  EXTERNAL_SERVICE_ERROR: {
    code: 'ERR_EXTERNAL_SERVICE',
    message: '外部服務錯誤',
    httpStatus: HTTP_STATUS.BAD_GATEWAY,
    description: '調用外部 API 時發生錯誤',
  },
  BRIDGE_UNREACHABLE: {
    code: 'ERR_BRIDGE_UNREACHABLE',
    message: '橋接服務不可達',
    httpStatus: HTTP_STATUS.BAD_GATEWAY,
    description: '無法連接到下一代服務',
  },
  TASK_NOT_FOUND: {
    code: 'ERR_TASK_NOT_FOUND',
    message: '任務不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: '請求的任務 ID 不存在',
  },
  USER_NOT_FOUND: {
    code: 'ERR_USER_NOT_FOUND',
    message: '用戶不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: '請求的用戶 ID 不存在',
  },
  SKILL_NOT_FOUND: {
    code: 'ERR_SKILL_NOT_FOUND',
    message: '技能不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: '請求的技能 ID 不存在',
  },
  UNKNOWN_TOOL: {
    code: 'ERR_UNKNOWN_TOOL',
    message: '未知的工具呼叫',
    httpStatus: HTTP_STATUS.BAD_REQUEST,
    description: '不支援的工具類型',
  },
  INVALID_ACTION: {
    code: 'ERR_INVALID_ACTION',
    message: '無效的操作',
    httpStatus: HTTP_STATUS.BAD_REQUEST,
    description: '請求的操作類型無效',
  },
  ALERT_NOT_FOUND: {
    code: 'ERR_ALERT_NOT_FOUND',
    message: '警示不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: '請求的警示 ID 不存在',
  },
  COMPANY_NOT_FOUND: {
    code: 'ERR_COMPANY_NOT_FOUND',
    message: '公司不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: '請求的公司 ID 不存在',
  },
  SOURCE_NOT_FOUND: {
    code: 'ERR_SOURCE_NOT_FOUND',
    message: '來源不存在',
    httpStatus: HTTP_STATUS.NOT_FOUND,
    description: '爬蟲來源 ID 不存在',
  },
  CRAWL_ERROR: {
    code: 'ERR_CRAWL_ERROR',
    message: '爬蟲任務失敗',
    httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    description: 'ESG 爬蟲過程中發生錯誤',
  },
  INTERNAL_ERROR: {
    code: 'ERR_INTERNAL',
    message: '內部伺服器錯誤',
    httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    description: '未預期的伺服器錯誤',
  },
  UNKNOWN_ERROR: {
    code: 'ERR_UNKNOWN',
    message: '未知錯誤',
    httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    description: '發生未預期的錯誤',
  },
  API_KEY_MISSING: {
    code: 'ERR_API_KEY_MISSING',
    message: '缺少 API 金鑰',
    httpStatus: HTTP_STATUS.BAD_REQUEST,
    description: '必需的 API 金鑰未設定',
  },
  EMBEDDING_FAILED: {
    code: 'ERR_EMBEDDING_FAILED',
    message: '向量生成失敗',
    httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    description: '無法為查詢生成嵌入向量',
  },
  RAG_QUERY_FAILED: {
    code: 'ERR_RAG_QUERY_FAILED',
    message: '知識檢索失敗',
    httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    description: 'RAG 查詢過程中發生錯誤',
  },
  WORKFLOW_FAILED: {
    code: 'ERR_WORKFLOW_FAILED',
    message: '工作流程失敗',
    httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    description: '工作流程執行失敗',
  },
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES;

export function createError(key: ErrorCodeKey, customMessage?: string): Response {
  const error = ERROR_CODES[key];
  return new Response(
    JSON.stringify({
      success: false,
      error: customMessage || error.message,
      code: error.code,
    }),
    {
      status: error.httpStatus,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function createSuccessResponse<T>(data: T, message?: string): Response {
  return new Response(
    JSON.stringify({
      success: true,
      message,
      data,
    }),
    {
      status: HTTP_STATUS.OK,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
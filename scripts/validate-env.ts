/**
 * =============================================================================
 * OmniCore V5.1 — 環境變數驗證器
 * =============================================================================
 *
 * 在應用啟動時自動驗證所有必要的環境變數。
 * 遺漏時拋出明確的錯誤訊息，防止靜默失敗。
 *
 * 使用方式：在 instrumentation.ts 或 next.config.js 中引入
 */

interface EnvSpec {
  key: string;
  required: boolean;
  description: string;
  /** 驗證函數（可選） */
  validate?: (value: string) => boolean;
  /** 敏感資料（不記錄值） */
  secret?: boolean;
}

const ENV_SPECS: EnvSpec[] = [
  // ── 應用設定 ───────────────────────────────
  {
    key: 'NODE_ENV',
    required: true,
    description: 'Node.js 執行環境',
    validate: (v) => ['development', 'production', 'test'].includes(v),
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    required: process.env.NODE_ENV === 'production',
    description: '應用公開 URL（生產必填）',
    validate: (v) => v.startsWith('http'),
  },

  // ── AI 模型 ────────────────────────────────
  {
    key: 'GEMINI_API_KEY',
    required: true,
    description: 'Google Gemini API Key',
    secret: true,
  },

  // ── 資料庫 ─────────────────────────────────
  {
    key: 'DATABASE_URL',
    required: process.env.NODE_ENV === 'production',
    description: 'PostgreSQL 連線字串（生產必填）',
    secret: true,
    validate: (v) => v.startsWith('postgres'),
  },

  // ── Supabase ──────────────────────────────
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    required: false,
    description: 'Supabase 專案 URL',
    validate: (v) => v.startsWith('https://'),
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    required: false,
    description: 'Supabase Service Role Key（後端僅用）',
    secret: true,
  },
];

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warned: number;
  };
}

/**
 * 驗證所有環境變數
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const spec of ENV_SPECS) {
    const value = process.env[spec.key];

    if (!value || value.trim() === '') {
      if (spec.required) {
        errors.push(
          `❌ [MISSING] ${spec.key}: ${spec.description}`
        );
      } else {
        warnings.push(
          `⚠️  [OPTIONAL] ${spec.key}: ${spec.description} (未設定)`
        );
      }
      continue;
    }

    // 執行自訂驗證
    if (spec.validate && !spec.validate(value)) {
      const msg = `❌ [INVALID] ${spec.key}: 值格式不正確`;
      if (spec.required) {
        errors.push(msg);
      } else {
        warnings.push(msg);
      }
      continue;
    }

    // 記錄通過（不記錄敏感資料的值）
    const displayValue = spec.secret
      ? `${value.substring(0, 8)}...（已遮蔽）`
      : value;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ [OK] ${spec.key} = ${displayValue}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      total: ENV_SPECS.length,
      passed: ENV_SPECS.length - errors.length - warnings.filter(w => w.includes('[OPTIONAL]')).length,
      failed: errors.length,
      warned: warnings.length,
    },
  };
}

/**
 * 強制驗證 — 失敗時直接拋出錯誤
 * 在 instrumentation.ts register() 中呼叫
 */
export function requireValidEnvironment(): void {
  const result = validateEnvironment();

  if (result.warnings.length > 0) {
    console.warn('\n[OmniCore EnvValidator] 環境變數警告:');
    result.warnings.forEach((w) => console.warn(` ${w}`));
  }

  if (!result.valid) {
    const errorMsg = [
      '\n[OmniCore EnvValidator] ⛔ 環境變數驗證失敗！',
      `發現 ${result.summary.failed} 個必要變數遺漏：`,
      ...result.errors,
      '',
      '請參考 .env.production.example 完成設定後再啟動應用。',
    ].join('\n');

    throw new Error(errorMsg);
  }

  console.log(
    `\n[OmniCore EnvValidator] ✅ 環境驗證通過 ` +
    `(${result.summary.passed}/${result.summary.total} 項目)`
  );
}

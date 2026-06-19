/**
 * 配置驗證工具
 * Configuration Validation Utility
 * 
 * 確保所有必要的環境變量都已正確配置，
 * 並提供詳細的錯誤信息和建議。
 */

import dotenv from 'dotenv';

// 載入環境變量
dotenv.config();

// ============================================================================
// 類型定義
// ============================================================================

interface EnvVariable {
  name: string;
  required: boolean;
  defaultValue?: string;
  description: string;
  validate?: (value: string) => boolean;
  errorMessage?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

// ============================================================================
// 必要環境變量配置
// ============================================================================

const REQUIRED_VARIABLES: EnvVariable[] = [
  {
    name: 'GEMINI_API_KEY',
    required: true,
    description: 'Google Gemini API Key - 核心 AI 服務',
    validate: (value) => value.startsWith('AIza') && value.length > 30,
    errorMessage: 'GEMINI_API_KEY 格式無效，應以 "AIza" 開頭'
  },
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    description: 'Supabase 專案 URL',
    validate: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
    errorMessage: 'VITE_SUPABASE_URL 格式無效，應為有效的 Supabase URL'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase Anonymous Key',
    validate: (value) => value.startsWith('eyJ') && value.length > 100,
    errorMessage: 'VITE_SUPABASE_ANON_KEY 格式無效'
  },
];

const OPTIONAL_VARIABLES: EnvVariable[] = [
  {
    name: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API Key (可選，用於備用 AI 服務)',
    validate: (value) => value.startsWith('sk-') && value.length > 20,
  },
  {
    name: 'REDIS_URL',
    required: false,
    defaultValue: 'redis://localhost:6379',
    description: 'Redis 快取伺服器 URL',
    validate: (value) => value.startsWith('redis://'),
  },
  {
    name: 'JWT_SECRET',
    required: true,
    description: 'JWT 認證密鑰',
    validate: (value) => value.length >= 32,
    errorMessage: 'JWT_SECRET 長度至少需要 32 個字符'
  },
  {
    name: 'NODE_ENV',
    required: true,
    defaultValue: 'development',
    description: 'Node.js 運行環境',
    validate: (value) => ['development', 'production', 'test'].includes(value),
    errorMessage: 'NODE_ENV 必須是 development、production 或 test'
  },
];

// ============================================================================
// 驗證函數
// ============================================================================

/**
 * 驗證單個環境變量
 */
function validateVariable(variable: EnvVariable, currentValue: string | undefined): { isValid: boolean; message: string } {
  // 檢查是否提供
  if (!currentValue) {
    if (variable.required) {
      return { isValid: false, message: `${variable.name} 是必需的 (${variable.description})` };
    }
    if (variable.defaultValue) {
      return { isValid: true, message: `${variable.name} 未設置，使用默認值: ${variable.defaultValue}` };
    }
    return { isValid: true, message: `${variable.name} 未設置，為可選配置` };
  }

  // 如果提供了值，進行格式驗證
  if (variable.validate && !variable.validate(currentValue)) {
    return {
      isValid: false,
      message: variable.errorMessage || `${variable.name} 格式無效`
    };
  }

  return { isValid: true, message: `${variable.name} 配置正確` };
}

/**
 * 完整的環境變量驗證
 */
export function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    info: []
  };

  // 驗證必要變量
  for (const variable of REQUIRED_VARIABLES) {
    const validation = validateVariable(variable, process.env[variable.name]);
    
    if (!validation.isValid) {
      result.isValid = false;
      result.errors.push(validation.message);
    } else {
      result.info.push(validation.message);
    }
  }

  // 驗證可選變量
  for (const variable of OPTIONAL_VARIABLES) {
    const validation = validateVariable(variable, process.env[variable.name]);
    
    if (!validation.isValid) {
      result.warnings.push(validation.message);
    } else {
      result.info.push(validation.message);
    }
  }

  // 額外檢查
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    result.isValid = false;
    result.errors.push('生產環境必須設置 JWT_SECRET');
  }

  if (process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
    result.warnings.push('檢測到未更改的示例 API Key，請更換為實際的 API Key');
  }

  return result;
}

/**
 * 生成環境配置報告
 */
export function generateConfigReport(): string {
  const result = validateEnvironment();
  
  let report = '# 環境配置驗證報告\\n\\n';
  report += `**驗證狀態**: ${result.isValid ? '✅ 通過' : '❌ 失敗'}\\n\\n`;
  
  if (result.errors.length > 0) {
    report += '## 🔴 錯誤\\n\\n';
    result.errors.forEach(error => {
      report += `- ${error}\\n`;
    });
    report += '\\n';
  }
  
  if (result.warnings.length > 0) {
    report += '## 🟡 警告\\n\\n';
    result.warnings.forEach(warning => {
      report += `- ${warning}\\n`;
    });
    report += '\\n';
  }
  
  if (result.info.length > 0) {
    report += '## 🟢 信息\\n\\n';
    result.info.forEach(info => {
      report += `- ${info}\\n`;
    });
    report += '\\n';
  }
  
  return report;
}

/**
 * 檢查並提示用戶配置缺失的變量
 */
export function checkMissingConfig(): string[] {
  const missing: string[] = [];
  
  for (const variable of REQUIRED_VARIABLES) {
    if (!process.env[variable.name]) {
      missing.push(variable.name);
    }
  }
  
  return missing;
}

// ============================================================================
// 預設導出
// ============================================================================

export default {
  validateEnvironment,
  generateConfigReport,
  checkMissingConfig,
  REQUIRED_VARIABLES,
  OPTIONAL_VARIABLES
};

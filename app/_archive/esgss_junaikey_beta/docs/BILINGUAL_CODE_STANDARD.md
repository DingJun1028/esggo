# 繁中英碼雙語標準 (Bilingual Code Standard)

## 核心原則 (Core Principles)

### 1. 代碼標識符 - 英文優先
**Code Identifiers - English First**

所有代碼標識符（變數、函數、類別、介面等）使用英文命名，以確保：
- ✅ AI 工具友好性（AI Affinity）
- ✅ 國際協作便利性
- ✅ 技術生態系統兼容性

```typescript
// ✅ 正確 Correct
interface UserProfile {
  name: string;
  email: string;
}

// ❌ 錯誤 Incorrect
interface 用戶資料 {
  姓名: string;
  電郵: string;
}
```

---

### 2. 註釋與文檔 - 繁中優先，關鍵處雙語
**Comments & Documentation - Traditional Chinese First, Bilingual for Key Parts**

#### 檔案頭部註釋 (File Header Comments)
```typescript
/**
 * 🌍 統一國際化系統 (Unified Internationalization System)
 * --------------------------------------------------
 * [功能] 類型安全的繁體中文 / 英文雙向切換系統
 * [特性] 自動補全、嵌套鍵值、localStorage 持久化
 * [標準] 代碼標識符符合 AI Affinity (英文)，註釋文件符合主權標準 (繁中)
 */
```

#### 函數註釋 (Function Comments)
```typescript
/**
 * 從嵌套物件中獲取值
 * Get value from nested object
 * 
 * @param obj - 來源物件 Source object
 * @param path - 鍵值路徑 Key path (e.g., 'system.title')
 * @returns 翻譯文字或原始鍵值 Translation text or original key
 */
function getNestedValue(obj: any, path: string): string {
  // 實作...
}
```

#### 行內註釋 (Inline Comments)
```typescript
// 從 localStorage 讀取語言設定，若無則使用預設值
const [language, setLanguageState] = useState<Language>(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('app-language');
    if (stored === 'zh-TW' || stored === 'en-US') {
      return stored;
    }
  }
  return DEFAULT_LANGUAGE;
});
```

---

### 3. 類型定義 - 英文命名，繁中註釋
**Type Definitions - English Names, Traditional Chinese Comments**

```typescript
/**
 * 翻譯命名空間 - 系統核心
 * Translation Namespace - System Core
 */
export interface SystemTranslations {
  /** 系統標題 System title */
  title: string;
  /** 系統副標題 System subtitle */
  subtitle: string;
  /** 版本號 Version number */
  version: string;
}

/**
 * 支援的語言類型
 * Supported Language Types
 */
export type Language = 'zh-TW' | 'en-US';
```

---

### 4. 常數與配置 - 英文鍵值，繁中值
**Constants & Config - English Keys, Traditional Chinese Values**

```typescript
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網路連線錯誤',
  UNAUTHORIZED: '未授權訪問',
  NOT_FOUND: '找不到資源',
} as const;

export const UI_LABELS = {
  save: '儲存',
  cancel: '取消',
  confirm: '確認',
} as const;
```

---

## 使用範例 (Usage Examples)

### 範例 1: React 組件
```typescript
/**
 * 🎯 主權身份 UI 組件
 * Sovereign Identity UI Component
 * --------------------------------------------------
 * [功能] 顯示用戶主權身份資訊
 * [依賴] useI18n hook for bilingual support
 */

import React from 'react';
import { useI18n } from '@/utils/i18n';

export const SovereignIdentityCard: React.FC = () => {
  const { t, language, setLanguage } = useI18n();

  return (
    <div className="card">
      {/* 標題使用翻譯鍵值 Title uses translation key */}
      <h2>{t('collaboration.sovereignty')}</h2>
      
      {/* 語言切換按鈕 Language toggle button */}
      <button onClick={() => setLanguage(language === 'zh-TW' ? 'en-US' : 'zh-TW')}>
        {language === 'zh-TW' ? 'English' : '繁體中文'}
      </button>
    </div>
  );
};
```

### 範例 2: Service 層
```typescript
/**
 * 📊 數據驗證服務
 * Data Validation Service
 * --------------------------------------------------
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export class DataValidationService {
  /**
   * 驗證 ESG 報告數據
   * Validate ESG report data
   */
  async validateReport(data: ESGReportData): Promise<ValidationResult> {
    try {
      // 執行驗證邏輯 Execute validation logic
      const errors = this.checkDataIntegrity(data);
      
      if (errors.length > 0) {
        omniLogger.warn(LogCategory.VALIDATION, '數據驗證發現錯誤', { errors });
        return { valid: false, errors };
      }
      
      return { valid: true, errors: [] };
    } catch (error) {
      omniLogger.error(LogCategory.VALIDATION, '驗證過程發生異常', error);
      throw error;
    }
  }

  /**
   * 檢查數據完整性
   * Check data integrity
   */
  private checkDataIntegrity(data: ESGReportData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // 檢查必填欄位 Check required fields
    if (!data.companyName) {
      errors.push({ field: 'companyName', message: '公司名稱為必填' });
    }
    
    return errors;
  }
}
```

---

## 最佳實踐 (Best Practices)

### ✅ DO - 應該做的

1. **使用 i18n 系統處理所有 UI 文字**
   ```typescript
   // ✅ Good
   <h1>{t('system.title')}</h1>
   
   // ❌ Bad
   <h1>ESGss JunAiKey Beta</h1>
   ```

2. **為複雜邏輯提供雙語註釋**
   ```typescript
   /**
    * 計算碳排放強度（每單位產出的碳排放量）
    * Calculate carbon emission intensity (emissions per unit output)
    */
   function calculateEmissionIntensity(emissions: number, output: number): number {
     return emissions / output;
   }
   ```

3. **使用類型安全的翻譯鍵值**
   ```typescript
   // ✅ TypeScript 會自動補全和檢查
   const title = t('system.title'); // ✅ Valid
   const invalid = t('system.invalid'); // ❌ TypeScript error
   ```

### ❌ DON'T - 不應該做的

1. **不要混用中英文標識符**
   ```typescript
   // ❌ Bad
   const user名稱 = 'John';
   function get用戶Data() { }
   ```

2. **不要在代碼中硬編碼 UI 文字**
   ```typescript
   // ❌ Bad
   return <button>儲存</button>;
   
   // ✅ Good
   return <button>{t('ui.save')}</button>;
   ```

3. **不要省略關鍵函數的註釋**
   ```typescript
   // ❌ Bad - 無註釋
   function processData(data: any) {
     // complex logic...
   }
   
   // ✅ Good - 有清楚的雙語註釋
   /**
    * 處理並轉換 ESG 原始數據
    * Process and transform raw ESG data
    */
   function processData(data: RawESGData): ProcessedESGData {
     // complex logic...
   }
   ```

---

## 快速參考 (Quick Reference)

| 項目 | 語言 | 範例 |
|------|------|------|
| 變數名稱 | 英文 | `userName`, `reportData` |
| 函數名稱 | 英文 | `calculateScore()`, `validateInput()` |
| 類別名稱 | 英文 | `DataService`, `UserProfile` |
| 介面名稱 | 英文 | `IValidator`, `ESGReport` |
| 檔案頭註釋 | 繁中+英文 | 見範例 |
| 函數註釋 | 繁中+英文 | 見範例 |
| 行內註釋 | 繁中為主 | `// 驗證用戶輸入` |
| UI 文字 | 使用 i18n | `{t('ui.save')}` |
| 錯誤訊息 | 使用 i18n | `{t('errors.network')}` |

---

## 工具支援 (Tool Support)

### VSCode 設定建議
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "i18n-ally.localesPaths": ["src/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### ESLint 規則建議
```javascript
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/[\\u4e00-\\u9fa5]/]',
        message: 'Use i18n for Chinese text instead of hardcoding'
      }
    ]
  }
};
```

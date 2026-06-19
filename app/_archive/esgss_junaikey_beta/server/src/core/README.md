# EntropyForge 熵減煉金引擎

> **萬有引力協議**：AI 驗收結果精準重現模組

## 概述

EntropyForge 是一個將 AI 語義驗收轉化為確定性測試腳本的核心引擎。它確保了每一行生成的測試代碼都符合 **Truth (可溯源)** 與 **Trust (不可篡改)**。

## 核心概念

### 四大原則對應

| 聖典原則 | EntropyForge 實踐 |
|----------|------------------|
| **簡單 (Simple)** | 結構化輸出，一鍵生成測試腳本 |
| **快速 (Fast)** | 環境種子鎖定，秒級重現 |
| **安全 (Safe)** | Hash Lock + Object.freeze() 雙重保護 |
| **永恆 (Eternal)** | 刻印至 Repository，十年可重現 |

### 奧義六式對應

| 奧義 | EntropyForge 方法 |
|------|------------------|
| **第一式：本質提純** | `restoreEnvironment()` - 環境還原 |
| **第二式：結構固化** | `snapshotData` - 數據快照 |
| **第三式：代理織網** | `forgeTestScript()` - 生成腳本 |
| **第四式：神跡顯現** | `expect().toEqual()` - 斷言比對 |
| **第五式：熵減煉金** | `purify()` - 驗證完整性 |
| **第六式：永恆刻印** | `sealArtifact()` - Hash Lock |

## 文件結構

```
server/src/core/
├── IAcceptanceArtifact.ts   # 驗收契約接口
├── EntropyForge.ts          # 熵減煉金引擎
└── README.md               # 本文件
```

## 快速開始

### 1. 創建驗收 Artifact

```typescript
import { createEntropyForge } from './core/EntropyForge';

const forge = createEntropyForge('jest');

// AI 驗收通過後，生成可重現的測試腳本
const artifact = forge.createSealedArtifact(
  'uuid-1234-5678',
  '永續報告書生成',
  'PASS',
  '驗證 1000 頁報告書生成功能',
  {
    input: { reportType: 'sustainability', pages: 1000 },
    expectedOutput: { success: true, pageCount: 1000 },
    actualOutput: { success: true, pageCount: 1000 },
    traceLog: ['初始化報告書', '生成章節', '完成']
  },
  [
    { action: '初始化報告書', expected: true, actual: true },
    { action: '生成章節', expected: 100, actual: 100 }
  ]
);
```

### 2. 驗證 Artifact 完整性

```typescript
const validation = await forge.purify(artifact);
console.log(validation.message);
// 輸出: [Entropy Forge] Artifact validated successfully.
```

### 3. 生成測試腳本

```typescript
const script = await forge.generateJestTest(artifact);
console.log(script);
// 輸出完整的 Jest 測試腳本
```

### 4. 生成腳本預覽

```typescript
const testScript = forge.forgeTestScript(artifact);
console.log(testScript.filename);  // sustainability-report.spec.ts
console.log(testScript.content);   // 完整的測試代碼
```

## IAcceptanceArtifact 結構

```typescript
interface IAcceptanceArtifact {
  // 核心識別
  uuid: string;           // 奧秘永憶主體唯一碼
  version: string;        // 語義化版本
  timestamp: number;      // 刻印時間戳
  componentName: string;   // 組件名稱
  
  // 驗收元數據
  status: 'PASS' | 'FAIL' | 'PENDING';
  entropyLevel: number;   // 熵值評估 (0.0 - 1.0)
  testCoverage: number;   // 測試覆蓋率
  
  // 重現關鍵數據
  environment: {
    nodeVersion: string;
    os: string;
    seed: number;         // 隨機數種子
    gitCommitHash: string;
    aiModelVersion: string;
  };
  
  logicSnapshot: {
    input: any;
    expectedOutput: any;
    actualOutput: any;
    traceLog: string[];
  };
  
  steps: Array<{
    action: string;
    expected: any;
    actual: any;
    evidence: string;
    timestamp: number;
  }>;
  
  evidence: {
    hashLock: string;     // Hash 鎖定
    attachments: string[];
  };
}
```

## 生成的測試腳本範例

```typescript
/**
 * [Antigravity Protocol] Generated Test Script
 * UUID: uuid-1234-5678
 * Component: 永續報告書生成
 * Timestamp: 2026-02-04T04:00:00.000Z
 * Status: PASS
 */

import { test, expect, describe } from '@jest/test';

describe('[Reproduction] 永續報告書生成', () => {

  test('Deterministic Path Validation', async () => {
    const expectedOutput = { success: true, pageCount: 1000 };
    const actualResult = getCoreResult();
    expect(actualResult).toEqual(expectedOutput);
    console.log('[EntropyForge] Entropy minimized: Logic reproduced successfully.');
  });

  test('Hash Lock Validation', () => {
    const currentHash = calculateHash(actualResult);
    expect(currentHash).toBeDefined();
  });
});
```

## API 參考

### EntropyForge 類

| 方法 | 說明 |
|------|------|
| `constructor(framework, outputDir)` | 建構子，設定測試框架與輸出目錄 |
| `forgeTestScript(artifact)` | 生成可執行的測試腳本 |
| `purify(artifact)` | 驗證 Artifact 完整性 |
| `generateJestTest(artifact)` | 生成 Jest 測試檔案內容 |
| `createSealedArtifact(...)` | 創建並封印 Artifact |

### 工廠函數

```typescript
function createEntropyForge(framework?: 'jest' | 'playwright' | 'vitest'): EntropyForge
```

## 與 AI Prompt 整合

要讓 AI 產出符合 EntropyForge 格式的驗收結果，請使用以下 Prompt：

```
請依照 JunAiKey 奧秘元件規範，針對此功能執行驗收。
除了結論外，請輸出符合 IAcceptanceArtifact 接口的 JSON 數據，
並包含 Jest 自動化測試程式碼片段，
確保能在本地環境精準重現你的驗收路徑。

輸出格式：
{
  "uuid": "唯一識別碼",
  "componentName": "組件名稱",
  "status": "PASS",
  "description": "驗收描述",
  "logicSnapshot": {
    "input": { ... },
    "expectedOutput": { ... },
    "actualOutput": { ... },
    "traceLog": ["步驟1", "步驟2"]
  },
  "steps": [
    { "action": "動作描述", "expected": {...}, "actual": {...} }
  ]
}
```

## 價值體現

### 1. 安全 (Safety)
- 透過 `Object.freeze()` 與 Hash Lock 杜絕數據被隨意更改
- 每次驗收都有唯一的指紋

### 2. 永恆 (Eternality)
- 所有的驗收邏輯都被刻印
- 十年後重跑依然結果一致

### 3. 透明 (Transparency)
- 完整的執行路徑日誌
- 可追溯的斷言比對

### 4. 可信 (Trustworthiness)
- AI 的樂觀偏見被消除
- 只有通過實際測試的結論才被認可

---

*Generated: 2026-02-04*
*Version: v1.0.0*

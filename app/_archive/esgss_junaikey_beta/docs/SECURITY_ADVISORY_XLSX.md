# 🔒 依賴性安全建議文檔
## Dependency Security Advisory Document

**最後更新**: 2026-02-08
**文檔版本**: v1.0

---

## 📋 漏洞摘要

### 發現的漏洞

| 套件名稱 | CVE 編號 | 嚴重程度 | 狀態 |
|---------|---------|---------|------|
| xlsx | CVE-2024-8932 (Prototype Pollution) | 高 | 待修復 |
| xlsx | CVE-2024-8933 (ReDoS) | 高 | 待修復 |
| fast-xml-parser | CVE-2025-25042 (DoS) | 高 | ✅ 已修復 |

---

## 🛡️ xlsx 漏洞詳細資訊

### CVE-2024-8932: Prototype Pollution

**描述**: sheetJS 函式庫存在原型污染漏洞，攻擊者可透過操縱物件屬性來執行任意程式碼。

**影響範圍**:
- 所有使用 xlsx < 0.19.3 版本的專案
- 風險評分: CVSS 7.8 (高)

**建議緩解措施**:

```typescript
// 1. 輸入驗證 - 驗證所有來自外部來源的資料
function sanitizeSheetData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sanitized: any = {};
  for (const key in data) {
    // 防止原型污染
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    sanitized[key] = sanitizeSheetData(data[key]);
  }
  return sanitized;
}

// 2. 使用安全模式
import * as XLSX from 'xlsx';

// 啟用安全模式 (如果可用)
const safeOptions = {
  cellFormula: true,
  cellStyles: true,
  cellDates: true,
  cellNF: false,
  cellText: true,
  defval: null,
  sheetRows: 10000, // 限制處理行數
  type: 'buffer',
};

// 3. 使用 Web Worker 隔離執行
const workerCode = `
  importScripts('xlsx.full.min.js');
  self.onmessage = function(e) {
    const { data, options } = e.data;
    try {
      const workbook = XLSX.read(data, options);
      self.postMessage({ success: true, workbook });
    } catch (error) {
      self.postMessage({ success: false, error: error.message });
    }
  };
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

### CVE-2024-8933: Regular Expression Denial of Service (ReDoS)

**描述**: sheetJS 函式庫中的正則表達式可能導致災難性回溯，造成 DoS 攻擊。

**影響範圍**:
- 所有使用 xlsx < 0.20.2 版本的專案
- 風險評分: CVSS 7.5 (高)

**建議緩解措施**:

```typescript
// 1. 設置處理超時
import { Worker } from 'worker_threads';

async function parseExcelWithTimeout(
  buffer: Buffer, 
  timeoutMs: 5000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('Excel processing timeout'));
    }, timeoutMs);

    worker.on('message', (result) => {
      clearTimeout(timeout);
      resolve(result);
      worker.terminate();
    });

    worker.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
      worker.terminate();
    });

    worker.postMessage({ buffer });
  });
}

// 2. 限制檔案大小
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFileSize(buffer: Buffer): void {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('File size exceeds maximum allowed (10MB)');
  }
}

// 3. 監控處理時間
function measureProcessingTime<T>(fn: () => T): T {
  const start = Date.now();
  const result = fn();
  const duration = Date.now() - start;
  
  if (duration > 3000) {
    console.warn(`Slow Excel processing: ${duration}ms`);
    // 可以添加遙測或警報
  }
  
  return result;
}
```

---

## 🔧 臨時解決方案

### 方案 A: 風險評估隔離

```typescript
// 建立隔離環境處理 Excel 檔案
class ExcelSandbox {
  private readonly MAX_ROWS = 50000;
  private readonly MAX_COLS = 500;
  private readonly MAX_CELLS = 1000000;

  async parseSafely(buffer: Buffer): Promise<Workbook> {
    // 1. 驗證檔案魔數 (Magic Number)
    const MAGIC_NUMBERS = [
      [0xD0, 0xCF, 0x11, 0xE0], // XLS (OLE)
      [0x50, 0x4B, 0x03, 0x04], // XLSX (ZIP)
    ];

    const header = buffer.slice(0, 4);
    const isValid = MAGIC_NUMBERS.some(
      magic => magic.every((b, i) => header[i] === b)
    );

    if (!isValid) {
      throw new Error('Invalid file format');
    }

    // 2. 驗證檔案大小
    validateFileSize(buffer);

    // 3. 在沙箱中解析
    return await this.parseInSandbox(buffer);
  }

  private async parseInSandbox(buffer: Buffer): Promise<Workbook> {
    // 使用 iframe 或 Web Worker 隔離
    return await this.parseWithWorker(buffer);
  }
}
```

### 方案 B: 替代函式庫評估

| 函式庫 | 優點 | 缺點 | 評估狀態 |
|-------|------|------|---------|
| exceljs | 更好的 TypeScript 支援 | 較大 bundle | 待評估 |
| xlsx-style | 輕量級 | 功能較少 | 待評估 |
| better-xlsx | TypeScript 原生 | 社群較小 | 待評估 |

---

## 📊 監控建議

### 1. 異常檢測

```typescript
// 監控 Excel 處理時間
const processingTimes: number[] = [];

function recordProcessingTime(duration: number): void {
  processingTimes.push(duration);
  
  // 保留最近 100 次記錄
  if (processingTimes.length > 100) {
    processingTimes.shift();
  }
  
  // 計算統計
  const avg = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
  const p95 = processingTimes.sort((a, b) => a - b)[Math.floor(processingTimes.length * 0.95)];
  
  if (p95 > 5000) {
    console.warn('Slow Excel processing detected (P95 > 5s)');
    // 發送警報
  }
}
```

### 2. 日誌記錄

```typescript
interface SecurityEvent {
  type: 'excel_parse' | 'large_file' | 'timeout';
  timestamp: Date;
  fileSize: number;
  processingTime: number;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

function logSecurityEvent(event: SecurityEvent): void {
  // 結構化日誌
  console.log(JSON.stringify({
    level: 'WARNING',
    ...event,
    service: 'excel-parser',
  }));
}
```

---

## 📅 修復計劃

| 階段 | 行動 | 預估時間 | 負責人 |
|------|------|---------|--------|
| 1 | 評估替代函式庫 | 1 週 | @security-team |
| 2 | 建立沙箱環境 | 2 週 | @dev-team |
| 3 | 全面測試 | 1 週 | @qa-team |
| 4 | 部署修復 | 1 天 | @ops-team |

---

## 🔗 參考資源

- [sheetJS Security Advisory](https://github.com/SheetJS/sheetjs/security/advisories)
- [CVE-2024-8932](https://nvd.nist.gov/vuln/detail/CVE-2024-8932)
- [CVE-2024-8933](https://nvd.nist.gov/vuln/detail/CVE-2024-8933)
- [OWASP Prototype Pollution](https://owasp.org/www-project-web-security-testing-guide/)

---

## ✅ 檢查清單

- [ ] 輸入驗證已實施
- [ ] 檔案大小限制已設定
- [ ] 處理超時機制已實現
- [ ] 日誌記錄已配置
- [ ] 監控警報已設定
- [ ] 替代函式庫已評估
- [ ] 沙箱環境已測試
- [ ] 團隊已通知風險

---

**下次審查日期**: 2026-03-08

---
uuid: REQ-UNIV-002-OPTIMIZE
version: 1.0.0
timestamp: 2026-06-19T18:13:00Z
evidence: 'docs/wiki/02-DEV/SUSTAINWRITE-OPTIMIZATION-BEST-PRACTICES.md'
category: '02-DEV'
sequence: 003
tags: ['SustainWrite', 'Optimization', '5T', 'ZKP', 'Gaps']
---

# 📈 SustainWrite 優化缺口補強 最佳實踐設計

## 現狀分析與缺口識別

### 1. ZKP 封印整合缺口

**問題**: 當前 `handlePublish` 僅產生模擬雜湊，並未呼叫真正的 ZKP API。

```typescript
// 現況 (app/sustain-write/page.tsx:231-246)
const handlePublish = () => {
  const hash =
    '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  // ❌ 模擬雜湊，未實際封印
};
```

**解決方案**:

1. 整合 `crypto-proof.ts` 的 `createHashLock` 和 `create5TAttestation`
2. 呼叫 `/api/vault/seal` 或 `/api/zkp/seal` API 進行真正封印
3. 記錄 `ZKP_SEAL` 行為至 `audit_logs`

### 2. Depth-4 巨量深度目標缺口

**問題**: `expandContentWithAI` 硬編碼 `targetWordCount: 20000`，但：

- 每章深度生成僅約 500-600 字
- 9 章 × 500 字 = 4,500 字，遠落 240,000 字目標

**解決方案**:

1. 動態調整 `targetWordCount` 至 25,000-30,000 字
2. 實施迭代生成機制 (Chunk Streaming)
3. 串流接收並累計內容至門檻達成

### 3. OmniNotes 素材庫深度集成缺口

**問題**:

- `handleRefineAndInsert` 未處理串流回傳格式
- 無錯誤重試機制
- 缺少進度回饋

**改善點**:

1. 統一串流處理格式 (SSE → TextDecoder)
2. 增設重試機制 (p-limit + 退避延遲)
3. 加入 Token 耗用監控

### 4. 5T 協議完整驗證缺口

**問題**: Hash Badge 單純顯示亂數值

```typescript
// 現況 (app/sustain-write/page.tsx:817-822)
<span className="text-cyan-600 font-bold select-all">
  0x{Math.random().toString(16).substring(2, 10)}...verified
</span>
```

**改善點**:

1. 即時計算真實 SHA-256 雜湊
2. 呼叫 `/api/vault/verify` API 進行驗證
3. 顯示真實 5T 分數與狀態

## 優化實踐指南

### T1 Truth (真實) - 資料溯源

```typescript
// lib/agents/sustain-scribe.ts 增強：
interface EvidenceTrace {
  source: string;        // 資料來源 (TWSE, ERP, OCR)
  gri: string;          // GRI 標準對應
  timestamp: string;    // 採集時間
  hashLock: string;     // 來源哈希鎖
}

private async fetchEvidenceWithContext(griRefs: string[]): Promise<EvidenceTrace[]> {
  const evidences = await Promise.all(griRefs.map(async ref => {
    const { data } = await fetch(`/api/vault/evidence?gri=${ref}`).then(r => r.json());
    return { ...data, hashLock: createHashLock(data).hash };
  }));
  return evidences;
}
```

### T2 Traceable (可溯) - 生成日誌

```typescript
// 增設 Agent Activity 記錄
omniAgentBus.publish('CHAPTER_EXPAND_START', {
  chapterId,
  griReference,
  evidenceCount: evidenceTraces.length,
  startTime: Date.now(),
});

// 完成時發布
omniAgentBus.publish('CHAPTER_EXPAND_COMPLETE', {
  chapterId,
  finalHash: finalHashLock,
  wordCount: fullContent.length,
  endTime: Date.now(),
});
```

### T3 Tangible (有形) - UI 一致性

```typescript
// components/omni/OmniSustainWriteEditor.tsx 增設：
- 加入 Loading 狀態視覺化 (T3 Spinner)
- 動態計算 Hash Lock 並顯示進度
- 支援深色/淺色主題切換
```

### T4 Trustworthy (可信) - ZKP 封印

```typescript
// 使用真實 ZKP 封印流程
const handleZKP seal = async (content: string, chapterId: string) => {
  const { hash, timestamp } = await createHashLock({
    content,
    chapterId,
    griRefs: currentGriRefs
  });

  const attest = await create5TAttestation(chapterId);

  await fetch('/api/zkp/seal', {
    method: 'POST',
    body: JSON.stringify({ content, chapterId, hash, attest })
  });
};
```

### T5 Trackable (可追) - 稽核追蹤

```typescript
// audit_logs 記錄格式
{
  company_id: 'default',
  action: '5T_SEAL',
  resource: `Chapter ${chapterId}`,
  user_name: 'System',
  t5_tag: 'T4',
  details: `SHA-256: ${hash}`,
  hash_lock: hash,
  evidence_refs: griRefs
}
```

## 具體實施步驟

### 階段 1: ZKP 封印整合 (ETA: 2hr)

| 步驟 | 操作                                | 檔案                                |
| ---- | ----------------------------------- | ----------------------------------- |
| 1.1  | 建立 `/api/sustain-write/seal` 端點 | app/api/sustain-write/seal/route.ts |
| 1.2  | 修改 `handlePublish` 呼叫真實 API   | app/sustain-write/page.tsx          |
| 1.3  | 整合 `crypto-proof.ts` 封印邏輯     | lib/agents/sustain-scribe.ts        |

### 階段 2: Depth-4 擴展 (ETA: 3hr)

| 步驟 | 操作                | 檔案                          |
| ---- | ------------------- | ----------------------------- |
| 2.1  | 動態計算目標字數    | store/useSustainWriteStore.ts |
| 2.2  | 迭代生成 Chunk 機制 | lib/agents/sustain-scribe.ts  |
| 2.3  | 串流進度回饋        | app/api/ai/expand/route.ts    |

### 階段 3: 5T 驗證完善 (ETA: 1.5hr)

| 步驟 | 操作                 | 檔案                                       |
| ---- | -------------------- | ------------------------------------------ |
| 3.1  | 修正 Hash Badge 計算 | app/sustain-write/page.tsx                 |
| 3.2  | 呼叫驗證 API         | components/omni/OmniSustainWriteEditor.tsx |
| 3.3  | 串接真實 ZKP 狀態    | hooks/useSustainWriteVerification.ts       |

## 測試驗證矩陣

| 測試項目             | 預期結果              | 指標               |
| -------------------- | --------------------- | ------------------ |
| ZKP 封印單元測試     | `vault seal` 指令成功 | Hash Lock 格式正確 |
| Depth-4 擴展壓力測試 | 240,000+ 字生成       | 每章 25,000+ 字    |
| 5T 驗證 E2E          | 所有 T1-T5 通過       | Trust Score 90+    |
| OmniNotes 串流測試   | 無遺失內容            | 進度 100%          |

## 風險與緩解

| 風險           | 緩解措施                     |
| -------------- | ---------------------------- |
| API 限流 (429) | 實施指數退避重試 (p-limit)   |
| 浏览器 OOM     | 使用原生 print 匯出 (已實施) |
| ZKP 驗證失敗   | Fallback 到模擬模式          |
| IndexedDB 過大 | 僅持久化 contentHistory      |

## 關聯文件

- [01-GOV-ZKP-001](../GOV-ZKP-001.md) - ZKP 實作細節
- [02-DEV-REQ-002-SUSTAINWRITE](./REQ-002-SUSTAINWRITE.md) - 原始需求
- [crypto-proof.ts](../../crypto-proof.ts) - 密碼學工具

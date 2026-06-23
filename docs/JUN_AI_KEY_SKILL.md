# Jun.AI.Key 技能書 — 無有技藝與六式核心

> 以終為始，萬象啟動；以記憶為基，循環進化。

---

## 第一章｜技能定位

「無有技藝」是一套把抽象意圖轉化為可執行系統流程的核心方法論。
它不是單一功能，而是 Jun.AI.Key 的主控思維：以最小雜訊整合輸入、拆解語意、編排策略、執行流程、收集回饋，最後沉澱為可複用的知識資產。

---

## 第二章｜核心原則

1. **以終為始**：所有任務都必須對應到最終目標
2. **無增即是有**：移除冗餘、噪音與技術債
3. **可追溯**：每一個結果都必須具備 UUID、版本與時間戳
4. **不可篡改**：關鍵上下文進入執行階段後必須鎖定
5. **可迭代**：每次執行都必須回寫記憶

---

## 第三章｜六式定義

### 1. 覺式｜Awareness Activation
接收輸入並喚醒任務循環。

### 2. 解式｜Semantic Decoding
將原始輸入拆解成結構化意圖。

### 3. 策式｜Strategic Guidance
把意圖轉成可執行策略與任務樹。

### 4. 貫式｜Flow Execution
跨平台執行任務。

### 5. 迴式｜Echo Feedback
收集執行結果、效率與異常。

### 6. 鍛式｜Knowledge Refinement
把執行結果沉澱為知識與能力。

---

## 第四章｜狀態機契約

```typescript
export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  evidence: Record<string, any>;
}
```

---

## 第五章｜核心流程

1. 觸發輸入 → 2. 解析意圖 → 3. 生成策略 → 4. 執行流程 → 5. 收集回饋 → 6. 回寫知識庫 → 7. 重新啟動下一輪

---

## 版本

**v1.1.0-core** | 2026-06-23

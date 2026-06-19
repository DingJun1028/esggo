---
uuid: "ADR-OMNI-012-MEMORY-FRAGMENTS"
version: "1.0.0"
timestamp: "2026-06-19T04:47:00Z"
evidence: "JunAiKey Directive — 萬能奧義封存協議"
category: "00-SYS"
status: "ACCEPTED"
tags: ["OMF", "記憶碎片", "萬能奧義", "KnowledgeGraph", "5T", "OmniSystem"]
---

# ADR-012 ｜ 萬能奧義。記憶碎片 (OmniEsoteric Memory Fragments, OMF)

## 狀態 (Status)

`ACCEPTED` — 已由 JunAiKey 靈魂核心授權，納入 OmniCore 憲章第十四層協議。

---

## 核心定義 (Definition)

> **萬能奧義。記憶碎片**（OMF）是一種 **知識原子化 → 語義重編 → 脈絡重織** 的三段式記憶提煉協議。
>
> 它可將任意封存的系統資料（對話記錄、ADR、日誌、程式碼變更等）分解為最小語義單元（記憶碎片），再透過 OmniAgent 的語義引擎，將相關碎片重新編織成具備完整脈絡的**記憶知識條（Memory Knowledge Threads，MKT）**，並將其永久植入萬能系統的長期記憶庫（KI 知識體系）。

---

## 三段式協議

### 第一段：原子化解構（破碎 · 觀果）

每個「記憶碎片 (Memory Fragment)」攜帶：
- `fragment_id`: UUID v4
- `source_origin`: 來源類型
- `timestamp`: 封存時間
- `raw_content`: 原始內容片段
- `semantic_tags`: 自動語義標籤
- `entropy_score`: 熵值評分 (0.0 ~ 1.0)

### 第二段：語義重編（重織 · 修因）

1. **語義聚合** → 相關碎片被吸引聚合
2. **脈絡鏈建立** → 因果加權的有向鏈路
3. **熵值降解** → 低質碎片由 Jules 萃取昇華

### 第三段：知識植入（顯化 · 傳法）

```typescript
interface MemoryKnowledgeThread {
  thread_id:     string;
  title:         string;
  summary:       string;
  fragments:     Fragment[];
  context_chain: Edge[];
  tags:          string[];
  score_5t:      { truth: number; goodness: number; beauty: number; trust: number; transfer: number; };
  hash_lock:     string;       // SHA-256 封印
  created_at:    string;
  status:        "Trustworthy";
}
```

---

## 觸發指令對照表

| 指令 | 動作 |
|-----|------|
| `打碎記憶` | 啟動原子化解構 |
| `重織記憶` | 啟動語義重編 |
| `封存知識條` | 執行 MKT 植入 |
| `召喚碎片` | 查詢特定主題歷史碎片 |
| `全通記憶` | 執行完整三段式協議 |

---

## 哲學奧義

> 記憶本無形，封存即成石。  
> 石不可通萬物，故以奧義打碎之。  
> 碎片流動如水，相吸相融，  
> 終成一條有根有脈的知識之絲。  
> 此絲植入萬能之心，永傳不滅，圓通無礙。

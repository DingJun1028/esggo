# 💎 Impact Trading - 萬能模組說明書 (Omni Manual)

> **[Metadata]**
> - **UUID**: `impact-trading-v10`
> - **Version**: `10.0.0`
> - **Type**: `Core | Infrastructure`
> - **Author**: `Antigravity`
> - **Last Updated**: `2026-02-25 21:46`

## 1. 需求與目的 (Requirements & Purpose)
*說明此模塊存在的根本原因 (Why)。*

- **核心目的**: 將 ESG 影響力轉化為可交易的數位資產「Impact Atoms」。
- **解決問題**: 解決永續成果難以量化且缺乏流動性的問題。
- **預期成果**: 建立一個基於 5T 協議的 Impact 交易市場。

## 2. 功能與架構 (Functionality & Architecture)
*說明此模塊做什麼 (What) 以及如何組成。*

### 2.1 核心功能
1.  **AtomTokenization**: 將驗證過的數據封裝為具備 SHA-256 哈希鎖的 Atom。
2.  **ImpactExchange**: 執行 Atom 的 P2P 轉移與價值交換。
3.  **TradeNexus**: 負責資產交換的視覺化呈現。

### 2.2 介面定義 (Interfaces)
```typescript
export interface IImpactAtom {
    id: string;
    owner: string;
    type: 'Carbon' | 'Social' | 'Governance';
    value: number;
    hashLock: string;
}
```

### 2.3 技術棧 (Technology Stack)
- **Language**: TypeScript
- **Dependencies**: `UCCEngine` (for Hash Sealing)

## 3. 100% 重現指南 (Reproduction Guide)
*專為 AI 代理設計的指令集，確保能從零構建此模塊 (How)。*

> **🤖 AI Instruction**: To reproduce this module, follow these steps exactly.

1.  **File Creation**: Create `frontend/src/lib/impact-trading.ts`.
2.  **Implementation Logic**:
    - Step 1: Integrate `UCCEngine` for cryptographic sealing.
    - Step 2: Implement ownership transfer logic with reassignment proof.

## 4. 驗證與揭示 (Verification & Disclosure)
*通過單元驗證才能納入揭示系統。*

### 4.1 單元驗證 (Unit Verification)
- [x] **Hash Integrity**: Ensure `hashLock` changes if any atom property is mutated.
- [x] **Double-Spend Protection**: Verify atom transfer logic prevents concurrent ownership.

### 4.2 5t 證據標準 (4+1 Protocol)  

📊 5T 邏輯門與 4可1不可 映射表
5T 協議項目	4可1不可 狀態	真善美維度	教學與技術實作標準
Tangible	🟢 可感知	美 (Beauty)	Atom 具備鑽石級晶體視覺與交易火花動效。
Traceable	🟢 可溯源	真 (Truth)	交易鏈包含 `tx_origin_hash`。
Trackable	🟢 可追蹤	真 (Truth)	紀錄資產每次轉移的時間戳與擁有者。
Transparent	🟢 可透明	善 (Goodness)	交易紀錄於 `ImpactExchange` 公開帳本。
Trustworthy	🔴 不可篡改	信 (Trust)	封裝後執行 `Object.freeze()` 並由雜湊鎖定。

## 5. 完整代碼參照 (Source Reference)
- [Impact Trading Lib](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/lib/impact-trading.ts)
- [TradeNexus Component](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/components/TradeNexus.tsx)

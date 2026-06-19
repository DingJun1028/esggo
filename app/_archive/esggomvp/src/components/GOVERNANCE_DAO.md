# 🏛️ Governance DAO - 萬能模組說明書 (Omni Manual)

> **[Metadata]**
> - **UUID**: `governance-dao-v10`
> - **Version**: `10.0.0`
> - **Type**: `Core | Service | UI`
> - **Author**: `Antigravity`
> - **Last Updated**: `2026-02-25 21:45`

## 1. 需求與目的 (Requirements & Purpose)
*說明此模塊存在的根本原因 (Why)。*

- **核心目的**: 建立去中心化的 ESG 決策機制，確保平台規則由所有主權用戶（Sovereign Users）共治。
- **解決問題**: 消除中心化治理的不透明性，防止單一實體操控 ESG 評價。
- **預期成果**: 實現 100% 透明的投票流程與不可篡改的共識結果。

## 2. 功能與架構 (Functionality & Architecture)
*說明此模塊做什麼 (What) 以及如何組成。*

### 2.1 核心功能
1.  **OmniVote**: 提供視覺化投票介面，支援「Yield (同意)」與「Resist (反對)」Stance。
2.  **ProposalForge**: 允許用戶發起 ESG 政策提案。
3.  **SovereignConsensus**: 自動計算投票權重（基於美德等級）。

### 2.2 介面定義 (Interfaces)
```typescript
interface IProposal {
    id: string;
    title: string;
    description: string;
    votes: { yield: number; resist: number };
    status: 'Voting' | 'Approved' | 'Rejected';
}
```

### 2.3 技術棧 (Technology Stack)
- **Language**: TypeScript
- **Framework**: React / Next.js
- **Key Dependencies**: `framer-motion`

## 3. 100% 重現指南 (Reproduction Guide)
*專為 AI 代理設計的指令集，確保能從零構建此模塊 (How)。*

> **🤖 AI Instruction**: To reproduce this module, follow these steps exactly.

1.  **File Creation**: Create `frontend/src/components/OmniVote.tsx` and `ProposalForge.tsx`.
2.  **Implementation Logic**:
    - Step 1: Implement voting weight distribution based on `Identity.level`.
    - Step 2: Establish state management for real-time proposal tracking.
3.  **Configuration**: Integrated with `GovernanceLayout` for sentient navigation.

## 4. 驗證與揭示 (Verification & Disclosure)
*通過單元驗證才能納入揭示系統。*

### 4.1 單元驗證 (Unit Verification)
- [x] **Vote Integrity**: Ensure users cannot vote twice on the same proposal.
- [x] **Consensus Logic**: Verify that Weight-based voting correctly overrides simple counts.

### 4.2 5t 證據標準 (4+1 Protocol)  

📊 5T 邏輯門與 4可1不可 映射表
5T 協議項目	4可1不可 狀態	真善美維度	教學與技術實作標準
Tangible	🟢 可感知	美 (Beauty)	動態投票權重條與共識達成動效。
Traceable	🟢 可溯源	真 (Truth)	每一票皆包含用戶 `level_signature`。
Trackable	🟢 可追蹤	真 (Truth)	紀錄提案從「草案」到「執行」的全生命週期。
Transparent	🟢 可透明	善 (Goodness)	投票權重算法公開，即時可見。
Trustworthy	🔴 不可篡改	信 (Trust)	投票封存後寫入「不可篡改證據庫」。

## 5. 完整代碼參照 (Source Reference)
- [OmniVote Component](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/components/OmniVote.tsx)
- [ProposalForge Component](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/components/ProposalForge.tsx)

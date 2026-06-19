# 🏛️ OMNI_MANUAL: Governance DAO
## "Governance by Sovereign Consensus"

> **[Metadata]**
> - **UUID**: `governance-dao-manual-v10`
> - **Version**: `10.0.0`
> - **Type**: `Governance | Law`
> - **Authority**: `Antigravity`
> - **Alignment**: `Integrity Closure`

## 1. 需求與目的 (Requirements & Purpose)
Governance DAO 是平台的主權意志執行機構，負責透過去中心化方式管理 ESG 合規標準與提案。

- **核心目的**: 實現「以終為始」的高效動態治理。
- **共治精神**: 每位用戶的等級與功德量直接影響其共識權重。

## 2. 功能與流程 (Functionality & Flow)

### 2.1 提案熔煉 - ProposalForge
- 任何人皆可發起提案，但需消耗一定的「善向價值 (Goodward Value)」。
- 提案需明確關聯 5T 目標。

### 2.2 萬能投票 - OmniVote
- **Yield (同意)**: 支持提案進入下一階段。
- **Resist (反對)**: 要求重新審核或撤回。
- **權重計算**: 基於用戶的 `Merit_Level` 與 `Verification_Score`。

## 3. 5T 協議標準 (5T Standards)
- **Traceable (可溯源)**: 每一票皆需用戶簽名。
- **Trackable (可追蹤)**: 提供提案全生命週期日誌。
- **Trustworthy (不可篡改)**: 投票結果封存於 `SHA-256` 鎖定區。

## 4. 實作參照 (Implementation Reference)
- DAO 邏輯: [governance-dao.ts](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/src/core/governance-dao.ts)
- 投票 UI: [OmniVote.tsx](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/components/OmniVote.tsx)

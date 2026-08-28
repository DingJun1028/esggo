---
name: oa-delegation-tree
description: 蜂群委託/自動化決策樹 — 三問(Q1可逆/Q2高頻低風/Q3中風可回滾)+Q4紅線，對映 H0-H4 與無作元狀態。
---

# OA-Team 委託與自動化決策樹 (§19)

喚醒 OA-Team 蜂群、判定任務是否值得委託/自動化時載入此技能。本技能是 `oa-team-soul-canon` 與 `oa-dual-agent-obsidian` 的互補模組。

## When to use
- 決定某任務「該自動跑 / 半自動 / 交人工 / 拒絕」時
- 設計 cron / n8n 自動化前做歸屬判定
- 接 OA-TWINS / CrewAI swarm 時配置 `allow_delegation` 與 H 層級

## 三問決策樹（≤3 問判定）
```
Q1: 可逆嗎？ 否 → H3 人工主導（禁自動）。轉 Q4。
 ↓是
Q2: 高頻(≥每週1次) 且 低風險(影響≤單一artifact/用戶)？ 是 → H0 全自主(cron/n8n, §15 無作)。
 ↓否
Q3: 中風險 且 可回滾？ 是 → H1 代行回報 / H2 授權執行。 否 → H3 會同決策。
Q4(所有路徑先過): 觸 Kill Switch(restricted外洩/憑證暴露/未授權篡改/熵>0.3/偽造證據) → H4 凍結。
```

## 互引主典章節 (esggo-omni-center/soul-full.md)
- §十 3. 干預層級 H0–H4 + Kill Switch 條件
- §十 4. 成熟度模型 M1–M5（自動化門檻）
- §十五 無作協定（元狀態 `WUZUO` 靜默自驅）
- §十七 OA-TWINS 自動修復（H1 實例）
- §十八 雙生代理（雲端助理=H0 載體）

## 成熟度四閘（未全過不退自愈）
| 門檻 | 條件 | 未達 |
| --- | --- | --- |
| M3 治理化 | RACI+標籤合約率100% | 退 H3 |
| 可逆性證明 | 回滾錨(凍結artifact+trace_id) | 禁自動改 H1 |
| 熵值健康 | 全域熵<0.1穩定 | 先還熵債 |
| 5T 通過率 | 驗證閘拒絕率<5% | 觸妙德一現 |

## 決策偽碼（可直接貼入調度器）
```typescript
type Tier = 'H0'|'H1'|'H2'|'H3'|'H4';
const decide = (t: SwarmTask): Tier => {
  if (killSwitchTriggered(t)) return 'H4';
  if (!t.reversible) return 'H3';
  if (t.freq >= WEEKLY && t.risk === 'low') return 'H0';
  if (t.risk === 'mid' && t.rollbackOk) return 'H2';
  return 'H3';
};
if (maturityGateAllPass(t) && decide(t) === 'H0') Hermes.enterMetaState('WUZUO');
```

## Pitfalls
- **勿硬編碼 LLM**：CrewAI `gen_agents.py` 原設計由 `OPENAI_MODEL_NAME`/`OPENAI_API_BASE` 環境驅動（CI 用 `CREWAI_API_KEY`）。若改硬編 `gemma4:latest@localhost:11434`，CI 即崩——視為偏離設計，應 `git checkout` 還原。
- **CRLF 陷阱**：Windows `core.autocrlf=true` 下 jsonc 改動會觸 CRLF→LF 警告，rebase 前用 `git checkout -- <file>` 清行尾。
- **不可逆禁自動**：已釋出產物重寫屬 §一 1.2 禁區，決策樹必拒（H4/拒絕），不得入 H0。

## Verification
- 任務清單跑 `decide()` 命中 H0–H4 的分配需可追溯至 Q1–Q4 命中枝（Traceable）。
- 自動化任務須過成熟度四閘（M3/回滾錨/熵<0.1/5T<5%拒絕率）方可入無作元狀態。

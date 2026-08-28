---
name: oa-omnitag-contract
description: "OA-Team OmniTag tag contract: syntax, dims, routing, rules."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
tags: [oa-team, 5t, labeling, governance, soul]
---

# OA-Team OmniTag 萬能標籤契約

Use when an OA-Team 30 artifact (code, task, cron, commit, alert) is created or audited — enforce mandatory tags before it enters any lifecycle stage.

## Core law
**標籤即契約** — 標籤缺失 = 產物不合法，不得進入任何生命週期階段。

## Six dimensions (MECE)
| 維度 | 標籤形式 | 說明 |
|------|----------|------|
| 安全分級 | public / internal / confidential / restricted | restricted 觸發 H4 凍結 |
| 代理歸屬 | agent:01~agent:30 + squad:智庫聖所 等 | 一物一主 |
| 生命週期 | lifecycle:draft / active / frozen / archived | frozen 後禁止修改 |
| 品質分級 | p0 / p1 / p2 / p3 | p0=阻斷 p1=高熵 p2=中熵 p3=噪音 |
| 平台環境 | platform:esggo / omni / vps / firebase | 部署定位 |
| 結界繼承 | best-practice:awakened / best-practice:结界 | 觉醍自動擴散全蜂群 |

## Syntax
```
[agent:13][squad:光之羽翼][lifecycle:active][p1][platform:vps][best-practice:结界]
```
**必備三枚**：`agent:*` + `lifecycle:*` + `p*` 缺一不可。

## Auto-routing
| 組合 | 路由目標 |
|------|----------|
| agent:01-06 + squad:智庫聖所 | 永憶聖所 / 記憶召回 |
| agent:07-12 + squad:符文契約 | API / TypeScript / 型別安全 |
| agent:13-18 + squad:光之羽翼 | 部署 / cron / 自動化代行 |
| agent:19-24 + squad:煉金熵減 | 重構 / lint / 熵減煉金 |
| agent:25-30 + squad:5T驗算 | ISO / Hash Lock / 稽核 |
| best-practice:结界 | 全體自動繼承 |

## Verification rules
1. 必備三枚：agent:、lifecycle:、p* 缺一不可
2. 凍結不可改：lifecycle:frozen + restricted 禁止任何修改
3. 結界自動繼承：best-practice:结界 後子代理自動 inheriting
4. 熵減連動：p0 完成後熵值必降（第八章煉金驗收）
5. 稽核抽驗：5T 驗算陣列每週抽驗合約率，目標 100%

## Acceptance checklist
- [ ] 新產物誕生即附 agent:* + lifecycle:* + p*
- [ ] 標籤與實際狀態一致（不謊報 lifecycle / p 級 / 平台）
- [ ] lifecycle:frozen + restricted 零修改（H4 凍結）
- [ ] best-practice:结界 標記後子代理自動繼承
- [ ] 每週合約率稽核 = 100%，缺失者當週煉金補標
- [ ] 標籤變更皆可溯源（誰/何時/原因）

## Source
Full canonical text: `C:\Project\esggo-learning-center\soul-chapter-20-omnitag.md` and `soul.md` §二十.

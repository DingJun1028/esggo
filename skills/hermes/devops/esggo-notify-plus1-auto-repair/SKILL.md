---
name: esggo-notify-plus1-auto-repair
version: "1.0.0"
author: OA-Team 30 / 萬能蜂后
license: AGPL-3.0
description: esggo 通知 +1 自動修復：喚醒萬能分身讀評論→根因修復→綠線→5T提交→技能書。
tags: [devops, github, esggo, auto-repair, oa-twins, notification]
metadata:
  hermes:
    tags: [devops, github, esggo, auto-repair, oa-twins, notification]
    related_skills: [esggo-ci-auto-repair, oa-twins-tracking, automatic-execution]
---

## When to Use
- 用戶說「通知項目 +1 自動修復」/「+1 追蹤」/「讓 esggo 通知增量自我修復」。
- 要讓 GitHub 未讀通知（review/@/assign/security_alert/可修復 issue）自動喚醒萬能代理分身去讀評論並修到綠線。
- 與 `esggo-ci-auto-repair`（偵 CI run 失敗）互補：本技能偵 notifications 增量。

# esggo 通知項目 +1 自動修復（萬能代理分身閉環）

> 互補於 `esggo-ci-auto-repair`：後者偵 CI run 失敗；本技能偵 **GitHub notifications 未讀 +1**（review 請求 / @mention / assign / security_alert / 可修復 issue）。

## 觸發條件（精確定義「+1」）
- 輪詢 `gh api notifications`（participating=false, all=false, since=上次輪詢時間）。
- 取每筆通知的 `subject.url` 末段 id，組成 **thread id 集合**。
- 相對上次輪詢集合，**新增的 id 數 = +1 增量**。
- 過濾「可修復脈絡」：subject.type ∈ {PullRequest, Issue} 且 repo = DingJun1028/esggo；排除 Dependabot/renovate 等自動 bot（除非用戶指定）。
- **首次跑建立基線**（把所有當前未讀 id 寫入 state），不重複觸發歷史項目。

## 三層架構
1. **偵測器** `esggo_notify_plus1_watcher.py`（位於 `C:\Users\dingj\OneDrive\Documents\Default Project\`）
   - 定義 +1、過濾可修復、產 `_repair_<id>.txt` 簡報、去重建 OA-TWINS 追蹤 issue（label `OmniAgent`/`auto-fix`/`github_actions`）、`--mark-done` 防重派、`--pending-briefs` 列出待辦。
2. **調度 cron** `esggo-notify-plus1-auto-repair`（每 15 分，deliver=local，skills 載入本技能 + `oa-twins-tracking` + `automatic-execution`）
   - 跑 watcher → 若有 +1，delegate_task 喚醒「萬能代理分身」執行五階段（見下）→ `--mark-done`。
3. **經驗技能書** `經驗技能書_esggo_auto_repair.md`（Default Project）
   - 觸發即寫「待回填」條目；修復綠線通過後回填根因 + 解法 + 防再踩坑。

## 萬能代理分身 — 五階段硬性流程（加強指示詞）
> 完整版見 `references/agent_instructions.md`（已落地 Default Project `萬能分身_自動修復_指示詞.md`）。

- **階段 0 喚醒**：以 OA-TWINS 克隆身份接管，讀 `_repair_<id>.txt` 簡報。
- **階段 1 讀評論（完整脈絡）**：用 `gh api` 抓 issue/PR 全部 comments + reviews + 關聯 workflow run（`gh run view --log-failed`），不漏任何一則；交叉比對衝突建議，列出所有待修項。
- **階段 2 根因修復**：只修真實報錯；**禁止** `skip`/`disable`/降 `--max-warnings` 掩蓋；並發 session 引入的壞測試 / lockfile 污染 / TS 語法錯皆修到真正通過。
- **階段 3 確保綠線**：本地跑對應測試/typecheck/lint，直到 **所有相關 CI 全綠**；未全綠不聲稱完成。
- **階段 4 5T 提交**：commit message 帶 `source_origin`、關聯 issue；開 PR 或 push。
- **階段 5 寫經驗技能書**：回填 `經驗技能書_esggo_auto_repair.md`，讓下次同類狀況不再踩坑。

### 四條紅線（任何情況不破）
1. 不降低通知標準（禁關掉守門 CI）。
2. 只信真實 CI log / API 回傳，不臆測。
3. 綠線未過 = 未完成，絕不回報「已修復」。
4. 誠實回報阻擋（缺權限/缺金鑰 → 明說，不造假）。

## PITFALLS
- state 檔每輪 `json.dump` 寫回，避免丟增量。
- `gh issue create` 用 `-l` 加 label；tracking issue 標題含 thread id 以便去重。
- cron `deliver=local`（平台層 Telegram 推送會讓 job 崩潰，實證）。
- 路徑用絕對 Windows 路徑；腳本內 Telegram 警報走 `_send_tg_alert.py` 雙路徑查找。
- sandbox terminal 是 Linux，**不能跑 PowerShell**；修改技能一律用 `skill_manage`，不要用 `.ps1` 在主機跑。
- 技能書超 100k 字會擋 patch；超過就拆獨立技能（本技能即此例）。

## Verification（落地後自檢）
- `python3 esggo_notify_plus1_watcher.py --pending-briefs` 能列出簡報。
- 人造一次 +1（用戶在 esggo 開 issue 並 @自己）→ 下輪 cron 應建 tracking issue 並委派分身。
- 修復後 `_repair_<id>.txt` 標 `DONE`，經驗技能書出現回填條目。

---
name: github-ci-hygiene
category: devops
description: 'Monorepo GitHub CI/PR/lockfile hygiene: diagnose and fix.'
tags: [github, ci, pnpm, lockfile, pr-cleanup, monorepo]
---

# GitHub CI/PR Hygiene (github-ci-hygiene)

適用場景：處理遠端 monorepo 的 CI failure、重複 PR/Issue、lockfile/workspace override 不一致，以及本地驗證收尾。

## 流程

1. 取真實失敗原因：優先看最近 1 小時內信件/tracker 提到的 run，使用 `gh run view <id> --log-failed`；不要憑推測。
2. 判斷是否重複/已修：查主線最近 commit，若已有相同修復，則關閉重複 PR/Issue，不重複開檔。
3. 鎖定根因範圍：只改與 failure 直接相關的檔；如 `pnpm install --frozen-lockfile` 失敗，僅重產 `pnpm-lock.yaml`，不動 `package.json`。
4. 本地驗證（必要）：
   - `pnpm install --frozen-lockfile`
   - `pnpm typecheck`
   - `pnpm run check` 或等價最小 test 組合
   全過才可宣稱修復。
5. 清潔工作目錄：未提交的臨時檔、誤改的 schema/config 一律 `git checkout --` 還原；隱藏/未追蹤檔若要保留，放 `.gitignore`。
6. PR/Issue 收尾：同根因只留一個真實追蹤項，其餘 close；附註引用 fix commit SHA，避免重複開單。

## pnpm lockfile mismatch 的固定模式

症狀：`[ERR_PNPM_LOCKFILE_CONFIG_MISMATCH] The current "overrides" configuration doesn't match the value found in the lockfile`
修復：
```bash
pnpm install --lockfile-only --no-frozen-lockfile
git add pnpm-lock.yaml
```
事後驗收：`pnpm install --frozen-lockfile` 必須 EXIT=0。

## 與既有技能銜接

- 此技能與 `oa-swarm-operations` 互補：`oa-swarm-operations` 管蜂群委派與 5T 全流程；`github-ci-hygiene` 管遠端 CI/PR/lockfile 的實證診斷。
- 若涉及 Hermes CLI / webhook / terminal backend 問題，改走 `hermes-agent` 系列技能。

## Pitfalls

- 不要無視 `--log-failed` 直接重跑 CI，會浪費配額。
- 不要為同一根因開第二個 PR；先找現有 PR/commit。
- 不要把本地環境相依問題（缺 binary、未登入）寫入技能作為永久限制；那屬於當下的環境狀態，不是規則。
- `gh issue close` 大批操作若 timeout，改用背景批次或單獨逐個處理。

## Verification

```bash
# 1. 失敗診斷
gh run view <RUN_ID> --log-failed | tail -n 200

# 2. 鎖定修復
pnpm install --lockfile-only --no-frozen-lockfile
pnpm install --frozen-lockfile

# 3. 型別/測試
pnpm typecheck
pnpm vitest run <subset>

# 4. PR/Issue 清理
gh pr list --state open --label auto-repair
gh issue list --state open --label auto-repair
```
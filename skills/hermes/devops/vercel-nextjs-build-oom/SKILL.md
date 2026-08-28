---
name: vercel-nextjs-build-oom
category: devops
description: Vercel Next.js pnpm build 紅 OOM 修復，NODE_OPTIONS 雙邊設 3072。
tags: [vercel, nextjs, oom, node-options, pnpm, build, deploy, exit-1]
---

# Vercel Next.js Build OOM 修復

## When to use
- Vercel deployment 紅，`npm run build` exit 1
- Build log 只有 `npm install` 警告 (peer dep / vulnerabilities)，無明確錯誤
- `Next.js build worker exited with code: 143` (SIGKILL = OOM)
- 本機 build 成功但 Vercel 失敗

## 根因
`package.json` build 腳本寫死 `NODE_OPTIONS=--max-old-space-size=8192` (8GB)。
Vercel build 實例只有 1GB (Hobby) / 3GB (Pro)，Node 啟動即 OOM-kill → exit 1。
本機機器大 (8GB+) 所以本地能過 → **偽陰性**，容易誤判為其他問題。

## 修法：NODE_OPTIONS 雙邊設 3072
1. `package.json` build 腳本加回 NODE_OPTIONS (否則本地 `pnpm build` / `hermes verify` 跑的無值會 OOM):
   `"build": "cross-env NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=3072 next build"`
2. `vercel.json` 加 env (Vercel build 用):
   `"env": { "NODE_OPTIONS": "--max-old-space-size=3072" }`

**必須雙邊都設** — 只改一邊另一邊仍 OOM。

## 證明值 (實測)
- 8192 → Vercel OOM (exit 1)
- 2048 → 太低，`/api/ai-notes/[id]` page-data collection 崩潰 (exit 1)
- **3072 → 通過 (exit 0)** ✅

## 驗證
本機模擬 Vercel：`NODE_OPTIONS="--max-old-space-size=3072" npx next build` 應 exit 0。
若 `hermes verify` 卡在舊快照 (顯示無 NODE_OPTIONS 的 next build)，直接跑 `pnpm build` 看 exit code 即可 — 那是過時快照，非當前狀態。

## 其他 Vercel 全紅排查
若所有 preview 部署都 Error 但 production 正常 → 檢查 Vercel env vars 是否只設在 `Production` 環境 (preview 無 env 也會 build 失敗)。但此技能聚焦 OOM 類。

## Pitfalls
- 只改 vercel.json 不改 package.json → 本地 `pnpm build` (hermes verify 跑的) 無 NODE_OPTIONS → OOM
- 只改 package.json 不改 vercel.json → Vercel 用 package.json 的 8192 → OOM
- 2048 看似安全但 Next.js page-data collection 會崩 → 用 3072 不賭邊界
- `vercel inspect` / `vercel logs` 對 "never reached READY" 的部署拿不到 build log → 改用本機重現

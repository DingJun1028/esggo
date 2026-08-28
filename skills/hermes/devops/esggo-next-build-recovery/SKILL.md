---
name: esggo-next-build-recovery
description: Next.js build hangs/timeouts and recovery.
---

# ESGGO Next.js Build 卡住/超時實戰經驗技能書

> 真實除錯：`pnpm -w build` 在 Windows 上反覆超時，解法不是無限重試，而是辨識
> `.next/lock` 殘留 + 使用背景程序避免阻塞會話。

---

## 1. 典型徵兆

```bash
# 輸出停在 "Running TypeScript ..." 或 "Compiled successfully"
# 之後數分鐘無後續進度
# 即使背景跑，也可能是：
#   Another next build process is already running.
```

---

## 2. 根因

- `.next/lock` 或 `.next/dev/lock` 殘留
- 上一個 `next build` 異常結束（Ctrl-C、timeout、崩潰）
- 背景 turbopack / typescript worker 殘留

---

## 3. 快速診斷

```bash
cd /c/Project/esggo

# 3.1 檢查 lock 檔
ls -la .next/lock .next/dev/lock 2>/dev/null

# 3.2 檢查是否有 next 程序
ps -ef | rg "next build|next-server|node.*next|typescript" | rg -v rg
```

---

## 4. 修復流程

```bash
# 4.1 刪除 lock 檔
cd /c/Project/esggo
rm -f .next/lock .next/dev/lock

# 4.2（可選）清理快取
rm -rf .next/cache

# 4.3 用背景程序跑 build（避免會話阻塞）
pnpm -w build  # foreground，設定 timeout=600
# 或
terminal(background=True, notify_on_complete=True):
  cd /c/Project/esggo && pnpm -w build
```

---

## 5. 預防措施

```bash
# 每次 build 前自動清理
cd /c/Project/esggo
rm -f .next/lock .next/dev/lock
pnpm -w build
```

---

## 6. 與 CI 的關係

- GitHub Actions 通常不會卡在 build（乾淨環境）
- 本地 Windows 開發機才需要這個技能
- 若 CI 也卡：檢查 `pnpm-lock.yaml` 是否與 `package.json` 同步

---

## 7. 驗證

```bash
# 成功徵兆：
# - "Compiled successfully"
# - "Running TypeScript ... Finished"
# - "Generating static pages ... 54/54"
# - "Finalizing page optimization ..."
```

---

## 8. 相關技能

- `esggo-aistation-deployment` — AI Station VPS 部署
- `typescript-build-cleanup` — TS 專案清理模式
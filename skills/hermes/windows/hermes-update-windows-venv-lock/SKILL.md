---
name: hermes-update-windows-venv-lock
description: "Use when hermes update hits venv .pyd lock on Windows."
version: 1.0.0
author: session capture
license: MIT
platforms: [windows]
metadata:
  trigger: "hermes update fails · venv .pyd locked · Hermes Desktop running · WinError 32"
  category: windows
  tags: [hermes, windows, update]
  related_skills: [hermes-agent, hermes-windows-tooling]
---

# hermes update on Windows — venv Lock & Recovery

## 什麼發生了

Windows 上執行 `hermes update --yes` 時，若有其他行程正從同一 venv 跑（典型：Hermes Desktop backend、`hermes serve`、別的 Hermes terminal），更新會停在這：

```
✗ Other Hermes processes are running from this install's venv:
  PID xxxxx  python.exe  .../venv/Scripts/python.exe ... ← Hermes Desktop backend
  PID yyyyy  python.exe  .../venv/Scripts/python.exe -m hermes_cli.main serve ...

On Windows these keep native extension files (.pyd) locked, so the
dependency update would fail partway and leave a broken install.
Close the Hermes desktop app / other Hermes terminals, then re-run:
  hermes update
(or use `hermes update --force-venv` to proceed anyway at your own risk)
```

退出碼 2，更新沒有生效，gateway launcher scripts 會被 refresh（這部分是 done），但核心更新卡住。

## 兩條路

### 路 A — 安全：先關應用程式重跑（首選）

1. 關掉 Hermes Desktop（工作列圖示或工作管理員結束那些 `python.exe` 行程）
2. 確認 venv 沒行程鎖：

```bash
tasklist | grep -i hermes
tasklist | grep -i python
```

3. 重新更新：

```bash
hermes update --yes
```

### 路 B — 猛莽：`--force-venv`（慎用）

```bash
hermes update --yes --force-venv
```

`--force-venv` 的行為：
- 允許更新繼續，即使有行程鎖
- 那些持有 `.pyd` 的行程不會被 kill；覆寫期間它們還是握著舊版 DLL
- 若某個模組當時剛好在裝載，可能留下半殼安裝（broken venv）
- 更新後若舊行程沒重啟，可能繼續跑舊版程式碼直到重啟

**什麼時候值得用**：
- 你知道 Desktop 之後會重開（或你馬上就要重開）
- update 只是 dependency 微調，不涉及重大 `.pyd` 更動
- 你願意接受在最壞情況下重建 venv 的成本

**什麼時候別用**：
- 更新涉及大幅 dependency 更動
- 你不確定那些行程之後誰會用、會不會殘留
- 你當下可以關 Desktop

## 更新後驗證

```bash
hermes --version
hermes status
```

若 `--force-venv` 後有怪異行為（ImportError、跑舊版），重啟 Desktop 或重跑 `hermes serve` 讓它們重新載入新的 `.pyd`。

## 常見誤解

- 「她是更新網關所以一定成功」→ 錯。網關 launcher scripts 均已 refresh，但核心更新因 venv 鎖沒推進。
- 「--force 就能躲過」→ 錯。`--force` 是給另一個 hermes.exe 並存情況的（WinError 32），不是處理 venv 鎖的；真正對付 venv 鎖的是 `--force-venv`。
- 「沒事，我就硬跑」→ 部分對。若只是跑小更新且 Desktop 隨後會重開，風險可控；但她終究不是 zero risk。

## 預防

- 更新前先檢查 Desktop / serve 行程，習慣性關閉再 update
- 若你經常在 Desktop 跑著時就要 update，可把這條流程記下來，避免每次都撞
- 更新發生在 gateway 空閒時段（訊息進入少的時候），減少中斷

## 參照

- `hermes update --help`：完整 flag 意義
- 技能 `hermes-agent`：Hermes 總體操作指南
- 技能 `hermes-windows-tooling`：Windows 上 Hermes 的 SSH / expanduser / cron deliver 坑

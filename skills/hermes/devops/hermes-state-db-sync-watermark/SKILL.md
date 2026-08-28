---
name: hermes-state-db-sync-watermark
description: Read opencode sync watermarks from live Hermes state.db.
---

# Hermes state.db 同步水位讀取

## 觸發條件
- 任務要讀取本機 Hermes `state.db` 的同步水位（`%last_sync%`）。
- 常見：opencode 會話同步檢查（每 15 分鐘 cron）。

## 關鍵陷阱（已實證）
1. `state.db` 是 **WAL 模式** live SQLite。主檔 `PRAGMA page_count` 會回報 `0`，schema 與資料都在**未 checkpoint 的 WAL**（`state.db-wal`）裡。
2. 直接 `sqlite3.connect(path)` 開啟時，讀者常**看不到任何 table**（sqlite_master 為空）——必須加 `busy_timeout` 讓 WAL 被合併。
3. **絕對不要**對 live DB 執行 `PRAGMA wal_checkpoint(TRUNCATE)`：會因 live writer 持有鎖而**永久掛起**（實測 180s+ 超時）。PASSIVE checkpoint 也會報 `disk I/O error`，但讀取不受影響。
4. MSYS `/tmp` 路徑 native sqlite3 讀不到；用 Windows 原生路徑 `C:/Users/<user>/AppData/Local/hermes/state.db`。
5. 不要整檔 `read()` 進 Python 再用 regex（643MB 會超時）；用 `rg -a` 掃 WAL（小檔）找 schema 最快。

## 正確讀取步驟
```python
import sqlite3
p = r"C:/Users/<user>/AppData/Local/hermes/state.db"
con = sqlite3.connect(f"file:{p}?mode=ro", uri=True)   # 唯讀 URI
con.execute("PRAGMA busy_timeout=8000")
cur = con.cursor()
# sync 水位在 state_meta(key TEXT PRIMARY KEY, value TEXT)
for k, v in cur.execute("SELECT key,value FROM state_meta WHERE key LIKE '%last_sync%'"):
    print(k, v)   # 值為 epoch 毫秒
con.close()
```

## 水位鍵（state_meta）
- `opencode_local_last_sync` — 本機末次同步（epoch ms）
- `opencode_vps_last_sync` — VPS 末次同步（epoch ms）；**VPS 實際狀態需另擇非 SSH 通道驗證**（SSH 後端故障時標註 `unreachable`）
- `telegram_vps_bridge_last_id` — 相關橋接水位（參考）

## 判斷停滯
- `age = now_ms - value`。若 > 排程週期數倍（如 15min 排程下 > 數小時），即為停滯/異常。
- 實測案例：兩水位凍結於 2026-08-04 21:0x，年齡 ≈ 37h，錯過 ~149 個週期 → 明確 STALLED。

## 約束
- 禁止 SSH 終端操作（Hermes SSH 後端故障）；僅本機 DB 讀取與 Web 探測。
- VPS 端無法驗證時，於報告標註 `unreachable`，勿臆測。

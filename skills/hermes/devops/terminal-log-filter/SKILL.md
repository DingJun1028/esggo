---
name: terminal-log-filter
description: "Filter dirty terminal paste to commands and logs."
version: 1.0.0
author: OA-Team Swarm
license: MIT
platforms: [windows, linux, macos]
tags: [log, filter, powershell, diagnose, mojibake]
metadata:
  hermes:
    tags: [log, filter, powershell, diagnose, mojibake]
    related_skills: [verify-done-claims, esggo-vps-tunnel-502-recovery]
---

# 萬能終端輸出過濾轉換器 (terminal-log-filter)

## When to Use
- 使用者貼了一整坨終端機輸出（PowerShell/bash），含錯誤回聲、ANSI、tree 符號、重複提示符、亂碼
- 貼文被當成指令執行報 `無法辨識` / `CommandNotFoundException` / `AmbiguousParameter`
- 需要從噪音中提取：有效指令 + 真實日誌證據 + 報錯根因

## 工具
現成實作：`tools/filter_log.py`（aistation/OmniAuto 倉庫）。

```bash
python3 tools/filter_log.py dirty.txt
python3 tools/filter_log.py dirty.txt --mode diagnose
cat dirty.txt | python3 tools/filter_log.py -
```

輸出四段：【A】有效指令 【B】日誌證據 【C】未分類 【D】報錯除錯 (根因+建議)。

## 亂碼根治
`decode_fix()` 處理：BOM 去除、CRLF→LF、零寬/控制字元丟棄、U+FFFD 替換字標記、ANSI 剝離。

## 報錯除錯規則
1. conn_refused — connection refused → curl 確認埠口；systemctl/pm2 查進程
2. nginx_proxy_arg — proxy_set_header 參數數量錯 → nginx -t 定位 檔:行；修 conf 再 reload
3. nginx_reload_fail — Reload failed → 先 nginx -t 別盲目 restart
4. cloudflared_origin — Unable to reach origin → 擷取 originService host:port，重啟源站非 cloudflared
5. ambiguous_param — PowerShell 參數歧義 → 只貼純指令勿貼回聲

## Pitfalls
- 把命令輸出整段選取貼回終端 → 每行日誌被當指令跑報錯
- 對 502 只 restart cloudflared/nginx，但根因是源站 (8421/8788) 掛 → 重啟源站
- 貼碎片段 HTML 帶 `??` 亂碼 → 真檔在 esggo apps/universal-translator/public/

## 實戰案例
esggo-vps 502：cloudflared 報 `dial tcp 127.0.0.1:8421: connection refused`，
nginx active 但 `oa.esggo.co.conf:8` proxy_set_header 語法錯。
→ 根因=兩後端皆掛 + 舊 nginx conf 錯；修 conf + 重啟 8421/8788 源站。

# 附件路徑超出工作區的處理模式（FTG 官網靜態頁面製作情境）

## 問題現象

Hermes desktop app 會拒絕附件路徑不在當前工作區的檔案。使用者透過 `@file:<路徑>` 丟入附件時，若該路徑超出工作區，會出現：

```
--- Context Warnings ---
- @file:`<附件路徑>`: path is outside the allowed workspace
```

此時 `read_file(附件路徑)` 會失敗（`File not found` 或等效拒絕）。

## 解法：改用本機絕對路徑定位附件

附件在 Hermes 本機實際儲存於：

```
$HOME/AppData/Local/hermes/attachments/<附件檔名>
```

Windows 情境範例（本 session 實際路徑）：

```
/c/Users/dingj/AppData/Local/hermes/attachments/FTG-Tours-Web 1.5.html
```

操作序列：

1. 先嘗試 `read_file(附件路徑)` — 若失敗（路徑超出工作區），不要卡住。
2. 用絕對路徑從 `$HOME/AppData/Local/hermes/attachments/` 直接確認附件位址：
   ```bash
   ls -la "$HOME/AppData/Local/hermes/attachments/<附件檔名>"
   ```
   或用 `find` 搜尋（注意大樹搜尋可能 timeout，優先用具體檔名）：
   ```bash
   find /c/Users -iname "*<附件檔名>*"   # 可能 timeout，優先具體路徑
   ```
3. 改用絕對路徑 `read_file("/c/Users/.../attachments/<附件檔名>")` 讀進來。
4. 後續處理（複製進 `apps/ftg-{version}/`、patching）皆在專案內進行。

## 備註

- 若附件名含空格（如 `FTG-Tours-Web 1.5.html`），Shell 處理時注意引號。
- 別把附件留在 `AppData/Local/hermes/attachments/` 之外的不確定路徑；標準位置就是上述目錄。
- 本解法是針對 Hermes desktop app 的附件載入行為，不是通用的「檔案在哪裡」問題。

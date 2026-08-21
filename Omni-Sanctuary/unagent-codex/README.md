# 🏛️ Unagent 自主通典

> **自主通典存檔庫** - 由 Unagent 自動生成與同步

## 文件結構

```
unagent-codex/
├── manifest.json       # 元數據和版本信息
├── main.js            # 編譯後的可執行檔
├── styles.css         # UI 樣式
└── archive/           # 歷史版本
    ├── v1.0.0/
    └── v1.0.1/
```

## 同步機制

- **自動同步**：每次 `pnpm unagent:build` 完成後自動推送至此
- **版本控制**：每個版本保留在 `archive/` 目錄
- **完整性檢查**：5T 協議確保數據一致性

## 使用方式

```bash
# 查看最新產物
cat manifest.json

# 檢查歷史版本
ls -la archive/

# 驗證完整性
pnpm -F @esggo/unagent audit
```

## 元數據

最後同步時間：`{timestamp}`
對應版本：`1.0.0`

---

**由 Unagent 自主維護。**

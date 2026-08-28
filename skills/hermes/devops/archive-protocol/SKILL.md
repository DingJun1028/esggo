---
name: archive-protocol
description: 封存規範與工具技能：定義 archive/ 結構與 manifest.json，確保封存可追溯、不可誤入 git。
trigger: 使用者要求封存大檔案、建立 archive/ 規範、manifest 記錄、存檔傳承。
---

# archive-protocol

> 「瘦身不是刪除，而是傳承；封存是為了保留歷史又不拖累系統。」

## 1. 目錄規範

```
archive/
├── README.md
├── manifest.json
└── YYYY-MM-DD-<topic>/
    ├── README.md
    ├── manifest.json
    └── <files>
```

## 2. manifest.json 格式

```json
{
  "topic": "topic-name",
  "created_at": "ISO8601",
  "files": [
    {
      "original_path": "原始路徑",
      "size_bytes": 12345,
      "sha256": "hash",
      "reason": "封存原因"
    }
  ]
}
```

## 3. 規則

- archive/ 必須加入 .gitignore
- 不得將 archive 內容加入 git
- 封存前確認可重建或已有備份
- 每個封存目錄必須有 README.md 說明原因

## 4. 與其他技能協作

- `repo-trim`：掃描後執行封存
- `cleanup-cron`：定期檢查 archive 狀態

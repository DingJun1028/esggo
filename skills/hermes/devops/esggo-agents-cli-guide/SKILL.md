---
name: esggo-agents-cli-guide
description: ESG-GO agents-cli 最佳實踐指南，包含安裝、使用、安全和記錄流程
version: v1.0
---

# ESG-GO agents-cli 最佳實踐指南 v1.0

## 📦 安裝流程

### 快速安裝 (推薦)
```bash
uvx google-agents-cli setup
```

### 手動安裝
```bash
# 1. 克隆倉庫
git clone https://github.com/DingJun1028/agents-cli.git
cd agents-cli

# 2. 安裝依賴
pip install -e .

# 3. 驗證安裝
agents-cli --version
```

## 🔧 CLI 指令

| 指令 | 功能 |
|------|------|
| `agents-cli setup` | 安裝 CLI + skills |
| `agents-cli scaffold <name>` | 建立新 agent 專案 |
| `agents-cli run "prompt"` | 執行 agent |
| `agents-cli eval generate` | 產生評估 traces |
| `agents-cli eval grade` | 評估生成結果 |
| `agents-cli deploy` | 部署到 Google Cloud |
| `agents-cli login` | GCP/AI Studio 認證 |
| `agents-cli install` | 依賴安裝 |
| `agents-cli lint` | 程式碼品質檢查 |

## 🛡️ 安全最佳實踐

### 機密管理
- 使用 GitHub Secrets 管理前端公鑰
- 使用 GCP Secret Manager 存檔 service key
- 定期輪換 API 金鑰 (每 7 天)
- 使用服務帳號而非個人帳號

### 程式碼安全
- `.gitignore` 排除 `.env` 和 `.env.local`
- 禁止提交任何金鑰到版本控制

## 📝 記錄最佳實踐

- 迭代記錄至 `iteration-log.txt`
- Hindsight 記憶存檔
- 自動化日誌記錄

## ⚠️ 注意事項

- Python 3.11+ 必要
- uvx 或 pip 必要
- Node.js 可選 (部分 feature)
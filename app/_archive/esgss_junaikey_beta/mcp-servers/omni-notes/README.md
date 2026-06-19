# Omni 筆記 MCP 服務器
# Omni Notes MCP Server

## 📋 概述

Omni 筆記 MCP 服務器是一個基於 Model Context Protocol (MCP) 的服務器，提供 Omni 筆記系統的核心功能接口。它允許 AI 助手通過標準化的 MCP 協議訪問筆記管理、知識庫、同步服務等功能。

## 🚀 功能特性

### 核心工具

| 工具名稱 | 描述 |
|---------|------|
| `create_note` | 創建新的筆記，支持多種類別和標籤系統 |
| `search_notes` | 搜索筆記，支持全文搜索、類別過濾和標籤過濾 |
| `sync_note` | 同步筆記到外部平台（OmniSpace、Boost.Space、AITable 等） |
| `get_note` | 獲取筆記詳情 |
| `update_note` | 更新現有筆記 |
| `delete_note` | 刪除指定的筆記 |
| `get_related_notes` | 獲取相關筆記推薦 |
| `ask_ai` | 向 AI 智能助手提問 |
| `generate_report` | 生成各種類型的報告 |
| `get_system_status` | 獲取系統狀態 |

### 筆記類別

- **INSIGHT**: 洞察和想法
- **ESG**: ESG 相關內容
- **TECHNICAL**: 技術筆記
- **BUSINESS**: 商業筆記
- **PERSONAL**: 個人筆記

### 支持的同步平台

- OmniSpace
- Boost.Space
- AITable
- OmniNote
- OmniTable

## 📦 安裝

### 前置要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安裝步驟

```bash
cd mcp-servers/omni-notes
npm install
```

## 🔧 使用方法

### 構建

```bash
npm run build
```

### 開發模式

```bash
npm run dev
```

### 生產模式

```bash
npm start
```

## 📝 MCP 配置

### Claude Desktop 配置

在 Claude Desktop 的配置文件中添加以下內容：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "omni-notes": {
      "command": "node",
      "args": [
        "/path/to/mcp-servers/omni-notes/dist/index.js"
      ]
    }
  }
}
```

### Cline 配置

在 Cline 的配置文件中添加：

```json
{
  "mcpServers": {
    "omni-notes": {
      "command": "node",
      "args": [
        "/path/to/mcp-servers/omni-notes/dist/index.js"
      ]
    }
  }
}
```

## 🎯 使用示例

### 創建筆記

```typescript
{
  "name": "create_note",
  "arguments": {
    "title": "React 性能優化技巧",
    "content": "詳細的 React 性能優化指南...",
    "category": "TECHNICAL",
    "tags": ["React", "Performance", "Optimization"]
  }
}
```

### 搜索筆記

```typescript
{
  "name": "search_notes",
  "arguments": {
    "query": "React",
    "category": "TECHNICAL",
    "limit": 10
  }
}
```

### 同步筆記

```typescript
{
  "name": "sync_note",
  "arguments": {
    "noteId": "note_1",
    "platform": "omni_space"
  }
}
```

### 向 AI 提問

```typescript
{
  "name": "ask_ai",
  "arguments": {
    "question": "如何優化 React 應用的性能？",
    "context": "我正在開發一個大型 React 應用"
  }
}
```

## 🏗️ 架構

### 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                    MCP 協議層                            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Omni 筆記 MCP 服務器                      │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ 筆記管理      │   │ 知識庫        │   │ 同步服務      │
│ Note Manager  │   │ Knowledge Base│   │ Sync Service  │
└───────────────┘   └───────────────┘   └───────────────┘
```

### 數據流

```
用戶請求 → MCP 協議 → 工具處理器 → 存儲層 → 響應
```

## 🔐 安全性

- 所有工具調用都經過參數驗證
- 敏感操作（如刪除）需要明確確認
- 支持權限管理和訪問控制

## 📊 監控和日誌

服務器會輸出以下日誌信息：

- 服務器啟動信息
- 工具調用記錄
- 錯誤和異常信息

## 🧪 測試

```bash
npm test
```

## 🤝 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 本項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

MIT License

## 🔗 相關鏈接

- [MCP 協議文檔](https://modelcontextprotocol.io/)
- [OmniCircle 系統文檔](../../docs/OMNICIRCLE_MCP_GUIDE.md)
- [Omni 筆記架構文檔](../../docs/UNIVERSAL_NOTES_ARCHITECTURE.md)

## 📞 支持

如有問題或建議，請：

1. 查看 [FAQ](../../docs/FAQ.md)
2. 提交 [Issue](https://github.com/your-repo/issues)
3. 聯繫支持團隊

---

**Omni 筆記 MCP 服務器** - 讓知識無礙流轉！

# 萬能筆記快速開始指南
# Universal Notes Quick Start Guide

## 🚀 5 分鐘快速開始

### 前置要求

- Node.js >= 18.0.0
- Claude Desktop 或其他支持 MCP 的 AI 應用

### 第一步：安裝和註冊

#### Windows 用戶

```powershell
# 進入項目目錄
cd mcp-servers/universal-notes

# 運行註冊腳本
.\register-mcp.ps1
```

#### macOS/Linux 用戶

```bash
# 進入項目目錄
cd mcp-servers/universal-notes

# 給腳本添加執行權限
chmod +x register-mcp.sh

# 運行註冊腳本
./register-mcp.sh
```

### 第二步：重啟 Claude Desktop

註冊完成後，重啟 Claude Desktop 以加載新的 MCP 服務器。

### 第三步：開始使用

在 Claude 中，您現在可以使用以下工具：

## 📝 基本使用示例

### 1. 創建您的第一個筆記

```
請幫我創建一個關於 React 性能優化的筆記
```

Claude 會自動調用 `create_note` 工具，創建一個類別為 TECHNICAL 的筆記。

### 2. 搜索筆記

```
搜索所有關於 React 的筆記
```

Claude 會使用 `search_notes` 工具查找相關筆記。

### 3. 獲取相關筆記

```
查看與筆記 note_1 相關的其他筆記
```

Claude 會使用 `get_related_notes` 工具推薦相關內容。

### 4. 向 AI 提問

```
如何優化 React 應用的性能？
```

Claude 會使用 `ask_ai` 工具提供智能回答。

### 5. 同步筆記

```
將筆記 note_1 同步到 OmniSpace
```

Claude 會使用 `sync_note` 工具進行同步。

## 🎯 筆記類別說明

| 類別 | 說明 | 使用場景 |
|------|------|----------|
| INSIGHT | 洞察和想法 | 記錄靈感、想法、創意 |
| ESG | ESG 相關內容 | 環境、社會、治理相關筆記 |
| TECHNICAL | 技術筆記 | 代碼、技術文檔、開發筆記 |
| BUSINESS | 商業筆記 | 商業計劃、市場分析、策略 |
| PERSONAL | 個人筆記 | 日記、個人目標、生活記錄 |

## 🔧 高級功能

### 標籤系統

創建筆記時可以添加多個標籤：

```
創建一個關於 TypeScript 的筆記，標籤為：TypeScript、類型系統、開發工具
```

### 類別過濾

搜索時可以指定類別：

```
搜索所有 TECHNICAL 類別的筆記
```

### 標籤過濾

搜索時可以指定標籤：

```
搜索標籤包含 React 和 Performance 的筆記
```

## 📊 系統狀態

隨時可以查看系統狀態：

```
查看系統狀態
```

## 🔄 同步平台

支持以下平台：

- **OmniSpace**: 基礎平台
- **Boost.Space**: 數據同步平台
- **AITable**: 表格數據平台
- **OmniNote**: 筆記平台
- **OmniTable**: 表格平台

## 📈 報告生成

生成各種類型的報告：

```
生成一個月的使用報告，格式為 JSON
```

支持的報告類型：
- `usage`: 使用報告
- `analytics`: 分析報告
- `performance`: 性能報告

## 🛠️ 故障排除

### 問題：服務器未啟動

**解決方案**：
1. 檢查 Node.js 版本是否 >= 18.0.0
2. 確認依賴已正確安裝：`npm install`
3. 重新構建：`npm run build`

### 問題：工具不可用

**解決方案**：
1. 確認配置文件正確
2. 重啟 Claude Desktop
3. 檢查服務器日誌

### 問題：同步失敗

**解決方案**：
1. 檢查網絡連接
2. 確認平台憑證正確
3. 查看系統狀態

## 📚 進階學習

### 自動化工作流

結合多個工具創建自動化工作流：

```
1. 創建一個新筆記
2. 添加標籤
3. 同步到 OmniSpace
4. 生成使用報告
```

### AI 輔助寫作

使用 AI 助手幫助您：

```
幫我擴展這個筆記的內容，添加更多細節和例子
```

### 知識管理

建立您的知識庫：

```
創建一個關於 [主題] 的知識體系，包括：
1. 核心概念
2. 最佳實踐
3. 常見問題
4. 相關資源
```

## 🔗 相關資源

- [完整文檔](./README.md)
- [系統架構](../../docs/UNIVERSAL_NOTES_ARCHITECTURE.md)
- [MCP 協議](https://modelcontextprotocol.io/)
- [OmniCircle 指南](../../docs/OMNICIRCLE_MCP_GUIDE.md)

## 💡 提示和技巧

1. **使用描述性標題**: 讓筆記更容易搜索
2. **合理使用標籤**: 建立一致的標籤系統
3. **定期同步**: 確保數據在各平台間同步
4. **利用 AI**: 使用 AI 助手幫助整理和擴展內容
5. **查看相關筆記**: 發現知識之間的聯繫

## 🤝 社區支持

- 提交問題：[GitHub Issues](https://github.com/your-repo/issues)
- 參與討論：[Discord](https://discord.gg/your-server)
- 查看文檔：[Wiki](https://github.com/your-repo/wiki)

---

**開始您的萬能筆記之旅！** 🚀

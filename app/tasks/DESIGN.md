# 任務中心 Tasks

**路徑：** `/tasks`

## 功能定位
任務中心是跨部門 ESG 協作與治理執行的工作看板。

## 功能說明
本頁提供跨部門 ESG 任務分派、進度追蹤、5T 一致性檢查與優先級管理，讓治理工作從規劃走向落地執行。

## 主要內容
- 任務清單
- 優先級管理
- 進度追蹤
- 負責人與截止日
- 5T 一致性檢查

## 使用方式
1. 建立任務
2. 指派負責人與期限
3. 管理任務優先順序
4. 追蹤任務狀態與進度

## 使用場景
- 任務分派
- 跨部門協作
- 進度追蹤

## 頁面目標
- 讓 ESG 工作具備可執行性
- 建立跨模組落地治理機制

## 解決的痛點
- ESG 任務跨部門易失控
- 進度難同步

## 目前成果
- 已建立 Tasks 邏輯資料結構
- 已形成任務看板頁面定位

## Swap-DeFi-TEST-UMES-ONLINE Integration

1. **Transaction Validation**
   - All swaps require valid token pairs (ESG/USDC, UMES/WBTC)
   - Minimum amount of 0.1 tokens
   - Verified wallet addresses (0x+40 hex format)

2. **Pool Management**
   - Real-time liquidity tracking for:
     - ESG/USDC pool (id: pool_esg_usdc)
     - UMES/WBTC pool (id: pool_ume_btc)

3. **Flow Automation**
   - Automatic validation before execution
   - Error handling with fallback statuses

4. **API Endpoints**
   - GET /pools/{id}/status (real-time data)
   - POST /swap (transaction execution)

5. **Environment Variables**
   - `SWAP_DEFI_API_KEY` - Test API key for Swap-DeFi-TEST-UMES-ONLINE
   - `SWAP_DEFI_TOKEN` - Authentication token for DeFi service
   - `SWAP_DEFI_ENDPOINT` - API endpoint (default: https://test-umes.online/api/v1)

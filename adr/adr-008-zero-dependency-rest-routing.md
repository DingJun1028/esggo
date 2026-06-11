# ADR 006: 終極版路由升級解密與零依賴系統架構 (v2.4.0-stable.5T)

## 狀態
**已接受 (Accepted)** - 2026-06-05

## 背景與問題 (Context)
在先前的架構中，系統依賴特定的 NPM 套件與厚重的客戶端 SDK 來與 Supabase 進行通訊，並處理 OmniTable 的雙向同步。這帶來了以下挑戰：
1.  **技術債與依賴性：** 過度依賴第三方 SDK 增加了系統的脆弱性，且難以在不同環境（如極簡 Edge 節點）中輕量化部署。
2.  **開發環境不穩定：** 當外部資料庫（Supabase）無法連線時，會導致開發流程中斷。
3.  **雙向同步迴圈風險：** 系統（AITable 與本機端）之間的雙向同步缺乏強而有力的底層防護，容易因自動化腳本觸發無限迴圈（Infinite Loop）。
4.  **安全與溯源：** 需要更底層、更原生的方式來貫徹 5T 協議中的 Trustworthy（不可篡改），特別是 ZKP 鏈式加密的整合。

## 決策 (Decision)
我們決定實施 **v2.4.0-stable.5T** 路由架構革命，核心包含以下四大決策：

1.  **直接對接 Supabase REST 的無相依通訊模式 (Decoupled Client Architecture)**
    *   拋棄對特定 Supabase Client SDK 的依賴。
    *   路由內部直接使用原生 `fetch` 向 Supabase 的 Postgres REST 端點發送請求。
    *   透過 Header 注入 `Claims-Tenant-ID` 來模擬 Postgres RLS (Row Level Security) Session，確保租戶資料的物理隔離。

2.  **高擬真內存沙盒防禦與優雅降級 (Graceful Degradation)**
    *   實作 `mockDatabase` 作為本地端的狀態緩衝區。
    *   若 Supabase 實體連線異常（網路問題或離線開發環境），系統能秒級自動降級，將讀寫操作導向內存沙盒，確保開發與測試流程「絕不中斷」。

3.  **迴圈制動防衛鎖 (Infinite Loop Guard)**
    *   引入 `BOT_SIGNATURE`（如：`BLUE_Automation_Bot`）標籤。
    *   在接收到 Webhook 或同步請求時，嚴格檢查 `last_modified_by` 欄位。若發現變更源自機器人自身，則啟動安全攔截，截斷無窮迴圈。

4.  **ZKP 鏈式加密與自動化閉環 (Trustworthy & Automation)**
    *   所有寫入操作（Insert）強制執行 `generateZkpSeal` 演算法，基於前一個 Hash、資料 Payload、來源與時間戳生成 HMAC SHA-256 簽章，實現單向鏈式加密。
    *   直接在路由層整合 Browserbase 頭端自動化採集，將外部獲取的 ESG 數據（如憑證、碳排）直接封印歸檔。

## 影響 (Consequences)

### 正面影響 (Positive)
*   **極致輕量：** 移除了沉重的資料庫 SDK 依賴，路由啟動與執行速度大幅提升。
*   **高可用性：** 開發者即使在沒有網路的環境下，也能依靠內存沙盒繼續開發與測試 UI/UX。
*   **絕對安全：** ZKP 封印與 RLS 模擬在最低層級結合，確保資料的防篡改與多租戶安全。
*   **系統穩定：** 迴圈防護機制徹底解決了雙向同步的噩夢。

### 負面影響 / 限制 (Negative)
*   **維護成本：** 需要手動維護 REST API 的請求結構與 Headers，若 Supabase REST API 發生重大變更，需手動調整。
*   **沙盒資料揮發：** 內存沙盒的資料在伺服器重啟後會遺失，僅適合開發與測試用途。

## 證據庫 (Evidence / References)
*   萬能元件心核: `ee4af378-b9d7-412d-91d2-d50b98fa0715`
*   實作位置: `app/api/omni-table/route.ts`
*   對齊協議: 5T Protocol, JunAiKey Architecture

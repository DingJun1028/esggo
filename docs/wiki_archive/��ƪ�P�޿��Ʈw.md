# 資料表與邏輯資料庫

## 說明
目前系統資料主要以前端 Mock Data / SEED 形式存在，作為未來 Supabase PostgreSQL 正式資料表的 1:1 映射雛形。  
這些邏輯資料表已依功能模組分類，確保未來正式後端化時，可平滑銜接並維持資料一致性。

---

## 1. E-S-G 核心數據庫 (ESG Metrics)
這些資料表儲存企業核心 ESG 指標數據：

- **GHG Emissions**
  - 範疇一、二、三排放量
  - 碳密集度
- **Energy Consumption**
  - 總用電量
  - 再生能源比例
  - 化石燃料耗用
- **Water & Waste**
  - 取水量
  - 廢水排放
  - 有害 / 一般廢棄物
  - 回收率
- **Social Metrics**
  - 員工編制
  - 女性比例
  - FR / SR 指標
  - 平均受訓時數
- **Governance Metrics**
  - 董事會人數
  - 獨立董事比例
  - 女性董事比例
  - 貪腐事件數
  - 有效稅率

---

## 2. 治理與稽核資料庫 (Governance & Audit)
這些資料表確保平台符合 5T 誠信協議：

- **Evidence Vault**
  - 佐證文件
  - Hash 雜湊值
  - ZKP 驗證狀態
  - 檔案大小
  - 對應 GRI 條款
- **Audit Logs**
  - 操作者
  - 時間
  - 操作行為
  - SHA-256 Hash
- **Materiality Topics**
  - ESG 議題名稱
  - Impact
  - Concern
  - 雙重重大性定位

---

## 3. 營運與管理資料庫 (Operations & Management)
支援平台日常治理與任務執行：

- **Tasks**
  - 任務狀態
  - 優先級
  - 負責人
  - 截止日期
  - 進度
- **Company Profile**
  - 公司營收
  - 員工人數
  - 產業別
  - 願景使命
- **Notifications**
  - 系統通知
  - AI 提醒
  - 合規警示
  - 到期提醒

---

## 4. 外部關聯資料庫 (External Relations)
用於管理外部利害關係與供應鏈：

- **Suppliers**
  - 供應商名單
  - ESG 評分
  - 風險分級
  - 承諾書狀態
  - 在地採購狀態
- **Stakeholders**
  - 群體類型
  - 主要關注議題
  - 影響力權重
  - 參與頻率
- **Finance ROI**
  - 投入成本
  - 年度節省金額
  - 回收期

---

## 5. 知識庫與商情系統 (Knowledge & Intelligence)
支援知識、法規與外部情報管理：

- **Intelligence**
  - ESG 法規動態
  - 碳政策
  - 產業新聞
  - 衝擊等級標籤
- **Benchmarks**
  - 產業標竿企業 E / S / G 分數
- **Standards Library**
  - GRI
  - ISSB
  - TCFD
  - SASB
- **Net-Zero Milestones**
  - 中長期減碳里程碑
  - SBTi 目標設定

---

## 6. AI 與系統架構資料 (AI & System)
支援 AI 人格、智能調度與整合設定：

- **Personas / Digital Twin**
  - SPIRIT 人格 System Prompts
  - 道德 DNA 權重
- **Hermes Swarm**
  - Agent 狀態
  - 任務分配
  - 非同步工作
- **Connectors**
  - Supabase
  - Gemini
  - ERP
  - 各外部服務連接狀態

---

## 資料設計價值
- 支援未來正式上線快速接軌
- 降低前後端映射成本
- 讓功能頁與資料表保持一致
- 讓所有治理邏輯可持續擴充
# OMNI ESG Reports Center - 服務項目 UUID 核心對照表

# Service Items UUID Mapping

**版本**: v10.7.0-5T-Universe **建立日期**: 2026-02-27 **依據**:
「完美開發範式 - 1. 定義 (Definition)」

---

## 平台資訊 | Platform Information

| 項目                           | 內容                            |
| ------------------------------ | ------------------------------- |
| **系統名稱 System Name**       | ESG GO! / 善向永續 萬能永續平台 |
| **技術提供 Tech Provider**     | JunAiKey                        |
| **資料庫 Database**            | NCBDB (NoCodeBackend DataBase)  |
| **UI/UX 設計 UI/UX Design**    | Google Stitch MCP               |
| **代碼強固 Code Fixing**       | OmniJules 9式果因引擎           |
| **部署平台 Deployment**        | Vercel                          |
| **語言標準 Language Standard** | 「英碼繁博」準則                |

---

## UUID 格式規則 | UUID Format Rules

```
mod-[domain]-[name]-[id]
```

### 領域代碼 | Domain Codes

| Domain      | 名稱             | 命名空間前綴    |
| ----------- | ---------------- | --------------- |
| Hub         | 樞紐/入口        | mod-omni-hub    |
| Core        | 核心永續數據     | mod-omni-core   |
| Adv         | 進階智能決策     | mod-adv         |
| Comm        | 生態系與社群     | mod-comm        |
| ENV         | 環境             | mod-env         |
| SOC         | 社會             | mod-soc         |
| GOV         | 治理             | mod-gov         |
| AGC         | 代理/輔助        | mod-agc         |
| **SRC**     | **永續報告中心** | **mod-src**     |
| **BIC**     | **商業偵情中心** | **mod-bic**     |
| **DTC**     | **數位分身中心** | **mod-dtc**     |
| **Village** | **永續善向村**   | **mod-village** |
| **Cards**   | **萬能卡牌**     | **mod-cards**   |

### 狀態說明 | Status Legend

| Status      | 說明       |
| ----------- | ---------- |
| ACTIVE      | 已上線運作 |
| DEVELOPMENT | 開發中     |
| PLANNED     | 規劃中     |

---

## Phase 1: P0 核心功能 (20 個)

基礎設施核心，支撐所有其他功能

| Domain | Module Name                   | UUID                  | Route Path                   | Description                       | Status  |
| ------ | ----------------------------- | --------------------- | ---------------------------- | --------------------------------- | ------- |
| Hub    | ESG Omni Hub                  | mod-omni-hub-0000     | /omni                        | 萬能永續報告中心入口與全局導航    | ACTIVE  |
| Hub    | ESG Reports Center            | mod-omni-hub-0001     | /omni/reports                | 負責收納與派發 200 種報告的總樞紐 | ACTIVE  |
| Hub    | Jules AI Assistant            | mod-omni-hub-0002     | /omni/jules                  | Jules 萬能助手                    | ACTIVE  |
| Hub    | Agentic Twin                  | mod-omni-hub-0003     | /omni/agentic-twin           | AI 雙棲決策輔助                   | ACTIVE  |
| Hub    | BI Analytics                  | mod-omni-hub-0004     | /omni/bi-analytics           | 商業偵情分析                      | ACTIVE  |
| Core   | ESG Metrics Dashboard         | mod-omni-core-0001    | /omni/metrics                | 核心環境、社會、治理指標儀表板    | PLANNED |
| Core   | Carbon Footprint              | mod-omni-core-0002    | /omni/carbon                 | ISO-14064 碳足跡盤查與熱點分析    | PLANNED |
| Core   | Sustainability Reports        | mod-omni-core-0003    | /omni/sustainability-reports | 永續報告書編製與產出              | PLANNED |
| Adv    | Agentic Twin (AI)             | mod-adv-twin-0001     | /omni/agentic-twin           | AI 雙棲決策輔助引擎               | PLANNED |
| Adv    | BI & Analytics                | mod-adv-bi-0001       | /omni/bi-analytics           | 高階商業智慧與風險預測            | PLANNED |
| Comm   | Impact Village                | mod-comm-village-0001 | /omni/impact-village         | 供應鏈與社區影響力互動聚落        | PLANNED |
| GOV    | IComponentCore 核心類型定義   | mod-gov-core-0001     | /omni/core-types             | 所有數據的基礎合約                | PLANNED |
| GOV    | SHA-256 數位簽章封印          | mod-gov-trust-0001    | /omni/trust-seal             | 不可篡改的信任根基                | PLANNED |
| ENV    | StandardCalculator 計算引擎   | mod-env-calc-0001     | /omni/esg-calculator         | 透明的 ESG 計算引擎               | PLANNED |
| GOV    | 生命週期事件追蹤              | mod-gov-track-0001    | /omni/lifecycle-track        | 完整數據流轉紀錄                  | PLANNED |
| GOV    | 證據鏈 (Evidence Chain)       | mod-gov-evidence-0001 | /omni/evidence-chain         | 可溯源的證據結構                  | PLANNED |
| AGC    | Liquid Glass UI 設計系統      | mod-agc-ui-0001       | /omni/liquid-glass           | 高保真視覺體驗                    | PLANNED |
| GOV    | GRI 2026 指標映射引擎         | mod-gov-gri-0001      | /omni/gri-mapper             | 標準合規映射                      | PLANNED |
| GOV    | FSC 97 指標映射               | mod-gov-fsc-0001      | /omni/fsc-mapper             | 台灣金管會合規                    | PLANNED |
| GOV    | SASB 指標映射                 | mod-gov-sasb-0001     | /omni/sasb-mapper            | 產業別永續指標                    | PLANNED |
| ENV    | TCFD 氣候風險映射             | mod-env-tcfd-0001     | /omni/tcfd-mapper            | 氣候相關財務揭露                  | PLANNED |
| GOV    | 報告生成引擎 (Report Forge)   | mod-gov-forge-0001    | /omni/report-forge           | 自動化報告產出                    | PLANNED |
| AGC    | Zero-Hallucination 零幻覺驗算 | mod-agc-verify-0001   | /omni/zero-hallucination     | AI 數據驗證                       | PLANNED |

---

## Phase 2: P1 重要功能 (50 個)

環境、社會、治理核心指標模組

### ENV 環境 (20 個)

| Domain | Module Name            | UUID                           | Route Path              | Description          | Status  |
| ------ | ---------------------- | ------------------------------ | ----------------------- | -------------------- | ------- |
| ENV    | 碳足跡盤查 (ISO-14064) | mod-env-carbon-0001            | /omni/carbon-inventory  | ISO-14064 碳足跡盤查 | PLANNED |
| ENV    | Scope 1 直接排放       | mod-env-scope1-0001            | /omni/scope1            | 範疇一直接排放計算   | PLANNED |
| ENV    | Scope 2 外購電力       | mod-env-scope2-0001            | /omni/scope2            | 範疇二間接排放計算   | PLANNED |
| ENV    | Scope 3 供應鏈排放     | mod-env-scope3-0001            | /omni/scope3            | 範疇三價值鏈排放     | PLANNED |
| ENV    | 碳排放強度             | mod-env-carbon-intensity-0001  | /omni/carbon-intensity  | 碳排放強度指標       | PLANNED |
| ENV    | 能源管理儀表板         | mod-env-energy-0001            | /omni/energy-dashboard  | 能源消耗監控儀表板   | PLANNED |
| ENV    | 水資源追蹤系統         | mod-env-water-0001             | /omni/water-management  | 水資源使用追蹤       | PLANNED |
| ENV    | 廢棄物管理模組         | mod-env-waste-0001             | /omni/waste-management  | 廢棄物追蹤與分類     | PLANNED |
| ENV    | 供應鏈環境評估         | mod-env-supplychain-0001       | /omni/supplychain-env   | 供應鏈碳足跡評估     | PLANNED |
| ENV    | 氣候變遷風險評估       | mod-env-climate-risk-0001      | /omni/climate-risk      | 氣候風險分析         | PLANNED |
| ENV    | 生物多樣性影響評估     | mod-env-biodiversity-0001      | /omni/biodiversity      | 生物多樣性衝擊評估   | PLANNED |
| ENV    | 綠色採購管理           | mod-env-green-procurement-0001 | /omni/green-procurement | 綠色採購追蹤         | PLANNED |
| ENV    | 循環經濟指標           | mod-env-circular-0001          | /omni/circular-economy  | 循環經濟指標追蹤     | PLANNED |
| ENV    | 碳中和路徑規劃         | mod-env-carbon-neutral-0001    | /omni/carbon-neutrality | 碳中和目標路徑       | PLANNED |
| ENV    | 再生能源使用追蹤       | mod-env-renewable-0001         | /omni/renewable-energy  | 再生能源使用比例     | PLANNED |
| ENV    | 碳權交易記錄           | mod-env-carbon-credit-0001     | /omni/carbon-credits    | 碳權交易追蹤         | PLANNED |
| ENV    | 氣候情境分析           | mod-env-climate-scenario-0001  | /omni/climate-scenario  | 氣候情境模擬分析     | PLANNED |
| ENV    | 溫室氣體盤查查證       | mod-env-verification-0001      | /omni/ghg-verification  | GHG 第三方查證       | PLANNED |
| ENV    | SBTi 科學基礎目標      | mod-env-sbti-0001              | /omni/sbti              | 科學基礎減碳目標     | PLANNED |
| ENV    | CDP 碳揭露專案         | mod-env-cdp-0001               | /omni/cdp-response      | CDP 回應管理         | PLANNED |

### SOC 社會 (15 個)

| Domain | Module Name         | UUID                          | Route Path                | Description        | Status  |
| ------ | ------------------- | ----------------------------- | ------------------------- | ------------------ | ------- |
| SOC    | 員工人數與結構分析  | mod-soc-headcount-0001        | /omni/headcount           | 員工人數與結構分析 | PLANNED |
| SOC    | 職業健康安全追蹤    | mod-soc-ohs-0001              | /omni/occupational-health | 職業安全健康追蹤   | PLANNED |
| SOC    | 人才培訓與發展報告  | mod-soc-training-0001         | /omni/training-dev        | 培訓時數與發展報告 | PLANNED |
| SOC    | 供應商社會責任評估  | mod-soc-supplier-csr-0001     | /omni/supplier-csr        | 供應商 CSR 評估    | PLANNED |
| SOC    | 社區投資影響分析    | mod-soc-community-0001        | /omni/community-invest    | 社區投資影響分析   | PLANNED |
| SOC    | 客戶滿意度追蹤      | mod-soc-customer-sat-0001     | /omni/customer-sat        | 客戶滿意度調查     | PLANNED |
| SOC    | 多元化與包容性報告  | mod-soc-dei-0001              | /omni/diversity-inclusion | DEI 多元包容報告   | PLANNED |
| SOC    | 薪酬公平性分析      | mod-soc-pay-equity-0001       | /omni/pay-equity          | 薪酬公平性分析     | PLANNED |
| SOC    | 衝突礦產盡職調查    | mod-soc-conflict-mineral-0001 | /omni/conflict-minerals   | 衝突礦產盡職調查   | PLANNED |
| SOC    | 人權盡職調查        | mod-soc-human-rights-0001     | /omni/human-rights        | 人權盡職調查       | PLANNED |
| SOC    | 勞動條件監控        | mod-soc-labor-0001            | /omni/labor-conditions    | 勞動條件監控       | PLANNED |
| SOC    | 員工敬業度調查      | mod-soc-engagement-0001       | /omni/employee-engagement | 員工敬業度調查     | PLANNED |
| SOC    | 供應商輔導與赋能与  | mod-soc-supplier-enable-0001  | /omni/supplier-enable     | 供應商赋能輔導     | PLANNED |
| SOC    | SROI 社會投資報酬率 | mod-soc-sroi-0001             | /omni/sroi                | 社會投資報酬率     | PLANNED |
| SOC    | 公益慈善影響報告    | mod-soc-philanthropy-0001     | /omni/philanthropy        | 公益慈善影響報告   | PLANNED |

### GOV 治理 (10 個)

| Domain | Module Name        | UUID                          | Route Path                   | Description      | Status  |
| ------ | ------------------ | ----------------------------- | ---------------------------- | ---------------- | ------- |
| GOV    | 董事会效能評估     | mod-gov-board-0001            | /omni/board-effectiveness    | 董事会效能評估   | PLANNED |
| GOV    | 風險管理框架       | mod-gov-risk-0001             | /omni/risk-management        | 風險管理框架     | PLANNED |
| GOV    | 合規監控儀表板     | mod-gov-compliance-0001       | /omni/compliance-dashboard   | 合規監控儀表板   | PLANNED |
| GOV    | 道德與反貪腐培訓   | mod-gov-ethics-0001           | /omni/ethics-training        | 道德與反貪腐培訓 | PLANNED |
| GOV    | 獨立董事效能評估   | mod-gov-ind-director-0001     | /omni/independent-director   | 獨立董事效能評估 | PLANNED |
| GOV    | 薪酬委員會運作報告 | mod-gov-comp-committee-0001   | /omni/compensation-committee | 薪酬委員會報告   | PLANNED |
| GOV    | 審計委員會效能評估 | mod-gov-audit-0001            | /omni/audit-committee        | 審計委員會評估   | PLANNED |
| GOV    | 內部控制系統評估   | mod-gov-internal-control-0001 | /omni/internal-control       | 內部控制評估     | PLANNED |
| GOV    | 資訊安全治理       | mod-gov-infosec-0001          | /omni/infosec                | 資訊安全治理     | PLANNED |
| GOV    | 資料隱私保護合規   | mod-gov-privacy-0001          | /omni/privacy-compliance     | 資料隱私保護     | PLANNED |

### AGC 代理/輔助 (5 個)

| Domain | Module Name             | UUID                | Route Path           | Description        | Status  |
| ------ | ----------------------- | ------------------- | -------------------- | ------------------ | ------- |
| AGC    | 證據庫 (Evidence Vault) | mod-agc-vault-0001  | /omni/evidence-vault | 原始憑證存證       | PLANNED |
| AGC    | 模組化 UUID 註冊系統    | mod-agc-uuid-0001   | /omni/uuid-registry  | 唯一識別與權限管理 | PLANNED |
| AGC    | Omni Hub 總控儀表板     | mod-agc-hub-0001    | /omni/omni-dashboard | 200 功能導航入口   | PLANNED |
| AGC    | 草稿自動儲存服務        | mod-agc-draft-0001  | /omni/wuzuo-note     | 草稿自動儲存服務   | PLANNED |
| AGC    | AI 智能引導精靈         | mod-agc-wizard-0001 | /omni/ai-wizard      | GRI 分章節引導精靈 | PLANNED |

---

## Phase 3: P2 一般功能 (50 個)

擴展功能與進階應用

### ENV 環境延伸 (15 個)

| Domain | Module Name      | UUID                          | Route Path                | Description        | Status  |
| ------ | ---------------- | ----------------------------- | ------------------------- | ------------------ | ------- |
| ENV    | 範疇一甲烷排放   | mod-env-methane-0001          | /omni/methane-emissions   | CH4 甲烷排放計算   | PLANNED |
| ENV    | 範疇一氧化亞氮   | mod-env-n2o-0001              | /omni/n2o-emissions       | N2O 氧化亞氮排放   | PLANNED |
| ENV    | 範疇一氟化氣體   | mod-env-hfc-0001              | /omni/hfc-emissions       | HFCs 氟化氣體排放  | PLANNED |
| ENV    | 生物質燃料排放   | mod-env-biomass-0001          | /omni/biomass-emissions   | 生物質燃料排放計算 | PLANNED |
| ENV    | 碳移除量計算     | mod-env-carbon-removal-0001   | /omni/carbon-removal      | 碳移除技術追蹤     | PLANNED |
| ENV    | 碳中和達成率     | mod-env-cnr-0001              | /omni/carbon-neutral-rate | 碳中和達成率追蹤   | PLANNED |
| ENV    | 能源密集度       | mod-env-energy-intensity-0001 | /omni/energy-intensity    | 能源使用效率指標   | PLANNED |
| ENV    | 再生能源憑證追蹤 | mod-env-rec-0001              | /omni/rec-tracking        | 再生能源憑證 (REC) | PLANNED |
| ENV    | 碳足跡標籤管理   | mod-env-carbon-label-0001     | /omni/carbon-label        | 產品碳足跡標籤     | PLANNED |
| ENV    | 碳中和產品認證   | mod-env-carbon-product-0001   | /omni/carbon-product      | 碳中和產品認證     | PLANNED |
| ENV    | 碳金融工具追蹤   | mod-env-carbon-finance-0001   | /omni/carbon-finance      | 碳金融商品追蹤     | PLANNED |
| ENV    | 碳汇估算         | mod-env-carbon-sink-0001      | /omni/carbon-sink         | 碳汇估算與驗證     | PLANNED |
| ENV    | 碳排放預算管理   | mod-env-carbon-budget-0001    | /omni/carbon-budget       | 碳排放預算控制     | PLANNED |
| ENV    | 碳減量目標追蹤   | mod-env-carbon-target-0001    | /omni/carbon-target       | 減碳目標進度追蹤   | PLANNED |
| ENV    | 碳中和路徑模擬器 | mod-env-carbon-sim-0001       | /omni/carbon-simulator    | 碳中和路徑模擬     | PLANNED |

### SOC 社會延伸 (15 個)

| Domain | Module Name    | UUID                             | Route Path                  | Description      | Status  |
| ------ | -------------- | -------------------------------- | --------------------------- | ---------------- | ------- |
| SOC    | 員工流動率分析 | mod-soc-turnover-0001            | /omni/turnover-analysis     | 員工流動率追蹤   | PLANNED |
| SOC    | 新進員工統計   | mod-soc-new-hire-0001            | /omni/new-hire-stats        | 新進員工統計     | PLANNED |
| SOC    | 育嬰留任率     | mod-soc-parental-0001            | /omni/parental-retention    | 育嬰留任率追蹤   | PLANNED |
| SOC    | 人均培訓時數   | mod-soc-training-per-capita-0001 | /omni/training-per-capita   | 人均培訓時數     | PLANNED |
| SOC    | 薪資差距比     | mod-soc-gender-pay-0001          | /omni/gender-pay-gap        | 性别薪資差距分析 | PLANNED |
| SOC    | 多元化指數     | mod-soc-diversity-index-0001     | /omni/diversity-index       | 多元化指數計算   | PLANNED |
| SOC    | 工傷率追蹤     | mod-soc-injury-rate-0001         | /omni/injury-rate           | 工傷率追蹤       | PLANNED |
| SOC    | 職業病率追蹤   | mod-soc-illness-rate-0001        | /omni/illness-rate          | 職業病率追蹤     | PLANNED |
| SOC    | 產品安全報告   | mod-soc-product-safety-0001      | /omni/product-safety        | 產品安全報告     | PLANNED |
| SOC    | 客戶隱私保護   | mod-soc-customer-privacy-0001    | /omni/customer-privacy      | 客戶隱私保護     | PLANNED |
| SOC    | 社區滿意度調查 | mod-soc-community-sat-0001       | /omni/community-sat         | 社區滿意度調查   | PLANNED |
| SOC    | 企業公民認證   | mod-soc-citizenship-0001         | /omni/corporate-citizenship | 企業公民認證     | PLANNED |
| SOC    | 供應鏈勞工權利 | mod-soc-supply-labor-0001        | /omni/supply-chain-labor    | 供應鏈勞工權利   | PLANNED |
| SOC    | 人才發展路徑   | mod-soc-talent-path-0001         | /omni/talent-development    | 人才發展路徑規劃 | PLANNED |
| SOC    | 員工福祉指數   | mod-soc-wellbeing-0001           | /omni/employee-wellbeing    | 員工福祉指數     | PLANNED |

### GOV 治理延伸 (15 個)

| Domain | Module Name      | UUID                            | Route Path                | Description        | Status  |
| ------ | ---------------- | ------------------------------- | ------------------------- | ------------------ | ------- |
| GOV    | 吹哨者保護機制   | mod-gov-whistleblower-0001      | /omni/whistleblower       | 吹哨者保護機制     | PLANNED |
| GOV    | 持續性風險監控   | mod-gov-continuous-risk-0001    | /omni/continuous-risk     | 持續性風險監控     | PLANNED |
| GOV    | 業務連續性計劃   | mod-gov-bcp-0001                | /omni/business-continuity | 業務連續性計劃     | PLANNED |
| GOV    | 危機管理演練記錄 | mod-gov-crisis-0001             | /omni/crisis-management   | 危機管理演練       | PLANNED |
| GOV    | 稅務透明度報告   | mod-gov-tax-0001                | /omni/tax-transparency    | 稅務透明度報告     | PLANNED |
| GOV    | 供應商管理系統   | mod-gov-supplier-0001           | /omni/supplier-mgmt       | 供應商管理系統     | PLANNED |
| GOV    | 股東權利保護     | mod-gov-shareholder-0001        | /omni/shareholder-rights  | 股東權利保護       | PLANNED |
| GOV    | 高管薪酬分析     | mod-gov-exec-comp-0001          | /omni/exec-compensation   | 高管薪酬分析       | PLANNED |
| GOV    | 商業倫理合規     | mod-gov-business-ethics-0001    | /omni/business-ethics     | 商業倫理合規       | PLANNED |
| GOV    | 反腐敗政策       | mod-gov-anti-corruption-0001    | /omni/anti-corruption     | 反腐敗政策         | PLANNED |
| GOV    | 董事会獨立性     | mod-gov-board-independence-0001 | /omni/board-independence  | 董事会獨立性指標   | PLANNED |
| GOV    | 董事会多元化     | mod-gov-board-diversity-0001    | /omni/board-diversity     | 董事会多元化指標   | PLANNED |
| GOV    | 董事会出勤率     | mod-gov-board-attendance-0001   | /omni/board-attendance    | 董事会出勤率追蹤   | PLANNED |
| GOV    | 女性董事比例     | mod-gov-women-director-0001     | /omni/women-director      | 女性董事比例       | PLANNED |
| GOV    | 董事会會議統計   | mod-gov-board-meeting-0001      | /omni/board-meeting       | 董事会會議次數統計 | PLANNED |

### AGC 代理延伸 (5 個)

| Domain | Module Name           | UUID                        | Route Path           | Description        | Status  |
| ------ | --------------------- | --------------------------- | -------------------- | ------------------ | ------- |
| AGC    | Magic Link 供應商填報 | mod-agc-magic-link-0001     | /omni/magic-link     | 外部供應鏈數據收集 | PLANNED |
| AGC    | API 介接介面          | mod-agc-api-0001            | /omni/api-gateway    | 外部系統整合       | PLANNED |
| AGC    | 哨兵防禦系統          | mod-agc-sentinel-0001       | /omni/sentinel       | API 頻率限制與安全 | PLANNED |
| AGC    | 智能合約驗證          | mod-agc-smart-contract-0001 | /omni/smart-contract | 智能合約審計       | PLANNED |
| AGC    | 數據品質監控          | mod-agc-data-quality-0001   | /omni/data-quality   | 數據品質監控       | PLANNED |

---

## Phase 4: P3 擴展功能 (50 個)

進階分析與創新應用

### ENV 環境創新 (15 個)

| Domain | Module Name      | UUID                        | Route Path                  | Description      | Status  |
| ------ | ---------------- | --------------------------- | --------------------------- | ---------------- | ------- |
| ENV    | 空氣品質監控     | mod-env-air-quality-0001    | /omni/air-quality           | 空氣品質監測系統 | PLANNED |
| ENV    | 排放交易配額管理 | mod-env-ets-0001            | /omni/emissions-trading     | 排放交易系統     | PLANNED |
| ENV    | 碳足迹熱點分析   | mod-env-carbon-hotspot-0001 | /omni/carbon-hotspot        | 碳排放熱點識別   | PLANNED |
| ENV    | 供應鏈碳管理平台 | mod-env-scm-carbon-0001     | /omni/scm-carbon            | 供應鏈碳管理平台 | PLANNED |
| ENV    | 產品碳足跡計算   | mod-env-product-cf-0001     | /omni/product-carbon        | 產品碳足跡計算   | PLANNED |
| ENV    | 碳資產負債表     | mod-env-carbon-balance-0001 | /omni/carbon-balance-sheet  | 碳資產負債表     | PLANNED |
| ENV    | 碳風險壓力測試   | mod-env-carbon-stress-0001  | /omni/carbon-stress-test    | 碳風險壓力測試   | PLANNED |
| ENV    | 低碳轉型路徑規劃 | mod-env-low-carbon-0001     | /omni/low-carbon-transition | 低碳轉型規劃     | PLANNED |
| ENV    | 綠色建築認證     | mod-env-green-building-0001 | /omni/green-building        | 綠建築認證追蹤   | PLANNED |
| ENV    | 電動車隊管理     | mod-env-ev-fleet-0001       | /omni/ev-fleet              | 電動車隊碳排追蹤 | PLANNED |
| ENV    | 農業碳足迹       | mod-env-agriculture-0001    | /omni/agriculture-carbon    | 農業碳排放計算   | PLANNED |
| ENV    | 土地利用碳影响   | mod-env-land-use-0001       | /omni/land-use-carbon       | 土地利用變更碳排 | PLANNED |
| ENV    | 藍碳生態系統     | mod-env-blue-carbon-0001    | /omni/blue-carbon           | 藍碳估算與保護   | PLANNED |
| ENV    | 碳中和城市規劃   | mod-env-carbon-city-0001    | /omni/carbon-smart-city     | 碳中和城市規劃   | PLANNED |
| ENV    | 碳足跡API服務    | mod-env-carbon-api-0001     | /omni/carbon-api            | 碳足跡 API 服務  | PLANNED |

### SOC 社會創新 (15 個)

| Domain | Module Name      | UUID                               | Route Path                      | Description      | Status  |
| ------ | ---------------- | ---------------------------------- | ------------------------------- | ---------------- | ------- |
| SOC    | 員工滿意度調查   | mod-soc-employee-sat-0001          | /omni/employee-satisfaction     | 員工滿意度調查   | PLANNED |
| SOC    | 供應商勞工評估   | mod-soc-supplier-labor-0001        | /omni/supplier-labor-assessment | 供應商勞工評估   | PLANNED |
| SOC    | 社會影響力評估   | mod-soc-social-impact-0001         | /omni/social-impact             | 社會影響力評估   | PLANNED |
| SOC    | 志願服務追蹤     | mod-soc-volunteer-0001             | /omni/volunteer-tracking        | 志願服務時數追蹤 | PLANNED |
| SOC    | 弱勢族群赋能与   | mod-soc-empowerment-0001           | /omni/empowerment               | 弱勢族群赋能     | PLANNED |
| SOC    | 供應商多元性     | mod-soc-supplier-diversity-0001    | /omni/supplier-diversity        | 供應商多元性評估 | PLANNED |
| SOC    | 產品生命週期安全 | mod-soc-product-lifecycle-0001     | /omni/product-lifecycle         | 產品安全生命週期 | PLANNED |
| SOC    | 客戶申訴處理     | mod-soc-customer-complaint-0001    | /omni/customer-complaint        | 客戶申訴管理     | PLANNED |
| SOC    | 資料外洩事件追蹤 | mod-soc-data-breach-0001           | /omni/data-breach               | 資料外洩事件追蹤 | PLANNED |
| SOC    | 供應商人權評分   | mod-soc-supplier-human-rights-0001 | /omni/supplier-human-rights     | 供應商人權評分   | PLANNED |
| SOC    | 職業健康風險評估 | mod-soc-ohs-risk-0001              | /omni/ohs-risk                  | 職業健康風險評估 | PLANNED |
| SOC    | 員工心理健康     | mod-soc-mental-health-0001         | /omni/mental-health             | 員工心理健康支持 | PLANNED |
| SOC    | 供應商培訓計劃   | mod-soc-supplier-training-0001     | /omni/supplier-training         | 供應商培訓計劃   | PLANNED |
| SOC    | 社區共建計劃     | mod-soc-co-creation-0001           | /omni/community-co-creation     | 社區共建計劃     | PLANNED |
| SOC    | 公平貿易認證     | mod-soc-fair-trade-0001            | /omni/fair-trade                | 公平貿易認證追蹤 | PLANNED |

### GOV 治理創新 (15 個)

| Domain | Module Name      | UUID                             | Route Path                 | Description    | Status  |
| ------ | ---------------- | -------------------------------- | -------------------------- | -------------- | ------- |
| GOV    | 治理效能評分卡   | mod-gov-scorecard-0001           | /omni/governance-scorecard | 治理效能評分卡 | PLANNED |
| GOV    | 風險儀表板       | mod-gov-risk-dashboard-0001      | /omni/risk-dashboard       | 風險管理儀表板 | PLANNED |
| GOV    | 合規培訓追蹤     | mod-gov-compliance-training-0001 | /omni/compliance-training  | 合規培訓追蹤   | PLANNED |
| GOV    | 法規變動追蹤     | mod-gov-regulatory-0001          | /omni/regulatory-change    | 法規變動追蹤   | PLANNED |
| GOV    | 內部審計追蹤     | mod-gov-audit-internal-0001      | /omni/internal-audit       | 內部審計追蹤   | PLANNED |
| GOV    | 治理培訓計劃     | mod-gov-training-0001            | /omni/governance-training  | 治理培訓計劃   | PLANNED |
| GOV    | ESG 評級管理     | mod-gov-esg-rating-0001          | /omni/esg-rating           | ESG 評級管理   | PLANNED |
| GOV    | 供應商合規審查   | mod-gov-supplier-compliance-0001 | /omni/supplier-compliance  | 供應商合規審查 | PLANNED |
| GOV    | 反洗錢監控       | mod-gov-aml-0001                 | /omni/aml-monitoring       | 反洗錢監控     | PLANNED |
| GOV    | 制裁名單篩選     | mod-gov-sanctions-0001           | /omni/sanctions-screening  | 制裁名單篩選   | PLANNED |
| GOV    | 利益衝突管理     | mod-gov-conflict-0001            | /omni/conflict-of-interest | 利益衝突管理   | PLANNED |
| GOV    | 企業社會責任報告 | mod-gov-csr-0001                 | /omni/csr-report           | CSR 報告編製   | PLANNED |
| GOV    | 永續發展目標對應 | mod-gov-sdgs-0001                | /omni/sdgs-mapping         | SDGs 目標對應  | PLANNED |
| GOV    | 氣候相關財務披露 | mod-gov-tcfd-report-0001         | /omni/tcfd-report          | TCFD 報告產出  | PLANNED |
| GOV    | 碳排放揭露       | mod-gov-cdp-response-0001        | /omni/cdp-full-response    | CDP 完整回應   | PLANNED |

### AGC 代理創新 (5 個)

| Domain | Module Name  | UUID                      | Route Path                     | Description     | Status  |
| ------ | ------------ | ------------------------- | ------------------------------ | --------------- | ------- |
| AGC    | AI 數據分析  | mod-agc-ai-analytics-0001 | /omni/ai-analytics             | AI 數據分析引擎 | PLANNED |
| AGC    | 報告自動化   | mod-agc-report-auto-0001  | /omni/report-automation        | 報告自動生成    | PLANNED |
| AGC    | 區塊鏈存證   | mod-agc-blockchain-0001   | /omni/blockchain-archive       | 區塊鏈證據存證  | PLANNED |
| AGC    | API 整合平台 | mod-agc-integration-0001  | /omni/api-integration          | API 整合平台    | PLANNED |
| AGC    | 第三方驗證   | mod-agc-third-party-0001  | /omni/third-party-verification | 第三方驗證對接  | PLANNED |

---

## Phase 5: P4 規劃中功能 (30 個)

前瞻性與研究階段功能

### ENV 前瞻研究 (10 個)

| Domain | Module Name      | UUID                         | Route Path                 | Description    | Status  |
| ------ | ---------------- | ---------------------------- | -------------------------- | -------------- | ------- |
| ENV    | 負碳技術追蹤     | mod-env-negative-carbon-0001 | /omni/negative-carbon      | 負碳技術評估   | PLANNED |
| ENV    | 碳捕獲技術       | mod-env-ccs-0001             | /omni/ccs-tracking         | 碳捕獲與封存   | PLANNED |
| ENV    | 生物炭應用       | mod-env-biochar-0001         | /omni/biochar              | 生物炭碳匯估算 | PLANNED |
| ENV    | 土壤碳匯         | mod-env-soil-carbon-0001     | /omni/soil-carbon          | 土壤碳匯評估   | PLANNED |
| ENV    | 氫能源追蹤       | mod-env-hydrogen-0001        | /omni/hydrogen-energy      | 氫能源使用追蹤 | PLANNED |
| ENV    | 核融合能源追蹤   | mod-env-fusion-0001          | /omni/fusion-energy        | 核融合能源追蹤 | PLANNED |
| ENV    | 碳中和飛行認證   | mod-env-carbon-flight-0001   | /omni/carbon-flight        | 碳中和航空認證 | PLANNED |
| ENV    | 碳中和活動認證   | mod-env-carbon-event-0001    | /omni/carbon-event         | 碳中和活動認證 | PLANNED |
| ENV    | 碳足迹區塊鏈認證 | mod-env-carbon-dlt-0001      | /omni/carbon-dlt           | 區塊鏈碳認證   | PLANNED |
| ENV    | 碳中和AI預測     | mod-env-carbon-ai-0001       | /omni/carbon-ai-prediction | AI 碳排預測    | PLANNED |

### SOC 前瞻研究 (10 個)

| Domain | Module Name    | UUID                            | Route Path               | Description     | Status  |
| ------ | -------------- | ------------------------------- | ------------------------ | --------------- | ------- |
| SOC    | 數位包容性     | mod-soc-digital-inclusion-0001  | /omni/digital-inclusion  | 數位包容性評估  | PLANNED |
| SOC    | AI 倫理原則    | mod-soc-ai-ethics-0001          | /omni/ai-ethics          | AI 倫理原則遵循 | PLANNED |
| SOC    | 工作與生活平衡 | mod-soc-work-life-0001          | /omni/work-life-balance  | 工作生活平衡    | PLANNED |
| SOC    | 終身學習追蹤   | mod-soc-lifelong-learning-0001  | /omni/lifelong-learning  | 終身學習時數    | PLANNED |
| SOC    | 薪酬透明度     | mod-soc-pay-transparency-0001   | /omni/pay-transparency   | 薪酬透明度報告  | PLANNED |
| SOC    | 供應商ESI評估  | mod-soc-supplier-esg-0001       | /omni/supplier-esg-score | 供應商 ESG 評分 | PLANNED |
| SOC    | 循環人才指標   | mod-soc-circular-talent-0001    | /omni/circular-talent    | 循環人才指標    | PLANNED |
| SOC    | 社會企業合作   | mod-soc-social-enterprise-0001  | /omni/social-enterprise  | 社會企業合作    | PLANNED |
| SOC    | 影響力投資追蹤 | mod-soc-impact-investing-0001   | /omni/impact-investing   | 影響力投資追蹤  | PLANNED |
| SOC    | 員工所有權計劃 | mod-soc-employee-ownership-0001 | /omni/employee-ownership | 員工所有權計劃  | PLANNED |

### GOV 前瞻研究 (5 個)

| Domain | Module Name   | UUID                       | Route Path                 | Description      | Status  |
| ------ | ------------- | -------------------------- | -------------------------- | ---------------- | ------- |
| GOV    | DAO 治理實驗  | mod-gov-dao-0001           | /omni/dao-governance       | DAO 去中心化治理 | PLANNED |
| GOV    | 數位治理框架  | mod-gov-digital-0001       | /omni/digital-governance   | 數位治理框架     | PLANNED |
| GOV    | AI 治理合規   | mod-gov-ai-governance-0001 | /omni/ai-governance        | AI 治理合規      | PLANNED |
| GOV    | 元宇宙治理    | mod-gov-metaverse-0001     | /omni/metaverse-governance | 元宇宙治理       | PLANNED |
| GOV    | Web3 身份驗證 | mod-gov-web3-identity-0001 | /omni/web3-identity        | Web3 身份驗證    | PLANNED |

### AGC 前瞻研究 (5 個)

| Domain | Module Name    | UUID                          | Route Path                   | Description    | Status  |
| ------ | -------------- | ----------------------------- | ---------------------------- | -------------- | ------- |
| AGC    | 實時監控儀表板 | mod-agc-realtime-0001         | /omni/realtime-dashboard     | 實時監控儀表板 | PLANNED |
| AGC    | 預測分析       | mod-agc-predictive-0001       | /omni/predictive-analytics   | 預測分析引擎   | PLANNED |
| AGC    | 法規遵從追蹤   | mod-agc-regulatory-track-0001 | /omni/regulatory-tracking    | 法規遵從追蹤   | PLANNED |
| AGC    | 培訓與認證     | mod-agc-training-cert-0001    | /omni/training-certification | 培訓與認證管理 | PLANNED |
| AGC    | 數據可視化     | mod-agc-visualization-0001    | /omni/data-visualization     | 數據可視化引擎 | PLANNED |

---

## 5 大項目核心模組 | 5 Major Projects Core Modules

### 1. 永續報告中心 (Sustainability Report Center) - mod-src-*

所有項目基本上都支持永續報告中心，包含 200 種報告功能的總樞紐

| Domain | Module Name        | UUID                 | Route Path                      | Description                       | Status |
| ------ | ------------------ | -------------------- | ------------------------------- | --------------------------------- | ------ |
| SRC    | ESG Reports Center | mod-src-hub-0001     | /omni/reports                   | 負責收納與派發 200 種報告的總樞紐 | ACTIVE |
| SRC    | Report Forge       | mod-src-forge-0001   | /governance/report-forge        | 自動化報告生成引擎                | ACTIVE |
| SRC    | Evidence Vault     | mod-src-vault-0001   | /governance/evidence-vault      | 不可篡改證據庫                    | ACTIVE |
| SRC    | Evidence Drawer    | mod-src-drawer-0001  | /synthesis/evidence-drawer      | 黃金絲線溯源                      | ACTIVE |
| SRC    | Anti-Greenwashing  | mod-src-anti-gw-0001 | /synthesis/anti-greenwashing    | 防漂綠哨兵                        | ACTIVE |
| SRC    | Progress Sphere    | mod-src-sphere-0001  | /synthesis/omni-progress-sphere | 永續進度球                        | ACTIVE |

---

### 2. 商業偵情中心 (Business Intelligence Center) - mod-bic-*

AI 驅動的商業智慧與決策支援系統

| Domain | Module Name        | UUID                   | Route Path                    | Description                     | Status |
| ------ | ------------------ | ---------------------- | ----------------------------- | ------------------------------- | ------ |
| BIC    | Strategy Center    | mod-bic-strategy-0001  | /cognitive/strategy-center    | AI 策略中心，數據洞察與決策邏輯 | ACTIVE |
| BIC    | Personal Dashboard | mod-bic-dashboard-0001 | /cognitive/personal-dashboard | 個人 ESG 儀表板                 | ACTIVE |
| BIC    | Daily Briefing     | mod-bic-briefing-0001  | /cognitive/daily-briefing     | 每日 ESG 簡報                   | ACTIVE |
| BIC    | AI Assistant       | mod-bic-assistant-0001 | /cognitive/ai-assistant       | ESG 智能助手 Dr. Thoth          | ACTIVE |
| BIC    | Trend Engine       | mod-bic-trend-0001     | /cognitive/trend-engine       | 趨勢預測引擎                    | ACTIVE |
| BIC    | Resonance          | mod-bic-resonance-0001 | /cognitive/resonance          | 認知共鳴同步                    | ACTIVE |

---

### 3. 數位分身中心 (Digital Twin Center) - mod-dtc-*

AI 雙棲決策輔助與數位分身系統

| Domain | Module Name       | UUID               | Route Path                | Description         | Status  |
| ------ | ----------------- | ------------------ | ------------------------- | ------------------- | ------- |
| DTC    | Agentic Twin      | mod-dtc-twin-0001  | /omni/agentic-twin        | AI 雙棲決策輔助引擎 | PLANNED |
| DTC    | Digital Twin Core | mod-dtc-core-0001  | /omni/digital-twin-core   | 數位分身核心系統    | PLANNED |
| DTC    | Innovation Lab    | mod-dtc-lab-0001   | /innovation/laboratory    | 創新實驗室          | ACTIVE  |
| DTC    | Visualization     | mod-dtc-viz-0001   | /innovation/visualization | 數據可視化引擎      | ACTIVE  |
| DTC    | Microsite         | mod-dtc-micro-0001 | /innovation/microsite     | 微型網站建構        | ACTIVE  |
| DTC    | Excellence Hub    | mod-dtc-excel-0001 | /excellence               | 卓越營運中心        | ACTIVE  |
| DTC    | Agency Matrix     | mod-dtc-agc-0001   | /agency                   | 代理矩陣            | ACTIVE  |

---

### 4. 永續善向村 (Sustainability Village) - mod-village-*

供應鏈與社區影響力互動聚落

| Domain  | Module Name    | UUID                       | Route Path             | Description    | Status  |
| ------- | -------------- | -------------------------- | ---------------------- | -------------- | ------- |
| Village | Village Square | mod-village-square-0001    | /impact/village-square | 永續善向村廣場 | ACTIVE  |
| Village | Impact Tracker | mod-village-impact-0001    | /impact/village-impact | 影響力追蹤系統 | PLANNED |
| Village | Community Hub  | mod-village-community-0001 | /impact/community      | 社區互動中心   | PLANNED |

---

### 5. 萬能卡牌 (Omni Cards) - mod-cards-*

ESG 知識卡牌系統，將學習轉化為收藏

| Domain | Module Name      | UUID                  | Route Path            | Description  | Status  |
| ------ | ---------------- | --------------------- | --------------------- | ------------ | ------- |
| Cards  | Card System      | mod-cards-system-0001 | /omni/cards           | 萬能卡牌系統 | ACTIVE  |
| Cards  | My Binder        | mod-cards-binder-0001 | /omni/cards/my-binder | 我的卡牌冊   | ACTIVE  |
| Cards  | Card Marketplace | mod-cards-market-0001 | /omni/cards/market    | 卡牌交易所   | PLANNED |
| Cards  | Card Forge       | mod-cards-forge-0001  | /omni/cards/forge     | 卡牌鑄造系統 | PLANNED |

---

## 統計摘要 | Statistics Summary

| Phase        | 功能數  | 說明                          |
| ------------ | ------- | ----------------------------- |
| Phase 1 (P0) | 20      | 核心基礎設施                  |
| Phase 2 (P1) | 50      | 重要指標模組                  |
| Phase 3 (P2) | 50      | 擴展功能                      |
| Phase 4 (P3) | 50      | 創新應用                      |
| Phase 5 (P4) | 30      | 前瞻研究                      |
| **5 大項目** | **26**  | **SRC/BIC/DTC/Village/Cards** |
| **總計**     | **226** |                               |

### 領域分布 | Domain Distribution

| Domain       | 數量   | 佔比      |
| ------------ | ------ | --------- |
| ENV          | 50     | 22%       |
| SOC          | 50     | 22%       |
| GOV          | 50     | 22%       |
| AGC          | 20     | 9%        |
| Hub          | 2      | 1%        |
| Core         | 3      | 1%        |
| Adv          | 2      | 1%        |
| Comm         | 1      | 0.5%      |
| **5 大項目** | **26** | **11.5%** |
| 其他擴展     | 22     | 10%       |

---

## 版本歷史 | Version History

| Version             | Date       | Description                                                                                     |
| ------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| v10.7.0-5T-Universe | 2026-02-27 | 新增 5 大項目 UUID 命名空間，支援永續報告中心、商業偵情中心、數位分身中心、永續善向村、萬能卡牌 |
| v10.6.0-Universe    | 2026-02-27 | 初始版本 - 200 功能 UUID 對照表建立                                                             |

---

_本文檔遵循「英碼繁博」準則，所有命名採用英文碼以確保國際相容性，中文說明作為本地化補充。_

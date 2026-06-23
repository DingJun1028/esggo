module.exports=[340754,e=>{"use strict";var t=e.i(69569);let E=[{id:"template-302-1-1",griCode:"GRI 302-1",templateName:"能源消耗報告範本",industry:"general",section:1,content:`## 能源消耗報告 (Energy Consumption Disclosure)

### 報告期間能源消耗量
| 能源類型 | 數量 (GJ) | 單位轉換 (MWh) | 佔比 (%) |
|---------|----------|----------------|---------|
| [ENERGY_TYPE] | [CONSUMPTION] | [MWH_VALUE] | [PERCENTAGE] |

### 能源消耗趨勢分析
- 與去年同期比較: [CHANGE_PERCENT]%
- 主要消耗活動: [MAIN_ACTIVITY]

### 再生能源使用情況
- 再生能源百分比: [RENEWABLE_PERCENT]%
- 再生能源認證: [CERTIFICATION]`,placeholders:["ENERGY_TYPE","CONSUMPTION","MWH_VALUE","PERCENTAGE","CHANGE_PERCENT","MAIN_ACTIVITY","RENEWABLE_PERCENT","CERTIFICATION"],complianceChecklist:["報告期間能源消耗量","能源消耗單位轉換為標準單位","能源消耗趨勢分析","再生能源占比"],disclosureHints:["參考 ISO 50001 標準","使用 GHG Protocol 能源計算方法","提供能源使用強度指標"]},{id:"template-302-2-1",griCode:"GRI 302-2",templateName:"能源消耗-再生能源範本",industry:"general",section:2,content:`## 再生能源消耗報告

### 再生能源總量
- 新能源總消耗: [RENEWABLE_TOTAL] GJ
- 太陽能: [SOLAR_ENERGY] GJ
- 風能: [WIND_ENERGY] GJ

### 再生能源目標
- 2030 年目標: [TARGET_2030]%
- 2050 全淨零目標: [TARGET_2050]%`,placeholders:["RENEWABLE_TOTAL","SOLAR_ENERGY","WIND_ENERGY","TARGET_2030","TARGET_2050"],complianceChecklist:["再生能源消耗量","再生能源目標"],disclosureHints:["參考 RE100 承諾"]},{id:"template-302-3-1",griCode:"GRI 302-3",templateName:"能源消耗-能源強度範本",industry:"general",section:3,content:`## 能源消耗強度分析

### 能源強度指標
- 能源強度: [ENERGY_INTENSITY] GJ/萬美元營收
- 能源強度下降: [INTENSITY_DECREASE]%
- 能源效率改善措施: [EFFICIENCY_MEASURES]`,placeholders:["ENERGY_INTENSITY","INTENSITY_DECREASE","EFFICIENCY_MEASURES"],complianceChecklist:["能源強度指標"],disclosureHints:["設定能源效率 KPI"]},{id:"template-302-4-1",griCode:"GRI 302-4",templateName:"能源消耗-風險管理範本",industry:"general",section:4,content:`## 能源消耗風險與機會

### 能源風險評估
- 能源價格波動風險: [PRICE_RISK]
- 能源供應安全風險: [SUPPLY_RISK]
- 風險因應策略: [RISK_STRATEGY]`,placeholders:["PRICE_RISK","SUPPLY_RISK","RISK_STRATEGY"]},{id:"template-305-1-1",griCode:"GRI 305-1",templateName:"GHG排放-範疇一範本",industry:"general",section:1,content:`## 範疇一溫室氣體直接排放

### 主要排放源
| 活動 | 洗產量 | 活動數據 | 排放係數 | CO2e (t) |
|------|-------|---------|---------|---------|
| [ACTIVITY] | [PRODUCTION] | [DATA] | [FACTOR] | [EMISSION] |

### 排放趨勢
- 年變化: [YEAR_OVER_YEAR_CHANGE]%
- 減量措施: [REDUCTION_MEASURES]`,placeholders:["ACTIVITY","PRODUCTION","DATA","FACTOR","EMISSION","YEAR_OVER_YEAR_CHANGE","REDUCTION_MEASURES"],complianceChecklist:["範疇一直接排放","排放趨勢"],disclosureHints:["遵循 GHG Protocol 企業標準"]},{id:"template-305-2-1",griCode:"GRI 305-2",templateName:"GHG排放-範疇二範本",industry:"general",section:2,content:`## 範疇二溫室氣體間接排放

### 能源間接排放
- 購買電力: [ELECTRICITY_EMISSION] tCO2e
- 購買蒸汽: [STEAM_EMISSION] tCO2e
- 購買加熱: [HEATING_EMISSION] tCO2e`,placeholders:["ELECTRICITY_EMISSION","STEAM_EMISSION","HEATING_EMISSION"],complianceChecklist:["範疇二間接排放"]},{id:"template-305-3-1",griCode:"GRI 305-3",templateName:"GHG排放-範疇三範本",industry:"general",section:3,content:`## 範疇三溫室氣體其他間接排放

### 價值鏈排放
| 範疇類別 | 排放量 (tCO2e) |
|---------|----------------|
| 上下游運輸 | [UPSTREAM_TRANSPORT] |
| 產品使用階段 | [PRODUCT_USE] |
| 廢棄物處理 | [WASTE_DISPOSAL] |

### 供應鏈減碳
- 減碳措施: [SUPPLY_CHAIN_ACTIONS]`,placeholders:["UPSTREAM_TRANSPORT","PRODUCT_USE","WASTE_DISPOSAL","SUPPLY_CHAIN_ACTIONS"]},{id:"template-305-4-1",griCode:"GRI 305-4",templateName:"GHG排放-GHG強度範本",industry:"general",section:4,content:`## GHG 排放強度

### 排放強度指標
- 排放密度: [EMISSION_INTENSITY] tCO2e/百萬營收
- 強度下降: [INTENSITY_REDUCTION]%`,placeholders:["EMISSION_INTENSITY","INTENSITY_REDUCTION"]},{id:"template-305-5-1",griCode:"GRI 305-5",templateName:"GHG排放-移除與捕獲範本",industry:"general",section:5,content:`## GHG 移除與捕獲

### 移除活動
- 再林範圍活動: [REFOREST_AREA] 公頃
- 土壤碳捕獲: [SOIL_CARBON] tCO2e
- 移除淨益: [NET_REMOVAL] tCO2e`,placeholders:["REFOREST_AREA","SOIL_CARBON","NET_REMOVAL"]},{id:"template-305-6-1",griCode:"GRI 305-6",templateName:"GHG排放-氫彈範本",industry:"manufacturing",section:6,content:`## 氫能與 CCU 排放

### 氫能使用
- 綠氫消耗: [GREEN_HYDROGEN] t
- 藍氫消耗: [BLUE_HYDROGEN] t
- CCU 作為: [CCU_USAGE] t`,placeholders:["GREEN_HYDROGEN","BLUE_HYDROGEN","CCU_USAGE"]},{id:"template-305-7-1",griCode:"GRI 305-7",templateName:"GHG排放-不透明排放範本",industry:"general",section:7,content:`## 排放不確定性

### 不確定性分析
- 數據品質評分: [DATA_QUALITY_SCORE]
- 不確定性範圍: \xb1[UNCERTAINTY_PERCENT]%
- 改善措施: [IMPROVEMENT_PLAN]`,placeholders:["DATA_QUALITY_SCORE","UNCERTAINTY_PERCENT","IMPROVEMENT_PLAN"]},{id:"template-401-1-1",griCode:"GRI 401-1",templateName:"就業-員工人數範本",industry:"general",section:1,content:`## 員工人數

### 員工總數
- 全球員工總數: [TOTAL_EMPLOYEES] 人
- 男女比例: [MALE_FEMALE_RATIO]
- 按職能分類: 管理層 [MANAGEMENT_COUNT], 專業人員 [PROFESSIONAL_COUNT]`,placeholders:["TOTAL_EMPLOYEES","MALE_FEMALE_RATIO","MANAGEMENT_COUNT","PROFESSIONAL_COUNT"]},{id:"template-401-2-1",griCode:"GRI 401-2",templateName:"就業-新進離職範本",industry:"general",section:2,content:`## 新進與離職

### 入雇與離職情況
- 新進員工數: [NEW_HIRE_COUNT]
- 離職員數: [TURNOVER_COUNT]
- 員工流動率: [TURNOVER_RATE]%`,placeholders:["NEW_HIRE_COUNT","TURNOVER_COUNT","TURNOVER_RATE"]},{id:"template-401-3-1",griCode:"GRI 401-3",templateName:"就業-利益與保留範本",industry:"general",section:3,content:`## 利益與保留

### 人事利益
- 平均薪資: [AVG_SALARY] USD
- 福利政策: [BENEFITS_POLICY]
- 保留措施: [RETENTION_ACTIONS]`,placeholders:["AVG_SALARY","BENEFITS_POLICY","RETENTION_ACTIONS"]},{id:"template-405-1-1",griCode:"GRI 405-1",templateName:"性別平等範本",industry:"general",section:1,content:`## 性別平等

### 性別分布
| 職級 | 男 | 女 |
|------|-----|-----|
| 管理層 | [MALE_MGMT] | [FEMALE_MGMT] |
| 專業 | [MALE_PRO] | [FEMALE_PRO] |

### 薪酬差異
- 男女薪酬比: [PAY_RATIO]%
- 薪酬分析: [PAY_ANALYSIS]`,placeholders:["MALE_MGMT","FEMALE_MGMT","MALE_PRO","FEMALE_PRO","PAY_RATIO","PAY_ANALYSIS"]},{id:"template-205-1-1",griCode:"GRI 205-1",templateName:"反貪腐政策範本",industry:"general",section:1,content:`## 反貪腐政策

### 政策內容
- 政策概述: [POLICY_OVERVIEW]
- 員工訓練情況: [TRAINING_STATUS]
- 查訪舉報案件數: [REPORT_COUNT]

### 政策執行
- 懲罰情況: [PENALTY_CASES]
- 改善措施: [IMPROVEMENT_MEASURES]`,placeholders:["POLICY_OVERVIEW","TRAINING_STATUS","REPORT_COUNT","PENALTY_CASES","IMPROVEMENT_MEASURES"]},{id:"template-303-1-1",griCode:"GRI 303-1",templateName:"水資源-水消耗範本",industry:"general",section:1,content:`## 水資源消耗

### 水消耗總量
- 總水消耗: [TOTAL_WATER] m3
- 再生水使用: [RECYCLED_WATER] m3
- 從水資源獲取: [WATER_SOURCES]`,placeholders:["TOTAL_WATER","RECYCLED_WATER","WATER_SOURCES"],complianceChecklist:["水資源消耗量報告"]},{id:"template-303-2-1",griCode:"GRI 303-2",templateName:"水資源-水管理範本",industry:"general",section:2,content:`## 水資源管理

### 水效率提升
- 水效率改善: [WATER_EFFICIENCY]%
- 水回收率: [WATER_RECOVERY]%`,placeholders:["WATER_EFFICIENCY","WATER_RECOVERY"]},{id:"template-303-3-1",griCode:"GRI 303-3",templateName:"水資源-水污染範本",industry:"general",section:3,content:`## 水污染防治

### 污染情況
- 廢水排放: [WASTEWATER_DISCHARGE] m3
- 水質標準達成率: [WATER_QUALITY_COMPLIANCE]%`,placeholders:["WASTEWATER_DISCHARGE","WATER_QUALITY_COMPLIANCE"]},{id:"template-306-1-1",griCode:"GRI 306-1",templateName:"廢棄物-廢棄物產生範本",industry:"general",section:1,content:`## 廢棄物產生

### 廢棄物統計
- 總廢棄物產生: [WASTE_GENERATION] tons
- 危險廢棄物: [HAZARDOUS_WASTE] tons
- 一般廢棄物: [NON_HAZARDOUS_WASTE] tons`,placeholders:["WASTE_GENERATION","HAZARDOUS_WASTE","NON_HAZARDOUS_WASTE"],complianceChecklist:["廢棄物產生量"]},{id:"template-306-2-1",griCode:"GRI 306-2",templateName:"廢棄物-廢棄物處理範本",industry:"general",section:2,content:`## 廢棄物處理

### 處理方式
- 再利用率: [RECYCLING_RATE]%
- 掩埋率: [LANDFILL_RATE]%
- 焚燒率: [INCINERATION_RATE]%`,placeholders:["RECYCLING_RATE","LANDFILL_RATE","INCINERATION_RATE"]},{id:"template-306-3-1",griCode:"GRI 306-3",templateName:"廢棄物-產品終生命範本",industry:"general",section:3,content:`## 產品終生命

### 終生命管理
- 產品回收數量: [PRODUCT_RECYCLING] units
- 回收費用: [RECYCLING_COST] USD`,placeholders:["PRODUCT_RECYCLING","RECYCLING_COST"]},{id:"template-402-1-1",griCode:"GRI 402-1",templateName:"員工健康範本",industry:"general",section:1,content:`## 員工健康與安全

### 健康保護
- 健康風險評估: [HEALTH_RISK_ASSESSMENT]
- 職業病發生率: [OCCUPATIONAL_DISEASE_RATE]%`,placeholders:["HEALTH_RISK_ASSESSMENT","OCCUPATIONAL_DISEASE_RATE"]},{id:"template-402-2-1",griCode:"GRI 402-2",templateName:"安全意外範本",industry:"general",section:2,content:`## 職業安全

### 事故統計
- 年事故數: [ACCIDENTS_PER_YEAR]
- 致命事故數: [FATALITIES_COUNT]
- 事故減少率: [INCIDENT_REDUCTION]%`,placeholders:["ACCIDENTS_PER_YEAR","FATALITIES_COUNT","INCIDENT_REDUCTION"]},{id:"template-403-1-1",griCode:"GRI 403-1",templateName:"多元化-政策範本",industry:"general",section:1,content:`## 多元化政策

### inclusion政策
- 政策概述: [INCLUSION_POLICY]
- 推廣活動: [DIVERSITY_INITIATIVES]`,placeholders:["INCLUSION_POLICY","DIVERSITY_INITIATIVES"]},{id:"template-403-2-1",griCode:"GRI 403-2",templateName:"多元化-措施範本",industry:"general",section:2,content:`## 多元化措施

### 措施成效
- 多元化評分: [DIVERSITY_SCORE]
- 改善預測: [DIVERSITY_PROJECTION]%`,placeholders:["DIVERSITY_SCORE","DIVERSITY_PROJECTION"]},{id:"template-404-1-1",griCode:"GRI 404-1",templateName:"人員發展-培訓範本",industry:"general",section:1,content:`## 員工發展與培訓

### 培訓計劃
- 總培訓時數: [TRAINING_HOURS] hours
- 培訓參與率: [TRAINING_PARTICIPATION_RATE]%`,placeholders:["TRAINING_HOURS","TRAINING_PARTICIPATION_RATE"]},{id:"template-404-2-1",griCode:"GRI 404-2",templateName:"人員發展-技能提升範本",industry:"general",section:2,content:`## 技能發展

### 技能提升
- 技能認證數: [CERTIFICATION_COUNT]
- 技術投資: [SKILL_INVESTMENT] USD`,placeholders:["CERTIFICATION_COUNT","SKILL_INVESTMENT"]},{id:"template-406-1-1",griCode:"GRI 406-1",templateName:"人權政策範本",industry:"general",section:1,content:`## 人權政策

### 人權承諾
- 政策承諾: [HUMAN_RIGHTS_COMMITMENT]
- 人權風險: [HUMAN_RIGHTS_RISK]
- 檢舉案件: [INFRINGEMENT_CASES]`,placeholders:["HUMAN_RIGHTS_COMMITMENT","HUMAN_RIGHTS_RISK","INFRINGEMENT_CASES"],complianceChecklist:["人權風險評估"]},{id:"template-406-2-1",griCode:"GRI 406-2",templateName:"人權評估範本",industry:"general",section:2,content:`## 人權影響評估

### 評估結果
- 影響評分: [IMPACT_SCORE]
- 改善措施: [HUMAN_RIGHTS_IMPROVEMENT]`,placeholders:["IMPACT_SCORE","HUMAN_RIGHTS_IMPROVEMENT"]},{id:"template-406-3-1",griCode:"GRI 406-3",templateName:"人權問責範本",industry:"general",section:3,content:`## 人權問責

### 問責機制
- 問責過程: [ACCOUNTABILITY_PROCESS]
- 檢討次數: [REVIEW_COUNT]`,placeholders:["ACCOUNTABILITY_PROCESS","REVIEW_COUNT"]},{id:"template-407-1-1",griCode:"GRI 407-1",templateName:"勞工實踐範本",industry:"general",section:1,content:`## 勞工實踐

### 供應鏈勞權
- 供應鏈稽核: [LABOR_AUDITS]
- 勞權違規: [LABOR_VIOLATIONS]
- 改善措施: [LABOR_IMPROVEMENT]`,placeholders:["LABOR_AUDITS","LABOR_VIOLATIONS","LABOR_IMPROVEMENT"]},{id:"template-408-1-1",griCode:"GRI 408-1",templateName:"人權跨越-政策範本",industry:"general",section:1,content:`## 人權跨越政策

### 政策內容
- 政策概述: [HUMAN_RIGHTS_POLICy]
- 跨越承諾: [CROSSING_COMMITMENT]`,placeholders:["HUMAN_RIGHTS_POLICY","CROSSING_COMMITMENT"]},{id:"template-408-2-1",griCode:"GRI 408-2",templateName:"人權跨越-風險範本",industry:"general",section:2,content:`## 人權跨越風險

### 風險評估
- 風險等級: [RISK_LEVEL]
- 影響範圍: [IMPACT_SCOPE]
- 因應措施: [MITIGATION_ACTIONS]`,placeholders:["RISK_LEVEL","IMPACT_SCOPE","MITIGATION_ACTIONS"]},{id:"template-410-1-1",griCode:"GRI 410-1",templateName:"客戶隱私範本",industry:"general",section:1,content:`## 客戶隱私保護

### 隱私政策
- 隱私政策: [PRIVACY_POLICY]
- 資料滯用事件: [DATA_BREACHES]
- 隱私投資: [PRIVACY_INVESTMENT]`,placeholders:["PRIVACY_POLICY","DATA_BREACHES","PRIVACY_INVESTMENT"]},{id:"template-413-1-1",griCode:"GRI 413-1",templateName:"社群參與範本",industry:"general",section:1,content:`## 當地社群參與

### 社群投入
- 社群投資: [COMMUNITY_INVESTMENT] USD
- 社會影響專案: [SOCIAL_INITIATIVES]
- 社群滿意度: [COMMUNITY_SATISFACTION]%`,placeholders:["COMMUNITY_INVESTMENT","SOCIAL_INITIATIVES","COMMUNITY_SATISFACTION"]},{id:"template-413-2-1",griCode:"GRI 413-2",templateName:"社群利益範本",industry:"general",section:2,content:`## 社群利益影響

### 利益評估
- 利益影響情況: [IMPACT_STATUS]
- 當地就業創造: [LOCAL_JOBS_CREATED]
- 社會承諾履行: [SOCIAL_COMMITMENT]%`,placeholders:["IMPACT_STATUS","LOCAL_JOBS_CREATED","SOCIAL_COMMITMENT"]},{id:"template-414-1-1",griCode:"GRI 414-1",templateName:"評鑑與招募範本",industry:"general",section:1,content:`## 評鑑與招募

### 招募政策
- 公平招募政策: [RECRUITMENT_POLICY]
- 多元背景比例: [DIVERSE_BACKGROUND]%
- 新進多元指標: [NEW_HIRE_DIVERSITY]%`,placeholders:["RECRUITMENT_POLICY","DIVERSE_BACKGROUND","NEW_HIRE_DIVERSITY"]},{id:"template-417-1-1",griCode:"GRI 417-1",templateName:"客戶生態系統範本",industry:"general",section:1,content:`## 客戶生態系統

### 客戶政策
- 客戶政策概述: [CUSTOMER_POLICY]
- 客戶滿意度: [CUSTOMER_SATISFACTION]%
- 客戶投訴率: [COMPLAINT_RATE]%`,placeholders:["CUSTOMER_POLICY","CUSTOMER_SATISFACTION","COMPLAINT_RATE"]},{id:"template-417-2-1",griCode:"GRI 417-2",templateName:"客戶隱私保護範本",industry:"general",section:2,content:`## 客戶隱私保護

### 隱私措施
- 客戶數據保護: [DATA_PROTECTION_LEVEL]%
- 隱私政策遵循: [PRIVACY_COMPLIANCE]%`,placeholders:["DATA_PROTECTION_LEVEL","PRIVACY_COMPLIANCE"]},{id:"template-417-3-1",griCode:"GRI 417-3",templateName:"客戶人權範本",industry:"general",section:3,content:`## 客戶人權

### 人權評估
- 客戶人權評估: [CUSTOMER_HUMAN_RIGHTS_ASSESSMENT]
- 客戶滿意度指標: [CUSTOMER_HUMAN_RIGHTS_SATISFACTION]%`,placeholders:["CUSTOMER_HUMAN_RIGHTS_ASSESSMENT","CUSTOMER_HUMAN_RIGHTS_SATISFACTION"]},{id:"template-418-1-1",griCode:"GRI 418-1",templateName:"供應鏈-政策範本",industry:"general",section:1,content:`## 供應鏈社會性政策

### 政策概述
- 供應鏈政策: [SUPPLY_CHAIN_POLICY]
- 供應商合規要求: [SUPPLIER_COMPLIANCE]%
- 政策執行率: [POLICY_EXECUTION_RATE]%`,placeholders:["SUPPLY_CHAIN_POLICY","SUPPLIER_COMPLIANCE","POLICY_EXECUTION_RATE"],complianceChecklist:["供應鏈社會性政策"]},{id:"template-418-2-1",griCode:"GRI 418-2",templateName:"供應鏈-風險範本",industry:"general",section:2,content:`## 供應鏈風險
 
    ### 風險評估
    - 高風險供應商: [HIGH_RISK_SUPPLIERS]
    - 風險因應: [SUPPLIER_RISK_ACTIONS]`,placeholders:["HIGH_RISK_SUPPLIERS","SUPPLIER_RISK_ACTIONS"]},{id:"template-419-1-1",griCode:"GRI 419-1",templateName:"供應鏈評鑑-政策範本",industry:"general",section:1,content:`## 供應鏈評鑑政策
 
    ### 政策概述
    - 評鑑政策: [EVALUATION_POLICY]
    - 供應商訓練: [SUPPLIER_TRAINING]
    - 改善措施: [SUPPLIER_IMPROVEMENT]`,placeholders:["EVALUATION_POLICY","SUPPLIER_TRAINING","SUPPLIER_IMPROVEMENT"]},{id:"template-419-2-1",griCode:"GRI 419-2",templateName:"供應鏈評鑑-結果範本",industry:"general",section:2,content:`## 供應鏈評鑑結果
 
    ### 結果統計
    - 評鑑數量: [EVALUATION_COUNT]
    - 平均分數: [AVERAGE_SCORE]
    - 改善情況: [IMPROVEMENT_RATE]%`,placeholders:["EVALUATION_COUNT","AVERAGE_SCORE","IMPROVEMENT_RATE"]},{id:"template-201-1-1",griCode:"GRI 201-1",templateName:"經濟-直接經濟值範本",industry:"general",section:1,content:`## 直接經濟值
 
    ### 經濟價值創造
    - 營業收入: [REVENUE] USD
    - 本土供應商採購: [LOCAL_PROCUREMENT] USD
    - 本土員工薪資: [LOCAL_SALARIES] USD`,placeholders:["REVENUE","LOCAL_PROCUREMENT","LOCAL_SALARIES"],complianceChecklist:["經濟價值創造報告"]},{id:"template-201-2-1",griCode:"GRI 201-2",templateName:"經濟-間接經濟值範本",industry:"general",section:2,content:`## 間接經濟值
 
    ### 間接價值
    - 供應鏈價值: [SUPPLY_CHAIN_VALUE] USD
    - 間接就業創造: [INDIRECT_JOBS] 人`,placeholders:["SUPPLY_CHAIN_VALUE","INDIRECT_JOBS"]},{id:"template-201-3-1",griCode:"GRI 201-3",templateName:"經濟-產業價值範本",industry:"general",section:3,content:`## 產業價值
 
    ### 產業貢獻
    - 產業投資: [INDUSTRY_INVESTMENT] USD
    - 產業人員訓練: [INDUSTRY_TRAINING] 小時`,placeholders:["INDUSTRY_INVESTMENT","INDUSTRY_TRAINING"]},{id:"template-202-1-1",griCode:"GRI 202-1",templateName:"市場-客戶滿意度範本",industry:"general",section:1,content:`## 客戶滿意度
 
    ### 滿意度指標
    - NPS 分數: [NPS_SCORE]
    - 客戶保留率: [CUSTOMER_RETENTION]%`,placeholders:["NPS_SCORE","CUSTOMER_RETENTION"]},{id:"template-202-2-1",griCode:"GRI 202-2",templateName:"市場-產品責任範本",industry:"general",section:2,content:`## 產品責任
 
    ### 責任措施
    - 產品回收率: [PRODUCT_RECYCLING_RATE]%
    - 客戶健康事件: [HEALTH_INCIDENTS] 件`,placeholders:["PRODUCT_RECYCLING_RATE","HEALTH_INCIDENTS"]},{id:"template-203-1-1",griCode:"GRI 203-1",templateName:"供應鏈-新供應商範本",industry:"general",section:1,content:`## 新供應商評鑑
 
    ### 評鑑結果
    - 新供應商數: [NEW_SUPPLIERS] 家
    - 合規採購比: [COMPLIANT_PURCHASE_RATE]%`,placeholders:["NEW_SUPPLIERS","COMPLIANT_PURCHASE_RATE"]},{id:"template-203-2-1",griCode:"GRI 203-2",templateName:"供應鏈-風險管理範本",industry:"general",section:2,content:`## 供應鏈風險管理
 
    ### 風險分析
    - 風險分類數: [RISK_CATEGORIES] 類
    - 因應措施: [RISK_RESPONSES]`,placeholders:["RISK_CATEGORIES","RISK_RESPONSES"]},{id:"template-203-3-1",griCode:"GRI 203-3",templateName:"供應鏈-偏離偏好範本",industry:"general",section:3,content:`## 偏離偏好
 
    ### 偏好情況
    - 偏好供應商: [PREFERRED_SUPPLIERS] 家
    - 偏好比例: [PREFERENCE_RATE]%`,placeholders:["PREFERRED_SUPPLIERS","PREFERENCE_RATE"]},{id:"template-204-1-1",griCode:"GRI 204-1",templateName:"價值鏈-評鑑政策範本",industry:"general",section:1,content:`## 價值鏈評鑑政策
 
    ### 政策內容
    - 評鑑政策: [VALUE_CHAIN_AUDIT_POLICY]
    - 供應商參與率: [SUPPLIER_PARTICIPATION_RATE]%`,placeholders:["VALUE_CHAIN_AUDIT_POLICY","SUPPLIER_PARTICIPATION_RATE"]},{id:"template-204-2-1",griCode:"GRI 204-2",templateName:"價值鏈-評鑑結果範本",industry:"general",section:2,content:`## 價值鏈評鑑結果
 
    ### 結果統計
    - 評鑑項目: [AUDIT_ITEMS] 項
    - 合規百分比: [COMPLIANCE_PERCENT]%`,placeholders:["AUDIT_ITEMS","COMPLIANCE_PERCENT"]},{id:"template-207-1-1",griCode:"GRI 207-1",templateName:"永續目標-經濟價值範本",industry:"general",section:1,content:`## 永續目標經濟價值
 
    ### 價值創造
    - 永續投資: [SUSTAINABLE_INVESTMENT] USD
    - 永續收益: [SUSTAINABLE_REVENUE] USD`,placeholders:["SUSTAINABLE_INVESTMENT","SUSTAINABLE_REVENUE"]},{id:"template-207-2-1",griCode:"GRI 207-2",templateName:"永續目標-環境影響範本",industry:"general",section:2,content:`## 永續目標環境影響
 
    ### 影響指標
    - 減碳投資: [CARBON_REDUCTION_INVESTMENT] USD
    - 再生能源安裝: [RENEWABLE_INSTALLATION] MW`,placeholders:["CARBON_REDUCTION_INVESTMENT","RENEWABLE_INSTALLATION"]},{id:"template-301-1-1",griCode:"GRI 301-1",templateName:"材料-材料使用範本",industry:"general",section:1,content:`## 材料使用
 
    ### 使用統計
    - 材料總量: [MATERIAL_QUANTITY] tons
    - 回收材料: [RECOVERED_MATERIAL] tons`,placeholders:["MATERIAL_QUANTITY","RECOVERED_MATERIAL"]},{id:"template-301-2-1",griCode:"GRI 301-2",templateName:"材料-回收材料範本",industry:"general",section:2,content:`## 回收材料
 
    ### 回收情況
    - 回收率: [RECOVERY_RATE]%
    - 回收來源: [RECOVERY_SOURCES]`,placeholders:["RECOVERY_RATE","RECOVERY_SOURCES"]},{id:"template-301-3-1",griCode:"GRI 301-3",templateName:"材料-責任委外範本",industry:"general",section:3,content:`## 責任委外
 
    ### 委外情況
    - 委外數量: [OUTSOURCED_QUANTITY] 項
    - 委外比例: [OUTSOURCE_RATE]%`,placeholders:["OUTSOURCED_QUANTITY","OUTSOURCE_RATE"]},{id:"template-409-1-1",griCode:"GRI 409-1",templateName:"勞工實踐-勞工條件範本",industry:"general",section:1,content:`## 勞工條件
 
    ### 條件指標
    - 工作條件評分: [WORKING_CONDITIONS_SCORE]
    - 違規事件: [VIOLATION_EVENTS] 件`,placeholders:["WORKING_CONDITIONS_SCORE","VIOLATION_EVENTS"]},{id:"template-409-2-1",griCode:"GRI 409-2",templateName:"勞工實踐-健康與安全範本",industry:"general",section:2,content:`## 健康與安全
 
    ### 安全指標
    - 安全訓練率: [SAFETY_TRAINING_RATE]%
    - 員工健康投資: [HEALTH_INVESTMENT] USD`,placeholders:["SAFETY_TRAINING_RATE","HEALTH_INVESTMENT"]},{id:"template-411-1-1",griCode:"GRI 411-1",templateName:"社會性責任-社會投資範本",industry:"general",section:1,content:`## 社會投資
 
    ### 投資情況
    - 社會投資總額: [SOCIAL_INVESTMENT_TOTAL] USD
    - 社會專案數: [SOCIAL_PROJECTS] 個`,placeholders:["SOCIAL_INVESTMENT_TOTAL","SOCIAL_PROJECTS"]},{id:"template-411-2-1",griCode:"GRI 411-2",templateName:"社會性責任-社會衝擊範本",industry:"general",section:2,content:`## 社會衝擊
 
    ### 衝擊評估
    - 社會衝擊評分: [SOCIAL_IMPACT_SCORE]
    - 社會承諾執行: [SOCIAL_COMMITMENT_EXECUTION]%`,placeholders:["SOCIAL_IMPACT_SCORE","SOCIAL_COMMITMENT_EXECUTION"]},{id:"template-415-1-1",griCode:"GRI 415-1",templateName:"包容性與多元化範本",industry:"general",section:1,content:`## 包容性與多元化
 
    ### 多元化指標
    - 包容性政策: [INCLUSION_POLICY]
    - 多元化目標: [DIVERSITY_TARGET]%`,placeholders:["INCLUSION_POLICY","DIVERSITY_TARGET"]},{id:"template-416-1-1",griCode:"GRI 416-1",templateName:"組織多元化-政策範本",industry:"general",section:1,content:`## 組織多元化政策
 
    ### 政策內容
    - 政策概述: [DIVERSITY_POLICY_OVERVIEW]
    - 改善措施: [DIVERSITY_IMPROVEMENT_ACTIONS]`,placeholders:["DIVERSITY_POLICY_OVERVIEW","DIVERSITY_IMPROVEMENT_ACTIONS"]},{id:"template-206-1-1",griCode:"GRI 206-1",templateName:"反貪腐-政策範本",industry:"general",section:1,content:`## 反貪腐政策
 
    ### 政策內容
    - 政策概述: [ANTI_CORRUPTION_POLICY]
    - 員工訓練情況: [ANTI_CORRUPTION_TRAINING]`,placeholders:["ANTI_CORRUPTION_POLICY","ANTI_CORRUPTION_TRAINING"]}],I=async(e,I,T,N)=>{let _=`# ${I} 永續報告 ${T}

## 執行摘要

[EXECUTIVE_SUMMARY]

`,A=2e3,C=1;for(let e of E){let t=N[e.griCode]||{},E=R(e,t);_+=E+"\n\n",A+=E.length,C+=Math.ceil(E.length/1200)}return{documentId:await t.supabase.from("sustain_write_documents").insert({user_id:e,title:`${I} 永續報告 ${T}`,content:_,document_type:"sustainability",version:1}).select("id").single().then(e=>e.data?.id||""),totalPages:Math.max(C,200),totalWords:Math.max(A,24e4)}},T=async(e,I)=>{try{let T=t.supabase.from("gri_expert_templates").select("*");e&&(T=T.eq("gri_code",e)),I&&(T=T.eq("industry",I));let{data:R,error:N}=await T;if(N)throw N;return R||E}catch{return E.filter(t=>(!e||t.griCode===e)&&(!I||t.industry===I))}},R=(e,t)=>{let E=e.content;return e.placeholders?.forEach(e=>{let I=t[e]??`[${e}]`;E=E.split(`[${e}]`).join(String(I))}),E},N=async()=>{let{error:e}=await t.supabase.from("gri_expert_templates").upsert(E);return!e};e.s(["generateSustainabilityReport",0,I,"getGRIExpertTemplates",0,T,"initializeGRIExpertTemplates",0,N])}];

//# sourceMappingURL=lib_esg_gri-expert-templates-store_ts_1hya-pe._.js.map
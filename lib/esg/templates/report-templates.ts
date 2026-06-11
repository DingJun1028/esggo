/**
 * ESG GO | GRI Report Templates
 * Standardized templates for GRI 2021 disclosures.
 */

export const GRI_TEMPLATES = {
  '305-1': {
    title: 'GRI 305-1: 直接（範疇一）溫室氣體排放',
    content: (metrics: string, trace: string) => `
### 揭露 305-1: 直接（範疇一）溫室氣體排放

**1. 排放總量**
本報告期間之直接溫室氣體排放量為：**${metrics}**。

**2. 數據來源與可靠性**
- 核算依據：ISO 14064-1:2018
- 誠信溯源鏈：
${trace}

**3. 合規說明**
所有原始憑證（發票、領料單）已存入 Evidence Vault 並完成 5T 誠信鎖定。
`
  },
  '305-2': {
    title: 'GRI 305-2: 能源間接（範疇二）溫室氣體排放',
    content: (metrics: string, trace: string) => `
### 揭露 305-2: 能源間接（範疇二）溫室氣體排放

**1. 排放總量**
本報告期間之能源間接（範疇二）溫室氣體排放量為：**${metrics}**。

**2. 數據細節**
- 能源類型：外購電力
- 計算公式：活動數據 * 所在地電力排放係數
- 誠信溯源鏈：
${trace}

> 💡 註：係數採用經濟部能源署發布之最新年度數據。
`
  }
};

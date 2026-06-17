---
uuid: 'da5aaeb7-f3da-4959-969d-e07f78b02f77'
version: '1.0.0'
timestamp: '2026-06-04T10:36:12.280Z'
evidence: 'WIKI_FUNCTION_FLOW.md'
---

## 🛠️ ESGGO 萬能元件：終極矩陣 功能實現流程

### 客戶旅程導向 | Customer Journey First

```
認識 ESGGO → 加入最愛 → 首頁體驗 → ESG 評估 → 數據填報 → 智能分析 → 報告生成 → 驗證稽核 → 分享匯出 → 後台管理 → 超紀管理
```

### 功能模組 | Function Modules

1. **萬能元件終極矩陣** (`/omni-matrix`)

   - 客製化元件拖曳配置
   - 跨模組功能組合
   - RWD 手機特化介面

2. **加入最愛** (`[加入最愛]`)

   - 一鍵收藏常用功能
   - 個人化儀表板
   - 快速訪入入口

3. **ESG 大宗性評估** (`/materiality`)

   - GRI 雙軸散佈排序
   - 權重比例試算

4. **碳熱力圖** (`/carbon-heatmap`)

   - GeoJSON 空間地理溫室氣體時序映射

5. **CBAM 計算器** (`/cbam-calculator`)

   - 亞太供應鏈進出口範疇一、二、三碳排放精密核算

6. **供應鏈追溯** (`/supply-chain`)

   - 跨公司供應商分級
   - Scope 3 碳足跡傳導

7. **數位雙生** (`/digital-twin`)

   - 企業物理碳資產與數據原子即時 3D 渲染

8. **合規檢核** (`/compliance-check`)

   - GRI/GRESB 全自動合規差異化報表生成

9. **審計驗證** (`/audit-verify`)

   - 區塊鏈定時錨定
   - ZKP 證明哈希鏈條產生

10. **AI 智能顧問** (`/advisory`)

    - RAG 知識庫匹配
    - AI 自動調用

11. **代理人協作** (`/agents`)
    - 多 Agent 編排
    - 事件總線即時調度

### 管理導覽 | Management Navigation

**後台專區** (`/admin`)

- 員工管理
- 權限設定
- 系統配置

**超紀管理員** (`/super-admin`)

- 企業級配置
- 資料備份恢復
- 安全稽核

### RWD 響應式設計 | Responsive Design

| 裝置 | 斷點             | 導航方式          |
| ---- | ---------------- | ----------------- |
| 手機 | `< 768px`        | 底部標籤 + AI FAB |
| 平板 | `768px - 1024px` | 收合式側邊欄      |
| 桌面 | `> 1024px`       | 完整側邊欄        |

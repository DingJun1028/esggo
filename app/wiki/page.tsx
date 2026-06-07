import React from 'react';
import WikiClientPage from './WikiClientPage';

export const metadata = {
  title: 'ESGGO Wiki | OmniCore',
  description: 'ESGGO System Architecture and 5T Governance Protocol',
};

// Complete wiki pages registry from docs/wiki/*.md (v8.5.1)
const mockPages = [
  {
    id: 1,
    journey: 'OmniCore Boot Sequence',
    page_id: 'omnicore-boot',
    title: 'OmniCore 啟動與登入',
    path: '/login',
    permission: 'public',
    core_purpose: '確保系統入口的安全性與 5T 協議的 Traceable (可溯源) 起點。',
    ux_experience: '用戶進入登入頁，體驗如液態玻璃般的流暢動畫與深色主題。',
    ui_rwd: '支援 RWD，核心區塊置中對齊，背景具備緩動光暈。',
    data_api: '調用 Supabase Auth 進行驗證，成功後核發 JWT 與 OmniCore 令牌。',
    edge_cases: '網路不穩時顯示 Skeleton，密碼錯誤時透過 Toast 提示且不阻斷畫面。',
    acceptance_5t: '包含登入紀錄以符合 Trackable 要求，且憑證經 Hash 綁定。',
    design_image:
      'https://images.unsplash.com/photo-1633435165993-9c8e104f7621?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    journey: 'ESG Data Vault',
    page_id: 'esg-data-vault',
    title: 'ESG 數據金庫與全視圖',
    path: '/dashboard',
    permission: 'authenticated',
    core_purpose: '展示 ESG 數據概覽，確保所有數據 Transparent (透明) 且 Tangible (具象化)。',
    ux_experience: '以網格佈局展示萬能卡片 (OmniCard)，點擊卡片可展開詳細數據溯源。',
    ui_rwd: '採用 CSS Grid 佈局，平板與手機自動降紧為單欄或雙欄。',
    data_api: '透過 /api/omni-components 獲取數據，並由 OmniMemorySync 同步至前端。',
    edge_cases: '無數據時展示提示，數據過大時採用虛擬滾動 (Virtual Scrolling)。',
    acceptance_5t: '必須支援數據公式驗算 (Transparent)，且無法在前端篡改 (Trustworthy)。',
    design_image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    journey: 'Task & Workflow Execution',
    page_id: 'omni-task-execution',
    title: '任務與協作系統',
    path: '/tasks',
    permission: 'authenticated',
    core_purpose: '讓代理與用戶協同完成任務，達成系統治理。',
    ux_experience: '列出待辦任務與正在執行的子代理進度，具備即時 WebSocket 更新。',
    ui_rwd: '側邊欄顯示任務列表，主區域顯示任務詳情與日誌。',
    data_api: '經由 WebSocketSwarmSyncService 接收即時進度更新。',
    edge_cases: '斷線時顯示重連狀態，且日誌必須在本地快取以免遺失。',
    acceptance_5t: '每個動作皆產生 Post-Execution Trace，確保持 Trackable。',
    design_image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    journey: 'Governance Assurance',
    page_id: 'vault',
    title: '證據金庫 Vault',
    path: '/vault',
    permission: 'ALL_USERS',
    core_purpose:
      '證據金庫是 ESG GO 平台所有佐證文件（如電費單、ISO 證書、採購合約）的加密儲存與查核中心，是支撐平台「可信度」的最底層防線。',
    ux_experience:
      '使用者將 PDF 拖入區塊瞬間，系統亮起綠色的 ZKP Verified 與專屬 Hash 碼，建立零摩擦的信任。',
    ui_rwd: '採用「檔案總管型表格」佈局，行動端轉化為堆疊式資料卡片。',
    data_api: '使用 Web Crypto API 計算 SHA-256 Hash，實體檔案上傳至 Supabase Storage。',
    edge_cases: '重複檔案阻斷上傳並提示建立關聯，ZKP 驗證失敗立即標記為紅燈警報。',
    acceptance_5t:
      'T1-T5 全面實踐：具體化 Hash 值、追溯來源、追蹤生命週期、透明展示、不可篡改保證。',
    design_image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 5,
    journey: '5T Trust Dashboard',
    page_id: '5t-dashboard',
    title: '5T 信任儀表板',
    path: '/5t-dashboard',
    permission: 'ADMIN, CSO, PM',
    core_purpose:
      '提供 ESG GO 系統對「可信度五大原則 (5T Protocol)」的即時合覧總覽，確保所有 ESG 數據與報告的完整性、可追溯性與透明度。',
    ux_experience: 'CSO 登入看到五個核心 5T 指標卡片綠燈狀態，可點擊鑽取詳細合覧紀錄與數據來源。',
    ui_rwd: '採用「五宮格卡片佈局」作為頂部概覽區，行動端堆疊為垂直列表。',
    data_api: '從 ESG GO 系統的各個模組（evidence_vault、audit_logs 等）撈取合覧狀態與事件數據。',
    edge_cases: '1000+ 筆合覧紀錄需虛擬化滾動不卡頓，T5 Hash 不符必在 5 秒內轉紅燈。',
    acceptance_5t:
      'T1 Tangible：GRI 覆蓋率矩陣；T2 Traceable：數據溯源路徑圖；T3 Trackable：合覧事件時間軸；T4 Transparent：AI 透明度分數；T5 Trustworthy：SHA-256 Hash 監控。',
    design_image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 6,
    journey: 'AI Governance',
    page_id: 'agents',
    title: 'ESG AI Agents',
    path: '/agents',
    permission: 'PM, ADMIN, USER',
    core_purpose:
      '作為企業永續報告的智慧協作夥伴，透過自動化數據分析、內容生成與合覧檢查，提升效率與準確性。',
    ux_experience: 'PM 點擊「數據洞察」按鈕，AI Agent 生成關於碳排放熱點的視覺化報告與建議。',
    ui_rwd: '主內容區 + 右側 AI Agent 互動面板，行動端收合為右下角懸浮 FAB。',
    data_api: '從 esg_data_points、report_drafts、evidence_vault 讀取數據，寫入 agent_insights。',
    edge_cases: '回覆內容過長自動換行保持可視；運算超過 10 秒顯示進度指示。',
    acceptance_5t: 'T1-T4：可追溯分析過程、透明模型來源、具體化數據洞察，不可出現幻覚資訊。',
    design_image:
      'https://images.unsplash.com/photo-1677442136019-2178fd29d6d6?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 7,
    journey: 'Report Writing',
    page_id: 'sustainwrite',
    title: 'SustainWrite 編輯器',
    path: '/editor',
    permission: 'PM, ADMIN',
    core_purpose:
      '提供 208 頁報告框架、佐證清單與 AI 合覧協作，幫助企業高效率產出符合 GRI/ISSB 標準的可信永續報告。',
    ux_experience:
      'PM 點擊「AI 擴寫」時，在 3 秒內生成合覧草稿，右側抽屜亮起該段落對應的電費單 PDF 縮圖。',
    ui_rwd: '左中右三欄佈局，採用 TipTap 編輯器核心，行動端左右欄收為漢堡選單與懸浮 FAB。',
    data_api:
      '編輯內容 Autosave 至 Supabase report_drafts 表，佐證文件關聯資訊儲存於 evidence_links 表。',
    edge_cases:
      '斷網切至離線暫存模式 (IndexedDB)，封印後手動修改必驗使 integrity_hash 驗證失敗報警。',
    acceptance_5t:
      'T1-T5：具體化報告框架、追溯佐證連結、追蹤版本紀錄、透明 AI 來源、Trustworthy Hash 封印。',
    design_image:
      'https://images.unsplash.com/photo-1555066931-4365d14babf6?auto=format&fit=crop&q=80&w=800',
  },
];

export default function WikiPage() {
  return <WikiClientPage pages={mockPages} />;
}

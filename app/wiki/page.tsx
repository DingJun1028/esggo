import React from 'react';
import WikiClientPage from './WikiClientPage';

export const metadata = {
  title: 'ESGGO Wiki | OmniCore',
  description: 'ESGGO System Architecture and 5T Governance Protocol',
};

// Mock data for wiki pages
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
    design_image: 'https://images.unsplash.com/photo-1633435165993-9c8e104f7621?auto=format&fit=crop&q=80&w=800'
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
    ui_rwd: '採用 CSS Grid 佈局，平板與手機自動降級為單欄或雙欄。',
    data_api: '透過 /api/omni-components 獲取數據，並由 OmniMemorySync 同步至前端。',
    edge_cases: '無數據時展示提示，數據過大時採用虛擬滾動 (Virtual Scrolling)。',
    acceptance_5t: '必須支援數據公式驗算 (Transparent)，且無法在前端篡改 (Trustworthy)。',
    design_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
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
    acceptance_5t: '每個動作皆產生 Post-Execution Trace，確保 Trackable。',
    design_image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800'
  }
];

export default function WikiPage() {
  return (
    <WikiClientPage pages={mockPages} />
  );
}

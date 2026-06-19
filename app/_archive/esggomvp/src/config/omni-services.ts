/**
 * 🗺️ Omni ESG Services - 24 MECE Matrix registry
 * 
 * Baser on the ESG (8+8+8) structure for total 24 services.
 */

export type ServiceStatus = 'ACTIVE' | 'BETA' | 'DEVELOPMENT' | 'PLANNED';
export type ESGDimension = 'E' | 'S' | 'G';

export interface IOmniService {
    id: string;
    name: string;
    nameZh: string;
    dimension: ESGDimension;
    status: ServiceStatus;
    route: string;
    description: string;
}

export const OMNI_SERVICES: IOmniService[] = [
    // --- Environment (E) ---
    { id: 'E1', name: 'Carbon Audit', nameZh: '碳盤存管理', dimension: 'E', status: 'ACTIVE', route: '/omni/carbon', description: 'ISO-14064 碳足跡盤查與熱點分析' },
    { id: 'E2', name: 'Impact Lab', nameZh: '影響修復實驗室', dimension: 'E', status: 'ACTIVE', route: '/omni/impact-lab', description: '實踐環境系統性治癒，學習生態復原力。' },
    { id: 'E3', name: 'Trend Engine', nameZh: '趨勢預測引擎', dimension: 'E', status: 'ACTIVE', route: '/omni/trends', description: '學習前瞻性風險預警與沙盤推演。' },
    { id: 'E4', name: 'Green Finance', nameZh: '綠色融資助手', dimension: 'E', status: 'ACTIVE', route: '/omni/finance', description: '學習資本市場永續對接與綠色金融工具。' },
    { id: 'E5', name: 'Eco-Health', nameZh: '生態共鳴實踐', dimension: 'E', status: 'ACTIVE', route: '/omni/eco-health', description: '自然共鳴律實踐與環境數據監控。' },
    { id: 'E6', name: 'Supply Chain', nameZh: '永續供應鏈', dimension: 'E', status: 'ACTIVE', route: '/omni/supply-chain', description: '供應鏈碳排追蹤與供應商 ESG 評比。' },
    { id: 'E7', name: 'Renewable Monitor', nameZh: '再生能源監測', dimension: 'E', status: 'ACTIVE', route: '/omni/renewables', description: '實時再生能源使用率與能源轉型進度。' },
    { id: 'E8', name: 'Circular Analytics', nameZh: '循環經濟分析', dimension: 'E', status: 'ACTIVE', route: '/omni/circular', description: '產品生命週期循環率與資源再生路徑。' },

    // --- Social (S) ---
    { id: 'S1', name: 'Impact Avatar', nameZh: '個人 ESG 儀表板', dimension: 'S', status: 'ACTIVE', route: '/omni/avatar', description: '學習視覺化自我表現與影響力建模。' },
    { id: 'S2', name: 'AI Mentor', nameZh: 'ESG 智能助手', dimension: 'S', status: 'ACTIVE', route: '/omni/mentor', description: 'Dr. Thoth 知識庫引導，解答深度理論。' },
    { id: 'S3', name: 'Daily Pulse', nameZh: '每日 ESG 簡報', dimension: 'S', status: 'ACTIVE', route: '/omni/daily', description: '每日感知全球趨勢，培養永續直覺。' },
    { id: 'S4', name: 'Trust Passport', nameZh: '誠信護照', dimension: 'S', status: 'ACTIVE', route: '/omni/passport', description: '建立個人 ESG 信任徽章，成就「知識資產」化。' },
    { id: 'S5', name: 'Agent Forge', nameZh: 'AI 代理鍛造廠', dimension: 'S', status: 'ACTIVE', route: '/omni/agent-forge', description: '王道阿丹 親授，學習創建自主任務代理。' },
    { id: 'S6', name: 'Task Matrix', nameZh: '任務矩陣', dimension: 'S', status: 'ACTIVE', route: '/omni/tasks', description: '學習管理任務優先級與複雜系統調度。' },
    { id: 'S7', name: 'Smart Notify', nameZh: '智能通知系統', dimension: 'S', status: 'ACTIVE', route: '/omni/notify', description: '個人化訊息推送，學習行為分析與反饋機制。' },
    { id: 'S8', name: 'Impact Village', nameZh: '永續聚落', dimension: 'S', status: 'ACTIVE', route: '/omni/village', description: '連結多元利益相關者之永續共鳴網。' },

    // --- Governance (G) ---
    { id: 'G1', name: 'Org Health', nameZh: '企業健康檢查', dimension: 'G', status: 'ACTIVE', route: '/omni/health', description: '系統性診斷企業風險，學習組織治理指標。' },
    { id: 'G2', name: 'Refactor Coach', nameZh: '永續轉型顧問', dimension: 'G', status: 'ACTIVE', route: '/omni/refactor', description: '商業模式重構教學，將 ESG 嵌入核心獲利。' },
    { id: 'G3', name: 'Report Forge', nameZh: '自動化報告生成', dimension: 'G', status: 'ACTIVE', route: '/omni/report-forge', description: '學習符合 GRI/SASB 標準的結構化敘事。' },
    { id: 'G4', name: 'Evidence Vault', nameZh: '不可篡改證據庫', dimension: 'G', status: 'ACTIVE', route: '/omni/evidence', description: '實作 SHA-256 鎖定，學習數位誠信架構。' },
    { id: 'G5', name: 'Compliance Monitor', nameZh: '合規風險監控', dimension: 'G', status: 'ACTIVE', route: '/omni/compliance', description: '實時監測法規變更，學習動態合規機制。' },
    { id: 'G6', name: 'Board Board', nameZh: '董事會儀表板', dimension: 'G', status: 'ACTIVE', route: '/omni/board', description: '高階管理層決策支援，學習治理決策權重。' },
    { id: 'G7', name: 'AI Strategy', nameZh: 'AI 策略中心', dimension: 'G', status: 'ACTIVE', route: '/omni/strategy', description: '學習 AI 驅動的數據洞察與決策邏輯。' },
    { id: 'G8', name: '5T Seal', nameZh: '5T 協議鎖定', dimension: 'G', status: 'ACTIVE', route: '/omni/5t-seal', description: '全域 5T 數據簽核與資產化鎖定中心。' },
];

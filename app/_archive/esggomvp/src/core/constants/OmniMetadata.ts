/**
 * 🏛️ OmniMetadata: Universal UUID Function Matrix Definitions
 * Version: 1.6.0 · 核心基準: 5T 數位永續協議
 */

export enum OmniAssetTag {
    // 1. Cognitive
    IDENTITY_PROFILE = "Identity_Profile",
    INTELLIGENCE_CORE = "Intelligence_Core",
    NOTE_DAILY = "Note_Daily",
    KNOWLEDGE_ATOM = "Knowledge_Atom",
    GNOSIS_PREDICTION = "Gnosis_Prediction",

    // 2. Excellence
    AUDIT_CERTIFICATE = "Audit_Certificate",
    CLIMATE_INVENTORY = "Climate_Inventory",
    PROCESS_HEALING = "Process_Healing",
    CONTRACT_TRANSITION = "Contract_Transition",
    TRANSACTION_ASSET = "Transaction_Asset",

    // 3. Governance
    REPORT_FORGE = "Report_Forge",
    VAULT_EVIDENCE = "Vault_Evidence",
    IDENTITY_PASSPORT = "Identity_Passport",
    INTELLIGENCE_ALERT = "Intelligence_Alert",
    DECISION_CENTER = "Decision_Center",

    // 4. Agency
    SATELLITE_AGENT = "Satellite_Agent",
    PROCESS_MATRIX = "Process_Matrix",
    PROCESS_FLOW = "Process_Flow",
    NOTE_ALERT = "Note_Alert",
    KNOWLEDGE_STREAM = "Knowledge_Stream",
    CONTRACT_BRIDGE = "Contract_Bridge",
    TRANSACTION_UNIT = "Transaction_Unit",
    GOVERNANCE_ATOM = "Governance_Atom",
    ACHIEVEMENT_BADGE = "Achievement_Badge",
}

export interface IServiceMetadata {
    id: string;
    category: string;
    name: string;
    gate: string;
    definition: string;
}

export const OMNI_SERVICE_MATRIX: Record<OmniAssetTag, IServiceMetadata> = {
    [OmniAssetTag.IDENTITY_PROFILE]: { id: "1.1", category: "Cognitive", name: "個人 ESG 儀表板", gate: "Tangible", definition: "用戶數位分身之初次共鳴點。" },
    [OmniAssetTag.INTELLIGENCE_CORE]: { id: "1.2", category: "Cognitive", name: "AI 策略中心", gate: "Transparent", definition: "決策權重之邏輯封裝。" },
    [OmniAssetTag.NOTE_DAILY]: { id: "1.3", category: "Cognitive", name: "每日 ESG 簡報", gate: "Trackable", definition: "外部環境波動之時空錨點。" },
    [OmniAssetTag.KNOWLEDGE_ATOM]: { id: "1.4", category: "Cognitive", name: "ESG 智能助手", gate: "Traceable", definition: "智慧對話之精確索引。" },
    [OmniAssetTag.GNOSIS_PREDICTION]: { id: "1.5", category: "Cognitive", name: "趨勢預測引擎", gate: "Transparent", definition: "未來概率之數學建模。" },

    [OmniAssetTag.AUDIT_CERTIFICATE]: { id: "2.1", category: "Excellence", name: "企業健康檢查", gate: "Trustworthy", definition: "組織治理之數位體檢證明。" },
    [OmniAssetTag.CLIMATE_INVENTORY]: { id: "2.2", category: "Excellence", name: "碳盤存管理", gate: "Transparent", definition: "Scope 1-3 排放量之物理真實數據。" },
    [OmniAssetTag.PROCESS_HEALING]: { id: "2.3", category: "Excellence", name: "影響修復實驗室", gate: "Trackable", definition: "環境治理之生命週期記錄。" },
    [OmniAssetTag.CONTRACT_TRANSITION]: { id: "2.4", category: "Excellence", name: "永續轉型顧問", gate: "Traceable", definition: "商業模式重定義之合約副本。" },
    [OmniAssetTag.TRANSACTION_ASSET]: { id: "2.5", category: "Excellence", name: "綠色融資助手", gate: "Trustworthy", definition: "永續資本之流動憑證。" },

    [OmniAssetTag.REPORT_FORGE]: { id: "3.1", category: "Governance", name: "自動化報告生成", gate: "Tangible", definition: "符合國際標準之結構化報告。" },
    [OmniAssetTag.VAULT_EVIDENCE]: { id: "3.2", category: "Governance", name: "不可篡改證據庫", gate: "Trustworthy", definition: "SHA-256 鎖定之原始證據流。" },
    [OmniAssetTag.IDENTITY_PASSPORT]: { id: "3.3", category: "Governance", name: "誠信護照", gate: "Traceable", definition: "用戶於系統之跨域信任徽章。" },
    [OmniAssetTag.INTELLIGENCE_ALERT]: { id: "3.4", category: "Governance", name: "合規風險監控", gate: "Trackable", definition: "法規變動之動態回應日誌。" },
    [OmniAssetTag.DECISION_CENTER]: { id: "3.5", category: "Governance", name: "董事會儀表板", gate: "Transparent", definition: "高階治理之透明權力矩陣。" },

    [OmniAssetTag.SATELLITE_AGENT]: { id: "4.1", category: "Agency", name: "AI 代理鍛造廠", gate: "Traceable", definition: "自主代理之誕生證書。" },
    [OmniAssetTag.PROCESS_MATRIX]: { id: "4.2", category: "Agency", name: "任務矩陣", gate: "Trackable", definition: "系統調度之熵值報告。" },
    [OmniAssetTag.PROCESS_FLOW]: { id: "4.3", category: "Agency", name: "智能工作流", gate: "Transparent", definition: "自動化流程之節能腳印。" },
    [OmniAssetTag.NOTE_ALERT]: { id: "4.4", category: "Agency", name: "智能通知系統", gate: "Tangible", definition: "用戶行為之即時感知回饋。" },
    [OmniAssetTag.KNOWLEDGE_STREAM]: { id: "4.5", category: "Agency", name: "虛擬永續講師", gate: "Traceable", definition: "動態教學之知識流。" },
    [OmniAssetTag.CONTRACT_BRIDGE]: { id: "4.6", category: "Agency", name: "跨平台連結器", gate: "Trustworthy", definition: "跨鏈數據映射之公證合約。" },
    [OmniAssetTag.TRANSACTION_UNIT]: { id: "4.7", category: "Agency", name: "智慧永續商城", gate: "Trustworthy", definition: "影響力價值之交換媒介。" },
    [OmniAssetTag.GOVERNANCE_ATOM]: { id: "4.8", category: "Agency", name: "永續社群治理", gate: "Transparent", definition: "去中心化共識之投票證明。" },
    [OmniAssetTag.ACHIEVEMENT_BADGE]: { id: "4.9", category: "Agency", name: "永續影響力競賽", gate: "Tangible", definition: "遊戲化學習之戰果實體化。" },
};

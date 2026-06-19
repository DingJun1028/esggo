/**
 * 🗺️ Omni ESG Reports - Universal Module Registry (The Compass)
 * 
 * 基於「完美開發範式 - 1. 定義 (Definition)」
 * 所有服務項目在此註冊唯一的 UUID 與路徑，確保：
 * 1. 權限管控的一致性
 * 2. 路由對應不脫位
 * 3. NCBDB 資料庫的 Schema 綁定
 */

export interface IOmniModule {
    domain: 'Hub' | 'Core' | 'Adv' | 'Comm';
    name: string;
    uuid: string;
    route: string;
    description: string;
    status: 'ACTIVE' | 'DEVELOPMENT' | 'PLANNED';

    // --- 萬能優化擴展 (Omni Optimization Extensions) ---
    uiux?: string;              // 畫面重現與視覺細節 (Liquid Glass, Animations)
    businessLogic?: string;     // 核心業務代碼與演算邏輯
    narrative?: string;         // 敘事風骨與文本調性 (英碼繁博)
    teachingGuide?: string;     // 服務即教學：引導使用者成長的路徑
    serviceImpl?: string;       // 實際技術實作與依賴 (Typst, OCR, 5T)
    acceptanceCriteria?: string; // 驗收項目與 5T 合規指標
}

/**
 * 核心服務項目 UUID 對照表
 */
export const OMNI_MODULES: Record<string, IOmniModule> = {
    // --- Hub 層級 (入口與總攬) ---
    OMNI_HUB: {
        domain: 'Hub',
        name: 'ESG Omni Hub',
        uuid: 'mod-omni-hub-0000',
        route: '/omni',
        description: 'ESG Go # 善向永續報告中心入口與全局導航 (Liquid Glass 首頁)',
        status: 'ACTIVE',
        uiux: 'Liquid Glass 液態玻璃質感，12 欄網格佈局，動態 5T 能量環。',
        businessLogic: '全局路由分發，Agent 狀態監控，5T 協議合規性預檢。',
        narrative: '「萬能起點」：所有永續旅程的入口，連結知識與資產的轉運站。',
        teachingGuide: '新手引導：透過「初次共鳴」流程，引導用戶建立數位主體性。',
        serviceImpl: 'Next.js App Router, Framer Motion, OmniOne.mcp。',
        acceptanceCriteria: '首頁加載 < 800ms，5T 指標面板即時更新，無導航死角。'
    },
    SOVEREIGN_DASHBOARD: {
        domain: 'Hub',
        name: 'Sovereign Mentor Dashboard',
        uuid: 'mod-omni-hub-0002',
        route: '/dashboard',
        description: '智遠導師戰略儀表板：整合 5T 協議、24 項服務與 Karma Engine 診斷。',
        status: 'ACTIVE',
        uiux: '便當盒佈局 (Bento Box)，Aurora 青調色盤，微縮 3D 地球全息投影。',
        businessLogic: '複合資料聚合，六德屬性即時演算，果因協議修復進度追蹤。',
        narrative: '「戰略高地」：一眼洞察全局，掌握永續核心，執行高維度決策。',
        teachingGuide: '策略引導：Dr. Thoth 隨侍在側，解釋每一項指標背後的永續本質。',
        serviceImpl: 'DashboardCore, HealthMonitor, RPG-Engine 整合。',
        acceptanceCriteria: '24 項服務狀態正確對齊；六德雷達圖渲染無誤；5T 誠信指標 A+。'
    },
    REPORT_LOBBY: {
        domain: 'Hub',
        name: 'Five Chambers Lobby (永續五室大廳)',
        uuid: 'mod-omni-hub-0003',
        route: '/omni/reports/lobby',
        description: 'ESG Go # 善向永續報告中心的神聖入口：五室 Bento Box 佈局，依 5T 協議映射五大功能室。',
        status: 'ACTIVE',
        uiux: 'Liquid Glass 大廳，五室九宮格 Bento Box，Hover 觸發 5T 符文光暈，Aqua/金/綠色彩分層。',
        businessLogic: '門廊路由分發：點擊各室卡片即導航至對應功能模組；5T 合規狀態即時顯示。',
        narrative: '「聖殿入口」：所有永續數據煉金之旅的起點，將原始資料轉化為不可篡改永恆資產的流程樞紐。',
        teachingGuide: '儀式教學：每進入一個室，引導使用者理解對應的 5T 協議維度（可感知→不可篡改）。',
        serviceImpl: 'Next.js App Router, Framer Motion, LiquidGlass CSS。',
        acceptanceCriteria: '五室卡片全部可點擊，Hover 動效 < 200ms，麵包屑路徑清晰顯示。'
    },
    REPORTS_CENTER: {
        domain: 'Hub',
        name: 'ESG Reports Center',
        uuid: 'mod-omni-hub-0001',
        route: '/omni/reports',
        description: '負責收納與派發 200 種報告的總樞紐',
        status: 'ACTIVE',
        uiux: '網格卡片佈局，支援多維度篩選 (GRI, SASB, TCFD)，對應 5T 狀態標籤。',
        businessLogic: '報告生命週期管理：從 Draft 到 Trustworthy 的狀態機轉換與 Hash 鎖定。',
        narrative: '「知識圖書館」：收納全球永續真理，將繁雜數據轉化為結構化報告資產。',
        teachingGuide: '導引協助：精靈主動建議適合的報告框架，引導使用者掌握國際法規要求。',
        serviceImpl: 'ReportService, OmniReportForge, PDFGenerator。',
        acceptanceCriteria: '報告生成成功率 > 99%；SHA-256 證據鏈可隨時驗算；支援多格式導出。'
    },

    // --- Core 層級 (核心永續數據) ---
    METRICS_DASHBOARD: {
        domain: 'Core',
        name: 'ESG Metrics Dashboard',
        uuid: 'mod-omni-core-0001',
        route: '/omni/metrics',
        description: '核心環境、社會、治理指標儀表板',
        status: 'ACTIVE',
        uiux: 'Bento Box 佈局，核心數據卡片，支援動態推播與告警閃爍。',
        businessLogic: '即時數據聚合 (Real-time Aggregation)，多維度交叉分析，趨勢演算。',
        narrative: '「誠信之鏡」：映照出組織最真實的永續現狀，讓每一分努力都清晰可見。',
        teachingGuide: '指標導引：引導使用者理解 GRI 指標與組織關鍵績效的連結邏輯。',
        serviceImpl: 'MetricService, AggregatorEngine, NotificationCenter。',
        acceptanceCriteria: '數據更新延遲 < 1s；支援多設備響應式展示；5T 標記完整。'
    },
    CARBON_FOOTPRINT: {
        domain: 'Core',
        name: 'Carbon Footprint',
        uuid: 'mod-omni-core-0002',
        route: '/omni/carbon',
        description: 'ISO-14064 碳足跡盤查與熱點分析',
        status: 'ACTIVE',
        uiux: '動態碳中和熱圖，排放源結構圓餅圖，自動換算計算器。',
        businessLogic: 'Scope 1, 2, 3 自動分類與排放因子檢索邏輯。',
        narrative: '「碳觀其變」：掌握碳排放的每一個細微流動，開啟減碳轉型的智慧之路。',
        teachingGuide: '盤查導引：教導用戶如何收集符合 ISO 標準的原始數據，並理解係數來源。',
        serviceImpl: 'CarbonCalcEngine, EmissionFactorStore, ActivityDataLog。',
        acceptanceCriteria: '計算公式符合國際標準；熱點分析正確率 100%；支援歷史趨勢對照。'
    },
    SUSTAINABILITY_REPORTS: {
        domain: 'Core',
        name: 'Sustainability Reports',
        uuid: 'mod-omni-core-0003',
        route: '/omni/sustainability-reports',
        description: '永續報告書編製與產出',
        status: 'ACTIVE',
        uiux: '書卷式導航流程，即時協作註記，進度環狀圖展示。',
        businessLogic: '多準則合規檢查 (Compliance Checker)，節章自動編排演算法。',
        narrative: '「永續敘事」：將數據編織成動人的故事，向世界宣告組織的誠信承諾。',
        teachingGuide: '撰寫導引：引導使用者學習如何建立實質性分析矩陣，掌握報告核心。',
        serviceImpl: 'ReportDraftingEngine, ComplianceValidator, AssetManager。',
        acceptanceCriteria: '支援 GRI/SASB 自動檢查；多人在線衝突解決；產出格式符合排版美學。'
    },

    // --- Adv 層級 (進階智能決策) ---
    AGENTIC_TWIN: {
        domain: 'Adv',
        name: 'Agentic Twin (AI)',
        uuid: 'mod-adv-twin-0001',
        route: '/omni/agentic-twin',
        description: 'AI 雙棲決策輔助引擎',
        status: 'ACTIVE',
        uiux: '雙棲分屏設計，即時模擬動態，六德權重滑桿。',
        businessLogic: '決策矩陣即時演算，分身屬性與 ESG 事件共鳴模擬。',
        narrative: '「另一個你」：在虛擬時空中預演決策後果，達成風險最小化與價值最大化。',
        teachingGuide: '模擬導引：引導使用者學習如何在多元利益相關者衝突中，找到永續平衡點。',
        serviceImpl: 'AgenticTwinService, RPG-Engine, DecisionValidator。',
        acceptanceCriteria: '模擬結果與六德權重高度相關；導出決策報告支援 5T 驗證。'
    },
    BI_ANALYTICS: {
        domain: 'Adv',
        name: 'BI Analytics',
        uuid: 'mod-adv-bi-0001',
        route: '/omni/bi-analytics',
        description: '高階商業智慧與風險預測',
        status: 'ACTIVE',
        uiux: '4D 數據玻璃表格 (OmniTable)，多維趨勢圖表，風險閃爍警示。',
        businessLogic: '異常數據自動偵測，趨勢外推預測模型，供應鏈風險評等。',
        narrative: '「洞察未來」：穿透海量數據的迷霧，精煉出具備商業價值的永續洞察。',
        teachingGuide: '數據解讀：教導使用者如何從趨勢圖中辨識轉型風險與綠色機遇。',
        serviceImpl: 'OmniAnalyticsEngine, BusinessIntelService, Chart.js/Recharts。',
        acceptanceCriteria: '大數據加載流暢 (Virtual Scroll)；風險預警準確率 > 90%。'
    },

    // --- Comm 層級 (生態系與社群) ---
    IMPACT_VILLAGE: {
        domain: 'Comm',
        name: 'Impact Village',
        uuid: 'omni-village-006',
        route: '/omni/impact-village',
        description: '永續影響力聚落，連結多元利益相關者。',
        status: 'ACTIVE',
        uiux: '沉浸式聚落地術，互動式 NPC 精靈，節氣變換場景動效。',
        businessLogic: '社群互動事件流，影響力勳章分發，節能降耗競賽排名。',
        narrative: '「善向社區」：連結每一個微小的力量，共建共創共生，實現集體永續價值發揮。',
        teachingGuide: '社群學習：引導用戶在互動中學習 ESG 共融概念，提升社會責任感。',
        serviceImpl: 'OmniVillageService, OmniCommunityHub, Socket.io (未來)。',
        acceptanceCriteria: '角色互動流暢；成就同步及時；5T 影響力證明可見。'
    },
    RESOURCE_CENTER: {
        domain: 'Adv',
        name: 'Resource Center',
        uuid: 'omni-resource-007',
        route: '/omni/resource-center',
        description: '萬能永續資源中心，收錄全球 10 年分報告與法規庫。',
        status: 'ACTIVE',
        uiux: '多層次檢索介面，PDF 即時預覽窗格，Liquid Glass 懸浮按鈕導航。',
        businessLogic: '全球法規 API 對接，異步文件流下載，資源相關性推薦演算法。',
        narrative: '「全球視野」：站立於巨人的肩膀，透過歷史數據與現行法規尋找永續靈感。',
        teachingGuide: '研究引導：提供「原始來源」按鈕，教導使用者如何溯源金管會或歐盟標準。',
        serviceImpl: 'OmniResourceService, SustainabilityLibraryDB, Fetch/Axios。',
        acceptanceCriteria: 'PDF 下載流穩定；外部連結 100% 可達；搜尋延遲 < 300ms。'
    },
    WUZUO_NOTE: {
        domain: 'Core',
        name: 'Wuzuo Stratagem (無作妙計)',
        uuid: 'mod-agc-draft-0001',
        route: '/omni/wuzuo-note',
        description: '無作妙計系統：自動化草稿存檔與靈感激發中心。',
        status: 'ACTIVE',
        uiux: '極簡禪心介面，自動保存提示，液態邊欄切換。',
        businessLogic: '自動攔截靈感流，執行 SHA-256 誠信備份，禁止已封印內容修改。',
        narrative: '「無作妙德」——隨手而記，自動成章，將靈感轉化為永續資產。',
        teachingGuide: '引導用戶養成隨時記錄 ESG 隨想的習慣，解鎖「思維者」成就。',
        serviceImpl: 'OmniWuzuoNoteService, crypto, LocalStorage/NCBDB 同步。',
        acceptanceCriteria: '筆記產出後 1s 內完成 Hash 鎖定，同步成功率 100%。'
    },
    INTEGRATION_CENTER: {
        domain: 'Core',
        name: 'Omni Integration Center',
        uuid: 'mod-omni-core-0005',
        route: '/omni/integration',
        description: '萬能集成中心：內外部 API 與數據源監控樞紐。',
        status: 'ACTIVE'
    },
    LEARNING_ALCHEMY: {
        domain: 'Core',
        name: 'Learning Alchemy',
        uuid: 'mod-omni-alchemy-0001',
        route: '/omni/alchemy',
        description: '學習 Alchemy：10等階級與成就系統，將 ESG 知識轉化為數位資產。',
        status: 'ACTIVE',
        uiux: '鍊金術風格 UI，動態火焰粒子效果，成就徽章 3D 展示。',
        businessLogic: '經驗值與等級轉換公式，成就觸發監聽器，資產鑄造合約。',
        narrative: '「知識煉金」：將枯燥的數據轉化為璀璨的數位資產與成長階梯。',
        teachingGuide: '成長路徑：引導用戶完成挑戰任務，實現從「覺知者」到「卓越導師」的進化。',
        serviceImpl: 'AlchemyEngine, AchievementsData, OmniVillageService。',
        acceptanceCriteria: '等級計算精準；成就達成後 2s 內彈出通知；5T 資產標記無誤。'
    },
    OMNI_FORGE: {
        domain: 'Adv',
        name: 'Omni Forge (技能修煉場)',
        uuid: 'mod-adv-forge-0001',
        route: '/omni/forge',
        description: '將知識熔煉為資產，開啟靈知進化之路。',
        status: 'ACTIVE',
        uiux: 'LiquidGlass 高階毛玻璃，動態 5T 進度條，漫畫分鏡敘事排版。',
        businessLogic: '成就打磨、解鎖與 5T 誠信原子 (Achievement Atom) 封裝。',
        narrative: '「服務即教學」：透過修煉過程，讓使用者沉浸學習 ESG 知識。',
        teachingGuide: '教學對局：讓使用者透過解鎖成就，體驗影響力的具象化轉變。',
        serviceImpl: 'OmniAchievementAtom, Framer Motion, OmniComicStrip, LiquidGlass。',
        acceptanceCriteria: '原子 UUID 成功綁定證據鏈；鑄造動畫流暢；即時獲得資產。'
    },
    ONE_CLICK_DRAFT: {
        domain: 'Adv',
        name: 'Omni One-Click Draft',
        uuid: 'mod-adv-draft-0001',
        route: '/omni/one-click-draft',
        description: '一鍵底稿生成引擎：整合 OCR、數位分身對話與 Typst 渲染技術重構。',
        status: 'DEVELOPMENT',
        uiux: 'LiquidGlass 高階毛玻璃上傳視窗，即時 5T 進度條，對話實錄卡片排版。',
        businessLogic: 'OCR 數據解構 -> 數位分身共鳴對話 -> Typst DSL 編譯 -> 5T 誠信原子封裝。',
        narrative: '「服務即教學」：透過底稿完成過程，讓使用者學習 ESG 指標與分身決策邏輯。',
        teachingGuide: '教學對局：讓使用者觀看精靈與分身的對話，理解碳排放背後的「智、仁、勇」取捨。',
        serviceImpl: 'OneClickDraftOrchestrator, TypstGenerator, OCRBrain, OmniOne.manifest。',
        acceptanceCriteria: '產出 .typ 底稿語法正確；原子 UUID 成功綁定證據鏈；Wuzuo Note 同步完成。'
    },
    MILESTONES: {
        domain: 'Adv',
        name: 'Transformation Milestones',
        uuid: 'mod-adv-milestone-0001',
        route: '/omni/milestones',
        description: '永續轉型里程碑與甘特圖路徑：追蹤 OKR 與 5T 協議落實時序。',
        status: 'ACTIVE',
        uiux: 'Interactive Gantt v2.0，10-Color Element Laws 映射，Liquid Glass 容器。',
        businessLogic: '甘特圖時序邏輯，任務狀態機 (Completed/Active/Planned/Critical)，5T 成就解鎖。',
        narrative: '「進化階梯」：清晰呈現從現狀到理想永續終態的每一級進化階梯。',
        teachingGuide: '路徑引導：教導使用者如何規劃長期的永續轉型計畫，並將其拆解為可執行的里程碑。',
        serviceImpl: 'GanttChart, MilestoneService, OmniOKR 整合。',
        acceptanceCriteria: '里程碑時間軸準確無誤；任務狀態即時同步；Element 顏色映射符合哲學規範。'
    }
};

export const getModuleByUuid = (uuid: string): IOmniModule | undefined => {
    return Object.values(OMNI_MODULES).find(mod => mod.uuid === uuid);
};

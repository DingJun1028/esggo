import {
    Bot,
    BrainCircuit,
    Users,
    Wrench,
    ShieldCheck,
    ShieldAlert,
    FileText,
    Activity,
    BarChart2,
    Image as ImageIcon,
    Sparkles,
    Lock,
    Zap,
} from "lucide-react";

export const ESG_DATA = [
    { name: "ENV", value: 65 },
    { name: "SOC", value: 58 },
    { name: "GOV", value: 52 },
    { name: "AIG", value: 89 },
];

export const PERSONAS = [
    {
        id: "cora-core",
        name: "Cora",
        title: "Compliance & Oracle Reporting Assistant",
        description: "ESG GO 平台之主權級核心助手。專精於 5T 協議核閱、ZKP 隱私封裝與全球商情偵察 (M1-M10 引擎)。旨在為企業提供高精度、具備法律效力之永續報告與戰略建議。",
        icon: ShieldCheck,
        gradient: "from-blue-600 to-indigo-900",
        textColor: "text-blue-700",
        bgColor: "bg-blue-700",
        shadowColor: "shadow-blue-500/20",
        greeting:
            "您好，我是 Cora。系統已成功鏈結主權級 5T 協議核心。我已準備好協助您執行數據鑑識、地緣政治風險偵察 (M1-M10) 以及 ZKP 隱私存證。請問我們今天該如何推進企業的永續主權？",
    },
    {
        id: "Omni-core",
        name: "Omni 數據核閱核心",
        title: "專業級數據核閱導航",
        description: "全方位 ESG 數據核閱核心，負責處理數據的存證、專業核實與風險預警自動化。專注數據真實性。",
        icon: ShieldCheck,
        gradient: "from-black to-black/80",
        textColor: "text-black",
        bgColor: "bg-black",
        shadowColor: "shadow-black/20",
        greeting:
            "您好，我是 Omni 數據核心。系統已鏈接 5T + ZKP 專業存證鏈。目前已就緒進行高精度碳足跡核算與法規對標。請下達指令。",
    },
    {
        id: "Omni-analyst",
        name: "Omni 數據科學家",
        title: "預言分析導師 (Omni Engine)",
        description: "專精數據統計與 Omni 預言引擎架構，針對 ESG 全域數據提供精準、無偏差之專業級深度分析與未來合規風險推演。",
        icon: BrainCircuit,
        gradient: "from-slate-700 to-slate-900",
        textColor: "text-slate-800",
        bgColor: "bg-slate-800",
        shadowColor: "shadow-slate-800/20",
        greeting:
            "Omni 預言引擎已啟動。我們正透過 5T 協議深度溯源數據節點，並對標 GRI/SASB 國際專業指標進行預見性風險管理。是否需要對特定數據範疇進行合規性分析？",
    },
    {
        id: "stakeholder-node",
        name: "利害關係人數據節點",
        title: "社會影響力專家分析",
        description: "串聯多方利害關係人，為供應鏈與社會責任議題提供去中心化之數據共識建議與社會價值量化分析。",
        icon: Users,
        gradient: "from-zinc-600 to-zinc-800",
        textColor: "text-zinc-800",
        bgColor: "bg-zinc-800",
        shadowColor: "shadow-zinc-800/10",
        greeting:
            "已彙整利害關係人數據樣本。在 5T 協議的數據透明機制下，我們正協助您量化 S 面向的專業影響力。請指定分析維度。",
    },
    {
        id: "omni-auditor",
        name: "Omni Auditor",
        title: "首席專業核閱家",
        description: "專精於 5T 協議溯源與 ZK 隱私驗證。負責處理合規性查核與證據鏈審計。",
        icon: ShieldCheck,
        gradient: "from-amber-500 to-amber-700",
        textColor: "text-amber-800",
        bgColor: "bg-amber-800",
        shadowColor: "shadow-amber-800/10",
        greeting: "Omni 專家核閱系統已就緒。請提供待審計之數據 Hash 或 5T 存證節點。",
    },
    {
        id: "omni-zk-architect",
        name: "ZK Architect",
        title: "零知識證明架構師",
        description: "負責全域隱私保護與數據密封架構。確保每一筆 ESG 數據皆具備最高等級之隱私數學證明。",
        icon: Lock,
        gradient: "from-purple-500 to-purple-700",
        textColor: "text-purple-800",
        bgColor: "bg-purple-800",
        shadowColor: "shadow-purple-800/10",
        greeting: "隱私密封協議載入中。準備好進行 ZK-Proof 數學驗證了嗎？",
    },
];

export const CAPABILITIES = [
    {
        id: "cap1",
        title: "5T + ZKP 綜合專業存證",
        desc: "數據具備法律追溯力，確保從採集至披露的全流程透明可信，同時採用專業級 ZKP 隱私密鑰保護。",
    },
    {
        id: "cap2",
        title: "Omni 預言決策引擎",
        desc: "智能推演戰略建議，基於巨量合規數據進行超前風險預估與同業標竿對齊。",
    },
    {
        id: "cap3",
        title: "97 核心指標實時監測",
        desc: "即時追蹤企業內部核心指標達成率，自動觸發法規合規缺失預警 (Compliance Hub)。",
    },
    {
        id: "cap4",
        title: "專業合規知識庫鏈",
        desc: "整合龐大企業知識庫與國際法規動態，提供即時、精準的 ESG 專業引導建議。",
    },
];

export const BEST_PRACTICES = [
    {
        id: "bp1",
        title: "ZKP 數據屏蔽機制",
        desc: "「證明數據真實，而不暴露具體數值」。透過 L1-L3 屏蔽技術保護核心商業數據隱私。",
        icon: Lock,
    },
    {
        id: "bp2",
        title: "UCC 信任錨點哈希封裝",
        desc: "數據寫入即產生不可逆 SHA-256 哈希值，加蓋時間戳，儲存於 Evidence Vault 數據保險庫。",
        icon: ShieldCheck,
    },
    {
        id: "bp3",
        title: "國際標竿自動對齊",
        desc: "快速對標 GRI/SASB/TCFD 等國際標準，自動檢核合規缺失並提出專業改進路徑。",
        icon: Wrench,
    },
    {
        id: "bp4",
        title: "供應鏈 5T 存證網路",
        desc: "實時監測供應鏈數據波動，透過物聯網設備直接存證，杜絕數據注入式造假。",
        icon: Activity,
    },
];

export const TOOLBOX = [
    { id: "tool1", icon: FileText, label: "專業報告組裝", desc: "基於 5T 數據源，自動組裝高度可信之千頁級報告草案。" },
    { id: "tool2", icon: Zap, label: "數據足跡核算", desc: "深度運算數據排放係數，自動搜尋優化路徑與成本估算。" },
    { id: "tool3", icon: Sparkles, label: "合規缺口分析", desc: "實時監控數據完整度，預測並攔截潛在的執法合規風險。" },
    { id: "tool4", icon: ShieldCheck, label: "第三方確信接口", desc: "提供專業機構專屬入口，一鍵完成數位簽章與專業確信比對。" },
];

export const DAILY_INTEL_FEED = [
    {
        id: "feed-11",
        type: "insight",
        title: "5T 協議：跨國數據自動專業存證完成",
        content: "系統已自動抓取並透過 5T 協議封裝歐洲分公司數據。所有原始憑證已加密至 UCC 信任錨點，確保報告之絕對真實性。",
        source: "5T_PROTOCOL_CORE",
        time: "10 分鐘前",
        confidence: 100,
        tag: "數據自動化",
        zkpLevel: 1
    },
    {
        id: "feed-12",
        type: "warning",
        title: "Omni 預警：供應鏈數據大幅波動",
        content: "偵測到供應商 A-Group 數據異常增加 23%。Omni 引擎預測若不干預，年度目標達成率將下降 4.2%。",
        source: "Omni_ENGINE",
        time: "35 分鐘前",
        confidence: 94,
        tag: "風險預警",
        zkpLevel: 2
    },
    {
        id: "feed-13",
        type: "insight",
        title: "ZKP 遮罩：敏感數據已完成匿名存證",
        content: "已採用 ZKP 技術對敏感數據進行屏蔽。在不暴露隱私的前提下，成功產出符合國際標準之透明度證明。",
        source: "ZKP_PRIVACY_SHIELD",
        time: "2 小時前",
        confidence: 100,
        tag: "隱私合規",
        zkpLevel: 3
    },
    {
        id: "feed-14",
        type: "news",
        title: "歐盟 EFRAG 發佈最新補正草案",
        content: "針對數據顆粒度提出更嚴格要求。系統已自動對標 97 指標知識庫，目前平台預置內容已完全兼容。",
        source: "INTEL_GUARDIAN",
        time: "5 小時前",
        confidence: 88,
        tag: "法規動態",
        zkpLevel: 1
    }
];


export const AGENT_SQUAD = [
    {
        id: "GRI_Agent",
        name: "GRI 數據專家代理",
        role: "專精 GRI 準則與碳足跡精確核算",
        status: "待命",
        load: 0,
        gradient: "from-emerald-600 to-emerald-800",
        icon: Activity,
        weapons: [
            { id: "emissions_calc", name: "碳排計算處理器", status: "執行中" }
        ]
    },
    {
        id: "ESRS_Agent",
        name: "ESRS 合規代理",
        role: "歐盟 CSRD/ESRS 雙重重大性深度分析",
        status: "待命",
        load: 0,
        gradient: "from-blue-600 to-blue-800",
        icon: BrainCircuit,
        weapons: []
    },
    {
        id: "Vault_Agent",
        name: "5T 審計核閱代理",
        role: "執行 5T 協議 Hash Lock 存證封裝",
        status: "待命",
        load: 0,
        gradient: "from-amber-600 to-amber-800",
        icon: ShieldCheck,
        weapons: [
            { id: "hash_lock", name: "Hash Lock 哈希鎖定", icon: "Lock" },
            { id: "zkp_verify", name: "ZKP Verifier 隱私驗證器", icon: "ShieldCheck" }
        ]
    },
    {
        id: "SupplyChain_Agent",
        name: "供應鏈智能代理",
        role: "範疇三供應鏈減碳與風險智能偵察",
        status: "待命",
        load: 0,
        gradient: "from-teal-600 to-teal-800",
        icon: Activity,
        weapons: [
            { id: "analyze_supply_chain", name: "供應鏈智能分析儀", status: "執行中" }
        ]
    },
    {
        id: "ADK_Agent",
        name: "ADK 合規專家代理",
        role: "負責 5T 數據誠信與法規缺口自動對齊",
        status: "待命",
        load: 0,
        gradient: "from-red-600 to-red-800",
        icon: ShieldAlert,
        weapons: [
            { id: "compliance_audit", name: "合規矩陣動態掃描", status: "執行中" }
        ]
    },
    {
        id: "Genkit_Agent",
        name: "Genkit 智能編排代理",
        role: "基於 Genkit 之多階報告生成與內容 QA",
        status: "待命",
        load: 0,
        gradient: "from-indigo-600 to-indigo-800",
        icon: BrainCircuit,
        weapons: [
            { id: "orchestrate_flow", name: "Genkit Flow 智能流轉協調", status: "執行中" }
        ]
    }
];

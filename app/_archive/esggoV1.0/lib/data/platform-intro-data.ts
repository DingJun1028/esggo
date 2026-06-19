
export interface IntroSection {
    id: string;
    title: { zh: string; en: string };
    content: { zh: string; en: string };
    table?: {
        headers: string[];
        rows: string[][];
    };
    highlight?: string;
}

export const PLATFORM_INTRO_DATA: IntroSection[] = [
    {
        id: "positioning",
        title: { zh: "一、[ESG GO] 平台定位", en: "1. [ESG GO] Platform Positioning" },
        content: {
            zh: "[ESG GO] 不是單點工具，而是「報告生成 × 法遵治理 × 知識洞察 × 任務化執行 × 可驗證信任機制」的整合平台。\n\n[ESG GO] 是由善向永續開發的 AI 永續報告生成平台，目標是讓台灣企業——無論大中小微型——都能以更低成本、更高可信度，完成 ESG 永續揭露工作。\n\n它的核心主張只有一句話：\n「讓永續數據，像金融交易一樣透明可信。」",
            en: "[ESG GO] is not a single point tool, but an integrated platform of 'Report Generation x Compliance Governance x Knowledge Insight x Task-driven Execution x Verifiable Trust Mechanism'.\n\nDeveloped by Sunward Sustainability, [ESG GO] is an AI-driven sustainability report generation platform. Our goal is to enable Taiwanese enterprises—of all sizes—to complete ESG disclosures with lower costs and higher credibility.\n\nOur core proposition: 'Making sustainability data as transparent and trustworthy as financial transactions.'"
        }
    },
    {
        id: "market-timing",
        title: { zh: "二、背景與市場時機", en: "2. Background and Market Timing" },
        content: {
            zh: "為什麼是現在？",
            en: "Why now?"
        },
        table: {
            headers: ["關鍵趨勢", "說明"],
            rows: [
                ["法規強制", "2024 年起台灣金管會強制上市櫃公司 ESG 揭露"],
                ["全球資金", "全球 ESG 資產規模超過 $40 兆美元 (BloombergNEF 預測)"],
                ["信任危機", "78% 企業的 ESG 數據可信度不足，面臨「漂綠」質疑"],
                ["效率瓶頸", "傳統人工報告製作耗時 3-6 個月，錯誤率高且資料散亂"],
                ["中小企業需求", "台灣 150 萬家中小企業面臨供應鏈 ESG 壓力"]
            ]
        }
    },
    {
        id: "core-architecture",
        title: { zh: "三、核心架構：五層整合平台", en: "3. Core Architecture: Five-Layer Integrated Platform" },
        content: {
            zh: "教育層 ESG Literacy 知識入口（ESG Sunshine 品牌承載）\n↓\n顧問層 永續策略設計與輔導（人工 + AI 混合服務）\n↓\n平台層 InfoOne v8.1.0 操作介面（ESG GO 主系統）\n↓\n數據層 5T 協議 + Hash Lock + Evidence Vault\n↓\nAI 層 Gemini 2.0 自動報告生成引擎",
            en: "Education Layer: ESG Literacy Knowledge Portal\n↓\nConsulting Layer: Sustainability Strategy Design & Coaching (Human + AI Hybrid)\n↓\nPlatform Layer: InfoOne v8.1.0 Operational Interface (ESG GO Core System)\n↓\nData Layer: 5T Protocol + Hash Lock + Evidence Vault\n↓\nAI Layer: Gemini 2.0 Automated Report Generation Engine"
        }
    },
    {
        id: "three-pillars",
        title: { zh: "四、三大核心主軸", en: "4. Three Core Pillars" },
        content: {
            zh: "### 主軸一：AI 報告工廠\n- 千頁等級報告自動生成，效率提升 10 倍以上\n- 支援多標準對齊：GRI / SASB / TCFD / ISO 26000\n- 合規缺失自動偵測與即時預警\n- 智能索引自動組裝與資料一致性檢查\n- 輸出多元格式化工具（PDF / Word / Typst 精緻排版）\n\n### 主軸二：法規與治理中控\n- 台灣申報時程動態追蹤（金管會 / 環境部 / 經濟部）\n- 合規條文自動比對與差異分析\n- 確信機構資格驗證與數位簽章\n- 97 指標管理系統，缺失預警與績效看板\n- 碳盤查要求 / 能源管理法法律合規性對照\n\n### 主軸三：知識到行動引擎\n- 行業標竿案例學習資料庫與 AI 洞察\n- 一鍵擷取建議方案 → 任務化分派執行\n- 資料自動填充模板與歷程歸檔\n- 持續改善計畫 (PDCA) 閉環機制",
            en: "### Pillar 1: AI Report Factory\n- 10x+ efficiency in generating massive multi-hundred-page reports\n- Multi-standard alignment: GRI / SASB / TCFD / ISO 26000\n- Automated compliance gap detection & real-time alerts\n- Intelligent index assembly & data consistency checks\n- Multi-format output tools (High-quality PDF / Word / Typst rendering)\n\n### Pillar 2: Regulatory & Governance Center\n- Dynamic tracking of Taiwan filing schedules (FSC / MOENV / MOEA)\n- Automated compliance clause matching & gap analysis\n- Assurance agency qualification verification & digital signatures\n- 97-indicator management system with performance dashboards\n- Legal compliance cross-referencing for Carbon Inventory & Energy Management Acts\n\n### Pillar 3: Knowledge-to-Action Engine\n- Industry benchmarking database & AI-driven insights\n- One-click recommendation extraction → Task-driven assignment\n- Automated data-filling templates & historical archiving\n- Continuous improvement (PDCA) closed-loop mechanism"
        }
    },
    {
        id: "5t-protocol",
        title: { zh: "五、技術護城河：5T 協議", en: "5. Technical Moat: 5T Protocol" },
        content: {
            zh: "這是 ESG GO 最核心的競爭壁壘，也是競品最難複製的部分。",
            en: "This is the core competitive barrier of ESG GO, and the most difficult part for competitors to replicate."
        },
        table: {
            headers: ["T", "名稱", "說明"],
            rows: [
                ["T1", "可感知 Tangible", "數據狀態即時可視化"],
                ["T2", "可溯源 Traceable", "每筆數據有完整來源鏈"],
                ["T3", "可追蹤 Trackable", "數據修改歷程全程追蹤"],
                ["T4", "透明 Transparent", "開放查驗，無黑箱"],
                ["T5", "不可篡改 Trustworthy", "Hash Lock 封裝，任何篡改即驗證失敗"]
            ]
        },
        highlight: "技術實現：數據寫入 → UCC Engine 封裝 → 產生不可逆 Hash 值 → 時間戳加蓋 → 儲存至 Evidence Vault (永恆宮殿) → 第三方確信機構可完整追溯"
    },
    {
        id: "product-layers",
        title: { zh: "六、產品與服務分層", en: "6. Product and Service Layers" },
        content: {
            zh: "**A 層：合規與報告生產**\n- GRI / SASB / TCFD 支援\n- 五大核心工具：報告生成引擎、數據收集表單、指標計算器、合規檢查器、輸出格式化\n\n**B 層：法遵風控與申報管理**\n- 台灣三大法規框架：金管會強制揭露 / 環保署碳盤查 / 經濟部能源管理法\n- 97 指標追蹤\n- 缺失預警系統\n\n**C 層：情資與顧問賦能**\n- 行業標竿資料庫\n- AI 助手與任務管理\n- 認證輔導與信任保障機制",
            en: "**Level A: Compliance & Report Production**\n- GRI / SASB / TCFD support\n- 5 Core Tools: Generation engine, Data forms, Indicator calculator, Compliance checker, Output formatter\n\n**Level B: Legal Compliance & Filing Management**\n- Taiwan's 3 major frameworks: FSC Disclosure / MOENV Carbon / MOEA Energy\n- 97 Indicator tracking\n- Gap alert system\n\n**Level C: Intelligence & Consulting Empowerment**\n- Industry benchmarking database\n- AI Assistant & Task management\n- Certification coaching & Trust mechanisms"
        }
    },
    {
        id: "business-model",
        title: { zh: "七、商業模式", en: "7. Business Model" },
        content: {
            zh: "SaaS × 顧問，雙軌收入（傳統顧問一份報告 50-100 萬，我們 Basic 方案讓三位數月費就能起步）。",
            en: "SaaS x Consulting, dual-track revenue (Traditional consulting costs 0.5-1M per report; our Basic plan starts at a 3-digit monthly fee)."
        },
        table: {
            headers: ["方案", "目標用戶", "核心服務"],
            rows: [
                ["Basic", "中小企業", "自助報告生成"],
                ["Pro", "成長型企業", "AI 自動化 + 合規檢查"],
                ["Enterprise", "上市櫃公司", "全託管服務 + 顧問陪跑"]
            ]
        }
    },
    {
        id: "gamification",
        title: { zh: "八、ESG GO v3.0 遊戲化延伸", en: "8. ESG GO v3.0 Gamification Extension" },
        content: {
            zh: "### 善向永續村：讓永續變得可玩可成長\nESG GO 的延伸版本結合 RPG × TCG × 放置遊戲 × 永續學習，打造沉浸式體驗：",
            en: "### Sunward Village: Making Sustainability Playable\nExtension combined with RPG x TCG x Idle Game x Learning for an immersive experience:"
        },
        table: {
            headers: ["系統", "說明"],
            rows: [
                ["數位分身養成", "角色具備 E/S/G + 影響力屬性，可升級進化"],
                ["技能天賦樹", "三大路線：環境守護者 / 社會創新者 / 治理專家"],
                ["奧義書學習", "從基礎到專家的 ESG 知識系統"],
                ["萬能卡牌 TCG", "行動卡 / 資源卡 / 事件卡 / 人物卡"],
                ["村莊建置", "解鎖 ESG 學院、碳交易所等設施"]
            ]
        }
    },
    {
        id: "swot",
        title: { zh: "九、市場定位與競爭優勢", en: "9. Market Positioning & Competitive Advantage" },
        content: {
            zh: "### SWOT 優勢分析\n- **Strengths**: 完整產品線、台灣法規深度理解、5T 信任架構、AI 整合領先\n- **Weaknesses**: 產品文件收斂中、角色化體驗優化中\n- **Opportunities**: 2025 強制揭露全面上路、中小企業需求爆發\n- **Threats**: 國際大廠進場、免費工具衝擊",
            en: "### SWOT Analysis\n- **Strengths**: Full product line, deep TW regulatory insight, 5T trust framework, leading AI integration\n- **Weaknesses**: Document convergence in progress, role experience needs optimization\n- **Opportunities**: 2025 mandatory disclosure, SMB demand surge\n- **Threats**: International giants entering, free tool impacts"
        }
    },
    {
        id: "zkp-layer",
        title: { zh: "新增核心技術：ZK-Privacy Layer", en: "New Core Tech: ZK-Privacy Layer" },
        content: {
            zh: "「我可以向你證明這個數字是真的——但我不需要告訴你這個數字是多少。」\n\n零知識證明 (ZKP) 讓企業可以同時做到「完全揭露」和「完全隱私」。\n\n### 5T+ZKP 協議\n原本 5T 協議在加入 ZKP 之後，進化為：",
            en: "'I can prove this number is real—without telling you what it is.'\n\nZero-Knowledge Proof (ZKP) allows enterprises to achieve 'Full Disclosure' and 'Full Privacy' simultaneously.\n\n### 5T+ZKP Protocol\nThe 5T protocol evolves into 5T+ZKP with ZKP:"
        },
        table: {
            headers: ["T", "名稱", "ZKP 強化版"],
            rows: [
                ["T1", "可感知 Tangible", "顯示遮罩後的摘要值，原始數據不外洩"],
                ["T2", "可溯源 Traceable", "以 ZK-Proof 證明來源合法，不暴露細節"],
                ["T3", "可追蹤 Trackable", "歷程加密封存，以 ZK-Proof 驗證"],
                ["T4", "透明 Transparent", "結論透明，過程隱私保護"],
                ["T5", "不可篡改 Tamper-proof", "ZKP 加密 Hash，雙重防偽"],
                ["ZKP", "零知識可信", "可驗證但不可窺探，機密與合規並存"]
            ]
        }
    },
    {
        id: "masking",
        title: { zh: "去敏遮罩技術細節", en: "De-identification Masking Details" },
        content: {
            zh: "提供三級遮罩機制：\n- **L1 模糊化**: 薪資範圍、人數 (區間取代精確值)\n- **L2 假名化**: 員工人名、供應商 (替換為代碼)\n- **L3 不可逆**: 生物特徵、地址 (單向 Hash，符合 GDPR)\n\n動態規則引擎：根據查看者角色（董事會/稽核/公眾）決定顯示層次。",
            en: "3-Level Masking:\n- **L1 Fuzzy**: Salary range, headcount (Intervals)\n- **L2 Pseudo**: Names, Suppliers (Codes)\n- **L3 Irreversible**: Bio-features, Addresses (One-way Hash, GDPR compliant)\n\nDynamic Engine: Decides display level based on role (Board/Auditor/Public)."
        }
    },
    {
        id: "roadmap",
        title: { zh: "發展藍圖：18 個月路線圖", en: "Roadmap: 18-Month Plan" },
        content: {
            zh: "- **Q2 2026**: Beta 測試版上線，首批 10 家指標企業驗證，5T+ZKP 技術整合驗證完成\n- **Q3 2026**: 擴大政府補助與社創合作，取得 ISO 27001 資訊安全認證\n- **Q4 2026**: 正式商業化運轉，發布年度定價模型，SaaS 雙軌服務全面啟動\n- **Q1 2027**: 國際化拓展，將台灣成熟模型複製至東南亞與亞洲供應鏈節點",
            en: "- **Q2 2026**: Beta launch with 10 pilot enterprises; 5T+ZKP technical integration validation complete\n- **Q3 2026**: Expand government subsidies & social innovation collab; obtain ISO 27001 certification\n- **Q4 2026**: Official commercial operation; release annual pricing; full SaaS dual-track activation\n- **Q1 2027**: International expansion; replicate the Taiwan model to SEA & Asian supply chain nodes"
        }
    }
];

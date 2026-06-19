
export interface ProposalQuestion {
    id: number;
    question: { zh: string; en: string };
    answer: { zh: string; en: string };
    table?: {
        headers: string[];
        rows: string[][];
    };
    status?: { label: string; value: string }[];
}

export interface ProposalSection {
    title: { zh: string; en: string };
    questions: ProposalQuestion[];
}

export const GOOGLE_PROPOSAL_DATA: ProposalSection[] = [
    {
        title: { zh: "一、定位與核心價值 (Q1–Q4)", en: "I. Positioning & Core Value (Q1–Q4)" },
        questions: [
            {
                id: 1,
                question: { zh: "[ESG GO] 的核心定位", en: "Q1: Core Positioning of [ESG GO]" },
                answer: {
                    zh: "[ESG GO] 是一個「永續合規 × AI自動化 × 隱私保護」的整合平台，專為台灣中小企業設計，協助企業以最低成本完成可信賴的ESG揭露。",
                    en: "[ESG GO] is an integrated platform for 'Sustainability Compliance x AI Automation x Privacy Protection', specifically designed for Taiwanese SMEs, helping them complete trustworthy ESG disclosures at the lowest cost."
                }
            },
            {
                id: 2,
                question: { zh: "解決的核心問題", en: "Q2: Core Problems Solved" },
                answer: {
                    zh: "台灣 150 萬家中小企業面臨三大困境：\n1. 合規成本過高（傳統顧問費用動輒百萬）\n2. 數據可信度不足（缺乏驗證機制，漂綠風險高）\n3. 技術門檻過高（不懂 GRI/SASB/TCFD 等標準）",
                    en: "Taiwan's 1.5 million SMEs face three major challenges:\n1. Excessive compliance costs (traditional consulting fees often exceed millions)\n2. Insufficient data credibility (lack of verification mechanisms, high greenwashing risk)\n3. High technical barriers (unfamiliarity with GRI/SASB/TCFD and other international standards)"
                }
            },
            {
                id: 3,
                question: { zh: "核心創新", en: "Q3: Core Innovations" },
                answer: {
                    zh: "三大技術創新整合：\n- AI 自動報告生成 (Google Gemini 2.0 + ADK 架構)\n- 零知識證明隱私保護 (ZKP: zk-SNARKs / zk-STARKs)\n- 不可篡改存證 (Evidence Vault + 5T 協議)",
                    en: "Integration of three major technical innovations:\n- AI Automated Report Generation (Google Gemini 2.0 + ADK Architecture)\n- Zero-Knowledge Proof Privacy (ZKP: zk-SNARKs / zk-STARKs)\n- Immutable Evidence Vault (Evidence Vault + 5T Protocol)"
                }
            },
            {
                id: 4,
                question: { zh: "目標用戶", en: "Q4: Target Users" },
                answer: {
                    zh: "主要：台灣中小企業（尤其供應鏈製造業）\n次要：金融機構 ESG 融資審查、政府採購 ESG 資格驗證",
                    en: "Primary: Taiwanese SMEs (especially supply chain manufacturing)\nSecondary: Financial institutions for ESG financing audits, Government for procurement qualification."
                }
            }
        ]
    },
    {
        title: { zh: "二、問題深度診斷 (Q5–Q8)", en: "II. Deep DiaOmni (Q5–Q8)" },
        questions: [
            {
                id: 5,
                question: { zh: "市場規模與緊迫性", en: "Q5: Market Size and Urgency" },
                answer: {
                    zh: "金管會 2024 年起強制要求上市櫃公司 ESG 揭露。全球 ESG 資產規模超過 40 兆美元。台灣 1,700+ 上市櫃公司 + 150 萬中小企業。",
                    en: "The Financial Supervisory Commission (FSC) mandates ESG disclosure for listed companies from 2024. Global ESG assets exceed $40 trillion. Taiwan consists of 1,700+ listed companies and 1.5 million SMEs."
                }
            },
            {
                id: 6,
                question: { zh: "現有解法的不足", en: "Q6: Inadequacy of Existing Solutions" },
                answer: {
                    zh: "傳統顧問：成本高、不可擴展。\n現有軟體：功能單一、缺乏信任機制。\n國際大廠：不懂台灣本地法規。",
                    en: "Traditional Consultants: Costly, non-scalable.\nExisting Software: Single function, lack of trust mechanisms.\nInternational Giants: Unaware of local Taiwanese regulations."
                }
            },
            {
                id: 7,
                question: { zh: "信任危機的根本原因", en: "Q7: Root Cause of Trust Crisis" },
                answer: {
                    zh: "數據來源不透明、缺乏第三方可驗證機制、企業不願完整揭露敏感數據。",
                    en: "Opaque data sources, lack of third-party verification, and enterprise reluctance to disclose sensitive data."
                }
            },
            {
                id: 8,
                question: { zh: "為何現在是關鍵時間點", en: "Q8: Why Now is Critical?" },
                answer: {
                    zh: "法規強制窗口 (2024–2026 為密集合規期)、AI 技術成熟度達到商業化門檻、ZKP 技術首次具備中小企業部署可行性。",
                    en: "Mandatory regulatory window (2024–2026 is the intensive compliance period), AI technology maturity reaching commercialization thresholds, and ZKP technology first becoming feasible for SME deployment."
                }
            }
        ]
    },
    {
        title: { zh: "三、系統架構與 AI 應用 (Q9–Q12)", en: "III. Architecture & AI Application (Q9–Q12)" },
        questions: [
            {
                id: 9,
                question: { zh: "技術架構概覽", en: "Q9: Technical Architecture Overview" },
                answer: {
                    zh: "五層整合架構：\n1. ESG 素養層\n2. 顧問服務層\n3. InfoOne v8.1.0 核心系統\n4. Evidence Vault 存證層\n5. ZKP 隱私層",
                    en: "5-Layer Integrated Architecture:\n1. ESG Literacy\n2. Consulting Services\n3. InfoOne v8.1.0 Core\n4. Evidence Vault Storage\n5. ZKP Privacy Layer"
                }
            },
            {
                id: 10,
                question: { zh: "AI 的具體應用", en: "Q10: Specific AI Applications" },
                answer: {
                    zh: "自動解析原始數據生成 GRI/SASB/TCFD 報告。智能問答引擎協助企業主。動態遮罩規則引擎保護機密。",
                    en: "Auto-parse raw data to generate GRI/SASB/TCFD reports. Intelligent QA to assist owners. Dynamic masking to protect secrets."
                }
            },
            {
                id: 11,
                question: { zh: "ZKP 的創新應用場景", en: "Q11: Innovative ZKP Use Cases" },
                answer: {
                    zh: "1. 供應鏈驗證 (大廠不拿原始數據)\n2. 金融融資審查 (看評級不看財務細節)\n3. 政府採購驗證 (不持有個資)",
                    en: "1. Supply Chain Verification (No raw data shared)\n2. Finance Audits (Rating only, no raw details)\n3. Gov Procurement (No personal data held)"
                }
            },
            {
                id: 12,
                question: { zh: "技術完成度", en: "Q12: Technical Readiness" },
                answer: { zh: "核心模組已完成技術驗證與 API 部署。", en: "Core modules have completed tech validation and API deployment." },
                status: [
                    { label: "5T+ZKP Protocol", value: "DONE" },
                    { label: "UCC Engine", value: "DONE" },
                    { label: "Evidence Vault", value: "DONE" },
                    { label: "InfoOne v8.1.0", value: "DONE" }
                ]
            }
        ]
    },
    {
        title: { zh: "四、受益者與合作生態 (Q13–Q17)", en: "IV. Beneficiaries & Ecosystem (Q13–Q17)" },
        questions: [
            {
                id: 13,
                question: { zh: "直接受益者", en: "Q13: Direct Beneficiaries" },
                answer: {
                    zh: "台灣中小企業主 (降低合規成本 60%)、供應鏈管理人員、ESG 報告撰寫人員。",
                    en: "Taiwanese SME owners (60% cost reduction), supply chain managers, ESG report writers."
                }
            },
            {
                id: 14,
                question: { zh: "間接受益者", en: "Q14: Indirect Beneficiaries" },
                answer: {
                    zh: "金融機構 (提升審查效率)、政府機關 (降低數據風險)、供應鏈大廠 (可信數據)。",
                    en: "Financial institutions (Efficiency), Gov agencies (Risk reduction), Large enterprises (Trustworthy data)."
                }
            },
            {
                id: 15,
                question: { zh: "生態系合作夥伴", en: "Q15: Ecosystem Partners" },
                answer: {
                    zh: "台北市政府 (Pilot合作)、銀行與金融機構、會計師事務所、ESG 顧問公司。",
                    en: "Taipei City Govt (Pilot), Banks/Finance, CPA firms, ESG Consulting firms."
                }
            },
            {
                id: 16,
                question: { zh: "善向永續的定位", en: "Q16: Sunward Sustainability's Position" },
                answer: {
                    zh: "經濟部社創圓夢基地的社會創新組織，具備政府關係、社會公信力與本地法規專業。",
                    en: "Social innovation organization with government ties, public credibility, and local regulatory expertise."
                }
            },
            {
                id: 17,
                question: { zh: "利益相關者地圖", en: "Q17: Stakeholder Map" },
                answer: {
                    zh: "企業 (需求方) ← ESG GO → 金融機構 / 政府 / 大廠 (驗證方)",
                    en: "Enterprises (Demand) ← ESG GO → Finance / Gov / Large Corps (Verification)"
                }
            }
        ]
    },
    {
        title: { zh: "五、承接、採用與風險控管 (Q18–Q20)", en: "V. Adoption & Risk Management (Q18–Q20)" },
        questions: [
            {
                id: 18,
                question: { zh: "推廣策略", en: "Q18: Promotion Strategy" },
                answer: {
                    zh: "1. 台北市 10 家企業試行\n2. 全台供應鏈擴散\n3. ISO 27001 + SaaS 雙軌\n4. 東南亞海外據點",
                    en: "1. Taipei Pilot (10 firms)\n2. National spreading\n3. ISO 27001 + SaaS\n4. SEA expansion"
                }
            },
            {
                id: 19,
                question: { zh: "採用阻力與應對", en: "Q19: Adoption Resistance & Response" },
                answer: { zh: "針對門檻、安全、習慣等阻力提供解決方案。", en: "Providing solutions for barriers like threshold, security, and habits." },
                table: {
                    headers: ["阻力", "應對策略"],
                    rows: [
                        ["不懂 ESG", "AI 引導式問答"],
                        ["數據安全疑慮", "ZKP 隱私保護 + Evidence Vault"],
                        ["習慣傳統顧問", "SaaS 訂閱制降低成本"]
                    ]
                }
            },
            {
                id: 20,
                question: { zh: "風險控管", en: "Q20: Risk Management" },
                answer: {
                    zh: "技術已驗證，與金管會範本對齊，法規強制確保市場基礎需求。",
                    en: "The technology is validated and aligned with FSC templates; mandatory regulations ensure stable market demand."
                }
            }
        ]
    },
    {
        title: { zh: "六、成效評估與影響力 (Q21–Q24)", en: "VI. Impact Assessment (Q21–Q24)" },
        questions: [
            {
                id: 21,
                question: { zh: "量化成效指標", en: "Q21: Quantitative KPI" },
                answer: { zh: "顯著降低成本並提升數據信任度。", en: "Significantly reduce costs and increase data trust." },
                table: {
                    headers: ["指標", "目標值"],
                    rows: [
                        ["服務企業數", "10 (Beta) → 100 (Annual)"],
                        ["合規成本降低", "60%"],
                        ["生成時間縮短", "3 個月 → 3 天"],
                        ["可驗證率", "100%"]
                    ]
                }
            },
            {
                id: 22,
                question: { zh: "質化影響力", en: "Q22: Qualitative Influence" },
                answer: {
                    zh: "推動台灣 ESG 生態系，建立亞洲信任基礎設施範本，讓合規不再是專屬特權。",
                    en: "Driving TW ESG ecosystem, building Asia's trust infrastructure, making compliance accessible."
                }
            },
            {
                id: 23,
                question: { zh: "評估方法", en: "Q23: Assessment Methodology" },
                answer: {
                    zh: "企業完成率追蹤、ZKP 驗證量、滿意度調查、第三方稽核。",
                    en: "Completion tracking, ZKP verification volume, satisfaction surveys, 3rd-party audits."
                }
            },
            {
                id: 24,
                question: { zh: "長期影響力", en: "Q24: Long-term Impact" },
                answer: {
                    zh: "建立可向全球輸出的永續信任基礎設施。",
                    en: "Establishing a sustainability trust infrastructure exportable globally."
                }
            }
        ]
    },
    {
        title: { zh: "七、戰略優勢與總結 (Q25–Q28)", en: "VII. Strategic Advantages & Summary (Q25–Q28)" },
        questions: [
            {
                id: 25,
                question: { zh: "競爭優勢", en: "Q25: Competitive Advantage" },
                answer: { zh: "領先的 AI 與 ZKP 整合優勢。", en: "Leading integration of AI and ZKP." },
                table: {
                    headers: ["項目", "ESG GO", "傳統顧問", "國際 SaaS"],
                    rows: [
                        ["本地法規專業", "✅", "✅", "❌"],
                        ["AI 自動化", "✅", "❌", "部分"],
                        ["ZKP 隱私保護", "✅", "❌", "❌"],
                        ["可負擔性", "✅", "❌", "部分"]
                    ]
                }
            },
            {
                id: 26,
                question: { zh: "為何台灣是最佳驗證場", en: "Q26: Why Taiwan is the Best Testing Ground" },
                answer: {
                    zh: "法規壓力真實、企業密度高、數位基礎好、政府協作強、供應鏈連結深。",
                    en: "Authentic regulation, high density, digital foundations, strong govt collab, deep supply chain links."
                }
            },
            {
                id: 27,
                question: { zh: "為何符合 Google.org Impact", en: "Q27: Why aligned with Google.org Impact" },
                answer: {
                    zh: "1. 技術創新 (AI+ZKP+GCP)\n2. 可行性 (Pilot場景清晰)\n3. 規模化潛力 (150萬企業 + 東南亞)。",
                    en: "1. Innovation (AI+ZKP+GCP), 2. Feasibility (Clear Pilot), 3. Scalability (1.5M firms + SEA)."
                }
            },
            {
                id: 28,
                question: { zh: "戰略價值陳述", en: "Q28: Strategic Value Statement" },
                answer: {
                    zh: "用 AI 降低門檻，用密碼學建立信任，讓每個企業公平參與永續轉型。",
                    en: "Using AI to lower barriers and cryptography to build trust, ensuring every enterprise can participate fairly in the sustainable transition."
                }
            }
        ]
    }
];


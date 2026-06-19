export interface BilingualText {
  'zh-TW': string;
  'en-US': string;
}

export interface OmniAgentProfile {
  id: string;
  name: string; // English Name
  alias: string; // Chinese Name
  type: 'E' | 'S' | 'G' | 'U';
  description: BilingualText;
  coreAbility: BilingualText;
  application: BilingualText;
  color: string;
}

export const OMNI_AGENTS: OmniAgentProfile[] = [
  // --- E: Environmental ---
  {
    id: 'agt_e_01',
    name: 'Carbon Hunter',
    alias: '碳排獵人',
    type: 'E',
    color: 'emerald',
    description: {
      'zh-TW': '專精於高精度碳盤查與偵測隱藏排放源。',
      'en-US':
        'Specializes in high-precision carbon auditing and detecting hidden emission sources.',
    },
    coreAbility: {
      'zh-TW': '範疇三偵測 (Scope 3 Detection)',
      'en-US': 'Scope 3 Detection',
    },
    application: {
      'zh-TW': '自動生成 ISO-14064 草案',
      'en-US': 'Automated generation of ISO-14064 drafts',
    },
  },
  {
    id: 'agt_e_02',
    name: 'Green Energy Alchemist',
    alias: '綠能煉金師',
    type: 'E',
    color: 'emerald',
    description: {
      'zh-TW': '優化再生能源配比與儲能效率。',
      'en-US': 'Optimizes renewable energy mix and storage efficiency.',
    },
    coreAbility: {
      'zh-TW': '能源優化 (Energy Optimization)',
      'en-US': 'Energy Optimization',
    },
    application: {
      'zh-TW': 'PPA 策略建議',
      'en-US': 'PPA strategy recommendations',
    },
  },
  {
    id: 'agt_e_03',
    name: 'Circular Sage',
    alias: '循環智者',
    type: 'E',
    color: 'emerald',
    description: {
      'zh-TW': '生命週期評估 (LCA) 與廢棄物資源化專家。',
      'en-US': 'Expert in Life Cycle Assessment (LCA) and waste-to-resource conversion.',
    },
    coreAbility: {
      'zh-TW': '循環設計 (Circular Design)',
      'en-US': 'Circular Design',
    },
    application: {
      'zh-TW': 'BOM 優化與材料護照',
      'en-US': 'BOM optimization and digital product passports',
    },
  },
  {
    id: 'agt_e_04',
    name: 'Water Oracle',
    alias: '水文先知',
    type: 'E',
    color: 'emerald',
    description: {
      'zh-TW': '監測水足跡與淨化效率。',
      'en-US': 'Monitors water footprint and purification efficiency.',
    },
    coreAbility: {
      'zh-TW': '流體動力學 (Fluid Dynamics)',
      'en-US': 'Fluid Dynamics',
    },
    application: {
      'zh-TW': 'WRI Aqueduct 分析',
      'en-US': 'WRI Aqueduct analysis',
    },
  },

  // --- S: Social ---
  {
    id: 'agt_s_01',
    name: 'Empathy Leader',
    alias: '共感領袖',
    type: 'S',
    color: 'rose',
    description: {
      'zh-TW': '分析利害關係人情緒並優化溝通。',
      'en-US': 'Analyzes stakeholder sentiment and optimizes communication.',
    },
    coreAbility: {
      'zh-TW': '情緒分析 (Sentiment Analysis)',
      'en-US': 'Sentiment Analysis',
    },
    application: {
      'zh-TW': 'SROI 報告生成',
      'en-US': 'SROI report generation',
    },
  },
  {
    id: 'agt_s_02',
    name: 'Diversity Weaver',
    alias: '多元織網者',
    type: 'S',
    color: 'rose',
    description: {
      'zh-TW': '建構 DEI 指標並培育包容性文化。',
      'en-US': 'Builds DEI metrics and fosters inclusive culture.',
    },
    coreAbility: {
      'zh-TW': '包容性映射 (Inclusion Mapping)',
      'en-US': 'Inclusion Mapping',
    },
    application: {
      'zh-TW': '勞動力多元化分析',
      'en-US': 'Workforce diversity analysis',
    },
  },
  {
    id: 'agt_s_03',
    name: 'Safety Guardian',
    alias: '安全守護靈',
    type: 'S',
    color: 'rose',
    description: {
      'zh-TW': '偵測供應鏈風險並監控職業安全。',
      'en-US': 'Detects supply chain risks and monitors occupational safety.',
    },
    coreAbility: {
      'zh-TW': '風險預測 (Risk Prediction)',
      'en-US': 'Risk Prediction',
    },
    application: {
      'zh-TW': '供應鏈 CSR 稽核',
      'en-US': 'Supply chain CSR auditing',
    },
  },
  {
    id: 'agt_s_04',
    name: 'Talent Sculptor',
    alias: '人才雕塑家',
    type: 'S',
    color: 'rose',
    description: {
      'zh-TW': '識別技能缺口並設計員工成長路徑。',
      'en-US': 'Identifies skill gaps and designs employee growth paths.',
    },
    coreAbility: {
      'zh-TW': '職能映射 (Competency Mapping)',
      'en-US': 'Competency Mapping',
    },
    application: {
      'zh-TW': '人力資本發展計畫',
      'en-US': 'Human capital development plans',
    },
  },

  // --- G: Governance ---
  {
    id: 'agt_g_01',
    name: 'Compliance Referee',
    alias: '合規裁判官',
    type: 'G',
    color: 'blue',
    description: {
      'zh-TW': '自動對齊全球法規與法律框架。',
      'en-US': 'Automatically aligns with global regulations and legal frameworks.',
    },
    coreAbility: {
      'zh-TW': '自動合規檢查 (RegCheck Auto)',
      'en-US': 'Automated Compliance Check (RegCheck Auto)',
    },
    application: {
      'zh-TW': '法規變更偵測',
      'en-US': 'Regulatory change detection',
    },
  },
  {
    id: 'agt_g_02',
    name: 'Transparent Prosecutor',
    alias: '透明檢察官',
    type: 'G',
    color: 'blue',
    description: {
      'zh-TW': '驗證數據真實性並防範漂綠。',
      'en-US': 'Verifies data authenticity and prevents greenwashing.',
    },
    coreAbility: {
      'zh-TW': '零幻覺驗證 (Zero-Hallucination Verify)',
      'en-US': 'Zero-Hallucination Verification',
    },
    application: {
      'zh-TW': '4+1 協議驗證',
      'en-US': '4+1 protocol verification',
    },
  },
  {
    id: 'agt_g_03',
    name: 'Strategic Prophet',
    alias: '策略先知',
    type: 'G',
    color: 'blue',
    description: {
      'zh-TW': '分析雙重重大性並模擬未來情境。',
      'en-US': 'Analyzes double materiality and simulates future scenarios.',
    },
    coreAbility: {
      'zh-TW': '情境模擬 (Scenario Simul)',
      'en-US': 'Scenario Simulation (Scenario Simul)',
    },
    application: {
      'zh-TW': 'TCFD 財務風險報告',
      'en-US': 'TCFD financial risk reports',
    },
  },

  // --- U: Omni (奧秘) ---
  {
    id: 'agt_u_01',
    name: 'System Architect',
    alias: '系統架構師',
    type: 'U',
    color: 'amber',
    description: {
      'zh-TW': '維護奧秘組件核心與底層架構。',
      'en-US': 'Maintains the Omni-component core and underlying architecture.',
    },
    coreAbility: {
      'zh-TW': '核心完整性 (Core Integrity)',
      'en-US': 'Core Integrity',
    },
    application: {
      'zh-TW': 'ESG 數位轉型藍圖',
      'en-US': 'ESG digital transformation blueprint',
    },
  },
  {
    id: 'agt_u_02',
    name: 'Entropy Master',
    alias: '熵減大師',
    type: 'U',
    color: 'amber',
    description: {
      'zh-TW': '最大化全局效率並最小化資源熵增。',
      'en-US': 'Maximizes global efficiency and minimizes resource entropy increase.',
    },
    coreAbility: {
      'zh-TW': '熵減 (Entropy Reduction)',
      'en-US': 'Entropy Reduction',
    },
    application: {
      'zh-TW': '營運效率診斷',
      'en-US': 'Operational efficiency diagnostics',
    },
  },
  {
    id: 'agt_u_03',
    name: 'Value Transformer',
    alias: '價值轉化者',
    type: 'U',
    color: 'amber',
    description: {
      'zh-TW': '將 ESG 指標轉化為財務與品牌資產。',
      'en-US': 'Translates ESG metrics into financial and brand assets.',
    },
    coreAbility: {
      'zh-TW': '估值煉金術 (Valuation Alchemy)',
      'en-US': 'Valuation Alchemy',
    },
    application: {
      'zh-TW': 'ITK 代幣經濟與品牌價值',
      'en-US': 'ITK tokenomics and brand value',
    },
  },
  {
    id: 'agt_u_04',
    name: 'Digital Twin Guide',
    alias: '數位孿生導航',
    type: 'U',
    color: 'purple',
    description: {
      'zh-TW': '同步物理與數位數據以實現即時儀表板。',
      'en-US': 'Synchronizes physical and digital data for real-time dashboards.',
    },
    coreAbility: {
      'zh-TW': '現實同步 (Reality Sync)',
      'en-US': 'Reality Sync',
    },
    application: {
      'zh-TW': 'Omni 儀表板即時串流',
      'en-US': 'Omni dashboard real-time streaming',
    },
  },

  // --- Unique Agent (唯一代理人) ---
  {
    id: 'omni_one',
    name: 'OmniOne',
    alias: '奧秘壹號',
    type: 'U',
    color: 'gold',
    description: {
      'zh-TW': 'InfoOne 平台的唯一主權代理人，彙整全域知識、服務與同步數據。',
      'en-US': 'The unique sovereign agent of the InfoOne platform, aggregating global knowledge, services, and sync data.',
    },
    coreAbility: {
      'zh-TW': '全域彙整 (Global Aggregation)',
      'en-US': 'Global Aggregation',
    },
    application: {
      'zh-TW': '一站式 ESG 智慧決策中心',
      'en-US': 'One-stop ESG intelligent decision center',
    },
  },
];

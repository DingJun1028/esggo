export interface Instructor {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  org: string;
  country: string;
  avatar: string;
  bio: string;
  available: boolean;
  expertise: string[];
  role: 'instructor' | 'mentor' | 'advisor';
}

export interface CourseModule {
  id: string;
  title: string;
  titleEn: string;
  hours: number;
  sessions: string[];
  color: string;
}

export interface CertificationCourse {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  partners: string[];
  partnerLogos: string[];
  description: string;
  duration: string;
  format: string;
  cohorts: { name: string; dates: string }[];
  highlights: { num: number; title: string; desc: string }[];
  modules: CourseModule[];
  deliverables: string[];
  certificates: string[];
  targetAudience: string[];
  price: string;
  addedValue: string;
  faq: { q: string; a: string }[];
  url: string;
  color: string;
  badge: string;
}

export interface Student {
  id: string;
  name: string;
  company: string;
  role: string;
  cohort: string;
  progress: number;
  status: 'active' | 'completed' | 'pending';
  certificates: string[];
  joinedAt: string;
}

export interface AdvisorProfile {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  org: string;
  country: string;
  expertise: string[];
  sessions: number;
  rating: number;
  available: boolean;
  bio: string;
  avatar: string;
}

export const certificationCourses: CertificationCourse[] = [
  {
    id: 'berkeley-yunus-tsisda-2026',
    title: '柏克萊國際永續策略創新認證課程',
    titleEn: 'Berkeley Haas × YUNUS × TSISDA ESG Strategy & Innovation Program',
    subtitle: '全球唯一「策略 × 合規 × 創新 × 創價 × 顧問」五合一永續轉型訓練',
    partners: ['UC Berkeley Haas IBI', '台灣尤努斯基金會', 'TSISDA', 'ESG Sunshine'],
    partnerLogos: ['Berkeley', 'YUNUS', 'TSISDA', 'ESG Sunshine'],
    description: '本課程由 UC Berkeley Haas 商學院 Institute for Business Innovation（IBI）、台灣尤努斯基金會（Yunus Foundation）、台灣社會創新永續發展協會（TSISDA）與 ESG Sunshine 聯合打造，整合 Berkeley 8 大學研機構與矽谷資深業師的尖端智慧，結合台灣企業最需要的 ESG 創價與合規轉型實務，打造全球唯一「策略 × 合規 × 創新 × 創價 × 顧問」五合一的永續轉型訓練。課程採「雙模組 × 六週完成」：Berkeley Haas 國際永續策略創新模組（36 小時）+ TSISDA 永續轉型實務模組（36 小時）。',
    duration: '6 週 · 72 小時',
    format: '線上 × 實體混合式',
    cohorts: [
      { name: 'A 組', dates: '2026年6月6日 — 7月11日' },
      { name: 'B 組', dates: '2026年8月1日 — 9月5日' },
    ],
    highlights: [
      { num: 1, title: '全球唯一：Berkeley Haas IBI 八大機構整合', desc: '萃取各研究中心的方法論與實務洞見，全球首次以 ESG 為核心整合輸出，一次掌握全球頂尖商學院最精萃的 ESG 專業。' },
      { num: 2, title: '五合一訓練：策略 × 合規 × 創新 × 創價 × 顧問', desc: '不只講 ESG 理論，而是攻克企業真正最痛的永續轉型任督二脈，具備全面落地能力。' },
      { num: 3, title: '三項重量級成果直接帶走', desc: '完整《永續策略藍圖 2.0》、永續報告骨架 × 合規策略框架、創價型 ESG 專案（具商業價值 × 社會影響力）。' },
      { num: 4, title: 'Berkeley 師資 × 矽谷業師全程參與', desc: '與來自 Berkeley、Stanford、Apple、Google、IBM、Siemens、Disney、Johnson & Johnson 等知名教授及矽谷企業高管互動。' },
      { num: 5, title: '完整台灣永續實務訓練（任脈）', desc: '從零到完成永續報告骨架，理解合規、風險、重大性、ESG 治理的實作流程。' },
      { num: 6, title: '創價型 ESG（督脈）打造公司專屬創新 ESG 專案', desc: '以社會創新 × ESG 商業模式 × 精實創業方法，創造可落地的新型 ESG 解方。' },
      { num: 7, title: 'Berkeley × YUNUS × TSISDA 三證書制度', desc: '透過國際認證提升學員履歷、升遷與企業內部永續職涯競爭力。' },
      { num: 8, title: '矽谷式 Consulting Office Hour', desc: '學員期間可獲 Berkeley × 矽谷資深顧問的專屬指導，協助解決實務議題。' },
      { num: 9, title: '課後加值服務持續支援', desc: '提供 ESG 法規更新、產業洞察、專案陪跑、學員社群交流。' },
      { num: 10, title: '亮眼成果', desc: '首期學員專案共獲得新台幣 3,265 萬之政府計畫與新創投資。' },
      { num: 11, title: '課程加贈：市價 NT$29,000 ESG 轉型健檢 × 顧問諮詢', desc: '直接協助企業盤點現況、減少永續轉型摸索成本。' },
    ],
    modules: [
      {
        id: 'ibi',
        title: 'Berkeley IBI 模組',
        titleEn: 'Berkeley IBI International Sustainability Strategy & Innovation Module',
        hours: 36,
        color: '#003262',
        sessions: [
          'Purpose × 北極星願景設計',
          'Materiality 2.0',
          'Strategy House 2.0',
          'KPI Tier 0–3 架構',
          'Innovation Matrix × ESG Portfolio',
          'Ecosystem Strategy',
          'Impact Logic Model',
          'ESG Dashboard & Data Architecture',
          'Sustainability Strategy Blueprint 2.0（最終成果）',
        ],
      },
      {
        id: 'tsisda-compliance',
        title: 'TSISDA 任脈（合規）',
        titleEn: 'TSISDA Compliance Track',
        hours: 18,
        color: '#2E8B57',
        sessions: [
          'ESG 全球趨勢 × 三大議題',
          'GRI × IFRS 永續揭露標準',
          'TCFD/TNFD/TISFD',
          '永續重大性 × 永續治理 × 永續部門設計',
          'ESG CHECK 工具',
          '永續報告架構與策略設計（學員個案實作）',
        ],
      },
      {
        id: 'tsisda-innovation',
        title: 'TSISDA 督脈（創價）',
        titleEn: 'TSISDA Innovation & Value Creation Track',
        hours: 18,
        color: '#FDB515',
        sessions: [
          '永續新典範策略 × 創價型 ESG',
          '社會創新方法論',
          '社會影響力分析',
          '永續商業模式設計（SBMC）',
          'ESG 創新解方（三層級影響力 × 商業價值）',
          '國際精實落地（Silicon Valley Lean Launch）',
        ],
      },
    ],
    deliverables: [
      '一份完整的《永續策略藍圖 2.0》（含 9 大 Canvas）',
      '一份企業永續報告骨架 × 策略框架',
      '一份創價型 ESG 新創提案原型（Prototype）',
      '市價 NT$29,000 的 ESG 轉型健檢 × 顧問諮詢',
    ],
    certificates: [
      'UC Berkeley Haas IBI 國際永續策略創新師證書',
      '台灣尤努斯基金會 × TSISDA 國際永續轉型規劃師證書',
    ],
    targetAudience: [
      '企業永續長、策略主管、經營團隊',
      '投資人、新創創辦人',
      '顧問、資深工程師',
      '跨國企業永續負責人',
      'ESG 專責人員、管理職希望提升永續能力者',
      '想轉做永續顧問者',
    ],
    price: 'NT$29,000（加贈 ESG 轉型健檢）',
    addedValue: '首期學員專案共獲得 NT$3,265 萬之政府計畫與新創投資',
    faq: [
      {
        q: 'Q1 這門課程對企業最大的價值是什麼？',
        a: '這是全球唯一整合 Berkeley IBI 八大機構 × ESG Strategy × Compliance × Innovation × Consulting 的課程。企業能獲得一次性匯集：永續策略設計能力（Blueprint 2.0）、完整永續報告骨架（任脈）、創價型 ESG 專案提案（督脈）、國際與本地合規能力（IFRS S1/S2、GRI、TCFD、TNFD）、矽谷式顧問諮詢（Consulting Office Hour）、課後持續支持。'
      },
      {
        q: 'Q2 課程與一般 ESG/永續課程有什麼不同？',
        a: '一般課程：講概念、講框架。本課程：從策略、到合規、到創新、到落地、到顧問，一次打通永續任督二脈。唯一培育能規劃永續策略藍圖、能寫永續報告草稿、能做創新方案、能與主管直接提案、能完成 KPI 與 Dashboard 架構的課程。'
      },
      {
        q: 'Q3 完成課程後，學員能替公司做什麼？',
        a: '具備以下能力：完成企業永續策略藍圖 Blueprint 2.0、完成永續報告書初稿＋重大議題分析、設計 1～2 個創價 ESG 專案、進行 KPI 架構/Dashboard 架構/資料盤點、撰寫永續提案用於主管簡報或專案申請。= 第一線可用的 ESG 策略即戰力。'
      },
      {
        q: 'Q4 課程會提供企業實務上的協助嗎？',
        a: '是的！課程內含市價 NT$29,000 的企業 ESG 健檢與顧問諮詢，內容包括：永續現況盤點、合規差距診斷、策略缺口建議、KPI 與治理架構建議。'
      },
      {
        q: 'Q5 我們可以派多位員工同時參加嗎？',
        a: '可以，而且強烈建議企業 2～4 人小組一起參加。原因：可以團隊方式完成創價專案、公司回去後可立即啟動 ESG 工作小組、多人一起參加可提升學習與落地效率、避免「永續孤兒」現象。可另提供企業採購優惠。'
      },
      {
        q: 'Q6 我沒有 ESG 背景，可以參加嗎？',
        a: '完全可以！課程設計從 0 → 1 完成永續報告骨架、從 1 → 2 完成永續策略藍圖、從 2 → 3 完成創新 ESG 專案提案。非常適合 ESG 新手、企業轉職者、管理職、新創創辦人。'
      },
    ],
    url: 'https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/',
    color: '#003262',
    badge: 'NEW 2026',
  },
];

export const instructors: Instructor[] = [
  {
    id: 'ganesh-iyer',
    name: 'Ganesh Iyer',
    nameEn: 'Prof. Ganesh Iyer',
    title: 'Faculty Director, Center for Growth Markets',
    titleEn: 'Faculty Director, Center for Growth Markets',
    org: 'UC Berkeley Haas School of Business',
    country: '美國',
    avatar: 'GI',
    bio: 'Haas 商學院成長市場中心教職主任，專注於策略行銷與新興市場商業模式研究。',
    available: true,
    expertise: ['Strategy', 'Growth Markets', 'Business Models'],
    role: 'instructor',
  },
  {
    id: 'ana-torres',
    name: 'Ana Torres',
    nameEn: 'Ana Torres',
    title: 'Associate Director, Cleantech to Market Program (C2M)',
    titleEn: 'Associate Director, C2M',
    org: 'UC Berkeley Haas',
    country: '美國',
    avatar: 'AT',
    bio: '潔淨科技市場化計畫副主任，主導 Berkeley Haas 能源轉型與技術商業化課程。',
    available: true,
    expertise: ['Cleantech', 'Energy Transition', 'Market Strategy'],
    role: 'instructor',
  },
  {
    id: 'kuen-shiou-yang',
    name: '楊坤修 博士',
    nameEn: 'Dr. Kuen-Shiou Yang',
    title: '理事長',
    titleEn: 'Chairman',
    org: '台灣社會創新與永續發展協會（TSISDA）',
    country: '台灣',
    avatar: 'YK',
    bio: '台灣社會創新與永續發展協會理事長，長期推動中小企業 ESG 轉型，與 UC Berkeley Haas 合作主持永續策略課程。',
    available: true,
    expertise: ['ESG Strategy', 'Social Innovation', 'SME Transformation'],
    role: 'instructor',
  },
  {
    id: 'stan-shih',
    name: 'Stan Shih',
    nameEn: 'Stan Shih',
    title: 'Founder of Acer Group & Chairman, StanShih Foundation',
    titleEn: 'Founder, Acer Group',
    org: 'StanShih Foundation / Acer Group',
    country: '台灣',
    avatar: 'SS',
    bio: '宏碁集團創辦人，施振榮基金會董事長，台灣科技產業傳奇人物，深耕企業社會責任與永續創新。',
    available: true,
    expertise: ['Tech Industry', 'Corporate Governance', 'Innovation'],
    role: 'instructor',
  },
  {
    id: 'rey-sheng-her',
    name: 'Dr. Rey-Sheng Her',
    nameEn: 'Dr. Rey-Sheng Her',
    title: '副執行長',
    titleEn: 'Deputy CEO',
    org: '慈濟基金會（Tzu Chi Foundation）',
    country: '台灣',
    avatar: 'RH',
    bio: '慈濟基金會副執行長，長期推動人道主義與社會創新，擅長大型公益組織治理與全球合作。',
    available: true,
    expertise: ['Social Impact', 'Humanitarian', 'Organizational Governance'],
    role: 'instructor',
  },
  {
    id: 'chandra-vadhana',
    name: 'Chandra Vadhana Radhakrishnan',
    nameEn: 'Chandra Vadhana Radhakrishnan',
    title: 'Senior Lecturer · Stanford Univ. ESG Scholar',
    titleEn: 'Senior Lecturer',
    org: 'Monash University · She Sight Magazine',
    country: '澳洲/美國',
    avatar: 'CV',
    bio: 'Monash University 資深講師，She Sight Magazine 創辦人暨執行長，Stanford ESG 學者，專注性別平等與永續創新。',
    available: true,
    expertise: ['Gender Equality', 'ESG Research', 'Social Innovation'],
    role: 'instructor',
  },
  {
    id: 'ann-kristin-zobel',
    name: 'Ann-Kristin Zobel',
    nameEn: 'Ann-Kristin Zobel',
    title: 'Associate Professor of Management',
    titleEn: 'Associate Professor',
    org: 'University of St. Gallen',
    country: '瑞士',
    avatar: 'AZ',
    bio: '聖加倫大學管理學副教授，研究企業永續轉型、商業模式創新與組織韌性。',
    available: true,
    expertise: ['Business Model Innovation', 'Organizational Resilience', 'Sustainability Management'],
    role: 'instructor',
  },
  {
    id: 'karin-li',
    name: 'Karin Li',
    nameEn: 'Karin Li',
    title: 'Behavioral Economist',
    titleEn: 'Behavioral Economist',
    org: 'Haas School of Business',
    country: '美國',
    avatar: 'KL',
    bio: 'Haas 商學院行為經濟學家，研究決策行為、永續消費與 ESG 激勵機制設計。',
    available: true,
    expertise: ['Behavioral Economics', 'Sustainable Consumption', 'ESG Incentives'],
    role: 'instructor',
  },
  {
    id: 'dave-rochlin',
    name: 'Dave Rochlin',
    nameEn: 'Dave Rochlin',
    title: 'Executive Director, Innovation, Creativity and Design Practice',
    titleEn: 'Executive Director',
    org: 'UC Berkeley Haas',
    country: '美國',
    avatar: 'DR',
    bio: 'Berkeley Haas 創新、創意與設計實踐執行主任，主導設計思維與創新方法論教學。',
    available: true,
    expertise: ['Design Thinking', 'Innovation Management', 'Creativity'],
    role: 'instructor',
  },
  {
    id: 'chris-bush',
    name: 'Chris Bush',
    nameEn: 'Chris Bush',
    title: 'Executive Director, Institute for Business Innovation',
    titleEn: 'Executive Director, IBI',
    org: 'UC Berkeley Haas IBI',
    country: '美國',
    avatar: 'CB',
    bio: 'Berkeley Haas 商業創新研究院執行主任，主導 IBI 八大研究中心的策略整合與課程設計。',
    available: true,
    expertise: ['Business Innovation', 'Corporate Strategy', 'Program Design'],
    role: 'instructor',
  },
];

export const mentors: Instructor[] = [
  {
    id: 'jon-metzler',
    name: 'Jon Metzler',
    nameEn: 'Jon Metzler',
    title: 'Continuing Lecturer',
    titleEn: 'Continuing Lecturer',
    org: 'Haas School of Business',
    country: '美國',
    avatar: 'JM',
    bio: 'Haas 商學院持續講師，專注策略管理與商業實踐指導。',
    available: true,
    expertise: ['Strategy', 'Business Practice'],
    role: 'mentor',
  },
  {
    id: 'ben-bradbury',
    name: 'Ben Bradbury',
    nameEn: 'Ben Bradbury',
    title: 'MBA Executive Coach',
    titleEn: 'Executive Coach',
    org: 'Haas School of Business',
    country: '美國',
    avatar: 'BB',
    bio: 'Haas MBA 行政教練，協助學員在高壓環境下達成個人與組織目標。',
    available: true,
    expertise: ['Executive Coaching', 'Leadership', 'MBA Programs'],
    role: 'mentor',
  },
  {
    id: 'oguzhan-aygor',
    name: 'Oğuzhan Aygören',
    nameEn: 'Oguzhan Aygor',
    title: 'Director, Institute for Business Innovation',
    titleEn: 'Director, IBI',
    org: 'UC Berkeley Haas IBI',
    country: '美國',
    avatar: 'OA',
    bio: 'IBI 研究院主任，推動創業精神與商業創新跨領域合作。',
    available: true,
    expertise: ['Business Innovation', 'Entrepreneurship'],
    role: 'mentor',
  },
  {
    id: 'ardin-hsu',
    name: 'Arding Hsu',
    nameEn: 'Ardin Hsu',
    title: 'Senior Advisor',
    titleEn: 'Senior Advisor',
    org: 'Garwood Center for Corporate Innovation',
    country: '美國/台灣',
    avatar: 'AH',
    bio: 'Garwood 企業創新中心資深顧問，連結矽谷與台灣企業創新生態系。',
    available: true,
    expertise: ['Corporate Innovation', 'Taiwan-Silicon Valley Bridge'],
    role: 'mentor',
  },
];

export const siliconValleyMentors = [
  { id: 'herbert-wu', name: 'Dr. Herbert Wu', org: 'Apple 前董事 · 昇陽電腦前董事', avatar: 'HW', tag: 'Apple' },
  { id: 'xiao-ge', name: 'Dr. Xiao Ge', org: 'Stanford 資料驅動 AI 研究學者', avatar: 'XG', tag: 'Stanford' },
  { id: 'surendra-chawla', name: 'Dr. Surendra Chawla', org: '固特異輪胎前資深董事', avatar: 'SC', tag: 'Goodyear' },
  { id: 'jim-spohrer', name: 'Dr. Jim Spohrer', org: 'IBM 前開放技術總監 · Apple 傑出科學家', avatar: 'JS', tag: 'IBM' },
  { id: 'gautam-b', name: 'Dr. Gautam Bandyopadhyay', org: 'Siemens 前創新與技術管理總監', avatar: 'GB', tag: 'Siemens' },
  { id: 'deepu-rathi', name: 'Dr. Deepu Rathi', org: 'Cisco 前高級總監', avatar: 'DR', tag: 'Cisco' },
  { id: 'pradeep-iyer', name: 'Dr. Pradeep Iyer', org: 'Avery Dennison 前全球高級總監', avatar: 'PI', tag: 'Avery' },
  { id: 'brinda-wiita', name: 'Dr. Brinda Wiita', org: 'Johnson & Johnson 前總監', avatar: 'BW', tag: 'J&J' },
  { id: 'olga-diamandis', name: 'Olga Diamandis', org: 'Disney 創新總監', avatar: 'OD', tag: 'Disney' },
  { id: 'dan-yu', name: 'Dan Yu', org: 'Siemens AI 和機器學習解決方案總監', avatar: 'DY', tag: 'Siemens' },
  { id: 'piyush-malik', name: 'Piyush Malik', org: 'IBM 與 Google 前雲端總監', avatar: 'PM', tag: 'Google' },
  { id: 'srikanth-raju', name: 'Srikanth Nandi Raju', org: 'Experian 工程總監 · PayPal 前工程主管', avatar: 'SR', tag: 'Experian' },
  { id: 'janaki-kowtha', name: 'Janaki Kowtha', org: 'IBM 科技業務負責人', avatar: 'JK', tag: 'IBM' },
  { id: 'veronica-pettit', name: 'Veronica Pettit', org: 'Siemens Energy 研究員', avatar: 'VP', tag: 'Siemens' },
];

export const programStats = {
  totalStudents: 284,
  activeStudents: 47,
  completedStudents: 237,
  instructors: instructors.length,
  mentors: mentors.length + siliconValleyMentors.length,
  courses: certificationCourses.length,
  totalInvestmentSecured: 'NT$3,265 萬',
  avgRating: 4.9,
  certifications: 3,
  partnerOrgs: 4,
};

export const students: Student[] = [
  { id: 's1', name: '陳佳瑩', company: '台達電子', role: '永續策略主管', cohort: 'A 組 2026', progress: 85, status: 'active', certificates: [], joinedAt: '2026-06-06' },
  { id: 's2', name: '林宗翰', company: '研華科技', role: '企業永續長', cohort: 'A 組 2026', progress: 72, status: 'active', certificates: [], joinedAt: '2026-06-06' },
  { id: 's3', name: '王雅婷', company: '緯創資通', role: 'ESG 專員', cohort: 'A 組 2026', progress: 91, status: 'active', certificates: [], joinedAt: '2026-06-06' },
  { id: 's4', name: '李建志', company: '台灣大哥大', role: '策略規劃處長', cohort: 'A 組 2026', progress: 68, status: 'active', certificates: [], joinedAt: '2026-06-06' },
  { id: 's5', name: '張美雲', company: '富邦金控', role: '永續發展部協理', cohort: 'B 組 2026', progress: 0, status: 'pending', certificates: [], joinedAt: '2026-08-01' },
];
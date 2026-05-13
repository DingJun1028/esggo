export type AdvisorStatus = 'available' | 'busy' | 'unavailable';
export type AgentTier = 'platinum' | 'gold' | 'silver' | 'bronze';
export type ReferralStatus = 'active' | 'pending' | 'expired';

export interface Advisor {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  org: string;
  country: string;
  avatar: string;
  status: AdvisorStatus;
  specialties: string[];
  rating: number;
  sessions: number;
  bio: string;
  modules: string[];
  languages: string[];
  fee: string;
}

export interface Agent {
  id: string;
  name: string;
  code: string;
  tier: AgentTier;
  region: string;
  referrals: number;
  goodCoins: number;
  joinDate: string;
  status: 'active' | 'pending';
  bio: string;
  specialties: string[];
}

export interface ReferralCode {
  id: string;
  code: string;
  agentId: string;
  agentName: string;
  campaign: string;
  uses: number;
  maxUses: number;
  goodCoinReward: number;
  bonusMultiplier: number;
  status: ReferralStatus;
  expiresAt: string;
  createdAt: string;
}

export interface GoodCoinTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'bonus';
  amount: number;
  description: string;
  timestamp: string;
  relatedCode?: string;
}

export const ADVISORS: Advisor[] = [
  {
    id: 'A001',
    name: '楊坤修 博士',
    nameEn: 'Dr. Kuen-Shiou Yang',
    title: '理事長',
    org: '台灣社會創新與永續發展協會（TSISDA）',
    country: '台灣',
    avatar: 'YK',
    status: 'available',
    specialties: ['ESG 策略', 'GRI 2021', '社會創新', 'SDGs 對接', '中小企業轉型'],
    rating: 4.9,
    sessions: 342,
    bio: '台灣社會創新與永續發展協會理事長，長期推動中小企業 ESG 轉型，與 UC Berkeley Haas 合作主持永續策略課程，深耕台灣 ESG 生態系超過 15 年。',
    modules: ['健檢解讀', '揭露輔導', '資料盤點', '1:1 Expert Hour'],
    languages: ['繁體中文', 'English'],
    fee: '規格內免費 (1h) / 加購 NT$8,000/h'
  },
  {
    id: 'A002',
    name: 'Ganesh Iyer',
    nameEn: 'Prof. Ganesh Iyer',
    title: 'Faculty Director, Center for Growth Markets',
    org: 'UC Berkeley Haas School of Business',
    country: '美國',
    avatar: 'GI',
    status: 'available',
    specialties: ['永續商業模式', '市場策略', '新興市場 ESG', 'Open Innovation'],
    rating: 4.9,
    sessions: 218,
    bio: 'UC Berkeley Haas 成長市場中心主任，主導 Berkeley × TSISDA 永續策略創新課程，專注 ESG 驅動的商業模式設計與開放式創新方法論。',
    modules: ['揭露輔導', '客戶問卷/標案回覆', '1:1 Expert Hour'],
    languages: ['English'],
    fee: '加購 NT$15,000/h'
  },
  {
    id: 'A003',
    name: 'Ana Torres',
    nameEn: 'Ana Torres',
    title: 'Associate Director, C2M Program',
    org: 'UC Berkeley Haas IBI',
    country: '美國',
    avatar: 'AT',
    status: 'available',
    specialties: ['Cleantech', '淨零轉型', '創新 ESG 策略', '影響力投資'],
    rating: 4.8,
    sessions: 156,
    bio: 'UC Berkeley Haas C2M（Cleantech to Market）計畫副主任，協助企業將清潔技術商業化，深具 ESG 創新策略與影響力投資實務經驗。',
    modules: ['健檢解讀', '揭露輔導', '1:1 Expert Hour'],
    languages: ['English', 'Español'],
    fee: '加購 NT$12,000/h'
  },
  {
    id: 'A004',
    name: '何日生 博士',
    nameEn: 'Dr. Rey-Sheng Her',
    title: '副執行長',
    org: '慈濟基金會',
    country: '台灣',
    avatar: 'RH',
    status: 'available',
    specialties: ['社會影響力', 'DEI', '社區共融', 'CSR 轉 ESG', '非營利 × 企業合作'],
    rating: 4.9,
    sessions: 287,
    bio: '慈濟基金會副執行長，長期推動企業社會責任與永續發展，是社會創新理論與實踐的重要先驅，具豐富的利害關係人參與與社區影響評估經驗。',
    modules: ['健檢解讀', '揭露輔導', '資料盤點', '1:1 Expert Hour'],
    languages: ['繁體中文', 'English'],
    fee: '規格內免費 (1h) / 加購 NT$8,000/h'
  },
  {
    id: 'A005',
    name: 'Chandra Vadhana Radhakrishnan',
    nameEn: 'Dr. Chandra Vadhana',
    title: 'Senior Lecturer / Stanford ESG Scholar',
    org: 'Monash University',
    country: '澳洲',
    avatar: 'CV',
    status: 'busy',
    specialties: ['ISSB S1/S2', 'TCFD', '氣候財務揭露', '東南亞 ESG', '永續治理'],
    rating: 4.8,
    sessions: 193,
    bio: 'Monash University 資深講師，Stanford ESG 學者，深耕 ISSB S1/S2 與 TCFD 氣候財務揭露領域，具豐富的企業 ESG 評級與報告書審閱經驗。',
    modules: ['揭露輔導', '客戶問卷/標案回覆', '1:1 Expert Hour'],
    languages: ['English', '中文'],
    fee: '加購 NT$12,000/h'
  },
  {
    id: 'A006',
    name: 'Ann-Kristin Zobel',
    nameEn: 'Prof. Ann-Kristin Zobel',
    title: 'Associate Professor of Management',
    org: 'University of St. Gallen',
    country: '瑞士',
    avatar: 'AZ',
    status: 'unavailable',
    specialties: ['企業永續策略', '循環經濟', '歐盟 CSRD', 'ESRS', 'ESG 治理'],
    rating: 4.7,
    sessions: 124,
    bio: 'St. Gallen 大學管理學副教授，專注企業永續策略與循環經濟，熟悉歐盟 CSRD/ESRS 揭露體系，是台灣企業進行歐洲市場 ESG 合規的重要顧問。',
    modules: ['揭露輔導', '1:1 Expert Hour'],
    languages: ['English', 'Deutsch'],
    fee: '加購 NT$18,000/h'
  },
];

export const AGENTS: Agent[] = [
  {
    id: 'AG001',
    name: '陳雅琳',
    code: 'SUSTAIN-2025-CYL',
    tier: 'platinum',
    region: '台北市',
    referrals: 47,
    goodCoins: 12450,
    joinDate: '2024-03-15',
    status: 'active',
    bio: '深耕台北科技業 ESG 推廣，專攻電子製造業供應鏈 ESG 轉型，累計協助 12 家上市公司導入永續治理。',
    specialties: ['電子製造', '供應鏈 ESG', 'GRI 2021']
  },
  {
    id: 'AG002',
    name: '林建宏',
    code: 'SUSTAIN-2025-LJH',
    tier: 'gold',
    region: '新竹縣',
    referrals: 31,
    goodCoins: 7800,
    joinDate: '2024-05-20',
    status: 'active',
    bio: '新竹科學園區 ESG 推廣大使，專注半導體與 IC 設計業永續轉型，擁有 SBTi 認定輔導經驗。',
    specialties: ['半導體', 'SBTi', 'TCFD']
  },
  {
    id: 'AG003',
    name: '王美華',
    code: 'SUSTAIN-2025-WMH',
    tier: 'gold',
    region: '台中市',
    referrals: 28,
    goodCoins: 6200,
    joinDate: '2024-06-10',
    status: 'active',
    bio: '中台灣中小企業 ESG 推廣先驅，協助傳統製造業了解並實施 ESG 轉型，擅長務實低成本 ESG 導入。',
    specialties: ['中小企業', '傳統製造', 'GHG 盤查']
  },
  {
    id: 'AG004',
    name: '張志遠',
    code: 'SUSTAIN-2025-CCV',
    tier: 'silver',
    region: '高雄市',
    referrals: 18,
    goodCoins: 3600,
    joinDate: '2024-08-01',
    status: 'active',
    bio: '南台灣石化與重工業 ESG 推廣，熟悉高碳排產業 CBAM 因應策略與碳費申報流程。',
    specialties: ['石化產業', 'CBAM', '碳費申報']
  },
  {
    id: 'AG005',
    name: '李佳芸',
    code: 'SUSTAIN-2025-LJY',
    tier: 'bronze',
    region: '台南市',
    referrals: 9,
    goodCoins: 1350,
    joinDate: '2024-10-15',
    status: 'active',
    bio: '台南食品與農業 ESG 推廣新銳，聚焦農業供應鏈碳足跡與食品安全永續揭露。',
    specialties: ['食品農業', 'SASB-FB', '供應鏈溯源']
  },
];

export const REFERRAL_CODES: ReferralCode[] = [
  {
    id: 'RC001',
    code: 'ALLIANCE-GREEN-2025',
    agentId: 'system',
    agentName: '永續聯盟官方',
    campaign: '永續聯盟春季推廣計畫',
    uses: 142,
    maxUses: 500,
    goodCoinReward: 200,
    bonusMultiplier: 1.5,
    status: 'active',
    expiresAt: '2025-12-31',
    createdAt: '2025-03-01'
  },
  {
    id: 'RC002',
    code: 'BERKELEY-ESG-2025',
    agentId: 'system',
    agentName: 'Berkeley × TSISDA 聯合推廣',
    campaign: 'Berkeley Haas 學員專屬碼',
    uses: 89,
    maxUses: 200,
    goodCoinReward: 350,
    bonusMultiplier: 2.0,
    status: 'active',
    expiresAt: '2025-09-30',
    createdAt: '2025-04-01'
  },
  {
    id: 'RC003',
    code: 'SME-TRANSFORM-25',
    agentId: 'AG001',
    agentName: '陳雅琳',
    campaign: '中小企業 ESG 轉型特別碼',
    uses: 33,
    maxUses: 100,
    goodCoinReward: 150,
    bonusMultiplier: 1.2,
    status: 'active',
    expiresAt: '2025-08-31',
    createdAt: '2025-05-01'
  },
];

export const GOODCOIN_REWARDS = [
  { coins: 100, title: '諮詢加值券 30 分鐘', desc: '兌換 30 分鐘顧問諮詢時間加值', category: '諮詢' },
  { coins: 200, title: '永續報告書審閱', desc: '一份報告書章節審閱建議', category: '服務' },
  { coins: 350, title: 'GRI 認證課程折抵 NT$1,000', desc: '兌換課程費用折抵', category: '課程' },
  { coins: 500, title: '1 小時 Expert Hour', desc: '一對一頂尖顧問諮詢 1 小時', category: '諮詢' },
  { coins: 800, title: 'ESG 健檢完整報告', desc: '完整企業 ESG 健檢報告書', category: '服務' },
  { coins: 1500, title: 'Berkeley 課程折抵 NT$5,000', desc: 'Berkeley × TSISDA 課程費用折抵', category: '課程' },
];

export const TIER_CONFIG: Record<AgentTier, { label: string; color: string; bg: string; minReferrals: number; multiplier: number; icon: string }> = {
  platinum: { label: '鉑金代理', color: '#4B0082', bg: '#F5F0FF', minReferrals: 40, multiplier: 3.0, icon: '💎' },
  gold: { label: '黃金代理', color: '#B8860B', bg: '#FFFBEB', minReferrals: 20, multiplier: 2.0, icon: '🥇' },
  silver: { label: '白銀代理', color: '#6B7280', bg: '#F9FAFB', minReferrals: 10, multiplier: 1.5, icon: '🥈' },
  bronze: { label: '銅牌代理', color: '#CD7F32', bg: '#FEF9F0', minReferrals: 1, multiplier: 1.0, icon: '🥉' },
};
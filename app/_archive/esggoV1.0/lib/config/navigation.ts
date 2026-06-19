import {
  LayoutDashboard,
  Building2,
  FileText,
  Binary,
  ShieldCheck,
  Bot,
  Lock,
  Settings,
  BookOpen,
  Library,
  Compass,
  CreditCard,
  FileBarChart,
  Eye,
  Globe,
  Database,
  Sparkles,
  Search,
  Layers,
  Share2,
  LogIn,
  Target,
  Users,
  FileSpreadsheet,
  Wind,
  Droplets,
  Zap,
  Trash2,
  LineChart,
  Activity,
  Award,
  Bell,
  HardHat,
  Heart,
  Briefcase,
  Cpu,
  Terminal,
  Unplug,
  BrainCircuit,
  Gamepad2
} from "lucide-react";

export interface NavItem {
  id: string;
  label: { zh: string; en: string; ja?: string };
  icon: any;
  completion: number;
  category?: string;
  hidden?: boolean;
}

export const NAVIGATION: NavItem[] = [
  // --- INTELLIGENCE HUB ---
  {
    id: "sovereign-dashboard",
    label: { zh: "主權儀表板", en: "Sovereign Hub", ja: "主権ハブ" },
    icon: ShieldCheck,
    completion: 100,
    category: "Intelligence"
  },
  {
    id: "business-intelligence",
    label: { zh: "商情偵察中心", en: "Intelligence Center", ja: "インテリジェンス・センター" },
    icon: Search,
    completion: 100,
    category: "Intelligence"
  },
  {
    id: "daily-briefing",
    label: { zh: "每日智能簡報", en: "Daily Intelligence", ja: "デイリー・インテリジェンス" },
    icon: Library,
    completion: 100,
    category: "Intelligence"
  },
  {
    id: "omni-ai",
    label: { zh: "AI 萬能助理", en: "Omni Assistant", ja: "Omniアシスタント" },
    icon: Bot,
    completion: 100,
    category: "Intelligence"
  },
  {
    id: "cora-intel",
    label: { zh: "Cora 智庫中心", en: "Cora Intelligence", ja: "Coraインテリジェンス" },
    icon: BrainCircuit,
    completion: 100,
    category: "Intelligence"
  },
  {
    id: "newsletters",
    label: { zh: "永續觀察電子報", en: "Newsletters", ja: "ニュースレター" },
    icon: Sparkles,
    completion: 100,
    category: "Intelligence"
  },
  {
    id: "zen-village",
    label: { zh: "善向永續村 (RPG)", en: "Zen Village (RPG)", ja: "善向の村 (RPG)" },
    icon: Gamepad2,
    completion: 100,
    category: "Intelligence"
  },

  // --- STRATEGIC CORE ---
  {
    id: "strategy-roadmap",
    label: { zh: "永續戰略藍圖", en: "Strategy Roadmap", ja: "戦略マップ" },
    icon: Compass,
    completion: 80,
    category: "Strategy",
    hidden: true
  },
  {
    id: "materiality-matrix",
    label: { zh: "重性分析矩陣", en: "Materiality Matrix", ja: "重要性マトリックス" },
    icon: Layers,
    completion: 70,
    category: "Strategy",
    hidden: true
  },
  {
    id: "alignment",
    label: { zh: "框架對齊引擎", en: "Alignment Engine", ja: "アライメント・エンジン" },
    icon: Target,
    completion: 100,
    category: "Strategy"
  },

  // --- CARBON & ENVIRONMENTAL ---
  {
    id: "carbon-footprint",
    label: { zh: "碳足跡看板", en: "Carbon Footprint", ja: "カーボンフットプリント" },
    icon: Activity,
    completion: 90,
    category: "Environment",
    hidden: true
  },
  {
    id: "scope-1-2",
    label: { zh: "範疇一二排放", en: "Scope 1 & 2", ja: "スコープ1・2" },
    icon: Wind,
    completion: 85,
    category: "Environment",
    hidden: true
  },
  {
    id: "scope3",
    label: { zh: "範疇三供應鏈", en: "Scope 3 Supply Chain", ja: "スコープ3サプライチェーン" },
    icon: Globe,
    completion: 100,
    category: "Environment"
  },
  {
    id: "energy-management",
    label: { zh: "能源管理中心", en: "Energy Management", ja: "エネルギー管理" },
    icon: Zap,
    completion: 75,
    category: "Environment",
    hidden: true
  },
  {
    id: "water-stewardship",
    label: { zh: "水資源管理", en: "Water Stewardship", ja: "水リソース管理" },
    icon: Droplets,
    completion: 60,
    category: "Environment",
    hidden: true
  },
  {
    id: "waste-circularity",
    label: { zh: "廢棄物與循環", en: "Waste & Circularity", ja: "廃棄物・循環性" },
    icon: Trash2,
    completion: 50,
    category: "Environment",
    hidden: true
  },

  // --- FORENSIC & COMPLIANCE ---
  {
    id: "audit-vault",
    label: { zh: "永續存證庫 (5T)", en: "Audit Vault (5T)", ja: "監査保管庫" },
    icon: ShieldCheck,
    completion: 100,
    category: "Governance"
  },
  {
    id: "forensics",
    label: { zh: "鑑識調查中心", en: "Forensic Unit", ja: "フォレンジック・ユニット" },
    icon: Binary,
    completion: 100,
    category: "Governance"
  },
  {
    id: "zkp-vault",
    label: { zh: "ZKP 隱私保險箱", en: "ZKP Privacy Vault", ja: "ZKPプライバシー" },
    icon: Lock,
    completion: 40,
    category: "Governance",
    hidden: true
  },
  {
    id: "regulatory-compliance",
    label: { zh: "法遵合規監測", en: "Regulatory Compliance", ja: "コンプライアンス" },
    icon: Search,
    completion: 65,
    category: "Governance",
    hidden: true
  },

  // --- PEOPLE & SOCIAL ---
  {
    id: "dei-dashboard",
    label: { zh: "多元平等包容", en: "DEI Dashboard", ja: "DEIダッシュボード" },
    icon: Users,
    completion: 70,
    category: "Social",
    hidden: true
  },
  {
    id: "safety-health",
    label: { zh: "職業安全健康", en: "Safety & Health", ja: "安全衛生" },
    icon: HardHat,
    completion: 80,
    category: "Social",
    hidden: true
  },
  {
    id: "labor-rights",
    label: { zh: "勞工權益檢查", en: "Labor Rights", ja: "労働者の権利" },
    icon: Briefcase,
    completion: 55,
    category: "Social",
    hidden: true
  },
  {
    id: "community-impact",
    label: { zh: "社會影響力", en: "Community Impact", ja: "社会貢献" },
    icon: Heart,
    completion: 45,
    category: "Social",
    hidden: true
  },

  // --- REPORTING EXCELLENCE ---
  {
    id: "esg-studio",
    label: { zh: "ESG Studio 數位中心", en: "ESG Studio", ja: "ESGスタジオ" },
    icon: FileText,
    completion: 100,
    category: "Reporting"
  },
  {
    id: "reading-room",
    label: { zh: "永續報告閱覽室", en: "Reading Room", ja: "閲覧室" },
    icon: BookOpen,
    completion: 100,
    category: "Reporting"
  },
  {
    id: "gri-standards",
    label: { zh: "GRI 標準導覽", en: "GRI Standards", ja: "GRI基準" },
    icon: BookOpen,
    completion: 95,
    category: "Reporting",
    hidden: true
  },
  {
    id: "sasb-metrics",
    label: { zh: "SASB 指標庫", en: "SASB Metrics", ja: "SASB指標" },
    icon: Database,
    completion: 85,
    category: "Reporting",
    hidden: true
  },
  {
    id: "csrd-esrs-hub",
    label: { zh: "CSRD/ESRS 中心", en: "CSRD/ESRS Hub", ja: "CSRDハブ" },
    icon: Share2,
    completion: 30,
    category: "Reporting",
    hidden: true
  },
  {
    id: "gri-import",
    label: { zh: "GRI 數據匯入", en: "GRI Import", ja: "GRIインポート" },
    icon: FileSpreadsheet,
    completion: 100,
    category: "Reporting"
  },

  // --- ECOSYSTEM & SQUAD ---
  {
    id: "squad",
    label: { zh: "戰術特遣中心", en: "ADK Squads", ja: "ADKスクワッド" },
    icon: Cpu,
    completion: 100,
    category: "System"
  },
  {
    id: "partner-portal",
    label: { zh: "合作夥伴門戶", en: "Partner Portal", ja: "パートナーポータル" },
    icon: Building2,
    completion: 20,
    category: "System",
    hidden: true
  },

  // --- PERFORMANCE & ANALYTICS ---
  {
    id: "esg-scoring",
    label: { zh: "ESG 績效評分", en: "ESG Scoring", ja: "ESGスコアリング" },
    icon: Award,
    completion: 85,
    category: "Analytics",
    hidden: true
  },
  {
    id: "benchmarking",
    label: { zh: "同業標竿分析", en: "Benchmarking", ja: "ベンチマーキング" },
    icon: LineChart,
    completion: 75,
    category: "Analytics",
    hidden: true
  },
  {
    id: "predictive-insights",
    label: { zh: "預測性洞察", en: "Predictive Insights", ja: "予測インサイト" },
    icon: Eye,
    completion: 40,
    category: "Analytics",
    hidden: true
  },

  // --- SYSTEM & DEV ---
  {
    id: "system-settings",
    label: { zh: "系統偏好設定", en: "System Settings", ja: "システム設定" },
    icon: Settings,
    completion: 90,
    category: "System",
    hidden: true
  },
  {
    id: "audit-logs",
    label: { zh: "系統審計日誌", en: "Audit Logs", ja: "監査ログ" },
    icon: Binary,
    completion: 80,
    category: "System",
    hidden: true
  },
  {
    id: "dev-portal-link",
    label: { zh: "開發者門戶", en: "Dev Portal", ja: "開発者ポータル" },
    icon: Terminal,
    completion: 100,
    category: "System"
  },
  {
    id: "subscription",
    label: { zh: "方案升級", en: "Upgrade", ja: "アップグレード" },
    icon: CreditCard,
    completion: 100,
    category: "System"
  },
  {
    id: "report-builder",
    label: { zh: "舊版中心", en: "Legacy Center", ja: "レガシー・センター" },
    icon: FileText,
    completion: 100,
    hidden: true
  }
];

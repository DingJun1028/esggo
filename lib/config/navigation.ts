import {
  Heart,
  LayoutDashboard,
  Building2,
  FileText,
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
  Users,
  Activity,
  Target,
  Truck,
  Landmark,
  HelpCircle,
  Mail,
  History,
  Table,
  Share2,
  Palette,
  Layout,
  Zap,
  Database,
  Map,
} from "lucide-react";

export const SECTION_LABELS: Record<string, { zh: string; en: string }> = {
  recon: { zh: "OMNI INTELLIGENCE (數據監測與洞察)", en: "Omni Intelligence" },
  settle: { zh: "DATA & VERIFICATION (數據蒐集與核查)", en: "Data & Verification" },
  evidence: { zh: "EVIDENCE VAULT (證據存證與追溯)", en: "Evidence Vault" },
  draft: { zh: "REPORT DRAFTING (永續報告產製)", en: "Report Drafting" },
  assets: { zh: "SYNERGIES (供應鏈與價值傳遞)", en: "Synergies" },
  system: { zh: "SYSTEM GOVERNANCE (系統治理)", en: "System Governance" },
};

export const NAVIGATION = [
  // --- 1. Omni Intelligence (Truth & Beauty) ---
  {
    id: "reconnaissance",
    section: "recon",
    label: { zh: "萬能戰情中心 (Omni Dashboard)", en: "Omni Dashboard" },
    icon: LayoutDashboard,
  },
  {
    id: "esg-metrics",
    section: "recon",
    label: { zh: "碳排指標管理 (Metrics Center)", en: "Metrics Center" },
    icon: Activity,
  },
  {
    id: "newsletter",
    section: "recon",
    label: { zh: "永續情報追蹤 (Oracle Feeds)", en: "Oracle Feeds" },
    icon: Mail,
  },

  // --- 2. Best Practice & Evidence (Trust) ---
  {
    id: "best-practice",
    section: "evidence",
    label: { zh: "最佳實踐 APP (Best Practice APP)", en: "Best Practice APP" },
    icon: ShieldCheck,
  },
  {
    id: "vault",
    section: "evidence",
    label: { zh: "區塊鏈證據金庫 (Evidence Vault)", en: "Evidence Vault" },
    icon: Lock,
  },
  {
    id: "omni-truth",
    section: "settle",
    label: { zh: "萬能數據核驗 (Omni QA)", en: "Omni QA" },
    icon: Table,
  },

  // --- 3. Report Drafting (Truth) ---
  {
    id: "reports",
    section: "draft",
    label: { zh: "智能織稿引擎 (Omni Drafter)", en: "Omni Drafter" },
    icon: FileText,
  },
  {
    id: "report-journey",
    section: "draft",
    label: { zh: "報告產製旅程 (Report Journey)", en: "Report Journey" },
    icon: Map,
  },
  {
    id: "materiality",
    section: "draft",
    label: { zh: "雙重重大性矩陣 (Materiality Matrix)", en: "Materiality Matrix" },
    icon: Target,
  },

  // --- 4. Synergies (Flow & Goodness) ---
  {
    id: "supply-chain",
    section: "assets",
    label: { zh: "綠色供應鏈協同 (Green Supply)", en: "Green Supply" },
    icon: Truck,
  },
  {
    id: "impact-nexus",
    section: "assets",
    label: { zh: "影響力樞紐 (Impact Nexus)", en: "Impact Nexus" },
    icon: Share2,
  },
  {
    id: "thankful-dashboard",
    section: "assets",
    label: { zh: "社會共好 RPG (Social RPG)", en: "Social RPG" },
    icon: Heart,
  },

  // --- 5. Knowledge & Governance (System) ---
  {
    id: "omni-thinktank",
    section: "system",
    label: { zh: "萬能智庫 (Omni ThinkTank)", en: "Omni ThinkTank" },
    icon: Library,
  },
  {
    id: "omni-note",
    section: "system",
    label: { zh: "悟作 AI 筆記 (Omni WuZuo)", en: "Omni WuZuo" },
    icon: BookOpen,
  },
  {
    id: "settings",
    section: "system",
    label: { zh: "系統設定 (System Settings)", en: "System Settings" },
    icon: Settings,
  },
];


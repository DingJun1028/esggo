
import { View } from './types';
import {
  Home, Bot, Network, GraduationCap,
  ChevronRight, Zap, Command, Code,
  Globe, DollarSign, Database,
  Settings, Binary, ListTodo, StickyNote, Target,
  Crown, Wallet, Users, User, Sun, Moon, Laptop, FileCode, Sparkles,
  Activity, BarChart3, Award, SlidersHorizontal, Component, Briefcase,
  Factory, BrainCircuit, UserCheck, ShieldCheck, Library, Heart,
  Crosshair, GitMerge, FileText, Microscope, Star, Route, Share2,
  Building2, HardHat, Package, Puzzle, Wrench, Trophy, BookOpen, KeyRound,
  LayoutDashboard, LineChart, Handshake, Landmark, Scale, Recycle, Eye, Info,
  FolderKanban, Wrench as CreatorIcon
} from 'lucide-react';

export interface NavItem {
  id: View;
  icon: React.ElementType;
  label: string;
  zh_label: string;
}

export interface NavSector {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSector[] = [
  {
    title: 'CMD',
    items: [
      { id: View.MY_ESG, icon: Home, label: 'Cockpit', zh_label: '北極星' },
      { id: View.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', zh_label: '儀表板' },
      { id: View.UNIVERSAL_NOTES, icon: StickyNote, label: 'Notes', zh_label: '筆記' },
      { id: View.USER_JOURNAL, icon: BookOpen, label: 'Journal', zh_label: '日誌' },
      { id: View.AGENT_TASKS, icon: ListTodo, label: 'Tasks', zh_label: '任務' },
      { id: View.CARD_GAME_ARENA_NEW, icon: Target, label: 'ESG Arena', zh_label: 'ESG競技場' },
    ]
  },
  {
    title: 'ESG',
    items: [
      { id: View.REGENERATIVE, icon: Recycle, label: 'Regenerative', zh_label: '再生模型' },
      { id: View.CARBON, icon: Factory, label: 'Carbon Asset', zh_label: '碳資產' },
      { id: View.CARBON_WALLET, icon: Wallet, label: 'Carbon Wallet', zh_label: '碳錢包' },
      { id: View.IMPACT_PROJECTS, icon: Heart, label: 'Impact', zh_label: '影響力專案' },
      { id: View.REPORT, icon: FileText, label: 'Report Gen', zh_label: '報告生成' },
      { id: View.ECOSYSTEM_RADAR, icon: Eye, label: 'Ecosystem', zh_label: '生態雷達' },
      { id: View.GOODWILL, icon: Award, label: 'Goodwill', zh_label: '善意幣' },
    ]
  },
  {
    title: 'BIZ',
    items: [
      { id: View.BUSINESS_INTEL, icon: Globe, label: 'AMICE', zh_label: '商業智能' },
      { id: View.FINANCE, icon: DollarSign, label: 'Finance', zh_label: '財務' },
      { id: View.STRATEGY, icon: Route, label: 'Strategy', zh_label: '策略' },
      { id: View.MARKETING_STRATEGY, icon: LineChart, label: 'Marketing', zh_label: '市場策略' },
      { id: View.SUPPLIER_CRM, icon: Users, label: 'Supplier CRM', zh_label: '供應商關係' },
      { id: View.ENTERPRISE_SERVICES, icon: Building2, label: 'Enterprise', zh_label: '企業服務' },
      { id: View.PARTNER_PORTAL, icon: Handshake, label: 'Partners', zh_label: '合作夥伴' },
      { id: View.AFFILIATE, icon: Share2, label: 'Affiliate', zh_label: '推薦計畫' },
    ]
  },
  {
    title: 'AI',
    items: [
        { id: View.HYPERCUBE_LAB, icon: BrainCircuit, label: 'AI Lab', zh_label: 'AI 實驗室' },
        { id: View.RESEARCH_HUB, icon: Microscope, label: 'RAG', zh_label: '研究中心' },
        { id: View.AGENT_ARENA, icon: Bot, label: 'Agent Arena', zh_label: '智能體競技場' },
        { id: View.AGENT_TRAINING, icon: Star, label: 'Training', zh_label: '智能體訓練' },
        { id: View.SOUL_FORGE, icon: Sparkles, label: 'Soul Forge', zh_label: '數位靈魂熔爐' },
        { id: View.PROXY_MARKET, icon: Package, label: 'Proxy Market', zh_label: '代理市場' },
        { id: View.UNIVERSAL_CREATOR_DASHBOARD, icon: CreatorIcon, label: 'Creator Hub', zh_label: 'Creator Control Center' },
    ]
  },
  {
    title: 'SYS',
    items: [
      { id: View.ACADEMY, icon: GraduationCap, label: 'Academy', zh_label: '學院' },
      { id: View.TECHNICAL_DOCS, icon: FileCode, label: 'Docs', zh_label: '聖典' },
      { id: View.LIBRARY, icon: Library, label: 'Library', zh_label: '圖書館' },
      { id: View.SETTINGS, icon: Settings, label: 'Config', zh_label: '設定' },
      { id: View.ADMIN_PANEL, icon: Crown, label: 'Admin', zh_label: '管理端' },
      { id: View.MCP_CONFIG, icon: SlidersHorizontal, label: 'MCP Config', zh_label: 'MCP設定' },
      { id: View.HEALTH_CHECK, icon: Heart, label: 'Health', zh_label: '健康檢查' },
      { id: View.DIAGNOSTICS, icon: Wrench, label: 'Diagnostics', zh_label: '診斷' },
    ]
  },
  {
    title: 'DEV',
    items: [
      { id: View.API_ZONE, icon: Code, label: 'API Zone', zh_label: 'API區域' },
      { id: View.UNIVERSAL_BACKEND, icon: Component, label: 'U-Backend', zh_label: '通用後端' },
      { id: View.UNIVERSAL_TOOLS, icon: Wrench, label: 'U-Tools', zh_label: '通用工具' },
      { id: View.UNIVERSAL_SYSTEM, icon: Puzzle, label: 'U-System', zh_label: '通用系統' },
      { id: View.WORKFLOW_LAB, icon: GitMerge, label: 'Workflow Lab', zh_label: '工作流實驗室' },
      { id: View.FLOWLU_INTEGRATION, icon: Share2, label: 'Flowlu', zh_label: 'Flowlu整合' },
      { id: View.INTEGRATION, icon: Puzzle, label: 'Integrations', zh_label: '整合中心' },
      { id: View.AUDIT, icon: ShieldCheck, label: 'Audit', zh_label: '審計追蹤' },
    ]
  },
  {
      title: 'ZONE',
      items: [
        { id: View.ADAN_ZONE, icon: UserCheck, label: 'Adan Zone', zh_label: 'Adan區域' },
        { id: View.YANG_BO, icon: User, label: 'YangBo Zone', zh_label: 'YangBo區域' },
        { id: View.ALUMNI_ZONE, icon: Users, label: 'Alumni Zone', zh_label: '校友區域' },
        { id: View.THINK_TANK, icon: BrainCircuit, label: 'Think Tank', zh_label: '智庫' },
        { id: View.GLOBAL_OPS, icon: Globe, label: 'Global Ops', zh_label: '全球運營' },
      ]
  },
  {
      title: 'MISC',
      items: [
        { id: View.TALENT, icon: Trophy, label: 'Talent', zh_label: '人才庫' },
        { id: View.CULTURE, icon: Landmark, label: 'Culture', zh_label: '文化' },
        { id: View.VAULT, icon: KeyRound, label: 'Vault', zh_label: '個人金庫' },
        { id: View.ABOUT_US, icon: Info, label: 'About', zh_label: '關於我們' },
        { id: View.SUPPLIER_SURVEY, icon: ListTodo, label: 'Supplier Survey', zh_label: '供應商問卷' },
        { id: View.PALACE, icon: Crown, label: 'Palace', zh_label: '殿堂' },
        { id: View.RESTORATION, icon: Wrench, label: 'Restoration', zh_label: '恢復' },
        { id: View.CARD_GAME_ARENA, icon: Target, label: 'Card Game', zh_label: '卡牌遊戲' },
      ]
  }
];

export const allNavItems: NavItem[] = navigationConfig.flatMap(sector => sector.items);

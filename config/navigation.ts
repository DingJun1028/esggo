// config/navigation.ts

export type Role = 'ADMIN' | 'CSO' | 'PM' | 'DATA_ENTRY' | 'AUDITOR' | 'IT_OPS';

export interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: string; // Corresponding to Lucide Icons or atomic component icon names
  requiredRoles?: Role[]; // If not set, applies to all roles
  sub?: string; // Short subtitle for UI clarity
}

export interface NavGroup {
  groupId: string;
  groupTitle: string;
  items: NavItem[];
}

// 📌 Core Navigation Settings (SaaS User Journey)
export const SaaS_NAVIGATION: NavGroup[] = [
  {
    groupId: 'favorites',
    groupTitle: '⭐ 我的最愛 (Favorites)',
    items: [
      { id: 'fav-dashboard', title: '全域控制台', path: '/', icon: 'LayoutDashboard', sub: 'Overview' },
    ],
  },
  {
    groupId: 'onboard',
    groupTitle: '0. 觀測與啟航 (Observe & Onboard)',
    items: [
      { id: 'dashboard', title: '全域控制台', path: '/', icon: 'LayoutDashboard', sub: 'Overview' },
      { id: 'profile', title: '企業管理', path: '/profile', icon: 'Building2', sub: 'Profile' },
      { id: 'api-setup', title: '整合中心', path: '/api-setup', icon: 'Link', sub: 'Integrations' },
      { id: 'data-sources', title: '資料來源', path: '/data-sources', icon: 'Database', sub: 'Data Hub' },
      { id: 'templates', title: '專家模板', path: '/templates', icon: 'LayoutTemplate', sub: 'Templates' },
    ],
  },
  {
    groupId: 'strategize',
    groupTitle: '1. 評估與佈局 (Assess & Strategize)',
    items: [
      { id: 'health-check', title: '企業健檢', path: '/health-check', icon: 'Stethoscope', sub: 'Health' },
      { id: 'materiality', title: '重大性矩陣', path: '/materiality', icon: 'ScatterChart', sub: 'Materiality' },
      { id: 'roadmap', title: '淨零路徑', path: '/roadmap', icon: 'Map', sub: 'Roadmap' },
      { id: 'tasks', title: '任務中心', path: '/tasks', icon: 'CheckSquare', sub: 'Tasks' },
      { id: 'document-checklist', title: '文件清單', path: '/document-checklist', icon: 'FileCheck', sub: 'Documents' },
    ],
  },
  {
    groupId: 'collect',
    groupTitle: '2. 行動與採集 (Act & Collect)',
    items: [
      { id: 'environmental', title: '環境指揮', path: '/environmental', icon: 'Leaf', sub: 'Environmental' },
      { id: 'social', title: '社會影響', path: '/social', icon: 'Users', sub: 'Social' },
      { id: 'governance', title: '公司治理', path: '/governance', icon: 'Landmark', sub: 'Governance' },
      { id: 'cbam-calculator', title: 'CBAM 計算機', path: '/cbam-calculator', icon: 'Calculator', sub: 'CBAM' },
      { id: 'supply-chain', title: '供應鏈透明', path: '/supply-chain', icon: 'Truck', sub: 'Supply Chain' },
      { id: 'stakeholders', title: '利害關係人', path: '/stakeholders', icon: 'HeartHandshake', sub: 'Stakeholders' },
    ],
  },
  {
    groupId: 'draft',
    groupTitle: '3. 洞察與成卷 (Analyze & Draft)',
    items: [
      { id: 'editor', title: 'SustainWrite 編輯器', path: '/editor', icon: 'PenTool', sub: 'Editor' },
      { id: 'advisory', title: '專家諮詢', path: '/advisory', icon: 'MessageSquare', sub: 'Advisory' },
      { id: 'intelligence', title: '商情中心', path: '/intelligence', icon: 'Globe', sub: 'Intelligence' },
      { id: 'compliance-check', title: '合規檢查', path: '/compliance-check', icon: 'ShieldAlert', sub: 'Compliance' },
    ],
  },
  {
    groupId: 'verify',
    groupTitle: '4. 驗證與信任 (Verify & Trust)',
    items: [
      { id: 'vault', title: '證據金庫', path: '/vault', icon: 'Vault', sub: 'Evidence Vault' },
      { id: 'audit-log', title: '審計日誌', path: '/audit-log', icon: 'History', sub: 'Audit Log' },
      { id: 'proof-center', title: '誠信證明', path: '/proof-center', icon: 'BadgeCheck', sub: 'Trust Proof' },
      { id: 'audit-verify', title: 'VerifyLink™', path: '/audit-verify', icon: 'Link2', sub: 'Verification' },
    ],
  },
  {
    groupId: 'evolve',
    groupTitle: '5. 發表與成長 (Publish & Evolve)',
    items: [
      { id: 'publish', title: '報告發佈', path: '/publish', icon: 'Send', sub: 'Publish' },
      { id: 'library', title: '永續智庫', path: '/library', icon: 'Library', sub: 'Library' },
      { id: 'reading-room', title: '永續閱覽室', path: '/reading-room', icon: 'BookOpen', sub: 'Reading' },
      { id: 'finance', title: '永續財務', path: '/finance', icon: 'PieChart', sub: 'Finance' },
      { id: 'academy', title: '永續學院', path: '/academy', icon: 'GraduationCap', sub: 'Academy' },
      { id: 'advisors', title: '顧問專區', path: '/advisors', icon: 'Briefcase', sub: 'Advisors' },
    ],
  },
  {
    groupId: 'omni',
    groupTitle: '6. 萬能治理 (Omni Governance)',
    items: [
      { id: 'soul', title: '系統靈魂', path: '/soul', icon: 'Flame', sub: 'Supreme Will' },
      { id: 'omnispace', title: '共振空間', path: '/omnispace', icon: 'Globe', sub: 'Resonance' },
      { id: 'agents', title: '代理專區', path: '/agents', icon: 'Network', sub: 'Agents' },
      { id: 'digital-twin', title: '數位分身', path: '/digital-twin', icon: 'Dna', sub: 'Digital Twin' },
    ],
  },
];

// 🔧 Hidden Navigation Settings (Super Admin / IT Ops)
export const IT_OPS_NAVIGATION: NavGroup[] = [
  {
    groupId: 'super-admin',
    groupTitle: '👑 超級管理員區 (Super Admin)',
    items: [
      { id: 'ai-platform', title: 'AI 整合平台', path: '/ai-platform', icon: 'Cpu', sub: 'AI OS' },
      { id: 'swarm', title: '代理蜂群', path: '/swarm', icon: 'Share2', sub: 'Swarm' },
      { id: 'system-status', title: '系統狀態', path: '/system-status', icon: 'Activity', sub: 'Status' },
      { id: 'system-test', title: '系統測試', path: '/system-test', icon: 'TestTube', sub: 'Test' },
      { id: 'terminal', title: '終端主控', path: '/terminal', icon: 'TerminalSquare', sub: 'CLI' },
      { id: 'design-library', title: '設計圖書館', path: '/design-library', icon: 'Palette', sub: 'Design' },
      { id: 'walkthrough', title: '系統導覽', path: '/walkthrough', icon: 'Rocket', sub: 'Guide' },
    ],
  },
];

import { View, ServiceModule, SubscriptionTier, ServiceItem } from '../types/core';

/**
 * 💡 全系統服務清單 (System Service Inventory)
 * --------------------------------------------------
 * 依據 MECE 原則將功能模組化，定義程序與體驗路徑。
 */
export const SERVICE_INVENTORY: ServiceItem[] = [
  // --- MODULE: COGNITIVE (感知智能) ---
  {
    id: View.BENTO_DASHBOARD,
    name: '我的 ESG (My ESG)',
    module: ServiceModule.COGNITIVE,
    tier_required: SubscriptionTier.FREE,
    procedure: ['Fetch Omni Truth', 'Normalize via AI', 'Render Bento Grid'],
    cej_step: 'Initial Awareness',
  },
  {
    id: View.NEWS,
    name: 'ESG 每日一報 (Daily Report)',
    module: ServiceModule.COGNITIVE,
    tier_required: SubscriptionTier.FREE,
    procedure: ['Aggregate Global News', 'AI Summarization', 'Daily Briefing'],
    cej_step: 'Informed Awareness',
  },
  {
    id: View.AMICE_DASHBOARD,
    name: 'AI Strategy Hub',
    module: ServiceModule.COGNITIVE,
    tier_required: SubscriptionTier.SUBSCRIBER,
    procedure: ['Query Gemini-2.0', 'Apply ESG Context', 'Generate Narrative'],
    cej_step: 'Strategic Enlightenment',
  },

  // --- MODULE: EXCELLENCE (卓越永續) ---
  {
    id: View.TACTICAL,
    name: '企業健檢專區 (Corporate Health)',
    module: ServiceModule.COGNITIVE,
    tier_required: SubscriptionTier.SUBSCRIBER,
    procedure: ['Scan Corporate Vitals', 'Analyze Risk Nodes', 'Generate Health Score'],
    cej_step: 'Diagnosis',
  },
  {
    id: View.RESTORATION,
    name: 'Impact Restoration Lab',
    module: ServiceModule.EXCELLENCE,
    tier_required: SubscriptionTier.SOVEREIGN,
    procedure: ['Define Impact Area', 'Simulate Recovery', 'Anchor Proof'],
    cej_step: 'Systemic Healing',
  },

  // --- MODULE: GOVERNANCE (誠信治理) ---
  {
    id: View.DISCLOSURE,
    name: '永續報告書撰寫平台 (一鍵完成)',
    module: ServiceModule.GOVERNANCE,
    tier_required: SubscriptionTier.SUBSCRIBER,
    procedure: ['Aggregate Verification Data', 'Apply GRI Standard', 'One-Click Generation'],
    cej_step: 'Regulatory Alignment',
  },
  {
    id: View.EVIDENCE_VAULT,
    name: 'Immutable Evidence Vault',
    module: ServiceModule.GOVERNANCE,
    tier_required: SubscriptionTier.SUBSCRIBER,
    procedure: ['Upload Source', 'Lock SHA-256', 'Anchor to Chain'],
    cej_step: 'Foundational Trust',
  },
  {
    id: View.TALENT_PASSPORT,
    name: 'Integrity Passport',
    module: ServiceModule.GOVERNANCE,
    tier_required: SubscriptionTier.FREE,
    procedure: ['Crystallize 5T (5 Can)', 'Generate Trust Badge', 'Activate QR'],
    cej_step: 'Verified Identity',
  },

  // --- MODULE: AGENCY (自主代行) ---
  {
    id: View.AGENT_FORGE,
    name: 'AI RPG 養成室 (Agent Forge)',
    module: ServiceModule.AGENCY,
    tier_required: SubscriptionTier.SOVEREIGN,
    procedure: ['Define Persona', 'Inject Logic Hook', 'Spawn RPG Sentinel'],
    cej_step: 'Autonomous Empowerment',
  },
  {
    id: View.OMNI_TASKS,
    name: 'Mission Matrix',
    module: ServiceModule.AGENCY,
    tier_required: SubscriptionTier.FREE,
    procedure: ['List Missions', 'Authorize Execution', 'Confirm Canonicalization'],
    cej_step: 'Active Participation',
  },

  // --- MODULE: ECOSYSTEM (合力共生) ---
  {
    id: View.PARTNER_PORTAL,
    name: '聯盟同盟陣線 (Alliance Front)',
    module: ServiceModule.ECOSYSTEM,
    tier_required: SubscriptionTier.SUBSCRIBER,
    procedure: ['Invite Entity', 'Shared Vault Access', 'Joint Alliance Report'],
    cej_step: 'Omni Symbiosis',
  },
  {
    id: View.ACADEMY,
    name: '國際柏克萊大學永續人才培力認證課程',
    module: ServiceModule.ECOSYSTEM,
    tier_required: SubscriptionTier.FREE,
    procedure: ['Select Course', 'Interactive Quiz', 'Award Mastery XP'],
    cej_step: 'Wisdom Sharing',
  },
];

/**
 * 💡 協助工具：檢查是否有權限近用服務
 */
export const hasServiceAccess = (viewId: View, userTier: SubscriptionTier): boolean => {
  const service = SERVICE_INVENTORY.find(s => s.id === viewId);
  if (!service) return true; // Default allow for non-modularized views

  const tierWeights = {
    [SubscriptionTier.FREE]: 0,
    [SubscriptionTier.PLUS]: 1,
    [SubscriptionTier.SUBSCRIBER]: 2,
    [SubscriptionTier.PRO]: 3,
    [SubscriptionTier.SOVEREIGN]: 4,
  };

  return tierWeights[userTier] >= tierWeights[service.tier_required];
};

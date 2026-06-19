/**
 * Phase 48: Sovereign Master Architecture
 * [English-Coded, End-to-End Matrix]
 */

export type ServiceStatus = 'Trustworthy' | 'Validating' | 'Pending';

export interface IEvidence {
  hash: string;
  timestamp: number;
  sourceOrigin: string;
  formula?: string; // e.g., [ISO-14064-1]
}

/**
 * 💡 Core Algorithm: Goodness Sustainability 5T Logic Gate (The 5T Logic Gate)
 */
export interface IComponentCore {
  readonly uuid: string; // Omni Eternal Memory Subject Unique Identifier
  readonly name: string;
  readonly status: ServiceStatus;
  readonly evidence: IEvidence; // Evidence Vault (Contains 5T verification metadata)
  readonly category: ServiceCategory;
}

export type ServiceCategory =
  | 'Cognitive' // Cognitive Intelligence
  | 'Excellence' // Excellence & Sustainability
  | 'Governance' // Governance & Compliance
  | 'Agency' // Intelligent Agency
  | 'Ecosystem'; // Ecosystem Collaboration

export interface ServiceDefinition extends IComponentCore {
  path: string;
  description: string;
  icon: string;
}

export const ESG_SERVICES_REGISTRY: ServiceDefinition[] = [
  // 1. Cognitive Intelligence (5)
  {
    uuid: 'svc-cog-001',
    name: 'Personal ESG Dashboard',
    category: 'Cognitive',
    status: 'Trustworthy',
    path: '/dashboard/personal',
    icon: 'LayoutDashboard',
    description: 'Provides personalized ESG data visualization and monitoring center',
    evidence: { hash: 'h1...', timestamp: Date.now(), sourceOrigin: 'System/Core' },
  },
  {
    uuid: 'svc-cog-002',
    name: 'AI Strategy Hub',
    category: 'Cognitive',
    status: 'Trustworthy',
    path: '/strategy/ai',
    icon: 'BrainCircuit',
    description: 'Provides AI-driven ESG strategy insights and recommendations',
    evidence: { hash: 'h2...', timestamp: Date.now(), sourceOrigin: 'Gemini/Internal' },
  },
  {
    uuid: 'svc-cog-003',
    name: 'Daily ESG Briefing',
    category: 'Cognitive',
    status: 'Trustworthy',
    path: '/briefing/daily',
    icon: 'Newspaper',
    description: 'Provides daily ESG news aggregation and intelligent analysis',
    evidence: { hash: 'h3...', timestamp: Date.now(), sourceOrigin: 'MarketIntelligence' },
  },
  {
    uuid: 'svc-cog-004',
    name: 'ESG AI Assistant',
    category: 'Cognitive',
    status: 'Trustworthy',
    path: '/ai/assistant',
    icon: 'MessageSquare',
    description: 'Provides 24/7 professional ESG consultation and Q&A',
    evidence: { hash: 'h4...', timestamp: Date.now(), sourceOrigin: 'OmniAgent' },
  },
  {
    uuid: 'svc-cog-005',
    name: 'Trend Prediction Engine',
    category: 'Cognitive',
    status: 'Trustworthy',
    path: '/ai/prediction',
    icon: 'TrendingUp',
    description: 'Provides ESG trend forecasting and risk warnings',
    evidence: { hash: 'h5...', timestamp: Date.now(), sourceOrigin: 'PredictiveCore' },
  },

  // 2. Excellence & Sustainability (5)
  {
    uuid: 'svc-exc-001',
    name: 'Corporate Health Check',
    category: 'Excellence',
    status: 'Trustworthy',
    path: '/health/corporate',
    icon: 'Activity',
    description: 'Comprehensively assesses corporate ESG health and risks',
    evidence: { hash: 'h6...', timestamp: Date.now(), sourceOrigin: 'Audit/Engine' },
  },
  {
    uuid: 'svc-exc-002',
    name: 'Carbon Inventory Management',
    category: 'Excellence',
    status: 'Trustworthy',
    path: '/carbon/inventory',
    icon: 'CloudFog',
    description: 'Complete greenhouse gas emission tracking and management',
    evidence: {
      hash: 'h7...',
      timestamp: Date.now(),
      sourceOrigin: 'ISO-14064-1',
      formula: 'Emission = Activity * Factor',
    },
  },
  {
    uuid: 'svc-exc-003',
    name: 'Impact Restoration Lab',
    category: 'Excellence',
    status: 'Trustworthy',
    path: '/restoration/lab',
    icon: 'FlaskConical',
    description: 'Environmental impact restoration and systemic recovery',
    evidence: { hash: 'h8...', timestamp: Date.now(), sourceOrigin: 'SelfHealingService' },
  },
  {
    uuid: 'svc-exc-004',
    name: 'Sustainability Transformation Advisor',
    category: 'Excellence',
    status: 'Trustworthy',
    path: '/advisor/transformation',
    icon: 'Map',
    description: 'Guides companies through comprehensive sustainability transformation',
    evidence: { hash: 'h9...', timestamp: Date.now(), sourceOrigin: 'ExpertSystem' },
  },
  {
    uuid: 'svc-exc-005',
    name: 'Green Financing Assistant',
    category: 'Excellence',
    status: 'Trustworthy',
    path: '/finance/green',
    icon: 'Banknote',
    description: 'Assists companies in obtaining green financing and investment',
    evidence: { hash: 'h10...', timestamp: Date.now(), sourceOrigin: 'FinancialHub' },
  },

  // 3. Governance & Compliance (5)
  {
    uuid: 'svc-gov-001',
    name: 'Automated Report Generation',
    category: 'Governance',
    status: 'Trustworthy',
    path: '/gov/reporting',
    icon: 'FileText',
    description: 'Generate international standard ESG reports with one click',
    evidence: { hash: 'h11...', timestamp: Date.now(), sourceOrigin: 'ReportingEngine' },
  },
  {
    uuid: 'svc-gov-002',
    name: 'Evidence Vault',
    category: 'Governance',
    status: 'Trustworthy',
    path: '/gov/vault',
    icon: 'Lock',
    description: 'Secure and verifiable storage for ESG evidence documents',
    evidence: { hash: 'h12...', timestamp: Date.now(), sourceOrigin: 'ImpactLedger' },
  },
  {
    uuid: 'svc-gov-003',
    name: 'Integrity Passport',
    category: 'Governance',
    status: 'Trustworthy',
    path: '/gov/passport',
    icon: 'Contact',
    description: 'Personal ESG profile and trust verification system',
    evidence: { hash: 'h13...', timestamp: Date.now(), sourceOrigin: 'IdentityService' },
  },
  {
    uuid: 'svc-gov-004',
    name: 'Compliance Risk Monitoring',
    category: 'Governance',
    status: 'Trustworthy',
    path: '/gov/risk',
    icon: 'ShieldAlert',
    description: 'Real-time monitoring of ESG compliance risks and alerts',
    evidence: { hash: 'h14...', timestamp: Date.now(), sourceOrigin: 'ComplianceGuard' },
  },
  {
    uuid: 'svc-gov-005',
    name: 'Board Dashboard',
    category: 'Governance',
    status: 'Trustworthy',
    path: '/gov/board',
    icon: 'PieChart',
    description: 'ESG governance decision support for senior management',
    evidence: { hash: 'h15...', timestamp: Date.now(), sourceOrigin: 'DecisionSupport' },
  },

  // 4. Agency & Automation (4)
  {
    uuid: 'svc-age-001',
    name: 'AI Agent Forge',
    category: 'Agency',
    status: 'Trustworthy',
    path: '/agency/forge',
    icon: 'Hammer',
    description: 'Create and deploy autonomous ESG task agents',
    evidence: { hash: 'h16...', timestamp: Date.now(), sourceOrigin: 'AgentCore' },
  },
  {
    uuid: 'svc-age-002',
    name: 'Mission Matrix',
    category: 'Agency',
    status: 'Trustworthy',
    path: '/agency/matrix',
    icon: 'Grid',
    description: 'Mission management and execution system',
    evidence: { hash: 'h17...', timestamp: Date.now(), sourceOrigin: 'TaskScheduler' },
  },
  {
    uuid: 'svc-age-003',
    name: 'Intelligent Workflow',
    category: 'Agency',
    status: 'Trustworthy',
    path: '/agency/workflow',
    icon: 'GitBranch',
    description: 'Automated ESG business process management',
    evidence: { hash: 'h18...', timestamp: Date.now(), sourceOrigin: 'WorkflowEngine' },
  },
  {
    uuid: 'svc-age-004',
    name: 'Smart Notification System',
    category: 'Agency',
    status: 'Trustworthy',
    path: '/agency/notifications',
    icon: 'Bell',
    description: 'Intelligent ESG-related message push and management',
    evidence: { hash: 'h19...', timestamp: Date.now(), sourceOrigin: 'NotificationHub' },
  },

  // 5. Ecosystem & Collaboration (5)
  {
    uuid: 'svc-eco-001',
    name: 'Partner Alliance Portal',
    category: 'Ecosystem',
    status: 'Trustworthy',
    path: '/eco/partners',
    icon: 'Users',
    description: 'Multi-organization collaboration and alliance management',
    evidence: { hash: 'h20...', timestamp: Date.now(), sourceOrigin: 'AllianceService' },
  },
  {
    uuid: 'svc-eco-002',
    name: 'Berkeley Certification Academy',
    category: 'Ecosystem',
    status: 'Trustworthy',
    path: '/eco/academy',
    icon: 'GraduationCap',
    description: 'ESG education and certification platform',
    evidence: { hash: 'h21...', timestamp: Date.now(), sourceOrigin: 'EducationPortal' },
  },
  {
    uuid: 'svc-eco-003',
    name: 'Supply Chain Collaboration Platform',
    category: 'Ecosystem',
    status: 'Trustworthy',
    path: '/eco/supply-chain',
    icon: 'Truck',
    description: 'Supply chain ESG collaboration and management',
    evidence: { hash: 'h22...', timestamp: Date.now(), sourceOrigin: 'SupplyChainHub' },
  },
  {
    uuid: 'svc-eco-004',
    name: 'Investor Relations Platform',
    category: 'Ecosystem',
    status: 'Trustworthy',
    path: '/eco/ir',
    icon: 'Briefcase',
    description: 'ESG investor relations management and communication',
    evidence: { hash: 'h23...', timestamp: Date.now(), sourceOrigin: 'IR_System' },
  },
  {
    uuid: 'svc-eco-005',
    name: 'Community Impact Network',
    category: 'Ecosystem',
    status: 'Trustworthy',
    path: '/eco/community',
    icon: 'Globe',
    description: 'Build ESG community influence and knowledge sharing',
    evidence: { hash: 'h24...', timestamp: Date.now(), sourceOrigin: 'SocialGraph' },
  },
];

export const serviceRegistry = {
  getServices: () => ESG_SERVICES_REGISTRY,
  getServiceByUuid: (uuid: string) => ESG_SERVICES_REGISTRY.find(s => s.uuid === uuid),
};

// Freeze the registry to ensure Trustworthy status (No mutations)
Object.freeze(ESG_SERVICES_REGISTRY);
ESG_SERVICES_REGISTRY.forEach(svc => Object.freeze(svc));

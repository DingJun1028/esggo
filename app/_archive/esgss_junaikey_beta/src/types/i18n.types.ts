/**
 * 🌍 i18n Type System
 * --------------------------------------------------
 * [Function] Type-safe translation key system
 * [Features] Auto-completion, compile-time checks, nested namespaces
 */

/** Supported Language Types */
export type Language = 'zh-TW' | 'en-US' | 'ko-KR';

/** 💎 Bi-directional Localized String */
export interface ILocalizedString {
  'zh-TW': string;
  'en-US': string;
  'ko-KR': string;
}

/** Translation Namespace - System Core */
export interface SystemTranslations {
  title: string;
  subtitle: string;
  version: string;
  welcome: string;
  loading: string;
  error: string;
  success: string;
}


export interface DashboardHealthTranslations {
  title: string;
  subtitle: string;
  environment: string;
  social: string;
  governance: string;
  trends: string;
  activity: string;
  quickActions: string;
  accessTools: string;
  viewAll: string;
  actionGenerateReport: string;
  actionRiskAssessment: string;
  actionImpactVillage: string;
  actionIntelCenter: string;
}

/** Translation Namespace - Dashboard */
export interface DashboardTranslations {
  overview: string;
  emissions: string;
  mentorship: string;
  analytics: string;
  reports: string;
  health: DashboardHealthTranslations;
}

/** Translation Namespace - Collaboration */
export interface CollaborationTranslations {
  supplyChain: string;
  dataRoom: string;
  sovereignty: string;
  disclosure: string;
  partners: string;
}

/** Translation Namespace - Compliance */
export interface ComplianceTranslations {
  standards: string;
  reporting: string;
  verification: string;
  audit: string;
  certification: string;
}

/** Translation Namespace - UI Components */
export interface UITranslations {
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  confirm: string;
  close: string;
  next: string;
  previous: string;
  submit: string;
  search: string;
}

/** Translation Namespace - Error Messages */
export interface ErrorTranslations {
  network: string;
  unauthorized: string;
  notFound: string;
  serverError: string;
  validation: string;
  timeout: string;
}

/** Translation Namespace - Monitoring */
export interface MonitorTranslations {
  title: string;
  cpu: string;
  memory: string;
  entropy: string;
  healthy: string;
  critical: string;
}

/** Translation Namespace - Goals Tracking */
export interface GoalsTranslations {
  title: string;
  active: string;
  add: string;
  completed: string;
  inProgress: string;
}

/** Translation Namespace - Matrix System */
export interface MatrixTranslations {
  title: string;
  alpha: string;
  omega: string;
  cycle: string;
  status: string;
  duration: string;
}

/** Translation Namespace - Rune System */
export interface RuneTranslations {
  level: string;
  vault: string;
  yield: string;
  ledger: string;
}

/** Translation Namespace - CyberESG */
export interface CyberESGTranslations {
  title: string;
  subtitle: string;
  level: string;
  palace: string;
  runes: string;
  impact: string;
  impactDesc: string;
  verified: string;
  strategy: string;
  principles: {
    trace: string;
    track: string;
    calc: string;
    lock: string;
  };
}

/** Translation Namespace - Avatar */
export interface AvatarTranslations {
  welcome: {
    title: string;
    subtitle: string;
    startSetup: string;
    skip: string;
  };
  onboarding: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    action: string;
    finalAction: string;
  };
  persona: {
    switch: string;
    transforming: string;
    rewiring: string;
    current: string;
    mastery: string;
    level: string;
  };
  attributes: {
    wisdom: string;
    benevolence: string;
    courage: string;
    integrity: string;
    creation: string;
    agility: string;
    matrix: string;
  };
  logs: {
    title: string;
    empty: string;
    transformTo: string;
  };
  assets: {
    title: string;
    shield: string;
    locked: string;
  };
}

/** Complete Translation Dictionary Structure */
export interface TranslationDictionary {
  system: SystemTranslations;
  dashboard: DashboardTranslations;
  collaboration: CollaborationTranslations;
  compliance: ComplianceTranslations;
  ui: UITranslations;
  errors: ErrorTranslations;
  monitor: MonitorTranslations;
  goals: GoalsTranslations;
  matrix: MatrixTranslations;
  rune: RuneTranslations;
  cyber: CyberESGTranslations;
  avatar: AvatarTranslations;
  climate?: ClimateTranslations;
  governance?: GovernanceTranslations;
  social?: SocialTranslations;
  esg?: ESGTranslations;
  report?: ReportTranslations;
  reportCenter?: ReportCenterTranslations;
  supply?: SupplyTranslations;
  intelligence?: IntelligenceTranslations;
  game?: GameTranslations;
  strategy?: StrategyTranslations;
  auth?: AuthTranslations;
  settings?: SettingsTranslations;
  myNorthStar?: MyNorthStarTranslations;
  esgLayout?: EsgLayoutTranslations;
  sustainability?: SustainabilityTranslations;
  protocol5T?: Protocol5TTranslations;
  omniTrust?: OmniTrustTranslations;
  holyHub?: HolyHubTranslations;
  mvp?: MvpTranslations;
  omni?: OmniTranslations;
}

export interface OmniTranslations {
  dev: {
    mapping: { active: string };
    protocol: { standby: string };
  };
  console: {
    title: string;
    governance: string;
    spectrum: string;
  };
  dictionary: OmniDictionaryTranslations;
}

export interface OmniDictionaryTranslations {
  title: string;
  subtitle: string;
  nav: {
    overview: string;
    philosophy: string;
    elements: string;
    cards: string;
    architecture: string;
    evolution: string;
  };
  concentric: {
    title: string;
    systemVis: string;
    omniCircle: string;
    exploreNodes: string;
    viewDoc: string;
    layers: {
      [key: string]: {
        title: string;
        desc: string;
      };
    };
  };
  philosophy: {
    title: string;
    axiomsTitle: string;
    tiers: {
      title: string;
      items: {
        origin: { name: string; desc: string };
        core: { name: string; desc: string };
        apex: { name: string; desc: string };
      };
    };
    axioms: {
      title: string;
      items: {
        cycle: { name: string; desc: string };
        transparency: { name: string; desc: string };
        resonance: { name: string; desc: string };
        balance: { name: string; desc: string };
      };
    };
    cornerstone: {
      title: string;
      items: {
        causality: { name: string; desc: string };
        entropy: { name: string; desc: string };
        emergence: { name: string; desc: string };
        finiteness: { name: string; desc: string };
      };
    };
  };
  elements: {
    title: string;
    harmony: string;
    description: string;
    gen: string;
    des: string;
    types: {
      [key: string]: {
        name: string;
        spirit: string;
        desc: string;
        generates: string;
        destroys: string;
      };
    };
  };
  cards: {
    title: string;
    strategy: string;
    tierFilter: string;
    elementFilter: string;
    allTiers: string;
    allElements: string;
    searchPlaceholder: string;
    mappingTitle: string;
    cardWorld: string;
    systemWorld: string;
    realWorld: string;
    revert: string;
    items: {
      [key: string]: {
        name: string;
        tier: string;
        type: string;
        element: string;
        rarity: string;
        desc: string;
        system: string;
        real: string;
      };
    };
  };
  architecture: {
    title: string;
    backbone: string;
    description: string;
    eventSourcing: { title: string; desc: string };
    consistency: { title: string; desc: string };
  };
  evolution: {
    title: string;
    sacredArtsTitle: string;
    sacredArts: {
      purification: { name: string; desc: string };
      resonance: { name: string; desc: string };
      weaving: { name: string; desc: string };
      manifestation: { name: string; desc: string };
      alchemy: { name: string; desc: string };
      imprinting: { name: string; desc: string };
    };
    pillarsTitle: string;
    pillars: {
      simplicity: string;
      speed: string;
      stability: string;
      evolution: string;
    };
    promisesTitle: string;
    promises: string[];
  };
  footer: {
    motto: string;
    copyright: string;
  };
}


export interface MvpTranslations {
  hub: {
    title: string;
    subtitle: string;
    allModules: string;
    esgCore: string;
    aiTech: string;
    system: string;
  };
  modules: {
    reportCenter: { title: string; desc: string };
    intelligence: { title: string; desc: string };
    avatar: { title: string; desc: string };
    personalHub: { title: string; desc: string };
    village: { title: string; desc: string };
    backend: { title: string; desc: string };
  };
}


export interface HolyHubTranslations {
  title: string;
  subtitle: string;
  tabs: {
    dashboard: string;
    ocr: string;
    reports: string;
    compliance: string;
  };
  status: {
    title: string;
    traceable: string;
    trackable: string;
    trustworthy: string;
    transparent: string;
    tangible: string;
  };
  metrics: {
    griCoverage: string;
    carbonReduction: string;
    complianceScore: string;
    evidenceReady: string;
    aiScore: string;
    diversity: string;
  };
  milestones: {
    title: string;
    inProgress: string;
    completed: string;
    overdue: string;
    pending: string;
  };
  aiInsights: {
    title: string;
    confidence: string;
    types: {
      sentiment: string;
      topic: string;
      recommendation: string;
      alert: string;
    }
  };
  ocr: {
    title: string;
    addScan: string;
    scanning: string;
    processing: string;
    ready: string;
    noItems: string;
    startPrompt: string;
    features: {
      smart: string;
      smartDesc: string;
      realtime: string;
      realtimeDesc: string;
      trust: string;
      trustDesc: string;
    }
  };
}

/** Translation Namespace - Climate */
export interface ClimateTranslations {
  title: string;
  physical: string;
  transition: string;
  scenario: string;
  tcfd: string;
  emissions: string;
  scope1: string;
  scope2: string;
  scope3: string;
  netZero: string;
  carbonPrice: string;
  adaptation: string;
  mitigation: string;
}

/** Translation Namespace - Governance */
export interface GovernanceTranslations {
  title: string;
  board: string;
  ethics: string;
  risk: string;
  transparency: string;
  compliance: string;
  shareholders: string;
  stakeholders: string;
}

/** Translation Namespace - Social */
export interface SocialTranslations {
  title: string;
  labor: string;
  diversity: string;
  community: string;
  health: string;
  humanRights: string;
  supplyChain: string;
}

/** Translation Namespace - ESG */
export interface ESGTranslations {
  title: string;
  environmental: string;
  social: string;
  governance: string;
  rating: string;
  benchmark: string;
  trends: string;
  improvement: string;
  leadership: string;
  average: string;
}

/** Translation Namespace - Report */
export interface ReportTranslations {
  title: string;
  gri: string;
  sasb: string;
  tcfd: string;
  integrated: string;
  sustainability: string;
  annual: string;
  verification: string;
}

/** Translation Namespace - Report Center (New V2) */
export interface ReportCenterTranslations {
  title: string;
  stats: {
    completed: string;
    inProgress: string;
    pending: string;
  };
  wizard: {
    startTitle: string;
    startSubtitle: string;
    startDesc: string;
    startBtn: string;
  };
  calendar: {
    title: string;
    addReminder: string;
  };
  stage: {
    current: string;
    level: string;
    loading: string;
    completeBtn: string;
    publishBtn: string;
    aiDraft: string;
    levels: {
      [key: string]: { title: string; desc: string };
    }
  };
  omniMemory: {
    title: string;
    subtitle: string;
    systemResonance: string;
    eternityProtocol: string;
    memoryFragments: string;
    initializing: string;
    loading: string;
    waiting: string;
  };
  tier: {
    bronze: string;
    gold: string;
    diamond: string;
  };
  feature: {
    basic: string;
    gri: string;
    tcfd: string;
    ai: string;
    compliance: string;
    support: string;
  };
  deadlines: {
    title: string;
    add: string;
    daysLeft: string;
    left: string;
    items: {
      q1Report: string;
      ghgVerification: string;
      stakeholderSurvey: string;
    };
  };
  smartGathering: {
    title: string;
    subtitle: string;
    analyzeBtn: string;
    processing: string;
    summary: string;
    confidence: string;
    indicators: string;
    dataPoints: string;
    framework: string;
    complete: string;
    changeFile: string;
    rawTitle: string;
    showRaw: string;
    hideRaw: string;
    assetLocking: string;
    assetSaved: string;
    exportMock: string;
    storedSuccess: string;
  };
}

/** Translation Namespace - Sustainability Enhancement */
export interface SustainabilityTranslations {
  pageTitle: string;
  pageSubtitle: string;
  pillars: {
    dashboard: string;
    factory: string;
    compliance: string;
    action: string;
    evidence: string;
    board: string;
  };
  factory: {
    scan: string;
    insights: string;
    templates: string;
    qaScore: string;
    trustIndex: string;
    completion: string;
    analyzeBtn: string;
    autoFillBtn: string;
    scanning: string;
    extracted: string;
  };
  compliance: {
    frameworks: string;
    gapAnalysis: string;
    recommendations: string;
  };
  evidence: {
    vault: string;
    secure: string;
    checklist: string;
    collection: string;
    thumbnail: string;
    digitalSignature: string;
    manualEntry: string;
    signNow: string;
    timeChain: string;
    history: string;
    auditTrail: string;
    formula: string;
    omniNotes: string;
    omniSync: string;
    omniChecker: string;
    omniPriest: string;
    powerState: string;
    drThoth: string;
    benchmarking5Year: string;
    omniElf: string;
    orbEffect: string;
    omniChart: string;
    iconEnhancement: string;
    zeroHallucination: string;
    proprietaryRAG: string;
    omniCalendar: string;
    submissionDeadline: string;
    progressReminder: string;
    orientation: string;
    keyPoints: string;
    startTutorial: string;
    industryBenchmarking: string;
    top5Peers: string;
    peerKeyItems: string;
    actionableGuidance: string;
    howToProceed: string;
    painFreeGeneration: string;
    multiDraftSupport: string;
    selectDraft: string;
    autoSaveDraft: string;
    resumeProgress: string;
    workInProgress: string;
    predictiveAutoFill: string;
    userHabitMapping: string;
    preFilledAnswers: string;
    confidenceScore: string;
    evidenceAlert: string;
    lowConfidenceWarning: string;
    requireBetterEvidence: string;
    dynamicTheming: string;
    brandStylization: string;
    themeSelector: string;
    exquisiteLayout: string;
    stitchAesthetic: string;
    eliteDesign: string;
    bestPracticeAtmosphere: string;
    pageScaleSelection: string;
    reportVolume: string;
    volume100: string;
    volume200: string;
    volume300: string;
    volume400: string;
    volume500: string;
    uniqueVersioning: string;
    stylisticFingerprint: string;
    oneOfAKind: string;
    infiniteRevisions: string;
    preLockEditing: string;
    indefiniteWork: string;
    teamCollaboration: string;
    chapterAssignment: string;
    multiUserSync: string;
    assignedTo: string;
    chapterStatus: string;
    sustainabilityLibrary: string;
    regulations: string;
    specialTerms: string;
    realWorldCases: string;
    viewLibrary: string;
    anticipatoryPlanning: string;
    digitalTwinStrategy: string;
    proactiveGuidance: string;
    oneClickGeneration: string;
    multiFormatExport: string;
    crossPlatform: string;
    pdfExport: string;
    excelExport: string;
    jsonExport: string;
    webReport: string;
    dataDigitization: string;
    universalIngestion: string;
    erpSystem: string;
    hrisSystem: string;
    excelLegacy: string;
    directApplication: string;
    infooneTrinity: string;
    infooneAgent: string;
    trinityCore: string;
    agenticExecution: string;
    autonomousManagement: string;
    tripleElementDisplay: string;
    multimodalInteraction: string;
    voiceTextImageInput: string;
    multiPaneView: string;
    adaptiveLayout: string;
    typographyBestPractice: string;
    responsiveVisuals: string;
    eliteTypography: string;
    universalOptimization: string;
    deepPenetration: string;
    functionalUpgrade: string;
    perfectionCompletion: string;
    universalFacets: string;
    reportCenterUpgrade: string;
    allAspectsIntegration: string;
    facetLogic: string;
  };
}

/** Translation Namespace - Omni Trust Architecture */
export interface OmniTrustTranslations {
  checkerTitle: string;
  priestTitle: string;
  syncStatus: string;
  eternalPower: string;
  approvalRequired: string;
  releaseData: string;
  formulaTransparency: string;
  calculationLogic: string;
  drThothGuidance: string;
  drThothOrientation: string;
  orientationBriefing: string;
  benchmarking3Year: string;
  peerComparisonTitle: string;
  benchmarkingTitle: string;
  comparativeAnalysis: string;
  actionGuidanceTitle: string;
  implementationSteps: string;
  multiDraftTitle: string;
  painFreeSupport: string;
  smartAutoSave: string;
  persistenceTitle: string;
  predictiveFillTitle: string;
  habitAnalysis: string;
  confidenceMeter: string;
  evidenceStrength: string;
  themeEngineTitle: string;
  brandLogic: string;
  stitchAestheticTitle: string;
  eliteBestPractice: string;
  reportVolumeTitle: string;
  scaleManagement: string;
  uniqueFingerprintTitle: string;
  exquisiteUniqueness: string;
  infiniteEditTitle: string;
  lockMechanism: string;
  collaborationHubTitle: string;
  teamSyncLogic: string;
  libraryAccessTitle: string;
  knowledgeOnDemand: string;
  anticipatoryPlanningTitle: string;
  proactiveStrategyLogic: string;
  exportHubTitle: string;
  platformCompatibility: string;
  autoIngestTitle: string;
  connectivityLogic: string;
  trinityArchitectureTitle: string;
  agenticProxyLogic: string;
  tripleElementTitle: string;
  multimodalLogic: string;
  adaptiveLayoutTitle: string;
  typographyLogic: string;
  optimizationPhilosophyTitle: string;
  upgradeLogic: string;
  universalFacetsTitle: string;
  aspectsIntegrationLogic: string;
  holyArchitecture: HolyArchitectureTranslations;
}

/** Translation Namespace - Holy Architecture (Angelic Mandate) */
export interface HolyArchitectureTranslations {
  angelicMandateTitle: string;
  holyScriptureOfLight: string;
  trinityTruth: string;
  trinityGoodness: string;
  trinityBeauty: string;
  trinityTrust: string;
  universalPersistenceSubject: string;
  hashLock: string;
  fractalUUID: string;
  zeroHLock: string;
  zkpProof: string;
  constellationProgress: string;
  wingsOfLight: string;
  soulResonanceRS: string;
  entropyReduction: string;
  holyExport: string;
  sinAlchemy: string;
  quantumCache: string;
  liquidGlassUI: string;
  gravityFieldLayout: string;
  emotionalColorTranslation: string;
  hapticSoundEffects: string;
  soulBoundMedalSBT: string;
  eternalCovenant: string;
  manifestationOfMiracles: string;
}

/** Translation Namespace - 5T Protocol */
export interface Protocol5TTranslations {
  traceable: string;
  trackable: string;
  trustworthy: string;
  transparent: string;
  timely: string;
  enterVault: string;
}

/** Translation Namespace - Supply Chain */
export interface SupplyTranslations {
  title: string;
  suppliers: string;
  assessment: string;
  risk: string;
  performance: string;
  traceability: string;
  certification: string;
}

/** Translation Namespace - Intelligence */
export interface IntelligenceTranslations {
  title: string;
  news: string;
  sentiment: string;
  alerts: string;
  insights: string;
  trends: string;
  competitors: string;
}

/** Translation Namespace - Game */
export interface GameTranslations {
  title: string;
  cards: string;
  missions: string;
  rewards: string;
  progress: string;
  achievements: string;
  rank: string;
}

/** Translation Namespace - Strategy */
export interface StrategyTranslations {
  title: string;
  collection: string;
  collectionDesc: string;
  deck: string;
  deckDesc?: string;
  equip: string;
  unequip: string;
}

/** Translation Namespace - Auth */
export interface AuthTranslations {
  login: string;
  logout: string;
  register: string;
  password: string;
  email: string;
  forgot: string;
}

/** Translation Namespace - Settings */
export interface SettingsTranslations {
  title: string;
  profile: string;
  preferences: string;
  language: string;
  theme: string;
  notifications: string;
  privacy: string;
  security: string;
}

/** Translation Namespace - MyNorthStar */
export interface MyNorthStarTranslations {
  title: string;
  subtitle: string;
  totalResonance: string;
  adjustResonance: string;
  backToDashboard: string;
  enviro: string;
  social: string;
  gov: string;
  enviroDesc: string;
  socialDesc: string;
  govDesc: string;
  labels: {
    environmental: string;
    social: string;
    governance: string;
  };
  guide: {
    welcome: string;
    resonance: string;
    instruction: string;
  };
}


/** Translation Namespace - ESG Service Layout */
export interface EsgLayoutTranslations {
  nav: {
    dashboard: string;
    climate: string;
    water: string;
    rights: string;
    community: string;
    transparency: string;
    investment: string;
    stakeholder: string;
  };
  header: {
    services: string;
    search: string;
    addData: string;
  };
  muse: {
    title: string;
    subtitle: string;
    explore: string;
    insight: {
      title: string;
      content: string;
    };
    reference: {
      title: string;
      content: string;
    };
  };
}

/** Translation Key Path Type (supports nested access) */
export type TranslationKey =
  | `system.${keyof SystemTranslations}`
  | `dashboard.${keyof DashboardTranslations}`
  | `dashboard.health.${keyof DashboardHealthTranslations}`
  | `collaboration.${keyof CollaborationTranslations}`
  | `compliance.${keyof ComplianceTranslations}`
  | `ui.${keyof UITranslations}`
  | `errors.${keyof ErrorTranslations}`
  | `monitor.${keyof MonitorTranslations}`
  | `goals.${keyof GoalsTranslations}`
  | `matrix.${keyof MatrixTranslations}`
  | `rune.${keyof RuneTranslations}`
  | `cyber.${keyof CyberESGTranslations}`
  | `cyber.principles.${keyof CyberESGTranslations['principles']}`
  | `myNorthStar.${keyof MyNorthStarTranslations}`
  | `myNorthStar.labels.${keyof MyNorthStarTranslations['labels']}`
  | `myNorthStar.guide.${keyof MyNorthStarTranslations['guide']}`
  | `avatar.${keyof AvatarTranslations}`
  | `avatar.welcome.${keyof AvatarTranslations['welcome']}`
  | `avatar.onboarding.${keyof AvatarTranslations['onboarding']}`
  | `avatar.persona.${keyof AvatarTranslations['persona']}`
  | `avatar.attributes.${keyof AvatarTranslations['attributes']}`
  | `avatar.logs.${keyof AvatarTranslations['logs']}`
  | `avatar.assets.${keyof AvatarTranslations['assets']}`
  | `strategy.${keyof StrategyTranslations}`
  | `reportCenter.${keyof ReportCenterTranslations}`
  | `reportCenter.stats.${keyof ReportCenterTranslations['stats']}`
  | `reportCenter.wizard.${keyof ReportCenterTranslations['wizard']}`
  | `reportCenter.calendar.${keyof ReportCenterTranslations['calendar']}`
  | `reportCenter.stage.${keyof ReportCenterTranslations['stage']}`
  | `reportCenter.omniMemory.${keyof ReportCenterTranslations['omniMemory']}`
  | `reportCenter.tier.${keyof ReportCenterTranslations['tier']}`
  | `reportCenter.feature.${keyof ReportCenterTranslations['feature']}`
  | `reportCenter.deadlines.${keyof ReportCenterTranslations['deadlines']}`
  | `reportCenter.deadlines.items.${keyof ReportCenterTranslations['deadlines']['items']}`
  | `reportCenter.smartGathering.${keyof ReportCenterTranslations['smartGathering']}`
  | `reportCenter.stage.levels.${string}.title`
  | `reportCenter.stage.levels.${string}.desc`
  | `esgLayout.${keyof EsgLayoutTranslations}`
  | `esgLayout.nav.${keyof EsgLayoutTranslations['nav']}`
  | `esgLayout.header.${keyof EsgLayoutTranslations['header']}`
  | `esgLayout.muse.${keyof EsgLayoutTranslations['muse']}`
  | `esgLayout.muse.insight.${keyof EsgLayoutTranslations['muse']['insight']}`
  | `esgLayout.muse.reference.${keyof EsgLayoutTranslations['muse']['reference']}`
  | `sustainability.${keyof SustainabilityTranslations}`
  | `sustainability.pillars.${keyof SustainabilityTranslations['pillars']}`
  | `sustainability.factory.${keyof SustainabilityTranslations['factory']}`
  | `sustainability.compliance.${keyof SustainabilityTranslations['compliance']}`
  | `sustainability.evidence.${keyof SustainabilityTranslations['evidence']}`
  | `protocol5T.${keyof Protocol5TTranslations}`
  | `omniTrust.${keyof OmniTrustTranslations}`
  | `holyHub.${keyof HolyHubTranslations}`
  | `holyHub.tabs.${keyof HolyHubTranslations['tabs']}`
  | `holyHub.status.${keyof HolyHubTranslations['status']}`
  | `holyHub.metrics.${keyof HolyHubTranslations['metrics']}`
  | `holyHub.milestones.${keyof HolyHubTranslations['milestones']}`
  | `holyHub.aiInsights.${keyof HolyHubTranslations['aiInsights']}`
  | `holyHub.aiInsights.types.${keyof HolyHubTranslations['aiInsights']['types']}`
  | `holyHub.ocr.${keyof HolyHubTranslations['ocr']}`
  | `holyHub.ocr.features.${keyof HolyHubTranslations['ocr']['features']}`
  | `mvp.hub.${keyof MvpTranslations['hub']}`
  | `mvp.modules.${string}.title`
  | `mvp.modules.${string}.desc`
  | `omni.dev.mapping.active`
  | `omni.dev.protocol.standby`
  | `omni.console.title`
  | `omni.console.governance`
  | `omni.console.spectrum`;

/** Language Resource Mapping */
export type LanguageResources = {
  [K in Language]: TranslationDictionary;
};

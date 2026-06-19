import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { UnifiedAdminLayout } from '@/components/layout/UnifiedAdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { View } from '@/types/core';
import { serviceEcosystem } from '@/config/service-ecosystem.config';

// Components
import SystemStatus from '@/pages/SystemStatus';
import { ExcellencePage } from '@/pages/ExcellencePage';
import { AchievementWaterfall } from '@/pages/AchievementWaterfall';
import { OmniSeriesShowcase } from '@/pages/OmniSeriesShowcase';

// Lazy Imports
const OmniDashboard = React.lazy(() => import('@/omni/interaction/control/OmniDashboard'));
const LearningAlchemyPage = React.lazy(() => import('@/pages/LearningAlchemyPage'));
const DebateArenaPage = React.lazy(() => import('@/pages/DebateArenaPage'));
const MyNorthStarPage = React.lazy(() => import('@/pages/MyNorthStarPage'));
const EsgReportingPage = React.lazy(() => import('@/pages/EsgReportingPage'));
const GoodwardAcademyPage = React.lazy(() => import('@/pages/GoodwardAcademyPage'));
const VillagePrototype = React.lazy(() => import('@/pages/VillagePrototype'));
const SustainableVillagePage = React.lazy(() => import('@/pages/SustainableVillagePage'));
const ComplianceGuardianPage = React.lazy(() => import('@/pages/ComplianceGuardianPage'));
const QuantumVaultPage = React.lazy(() => import('@/pages/QuantumVaultPage'));
const LiquidNetworkPage = React.lazy(() => import('@/pages/LiquidNetworkPage'));
const SentientSymphonyPage = React.lazy(() => import('@/pages/SentientSymphonyPage'));
const AICultivationLabPage = React.lazy(() => import('@/pages/AICultivationLabPage'));
const VirtueHabitPage = React.lazy(() => import('@/pages/VirtueHabitPage'));
const OmniMindPage = React.lazy(() => import('@/pages/OmniMindPage'));
const QuantumEthicsPage = React.lazy(() => import('@/pages/QuantumEthicsPage'));
const StitchShowcasePage = React.lazy(() => import('@/pages/StitchShowcasePage'));
const TiffanyShowcase = React.lazy(() => import('@/pages/TiffanyShowcase'));
const LearningCommandPage = React.lazy(() => import('@/pages/LearningCommandPage'));
const KnowledgeVaultPage = React.lazy(() => import('@/pages/KnowledgeVaultPage'));
const ResonanceCalibrationPage = React.lazy(() => import('@/pages/ResonanceCalibrationPage'));
const SkillMasteryPage = React.lazy(() => import('@/pages/SkillMasteryPage'));
const StrategicOrchestratorPage = React.lazy(() => import('@/pages/StrategicOrchestratorPage'));
const AdkLabPage = React.lazy(() => import('@/pages/AdkLabPage'));
const PremiumMediaGallery = React.lazy(() =>
  import('@/components/ui/PremiumMediaGallery').then(m => ({ default: m.PremiumMediaGallery }))
);
const CardCollectionPage = React.lazy(() => import('@/pages/CardCollectionPage'));
const DeckBuilderPage = React.lazy(() => import('@/pages/DeckBuilderPage'));
const BattleArenaPage = React.lazy(() => import('@/pages/BattleArenaPage'));
const ReportTutorialPage = React.lazy(() => import('@/pages/ReportTutorialPage'));
const AdvancementHallPage = React.lazy(() => import('@/pages/AdvancementHallPage'));
const OneClickReportWizard = React.lazy(() => import('@/pages/OneClickReportWizard'));
const CarbonAccountingPage = React.lazy(() => import('@/pages/esg/CarbonAccountingPage'));
const AquaThemePage = React.lazy(() => import('@/pages/stitch-themes/AquaThemePage'));
const GoldThemePage = React.lazy(() => import('@/pages/stitch-themes/GoldThemePage'));
const OceanThemePage = React.lazy(() => import('@/pages/stitch-themes/OceanThemePage'));
const MistThemePage = React.lazy(() => import('@/pages/stitch-themes/MistThemePage'));
const VoidThemePage = React.lazy(() => import('@/pages/stitch-themes/VoidThemePage'));
const StitchNexusDashboard = React.lazy(() => import('@/pages/StitchNexusDashboard'));
const EsgNexusDashboard = React.lazy(() => import('@/pages/EsgNexusDashboard'));
const ESGReportCenterPage = React.lazy(() => import('@/pages/esg/ESGReportCenterPage'));
const ESGIntelligenceCenterPage = React.lazy(() => import('@/pages/esg/ESGIntelligenceCenterPage'));
const OnboardingWizard = React.lazy(() => import('@/pages/onboarding/OnboardingWizard'));
const MarketIntelligencePage = React.lazy(() => import('@/pages/esg/MarketIntelligencePage'));
const AuditTrailPage = React.lazy(() => import('@/pages/admin/AuditTrailPage'));
const OmniProjectsBoard = React.lazy(() => import('@/pages/omni-projects/OmniProjectsBoard'));
const MyDashboardPage = React.lazy(() => import('@/pages/esg/MyDashboardPage'));
const GoodwardVillageRPG = React.lazy(() => import('@/pages/esg/GoodwardVillageRPG'));
const StrategyDashboard = React.lazy(() => import('@/pages/StrategyDashboard'));
const WaterResourcePage = React.lazy(() => import('@/pages/esg/WaterResourcePage'));
const ClimateRiskPage = React.lazy(() => import('@/pages/esg/ClimateRiskPage'));
const HumanRightsPage = React.lazy(() => import('@/pages/esg/HumanRightsPage'));
const CommunityEngagementPage = React.lazy(() => import('@/pages/esg/CommunityEngagementPage'));
const SustainableInvestmentPage = React.lazy(() => import('@/pages/esg/SustainableInvestmentPage'));
const DecisionTransparencyPage = React.lazy(() => import('@/pages/esg/DecisionTransparencyPage'));
const ServiceGuideCenter = React.lazy(() => import('@/pages/ServiceGuideCenter'));
const OmniCircleHub = React.lazy(() => import('@/pages/esg/OmniCircleHub'));
const MVPVersionPage = React.lazy(() => import('@/pages/MVPVersionPage'));
const SystemHealthDashboard = React.lazy(() => import('@/pages/admin/SystemHealthDashboard'));
const JourneyPage = React.lazy(() =>
  import('@/pages/JourneyPage').then(m => ({ default: m.JourneyPage }))
);
const IntegrationHubPage = React.lazy(() =>
  import('@/pages/IntegrationHubPage').then(m => ({ default: m.default }))
);
const PersonalHubPage = React.lazy(() => import('@/pages/PersonalHubPage'));
const FinancialReportGenerator = React.lazy(() => import('@/pages/FinancialReportGenerator'));
const OmniTableDashboard = React.lazy(() => import('@/pages/OmniTableDashboard'));
const OmniSocialNexus = React.lazy(() => import('@/components/social/OmniSocialNexus'));
const OmniNotesPage = React.lazy(() => import('@/pages/omni-notes/OmniNotesPage'));
const OmniBackendPage = React.lazy(() => import('@/components/admin/OmniBackend'));
const SustainabilityReportBento = React.lazy(() => import('@/pages/esg/SustainabilityReportBento'));
const OmniCardTCGPage = React.lazy(() => import('@/pages/esg/OmniCardTCGPage'));
const FortuneEncounterPage = React.lazy(() => import('@/pages/FortuneEncounterPage'));
const HolySustainabilityHub = React.lazy(() => import('@/pages/esg/HolySustainabilityHub'));
const OmniDictionaryPage = React.lazy(() => import('@/pages/OmniDictionaryPage'));
const SummonerAwakening = React.lazy(() => import('@/pages/summoner/SummonerAwakening'));
const SummonerHub = React.lazy(() => import('@/pages/summoner/SummonerHub'));
const OmniEvolutionPage = React.lazy(() => import('@/pages/summoner/OmniEvolutionPage'));
const OmniEpicChronicles = lazy(() => import('../pages/summoner/OmniEpicChronicles'));
const TerminusMatrix = lazy(() => import('../pages/summoner/TerminusMatrixPage'));

// MVP JunAiKey Pages
const OmniAllInOneHub = React.lazy(() => import('@/pages/OmniAllInOneHub'));
const AgenticTwinPage = React.lazy(() => import('@/pages/avatar/AgenticTwinPage'));
const BusinessIntelligencePage = React.lazy(() => import('@/pages/esg/BusinessIntelligencePage'));
const ImpactVillagePage = React.lazy(() => import('@/pages/esg/ImpactVillagePage'));


// Phase 23.1: Cognitive Intelligence Services
const AIStrategyHubPage = React.lazy(() => import('@/pages/services/cognitive/AIStrategyHubPage'));
const DailyBriefingPage = React.lazy(() => import('@/pages/services/cognitive/DailyBriefingPage'));
const ESGAIAssistantPage = React.lazy(
  () => import('@/pages/services/cognitive/ESGAIAssistantPage')
);
const TrendPredictionPage = React.lazy(
  () => import('@/pages/services/cognitive/TrendPredictionPage')
);
const EnergyManagementPage = React.lazy(
  () => import('@/pages/services/excellence/EnergyManagementPage')
);
const WasteManagementPage = React.lazy(
  () => import('@/pages/services/excellence/WasteManagementPage')
);
const GovernanceStructurePage = React.lazy(
  () => import('@/pages/services/governance/GovernanceStructurePage')
);
const ComplianceManagementPage = React.lazy(
  () => import('@/pages/services/governance/ComplianceManagementPage')
);
const InternalControlsPage = React.lazy(
  () => import('@/pages/services/governance/InternalControlsPage')
);
const RiskManagementPage = React.lazy(
  () => import('@/pages/services/governance/RiskManagementPage')
);
const InformationSecurityPage = React.lazy(
  () => import('@/pages/services/governance/InformationSecurityPage')
);
// Phase 23.4: Stakeholder Services
const EmployeeRelationsPage = React.lazy(() =>
  import('@/pages/services/stakeholder/EmployeeRelationsPage').then(m => ({
    default: m.EmployeeRelationsPage,
  }))
);
const CustomerEngagementPage = React.lazy(() =>
  import('@/pages/services/stakeholder/CustomerEngagementPage').then(m => ({
    default: m.CustomerEngagementPage,
  }))
);
const SupplyChainPage = React.lazy(() =>
  import('@/pages/services/stakeholder/SupplyChainPage').then(m => ({ default: m.SupplyChainPage }))
);
const CommunityImpactPage = React.lazy(() =>
  import('@/pages/services/stakeholder/CommunityImpactPage').then(m => ({
    default: m.CommunityImpactPage,
  }))
);
const InvestorRelationsPage = React.lazy(() =>
  import('@/pages/services/stakeholder/InvestorRelationsPage').then(m => ({
    default: m.InvestorRelationsPage,
  }))
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default Landing - Omni MVP Hub */}
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniAllInOneHub />
          </Suspense>
        }
      />

      {/* 系統狀態監測頁面 (System Status Monitor) */}
      <Route path="/system-status" element={<SystemStatus />} />

      {/* 卓越計算 (Excellence Computing - v8.1.0) */}
      <Route
        path="/excellence"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ExcellencePage />
          </Suspense>
        }
      />

      {/* 上善若水・成就瀑布 (Water Logic Learning - Phase 36) */}
      <Route path="/achievements" element={<AchievementWaterfall />} />
      <Route path="/admin/health" element={<SystemHealthDashboard />} />
      <Route
        path="/admin/audit-trail"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <AuditTrailPage />
          </Suspense>
        }
      />
      <Route path="/reports" element={<FinancialReportGenerator />} />

      <Route
        path="/mvp-version"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <MVPVersionPage />
          </Suspense>
        }
      />

      {/* MVP All-In-One Hub - The Strategic Core */}
      <Route
        path="/omni-hub"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniAllInOneHub />
          </Suspense>
        }
      />

      {/* Agentic Twin (Digital Twin) */}
      <Route
        path="/avatar/center"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#8b5cf6]" />}>
            <AgenticTwinPage />
          </Suspense>
        }
      />

      {/* Business Intelligence Matrix */}
      <Route
        path="/intelligence/market"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#3b82f6]" />}>
            <BusinessIntelligencePage />
          </Suspense>
        }
      />

      {/* Impact Village (ARPG Game Hub) */}
      <Route
        path="/esg/village"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#f59e0b]" />}>
            <ImpactVillagePage />
          </Suspense>
        }
      />

      {/* 奧秘圓通 (OmniCircle Hub) */}
      <Route
        path="/omni-circle"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OmniCircleHub />
          </Suspense>
        }
      />

      {/* 萬能圓通筆記 (OmniNotes) */}
      <Route
        path="/omni-notes"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OmniNotesPage />
          </Suspense>
        }
      />

      {/* OmniBackend 統一資料庫 (Omni Backend - Central Database) */}
      <Route
        path="/omni-backend"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OmniBackendPage />
          </Suspense>
        }
      />

      {/* 奧秘系列展示 (Omni Series Showcase) */}
      <Route path="/omni-series" element={<OmniSeriesShowcase />} />

      {/* Google Stitch Showcase (5 Atomic Styles) */}
      <Route
        path="/stitch-showcase"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <StitchShowcasePage />
          </Suspense>
        }
      />

      {/* Google Stitch Themes */}
      <Route
        path="/stitch-showcase/aqua"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <AquaThemePage />
          </Suspense>
        }
      />
      <Route
        path="/stitch-showcase/gold"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <GoldThemePage />
          </Suspense>
        }
      />
      <Route
        path="/stitch-showcase/ocean"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OceanThemePage />
          </Suspense>
        }
      />
      <Route
        path="/stitch-showcase/mist"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <MistThemePage />
          </Suspense>
        }
      />
      <Route
        path="/stitch-showcase/void"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <VoidThemePage />
          </Suspense>
        }
      />
      <Route
        path="/stitch-nexus"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <StitchNexusDashboard />
          </Suspense>
        }
      />
      <Route
        path="/esg-nexus"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <EsgNexusDashboard />
          </Suspense>
        }
      />

      {/* Omni Projects Board - Stitch Design */}
      <Route
        path="/omni-projects"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OmniProjectsBoard />
          </Suspense>
        }
      />

      {/* InfoOne First-time Onboarding */}
      <Route
        path="/start"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OnboardingWizard />
          </Suspense>
        }
      />

      {/* 客戶旅程儀表板 (Customer Journey Dashboard) */}
      <Route
        path="/journey/:serviceId"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <JourneyPage />
          </Suspense>
        }
      />

      {/* 學習煉金術 (Learning Alchemy - Phase 14) */}
      <Route
        path="/learning-alchemy"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <LearningAlchemyPage />
          </Suspense>
        }
      />

      {/* 辯論競技場 (Debate Arena - Phase 19) */}
      <Route
        path="/debate"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <DebateArenaPage />
          </Suspense>
        }
      />

      {/* 卡牌收藏 (Card Collection - Phase 6.3) */}
      <Route
        path="/card-collection"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <CardCollectionPage />
          </Suspense>
        }
      />

      {/* 牌組建構 (Deck Builder - Phase 6.3) */}
      <Route
        path="/deck-builder"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <DeckBuilderPage />
          </Suspense>
        }
      />

      {/* 戰鬥競技場 (Battle Arena - Phase 6.4) */}
      <Route
        path="/battle/:battleId"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <BattleArenaPage />
          </Suspense>
        }
      />

      {/* 商情偵測中心 (Market Intelligence Center - Phase 24) */}
      <Route
        path="/market-intel"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <MarketIntelligencePage />
          </Suspense>
        }
      />

      {/* 個人主控中心 (Personal Hub - Phase 7) */}
      <Route
        path="/personal-hub"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <PersonalHubPage />
          </Suspense>
        }
      />

      {/* 我的北極星 (My North Star - Phase 25) */}
      <Route
        path="/my-north-star"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <MyNorthStarPage />
          </Suspense>
        }
      />

      {/* 永續報告書撰寫平台 (ESG Reporting Platform - Phase 26) */}
      <Route
        path="/esg-reporting"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <EsgReportingPage />
          </Suspense>
        }
      />

      {/* 永續報告專區 (ESG Report Center - New v2) */}
      <Route
        path="/esg-report-center"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <ESGReportCenterPage />
          </Suspense>
        }
      />

      {/* 永續報告聖殿 - Holy Sustainability Hub (High-Contrast Dark Style) */}
      <Route
        path="/esg/holy-hub"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#00ffff]" />}>
            <HolySustainabilityHub />
          </Suspense>
        }
      />


      {/* 永續報告中心 - Stitch Bento 版本 (高密度資訊流) */}
      <Route
        path="/esg-report-bento"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <SustainabilityReportBento />
          </Suspense>
        }
      />

      {/* 萬能卡牌 TCG - ESG 知識點/集換式收藏/戰役冒險/玩家對戰 */}
      <Route
        path="/omni-card-tcg"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniCardTCGPage />
          </Suspense>
        }
      />

      {/* 萬能智典 4.0：終極融合架構 */}
      <Route
        path="/omni-dictionary"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniDictionaryPage />
          </Suspense>
        }
      />

      {/* 萬能元鑰召喚使系統 */}
      <Route
        path="/summoner-awakening"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <SummonerAwakening />
          </Suspense>
        }
      />
      <Route
        path="/summoner-hub"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <SummonerHub />
          </Suspense>
        }
      />
      <Route
        path="/omni-evolution"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniEvolutionPage />
          </Suspense>
        }
      />
      <Route
        path="/omni-epic"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniEpicChronicles />
          </Suspense>
        }
      />
      <Route
        path="/terminus-matrix"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <TerminusMatrix />
          </Suspense>
        }
      />

      {/* 斯福氣 & 際遇 (Fortune & Encounters) */}
      <Route
        path="/fortune-encounter"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <FortuneEncounterPage />
          </Suspense>
        }
      />

      {/* 商業偵情中心 (ESG Intelligence Center - New v2) */}
      <Route
        path="/esg-intelligence"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <ESGIntelligenceCenterPage />
          </Suspense>
        }
      />

      {/* 5T Protocol Modal or other common elements can be injected here */}

      {/* 系統整合樞紐 (Integration Hub - Phase 38) */}
      <Route
        path="/integration-hub"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <IntegrationHubPage />
          </Suspense>
        }
      />

      {/* 善向永續學院 (Goodward Sustainability Academy - Phase 27) */}
      <Route
        path="/goodward-academy"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <GoodwardAcademyPage />
          </Suspense>
        }
      />

      {/* 善向永續村 (ESG Go Village - Phase 28/86) */}
      <Route
        path="/esg-go-village"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <VillagePrototype />
          </Suspense>
        }
      />

      {/* 善向永續村 - 5T 煉金核心 (Sustainable Village - 5T Alchemy Core) */}
      <Route
        path="/sustainable-village"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <SustainableVillagePage />
          </Suspense>
        }
      />

      {/* 自動化合規守衛 (Compliance Guardian - Phase 29) */}
      <Route
        path="/compliance-guardian"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ComplianceGuardianPage />
          </Suspense>
        }
      />

      {/* 量子金庫 (Quantum Vault - Phase 30) */}
      <Route
        path="/quantum-vault"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <QuantumVaultPage />
          </Suspense>
        }
      />

      {/* 液態神經網絡 (Liquid Neural Network - Phase 31) */}
      <Route
        path="/liquid-network"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <LiquidNetworkPage />
          </Suspense>
        }
      />

      {/* 覺知交響樂 (Sentient Symphony - Phase 32) */}
      <Route
        path="/sentient-symphony"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <SentientSymphonyPage />
          </Suspense>
        }
      />

      {/* AI 培育實驗室 (AI Cultivation Lab - Phase 33) */}
      <Route
        path="/ai-cultivation-lab"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <AICultivationLabPage />
          </Suspense>
        }
      />

      {/* 21天善行 (21 Days of Virtue - Phase 34) */}
      <Route
        path="/21-days-virtue"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <VirtueHabitPage />
          </Suspense>
        }
      />

      {/* 奧秘心智 (Omni-Mind - Phase 35) */}
      <Route
        path="/omni-mind"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OmniMindPage />
          </Suspense>
        }
      />

      <Route
        path="/quantum-ethics"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <QuantumEthicsPage />
          </Suspense>
        }
      />

      <Route
        path="/tiffany"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <TiffanyShowcase />
          </Suspense>
        }
      />

      <Route
        path="/learning-command"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <LearningCommandPage />
          </Suspense>
        }
      />

      <Route
        path="/knowledge-vault"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <KnowledgeVaultPage />
          </Suspense>
        }
      />
      <Route
        path="/skill-mastery"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <SkillMasteryPage />
          </Suspense>
        }
      />
      <Route
        path="/strategic-orchestrator"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <StrategicOrchestratorPage />
          </Suspense>
        }
      />
      <Route
        path="/calibration"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ResonanceCalibrationPage />
          </Suspense>
        }
      />
      <Route
        path="/adk-lab"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <AdkLabPage />
          </Suspense>
        }
      />
      <Route
        path="/media-gallery"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <PremiumMediaGallery />
          </Suspense>
        }
      />

      <Route
        path="/report-tutorial"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ReportTutorialPage />
          </Suspense>
        }
      />

      <Route
        path="/advancement-hall"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <AdvancementHallPage />
          </Suspense>
        }
      />

      <Route
        path="/one-click-report"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OneClickReportWizard />
          </Suspense>
        }
      />

      <Route
        path="/strategy-hub"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <StrategyDashboard />
          </Suspense>
        }
      />

      <Route
        path="/service-guide"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ServiceGuideCenter />
          </Suspense>
        }
      />

      <Route
        path="/esg/carbon-accounting"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <CarbonAccountingPage />
          </Suspense>
        }
      />

      {/* Governance & Compliance - Phase 23.3 */}
      <Route
        path="/esg/governance/structure"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <GovernanceStructurePage />
          </Suspense>
        }
      />
      <Route
        path="/esg/governance/compliance"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <ComplianceManagementPage />
          </Suspense>
        }
      />
      <Route
        path="/esg/governance/internal-controls"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <InternalControlsPage />
          </Suspense>
        }
      />
      <Route
        path="/esg/governance/risk"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <RiskManagementPage />
          </Suspense>
        }
      />
      <Route
        path="/esg/governance/infosec"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <InformationSecurityPage />
          </Suspense>
        }
      />

      {/* Stakeholder Services - Phase 23.4 */}
      <Route
        path="/services/stakeholder/employee"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <EmployeeRelationsPage />
          </Suspense>
        }
      />
      <Route
        path="/services/stakeholder/customer"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <CustomerEngagementPage />
          </Suspense>
        }
      />
      <Route
        path="/services/stakeholder/supply-chain"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <SupplyChainPage />
          </Suspense>
        }
      />
      <Route
        path="/services/stakeholder/community"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <CommunityImpactPage />
          </Suspense>
        }
      />
      <Route
        path="/services/stakeholder/investor"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <InvestorRelationsPage />
          </Suspense>
        }
      />
      <Route
        path="/esg/energy"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <EnergyManagementPage />
          </Suspense>
        }
      />
      <Route
        path="/esg/waste"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <WasteManagementPage />
          </Suspense>
        }
      />

      {/* Phase 23.1 Cognitive Services Routes */}
      <Route
        path="/services/cognitive/ai-strategy"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <AIStrategyHubPage />
          </Suspense>
        }
      />
      <Route
        path="/services/cognitive/daily-briefing"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <DailyBriefingPage />
          </Suspense>
        }
      />
      <Route
        path="/services/cognitive/ai-assistant"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ESGAIAssistantPage />
          </Suspense>
        }
      />
      <Route
        path="/services/cognitive/trend-prediction"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <TrendPredictionPage />
          </Suspense>
        }
      />

      <Route
        path="/esg/market-intel"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <MarketIntelligencePage />
          </Suspense>
        }
      />

      <Route
        path="/esg/my-dashboard"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <MyDashboardPage />
          </Suspense>
        }
      />
      {/* MVP V2 Dashboard Route - Added for verification */}
      <Route
        path="/esg/dashboard"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <MVPVersionPage />
          </Suspense>
        }
      />

      <Route
        path="/esg/goodward-rpg"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <GoodwardVillageRPG />
          </Suspense>
        }
      />

      <Route
        path="/esg/water-resource"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <WaterResourcePage />
          </Suspense>
        }
      />

      <Route
        path="/esg/climate-risk"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ClimateRiskPage />
          </Suspense>
        }
      />

      <Route
        path="/esg/human-rights"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <HumanRightsPage />
          </Suspense>
        }
      />

      <Route
        path="/esg/community"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <CommunityEngagementPage />
          </Suspense>
        }
      />

      <Route
        path="/esg/investment"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <SustainableInvestmentPage />
          </Suspense>
        }
      />

      <Route
        path="/esg/transparency"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <DecisionTransparencyPage />
          </Suspense>
        }
      />

      <Route
        path="/social"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniSocialNexus />
          </Suspense>
        }
      />

      <Route
        path="/omni-table"
        element={
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <OmniTableDashboard />
          </Suspense>
        }
      />

      {/* Default Route -> OmniAllInOneHub (MVP Focus) */}
      <Route
        path="*"
        element={
          <Suspense fallback={<Loader2 className="animate-spin text-[#63a6b0]" />}>
            <OmniAllInOneHub />
          </Suspense>
        }
      />
    </Routes>
  );
};

import React, { useState, Suspense } from 'react';
import { View } from '@/types/core';
import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/utils/i18n';

// --- Sub-Dashboards (Lazy Loaded) ---
const JunAiKeyDashboard = React.lazy(() => import('@/components/dashboard/JunAiKeyDashboard'));
const CarbonBentoDashboard = React.lazy(
  () => import('@/components/dashboard/CarbonBentoDashboard')
);
const AmiceDashboard = React.lazy(() =>
  import('@/components/dashboard/AmiceDashboard').then(module => ({
    default: module.AmiceDashboard,
  }))
);
const AgentForge = React.lazy(() =>
  import('@/components/dashboard/AgentForge').then(module => ({ default: module.AgentForge }))
);
const KnowledgeVault = React.lazy(() =>
  import('@/components/dashboard/vault/KnowledgeVault').then(module => ({
    default: module.KnowledgeVault,
  }))
);
const SecurityNode = React.lazy(() =>
  import('@/components/dashboard/security/SecurityNode').then(module => ({
    default: module.SecurityNode,
  }))
);
const ThothDigitalTwin = React.lazy(() =>
  import('@/components/dashboard/wisdom/ThothDigitalTwin').then(module => ({
    default: module.ThothDigitalTwin,
  }))
);
const AutoAiReplyAgent = React.lazy(() =>
  import('@/components/dashboard/AutoAiReplyAgent').then(module => ({
    default: module.AutoAiReplyAgent,
  }))
); // Ensure default export or named
const OmniDigitalTwin = React.lazy(() =>
  import('@/components/dashboard/OmniDigitalTwin').then(module => ({
    default: module.OmniDigitalTwin,
  }))
);
const DesignSystemDashboard = React.lazy(() => import('@/pages/DesignSystemDashboard'));
const SustainabilityReportHub = React.lazy(() =>
  import('@/components/Report/SustainabilityReportHub').then(module => ({
    default: module.SustainabilityReportHub,
  }))
);
const FinancialImpactUI = React.lazy(() =>
  import('@/components/services/collaboration/FinancialImpactUI').then(module => ({
    default: module.FinancialImpactUI,
  }))
);
const DataRoomUI = React.lazy(() =>
  import('@/components/services/collaboration/DataRoomUI').then(module => ({
    default: module.DataRoomUI,
  }))
);
const SovereignIdentityUI = React.lazy(() =>
  import('@/components/services/collaboration/SovereignIdentityUI').then(module => ({
    default: module.SovereignIdentityUI,
  }))
);
const SovereignMentorDashboard = React.lazy(() =>
  import('@/components/dashboard/SovereignMentorDashboard').then(module => ({
    default: module.SovereignMentorDashboard,
  }))
);
const ResonanceScoreView = React.lazy(() =>
  import('@/components/dashboard/ResonanceScoreView').then(module => ({
    default: module.ResonanceScoreView,
  }))
);
const ImpactRadarView = React.lazy(() =>
  import('@/components/dashboard/ImpactRadarView').then(module => ({
    default: module.ImpactRadarView,
  }))
);
const Academy = React.lazy(() =>
  import('@/components/dashboard/Academy').then(module => ({ default: module.Academy }))
);
const MyNorthStar = React.lazy(() =>
  import('@/components/dashboard/MyNorthStar').then(module => ({ default: module.MyNorthStar }))
);
const SustainableVillage = React.lazy(() =>
  import('@/components/dashboard/SustainableVillage').then(module => ({
    default: module.SustainableVillage,
  }))
);
const TrustVerification = React.lazy(() =>
  import('@/components/dashboard/TrustVerification').then(module => ({
    default: module.TrustVerification,
  }))
);
const AchievementWaterfall = React.lazy(() =>
  import('@/pages/AchievementWaterfall').then(module => ({ default: module.AchievementWaterfall }))
);
const StyleGuide = React.lazy(() => import('@/pages/system/StyleGuide'));
const BerkeleyTSISDA = React.lazy(() =>
  import('@/pages/courses/BerkeleyTSISDA').then(module => ({ default: module.BerkeleyTSISDA }))
);
const AdkLabPage = React.lazy(() => import('@/pages/AdkLabPage'));
const SystemStatus = React.lazy(() => import('@/pages/SystemStatus'));
const ResonanceCalibrationPage = React.lazy(() => import('@/pages/ResonanceCalibrationPage'));
const MeshNetworkView = React.lazy(() =>
  import('@/components/dashboard').then(module => ({ default: module.MeshNetworkView }))
);
const JunAiKeyCommandCenter = React.lazy(() =>
  import('@/components/dashboard/JunAiKeyCommandCenter').then(module => ({
    default: module.JunAiKeyCommandCenter,
  }))
);

// Loading Component
const ViewLoader = () => {
  const { t } = useI18n();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
        <span className="text-xs font-mono text-slate-500 animate-pulse">
          {t('system.loading')}
        </span>
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';

export default function OmniDashboard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  // Default to MY_NORTH_STAR for MVP pivot
  const [activeView, setActiveView] = useState<View>(View.MY_NORTH_STAR);

  // 🔄 Redirect to Standalone Pages for immersive experiences
  React.useEffect(() => {
    if (activeView === View.MARKET_INTELLIGENCE) {
      navigate('/market-intel');
    }
    if (activeView === View.MY_NORTH_STAR || activeView === View.PERSONAL_HUB) {
      navigate('/personal-hub');
    }
    if (activeView === View.REPORT_GEN_V2) {
      navigate('/esg-reporting');
    }
    if (activeView === View.ACADEMY) {
      navigate('/goodward-academy');
    }
    if (activeView === View.ESG_GO_GAME) {
      navigate('/esg-go-village');
    }
    if (activeView === View.COMPLIANCE_GUARDIAN) {
      navigate('/compliance-guardian');
    }
    if (activeView === View.QUANTUM_VAULT) {
      navigate('/quantum-vault');
    }
    if (activeView === View.LIQUID_NEURAL_NETWORK) {
      navigate('/liquid-network');
    }
    if (activeView === View.SENTIENT_SYMPHONY) {
      navigate('/sentient-symphony');
    }
    if (activeView === View.AI_CULTIVATION_LAB) {
      navigate('/ai-cultivation-lab');
    }
    if (activeView === View.VIRTUE_HABIT) {
      navigate('/21-days-virtue');
    }
    if (activeView === View.OMNI_MIND) {
      navigate('/omni-mind');
    }
    if (activeView === View.LEARNING_ALCHEMY) {
      navigate('/learning-alchemy');
    }
    if (activeView === View.DEBATE) {
      navigate('/debate');
    }
    if (activeView === View.LEARNING_COMMAND) {
      navigate('/learning-command');
    }
    if (activeView === View.KNOWLEDGE_VAULT) {
      navigate('/knowledge-vault');
    }
    if (activeView === View.SKILL_MASTERY) {
      navigate('/skill-mastery');
    }
    if (activeView === View.STRATEGIC_ORCHESTRATOR) {
      navigate('/strategic-orchestrator');
    }
    if (activeView === View.TIFFANY_SHOWCASE) {
      navigate('/tiffany');
    }
    if (activeView === View.INTEGRITY_PASSPORT) {
      navigate('/integrity-passport');
    }
    if (activeView === View.MISSION_MATRIX) {
      navigate('/mission-matrix');
    }
    if (activeView === View.CARD_COLLECTION) {
      navigate('/card-collection');
    }
    if (activeView === View.DECK_BUILDER) {
      navigate('/deck-builder');
    }
    if (activeView === View.ACHIEVEMENTS) {
      navigate('/achievements');
    }
    if (activeView === View.RESONANCE_CALIBRATION) {
      navigate('/calibration');
    }
    if (activeView === View.BERKELEY_TSISDA) {
      navigate('/courses/berkeley-tsisda');
    }
    if (activeView === View.ADK_LAB) {
      navigate('/adk-lab');
    }
    if (activeView === View.STYLE_GUIDE) {
      navigate('/style-guide');
    }
    if (activeView === View.SYSTEM_STATUS) {
      navigate('/system-status');
    }
    if (activeView === View.MEDIA_GALLERY) {
      navigate('/media-gallery');
    }
    if (activeView === View.PLANETARY_MESH) {
      navigate('/planetary-mesh');
    }
    if (activeView === View.DIGITAL_TWIN || activeView === View.AVATAR) {
      navigate('/personal-hub');
    }
    if (activeView === View.OMNI_PROJECTS) {
      navigate('/omni-projects');
    }
  }, [activeView, navigate]);

  return (
    <MainLayout activeView={activeView} onViewChange={setActiveView}>
      <div className="h-full w-full relative">
        <Suspense fallback={null}>
          <AutoAiReplyAgent />
        </Suspense>

        {/* [Phase 63] Intent-Based Resonance Overlay */}
        <Suspense fallback={null}>
          <ResonanceScoreView />
        </Suspense>

        {/* [Phase 148] JunAiKey Command Center (NL Interface) */}
        <Suspense fallback={null}>
          <div className="absolute top-4 right-4 z-50 w-96 opacity-90 hover:opacity-100 transition-opacity">
            <JunAiKeyCommandCenter />
          </div>
        </Suspense>

        <ErrorBoundary>
          <Suspense fallback={<ViewLoader />}>
            {/* Mapping View IDs to Components */}
            {(activeView === View.MY_ESG || activeView === View.MY_NORTH_STAR) && (
              <div className="h-full overflow-y-auto">
                <JunAiKeyDashboard />
              </div>
            )}
            {activeView === View.DASHBOARD && (
              <div className="h-full overflow-y-auto">
                <CarbonBentoDashboard />
              </div>
            )}
            {activeView === View.AMICE_DASHBOARD && (
              <div className="h-full overflow-y-auto">
                <AmiceDashboard />
              </div>
            )}
            {activeView === View.AGENT_FORGE && (
              <div className="h-full overflow-y-auto p-6">
                <AgentForge />
              </div>
            )}
            {activeView === View.VAULT && (
              <div className="h-full overflow-y-auto p-6">
                <KnowledgeVault logs={[]} />
              </div>
            )}
            {activeView === View.RESTORATION && (
              <div className="h-full overflow-y-auto">
                <SecurityNode />
              </div>
            )}
            {activeView === View.DR_THOTH && (
              <div className="h-full overflow-y-auto p-6">
                <ThothDigitalTwin />
              </div>
            )}
            {/* Omni Digital Twin (The "WOW" feature) */}
            {(activeView === View.OMNI_AGENT || activeView === View.DIGITAL_TWIN) && (
              <div className="h-full overflow-y-auto">
                <OmniDigitalTwin />
              </div>
            )}
            {activeView === View.DESIGN_SYSTEM && (
              <div className="h-full overflow-y-auto">
                <DesignSystemDashboard />
              </div>
            )}
            {activeView === View.REPORT_GEN_V2 && (
              <div className="h-full overflow-y-auto">
                <SustainabilityReportHub />
              </div>
            )}
            {activeView === View.ESG_GO_GAME && (
              <div className="h-full overflow-y-auto">
                <SustainableVillage />
              </div>
            )}
            {activeView === View.FINANCIAL_IMPACT && (
              <div className="h-full overflow-y-auto">
                <FinancialImpactUI />
              </div>
            )}
            {activeView === View.MARKET_INTELLIGENCE && (
              <div className="h-full overflow-y-auto">
                <ImpactRadarView />
              </div>
            )}
            {activeView === View.DATA_ROOM && (
              <div className="h-full overflow-y-auto">
                <DataRoomUI />
              </div>
            )}
            {activeView === View.SOVEREIGN_IDENTITY && (
              <div className="h-full overflow-y-auto">
                <SovereignIdentityUI />
              </div>
            )}
            {activeView === View.SOVEREIGN_MENTOR && (
              <div className="h-full overflow-y-auto">
                <SovereignMentorDashboard />
              </div>
            )}
            {activeView === View.ACADEMY && (
              <div className="h-full overflow-y-auto">
                <Academy />
              </div>
            )}
            {activeView === View.TRUST_VERIFICATION && (
              <div className="h-full overflow-y-auto">
                <TrustVerification />
              </div>
            )}
            {activeView === View.MY_NORTH_STAR && (
              <div className="h-full overflow-y-auto">
                <MyNorthStar />
              </div>
            )}
            {activeView === View.PLANETARY_MESH && (
              <div className="h-full overflow-y-auto">
                <MeshNetworkView />
              </div>
            )}

            {/* Fallback for unmapped views */}
            {!Object.values(View).includes(activeView as any) && (
              <div className="flex items-center justify-center h-full text-slate-500 font-mono">
                [ {t('errors.notFound')}: {activeView} ]
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    </MainLayout>
  );
}

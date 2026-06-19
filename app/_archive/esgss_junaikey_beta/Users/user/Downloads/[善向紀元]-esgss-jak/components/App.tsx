
import React, { useState, useEffect } from 'react';
import { View, Language } from '../types';

// --- 靜態導入所有組件 ---
import { Layout } from './Layout';
import { LoginScreen } from './LoginScreen';
import { MyEsg } from './MyEsg';
import { ToastProvider } from '../contexts/ToastContext';
import { CompanyProvider } from './providers/CompanyProvider';
import { UniversalAgentProvider } from '../contexts/UniversalAgentContext';
import { ToastContainer } from './Toast';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingScreen } from './LoadingScreen';
import { OnboardingSystem } from './OnboardingSystem';
import { NeuralNexus } from './NeuralNexus';

// 分頁組件
import { Dashboard } from './Dashboard';
import { ResearchHub } from './ResearchHub';
import { Academy } from './Academy';
import { Diagnostics } from './Diagnostics';
import { StrategyHub } from './StrategyHub';
import { ReportGen } from './ReportGen';
import { CarbonAsset } from './CarbonAsset';
import { TalentPassport } from './TalentPassport';
import { IntegrationHub } from './IntegrationHub';
import { CultureBot } from './CultureBot';
import { FinanceSim } from './FinanceSim';
import { AuditTrail } from './AuditTrail';
import { GoodwillCoin } from './GoodwillCoin';
import { UniversalRestoration, CardGameArenaView } from './UniversalRestoration';
import { Gamification } from './Gamification';
import { Settings } from './Settings';
import { YangBoZone } from './YangBoZone';
import { AdanZone } from './AdanZone';
import { BusinessIntel } from './BusinessIntel';
import { HealthCheck } from './HealthCheck';
import { UniversalTools } from './UniversalTools';
import { UniversalSystem } from './UniversalSystem';
import { ThinkTank } from './ThinkTank';
import { PartnerPortal } from './PartnerPortal';
import { AboutUs } from './AboutUs';
import { ApiZone } from './ApiZone';
import UniversalBackend from './UniversalBackend';
import { AlumniZone } from './AlumniZone';
import { GoodwillLibrary } from './GoodwillLibrary';
import { UserJournal } from './UserJournal';
import { AgentArena } from './AgentArena';
import { AgentTraining } from './AgentTraining';
import { ProxyMarketplace } from './ProxyMarketplace';
import { DigitalSoulForge } from './DigitalSoulForge';
import { RegenerativeModel } from './RegenerativeModel';
import { PersonalVault } from './PersonalVault';
import { AffiliateZone } from './AffiliateZone';
import { GlobalOperations } from './GlobalOperations';
import { WorkflowLab } from './WorkflowLab';
import { McpConfig } from './McpConfig';
import { ImpactProjects } from './ImpactProjects';
import { UniversalNotes } from './UniversalNotes';
import { HypercubeAiLab } from './HypercubeAiLab';
import { AdminPanel } from './AdminPanel';
import { EcosystemRadar } from './EcosystemRadar';
import { CarbonWallet } from './CarbonWallet';
import { FlowluIntegration } from './FlowluIntegration';
import { X, FileText, Zap, Sparkles, Layout as LayoutIcon, List, CheckCircle, DollarSign, BookOpen, Link, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.MY_ESG);
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleToggleLanguage = () => {
    const newLang = language === 'zh-TW' ? 'en-US' : 'zh-TW';
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  return (
    <ToastProvider>
      <UniversalAgentProvider>
        {!isLoggedIn ? (
          <ErrorBoundary>
            <LoginScreen onLogin={() => setIsLoggedIn(true)} language={language} />
          </ErrorBoundary>
        ) : (
          <CompanyProvider>
            <OnboardingSystem />
            <NeuralNexus />
            <Layout
              currentView={currentView}
              onNavigate={(v: any) => setCurrentView(v)}
              language={language}
              onToggleLanguage={handleToggleLanguage}
            >
              <ErrorBoundary>
                <div className="relative h-full">
                  {(() => {
                    switch (currentView) {
                      case View.MY_ESG: return <MyEsg language={language} onNavigate={(v: any) => setCurrentView(v)} />;
                      case View.VAULT: return <PersonalVault language={language} />;
                      case View.DASHBOARD: return <Dashboard language={language} />;
                      case View.RESTORATION: return <UniversalRestoration language={language} />;
                      case View.CARD_GAME_ARENA: return <CardGameArenaView language={language} />;
                      case View.USER_JOURNAL: return <UserJournal language={language} />;
                      case View.PARTNER_PORTAL: return <PartnerPortal language={language} />;
                      case View.ABOUT_US: return <AboutUs language={language} />;
                      case View.API_ZONE: return <ApiZone language={language} />;
                      case View.UNIVERSAL_BACKEND: return <UniversalBackend language={language} />;
                      case View.RESEARCH_HUB: return <ResearchHub language={language} setGlobalAnalysisResult={setAnalysisResult} />;
                      case View.ACADEMY: return <Academy language={language} />;
                      case View.DIAGNOSTICS: return <Diagnostics language={language} />;
                      case View.STRATEGY: return <StrategyHub language={language} onNavigate={setCurrentView} />;
                      case View.REPORT: return <ReportGen language={language} />;
                      case View.CARBON: return <CarbonAsset language={language} />;
                      case View.TALENT: return <TalentPassport language={language} />;
                      case View.INTEGRATION: return <IntegrationHub language={language} />;
                      case View.CULTURE: return <CultureBot language={language} />;
                      case View.FINANCE: return <FinanceSim language={language} />;
                      case View.AUDIT: return <AuditTrail language={language} />;
                      case View.GOODWILL: return <GoodwillCoin language={language} />;
                      case View.SETTINGS: return <Settings language={language} />;
                      case View.YANG_BO: return <YangBoZone language={language} />;
                      case View.ADAN_ZONE: return <AdanZone language={language} />;
                      case View.BUSINESS_INTEL: return <BusinessIntel language={language} />;
                      case View.HEALTH_CHECK: return <HealthCheck language={language} onNavigate={setCurrentView} />;
                      case View.UNIVERSAL_TOOLS: return <UniversalTools language={language} />;
                      case View.UNIVERSAL_SYSTEM: return <UniversalSystem language={language} />;
                      case View.THINK_TANK: return <ThinkTank language={language} />;
                      case View.ALUMNI_ZONE: return <AlumniZone language={language} />;
                      case View.LIBRARY: return <GoodwillLibrary language={language} />;
                      case View.SOUL_FORGE: return <DigitalSoulForge language={language} />;
                      case View.AGENT_ARENA: return <AgentArena language={language} onNavigate={setCurrentView} />;
                      case View.AGENT_TRAINING: return <AgentTraining language={language} />;
                      case View.PROXY_MARKET: return <ProxyMarketplace language={language} />;
                      case View.PALACE: return <Gamification language={language} />;
                      case View.REGENERATIVE: return <RegenerativeModel language={language} />;
                      case View.AFFILIATE: return <AffiliateZone language={language} />;
                      case View.GLOBAL_OPS: return <GlobalOperations />;
                      case View.WORKFLOW_LAB: return <WorkflowLab language={language} />;
                      case View.MCP_CONFIG: return <McpConfig language={language} />;
                      case View.IMPACT_PROJECTS: return <ImpactProjects language={language} />;
                      case View.UNIVERSAL_NOTES: return <UniversalNotes language={language} />;
                      case View.HYPERCUBE_LAB: return <HypercubeAiLab language={language} />;
                      case View.ADMIN_PANEL: return <AdminPanel language={language} />;
                      case View.ECOSYSTEM_RADAR: return <EcosystemRadar language={language} />;
                      case View.CARBON_WALLET: return <CarbonWallet language={language} />;
                      case View.FLOWLU_INTEGRATION: return <FlowluIntegration language={language} />;
                      default: return <MyEsg language={language} onNavigate={(v: any) => setCurrentView(v)} />;
                    }
                  })()}
                  {/* DeepDoc Analysis Results Overlay ... (omitted for brevity) */}
                </div>
              </ErrorBoundary>
            </Layout>
          </CompanyProvider>
        )}
        <ToastContainer />
      </UniversalAgentProvider>
    </ToastProvider>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { View, Language } from '../types';

// Core imports
import { Layout } from '../components/Layout';
import { ToastProvider, ToastContainer } from '../contexts/ToastContext';
import { UniversalAgentProvider } from '../contexts/UniversalAgentContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import CardArena from '../components/universal/CardArena';

// Provider imports
import { CompanyProvider } from '../components/providers/CompanyProvider';

// Module imports
import { Dashboard } from '../components/Dashboard';
import { MyEsg } from '../components/MyEsg';
import { StrategyHub } from '../components/StrategyHub';
import { CarbonAsset } from '../components/CarbonAsset';
import { FinanceSim } from '../components/FinanceSim';
import { TalentPassport } from '../components/TalentPassport';
import { CultureBot } from '../components/CultureBot';
import { GoodwillCoin } from '../components/GoodwillCoin';
import { Gamification } from '../components/Gamification';
import { Settings } from '../components/Settings';
import { Academy } from '../components/Academy';
import { AdminPanel } from '../components/AdminPanel';
import { AuditTrail } from '../components/AuditTrail';
import { BusinessIntel } from '../components/BusinessIntel';
import { ResearchHub } from '../components/ResearchHub';
import { ReportGen } from '../components/ReportGen';
import { IntegrationHub } from '../components/IntegrationHub';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { ESGAiAssistant } from '../components/ESGAiAssistant';
import { HypercubeAiLab } from '../components/HypercubeAiLab';
import { OmniManager } from '../components/OmniManager';

// Basic components
const LoginScreen = ({ onLogin, language }: { onLogin: () => void; language: Language }) => (
  <div data-testid="login-screen" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
        ESGss JunAiKey 善向永續 萬能元鑰
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        {language === 'zh-TW' ? '企業永續轉型 AI 驅動平台' : 'AI-Driven Enterprise Sustainability Platform'}
      </p>
      <button
        onClick={onLogin}
        className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
      >
        {language === 'zh-TW' ? '🚀 啟動系統' : '🚀 Launch System'}
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.MY_ESG);
  const [language, setLanguage] = useState<Language>('zh-TW');

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

  const renderCurrentView = () => {
    switch (currentView) {
      // Core Navigation
      case View.MY_ESG:
        return <MyEsg language={language} onNavigate={setCurrentView} />;

      case View.DASHBOARD:
        return <Dashboard language={language} />;

      case View.STRATEGY_HUB:
      case View.STRATEGY:
        return <StrategyHub language={language} />;

      // ESG Management
      case View.CARBON_ASSET:
      case View.CARBON_WALLET:
        return <CarbonAsset language={language} />;

      case View.FINANCE:
      case View.FINANCE_SIM:
        return <FinanceSim language={language} />;

      case View.TALENT:
      case View.TALENT_PASSPORT:
        return <TalentPassport language={language} />;

      case View.CULTURE:
      case View.CULTURE_BOT:
        return <CultureBot language={language} />;

      // AI & Research
      case View.HYPERCUBE_LAB:
        return <HypercubeAiLab language={language} />;

      case View.RESEARCH_HUB:
        return <ResearchHub language={language} />;

      case View.BUSINESS_INTEL:
        return <BusinessIntel language={language} />;

      // Reports & Analytics
      case View.REPORT:
      case View.REPORT_GEN:
        return <ReportGen language={language} />;

      case View.ANALYTICS_DASHBOARD:
        return <AnalyticsDashboard language={language} />;

      // Gamification
      case View.GOODWILL:
      case View.GOODWILL_COIN:
        return <GoodwillCoin language={language} />;

      case View.GAMIFICATION:
        return <Gamification language={language} />;

      // System Management
      case View.ADMIN_PANEL:
        return <AdminPanel language={language} />;

      case View.AUDIT:
      case View.AUDIT_TRAIL:
        return <AuditTrail language={language} />;

      case View.SETTINGS:
        return <Settings language={language} />;

      case View.ACADEMY:
        return <Academy language={language} />;

      case View.INTEGRATION:
      case View.INTEGRATION_HUB:
        return <IntegrationHub language={language} />;

      // Universal Features
      case View.CARD_ARENA:
        return <CardArena onCardAction={(cardId, action) => console.log(`Card ${cardId} ${action}`)} />;

      case View.UNIVERSAL_AGENT:
      case View.ESG_AI_ASSISTANT:
        return <ESGAiAssistant language={language} />;

      case View.OMNI_MANAGER:
        return <OmniManager language={language} />;

      // Default fallback
      default:
        return <MyEsg language={language} onNavigate={setCurrentView} />;
    }
  };

  return (
    <ToastProvider>
      <ThemeProvider>
        <UniversalAgentProvider>
          {!isLoggedIn ? (
            <ErrorBoundary>
               <LoginScreen onLogin={() => setIsLoggedIn(true)} language={language} />
            </ErrorBoundary>
          ) : (
            <CompanyProvider>
              <Layout
                currentView={currentView}
                onNavigate={(view: string | View) => {
                  if (typeof view === 'string' && Object.values(View).includes(view as View)) {
                    setCurrentView(view as View);
                  }
                }}
                language={language}
                onToggleLanguage={handleToggleLanguage}
              >
                <ErrorBoundary>
                  <div className="relative h-full">
                    {renderCurrentView()}
                  </div>
                </ErrorBoundary>
              </Layout>
            </CompanyProvider>
          )}
          <ToastContainer />
        </UniversalAgentProvider>
      </ThemeProvider>
    </ToastProvider>
  );
};

export default App;

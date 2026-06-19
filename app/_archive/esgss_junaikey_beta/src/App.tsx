import React, { Suspense, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { OmniProvider } from '@/omni/context/OmniContext';
import { use5TShield } from '@/5-hooks/use5TShield';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SovereignProvider } from '@/contexts/SovereignContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { LoginPortal } from '@/components/auth/LoginPortal';
import { GlobalErrorBoundary } from '@/components/common/GlobalErrorBoundary';
import { Loader2 } from 'lucide-react';
import { StitchThemeProvider } from '@/contexts/StitchThemeContext';
import { DebugDashboard } from '@/components/dashboard/DebugDashboard';
import { AppRoutes } from '@/routes/AppRoutes';
import { OmniSpiritUI } from '@/components/omni/OmniSpiritUI';
import { ResonanceTicker } from '@/components/omni/ResonanceTicker';

// ⚡ Bolt: Lazy load the heavy OmniDashboard component to reduce initial bundle size
// This ensures that the LoginPortal loads quickly without downloading the entire dashboard code.
const OmniDashboard = React.lazy(() => import('@/omni/interaction/control/OmniDashboard'));

const AppContent: React.FC = () => {
  const { isAuthenticated, isMaintenanceMode, loading } = useAuth();
  // 5T Shield Hook (Protection Layer) - Silently active
  use5TShield({});

  useEffect(() => {
    omniLogger.info(LogCategory.SYSTEM, 'App mounted', {
      timestamp: Date.now(),
      isAuthenticated,
    });
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050c14]">
        <Loader2 className="w-12 h-12 text-[#63a6b0] animate-spin mb-4" />
        <p className="text-[#63a6b0] font-mono animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated && !loading) {
    return <LoginPortal />;
  }

  return (
    <div className="min-h-screen bg-[#050c14] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 🛠️ GLOBAL RENDER DETECTION (VISIBLE IF APP IS RUNNING) */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 10000,
        padding: '5px 10px',
        background: '#0ff',
        color: '#000',
        fontSize: '10px',
        fontWeight: 'bold',
        borderRadius: '4px',
        pointerEvents: 'none'
      }}>
        APP ACTIVE: {window.location.pathname}
      </div>

      {/* 全域背景特效 (Global Ambience) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[#0B1221]/50 to-[#050C14]" />

      {/* 主要內容區域 (Main Content Area) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <Loader2 className="w-12 h-12 text-[#63a6b0] animate-spin mb-4" />
              <p className="text-[#63a6b0] font-mono animate-pulse">Initializing Omni-Core...</p>
            </div>
          }
        >
          <main className="flex-1 w-full max-w-[1920px] mx-auto">
            <AppRoutes />
          </main>
        </Suspense>
      </div>

      {/* 奧秘靈魂與共鳴 (Omni Spirit & Resonance) */}
      <OmniSpiritUI />
      <ResonanceTicker />

      {/* Debug Dashboard (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <DebugDashboard />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <OmniProvider>
        <LanguageProvider>
          <ConfirmProvider>
            <AuthProvider>
              <SovereignProvider>
                <StitchThemeProvider>
                  <Router>
                    <AppContent />
                  </Router>
                </StitchThemeProvider>
              </SovereignProvider>
            </AuthProvider>
          </ConfirmProvider>
        </LanguageProvider>
      </OmniProvider>
    </GlobalErrorBoundary>
  );
}

/**
 * 🌟 ESG Sunshine JAK - 主應用 (Standardized)
 * --------------------------------------------------
 * 整合所有新功能：用戶認證、奧秘後台、國際化、ESG 平台
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth, LoginPage, UserPassportPage } from './components/auth/UserAuth';
import { OmniBackend } from './components/admin/OmniBackend';
import { I18nProvider, useI18n } from './utils/i18n';
import { HolisticEducationAssessment } from './components/ESG/HolisticEducationAssessment';
import DeveloperPortal from './components/DeveloperPortal';
import { DashboardStandard } from './components/dashboard/DashboardStandard';
import { OmniAwakeningModule } from './components/OmniAwakeningModule';
import { Menu, User, Settings, LogOut, Code, Zap, FileText } from 'lucide-react';

type MainView =
  | 'esg'
  | 'profile'
  | 'admin'
  | 'dev'
  | 'omninote'
  | 'automation'
  | 'evidence'
  | 'dashboard';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<MainView>('dashboard'); // Default to new standard
  const [showMenu, setShowMenu] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 頂部導航欄 */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0ABAB5] to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">JAK</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">ESG Sunshine</h1>
                <p className="text-xs text-slate-600">Sovereign System v10.1</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all font-bold ${currentView === 'dashboard' ? 'bg-[#0ABAB5] text-white shadow-lg' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                Ecosystem Hub
              </button>
              <button
                onClick={() => setCurrentView('esg')}
                className={`px-4 py-2 rounded-lg transition-all ${currentView === 'esg' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                Assessment
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2 rounded-lg transition-all ${currentView === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 rounded-lg transition-all ${currentView === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                Admin
              </button>
              <button
                onClick={() => setCurrentView('dev')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${currentView === 'dev' ? 'bg-purple-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <Code size={16} />
                Dev Portal
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <User size={16} className="text-slate-600" />
                <span className="text-sm text-slate-800">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentView === 'dashboard' && <DashboardStandard />}
        {currentView === 'esg' && <HolisticEducationAssessment />}
        {currentView === 'profile' && <UserPassportPage />}
        {currentView === 'admin' && <OmniBackend />}
        {currentView === 'dev' && <DeveloperPortal />}
      </main>
    </div>
  );
};

export default function AppNew() {
  return (
    <I18nProvider>
      <AuthProvider>
        <OmniAwakeningModule />
        <AppContent />
      </AuthProvider>
    </I18nProvider>
  );
}

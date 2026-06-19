import React, { useState } from 'react';
import { Sidebar } from './src/components/layout/Sidebar';
import { TacticalDashboard } from './src/components/TacticalDashboard';
import { OmniCalendar } from './src/components/OmniCalendar';
import { OmniTaskMatrix } from './src/components/OmniTaskMatrix';
import { OmniNote } from './src/components/OmniNote';
import { ImpactProject } from './src/components/ImpactProject';
import { OmniEsgCell } from './src/components/OmniEsgCell';
import { X, Activity, Sparkles, ShieldCheck } from './src/components/icons';

// JunAiKey v5.0 - 系統視圖模式
type ViewMode = 'tactical' | 'temporal' | 'execution' | 'impact';

const JunAiKeyApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('tactical');
  const [globalNoteContext, setGlobalNoteContext] = useState<string | null>(null);

  // 處理 OmniEsgCell 的自動化觸發
  const handleAutomationTrigger = async (cellId: string) => {
    console.log(`🚀 觸發自動化流程: ${cellId}`);
    // 這裡可以整合 automationService
    // await executeAutomation(cellId, { triggeredAt: new Date() });
  };

  // 處理打開脈絡筆記
  const handleOpenNote = (contextId: string) => {
    setGlobalNoteContext(contextId);
  };

  // 渲染當前視圖
  const renderView = () => {
    switch (currentView) {
      case 'tactical':
        return (
          <div className="space-y-8">
            <TacticalDashboard />

            {/* ESG 核心指標矩陣 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <OmniEsgCell
                mode="card"
                id="carbon-scope-1"
                label="Carbon Scope 1"
                value={1250.50}
                unit="噸 CO₂e"
                trend={{ value: 8, direction: 'down' }}
                color="emerald"
                onAutomationTrigger={() => handleAutomationTrigger('carbon-scope-1')}
                onClick={() => handleOpenNote('carbon-scope-1')}
              />

              <OmniEsgCell
                mode="card"
                id="energy-intensity"
                label="Energy Intensity"
                value={87.5}
                unit="kWh/萬營收"
                trend={{ value: 12, direction: 'up' }}
                color="gold"
                onAutomationTrigger={() => handleAutomationTrigger('energy-intensity')}
                onClick={() => handleOpenNote('energy-intensity')}
              />

              <OmniEsgCell
                mode="card"
                id="supplier-diversity"
                label="Supplier Diversity"
                value={42}
                unit="%"
                trend={{ value: 5, direction: 'up' }}
                color="purple"
                onAutomationTrigger={() => handleAutomationTrigger('supplier-diversity')}
                onClick={() => handleOpenNote('supplier-diversity')}
              />

              <OmniEsgCell
                mode="card"
                id="waste-reduction"
                label="Waste Reduction"
                value={1250}
                unit="噸"
                trend={{ value: 15, direction: 'down' }}
                color="blue"
                onAutomationTrigger={() => handleAutomationTrigger('waste-reduction')}
                onClick={() => handleOpenNote('waste-reduction')}
              />

              <OmniEsgCell
                mode="card"
                id="employee-satisfaction"
                label="Employee Satisfaction"
                value={4.2}
                unit="/5"
                trend={{ value: 8, direction: 'up' }}
                color="emerald"
                onAutomationTrigger={() => handleAutomationTrigger('employee-satisfaction')}
                onClick={() => handleOpenNote('employee-satisfaction')}
              />

              <OmniEsgCell
                mode="card"
                id="board-independence"
                label="Board Independence"
                value={75}
                unit="%"
                trend={{ value: 3, direction: 'up' }}
                color="slate"
                onAutomationTrigger={() => handleAutomationTrigger('board-independence')}
                onClick={() => handleOpenNote('board-independence')}
              />
            </div>
          </div>
        );

      case 'temporal':
        return (
          <div className="h-full">
            <OmniCalendar />
          </div>
        );

      case 'execution':
        return (
          <OmniTaskMatrix />
        );

      case 'impact':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImpactProject />
              <ImpactProject compact />
            </div>
          </div>
        );

      default:
        return <TacticalDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* 背景星雲特效 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 側邊導航 */}
      <aside className="relative z-20 shrink-0">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      </aside>

      {/* 主內容區 */}
      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-8 max-w-7xl mx-auto">
          {/* 頁首 */}
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                  JunAiKey v5.0
                </h1>
                <p className="text-slate-400 mt-2">ESG 萬能元件系統 - 鼎竣 CSO 專用版本</p>
              </div>

              {/* 系統狀態指示器 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-slate-300">系統正常</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-slate-300">免疫活躍</span>
                </div>
              </div>
            </div>
          </header>

          {/* 動態視圖內容 */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderView()}
          </div>
        </div>
      </main>

      {/* 萬能筆記抽屜 (Global Omni-Note Drawer) */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl transform transition-transform duration-500 ease-spring z-50 ${
        globalNoteContext ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {globalNoteContext && (
          <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-celestial-purple" />
                萬能筆記 (Omni-Notes)
              </h3>
              <button
                onClick={() => setGlobalNoteContext(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">
              <OmniNote
                contextId={globalNoteContext}
                onSave={(content) => {
                  console.log(`💾 筆記已儲存 - 上下文: ${globalNoteContext}`);
                  // 這裡可以整合筆記儲存邏輯
                }}
              />
            </div>

            {/* 脈絡記憶顯示 */}
            <div className="mt-6 p-4 rounded-xl bg-black/20 border border-white/5">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">脈絡記憶</h4>
              <div className="text-xs text-slate-600 font-mono space-y-1">
                <div>&gt; 上下文ID: {globalNoteContext}</div>
                <div>&gt; 免疫攔截次數: 3</div>
                <div>&gt; 最後同步: 5 分鐘前</div>
                <div>&gt; 關聯任務: 2 個進行中</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JunAiKeyApp;
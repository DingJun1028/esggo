/**
 * 🏛️ 揭示儀表板 (Disclosure Dashboard)
 * --------------------------------------------------
 * [核心任務] 信任鑄造廠：將數據背後的 5T 證據鏈進行「數位開箱」。
 * [5T HUD] T1(溯源), T2(蹤跡), T3(透明), T4(可感), T5(信實)
 */

import React from 'react';
import { DisclosureWrapper } from '../ui/DisclosureWrapper';
import { OmniBase } from '../../core/OmniBase';
import { LogCategory, omniLogger } from '../../omni/infrastructure/logging/OmniLogger';
import { IComponentCore, IEvidenceMap } from '../../0-domain/contracts/IComponentCore';

// 模擬一個具備揭示能力的組件核心
class MockEsgData extends OmniBase implements IComponentCore {
  public value: number;
  public unit: string;
  public evidence: IEvidenceMap;
  public status: 'Trustworthy' | 'Draft' | 'Proposed' | 'Calculated' | 'Approved' | 'Sealed' | 'Violated' | 'DORMANT' | 'INITIALIZING' | 'ACTIVE' | 'OPTIMIZING' | 'TERMINATING' = 'Trustworthy';

  get uuid() { return this.id; }
  get version() { return '7.0.0'; }
  get timestamp() { return this.createdAt; }

  constructor(value: number, unit: string) {
    super('IoT_Sensor_Gateway_01');
    this.value = value;
    this.unit = unit;
    
    this.evidence = {
      traceable: { source_origin: 'Mock_Sensor' },
      trackable: { lifecycle_hooks: [] },
      transparent: { formula: 'Mock_Formula' },
      trustworthy: { hash_lock: 'Mock_Hash', is_frozen: false }
    };
  }
}

export const DisclosureDashboard: React.FC = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [showDownload, setShowDownload] = React.useState(false);

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setShowDownload(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // 模擬實時數據
  const carbonData = new MockEsgData(428, 'TonCO2e');
  const energyData = new MockEsgData(15000, 'kWh');

  // T1: Formula Expansion (Mock)
  const renderFormula = () => (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-xs text-slate-300">
      <div className="text-amber-400 mb-2">[T1] Calculable (可驗算)</div>
      <div>E = Σ(Activity_Data × Emission_Factor)</div>
      <div className="text-slate-500 mt-1">Ref: [IPCC-2006-V2]</div>
    </div>
  );

  // T2: Traceability Topology (Mock)
  const renderTopology = () => (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-xs text-slate-300">
      <div className="text-blue-400 mb-2">[T2] Traceable (可溯源)</div>
      <div className="flex items-center gap-2">
        <span className="bg-slate-800 px-2 py-1 rounded">IoT Sensor</span>
        <span>→</span>
        <span className="bg-slate-800 px-2 py-1 rounded">Edge Gateway</span>
        <span>→</span>
        <span className="bg-emerald-900/50 px-2 py-1 rounded text-emerald-300">Omni Core</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-200" id="disclosure-dashboard">
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            永續報告書撰寫平台 (一鍵完成)
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            To Reveal is to Be. 每一筆數據都是透明的契約。
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          {isGenerating ? (
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-emerald-400">
                <span>GENERATING REPORT...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : showDownload ? (
            <button
              onClick={() => setShowDownload(false)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all"
            >
              下載已完成報告 (PDF)
            </button>
          ) : (
            <button
              onClick={startGeneration}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/20 transition-all animate-pulse"
            >
              一鍵完成：自動撰寫報告
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: 4T HUD Visualizations */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">🛡️ 5T Trust Foundry</h2>
          {renderFormula()}
          {renderTopology()}

          {/* T3 & T4 Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <div className="text-purple-400 text-xs mb-1">[T3] Trackable</div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-[10px] text-slate-500">Lifecycle Coverage</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <div className="text-red-400 text-xs mb-1">[T4] Immutable</div>
              <div className="text-2xl font-bold">LOCKED</div>
              <div className="text-[10px] text-slate-500">Hash Verified</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Data with Disclosure Wrapper */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">
            ⚡ Omni-Components (Hover to Reveal)
          </h2>

          <DisclosureWrapper data={carbonData}>
            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 p-6 rounded-xl border border-emerald-500/30">
              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-2">
                Total Carbon Emission
              </h3>
              <div className="text-5xl font-bold text-white tracking-tight">
                {carbonData.value}{' '}
                <span className="text-lg text-emerald-400 font-normal">{carbonData.unit}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] px-2 py-1 bg-slate-800 rounded text-slate-400">
                  UUID: {carbonData.uuid.slice(0, 8)}
                </span>
                <span className="text-[10px] px-2 py-1 bg-emerald-900/50 rounded text-emerald-300">
                  VERIFIED
                </span>
              </div>
            </div>
          </DisclosureWrapper>

          <DisclosureWrapper data={energyData}>
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 p-6 rounded-xl border border-blue-500/30">
              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-2">
                Energy Consumption
              </h3>
              <div className="text-5xl font-bold text-white tracking-tight">
                {energyData.value.toLocaleString()}{' '}
                <span className="text-lg text-blue-400 font-normal">{energyData.unit}</span>
              </div>
            </div>
          </DisclosureWrapper>
        </div>
      </div>
    </div>
  );
};

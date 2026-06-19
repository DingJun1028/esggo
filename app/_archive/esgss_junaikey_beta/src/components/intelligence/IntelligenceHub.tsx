/**
 * 💡 核心組件：ESGss 情資商業中心 (Intelligence Hub)
 * --------------------------------------------------
 * [視覺] 高密度 Bento Box 佈局 ("War Room" Style)
 * [功能] 實時監測 S1-S5 訊號，整合 3+1 協議驗證
 * [Source of Truth] Data_Dictionary_Omni.md
 */
import React from 'react';
import {
  Globe,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Fingerprint,
  Search,
  Sliders,
  Activity,
  Zap,
} from 'lucide-react';
import { IIntelNode } from '../../types/intelligence';
// Use esgss_schema types where applicable for broader compatibility
import { SourceTaxonomy } from '../../types/esgss_schema';

// --- Sub-components (Bento Tiles) ---

// 1. 搜尋與過濾列 (Global Search)
const SearchBar = () => (
  <div className="flex gap-3 mb-4 bg-[#0A0A0A] p-2 rounded-xl border border-white/10 shadow-sm">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
      <input
        type="text"
        placeholder="Search Enterprise, Scandal, or Policy Signal..."
        className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 text-xs rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
      />
    </div>
    <button className="px-3 py-1 bg-slate-800 rounded-lg text-slate-400 text-xs hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-2">
      <Sliders className="w-3 h-3" />
      <span>Filter</span>
    </button>
  </div>
);

// 2. 醜聞雷達 (Scandal Radar - Heatmap Node)
const ScandalCard = ({
  entity,
  risk,
  summary,
}: {
  entity: string;
  risk: number;
  summary: string;
}) => (
  <div
    className={`p-3 rounded-xl border ${risk > 4 ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'bg-slate-900 border-slate-800'} relative group transition-all hover:scale-[1.02]`}
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
        {entity}
      </h4>
      <div className="flex items-center gap-1">
        <span
          className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
            risk > 4
              ? 'bg-red-500 text-black border-red-400'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          RISK: {risk}/5
        </span>
      </div>
    </div>
    <p className="text-[10px] text-slate-400 leading-tight mb-2 line-clamp-2">{summary}</p>
    <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
      <span className="text-[8px] text-slate-500 font-mono">Source: Reuters (S3)</span>
      {risk > 4 && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse ml-auto" />}
    </div>
  </div>
);

// 3. 情資流 (Intel Stream - Command Center Feed)
const IntelItem = ({ intel }: { intel: IIntelNode }) => (
  <div className="flex gap-3 p-3 bg-[#080808] border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer last:border-0 relative overflow-hidden">
    {/* Status Line */}
    <div
      className={`mt-1 min-w-[3px] h-8 rounded-full z-10 ${
        intel.category === 'Scandal'
          ? 'bg-red-500'
          : intel.category === 'Policy'
            ? 'bg-indigo-500'
            : 'bg-emerald-500'
      }`}
    />

    <div className="flex-1 z-10">
      <div className="flex justify-between items-center mb-1">
        <span
          className={`text-[9px] font-bold uppercase tracking-wider ${
            intel.category === 'Scandal'
              ? 'text-red-400'
              : intel.category === 'Policy'
                ? 'text-indigo-400'
                : 'text-emerald-400'
          }`}
        >
          [{intel.category}]
        </span>
        <span className="text-[9px] text-slate-600 font-mono">
          {new Date(intel.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-[11px] text-slate-300 leading-tight mb-1 group-hover:text-white transition-colors">
        {intel.data.summary || 'Global ESG regulatory update detected.'}
      </p>
      <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <Fingerprint className="w-3 h-3 text-emerald-500" />
        <span className="text-[8px] text-emerald-600 font-mono">
          hash:{' '}
          {(intel.evidence as any).hash
            ? ((intel.evidence as any).hash as string).slice(0, 8)
            : 'UNK'}
          ...
        </span>
        <span className="ml-auto text-[9px] text-slate-500 border border-slate-800 px-1 rounded">
          Score: {intel.confidence_score}
        </span>
      </div>
    </div>
  </div>
);

// Main Component
export const IntelligenceHub: React.FC = () => {
  // Mock Data (Simulating S1-S5 Inputs)
  const mockIntel: IIntelNode[] = [
    {
      uuid: 'I1',
      version: '1.0',
      timestamp: Date.now(),
      category: 'Policy',
      confidence_score: 0.98,
      action_trigger: true,
      evidence: { source_origin: 'UN', hash: '0xA1...B2' },
      data: { summary: 'EU Parliament approves new CBAM amendment for 2026.' },
      sourceType: SourceTaxonomy.S1_PRIMARY_SENSOR,
      createdAt: Date.now(),
      hash: 'xxx',
      label: 'Policy Update',
      evidenceType: 'S3',
    },
    {
      uuid: 'I2',
      version: '1.0',
      timestamp: Date.now() - 3600000,
      category: 'Scandal',
      confidence_score: 0.95,
      action_trigger: true,
      evidence: { source_origin: 'Reuters', hash: '0xC3...D4' },
      data: { summary: 'Major textile supplier in Vietnam flagged for labor violations.' },
      sourceType: SourceTaxonomy.S3_VERIFIED_AUDIT,
      createdAt: Date.now(),
      hash: 'yyy',
      label: 'Scandal Alert',
      evidenceType: 'S3',
    },
    {
      uuid: 'I3',
      version: '1.0',
      timestamp: Date.now() - 7200000,
      category: 'Market',
      confidence_score: 0.88,
      action_trigger: false,
      evidence: { source_origin: 'Bloomberg', hash: '0xE5...F6' },
      data: { summary: 'Carbon credit prices surge 15% amid new strict verification rules.' },
      sourceType: SourceTaxonomy.S5_INFERRED_AI,
      createdAt: Date.now(),
      hash: 'zzz',
      label: 'Market Intel',
      evidenceType: 'S5',
    },
  ] as any; // Type assertion for mockup compatibility with partial IIntelNode

  return (
    <div className="bg-[#030303] text-slate-200 p-6 rounded-[32px] w-full h-full font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-2">
            <Globe className="text-emerald-500 w-6 h-6" />
            Intelligence Hub{' '}
            <span className="text-slate-600 text-sm font-light normal-case border-l border-slate-800 pl-2 ml-2">
              Final Fusion v2.0
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">System Active</span>
          </div>
        </div>
      </div>

      <SearchBar />

      {/* Bento Grid Layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Left: Strategic Map & Stats (Cols 8) */}
        <div className="col-span-12 lg:col-span-8 grid grid-rows-6 gap-4 min-h-0">
          {/* Top: Map Placeholder (Row 4) */}
          <div className="row-span-4 bg-[#0A0A0A] border border-white/5 rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                <Globe className="w-3 h-3" /> Global Risk Heatmap
              </h3>
            </div>

            {/* Mock Map Visual */}
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-[#050505] to-[#050505] flex items-center justify-center relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

              <div className="relative w-[300px] h-[300px] border border-slate-700/30 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center">
                <div className="absolute w-[200px] h-[200px] border border-slate-700/50 rounded-full border-dashed" />
                {/* Orbiting Nodes */}
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_red] animate-ping" />
                <div className="absolute bottom-1/4 right-0 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
              </div>
              <p className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono border border-slate-800 px-2 py-1 rounded">
                LIVE DATA STREAM :: CONNECTED
              </p>
            </div>
          </div>

          {/* Bottom: Tickers (Row 2) */}
          <div className="row-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group">
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-emerald-400 transition-colors">
                  Carbon Price
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">€84.50</span>
              <span className="text-[10px] text-emerald-500 font-mono bg-emerald-500/10 w-fit px-1 rounded">
                +2.4%
              </span>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group">
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-blue-400 transition-colors">
                  Compliance Idx
                </span>
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">98.2</span>
              <span className="text-[10px] text-blue-500 font-mono bg-blue-500/10 w-fit px-1 rounded">
                Optimized
              </span>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/5 transition-colors group">
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-amber-400 transition-colors">
                  Threat Level
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">LOW</span>
              <span className="text-[10px] text-amber-500 font-mono bg-amber-500/10 w-fit px-1 rounded">
                Systems Nominal
              </span>
            </div>
          </div>
        </div>

        {/* Right: Intel Stream & Radar (Cols 4) */}
        <div className="col-span-12 lg:col-span-4 bg-[#050505] border lg:border-l border-white/5 rounded-2xl lg:rounded-r-[32px] lg:rounded-l-none p-0 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-[#080808]">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-500" /> Live Intelligence
            </h3>
          </div>

          {/* Stream Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {mockIntel.map(intel => (
              <IntelItem key={intel.uuid} intel={intel} />
            ))}
            <div className="p-4 text-center">
              <span className="text-[9px] text-slate-600 font-mono animate-pulse flex items-center justify-center gap-2">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                Monitoring 30+ Sources
              </span>
            </div>
          </div>

          {/* Scandal Radar Mini-Widget */}
          <div className="p-4 bg-[#0A0A0A] border-t border-white/5">
            <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between">
              <span>Scandal Radar</span>
              <ShieldAlert className="w-3 h-3 text-red-500" />
            </h3>
            <div className="space-y-2">
              <ScandalCard
                entity="TechCorp Inc."
                risk={2}
                summary="Minor water usage discrepancy reported."
              />
              <ScandalCard
                entity="FastFashion Co."
                risk={5}
                summary="Critical supply chain labor audit failed."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Globe,
  Database,
  Filter,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Scale,
  TrendingUp,
  Zap,
  Factory,
} from 'lucide-react';

// S1-S5 Source Taxonomy
type SourceCategory = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

interface ESGSource {
  id: string;
  name: string;
  category: SourceCategory;
  url: string;
  signalType: string; // e.g., 'Policy', 'Compliance', 'Risk', 'Finance', 'Tech'
}

const SOURCE_TAXONOMY: ESGSource[] = [
  // S1: Global Governance (Policy Signal)
  {
    id: 'S1-01',
    name: 'United Nations (UN)',
    category: 'S1',
    url: 'https://www.un.org',
    signalType: 'Policy',
  },
  { id: 'S1-02', name: 'UNDP', category: 'S1', url: 'https://www.undp.org', signalType: 'Policy' },
  { id: 'S1-03', name: 'UNEP', category: 'S1', url: 'https://www.unep.org', signalType: 'Policy' },
  { id: 'S1-04', name: 'UNFCCC', category: 'S1', url: 'https://unfccc.int', signalType: 'Climate' },
  { id: 'S1-05', name: 'IPCC', category: 'S1', url: 'https://www.ipcc.ch', signalType: 'Science' },
  {
    id: 'S1-06',
    name: 'World Bank',
    category: 'S1',
    url: 'https://www.worldbank.org',
    signalType: 'Policy',
  },
  { id: 'S1-07', name: 'OECD', category: 'S1', url: 'https://www.oecd.org', signalType: 'Policy' },

  // S2: Standards & Disclosure (Compliance Signal)
  {
    id: 'S2-01',
    name: 'ISSB (IFRS)',
    category: 'S2',
    url: 'https://www.ifrs.org/issb',
    signalType: 'Compliance',
  },
  {
    id: 'S2-02',
    name: 'GRI',
    category: 'S2',
    url: 'https://www.globalreporting.org',
    signalType: 'Standard',
  },
  {
    id: 'S2-03',
    name: 'SASB',
    category: 'S2',
    url: 'https://www.sasb.org',
    signalType: 'Standard',
  },
  {
    id: 'S2-04',
    name: 'TCFD',
    category: 'S2',
    url: 'https://www.fsb-tcfd.org',
    signalType: 'Framework',
  },
  { id: 'S2-05', name: 'TNFD', category: 'S2', url: 'https://tnfd.global', signalType: 'Nature' },

  // S3: Think Tanks (Systemic Risk Signal)
  { id: 'S3-01', name: 'WEF', category: 'S3', url: 'https://www.weforum.org', signalType: 'Risk' },
  {
    id: 'S3-02',
    name: 'Stockholm Resilience',
    category: 'S3',
    url: 'https://www.stockholmresilience.org',
    signalType: 'Science',
  },
  {
    id: 'S3-03',
    name: 'Chatham House',
    category: 'S3',
    url: 'https://www.chathamhouse.org',
    signalType: 'Geopolitics',
  },
  {
    id: 'S3-04',
    name: 'MIT Systems',
    category: 'S3',
    url: 'https://www.mit.edu',
    signalType: 'Tech',
  },

  // S4: Finance & Energy (Capital Signal)
  { id: 'S4-01', name: 'PRI', category: 'S4', url: 'https://www.unpri.org', signalType: 'Finance' },
  { id: 'S4-02', name: 'NGFS', category: 'S4', url: 'https://www.ngfs.net', signalType: 'Finance' },
  { id: 'S4-03', name: 'IEA', category: 'S4', url: 'https://www.iea.org', signalType: 'Energy' },

  // S5: Industry (Sector Signal)
  { id: 'S5-01', name: 'SEMI', category: 'S5', url: 'https://www.semi.org', signalType: 'Semi' },
  { id: 'S5-02', name: 'imec', category: 'S5', url: 'https://www.imec-int.com', signalType: 'R&D' },
  {
    id: 'S5-03',
    name: 'TSMC ESG',
    category: 'S5',
    url: 'https://esg.tsmc.com',
    signalType: 'Benchmark',
  },
];

const CATEGORIES = {
  S1: { label: 'Governance', icon: ShieldCheck, color: 'text-aqua-400' },
  S2: { label: 'Standards', icon: Scale, color: 'text-emerald-400' },
  S3: { label: 'Research', icon: Globe, color: 'text-purple-400' },
  S4: { label: 'Finance', icon: TrendingUp, color: 'text-amber-400' },
  S5: { label: 'Industry', icon: Factory, color: 'text-aqua-400' },
};

const IntelligenceCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SourceCategory>('S1');

  const activeSources = SOURCE_TAXONOMY.filter(s => s.category === activeTab);
  const categoryInfo = CATEGORIES[activeTab];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Database className="w-3 h-3 text-aqua-400" />
          Global Intel v2.0
        </h3>
        <span className="text-[9px] px-2 py-0.5 rounded bg-aqua-900/30 text-aqua-400 border border-aqua-500/20">
          30+ SOURCES
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-2 custom-scrollbar md:pb-0">
        {(Object.keys(CATEGORIES) as SourceCategory[]).map(cat => {
          const info = CATEGORIES[cat];
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 min-w-fit ${isActive
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
            >
              <info.icon className={`w-3 h-3 ${info.color}`} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Active Category Description */}
      <div className="flex items-center gap-2 mb-3 bg-black/20 p-2 rounded-lg border border-white/5">
        <categoryInfo.icon className={`w-4 h-4 ${categoryInfo.color}`} />
        <div>
          <div className="text-xs font-bold text-white">{categoryInfo.label} Sources</div>
          <div className="text-[10px] text-slate-500 truncate max-w-[200px] md:max-w-none">
            Signal: {activeSources[0]?.signalType} • Decision-Ready Content
          </div>
        </div>
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {activeSources.map(source => (
          <div
            key={source.id}
            className="group flex items-center justify-between p-2 rounded bg-slate-800/30 border border-transparent hover:border-aqua-500/30 hover:bg-slate-800/50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-white/10 to-transparent group-hover:from-aqua-400 group-hover:to-aqua-500 transition-all" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-300 font-medium truncate group-hover:text-white transition-colors">
                  {source.name}
                </div>
                <div className="text-[9px] text-slate-600 flex items-center gap-1 group-hover:text-aqua-400/70">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  Active Monitoring
                </div>
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-aqua-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-1" />
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-3 pt-2 border-t border-white/5 text-[9px] text-slate-600 font-mono text-center">
        SOURCE LEVEL: PRIMARY (NO MEDIA)
      </div>
    </div>
  );
};

export default IntelligenceCenter;

import React from 'react';
import { useOmniResonance } from '../omni/hooks/useOmniResonance';
import { Activity, Leaf, Users, Scale } from 'lucide-react';

// 奧秘元件 (Omni Component)
// This is the View layer that consumes the Resonance.

interface OmniESGDisplayProps {
  companyId: string;
}

const OmniESGDisplay: React.FC<OmniESGDisplayProps> = ({
  companyId,
}: OmniESGDisplayProps): React.ReactNode => {
  // Connect to the Omni Heart Core
  const { data, loading, error, resonanceLevel, refresh } = useOmniResonance(companyId);

  if (loading && resonanceLevel !== 'harmonized') {
    return (
      <div className="flex items-center justify-center p-8 bg-black/5 rounded-xl backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        <span className="ml-3 text-cyan-400 font-medium">Resonating...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <h3 className="font-bold">Resonance Dissonance</h3>
        <p>{error}</p>
        <button onClick={refresh} className="mt-2 text-sm underline">
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-cyan-500/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] hover:scale-[1.01]">
      {/* Header with Resonance Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {String(data.metadata?.companyName || 'Unknown Entity')}
          </h2>
          <div className="flex items-center mt-1 space-x-2">
            <span
              className={`h-2 w-2 rounded-full ${resonanceLevel === 'harmonized' ? 'bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-gray-400'}`}
            ></span>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2">
              System Resonance:{' '}
              <span
                className={resonanceLevel === 'harmonized' ? 'text-cyan-400' : 'text-slate-500'}
              >
                {resonanceLevel}
              </span>
            </span>
          </div>
        </div>
        <button
          onClick={refresh}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Activity className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* The Four Elements Visualization (Data Display) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Environmental */}
        <div className="group p-4 bg-emerald-900/10 rounded-xl border border-emerald-500/20 hover:border-emerald-400/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg mr-3">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-emerald-400">Environmental</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Carbon Footprint</span>
              <span className="font-mono font-medium">{data.environmental.carbonFootprint} t</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="group p-4 bg-blue-900/10 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-blue-400">Social</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Happiness Index</span>
              <span className="font-mono font-medium">{data.social.employeeSatisfaction}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${data.social.employeeSatisfaction}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Governance */}
        <div className="group p-4 bg-purple-900/10 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg mr-3">
              <Scale className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-purple-400">Governance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Ethics Score</span>
              <span className="font-mono font-medium">{data.governance.ethicalCompliance}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-purple-500 h-1.5 rounded-full"
                style={{ width: `${data.governance.ethicalCompliance}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OmniESGDisplay;

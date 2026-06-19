import React from 'react';
import { User, Award, Briefcase, Zap, Star, TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ITalentPassport, SourceTaxonomy } from '../types/esgss_schema';

// Mock Data Wrapper (In real app, this would come from props or store)
// For now, we default to a mock if no data is provided.
const MOCK_PASSPORT_DATA: ITalentPassport = {
  userUuid: 'USR-888-999',
  alias: 'Dr. Omni',
  skillsRadar: {
    strategic: 95,
    execution: 88,
    innovation: 92,
    compliance: 85,
    leadership: 78,
  },
  impactHistory: ['LG-001', 'LG-002', 'LG-003', 'LG-004', 'LG-005'],
  integrityScore: 0.98,
};

interface TalentPassportProps {
  data?: ITalentPassport;
}

export const TalentPassport: React.FC<TalentPassportProps> = ({ data = MOCK_PASSPORT_DATA }) => {
  // Transform radar data for Recharts
  const radarData = [
    { subject: 'Strategic', A: data.skillsRadar.strategic, fullMark: 100 },
    { subject: 'Execution', A: data.skillsRadar.execution, fullMark: 100 },
    { subject: 'Innovation', A: data.skillsRadar.innovation, fullMark: 100 },
    { subject: 'Compliance', A: data.skillsRadar.compliance, fullMark: 100 },
    { subject: 'Leadership', A: data.skillsRadar.leadership, fullMark: 100 },
  ];

  return (
    <div className="h-full w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 font-sans text-slate-100 overflow-y-auto">
      {/* --- IDENTITY MODULE (Glassmorphism + Static Identity) --- */}
      {/* Bento Box: Top Left - 4 cols */}
      <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Holographic Ring */}
        <div className="relative w-32 h-32 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#00FFFF]/50 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-purple-400/50 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center overflow-hidden">
              <User className="w-12 h-12 text-slate-400" />
            </div>
          </div>
          {/* Status Indicator */}
          <div className="absolute bottom-1 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
          {data.alias}
        </h2>
        <div className="font-mono text-xs text-[#00FFFF] mt-1 bg-[#00FFFF]/10 px-2 py-1 rounded border border-[#00FFFF]/20">
          UUID: {data.userUuid}
        </div>

        <div className="mt-6 w-full grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-emerald-500/30 transition-colors">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Integrity</div>
            <div className="text-xl font-bold text-emerald-400">
              {(data.integrityScore * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-purple-500/30 transition-colors">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Impact Assets</div>
            <div className="text-xl font-bold text-purple-400">{data.impactHistory.length}</div>
          </div>
        </div>
      </div>

      {/* --- RADAR VISUALIZATION (Dynamic Assets) --- */}
      {/* Bento Box: Top Right - 8 cols */}
      <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col">
        <div className="flex justify-between items-center mb-2 px-2">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Source Taxonomy Profiling
          </h3>
          <span className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded-full">
            Live Monitor
          </span>
        </div>

        <div className="flex-1 w-full min-h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Proficiency"
                dataKey="A"
                stroke="#00FFFF"
                strokeWidth={2}
                fill="#00FFFF"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Overlay Stats */}
          <div className="absolute top-0 right-0 p-2 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00FFFF]"></span>
              <span className="text-slate-400">S1 Sensor Data</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">S5 Inferred Logic</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- ASSET LEDGER (Consolidated Timeline) --- */}
      {/* Bento Box: Bottom - Full Width */}
      <div className="lg:col-span-12 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          Impact Asset Ledger (Chain of Custody)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-3">Asset ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Verification</th>
                <th className="p-3 text-right">Credits</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.impactHistory.map((id, index) => (
                <tr key={id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono text-[#00FFFF]">{id}</td>
                  <td className="p-3 text-slate-300">Carbon Reduction Project #{index + 1}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs border ${index % 2 === 0
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                        }`}
                    >
                      {index % 2 === 0 ? 'S3 Verified' : 'S4 Reported'}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-white">
                    {1250 + index * 350} <span className="text-slate-500 text-xs">ITK</span>
                  </td>
                </tr>
              ))}
              {/* Empty State / Filler */}
              {data.impactHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No impact assets recorded. Initialize S1-S5 protocols.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Default export for lazy loading
export default TalentPassport;


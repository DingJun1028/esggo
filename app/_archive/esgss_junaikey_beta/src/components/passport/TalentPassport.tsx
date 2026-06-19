import React from 'react';
import {
  Award,
  ShieldCheck,
  Zap,
  Globe,
  Cpu,
  Users,
  Briefcase,
  Lock,
  Fingerprint,
  Coins,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

/**
 * 💡 奧秘 UI 元件：永續人才護照 (Sustainability Talent Passport)
 * --------------------------------------------------
 * [協議] 整合 Berkeley 認證、ImpactNexus 與 3+1 協議
 * [視覺] Credit-Score Style / Glassmorphism
 */

interface Badge {
  id: string;
  name: string;
  icon?: React.ReactNode;
  color?: string;
  date: string;
  lockedHash: string;
}

interface TalentPassportProps {
  user: {
    name: string;
    title: string;
    avatar?: string;
    uuid: string;
    berkeleyId?: string;
    evolutionLevel?: number;
    masteryLevel?: number;
    digitalSignature?: string;
  };
  stats: {
    governance: number;
    innovation: number;
    traceability: number;
    impact: number;
    technical: number;
  };
  assets: {
    itkBalance: number;
    lockedSroiValue: number;
  };
  badges: Badge[];
}

// 3+1 協議驗證標章
const ProtocolBadge = ({ type }: { type: 'immutable' | 'traceable' | 'calculable' }) => {
  const config = {
    immutable: {
      label: 'Immutable',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
    traceable: {
      label: 'Traceable',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    calculable: {
      label: 'Calculable',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  }[type];

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded border ${config.bg} ${config.border}`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text', 'bg')} animate-pulse`}
      />
      <span className={`text-[9px] font-black uppercase tracking-wider ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export const TalentPassport: React.FC<TalentPassportProps> = ({ user, stats, assets, badges }) => {
  const radarData = [
    { subject: 'Strategy', A: stats.governance, fullMark: 100 },
    { subject: 'Innovation', A: stats.innovation, fullMark: 100 },
    { subject: 'Traceability', A: stats.traceability, fullMark: 100 },
    { subject: 'Impact', A: stats.impact, fullMark: 100 },
    { subject: 'Technical', A: stats.technical, fullMark: 100 },
    { subject: 'Value', A: (stats.impact + stats.innovation) / 2, fullMark: 100 },
  ];

  return (
    <div className="w-full max-w-[800px] bg-[#0A0A0A] rounded-[24px] overflow-hidden border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative font-sans">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row h-full relative z-10">
        {/* 1. 左側：ID 維度 (Identity Core) */}
        <div className="md:w-[280px] p-6 bg-[#050505] border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

          <div>
            <div className="mb-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                Identity Core
              </h3>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-black p-[1px] shadow-2xl mb-4 group cursor-pointer relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-full h-full rounded-[15px] bg-slate-900 overflow-hidden relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-700">
                      {user.name[0]}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded border border-black shadow-lg">
                  Lv.{user.evolutionLevel || 1}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{user.name}</h2>
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">
                {user.title}
              </p>

              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <p className="text-[8px] text-slate-500 uppercase mb-1">Omni UUID</p>
                  <p className="text-[10px] font-mono text-slate-300 break-all leading-tight">
                    {user.uuid}
                  </p>
                </div>
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <p className="text-[8px] text-slate-500 uppercase mb-1">Digital Signature</p>
                  <p className="text-[10px] font-mono text-emerald-500/80 break-all leading-tight">
                    {user.digitalSignature || '0xSIGNED_BY_JUNAIKEY_PROTOCOL'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
              Pass-3+1 Verified
            </span>
          </div>
        </div>

        {/* 2. 中央：能力維度 (Capability Matrix) */}
        <div className="flex-1 p-6 relative flex flex-col">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Capability Matrix
            </h3>
            <ProtocolBadge type="traceable" />
          </div>

          <div className="flex-1 min-h-[240px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="#10b981"
                  fillOpacity={0.1}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 border border-white/10 p-2 rounded text-xs backdrop-blur-md">
                          <span className="text-emerald-400 font-mono font-bold">
                            {payload[0].value}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Badge Strip */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex gap-2">
              {badges.slice(0, 5).map(b => (
                <div
                  key={b.id}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group relative"
                >
                  {b.icon || <Award size={14} />}
                  <div className="absolute bottom-full mb-2 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {b.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 右側：資產維度 (Asset Vault) */}
        <div className="md:w-[220px] p-6 bg-[#080808] border-l border-white/5 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Asset Vault
          </h3>

          {/* ITK Balance */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
              <Coins size={64} />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] text-indigo-400 font-bold uppercase mb-1">
                Impact Tokens (ITK)
              </p>
              <p className="text-2xl font-black text-white tracking-tight">
                {assets.itkBalance.toLocaleString()}
              </p>
              <p className="text-[9px] text-slate-500 mt-1">Available to trade</p>
            </div>
          </div>

          {/* Locked SROI */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
              <Lock size={64} />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] text-emerald-400 font-bold uppercase mb-1">
                Locked SROI Value
              </p>
              <p className="text-2xl font-black text-white tracking-tight">
                ${assets.lockedSroiValue.toLocaleString()}k
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ProtocolBadge type="immutable" />
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint size={12} className="text-slate-600" />
              <span className="text-[9px] text-slate-600 font-mono">Hash: 0x8F...3A2</span>
            </div>
            <div className="h-0.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: 3+1 Status */}
      <div className="h-8 bg-[#030303] border-t border-white/5 flex items-center justify-between px-6">
        <div className="flex gap-4">
          <span className="text-[9px] text-slate-600 font-mono flex items-center gap-1">
            <div className="w-1 h-1 bg-red-500 rounded-full" /> Immutable
          </span>
          <span className="text-[9px] text-slate-600 font-mono flex items-center gap-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full" /> Traceable
          </span>
        </div>
        <div className="text-[9px] text-slate-700 font-black tracking-widest uppercase">
          ESGss JunAiKey Engine v2.0
        </div>
      </div>
    </div>
  );
};

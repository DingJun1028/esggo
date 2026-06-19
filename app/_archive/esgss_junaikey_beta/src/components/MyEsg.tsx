import React from 'react';
import { Language } from '@/types';
import { Shield, Trophy, Target, Sword } from 'lucide-react';
import { OmniEsgCell } from '@/omni/interaction/visuals/OmniEsgCell';
import { ShieldCheck, Zap, Activity, DollarSign, CheckCircle } from './icons';
import { useOmniLegion } from '../store/useOmniLegion';

export const MyEsg: React.FC<{ language?: Language; onNavigate?: (path: string) => void }> = ({
  language,
}) => {
  const isZh = language === 'zh-TW';
  const { legions } = useOmniLegion();
  const activeLegionCount = Array.from(legions.values()).filter(
    l => l.legion_status === 'in_mission'
  ).length;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isZh ? '我的永續資產' : 'My ESG Assets'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh
              ? '追蹤您的 ESG 影響力與數位資產狀態'
              : 'Track your ESG impact and digital asset status'}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            {isZh ? '系統同步中' : 'System Syncing'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OmniEsgCell
          id="carbon-credits"
          label={isZh ? '碳信用額度' : 'Carbon Credits'}
          value={1240}
          unit="tCO2e"
          color="emerald"
          icon={Activity}
          trend={{ value: 12, direction: 'up' }}
        />
        <OmniEsgCell
          id="goodwill-coins"
          label={isZh ? '善向幣' : 'Goodwill Coins'}
          value={85000}
          color="gold"
          icon={DollarSign}
          trend={{ value: 5.4, direction: 'up' }}
        />
        <OmniEsgCell
          id="compliance-status"
          label={isZh ? '合規完整度' : 'Compliance Status'}
          value={94}
          unit="%"
          color="blue"
          icon={ShieldCheck}
          confidence="high"
          verified={true}
        />
        <OmniEsgCell
          id="automation-efficiency"
          label={isZh ? '自動化效率' : 'Automation'}
          value={18}
          color="purple"
          icon={Zap}
        />
        {activeLegionCount > 0 && (
          <OmniEsgCell
            id="active-legions"
            label={isZh ? '活躍軍團' : 'Active Legions'}
            value={activeLegionCount}
            unit={isZh ? '隊' : 'Units'}
            color="rose"
            icon={Sword}
            trend={{ value: 100, direction: 'up' }}
            confidence="high"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-cyan-500/20 rounded-3xl p-8 backdrop-blur-md">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="text-emerald-400" />
            {isZh ? '近期任務與成就' : 'Recent Quests & Achievements'}
          </h3>
          <div className="space-y-4">
            {[
              {
                title: isZh ? '年度排放核算' : 'Annual Emission Audit',
                status: 'IN_PROGRESS',
                progress: 65,
                color: 'blue',
              },
              {
                title: isZh ? '供應鏈永續問卷' : 'Supply Chain Survey',
                status: 'COMPLETED',
                progress: 100,
                color: 'emerald',
              },
              {
                title: isZh ? '再生能源轉型計畫' : 'RE100 Transition',
                status: 'PENDING',
                progress: 12,
                color: 'purple',
              },
            ].map((task, i) => (
              <div
                key={i}
                className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group cursor-pointer hover:bg-white/10"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">{task.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : task.status === 'IN_PROGRESS'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${task.color}-500 to-${task.color}-400 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Zap className="w-24 h-24" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4 relative z-10">
            {isZh ? 'AI 協同建議' : 'AI Synergy Tips'}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10">
            {isZh
              ? '根據您的近期數據，將供應鏈系統與奧秘元鑰同步可提升 20% 的數據準確度。'
              : 'Based on recent data, syncing your supply chain with JunAiKey could boost accuracy by 20%.'}
          </p>
          <button className="bg-white text-indigo-950 font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors text-sm relative z-10 shadow-lg">
            {isZh ? '立即同步' : 'Sync Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Scan as Hub,
  Sparkles as AutoAwesome,
  LayoutGrid as GridView,
  Bell as Notifications,
  CircleDot as RadioButtonChecked,
  ChevronDown as ExpandCircleDown,
  Star,
  Award as WorkspacePremium,
  Gem as Diamond,
  Zap as Bolt,
  Leaf as Eco,
  Layers,
  ShieldCheck as Verified,
  TrendingUp as AutoGraph,
  Infinity as AllInclusive,
  Brain as Psychology,
  BarChart as Leaderboard,
  Globe as Language,
  HelpCircle as Help,
} from 'lucide-react';
import { Badge, Button } from '../ui';

/**
 * Rarity Evolution Guide (v8.4.1)
 * Glassmorphism & Liquid Visuals
 */
export const RarityEvolutionGuide: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState('Apex');

  const tiers = [
    {
      id: 'Basic',
      label: '基礎',
      icon: Eco,
      color: 'text-[#0df2eb]',
      level: '01',
      desc: '初探永續知識與基本ESG概念',
    },
    {
      id: 'Advanced',
      label: '進階',
      icon: Layers,
      color: 'text-[#0df2eb]',
      level: '02',
      desc: '掌握核心框架與產業減碳實務',
    },
    {
      id: 'Elite',
      label: '精英',
      icon: Verified,
      color: 'text-[#0df2eb]',
      level: '03',
      desc: '實踐專案應用與跨領域團隊協作',
    },
    {
      id: 'Master',
      label: '大師',
      icon: AutoGraph,
      color: 'text-[#0df2eb]',
      level: '04',
      desc: '策略轉型引領與永續報告書撰寫',
    },
    {
      id: 'Apex',
      label: '巔峰',
      icon: Diamond,
      color: 'text-white',
      level: '05',
      desc: '系統性變革專家與企業韌性顧問',
      special: 'apex',
    },
    {
      id: 'Emergence',
      label: '湧現',
      icon: AllInclusive,
      color: 'text-white',
      level: '06',
      desc: '永續生態開創者影響力投資領袖',
      special: 'emergence',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#102222] text-white p-6 lg:p-10 font-sans transition-all animate-in fade-in duration-700">
      {/* Page Heading Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0df2eb]/10 border border-[#0df2eb]/20 text-[#0df2eb] text-[10px] font-black tracking-widest uppercase">
            <AutoAwesome size={14} />
            Rarity Evolution System
          </div>
          <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            進化指南：Impact Nexus <br />
            <span className="text-[#0df2eb] relative">
              卡牌階級演化
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#0df2eb]/30 blur-sm" />
            </span>
          </h2>
          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl font-medium">
            Rarity Evolution Guide -
            透過學習深化，為您的永續知識旅程賦予具象化的視覺勳章。從基礎感知到系統性生態變革。
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            className="flex items-center gap-3 px-8 py-6 rounded-2xl bg-[#0df2eb] text-[#102222] font-black hover:brightness-110 transition-all shadow-[0_0_25px_rgba(13,242,235,0.4)]"
            onClick={onBack}
          >
            <GridView size={20} />
            返回儀表板
          </Button>
        </div>
      </div>

      {/* Progress Timeline Navigator */}
      <div className="mb-24 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
        <div className="flex items-center justify-between px-2 sm:px-12">
          {tiers.map(t => (
            <div
              key={t.id}
              className={`flex flex-col items-center gap-4 bg-[#102222] px-4 cursor-pointer transition-all ${selectedLevel === t.id ? 'scale-110' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
              onClick={() => setSelectedLevel(t.id)}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 ${selectedLevel === t.id ? 'border-[#0df2eb] bg-[#0df2eb]/20' : 'border-white/20 bg-white/5'} flex items-center justify-center transition-all shadow-inner`}
              >
                <t.icon size={20} />
              </div>
              <span
                className={`text-xs font-black tracking-widest ${selectedLevel === t.id ? 'text-[#0df2eb]' : 'text-gray-500'}`}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 mb-24">
        {tiers.map(t => (
          <div key={t.id} className="group cursor-pointer" onClick={() => setSelectedLevel(t.id)}>
            <div
              className={`aspect-[3/4] rounded-[32px] p-1 mb-6 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 border border-white/10 ${
                t.special === 'apex'
                  ? 'ring-2 ring-[#0df2eb]/40 shadow-[0_0_40px_rgba(13,242,235,0.2)]'
                  : t.special === 'emergence'
                    ? 'ring-2 ring-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.2)]'
                    : 'hover:bg-white/5'
              }`}
            >
              {/* Background Glows */}
              {t.special === 'apex' ? (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0df2eb]/30 via-white/5 to-transparent opacity-80" />
              ) : t.special === 'emergence' ? (
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-pink-500/20 to-[#0df2eb]/20 opacity-80 animate-pulse" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0df2eb]/10 to-transparent opacity-50" />
              )}

              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20 relative z-10 shadow-2xl transition-transform group-hover:rotate-12">
                <t.icon size={40} className={t.color} />
              </div>

              <div className="mt-8 text-center relative z-10 px-6">
                <p className="text-[10px] tracking-[0.3em] text-[#0df2eb] font-black uppercase mb-2">
                  Level {t.level}
                </p>
                <p className="text-xl font-black tracking-tight">{t.label}</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 text-center font-bold px-4 leading-relaxed tracking-wider">
              {t.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/[0.03] rounded-[48px] p-12 lg:p-20 border border-white/10 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0df2eb]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h4 className="text-[#0df2eb] font-black tracking-[0.4em] text-xs uppercase underline underline-offset-8 decoration-[#0df2eb]/30">
              Current Milestone Detail
            </h4>
            <h3 className="text-4xl lg:text-6xl font-black tracking-tighter">
              深入探索 「{tiers.find(t => t.id === selectedLevel)?.label}」 階級
            </h3>
          </div>

          <p className="text-gray-400 text-xl leading-relaxed font-medium">
            「{tiers.find(t => t.id === selectedLevel)?.label}
            」階級象徵著在永續領域已具備深厚的跨維度洞察。視覺上，我們採用了「液態玻璃」與「結晶質感」的融合，象徵著知識從流動狀態凝結成堅不可摧的專業權威。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="flex items-start gap-6 p-6 rounded-3xl bg-white/[0.04] border border-white/5 group hover:bg-white/[0.08] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#0df2eb]/20 flex items-center justify-center text-[#0df2eb] shrink-0 group-hover:scale-110 transition-transform">
                <Psychology size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black tracking-tight">系統性思考能力</p>
                <p className="text-sm text-gray-500 font-medium">
                  能夠識別企業內部與外部環境的複雜連結，並制定長期應變策略。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-3xl bg-white/[0.04] border border-white/5 group hover:bg-white/[0.08] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#0df2eb]/20 flex items-center justify-center text-[#0df2eb] shrink-0 group-hover:scale-110 transition-transform">
                <Leaderboard size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black tracking-tight">數據驅動決策</p>
                <p className="text-sm text-gray-500 font-medium">
                  熟練運用 ESG 指標進行預測性建模，引領組織邁向淨零碳排目標。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-[#0df2eb]/10 blur-[120px] rounded-full scale-150 animate-pulse" />
          <div className="relative w-full aspect-square max-w-[500px] bg-white/[0.02] backdrop-blur-3xl rounded-[60px] flex items-center justify-center p-12 border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden group">
            <div className="absolute top-6 left-8 text-[10px] text-white/20 font-mono tracking-widest uppercase">
              Spec: {selectedLevel.toUpperCase()}-304 / Crystal_v8.4
            </div>
            <div className="absolute bottom-6 right-8 text-[10px] text-white/20 font-mono tracking-widest uppercase">
              Protocol: JunAiKey_Resonance_Link
            </div>

            <div
              className={`w-full aspect-square rounded-[40px] flex items-center justify-center relative shadow-2xl transition-all duration-700 group-hover:scale-105 ${
                selectedLevel === 'Apex'
                  ? 'bg-gradient-to-br from-[#0df2eb] via-white to-amber-400 shadow-[0_0_80px_rgba(13,242,235,0.4)]'
                  : selectedLevel === 'Emergence'
                    ? 'bg-gradient-to-tr from-[#0df2eb] via-purple-500 to-pink-500 shadow-[0_0_80px_rgba(168,85,247,0.4)] animate-pulse'
                    : 'bg-gradient-to-br from-[#0df2eb]/40 to-white/10 border border-white/20'
              }`}
            >
              {React.createElement(tiers.find(t => t.id === selectedLevel)?.icon || Diamond, {
                size: 160,
                className:
                  selectedLevel === 'Apex' || selectedLevel === 'Emergence'
                    ? 'text-[#102222] drop-shadow-2xl'
                    : 'text-[#0df2eb] drop-shadow-2xl',
              })}
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>
      </div>

      <footer className="mt-32 py-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-bold tracking-widest">
        <div className="flex items-center gap-8 text-[11px] uppercase">
          <span>© 2026 InfoOne Nexus</span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          <span>Privacy_Shield</span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          <span>Terms_Of_Service</span>
        </div>

        <div className="flex items-center gap-10">
          <p className="text-[10px] font-mono">
            Visual Parameters: Liquid_Glass_v8.4.1 // RayTracing_Optimal
          </p>
          <div className="flex gap-6">
            <Language size={18} className="hover:text-white cursor-pointer transition-colors" />
            <Help size={18} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

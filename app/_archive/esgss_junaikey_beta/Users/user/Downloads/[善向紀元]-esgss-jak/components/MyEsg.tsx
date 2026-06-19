
import React, { useState, useMemo } from 'react';
import {
    Zap, ShieldCheck, Hammer, Heart, Star, Trophy,
    Bell, Gem, Leaf, Box, Bike, Utensils, Share2,
    FileText, CheckCircle2, Camera, ArrowRight, Activity,
    Target, Crown, Loader2, ChevronRight, Hash,
    Newspaper, MessageSquare, History, TrendingUp,
    Layout, Database, Globe, Filter, Sparkles, Flame,
    ArrowUpRight, AlertCircle, RefreshCw, PenTool, Eye,
    Users, MapPin, Award, Lightbulb
} from 'lucide-react';
import { Language, View, LifeEsgQuest } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useToast } from '../contexts/ToastContext';
import { useBreakpoint } from '../src/utils/responsive';
import { ResponsiveGrid, ResponsiveCard } from './ui/ResponsiveContainer';
import { MobileBottomNav, ResponsivePageContainer, MobileCard } from './ui/MobileNavigation';
import { TouchCard, TouchButton, TouchScrollable } from './ui/TouchOptimized';

const InfoBlock = ({ title, icon: Icon, color, children, tag, className = "" }: any) => (
    <div className={`flex flex-col h-full glass-bento bg-slate-950/40 border-white/5 rounded-xl p-4 shadow-2xl group hover:border-white/10 transition-all overflow-hidden relative ${className}`}>
        <div className={`absolute -right-4 -top-4 p-8 opacity-[0.02] group-hover:scale-110 transition-transform ${color}`}><Icon className="w-24 h-24" /></div>
        <div className="flex justify-between items-center mb-3 shrink-0 relative z-10">
            <h4 className="zh-main text-[10px] text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon className={`w-3 h-3 ${color}`} /> {title}
            </h4>
            {tag && <div className="uni-mini !bg-slate-900 !text-gray-600 border-none !text-[7px] uppercase">{tag}</div>}
        </div>
        <div className="flex-1 min-h-0 relative z-10 flex flex-col">
            {children}
        </div>
    </div>
);

export const MyEsg: React.FC<{ language: Language; onNavigate: (view: View | string) => void }> = ({ language, onNavigate }) => {
  const { userName, xp, level, awardXp, updateGoodwillBalance, esgScores, totalScore, goodwillBalance } = useCompany();
  const { traits, updateTraits } = useUniversalAgent();
  const { addToast } = useToast();
  const { isMobile, isTablet } = useBreakpoint();
  const isZh = language === 'zh-TW';

  const [lifeQuests, setLifeQuests] = useState<LifeEsgQuest[]>([
    { id: 'l1', category: 'NetZero', title: isZh ? '低碳交通實踐' : 'Eco Transport', enTitle: 'Eco Transport', impactDesc: isZh ? '減少 2.5kg CO2e' : 'Saved 2.5kg CO2e', xpReward: 120, gwcReward: 50, traitBonus: { trait: 'pragmatism', value: 2 }, status: 'ready', icon: Bike },
    { id: 'l2', category: 'NetZero', title: isZh ? '自備餐具減塑' : 'Zero Waste', enTitle: 'Zero Waste', impactDesc: isZh ? '減少 3 件塑料' : 'Reduced 3 items', xpReward: 80, gwcReward: 30, traitBonus: { trait: 'stability', value: 1 }, status: 'ready', icon: Utensils },
    { id: 'l3', category: 'Altruism', title: isZh ? '永續知識傳播' : 'Insight Sharing', enTitle: 'Insight Sharing', impactDesc: isZh ? '擴散王道思維' : 'Spread Wangdao', xpReward: 200, gwcReward: 100, traitBonus: { trait: 'altruism', value: 3 }, status: 'ready', icon: Share2 },
    { id: 'l5', category: 'Innovation', title: isZh ? '再生商模發想' : 'Regen Ideation', enTitle: 'Regen Ideation', impactDesc: isZh ? '提交 1 項創新' : 'Submit 1 Idea', xpReward: 300, gwcReward: 150, traitBonus: { trait: 'innovation', value: 5 }, status: 'ready', icon: Lightbulb },
    { id: 'l4', category: 'Governance', title: isZh ? '數位無紙化' : 'Paperless', enTitle: 'Paperless', impactDesc: isZh ? '減少 50 張紙' : 'Saved 50 sheets', xpReward: 150, gwcReward: 60, traitBonus: { trait: 'stability', value: 2 }, status: 'completed', icon: FileText, verifiedHash: '0x8B...F32' },
  ]);

  const [isVerifyingId, setIsVerifyingId] = useState<string | null>(null);

  const activeQuests = useMemo(() => lifeQuests.filter(q => q.status === 'ready'), [lifeQuests]);
  const archivedQuests = useMemo(() => lifeQuests.filter(q => q.status === 'completed'), [lifeQuests]);

  const handleVerifyAction = async (quest: LifeEsgQuest) => {
      setIsVerifyingId(quest.id);
      addToast('info', isZh ? `神經感官驗證中...` : `Neural Witnessing...`, 'Kernel');
      await new Promise(r => setTimeout(r, 1200));
      const newHash = '0x' + Math.random().toString(16).substr(2, 6).toUpperCase();
      setLifeQuests(prev => prev.map(q => q.id === quest.id ? { ...q, status: 'completed', verifiedHash: newHash } : q));
      awardXp(quest.xpReward); updateGoodwillBalance(quest.gwcReward);
      updateTraits({ [quest.traitBonus.trait]: Math.min(100, (traits as any)[quest.traitBonus.trait] + quest.traitBonus.value) });
      setIsVerifyingId(null);
      addToast('reward', isZh ? `動作已刻印於區塊鏈` : `Action Engraved to Chain`, 'Witness');
  };

  const getQuestTheme = (cat: string) => {
      switch(cat) {
          case 'NetZero': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-500' };
          case 'Altruism': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'text-rose-500' };
          case 'Innovation': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-500' };
          case 'Governance': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-500' };
          default: return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: 'text-gray-500' };
      }
  };

  return (
    <ResponsivePageContainer className="h-full flex flex-col min-h-0 overflow-hidden font-sans">
      <UniversalPageHeader
        icon={Target}
        title={{ zh: '個人北極星：戰略矩陣', en: 'Strategic Matrix' }}
        description={{ zh: '超立方體演進追蹤：靈魂、戰略、實踐與全球情報', en: 'Hypercube Evolution: Souls, Strategy & Global Intel.' }}
        language={language}
        tag={{ zh: '內核 v16.1', en: 'OMNI_SYNC_v16.1' }}
      />

      {/* 響應式佈局：移動端堆疊，桌面端網格 */}
      {isMobile ? (
        <TouchScrollable className="flex-1" direction="vertical">
          <div className="space-y-4">
            {/* 移動端：用戶資料卡片 */}
            <MobileCard>
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${xp}`}
                  className="w-16 h-16 rounded-xl bg-slate-900 border border-white/10"
                  alt="Avatar"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white truncate uppercase tracking-tight">{userName}</h3>
                  <div className="px-2 py-1 bg-celestial-gold text-black rounded-md text-xs font-bold uppercase tracking-widest inline-block">
                    LV.{level} ARCHITECT
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="text-xs text-gray-500 uppercase font-black">Impact_XP</div>
                      <div className="text-base font-mono font-bold text-emerald-400">{xp.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="text-xs text-gray-500 uppercase font-black">GWC_Vault</div>
                      <div className="text-base font-mono font-bold text-celestial-gold">{goodwillBalance.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </MobileCard>

            {/* 移動端：ESG分數卡片 */}
            <MobileCard>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white uppercase tracking-tight">ESG 實時監控</h4>
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Target className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Env", v: esgScores.environmental, c: "emerald" },
                    { l: "Soc", v: esgScores.social, c: "blue" },
                    { l: "Gov", v: esgScores.governance, c: "purple" }
                  ].map((s, i) => (
                    <div key={i} className="bg-black/60 rounded-xl border border-white/5 p-3 flex flex-col items-center justify-center">
                      <span className="text-xs font-black text-gray-700 uppercase mb-1">{s.l}</span>
                      <span className={`text-xl font-mono font-black text-${s.c}-400`}>{s.v}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </MobileCard>

            {/* 移動端：靈魂向量 */}
            <MobileCard>
              <h4 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-celestial-purple" /> 靈魂向量
              </h4>
              <div className="space-y-3">
                {['altruism', 'innovation', 'pragmatism', 'stability'].map(t => (
                  <div key={t} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{t}</span>
                      <span className="text-sm font-mono font-black text-white">{(traits as any)[t]}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full transition-all duration-1000 shadow-[0_0_8px_currentColor] ${
                          t === 'altruism' ? 'bg-emerald-500' :
                          t === 'innovation' ? 'bg-purple-500' :
                          t === 'pragmatism' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${(traits as any)[t]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <TouchButton
                onClick={() => onNavigate(View.VAULT)}
                className="w-full mt-4"
                variant="secondary"
              >
                <Gem className="w-4 h-4" />
                <span>同步靈魂容器</span>
              </TouchButton>
            </MobileCard>

            {/* 移動端：生活鍛造任務 */}
            <MobileCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white uppercase tracking-tight">生活鍛造</h4>
                  <span className="px-2 py-1 bg-black/40 text-emerald-500 rounded text-xs font-bold uppercase">
                    {activeQuests.length} 待執行
                  </span>
                </div>

                <TouchScrollable direction="vertical" className="max-h-80">
                  <div className="space-y-3">
                    {activeQuests.map((quest) => {
                      const theme = getQuestTheme(quest.category);
                      return (
                        <TouchCard
                          key={quest.id}
                          onClick={() => handleVerifyAction(quest)}
                          className={`border-l-4 ${theme.border}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${theme.icon}`}>
                              <quest.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-1.5 py-0.5 rounded text-xs font-black uppercase border ${theme.color} ${theme.bg} ${theme.border}`}>
                                  {quest.category}
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-white mb-1">{quest.title}</h5>
                              <p className="text-xs text-gray-400 mb-2">{quest.impactDesc}</p>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-emerald-400 font-bold">+{quest.xpReward} XP</span>
                                <span className="text-celestial-gold font-bold">+{quest.gwcReward} GWC</span>
                              </div>
                            </div>
                            <TouchButton size="sm" variant="primary">
                              {isVerifyingId === quest.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            </TouchButton>
                          </div>
                        </TouchCard>
                      );
                    })}
                  </div>
                </TouchScrollable>
              </div>
            </MobileCard>
          </div>
        </TouchScrollable>
      ) : (
        /* 桌面端原有網格佈局 */
        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
          {/* 1. 靈魂維度 (左翼 3/12) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-y-auto no-scrollbar">
                <div className="glass-panel p-4 bg-[#020617] border-white/10 rounded-xl flex flex-col items-center text-center shrink-0 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.04)_0%,transparent_70%)] pointer-events-none" />
                    <div className="relative w-20 h-20 mb-4 group cursor-pointer z-10">
                        <div className="absolute inset-0 bg-celestial-gold blur-2xl opacity-10 group-hover:opacity-30 animate-pulse transition-opacity" />
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${xp}`} className="w-full h-full rounded-xl bg-slate-900 border border-white/10 relative z-10 transition-transform group-hover:scale-105" alt="Avatar" />
                    </div>
                    <h3 className="text-xl font-black text-white truncate w-full z-10 tracking-tighter uppercase">{userName}</h3>
                    <div className="px-3 py-0.5 bg-celestial-gold text-black rounded-md mt-2 z-10 shadow-xl scale-95 group-hover:scale-100 transition-transform">
                         <span className="text-[8px] font-black uppercase tracking-widest">LV.{level} ARCHITECT</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 w-full z-10">
                         <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                            <div className="text-[7px] text-gray-500 uppercase font-black mb-0.5">Impact_XP</div>
                            <div className="text-sm font-mono font-bold text-emerald-400">{xp.toLocaleString()}</div>
                         </div>
                         <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                            <div className="text-[7px] text-gray-500 uppercase font-black mb-0.5">GWC_Vault</div>
                            <div className="text-sm font-mono font-bold text-celestial-gold">{goodwillBalance.toLocaleString()}</div>
                         </div>
                    </div>
                </div>
                
                <div className="flex-1 glass-bento bg-black/60 border-white/5 p-4 rounded-xl flex flex-col min-h-0 overflow-hidden shadow-2xl">
                    <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 shrink-0">
                        <Database className="w-3.5 h-3.5 text-celestial-purple" /> SOUL_VECTORS
                    </h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                        {['altruism', 'innovation', 'pragmatism', 'stability'].map(t => (
                            <div key={t} className="space-y-1.5 group">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">{t}</span>
                                    <span className="text-[9px] font-mono font-black text-white">{(traits as any)[t]}%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                    <div className={`h-full transition-all duration-1000 shadow-[0_0_8px_currentColor] ${t === 'altruism' ? 'bg-emerald-500' : t === 'innovation' ? 'bg-purple-500' : t === 'pragmatism' ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${(traits as any)[t]}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => onNavigate(View.VAULT)} className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 font-black rounded-lg text-[9px] uppercase tracking-[0.2em] border border-white/5 flex items-center justify-center gap-2 transition-all shrink-0">
                        <Gem className="w-3.5 h-3.5" /> SYNC_VAULT
                    </button>
                </div>
            </div>

            {/* 2. 戰略指揮與情報 (中央 4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0">
                <div className="glass-bento bg-slate-950 border-emerald-500/10 p-5 rounded-xl shadow-2xl relative overflow-hidden flex flex-col shrink-0 h-[180px]">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none"><Activity className="w-32 h-32" /></div>
                    <div className="flex justify-between items-start mb-4 shrink-0 relative z-10">
                        <div>
                            <h4 className="zh-main text-base text-white tracking-tighter uppercase">戰略實時監控</h4>
                            <span className="en-sub !mt-0 text-emerald-500 font-black !text-[7px]">KPI_LIVE_SYNC</span>
                        </div>
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <Target className="w-4 h-4 text-emerald-400" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 relative z-10 flex-1">
                        {[
                            { l: "Env", v: esgScores.environmental, c: "emerald" },
                            { l: "Soc", v: esgScores.social, c: "blue" },
                            { l: "Gov", v: esgScores.governance, c: "purple" }
                        ].map((s, i) => (
                            <div key={i} className="bg-black/60 rounded-xl border border-white/5 p-3 flex flex-col items-center justify-center group hover:border-white/10 transition-all">
                                <span className="text-[7px] font-black text-gray-700 uppercase mb-0.5">{s.l}</span>
                                <span className={`text-lg font-mono font-black text-${s.c}-400`}>{s.v}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <InfoBlock title="全球情報對標" icon={Globe} color="text-blue-400" tag="AMICE_INTEL">
                        <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-400/30 group cursor-pointer transition-all shadow-lg">
                                <div className="text-[7px] text-gray-700 font-black mb-1 uppercase flex justify-between">
                                    <span>Policy_Alert</span>
                                    <span className="text-blue-400">2h</span>
                                </div>
                                <div className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed italic group-hover:text-white transition-colors">歐盟 CBAM 規則更新，對科技供應鏈產生潛在關稅衝擊...</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-400/30 group cursor-pointer transition-all">
                                <div className="text-[7px] text-gray-700 font-black mb-1 uppercase flex justify-between">
                                    <span>Sector_Insight</span>
                                    <span className="text-emerald-400">5h</span>
                                </div>
                                <div className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed italic group-hover:text-white transition-colors">台積電宣布最新水資源循環技術，對標 L11 級節水效能...</div>
                            </div>
                        </div>
                    </InfoBlock>

                    <InfoBlock title="領袖意志" icon={MessageSquare} color="text-celestial-gold" tag="THOTH_PULSE">
                        <div className="p-4 bg-celestial-gold/[0.03] rounded-xl border border-celestial-gold/10 shadow-xl relative overflow-hidden">
                            <div className="text-[11px] text-gray-200 italic leading-relaxed font-light">「ESG 的終點不是減碳，而是具備文明價值的『再生』。」</div>
                            <div className="mt-2 text-right">
                                <span className="text-[7px] text-gray-600 font-black uppercase tracking-[0.2em]">— THOTH YANG</span>
                            </div>
                        </div>
                    </InfoBlock>
                </div>
            </div>

            {/* 3. 生活鍛造與實踐 (右翼 5/12) - 最大化閱讀空間 & 項目區分 */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-3 min-h-0">
                <div className="flex-1 glass-bento bg-slate-900/40 border-white/10 p-5 rounded-xl shadow-2xl flex flex-col min-h-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.01] pointer-events-none"><Hammer className="w-64 h-64" /></div>
                    
                    <div className="flex justify-between items-center mb-5 shrink-0 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-celestial-gold/20 rounded-lg text-celestial-gold shadow-lg">
                                <Hammer className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="zh-main text-lg text-white uppercase tracking-tight">生活鍛造 (Active_Forge)</h4>
                                <span className="text-[8px] font-mono text-gray-600">ACTION_WITNESSING_PROTOCOL_ACTIVE</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <Filter className="w-3.5 h-3.5 text-gray-700 cursor-pointer hover:text-white transition-colors" />
                             <span className="uni-mini bg-black/40 text-emerald-500 border-none !text-[7px]">{activeQuests.length} READY</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1 relative z-10">
                        {activeQuests.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
                                <Sparkles className="w-12 h-12 mb-2" />
                                <p className="zh-main text-base uppercase tracking-widest">Forge In Standby</p>
                            </div>
                        ) : activeQuests.map((quest) => {
                            const theme = getQuestTheme(quest.category);
                            return (
                                <div key={quest.id} className={`p-4 bg-black/60 border border-white/5 rounded-xl flex items-center justify-between group transition-all shadow-xl hover:-translate-y-0.5 hover:border-white/20 border-l-4 ${theme.border}`}>
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className={`p-3 rounded-lg bg-white/5 border border-white/10 transition-all shadow-lg shrink-0 group-hover:scale-105 ${theme.icon}`}>
                                            <quest.icon className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase border ${theme.color} ${theme.bg} ${theme.border}`}>{quest.category}</span>
                                                <div className="zh-main text-sm text-white group-hover:text-white transition-colors truncate">{quest.title}</div>
                                            </div>
                                            <p className="text-[11px] text-gray-400 font-light leading-snug truncate">{quest.impactDesc}</p>
                                            <div className="flex items-center gap-2 mt-1 text-[8px] font-mono">
                                                <span className="text-emerald-400 font-black tracking-widest">+{quest.xpReward} XP</span>
                                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-celestial-gold font-black">+{quest.gwcReward} GWC</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleVerifyAction(quest)} 
                                        disabled={isVerifyingId === quest.id} 
                                        className="ml-4 px-6 py-2 bg-emerald-500 text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] active:scale-95 disabled:opacity-30 shrink-0 flex items-center justify-center gap-2"
                                    >
                                        {isVerifyingId === quest.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Camera className="w-3 h-3"/>}
                                        <span className="hidden sm:inline">{isZh ? '稽核' : 'AUDIT'}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* 歷史見證快照 */}
                    <div className="mt-4 pt-3 border-t border-white/5 shrink-0 relative z-10">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <h5 className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><History className="w-3 h-3"/> Legacy_Shards</h5>
                            <button onClick={() => onNavigate(View.USER_JOURNAL)} className="text-[7px] text-gray-700 hover:text-white transition-colors flex items-center gap-1 uppercase font-black">Full_Archive <ChevronRight className="w-2 h-2"/></button>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {archivedQuests.map(q => (
                                <div key={q.id} className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-lg flex items-center gap-2 shrink-0 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all cursor-help">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-tighter whitespace-nowrap">{q.title}</span>
                                </div>
                            ))}
                            {archivedQuests.length === 0 && <span className="text-[8px] text-gray-800 uppercase italic">No history shards detected.</span>}
                        </div>
                    </div>
                </div>
            </div>

        </div>
      )}

      {/* 移動端底部導航 */}
      {isMobile && (
        <MobileBottomNav
          currentView={View.MY_ESG}
          onNavigate={onNavigate}
          language={language}
          userName={userName}
          userLevel={level}
        />
      )}
    </ResponsivePageContainer>
  );
};

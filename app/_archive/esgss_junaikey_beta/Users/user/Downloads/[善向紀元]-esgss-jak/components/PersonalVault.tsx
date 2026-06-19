import React, { useMemo } from 'react';
import { Language, DigitalSoulAsset, EsgCard } from '../types';
import { 
    Wallet, Gem, Star, Zap, Shield, Crown, 
    ArrowUpRight, History, Package, Sparkles,
    UserCircle, Coins, Hexagon, Trophy, Activity,
    TrendingUp, Award, Layers, Fingerprint, Plus
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { getEsgCards } from '../constants';

export const PersonalVault: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { 
    userName, level, xp, activeTitle, goodwillBalance, 
    vocation, badges, collectedCards 
  } = useCompany();
  
  const { activeSoulAsset, forgedSouls, traits } = useUniversalAgent();
  
  const cards = useMemo(() => getEsgCards(language), [language]);
  const myDeck = useMemo(() => cards.filter(c => collectedCards.includes(c.id)), [cards, collectedCards]);

  const stats = [
      { label: isZh ? '總影響力' : 'Total Impact', value: xp.toLocaleString(), icon: Activity, color: 'text-emerald-400' },
      { label: isZh ? '善向餘額' : 'Goodwill Balance', value: goodwillBalance.toLocaleString(), icon: Coins, color: 'text-celestial-gold' },
      { label: isZh ? '聖物收藏' : 'Relic Collection', value: myDeck.length, icon: Package, color: 'text-blue-400' },
      { label: isZh ? '靈魂碎片' : 'Soul Shards', value: forgedSouls.length, icon: Gem, color: 'text-purple-400' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Crown}
            title={{ zh: '個人寶庫儀表板', en: 'Personal Vault Console' }}
            description={{ zh: '超立方體核心資產全景：管理您的靈魂、聖物與權能進度', en: 'Omni-Asset Panorama: Manage Souls, Relics & Authority' }}
            language={language}
            tag={{ zh: '資產核心 v15.9', en: 'ASSET_CORE_V15.9' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-900/60 border-celestial-gold/30 rounded-[3rem] relative overflow-hidden shrink-0 shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><UserCircle className="w-48 h-48 text-celestial-gold" /></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-celestial-gold to-amber-600 p-1 shadow-2xl">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-full h-full rounded-full bg-slate-900 object-cover" alt="User" />
                            </div>
                            <div>
                                <h3 className="zh-main text-2xl text-white">{userName}</h3>
                                <div className="text-[10px] font-black text-celestial-gold uppercase tracking-[0.2em] mt-1">{activeTitle?.text || 'Standard User'}</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div className="flex justify-between text-[10px] font-black mb-2 uppercase text-gray-500">
                                    <span>Vocation_Evolution</span>
                                    <span>Lv.{vocation.level}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-gradient-to-r from-celestial-gold to-amber-500 animate-pulse" style={{ width: `${(vocation.exp / vocation.nextLevelExp) * 100}%` }} />
                                </div>
                                <span className="text-[8px] text-gray-600 font-mono">RESONANCE_INDEX: {(vocation.exp/vocation.nextLevelExp).toFixed(2)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                                    <span className="en-sub block mb-1">Altruism</span>
                                    <span className="zh-main text-xl text-emerald-400">{traits.altruism}%</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                                    <span className="en-sub block mb-1">Innovation</span>
                                    <span className="zh-main text-xl text-purple-400">{traits.innovation}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-900/40 border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-xl">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Trophy className="w-4 h-4" /> RECENT_ACHIEVEMENTS</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                        {badges.filter(b => b.unlockedAt).slice(0, 5).map(badge => (
                            <div key={badge.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:border-celestial-gold/30 transition-all">
                                <div className="p-2 bg-celestial-gold/10 text-celestial-gold rounded-lg group-hover:scale-110 transition-transform">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="zh-main text-sm text-white">{badge.name}</div>
                                    <div className="text-[9px] text-gray-500 uppercase mt-0.5">{new Date(badge.unlockedAt!).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                    {stats.map(s => (
                        <div key={s.label} className="glass-bento p-5 bg-slate-950 border-white/5 rounded-3xl hover:border-white/10 transition-all shadow-lg">
                            <div className="flex justify-between items-start mb-2">
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                                <ArrowUpRight className="w-3 h-3 text-gray-700" />
                            </div>
                            <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
                            <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 glass-bento p-8 bg-slate-950/40 border-white/5 rounded-[3rem] shadow-2xl flex flex-col min-h-0 overflow-hidden">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <Layers className="w-6 h-6 text-celestial-purple" />
                            <h3 className="zh-main text-xl text-white uppercase tracking-widest">{isZh ? '我的數位遺產' : 'Digital Assets Inventory'}</h3>
                        </div>
                        <div className="flex gap-2">
                             <div className="uni-mini bg-celestial-gold text-black">VAULT_SECURE</div>
                             <div className="uni-mini bg-emerald-500 text-black">LINK_ACTIVE</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6 pr-2">
                        <div className="p-6 rounded-[2.5rem] border-2 border-celestial-gold/50 bg-celestial-gold/5 relative group overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Fingerprint className="w-24 h-24" /></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-celestial-gold text-black rounded-lg shadow-lg"><Zap className="w-4 h-4 fill-current" /></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-celestial-gold">Active_Soul_Resonance</span>
                                </div>
                                <h4 className="zh-main text-2xl text-white mb-2">{activeSoulAsset?.name || 'Awaiting Sync'}</h4>
                                <div className="flex gap-4">
                                    <div className="text-[10px] text-emerald-400 font-mono">ALIGNMENT: 99%</div>
                                    <div className="text-[10px] text-blue-400 font-mono">RANK: {activeSoulAsset?.rarity || 'NONE'}</div>
                                </div>
                                <button className="mt-8 px-6 py-2 bg-celestial-gold text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">Optimize_Persona</button>
                            </div>
                        </div>

                        <div className="p-6 rounded-[2.5rem] border border-white/10 bg-slate-900/60 relative group">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Gem className="w-4 h-4" /></div>
                                <span className="text-xs font-black uppercase tracking-widest text-blue-400">Featured_Relic</span>
                            </div>
                            {myDeck[0] ? (
                                <div className="flex gap-5">
                                    <div className="w-24 h-32 bg-black/60 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                                        <Shield className="w-10 h-10 text-blue-500 opacity-50" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="zh-main text-lg text-white mb-1 truncate">{myDeck[0].title}</h4>
                                        <p className="text-[10px] text-gray-500 line-clamp-3 leading-relaxed mb-4">{myDeck[0].description}</p>
                                        <div className="px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30 text-[8px] font-black text-blue-400 uppercase w-fit">LV.{myDeck[0].rarity}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-32 flex flex-col items-center justify-center text-gray-700 opacity-30 italic">No artifacts identified.</div>
                            )}
                        </div>

                        <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {myDeck.slice(1, 7).map(card => (
                                <div key={card.id} className="aspect-[3/4] bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center group hover:bg-white/10 transition-all cursor-crosshair">
                                    <div className={`text-[8px] font-black uppercase mb-2 ${card.rarity === 'Legendary' ? 'text-celestial-gold' : 'text-gray-500'}`}>{card.attribute.substring(0,3)}</div>
                                    <Shield className={`w-6 h-6 ${card.rarity === 'Legendary' ? 'text-celestial-gold' : 'text-gray-700'}`} />
                                </div>
                            ))}
                            <button className="aspect-[3/4] bg-white/5 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:text-white hover:border-white/20 transition-all group">
                                <Plus className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">ALL_RELICS</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
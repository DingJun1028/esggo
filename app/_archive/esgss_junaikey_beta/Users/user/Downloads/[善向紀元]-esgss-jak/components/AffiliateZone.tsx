import React, { useState } from 'react';
import { Language } from '../types';
import { 
    Share2, Users, Coins, TrendingUp, ArrowRight, Copy, CheckCircle2, 
    Zap, Star, Award, ShieldCheck, Megaphone, Target, BarChart3,
    Heart, MessageSquare, Loader2, Link as LinkIcon, Trophy, FileText
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';

export const AffiliateZone: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { userName, level, goodwillBalance } = useCompany();
  
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = `JAK-${userName?.toUpperCase()}-${level}-2025`;
  const referralLink = `https://esgss.jak.ai/join?ref=${referralCode}`;

  const handleApply = () => {
    setIsApplying(true);
    addToast('info', isZh ? '正在分析帳號權能與影響力...' : 'Analyzing account authority & impact...', 'Affiliate Nexus');
    
    setTimeout(() => {
        setIsAffiliate(true);
        setIsApplying(false);
        addToast('reward', isZh ? '申請通過！歡迎加入聯盟生態系' : 'Application Approved! Welcome to Nexus', 'Success');
    }, 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('success', isZh ? '推薦連結已複製' : 'Referral Link Copied', 'Clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-20 lg:pb-0">
        <UniversalPageHeader 
            icon={Share2}
            title={{ zh: '聯盟夥伴中樞', en: 'Affiliate Nexus Hub' }}
            description={{ zh: '擴散永續影響力：推薦、引薦、價值共創與 GWC 分潤', en: 'Spreading Impact: Referrals, Advocacy & GWC Sharing' }}
            language={language}
            tag={{ zh: '推廣核心 v16.1', en: 'AFFILIATE_V16.1' }}
        />

        {!isAffiliate ? (
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full glass-bento p-10 border-white/10 bg-slate-900/60 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><Megaphone className="w-40 h-40" /></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="p-5 rounded-3xl bg-celestial-gold/20 text-celestial-gold border border-celestial-gold/30 mb-8 animate-float-gentle shadow-2xl">
                            <Star className="w-12 h-12 fill-current" />
                        </div>
                        <h3 className="zh-main text-3xl text-white mb-4">成為 ESGss 聯盟夥伴</h3>
                        <p className="text-gray-400 mb-10 leading-relaxed max-w-md">
                            透過您的影響力擴散「王道利他」精神。推薦企業加入平台，您將獲得持續性的 GWC 回饋與獨家聖物獎勵。
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10">
                            {[
                                { icon: Coins, label: isZh ? '15% 分潤' : '15% Share', color: 'text-amber-400' },
                                { icon: Trophy, label: isZh ? '專屬勳章' : 'Unique Medal', color: 'text-emerald-400' },
                                { icon: Zap, label: isZh ? '優先權能' : 'Elite Auth', color: 'text-purple-400' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                                    <span className="text-[11px] font-black text-white uppercase">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleApply}
                            disabled={isApplying}
                            className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-celestial-gold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            {isZh ? '立即申請成為聯盟夥伴' : 'APPLY FOR NEXUS STATUS'}
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-y-auto lg:overflow-hidden no-scrollbar">
                
                {/* 推薦控制台 (8/12) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0">
                    <div className="glass-bento p-8 bg-slate-900/60 border-emerald-500/20 rounded-[3rem] relative overflow-hidden shadow-2xl shrink-0">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><LinkIcon className="w-32 h-32" /></div>
                        <div className="relative z-10">
                            <h4 className="en-sub !mt-0 text-emerald-400 font-black mb-6">AFFILIATE_CONTROL_v1.0</h4>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Your Encryption Link</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-emerald-400 font-mono text-xs truncate">
                                            {referralLink}
                                        </div>
                                        <button 
                                            onClick={() => handleCopy(referralLink)}
                                            className="px-6 bg-emerald-500 text-black font-black rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            {isZh ? '複製' : 'COPY'}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="p-6 rounded-3xl bg-white/5 border border-white/10 transition-all group">
                                         <div className="flex justify-between items-start mb-2">
                                             <Users className="w-6 h-6 text-blue-400" />
                                             <span className="text-[10px] font-mono text-gray-600">Total_Network</span>
                                         </div>
                                         <div className="text-3xl font-mono font-bold text-white">12</div>
                                         <div className="text-[9px] text-gray-500 mt-1 uppercase">Successful Onboards</div>
                                     </div>
                                     <div className="p-6 rounded-3xl bg-white/5 border border-white/10 transition-all group">
                                         <div className="flex justify-between items-start mb-2">
                                             <Coins className="w-6 h-6 text-celestial-gold" />
                                             <span className="text-[10px] font-mono text-gray-600">Pending_GWC</span>
                                         </div>
                                         <div className="text-3xl font-mono font-bold text-celestial-gold">2,450</div>
                                         <div className="text-[9px] text-gray-500 mt-1 uppercase">Earned from Referrals</div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 glass-bento p-8 bg-slate-950/40 border-white/5 rounded-[3rem] flex flex-col shadow-xl min-h-0 overflow-hidden">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h4 className="zh-main text-xl text-white">夥伴網絡日誌 (Nexus Activity)</h4>
                            <span className="uni-mini bg-blue-500 text-white border-none shadow-lg">LIVE_SYNC</span>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
                            {[
                                { user: "Linda_Strategy", action: "Completed Berkeley Star", bonus: "+50 GWC", time: "2h ago" },
                                { user: "Green_Corp_A", action: "Enterprise Subscription", bonus: "+1200 GWC", time: "5h ago" },
                                { user: "Mark_Architect", action: "Joined via link", bonus: "+10 GWC", time: "1d ago" },
                                { user: "Tech_Sustain", action: "AIMS Activation", bonus: "+300 GWC", time: "2d ago" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-gray-500 font-bold text-[10px]">
                                            {log.user[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{log.user}</div>
                                            <div className="text-[10px] text-gray-500">{log.action}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-mono font-bold text-emerald-400">{log.bonus}</div>
                                        <div className="text-[9px] text-gray-600 font-mono uppercase">{log.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 資源與推廣工具 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="glass-bento p-8 bg-slate-900/60 border-celestial-purple/30 rounded-[3rem] shadow-2xl shrink-0">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Target className="w-5 h-5 text-celestial-purple" /> CAMPAIGN_ASSETS
                        </h4>
                        <div className="space-y-4">
                            <div className="p-5 rounded-[2.5rem] bg-black/40 border border-white/10 group cursor-pointer hover:border-celestial-purple/60 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><FileText className="w-12 h-12" /></div>
                                <h5 className="zh-main text-lg text-white mb-1">企業方案白皮書</h5>
                                <p className="text-[10px] text-gray-500">PDF • 12.4 MB • 2025 Edition</p>
                            </div>
                            <div className="p-5 rounded-[2.5rem] bg-black/40 border border-white/10 group cursor-pointer hover:border-celestial-purple/60 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Share2 className="w-12 h-12" /></div>
                                <h5 className="zh-main text-lg text-white mb-1">推廣圖片素材包</h5>
                                <p className="text-[10px] text-gray-500">ZIP • 45 MB • High Fidelity</p>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                            Request Custom Assets
                        </button>
                    </div>

                    <div className="glass-bento p-8 flex-1 bg-slate-950 border-white/10 rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 relative z-10"><Award className="w-4 h-4" /> NEXUS_TIER</h4>
                        <div className="relative z-10 text-center py-6">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestial-purple to-pink-500 mb-2">SILVER</div>
                            <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em] mb-8">Level 2 Advocate</p>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-gray-500 uppercase">Progress_to_Gold</span>
                                    <span className="text-white">8/15 Onboards</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-celestial-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: '55%' }} />
                                </div>
                                <p className="text-[9px] text-gray-500 leading-relaxed italic">
                                    「升級至 Gold 級別後，GWC 分潤比例將由 15% 提升至 22%。」
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

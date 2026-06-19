import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
    Globe, ShieldCheck, Zap, ArrowRight, MessageSquare, 
    ExternalLink, Building, Info, Newspaper, Target, Heart,
    Compass, Microscope, Mountain, Activity, Users, Radio,
    Sparkles, Calendar, Award, Star, Library, BookOpen, Fingerprint, Cpu,
    Link as LinkIcon, Database, CheckCircle, Flame
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';

export const PartnerPortal: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activePartner, setActivePartner] = useState<'esgss' | 'samwell' | 'kentrek'>('esgss');
  const [syncPulse, setSyncPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setSyncPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const partners = {
    esgss: {
        id: 'esgss',
        name: isZh ? '善向永續 (ESGss)' : 'ESG Sunshine',
        tagline: isZh ? '創價型永續轉型的領導者' : 'Leader in Value-Creating ESG',
        mission: isZh ? '透過 AIOS 與王道思維，將 ESG 從「成本負擔」轉化為企業的「競爭優勢」。' : 'Transforming ESG from cost to competitive edge via AIOS.',
        vision: isZh ? '建立一個數據與價值共生的全球永續作業系統，實現組織的再生治理。' : 'Building a global sustainability OS for regenerative governance.',
        officialSite: 'https://www.esgsunshine.com/',
        flagship: {
            title: isZh ? 'Berkeley × TSISDA 國際雙證班' : 'Berkeley × TSISDA Global Cert',
            desc: isZh ? '整合 Berkeley Haas IBI 頂尖策略思維與台灣實務轉型實作。' : 'Integrating Berkeley Haas IBI logic with Taiwan execution.',
            link: 'https://www.esgsunshine.com/courses/berkeley-tsisda'
        },
        features: [
            { title: isZh ? 'AIOS 智慧中樞' : 'AIOS Kernel', desc: isZh ? '自動化合規與創價模擬引擎' : 'Automated compliance & value engine' },
            { title: isZh ? '王道思維框架' : 'Wangdao Logic', desc: isZh ? '對標全球 500 強企業永續案例' : 'Benchmarking Global Fortune 500' }
        ],
        news: [
            { date: '2025.03', title: isZh ? 'JunAiKey v16.1 聯盟協定正式發布' : 'JunAiKey v16.1 Affiliate Protocol Live' },
            { date: '2025.02', title: isZh ? '啟動 2025 永續轉體培育計畫' : '2025 ESG Leader Program Launched' }
        ],
        ingestion: { status: 'Synced', last: '5m ago', tokens: '450k', reliability: 99.8, frequency: '0.5Hz' },
        icon: Star,
        color: 'text-celestial-gold',
        bg: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30'
    },
    samwell: {
        id: 'samwell',
        name: isZh ? '山衛科技 (Samwell)' : 'Samwell Testing',
        tagline: isZh ? '工業安全與環境監測的精準守護者' : 'Precision Guardian of Industry Safety',
        mission: isZh ? '引領精密測試與監測技術，確保工業生產與環境共存的極致安全。' : 'Leading precision monitoring to ensure extreme safety and harmony.',
        vision: isZh ? '讓每一筆量測數據，都成為守護地球與人類安全的堅實後盾。' : 'Every measurement data becomes a shield for Earth & Humanity.',
        officialSite: 'https://www.samwells.com/h/Index?key=icm3',
        flagship: {
            title: isZh ? 'AE 聲發射早期預警監測系統' : 'AE Early Warning System',
            desc: isZh ? '利用量子級別的震動分析，在微小裂紋產生時即發出警報。' : 'Quantum-level vibration analysis to prevent environmental disasters.',
            link: 'https://www.samwells.com/h/Index?key=icm3'
        },
        features: [
            { title: isZh ? '精密環境監測' : 'Eco Monitoring', desc: isZh ? '30 年環境應力測試與分析實戰經驗' : '30 years of stress testing expertise' },
            { title: isZh ? '工業安全 4.0' : 'Safety 4.0', desc: isZh ? '整合 IoT 與 AI 的自動巡檢方案' : 'IoT & AI integrated auto-inspection' }
        ],
        news: [
            { date: '2025.02', title: isZh ? '引進全新量子能譜分析儀' : 'New Quantum spectral analyzer for traceability' },
            { date: '2025.01', title: isZh ? '協助石化園區完成 ESG 風險盤查' : 'ESG risk audit completed for Petro-Park' }
        ],
        ingestion: { status: 'Ingesting', last: 'Active', tokens: '1.2M', reliability: 98.4, frequency: '2.4Hz' },
        icon: Microscope,
        color: 'text-celestial-blue',
        bg: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
    },
    kentrek: {
        id: 'kentrek',
        name: isZh ? '墾趣 (KenTrek)' : 'KenTrek Outdoor',
        tagline: isZh ? '無痕山林與永續戶外生活的倡議者' : 'Advocate of LNT & Sustainable Outdoor',
        mission: isZh ? '讓每趟大自然冒險，都成為對地球的溫柔呵護，推廣永續戶外探索。' : 'Making every nature adventure a gentle care for the Earth.',
        vision: isZh ? '連結戶外熱情與環境責任，打造台灣獨特的永續探索文化。' : 'Bridging outdoor passion and eco-responsibility in Taiwan.',
        officialSite: 'https://www.freetimegears.com.tw/ec/',
        flagship: {
            title: isZh ? '墾趣永續學院 (LNT Academy)' : 'KenTrek LNT Academy',
            desc: isZh ? '培育具備無痕山林 (Leave No Trace) 精神的領袖。' : 'Cultivating LNT leaders and promoting circular gear economy.',
            link: 'https://www.freetimegears.com.tw/ec/'
        },
        features: [
            { title: isZh ? '無痕山林教育' : 'LNT Education', desc: isZh ? '系統化培育戶外永續公民意識' : 'Systematic outdoor eco-citizenship' },
            { title: isZh ? '循環裝備服務' : 'Circular Gear', desc: isZh ? '延長裝備生命週期，減少戶外廢棄物' : 'Reducing waste via equipment lifecycle mgmt' }
        ],
        news: [
            { date: '2025.03', title: isZh ? '2025 墾趣永續營地計畫開放報名' : 'KenTrek Sustainability Camp 2025 Open' },
            { date: '2025.02', title: isZh ? '「循環背包」回收計畫獲得 ESG 創新獎' : 'Circular Backpack Project wins Innovation Award' }
        ],
        ingestion: { status: 'Linked', last: '1h ago', tokens: '28k', reliability: 100, frequency: '0.1Hz' },
        icon: Mountain,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30'
    }
  };

  const partner = partners[activePartner];

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden pb-4">
        <UniversalPageHeader 
            icon={Globe}
            title={{ zh: '生態夥伴矩陣', en: 'Ecosystem Partner Matrix' }}
            description={{ zh: '連結跨界領航者，共創永續文明生態系', en: 'Connecting Visionaries: ESGss × Samwell × KenTrek' }}
            language={language}
            tag={{ zh: '生態核心 v16.1', en: 'ECO_SYSTEM_V16.1' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            {/* 左側：導航節點 (3/12) - 讓空間更緊湊 */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar">
                <div className="glass-bento p-5 flex flex-col bg-slate-900/60 border-white/5 shadow-xl shrink-0 rounded-3xl">
                    <h3 className="zh-main text-sm text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        {isZh ? '合作節點' : 'Nodes'}
                    </h3>
                    <div className="space-y-2">
                        {Object.values(partners).map((p) => (
                            <button 
                                key={p.id}
                                onClick={() => setActivePartner(p.id as any)}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-3 text-left group relative overflow-hidden
                                    ${activePartner === p.id ? `${p.borderColor} bg-white/10 scale-[1.02]` : 'bg-white/5 border-white/5 hover:border-white/10'}
                                `}
                            >
                                <div className={`p-2 rounded-xl bg-black/40 border transition-all ${activePartner === p.id ? `${p.borderColor} ${p.color}` : 'border-white/10 text-gray-600'}`}>
                                    <p.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`zh-main text-xs truncate ${activePartner === p.id ? 'text-white' : 'text-gray-400'}`}>{p.name}</div>
                                    <div className="text-[8px] font-mono text-gray-600 mt-0.5 uppercase tracking-tighter">{p.id}_LINK</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* AIOS Ingestion Monitoring - 更加緊湊 */}
                <div className="glass-bento p-6 flex-1 bg-slate-950 border-emerald-500/10 relative overflow-hidden flex flex-col shadow-xl rounded-3xl">
                    <div className="absolute -right-10 -bottom-10 opacity-5"><Database className="w-32 h-32 text-emerald-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="zh-main text-[10px] text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <LinkIcon className="w-3 h-3" /> SYNC_PULSE
                            </h4>
                            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                        </div>
                        
                        <div className="space-y-4 flex-1">
                            <div className="h-16 bg-black/40 rounded-xl border border-white/5 flex items-end justify-between px-3 pb-3 overflow-hidden relative">
                                {[...Array(20)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-1 bg-emerald-500 rounded-full transition-all duration-300"
                                        style={{ 
                                            height: `${20 + Math.sin((syncPulse + i) * 0.3) * 30 + Math.random() * 20}%`,
                                            opacity: 0.2 + (i / 20) * 0.5
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-[8px] font-bold text-gray-500 uppercase mb-0.5">Reliability</div>
                                    <div className="text-lg font-mono font-bold text-emerald-400">{partner.ingestion.reliability}%</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-[8px] font-bold text-gray-500 uppercase mb-0.5">Ingested</div>
                                    <div className="text-lg font-mono font-bold text-white">{partner.ingestion.tokens}</div>
                                </div>
                            </div>

                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2 mt-auto">
                                <div className="flex justify-between items-center text-[9px]">
                                    <span className="text-gray-600 uppercase font-black">Sync_L11</span>
                                    <span className="text-emerald-500 font-bold uppercase">{partner.ingestion.status}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${partner.ingestion.reliability}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右側：夥伴數位孿生與戰略報告 (9/12) - 縮小標題字體，增加可見空間 */}
            <div className="col-span-12 lg:col-span-9 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 glass-bento p-8 bg-slate-900/40 relative overflow-y-auto no-scrollbar shadow-2xl border-white/5 rounded-[3rem]">
                    
                    {/* Header: Identity & Narrative */}
                    <div className="flex flex-col xl:flex-row justify-between items-start gap-6 mb-8 border-b border-white/5 pb-8">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-5">
                                <div className={`p-5 rounded-3xl ${partner.bg} ${partner.color} shadow-lg shrink-0 border border-white/5`}>
                                    <partner.icon className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="zh-main text-3xl text-white tracking-tighter">{partner.name}</h2>
                                    <p className={`text-xs font-bold uppercase tracking-[0.2em] mt-1 ${partner.color}`}>{partner.tagline}</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <p className="text-lg text-gray-300 font-light leading-relaxed italic">
                                    "{partner.mission}"
                                </p>
                            </div>
                        </div>
                        <div className="w-full xl:w-64 flex flex-col gap-3 shrink-0">
                            <a 
                                href={partner.officialSite} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-3.5 bg-white text-black font-black rounded-xl flex items-center justify-center gap-2 hover:bg-celestial-gold transition-all text-[11px] uppercase tracking-widest shadow-lg"
                            >
                                <Globe className="w-4 h-4" /> {isZh ? '造訪官網' : 'Official Portal'}
                            </a>
                            <button className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-[11px] uppercase tracking-widest">
                                <MessageSquare className="w-4 h-4" /> {isZh ? '發起對話' : 'Strategic Inquiry'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Latest Intelligence */}
                        <div className="space-y-8">
                            <h4 className="flex items-center gap-3 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-celestial-gold pl-4">
                                <Activity className="w-5 h-5 text-celestial-gold" />
                                {isZh ? '最新情報' : 'Intelligence'}
                            </h4>
                            <div className="space-y-4">
                                {partner.news.map((item, i) => (
                                    <div key={i} className="p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-celestial-gold/20 transition-all group cursor-pointer relative overflow-hidden">
                                        <div className="flex items-center gap-2 text-[9px] font-mono text-gray-600 mb-1">
                                            <Calendar className="w-3 h-3" />
                                            {item.date}
                                        </div>
                                        <h5 className="zh-main text-sm text-gray-300 group-hover:text-white transition-colors leading-tight">{item.title}</h5>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 shadow-inner">
                                <h5 className="text-[9px] font-black text-gray-600 uppercase mb-2 tracking-[0.2em] flex items-center gap-2">
                                    <Target className="w-3 h-3" /> VISION_MANIFESTO
                                </h5>
                                <p className="text-xs text-gray-400 leading-relaxed font-light">{partner.vision}</p>
                            </div>
                        </div>

                        {/* Flagship & Digital Assets */}
                        <div className="space-y-8">
                            <h4 className="flex items-center gap-3 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-celestial-purple pl-4">
                                <Sparkles className="w-5 h-5 text-celestial-purple" />
                                {isZh ? '旗艦方案' : 'Flagships'}
                            </h4>
                            
                            {/* Flagship Card */}
                            <div className="p-8 bg-gradient-to-br from-celestial-purple/10 via-slate-900 to-black rounded-3xl border border-celestial-purple/20 relative overflow-hidden group/flag shadow-xl">
                                <div className="absolute top-0 right-0 p-4 opacity-5"><Award className="w-32 h-32" /></div>
                                <div className="uni-mini bg-celestial-purple text-white mb-4 uppercase tracking-widest border-none px-2 py-0.5 text-[8px]">RECOMMENDED</div>
                                <h5 className="zh-main text-xl text-white mb-3 leading-tight">{partner.flagship.title}</h5>
                                <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
                                    {partner.flagship.desc}
                                </p>
                                <button 
                                    onClick={() => window.open(partner.flagship.link, '_blank')}
                                    className="flex items-center gap-3 text-[10px] font-black text-celestial-purple group-hover/flag:translate-x-2 transition-transform uppercase tracking-widest"
                                >
                                    {isZh ? '啟動轉型路徑' : 'START REGEN'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {partner.features.map((f, i) => (
                                    <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group flex flex-col justify-between">
                                        <div>
                                            <div className="text-[10px] font-black text-white uppercase mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                                {f.title}
                                            </div>
                                            <p className="text-[9px] text-gray-500 leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
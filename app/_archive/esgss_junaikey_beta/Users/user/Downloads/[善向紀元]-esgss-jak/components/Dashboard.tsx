
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Activity, Database, Zap, BarChart3, RefreshCw, Sparkles, Terminal, 
    TrendingDown, ArrowUpRight, Eye
} from 'lucide-react';
import { Language, EvolutionLogEntry, SystemVital } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
    PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, 
    CartesianGrid
} from 'recharts';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence } from '../services/evolutionEngine';
import { useTheme } from '../contexts/ThemeContext';

export const Dashboard: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [evoLogs, setEvoLogs] = useState<EvolutionLogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const subV = universalIntelligence.vitals$.subscribe(v => {
      setVitals(v);
      setVitalsHistory(prev => {
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
        return [...prev, {
          time: timestamp,
          integrity: v.integrityScore,
          entropy: (1 - v.entropy) * 100, 
          load: v.contextLoad * 5
        }].slice(-15); 
      });
    });
    const subE = universalIntelligence.evolutionLogs$.subscribe(setEvoLogs);
    return () => { subV.unsubscribe(); subE.unsubscribe(); };
  }, []);

  const radarData = useMemo(() => {
    if (!vitals) return [];
    return [
      { subject: isZh ? '完整性' : 'Integrity', A: vitals.integrityScore },
      { subject: isZh ? '負熵' : 'Neg-Entropy', A: (1 - vitals.entropy) * 100 },
      { subject: isZh ? '感知' : 'Sense', A: vitals.trinity.perception },
      { subject: isZh ? '認知' : 'Think', A: vitals.trinity.cognition },
      { subject: isZh ? '行動' : 'Action', A: vitals.trinity.action },
      { subject: isZh ? '協同' : 'Synergy', A: vitals.synergyLevel * 100 },
    ];
  }, [vitals, isZh]);

  const chartStroke = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-4 relative">
        <UniversalPageHeader 
            icon={Database} 
            title={{ zh: 'AIOS 戰略一覽全景 (AIMS)', en: 'AIOS Strategic Panorama' }} 
            description={{ zh: '萬能核心儀表板：從全知之眼到熵減煉金', en: 'AIMS Console: From All-Seeing Eye to Entropy Reduction' }} 
            language={language} 
            tag={{ zh: '內核 v16.1', en: 'CORE_v16.1' }} 
        />

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
            
            {/* 1. 核心看板：黑夜模式用漸層，白天模式用實體重藍色 */}
            <div className={`col-span-12 lg:col-span-4 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group 
                ${isDark ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : 'bg-slate-900'}`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Eye className="w-32 h-32" /></div>
                <div className="relative z-10">
                    <h3 className="text-lg opacity-80 font-bold flex items-center gap-2"><Sparkles className="w-5 h-5"/> 全知之眼召回率 (RAG)</h3>
                    <div className="text-7xl font-black mt-4 tracking-tighter">95.4%</div>
                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase opacity-60">Memory_Sync_Progress</div>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white animate-pulse" style={{ width: '95.4%' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 系統熵值：白天模式強化陰影感 */}
            <div className={`col-span-12 lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center transition-all border border-slate-100 dark:border-white/5 
                ${!isDark ? 'shadow-[0_20px_50px_rgba(0,0,0,0.05)]' : 'shadow-xl'}`}>
                <div className={`p-4 rounded-3xl mb-4 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}><TrendingDown className="w-8 h-8 text-emerald-500" /></div>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">系統總熵值</h4>
                <div className="text-4xl font-mono font-black text-emerald-600 dark:text-emerald-500">0.082</div>
                <p className="text-[8px] text-slate-300 dark:text-gray-600 mt-2 italic">Neg-Entropy Active</p>
            </div>

            {/* 3. 雷達圖：背景隨主題切換 */}
            <div className={`col-span-12 lg:col-span-6 bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 flex flex-col 
                ${!isDark ? 'shadow-[0_20px_50px_rgba(0,0,0,0.05)]' : 'shadow-2xl'}`}>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" /> KERNEL_VITALS_RADAR
                </h4>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke={chartStroke} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 10, fontWeight: 700 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Vitals" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDark ? '#020617' : '#fff' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. 趨勢圖：白天模式移除模糊，使用純色填充 */}
            <div className={`col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 rounded-[3rem] p-10 flex flex-col border border-slate-100 dark:border-white/5 
                ${!isDark ? 'shadow-[0_30px_60px_rgba(0,0,0,0.05)]' : 'shadow-2xl'}`}>
                <div className="flex justify-between items-center mb-8 px-2">
                    <h3 className="text-xl text-slate-800 dark:text-white font-black tracking-tighter uppercase flex items-center gap-3"><Zap className="w-6 h-6 text-amber-500" /> 影響力顯化脈衝</h3>
                    <div className="uni-mini bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-none">REAL_TIME</div>
                </div>
                <div className="flex-1 min-h-0 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={vitalsHistory}>
                            <defs>
                                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} vertical={false} />
                            <XAxis dataKey="time" stroke={textColor} fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDark ? '#020617' : '#fff', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }} />
                            <Area type="monotone" dataKey="integrity" stroke="#3b82f6" fill="url(#colorInt)" strokeWidth={4} isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 5. 進化終端：白天模式背景淡灰 */}
            <div className={`col-span-12 lg:col-span-6 bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-8 flex flex-col min-h-0 border border-slate-200 dark:border-white/5 
                ${!isDark ? 'shadow-inner' : 'shadow-xl'}`}>
                <div className="flex justify-between items-center mb-6 px-2">
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"><Terminal className="w-4 h-4" /> 演化終端</h4>
                    <RefreshCw className="w-3 h-3 text-slate-300 dark:text-gray-700 animate-spin-slow" />
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] space-y-2 px-2">
                    {evoLogs.slice(-8).map(log => (
                        <div key={log.id} className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-black/20 border-white/5 text-gray-400' : 'bg-white border-slate-100 text-slate-600'}`}>
                            <span className="text-emerald-500 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.action}
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>

        </div>
    </div>
  );
};

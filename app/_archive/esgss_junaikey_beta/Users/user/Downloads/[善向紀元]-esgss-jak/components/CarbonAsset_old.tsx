
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { Language } from '../types';
import { 
    Leaf, TrendingUp, PieChart, MapPin, Loader2, Zap, Calculator, 
    Fuel, Save, DollarSign, AlertTriangle, Cloud, RefreshCw, 
    ExternalLink, Wand2, Power, Link as LinkIcon, Radio, ChevronRight, Activity, Globe, Search, Database, AlertCircle, 
    Flame, Sparkles, Heart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { performMapQuery, runMcpAction } from '../services/ai-service';
import { BackendService } from '../services/backend';
import { useCompany } from './providers/CompanyProvider';
import { QuantumSlider } from './minimal/QuantumSlider';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { universalIntelligence } from '../services/evolutionEngine';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { z } from 'zod';

const EMISSION_DATA = [
  { name: 'Jan', scope1: 120, scope2: 250, scope3: 300 },
  { name: 'Feb', scope1: 115, scope2: 245, scope3: 290 },
  { name: 'Mar', scope1: 130, scope2: 260, scope3: 310 },
  { name: 'Apr', scope1: 110, scope2: 240, scope3: 280 },
  { name: 'May', scope1: 105, scope2: 235, scope3: 270 },
  { name: 'Jun', scope1: 100, scope2: 230, scope3: 260 },
];

export const CarbonAsset: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { carbonData, updateCarbonData, awardXp, addJournalEntry, budget, setBudget, carbonCredits, setCarbonCredits, addAuditLog } = useCompany();
  const { observeAction } = useUniversalAgent();
  
  const [mapQuery, setMapQuery] = useState('');
  const [isMapping, setIsMapping] = useState(false);
  const [mapResult, setMapResult] = useState<{text: string, sources?: any[]} | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [shadowPrice, setShadowPrice] = useState(85);
  const [fuelInput, setFuelInput] = useState(carbonData.fuelConsumption);
  const [elecInput, setElecInput] = useState(carbonData.electricityConsumption);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  // Trading state
  const [isTrading, setIsTrading] = useState(false);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // Alchemistry state
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [alchResult, setAlchResult] = useState<any>(null);

  const carbonSchema = useMemo(() => z.object({
    fuel: z.number().min(0, isZh ? "油耗不能為負數" : "Fuel must be non-negative"),
    electricity: z.number().min(0, isZh ? "電耗不能為負數" : "Electricity must be non-negative")
  }), [isZh]);

  const handleLocateSupplier = async () => {
      if(!mapQuery.trim()) return;
      setIsMapping(true); setMapResult(null);
      addToast('info', isZh ? '正在透過 Google Maps 對標設施...' : 'Grounding via Maps AI...', 'Maps');
      try {
          const result = await performMapQuery(mapQuery, language);
          setMapResult(result);
      } catch (e) { addToast('error', 'Map query fault.', 'Error'); }
      finally { setIsMapping(false); }
  };

  const calculateEmissions = async () => {
      setInputErrors({});
      const result = carbonSchema.safeParse({ fuel: fuelInput, electricity: elecInput });
      
      if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach(err => {
              if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setInputErrors(fieldErrors);
          addToast('error', isZh ? '數據輸入有誤' : 'Invalid input data', 'Error');
          return;
      }

      setIsSyncing(true);
      setTimeout(() => {
          updateCarbonData({ fuelConsumption: fuelInput, electricityConsumption: elecInput });
          setIsSyncing(false);
          addToast('success', isZh ? '原始數據已刻印至內核' : 'Raw data engraved to kernel', 'System');
      }, 1000);
  };

  const handleAlchemistry = async () => {
      setIsTransmuting(true);
      setAlchResult(null);
      addToast('info', isZh ? '啟動「原罪煉金」減碳演算序列...' : 'Initiating Sins Transmutation...', 'Alchemist');
      
      try {
          const res = await runMcpAction('carbon_reduction_calculation', {
              currentUsage: elecInput,
              baseline: 50000, // Simulated baseline
              sector: 'Electronics',
              country: 'Taiwan'
          }, language);

          if (res.success) {
              setAlchResult(res.result);
              awardXp(150);
              addJournalEntry(
                  isZh ? '完成減碳演算煉金' : 'Carbon Reduction Alchemistry Complete',
                  isZh ? `成功將排放數據轉化為影響力。減量: ${res.result.carbonSaved} kgCO2e` : `Transmuted emissions into impact. Saved: ${res.result.carbonSaved} kgCO2e`,
                  150,
                  'action',
                  ['Carbon', 'Alchemistry']
              );
              addToast('reward', isZh ? '煉金成功！獲得 150 XP' : 'Alchemistry Success! +150 XP', 'Evolution');
              observeAction('CARBON_ALCHEMY', `${res.result.carbonSaved}kgCO2e saved`);
          }
      } catch (e) {
          addToast('error', 'Alchemistry sequence interrupted.', 'Error');
      } finally {
          setIsTransmuting(false);
      }
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
        <div className="shrink-0 pb-1 border-b border-white/5">
            <UniversalPageHeader 
                icon={Leaf}
                title={{ zh: '碳資產全方位管控 (Inventory)', en: 'Carbon Asset Command' }}
                description={{ zh: '即時排放監控與影子定價一覽全方位', en: 'Inventory & Pricing Matrix: At-a-glance carbon governance.' }}
                language={language}
                tag={{ zh: '淨零內核 v16.1', en: 'NETZERO_v16.1' }}
            />
        </div>

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
            
            {/* 1. 排放流矩陣 & 煉金氣泡 (6/12) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
                {/* 減碳成就氣泡 */}
                <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-700 flex items-center justify-between relative overflow-hidden group shadow-2xl
                    ${alchResult ? 'bg-emerald-500/10 border-emerald-500/30 scale-[1.01]' : 'bg-slate-900/40 border-white/5 opacity-80'}
                `}>
                    {alchResult && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-[scan_3s_linear_infinite]" />}
                    <div className="flex items-center gap-6 relative z-10">
                        <div className={`p-4 rounded-[1.8rem] transition-all duration-500 ${alchResult ? 'bg-emerald-500 text-black shadow-[0_0_25px_#10b981] animate-pulse' : 'bg-white/5 text-gray-700'}`}>
                            <Flame className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">Carbon_Impact_Pulse</div>
                            <div className="text-4xl font-mono font-black text-white tracking-tighter">
                                {alchResult ? `${alchResult.carbonSaved.toLocaleString()} kg` : '0.00 kg'}
                            </div>
                        </div>
                    </div>
                    {alchResult && (
                        <div className="text-right relative z-10">
                            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase">
                                <Leaf className="w-4 h-4" /> {alchResult.treeEquivalent} Trees
                            </div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Reduction_Achieved</div>
                        </div>
                    )}
                    {!alchResult && !isTransmuting && (
                        <button onClick={handleAlchemistry} className="px-8 py-3 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-celestial-gold transition-all shadow-xl">START_ALCHEMY</button>
                    )}
                    {isTransmuting && (
                         <div className="flex items-center gap-2 text-celestial-gold animate-pulse">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             <span className="text-[10px] font-black uppercase">Transmuting...</span>
                         </div>
                    )}
                </div>

                <div className="flex-1 glass-bento p-5 flex flex-col bg-slate-900/40 border-white/5 min-h-0 rounded-[2rem]">
                    <div className="flex justify-between items-center mb-4 shrink-0 px-2">
                        <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><PieChart className="w-3.5 h-3.5 text-emerald-400" /> Emissions_Flow_Matrix</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Scope 1</div>
                            <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Scope 2</div>
                            <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-celestial-gold" /> Scope 3</div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
                            <AreaChart data={EMISSION_DATA} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorS2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorS3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                <XAxis dataKey="name" stroke="#334155" fontSize={8} tickLine={false} axisLine={false} />
                                <YAxis stroke="#334155" fontSize={8} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', fontSize: '9px' }} />
                                <Area type="monotone" dataKey="scope1" stackId="1" stroke="#10b981" fill="url(#colorS1)" strokeWidth={2} />
                                <Area type="monotone" dataKey="scope2" stackId="1" stroke="#3b82f6" fill="url(#colorS2)" strokeWidth={2} />
                                <Area type="monotone" dataKey="scope3" stackId="1" stroke="#fbbf24" fill="url(#colorS3)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 2. 即時盤查與影子定價 (6/12) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
                <div className="flex-1 glass-bento p-5 flex flex-col bg-slate-950 border-white/10 min-h-0 rounded-[2.5rem]">
                    <h3 className="zh-main text-[11px] text-white mb-6 flex items-center gap-2 px-2 uppercase"><Calculator className="w-3.5 h-3.5 text-celestial-blue" /> Carbon_Inventory_Flux</h3>
                    <div className="grid grid-cols-2 gap-6 flex-1 px-2 items-center">
                        <div className="space-y-4">
                            <div className={`p-4 bg-white/5 rounded-2xl border transition-all ${inputErrors.fuel ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5'}`}>
                                <label className="text-[9px] text-gray-600 uppercase font-black mb-1 block">Diesel (L)</label>
                                <input type="number" value={fuelInput} onChange={e => { setFuelInput(Number(e.target.value)); if(inputErrors.fuel) setInputErrors({...inputErrors, fuel: ''}); }} className="w-full bg-transparent text-2xl font-mono text-white outline-none" />
                                {inputErrors.fuel && <div className="text-[7px] text-rose-400 font-bold uppercase mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5"/> {inputErrors.fuel}</div>}
                            </div>
                            <div className={`p-4 bg-white/5 rounded-2xl border transition-all ${inputErrors.electricity ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5'}`}>
                                <label className="text-[9px] text-gray-600 uppercase font-black mb-1 block">Elec (kWh)</label>
                                <input type="number" value={elecInput} onChange={e => { setElecInput(Number(e.target.value)); if(inputErrors.electricity) setInputErrors({...inputErrors, electricity: ''}); }} className="w-full bg-transparent text-2xl font-mono text-white outline-none" />
                                {inputErrors.electricity && <div className="text-[7px] text-rose-400 font-bold uppercase mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5"/> {inputErrors.electricity}</div>}
                            </div>
                        </div>
                        <div className="space-y-4 flex flex-col justify-center h-full">
                            <button onClick={calculateEmissions} disabled={isSyncing} className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest hover:bg-celestial-gold active:scale-95 transition-all disabled:opacity-30">
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} COMMIT_SYNC
                            </button>
                            {alchResult && (
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-fade-in shadow-inner">
                                     <div className="text-[8px] font-black text-emerald-400 uppercase mb-2 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Alchemy_Insights</div>
                                     <p className="text-[10px] text-gray-300 leading-relaxed italic">"{alchResult.alchemicalNarrative}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 glass-bento p-5 flex flex-col bg-slate-900/60 border-celestial-gold/10 min-h-0 relative overflow-hidden rounded-[2.5rem]">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02]"><DollarSign className="w-32 h-32 text-celestial-gold" /></div>
                    <h3 className="zh-main text-[11px] text-white mb-6 flex items-center gap-2 relative z-10 px-2 uppercase"><Wand2 className="w-3.5 h-3.5 text-celestial-gold" /> Shadow_Price_Sim</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 items-center relative z-10 px-2">
                        <div className="space-y-6">
                            <QuantumSlider label="影子價格" value={shadowPrice} min={0} max={300} unit="$/t" color="gold" onChange={setShadowPrice} />
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-white/10 transition-all shadow-inner">
                                <span className="text-[8px] text-gray-600 uppercase font-black">Emissions_Total</span>
                                <span className="text-lg font-mono font-black text-white group-hover:text-celestial-gold">{(carbonData.scope1 + carbonData.scope2).toFixed(1)} <span className="text-[8px] text-gray-700 font-bold uppercase">tCO2e</span></span>
                            </div>
                        </div>
                        <div className="bg-celestial-gold/5 border border-celestial-gold/20 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
                            <div className="text-[9px] font-black text-celestial-gold uppercase tracking-widest mb-1 opacity-60">Carbon_Trading_Hub</div>
                            <div className="text-2xl font-mono font-black text-white tracking-tighter mb-2">
                                {carbonCredits.toLocaleString()} Credits
                            </div>
                            <div className="text-[9px] font-black text-celestial-gold/60 uppercase tracking-widest mb-3">Budget: ${budget.toLocaleString()}</div>

                            {/* Trading Controls */}
                            <div className="space-y-3 w-full">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTradeType('buy')}
                                        className={`flex-1 py-2 px-3 text-[8px] font-black uppercase rounded-xl transition-all ${
                                            tradeType === 'buy'
                                                ? 'bg-emerald-500 text-black shadow-lg'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                    >
                                        BUY
                                    </button>
                                    <button
                                        onClick={() => setTradeType('sell')}
                                        className={`flex-1 py-2 px-3 text-[8px] font-black uppercase rounded-xl transition-all ${
                                            tradeType === 'sell'
                                                ? 'bg-rose-500 text-black shadow-lg'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                    >
                                        SELL
                                    </button>
                                </div>

                                <input
                                    type="number"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(Number(e.target.value))}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-center text-white text-sm font-mono"
                                    placeholder="Amount"
                                    min="1"
                                />

                                <button
                                    onClick={() => {
                                        const cost = tradeAmount * shadowPrice;
                                        if (tradeType === 'buy') {
                                            if (budget >= cost) {
                                                setBudget(budget - cost);
                                                setCarbonCredits(carbonCredits + tradeAmount);
                                                addAuditLog(`碳權購買: ${tradeAmount} 單位`, `成本: ${cost}`);
                                                addToast('success', `購買 ${tradeAmount} 碳權成功!`, 'Trading');
                                                awardXp(50);
                                            } else {
                                                addToast('error', '預算不足!', 'Error');
                                            }
                                        } else {
                                            if (carbonCredits >= tradeAmount) {
                                                setBudget(budget + cost);
                                                setCarbonCredits(carbonCredits - tradeAmount);
                                                addAuditLog(`碳權出售: ${tradeAmount} 單位`, `收入: ${cost}`);
                                                addToast('success', `出售 ${tradeAmount} 碳權成功!`, 'Trading');
                                                awardXp(30);
                                            } else {
                                                addToast('error', '碳權餘額不足!', 'Error');
                                            }
                                        }
                                    }}
                                    disabled={isTrading || tradeAmount <= 0}
                                    className="w-full py-3 bg-celestial-gold text-black font-black text-[10px] uppercase rounded-xl shadow-lg hover:bg-celestial-gold/80 disabled:opacity-50 transition-all"
                                >
                                    {tradeType === 'buy' ? `買入 ${(tradeAmount * shadowPrice).toLocaleString()}` : `賣出 ${(tradeAmount * shadowPrice).toLocaleString()}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

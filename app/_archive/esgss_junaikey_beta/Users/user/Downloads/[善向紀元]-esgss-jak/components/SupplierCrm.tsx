import React, { useState, useMemo, useEffect } from 'react';
import { 
    Users, Search, Filter, Plus, Mail, ShieldCheck, 
    Zap, Activity, Loader2, Star, ChevronRight, Eye,
    Target, Flame, CheckCircle, Database, Layout,
    ExternalLink, History, MessageSquare, ArrowUpRight, AlertTriangle, RefreshCw,
    ShieldAlert, SearchCode, Gavel
} from 'lucide-react';
import { Language, SupplierPersona, View } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { runMcpAction } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

export const SupplierCrm: React.FC<{ language: Language, onNavigate: (v: View) => void }> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { awardXp, addAgentTask } = useCompany();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState<string | null>(null);
  const [isInvestigatingId, setIsInvestigatingId] = useState<string | null>(null);

  const [suppliers, setSuppliers] = useState<SupplierPersona[]>([
      { 
          id: 's1', name: 'Global Electronics Ltd.', taxId: '12345678', trustScore: 82, carbonGrade: 'B', riskStatus: 'GREEN',
          inflowStatus: 'ENGRAVED',
          purity: { clarity: 95, alignment: 99, validity: 100 },
          metrics: { electricity_total: 45000, renewable_percent: 15, iso_certified: true, safety_incidents: 0, gender_pay_ratio: 0.95, ethics_signed: true },
          flowluMapping: { crm_account_id: 'acc_001', custom_fields: {} }
      },
      { 
          id: 's2', name: 'Precision Parts Corp', taxId: '87654321', trustScore: 45, carbonGrade: 'D', riskStatus: 'YELLOW',
          inflowStatus: 'TO_FIX',
          anomalyDetected: true,
          anomalyDetails: 'Electricity usage variance +520% detected.',
          purity: { clarity: 40, alignment: 85, validity: 90 },
          metrics: { electricity_total: 120000, renewable_percent: 5, iso_certified: false, safety_incidents: 2, gender_pay_ratio: 0.82, ethics_signed: true },
          flowluMapping: { crm_account_id: 'acc_002', custom_fields: {} }
      },
      { 
          id: 's3', name: 'PureFlow Logistics', taxId: '44556677', trustScore: 12, carbonGrade: 'E', riskStatus: 'RED',
          inflowStatus: 'IDLE',
          metrics: { electricity_total: 0, renewable_percent: 0, iso_certified: false, safety_incidents: 0, gender_pay_ratio: 0, ethics_signed: false },
          flowluMapping: { crm_account_id: 'acc_003', custom_fields: {} }
      }
  ]);

  const handleAction01 = async () => {
    setIsBroadcasting(true);
    addToast('info', isZh ? '正在執行動作 01：供應商全面排查協定...' : 'Executing Action 01: Supplier Survey Protocol...', 'CSO Agent');
    
    try {
        const res = await runMcpAction('dispatch_supplier_survey', { supplierName: 'ALL_SYNCED' }, language);
        if (res.success) {
            awardXp(500);
            addToast('reward', isZh ? '2026 戰略引導郵件已透過 CRM 派發' : '2026 Strategic invite emails dispatched via CRM', 'Nexus');
            setSuppliers(prev => prev.map(s => s.id === 's3' ? { ...s, inflowStatus: 'REFining' } : s));
        }
    } catch (e) { addToast('error', 'Broadcast Interrupt', 'Error'); }
    finally { setIsBroadcasting(false); }
  };

  const handleInvestigateAnomaly = async (supplier: SupplierPersona) => {
      setIsInvestigatingId(supplier.id);
      addToast('warning', isZh ? '啟動「原罪調查協議」：檢索邏輯矛盾...' : 'Activating Investigation Protocol: Analyzing contradictions...', 'Security');
      
      try {
          const res = await runMcpAction('perform_incident_investigation', {
              targetEntity: supplier.name,
              anomalyType: supplier.anomalyDetails || 'Logical Inconsistency'
          }, language);

          if (res.success) {
              await new Promise(r => setTimeout(r, 2000));
              // Auto-create Flowlu Task
              addAgentTask({
                  title: res.result.flowlu_task_title,
                  description: res.result.diagnosis + "\n\n" + res.result.recommendation,
                  assigneeId: 'jun-ai-key',
                  locationId: 'tpe',
                  dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                  priority: 'HIGH' as any
              });

              addToast('success', isZh ? '調查任務已同步至 Flowlu，警告郵件已發送' : 'Investigation synced to Flowlu & Warning Email sent.', 'Success');
              setSuppliers(prev => prev.map(s => s.id === supplier.id ? { ...s, inflowStatus: 'INVESTIGATING' } : s));
          }
      } catch (e) {
          addToast('error', 'Investigation fault.', 'Error');
      } finally {
          setIsInvestigatingId(null);
      }
  };

  const handleSimulateOcr = async (sId: string) => {
      setIsOcrProcessing(sId);
      setSuppliers(prev => prev.map(s => s.id === sId ? { ...s, inflowStatus: 'REFining' } : s));
      addToast('info', isZh ? '正在執行動作 05：OCR 數據本質提純...' : 'Executing Action 05: OCR Data Purification...', 'Alchemist');
      
      setTimeout(() => {
          setSuppliers(prev => prev.map(s => {
              if (s.id === sId) {
                  return { 
                    ...s, 
                    trustScore: Math.min(100, s.trustScore + 15), 
                    carbonGrade: 'A', 
                    riskStatus: 'GREEN',
                    inflowStatus: 'ENGRAVED',
                    anomalyDetected: false,
                    purity: { clarity: 98, alignment: 100, validity: 100 }
                  };
              }
              return s;
          }));
          setIsOcrProcessing(null);
          awardXp(200);
          addToast('success', isZh ? '單據數據已轉化為 ESG 因子並刻印至 Flowlu' : 'Bill data transmuted to ESG factors & engraved to Flowlu', 'System');
      }, 3000);
  };

  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden pb-4">
        <UniversalPageHeader 
            icon={Users}
            title={{ zh: 'CRM 供應商永續聖所', en: 'Supplier Sustainability CRM' }}
            description={{ zh: '數位人格、光學評級與數據刻印中樞', en: 'Digital Persona, Optical Rating & Data Engraving Nexus' }}
            language={language}
            tag={{ zh: '內核 v1.0', en: 'CRM_CORE_v1.0' }}
        />

        <div className="flex justify-between items-center shrink-0 gap-4">
            <div className="relative w-80 group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/search:text-celestial-gold transition-colors" />
                <input 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-xs text-white focus:border-celestial-gold outline-none transition-all placeholder:text-gray-700 font-black uppercase tracking-widest" 
                    placeholder="SEARCH_SUPPLIERS..." 
                />
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleAction01}
                    disabled={isBroadcasting}
                    className="px-8 py-3.5 bg-emerald-500 text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all text-[10px] uppercase shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-30"
                >
                    {isBroadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    ACTION_01_WAKE_UP
                </button>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            {/* Main List (8/12) */}
            <div className="col-span-12 lg:col-span-9 flex flex-col min-h-0 glass-bento bg-slate-950 border-white/5 rounded-[3rem] p-1 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none"><Database className="w-80 h-80" /></div>
                
                <div className="p-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center shrink-0 z-10 rounded-t-[3rem]">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-500" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Supply_Chain_Neural_Registry</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg tracking-widest">LIVE_RESONANCE_ACTIVE</div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-4 z-10">
                    {filteredSuppliers.map(supplier => (
                        <div key={supplier.id} className="group relative">
                            {/* Optical Aura Effect - Modified for Anomaly Red Halo */}
                            <div className={`absolute -inset-1 rounded-[2.5rem] blur-xl transition-all duration-700 pointer-events-none
                                ${supplier.anomalyDetected ? 'bg-rose-600 opacity-20 animate-pulse' : 'opacity-0 group-hover:opacity-20 ' + (supplier.trustScore > 70 ? 'bg-emerald-500' : supplier.trustScore > 40 ? 'bg-amber-500' : 'bg-rose-500')}
                            `} />
                            
                            <div className={`relative bg-black/60 border rounded-[2.2rem] p-6 transition-all flex items-center justify-between shadow-xl
                                ${supplier.anomalyDetected ? 'border-rose-500/40' : 'border-white/5 hover:border-white/20'}
                            `}>
                                <div className="flex items-center gap-8 flex-1 min-w-0">
                                    {/* Rating Circle */}
                                    <div className="relative shrink-0">
                                        <svg className="w-20 h-20 transform -rotate-90">
                                            <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                            <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                                strokeDasharray={213} strokeDashoffset={213 - (213 * supplier.trustScore) / 100}
                                                className={`transition-all duration-1000 ${supplier.trustScore > 70 ? 'text-emerald-500' : supplier.trustScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-mono font-black text-white">{supplier.trustScore}</span>
                                            <span className="text-[6px] text-gray-600 font-bold uppercase">TRUST</span>
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h4 className="zh-main text-2xl text-white truncate leading-tight group-hover:text-celestial-gold transition-colors">{supplier.name}</h4>
                                            {supplier.anomalyDetected && (
                                                <div className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded uppercase flex items-center gap-1 animate-pulse">
                                                    <ShieldAlert className="w-2 h-2" /> ANOMALY
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-6 mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Carbon_Grade:</span>
                                                <span className={`text-sm font-mono font-black ${supplier.carbonGrade === 'A' ? 'text-emerald-400' : supplier.carbonGrade === 'E' ? 'text-rose-400' : 'text-white'}`}>{supplier.carbonGrade}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Compliance:</span>
                                                <div className={`w-2 h-2 rounded-full ${supplier.riskStatus === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : supplier.riskStatus === 'YELLOW' ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`} />
                                            </div>
                                            {supplier.anomalyDetected && (
                                                <div className="flex items-center gap-2 ml-4 text-[9px] text-rose-400 italic">
                                                    <AlertTriangle className="w-3 h-3" /> {supplier.anomalyDetails}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {supplier.anomalyDetected ? (
                                        <button 
                                            onClick={() => handleInvestigateAnomaly(supplier)}
                                            disabled={isInvestigatingId === supplier.id}
                                            className="px-6 py-2.5 bg-rose-500 text-white font-black rounded-xl border border-rose-400/50 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-xl"
                                        >
                                            {isInvestigatingId === supplier.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <SearchCode className="w-3 h-3" />}
                                            INVESTIGATE_RUNE
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleSimulateOcr(supplier.id)}
                                            disabled={isOcrProcessing === supplier.id}
                                            className="px-6 py-2.5 bg-white/5 hover:bg-celestial-gold hover:text-black rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                        >
                                            {isOcrProcessing === supplier.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Flame className="w-3 h-3" />}
                                            ACTION_05_OCR
                                        </button>
                                    )}
                                    <button onClick={() => onNavigate(View.SUPPLIER_SURVEY)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-500 transition-all"><ChevronRight className="w-4 h-4"/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center shrink-0 rounded-b-[3rem]">
                    <div className="flex gap-10">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-700 uppercase font-black">Engraving_Integrity</span>
                            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs"><ShieldCheck className="w-2.5 h-2.5" /> 99.8%</div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-700 uppercase font-black">Sync_Frequence</span>
                            <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-xs"><Activity className="w-2.5 h-2.5" /> 0.5Hz</div>
                        </div>
                    </div>
                    <div className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Authenticated: Jun_JAK_CSO_Nexus</div>
                </div>
            </div>

            {/* Inflow Monitor (4/12) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                <div className="glass-bento p-6 bg-slate-900/60 border-white/5 rounded-[2.5rem] shadow-xl flex flex-col min-h-0 overflow-hidden">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> DATA_INFLOW_MONITOR</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h4>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                        {suppliers.map(s => (
                            <div key={s.id} className={`p-3 bg-black/40 border rounded-2xl flex items-center justify-between group
                                ${s.anomalyDetected ? 'border-rose-500/20' : 'border-white/5'}
                            `}>
                                <div className="flex items-center gap-3">
                                    {s.inflowStatus === 'REFining' ? (
                                        <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full ${s.anomalyDetected ? 'bg-rose-500' : s.inflowStatus === 'ENGRAVED' ? 'bg-emerald-500' : s.inflowStatus === 'TO_FIX' ? 'bg-rose-500' : 'bg-gray-800'}`} />
                                    )}
                                    <span className="text-[10px] font-bold text-gray-400 truncate w-32 group-hover:text-white transition-colors">{s.name}</span>
                                </div>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${s.anomalyDetected ? 'bg-rose-600 text-white' : s.inflowStatus === 'ENGRAVED' ? 'bg-emerald-500/10 text-emerald-400' : s.inflowStatus === 'TO_FIX' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-gray-600'}`}>
                                    {s.anomalyDetected ? 'ANOMALY' : s.inflowStatus}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Incident_Response_Vitals</div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">Total Anomailes</span>
                            <span className="text-[10px] font-mono font-bold text-rose-400">{suppliers.filter(s => s.anomalyDetected).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">Resolved by AI</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400">42</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

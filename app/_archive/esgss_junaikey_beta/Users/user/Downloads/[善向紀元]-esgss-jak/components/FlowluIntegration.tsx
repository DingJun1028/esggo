
import React, { useState, useEffect } from 'react';
import { 
    Workflow, Network, Layers, ShieldCheck, Zap, Database, 
    ArrowRight, Loader2, Sparkles, Activity, FileText,
    Users, Briefcase, Calculator, LineChart, Code, RefreshCw,
    Link, Globe, HardDrive, Target, CheckCircle2, AlertTriangle,
    Eye, SearchCode, Gavel, Cpu, Flame, Box
} from 'lucide-react';
import { Language } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { runMcpAction } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

export const FlowluIntegration: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { awardXp } = useCompany();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [activePhase, setActivePhase] = useState(2);

  const integrationTable = [
      { id: 'crm', mod: isZh ? 'CRM 聖所' : 'CRM Sanctuary', flow: isZh ? '客戶與供應商管理' : 'Contact Management', esg: isZh ? '供應鏈永續評級 (S)' : 'Supplier ESG Rating (S)', potential: 'HIGH', label: '#全知之眼', icon: Users },
      { id: 'proj', mod: isZh ? '專案陣列' : 'Project Array', flow: isZh ? '計畫與任務' : 'Task Mgmt', esg: isZh ? '減碳路徑執行 (E)' : 'Decarbonization (E)', potential: 'CRITICAL', label: '#光之羽翼', icon: Target },
      { id: 'fin', mod: isZh ? '財務符文' : 'Finance Rune', flow: isZh ? '發票與收支' : 'Invoices & Ops', esg: isZh ? '綠色金融對接 (G)' : 'Green Finance (G)', potential: 'HIGH', label: '#神聖契約', icon: Calculator },
      { id: 'knw', mod: isZh ? '知識聖典' : 'Knowledge', flow: isZh ? '知識庫與文檔' : 'KB & Docs', esg: isZh ? 'ESG 政策庫 (G)' : 'ESG Policy (G)', potential: 'CRITICAL', label: '#記憶聖所', icon: Library },
      { id: 'cst', mod: isZh ? '自定義域' : 'Custom Fields', flow: isZh ? '自定義欄位' : 'Custom Fields', esg: isZh ? 'ESG 因子刻印' : 'Factor Engraving', potential: 'CORE', label: '#量子刻印', icon: Code },
  ];

  const phases = [
      { id: 1, title: '基礎架構刻印', progress: 100, status: 'DONE' },
      { id: 2, title: '數據提純進化', progress: 75, status: 'ACTIVE' },
      { id: 3, title: '智慧策略顯化', progress: 0, status: 'PENDING' },
      { id: 4, title: '生態資產變現', progress: 0, status: 'LOCKED' },
  ];

  const handleDeepSync = async () => {
    setIsSyncing(true);
    addToast('info', isZh ? '正在喚醒 Flowlu 連通符文...' : 'Awakening Flowlu Runes...', 'Nexus');
    
    try {
        const res = await runMcpAction('perform_flowlu_field_mapping', { module: 'CRM' }, language);
        if (res.success) {
            awardXp(500);
            addToast('success', isZh ? 'Flowlu 欄位對標成功！' : 'Flowlu field mapping complete!', 'System');
        }
    } catch (e) {
        addToast('error', 'Nexus connection timed out.', 'Error');
    } finally {
        setIsSyncing(false);
    }
  };

  const handleSimulateOcr = () => {
      setIsOcrProcessing(true);
      addToast('info', isZh ? '動作 05：啟動多模態 OCR 提純...' : 'Action 05: Multi-modal OCR purification...', 'Purifier');
      
      setTimeout(() => {
          setIsOcrProcessing(false);
          addToast('reward', isZh ? '電費單已轉化為碳資產並寫入 Flowlu！' : 'Utility bill transmuted to Carbon Asset & synced!', 'Alchemy');
          awardXp(200);
      }, 3000);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden pb-4">
        <UniversalPageHeader 
            icon={Network}
            title={{ zh: 'Flowlu × ESGss 集成指揮部', en: 'Flowlu Integration Command' }}
            description={{ zh: '永續數據的物理載體：Flowlu 全模塊 ESG 強化路徑', en: 'Physical Manifestation of ESG Data: Flowlu Enhancement Roadmap' }}
            language={language}
            tag={{ zh: '連通內核 v1.0', en: 'LINK_CORE_V1.0' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            
            {/* 1. 進化階段儀表板 (3/12) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-hidden">
                <div className="glass-bento p-6 bg-slate-950 border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col gap-8 shrink-0">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5" /> EVOLUTION_STAGES
                    </h3>
                    <div className="space-y-6">
                        {phases.map(p => (
                            <div key={p.id} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className={`text-[11px] font-bold ${p.status === 'ACTIVE' ? 'text-white' : 'text-gray-600'}`}>PHASE_0{p.id}: {p.title}</span>
                                    <span className="text-[8px] font-mono text-gray-700">{p.status}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${p.status === 'DONE' ? 'bg-emerald-500' : p.status === 'ACTIVE' ? 'bg-celestial-gold animate-pulse shadow-[0_0_10px_#fbbf24]' : 'bg-gray-800'}`} style={{ width: `${p.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-bento p-6 flex-1 bg-slate-900/60 border-celestial-gold/20 rounded-[2.5rem] shadow-xl flex flex-col justify-center items-center text-center gap-6">
                    <div className="p-4 bg-celestial-gold/10 rounded-full border border-celestial-gold/30">
                        <Flame className="w-10 h-10 text-celestial-gold animate-pulse" />
                    </div>
                    <div>
                        <h4 className="zh-main text-lg text-white">啟動動作 05 (OCR)</h4>
                        <p className="text-[10px] text-gray-500 mt-2 px-6">將非結構化單據(電費單/證照)<br/>自動提純並刻印至 Flowlu 欄位</p>
                    </div>
                    <button 
                        onClick={handleSimulateOcr}
                        disabled={isOcrProcessing}
                        className="w-full py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-celestial-gold transition-all active:scale-95 disabled:opacity-30 shadow-lg"
                    >
                        {isOcrProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : 'MANIFEST_DATA_SYNC'}
                    </button>
                </div>
            </div>

            {/* 2. 集成開發總表 (9/12) */}
            <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 glass-bento bg-slate-900/40 border-white/5 rounded-[3rem] p-8 shadow-2xl flex flex-col min-h-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-8 shrink-0 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-emerald-400">
                                <Globe className="w-6 h-6 animate-spin-slow" />
                            </div>
                            <h3 className="zh-main text-2xl text-white uppercase tracking-tighter">全維度集成開發矩陣</h3>
                        </div>
                        <button 
                            onClick={handleDeepSync}
                            disabled={isSyncing}
                            className="px-8 py-3 bg-emerald-500 text-black font-black rounded-xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 text-[10px] uppercase tracking-widest disabled:opacity-30"
                        >
                            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4" />}
                            START_DEEP_SYNC
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pr-2">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-black/40 text-[9px] uppercase font-black text-gray-500 tracking-widest sticky top-0 z-20 backdrop-blur-md">
                                <tr>
                                    <th className="p-5 pl-8">Module</th>
                                    <th className="p-5">Flowlu Function</th>
                                    <th className="p-5">ESG Enhancement</th>
                                    <th className="p-5">Potential</th>
                                    <th className="p-5 text-right pr-8">Label</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] divide-y divide-white/5">
                                {integrationTable.map((row) => (
                                    <tr key={row.id} className="hover:bg-white/[0.03] transition-all group">
                                        <td className="p-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-celestial-blue/20 group-hover:text-celestial-blue transition-all">
                                                    <row.icon className="w-4 h-4" />
                                                </div>
                                                <span className="zh-main text-white">{row.mod}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-gray-500">{row.flow}</td>
                                        <td className="p-5">
                                            <div className="zh-main text-gray-200 group-hover:text-celestial-gold transition-colors">{row.esg}</div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${row.potential === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                {row.potential}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right pr-8 font-black text-gray-600 group-hover:text-gray-300 transition-colors tracking-widest">{row.label}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 p-6 bg-black/40 rounded-[2rem] border border-white/10 flex items-center justify-between shrink-0 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live_Sync_Established</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-gray-700" />
                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Lat: 42ms</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-mono text-gray-700 uppercase">Authenticated: Flowlu_Cloud_Tenant_0xBF32</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const Library = (props: any) => <Database {...props} />;

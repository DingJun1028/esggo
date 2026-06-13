'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useESGAtoms } from '@/lib/supabase/hooks';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { useOmniAgentBus } from '@/lib/omni-agent-bus';
import { ESGSmartQA } from '@/components/ui/ESGSmartQA';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { Landmark, Plus, Download, ShieldCheck, Scale, FileSignature, ShieldAlert, Award, FileText, X, Terminal, Cpu, FileCheck, CheckCircle2 } from 'lucide-react';

// === Jules Karma Protocol: Performance Optimization with React.memo ===
const MetricCard = React.memo(({ title, value, unit, icon: Icon, trend, colorClass }: any) => (
  <OmniBaseCard variant="default" className="p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <Award size={14} /> {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wider">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-black text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{value}</span>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-500">{unit}</span>
    </div>
  </OmniBaseCard>
));
MetricCard.displayName = 'MetricCard';

// === CAP Modal Component ===
const SupplierCAPModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setLogs([]);
      setStep(0);
      return;
    }
    
    // Simulate generation sequence
    const sequence = [
      { t: 500, log: '[OmniAgent] 喚醒 Swarm Commander，初始化供應商數據...' },
      { t: 1500, log: '[Jules] 連接 5T 驗證引擎，掃描缺失矩陣...' },
      { t: 2500, log: '[OmniNexus] 擷取高風險供應商名單: 12 家未達標...' },
      { t: 3500, log: '[L-Hub] 根據 GRI/ISO 條款生成改善計畫 (CAP) 草案...' },
      { t: 4500, log: '[BUILD] 渲染 PDF 格式並寫入加密憑證...' },
      { t: 5500, log: '[SEAL] 5T Cryptographic Hash Lock: 0x9a8f... 完成！' },
    ];

    let timeouts: NodeJS.Timeout[] = [];
    sequence.forEach((item, index) => {
      timeouts.push(setTimeout(() => {
        setLogs(prev => [...prev, item.log]);
        setStep(index + 1);
      }, item.t));
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500"></div>
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 rounded-lg border border-cyan-500/30">
              <Cpu className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-wider">AI 供應商改善計畫生成</h3>
              <p className="text-xs text-slate-400 font-mono">OmniAgent Swarm Execution</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Progress Indicator */}
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-0.5 bg-cyan-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(step / sequenceLength) * 100}%` }}></div>
            
            {[1, 2, 3, 4].map(num => (
              <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${step >= (num * 1.5) ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                {step >= (num * 1.5) ? <CheckCircle2 size={16} /> : num}
              </div>
            ))}
          </div>

          {/* Terminal Logs */}
          <div className="bg-black border border-indigo-500/20 rounded-xl flex flex-col h-48 relative overflow-hidden">
            <div className="bg-indigo-950/40 px-4 py-2 border-b border-indigo-500/20 flex items-center gap-2">
              <Terminal size={14} className="text-indigo-400" />
              <span className="text-xs text-indigo-300 font-bold tracking-widest">SWARM CONSOLE</span>
            </div>
            <div className="p-4 font-mono text-xs text-slate-400 flex flex-col gap-2 overflow-y-auto flex-1">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-bottom-1">
                  <span className="text-indigo-500 shrink-0">{new Date().toISOString().split('T')[1].slice(0,8)}</span>
                  <span className={log.includes('[SUCCESS]') || log.includes('完成') ? 'text-emerald-400 font-bold' : log.includes('Omni') ? 'text-cyan-400' : 'text-slate-300'}>{log}</span>
                </div>
              ))}
              {step < 6 && (
                <div className="flex gap-2">
                  <span className="text-indigo-500 shrink-0">{new Date().toISOString().split('T')[1].slice(0,8)}</span>
                  <span className="text-indigo-400 animate-pulse">_</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            {step === 6 ? (
              <OmniButton variant="primary" icon={<FileCheck size={16}/>} onClick={onClose} className="!bg-emerald-600 hover:!bg-emerald-500 w-full md:w-auto shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                下載並分派 CAP (PDF)
              </OmniButton>
            ) : (
              <OmniButton variant="outline" disabled className="w-full md:w-auto opacity-50 cursor-not-allowed">
                生成中...
              </OmniButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const sequenceLength = 6;

// === Enterprise Health Check Modal (企業體檢終始矩陣) ===
const EnterpriseHealthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      return;
    }
    
    const runHealthCheck = async () => {
      setLoading(true);
      try {
        // Simulate sending matrix data
        const dummyMatrix = [
          { code: 'GRI-305', completeness: 65, isSealed: true },
          { code: 'GRI-401', completeness: 80, isSealed: false },
          { code: 'ISO-27001', completeness: 45, isSealed: true }
        ];
        
        const res = await fetch('/api/compliance/gap-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matrix: dummyMatrix, tenant_id: 'local-test-uuid' })
        });
        
        const data = await res.json();
        if (data.success) {
          setResult(data.data);
        } else {
          console.error("Health check failed:", data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    runHealthCheck();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-emerald-500/30 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"></div>
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950 rounded-lg border border-emerald-500/30 animate-pulse">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-wider">OmniCore 企業體檢報告</h3>
              <p className="text-xs text-slate-400 font-mono">5T Genesis-to-Terminal Matrix</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12 gap-4">
               <Cpu size={40} className="text-emerald-500 animate-pulse" />
               <p className="text-emerald-400 font-mono animate-pulse tracking-widest text-sm">OmniAgent 演算中 (Gap Analysis)...</p>
             </div>
          ) : result ? (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-emerald-400 font-bold mb-1">環境 (E)</p>
                    <p className="text-3xl font-black text-white">{result.score_e}</p>
                  </div>
                  <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-blue-400 font-bold mb-1">社會 (S)</p>
                    <p className="text-3xl font-black text-white">{result.score_s}</p>
                  </div>
                  <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-amber-400 font-bold mb-1">治理 (G)</p>
                    <p className="text-3xl font-black text-white">{result.score_g}</p>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><ShieldAlert size={16} className="text-red-400"/> 偵測到缺口 (Gaps)</h4>
                  <ul className="space-y-2">
                    {result.gaps?.map((gap: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-xs bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className={gap.severity === 'HIGH' ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400' : 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400'}>{gap.severity}</span>
                        <span className="text-slate-300 font-mono text-cyan-400">{gap.code}</span>
                        <span className="text-slate-400">{gap.issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2"><Terminal size={16}/> CAP 改善建議</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-mono">{result.advice}</p>
                </div>

                <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <ShieldCheck size={16}/> 
                    <span>5T 封印狀態: {result.status}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]" title={result.hash_lock}>
                    Hash: {result.hash_lock}
                  </div>
                </div>
             </div>
          ) : (
            <div className="text-center text-slate-500 py-8">無法取得體檢報告</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function GovernanceDashboard() {
  const [activeTab, setActiveTab] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapModalOpen, setIsCapModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const dispatchBus = useOmniAgentBus((state: any) => state.dispatch);
  const { data: dbAtoms, loading } = useESGAtoms('governance');

  const [localData, setLocalData] = useState([
    { id: 1, category: '董事會與高管', metric: '女性董事席次佔比', value: '40%', target: '30%', status: 'Sealed' },
    { id: 2, category: '商業道德', metric: '反貪腐政策培訓完成率', value: '100%', target: '100%', status: 'Sealed' },
    { id: 3, category: '資訊安全', metric: '5T 協議資料加密覆蓋率', value: '98.5%', target: '100%', status: 'Pending' },
    { id: 4, category: '風險管理', metric: '重大 ESG 風險鑑別完成度', value: '100%', target: '100%', status: 'Sealed' },
    { id: 5, category: '供應鏈治理', metric: '高風險供應商稽核率', value: '85%', target: '90%', status: 'Pending' },
  ]);

  const governanceData = useMemo(() => {
    if (!loading && dbAtoms && dbAtoms.length > 0) {
      return dbAtoms;
    }
    return localData;
  }, [dbAtoms, loading, localData]);

  const handleAddRecord = () => {
    const newRecord = {
      id: Date.now(),
      category: '風險管理',
      metric: `自動偵測：ISO 27001 內部稽核缺失項目數 (Q${Math.floor(Math.random() * 4) + 1})`,
      value: `${Math.floor(Math.random() * 3)} 項`,
      target: '0 項',
      status: 'Pending'
    };
    setLocalData([newRecord, ...localData]);
    dispatchBus('OBSERVE', 'GovernanceDashboard', '自動載入內部稽核缺失項目。');
  };

  const filteredData = useMemo(() => {
    return activeTab === 'All' ? governanceData : governanceData.filter(d => d.category === activeTab);
  }, [governanceData, activeTab]);

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-mono relative selection:bg-cyan-500/30 selection:text-white">
      {/* Liquid Glass Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_95%,rgba(245,158,11,0.015)_95%)] bg-[length:100%_40px] pointer-events-none" />
      </div>

      <div className="relative z-10 flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full font-sans">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Area */}
          <header className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center bg-amber-950/40 border border-amber-500/30 rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <Landmark className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-amber-950 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded">TCFD / SASB</span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Corporate Governance</span>
                  <span className="text-[10px] text-slate-500 font-bold ml-2 flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-400"/> 5T-VERIFIED</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mt-1" style={{ textShadow: '0 0 20px rgba(245,158,11,0.2)' }}>
                  公司治理與商業道德
                </h1>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto flex-wrap">
              <OmniButton variant="outline" icon={<ShieldCheck size={16}/>} onClick={() => setIsHealthModalOpen(true)} className="bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                一鍵企業體檢
              </OmniButton>
              <OmniButton variant="outline" icon={<Download size={16}/>} onClick={handleExport} isLoading={isProcessing} className="bg-black/50 border-white/10 hover:bg-white/5 text-slate-200">
                匯出治理報告
              </OmniButton>
              <OmniButton variant="primary" icon={<Plus size={16}/>} className="!bg-amber-600 hover:!bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]" onClick={handleAddRecord}>
                自動載入紀錄
              </OmniButton>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard 
              title="ESG 治理評級 (Score)" 
              value="A+" 
              unit="等級" 
              icon={Award} 
              trend="維持頂級" 
              colorClass="bg-amber-500/20 text-amber-400 border border-amber-500/30"
            />
            <MetricCard 
              title="董事會獨立董事佔比" 
              value="60" 
              unit="%" 
              icon={Scale} 
              colorClass="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            />
            <MetricCard 
              title="反貪腐培訓完成率" 
              value="100" 
              unit="%" 
              icon={FileSignature} 
              colorClass="bg-blue-500/20 text-blue-400 border border-blue-500/30"
            />
            <MetricCard 
              title="5T 協議稽核涵蓋率" 
              value="98.5" 
              unit="%" 
              icon={ShieldAlert} 
              colorClass="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
            />
          </div>

          {/* Main Workspace Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OmniBaseCard variant="default" className="p-0 overflow-hidden bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <h2 className="text-lg font-bold text-slate-100 tracking-wider">治理核心指標清冊</h2>
                  </div>
                  <div className="flex flex-wrap gap-1 bg-black/50 border border-white/5 rounded-lg p-1">
                    {['All', '董事會與高管', '商業道德', '資訊安全', '風險管理'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      <tr>
                        <th className="px-6 py-4">治理面向</th>
                        <th className="px-6 py-4">指標描述</th>
                        <th className="px-6 py-4 text-right">當前表現</th>
                        <th className="px-6 py-4 text-right">法規/內部目標</th>
                        <th className="px-6 py-4 text-center">5T 狀態</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                      {filteredData.map(row => (
                        <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4 text-xs font-bold text-slate-300">{row.category}</td>
                          <td className="px-6 py-4 text-sm text-slate-200">{row.metric}</td>
                          <td className="px-6 py-4 text-sm font-black text-cyan-400 text-right font-mono group-hover:scale-110 transition-transform origin-right">{row.value}</td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-mono text-right">{row.target}</td>
                          <td className="px-6 py-4 flex justify-center">
                            {row.status === 'Sealed' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                                <ShieldCheck size={12}/> 已封印
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950/40 text-amber-400 border border-amber-500/30 animate-pulse">
                                <FileText size={12}/> 待簽核
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </OmniBaseCard>
            </div>
            
            <div className="space-y-6">
              {/* Dynamic Risk Radar / Warning Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <OmniBaseCard variant="default" className="relative p-6 bg-black/60 backdrop-blur-xl border border-red-500/30 shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldAlert size={100} className="text-red-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-red-950 border border-red-500/30 rounded-lg animate-pulse">
                        <ShieldAlert className="text-red-400" size={20} />
                      </div>
                      <h3 className="font-bold text-lg text-white tracking-widest">OmniAgent 風險預警</h3>
                    </div>
                    <div className="space-y-4 text-sm text-slate-300">
                      <p className="leading-relaxed">
                        偵測到 <strong className="text-red-400 font-bold px-1 bg-red-500/10 rounded">高風險供應商稽核率 (85%)</strong> 低於年度目標設定 (90%)。5T Trackable 協定判定存在斷鏈風險。
                      </p>
                      <div className="p-4 bg-red-950/30 rounded-xl border border-red-500/20 backdrop-blur-sm mt-4">
                        <h4 className="font-bold text-red-200 mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
                          <Cpu size={14}/> 自動化建議行動
                        </h4>
                        <ul className="list-none space-y-3 text-xs">
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></div>
                            <span className="text-slate-300">啟動 OmniAgent 供應商自動化追查程序。</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></div>
                            <span className="text-slate-300">發送合規聲明書至未稽核廠商，並套用 ZKP 簽章。</span>
                          </li>
                        </ul>
                      </div>
                      <OmniButton 
                        variant="primary" 
                        onClick={() => {
                          setIsCapModalOpen(true);
                          dispatchBus('ACTION', 'GovernanceDashboard', '啟動供應商改善計畫生成');
                        }}
                        className="w-full mt-6 !bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] border-none text-white font-bold tracking-widest text-xs py-3"
                      >
                        生成供應商改善計畫 (CAP)
                      </OmniButton>
                    </div>
                  </div>
                </OmniBaseCard>
              </div>
              
              <div className="pt-2 opacity-90 hover:opacity-100 transition-opacity">
                <ESGSmartQA />
              </div>
            </div>
          </div>

        </div>
      </div>

      <SupplierCAPModal isOpen={isCapModalOpen} onClose={() => setIsCapModalOpen(false)} />
      <EnterpriseHealthModal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} />
    </div>
  );
}

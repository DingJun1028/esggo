'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Search, AlertTriangle, CheckCircle, Star, Plus, X, 
  ShieldCheck, TrendingDown, Globe, MoreHorizontal, ArrowUpRight, 
  CheckCircle2, AlertCircle, MapPin, Network, Zap, Shield, Database, Lock,
  FileSearch, UserCheck, Brain, Cpu, Eye, Activity, RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  BrandTable, BrandTabs, 
  BrandStatusDot, BrandProgress, StandardPage 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { supplierIntegrityEngine, SupplierVerificationResult } from '../../lib/supplier-integrity-engine';
import { cn } from '../../lib/utils';
import { fadeIn, slideIn } from '../../lib/animations';

interface Supplier {
  id: string;
  name: string;
  country: string;
  industry: string;
  riskLevel: 'low' | 'medium' | 'high';
  pledgeSigned: boolean;
  lastAudit: string;
  aiConfidence: number; // AI+OCR Confidence Score
  rbaStatus: 'VAP_Validated' | 'Self_Assessment' | 'Pending';
  verification?: SupplierVerificationResult;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S1', name: 'NVIDIA (Taiwan) AI Green Ops', country: '美國/台灣', industry: 'AI 半導體', riskLevel: 'low', pledgeSigned: true, lastAudit: '2024-05-10', aiConfidence: 98, rbaStatus: 'VAP_Validated' },
  { id: 'S2', name: '日月光投控 (ASE Group)', country: '台灣', industry: '半導體封測', riskLevel: 'low', pledgeSigned: true, lastAudit: '2024-04-15', aiConfidence: 96, rbaStatus: 'VAP_Validated' },
  { id: 'S3', name: '群光電子 (Chicony) 原料鏈', country: '台灣', industry: '電子零組件', riskLevel: 'medium', pledgeSigned: true, lastAudit: '2024-03-22', aiConfidence: 72, rbaStatus: 'Self_Assessment' },
  { id: 'S4', name: '聯發科技 (MediaTek)', country: '台灣', industry: 'IC 設計', riskLevel: 'low', pledgeSigned: true, lastAudit: '2024-05-02', aiConfidence: 95, rbaStatus: 'VAP_Validated' },
  { id: 'S5', name: '太古可口可樂 (Swire Coca-Cola)', country: '香港/台灣', industry: '食品物流', riskLevel: 'medium', pledgeSigned: true, lastAudit: '2023-12-18', aiConfidence: 84, rbaStatus: 'Self_Assessment' },
  { id: 'S6', name: '奇美食品 (Chimei Food)', country: '台灣', industry: '食品製造', riskLevel: 'high', pledgeSigned: false, lastAudit: '2023-11-25', aiConfidence: 45, rbaStatus: 'Pending' },
];

const RISK_META = {
  low:    { label: '低風險', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  medium: { label: '中等',   color: '#FDB515', bg: 'rgba(253, 181, 21, 0.1)' },
  high:   { label: '高風險', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function SupplyChainPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate receiving a 5T attestation from supplier
    const mockAttestation: any = {
      masterSeal: id === 'S3' || id === 'S6' ? 'BROKEN_SEAL' : 'VALID_SEAL',
      t1_traceable: { hash: 'h1' },
      t4_trustworthy: { hash: 'h4' },
      t5_trackable: { chainBlock: { hash: '00_hash' } }
    };
    
    // Use engine to verify
    const result = await supplierIntegrityEngine.verifySupplierAttestation(id, mockAttestation);
    
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, verification: result, aiConfidence: result.isVerified ? 99 : 30 } : s));
    setVerifyingId(null);
  };

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.country.includes(search) || s.industry.includes(search);
    const matchRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const verifiedCount = suppliers.filter(s => s.verification?.isVerified).length;
  const aggregateScore = supplierIntegrityEngine.getAggregateSupplyScore(
    suppliers.map(s => s.verification).filter(Boolean) as any
  );

  const pageConfig: UniversalPageConfig = {
    id: 'supply-chain',
    title: '永續數據 AI 稽核控制台 (Chicony 專場)',
    subtitle: 'RBA 合規 · AI+OCR 自動審核 · 遠距第三方查驗環境。',
    icon: <Cpu size={32} />,
    griReference: 'RBA v8.0 / GRI 308',
    activeT5Tags: ['T1', 'T4', 'T5'],
    primaryActions: [
      { id: 'ocr-scan', label: 'AI 大量掃描', icon: <Brain size={16}/>, onClick: () => alert('正在啟動 OCR 模型進行供應商憑證掃描...') },
      { id: 'request', label: '要求 5T 憑證', icon: <Lock size={16}/>, onClick: () => alert('要求已送出...') }
    ],
    kpis: [
      { key: 'total', label: '供應商總數', value: suppliers.length, icon: <Globe size={18}/>, color: '#003262' },
      { key: 'ai-audit', label: 'AI 自動核對率', value: '82%', icon: <Brain size={18}/>, color: '#8B5CF6', verified: true },
      { key: 'score', label: 'RBA 鏈結分數', value: aggregateScore || 76, unit: 'pts', icon: <Zap size={18}/>, color: '#FDB515', verified: true },
      { key: 'sampling', label: '待人工複核', value: suppliers.filter(s => s.aiConfidence < 80).length, icon: <UserCheck size={18}/>, color: '#EF4444' },
    ],
    sections: [
      {
        id: 'topology',
        title: '供應鏈誠信拓撲與 AI 風險地圖',
        columns: 12,
        component: (
          <div className="bg-slate-900 rounded-[32px] border border-white/10 shadow-2xl h-80 relative overflow-hidden flex items-center justify-center group">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
             
             <div className="relative z-10 flex gap-20 items-center">
                <motion.div 
                  className="w-24 h-24 rounded-full bg-[#003262] shadow-[0_0_60px_rgba(0,50,98,0.7)] flex flex-col items-center justify-center border-2 border-white/20 backdrop-blur-md"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                   <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1 text-center leading-none">Chicony<br/>Controller</span>
                   <Shield size={40} className="text-[#FDB515]" />
                </motion.div>
                
                <div className="grid grid-cols-3 gap-8">
                   {suppliers.map((s, i) => (
                     <motion.div 
                       key={s.id}
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.1 }}
                       className="relative group/node"
                     >
                        <div className={cn(
                          "w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500",
                          s.aiConfidence > 90 ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : 
                          s.aiConfidence > 70 ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : 
                          "bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        )}>
                           <Database size={20} />
                           <span className="text-[7px] font-black mt-0.5">{s.aiConfidence}%</span>
                        </div>
                        <p className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-white/30 uppercase tracking-[0.2em] group-hover/node:text-white/60 transition-colors">{s.id}</p>
                     </motion.div>
                   ))}
                </div>
             </div>
             
             <div className="absolute top-6 right-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-[10px] font-black text-[#FDB515] uppercase tracking-widest mb-1">AI 異常偵測模式</p>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[8px] font-bold text-white/60 uppercase">Normal</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[8px] font-bold text-white/60 uppercase">High Risk</span>
                   </div>
                </div>
             </div>
          </div>
        )
      },
      {
        id: 'rba-list',
        title: '供應商 RBA 合規審核清單',
        subtitle: 'AI-First Screening + Human Sampling Queue',
        columns: 12,
        component: (
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden">
             <BrandTable 
               columns={[
                 { label: '供應商 & RBA 狀態', key: 'name' },
                 { label: 'AI 信心度 (OCR)', key: 'ai' },
                 { label: '風險分級', key: 'risk' },
                 { label: '5T 驗證狀態', key: 'status' },
                 { label: '稽核操作', key: 'actions' },
               ]}
               data={filtered.map(s => ({
                 name: (
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#003262]/5 flex items-center justify-center text-[#003262]">
                        <Truck size={18}/>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#003262] text-sm">{s.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <Badge variant="draft" className="text-[8px] h-4 px-1.5 bg-slate-50 border-slate-200">{s.rbaStatus.replace('_', ' ')}</Badge>
                           <span className="text-[9px] text-slate-400 font-bold uppercase">{s.country}</span>
                        </div>
                      </div>
                   </div>
                 ),
                 ai: (
                   <div className="flex flex-col gap-1.5 w-32">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-400">OCR Confidence</span>
                        <span className={cn("font-mono font-black", s.aiConfidence > 80 ? "text-emerald-600" : "text-amber-600")}>{s.aiConfidence}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                         <motion.div 
                          className="h-full rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.aiConfidence}%` }}
                          style={{ backgroundColor: s.aiConfidence >= 80 ? '#10B981' : s.aiConfidence >= 50 ? '#FDB515' : '#EF4444' }} 
                         />
                      </div>
                   </div>
                 ),
                 risk: (
                    <Badge 
                      variant={s.riskLevel === 'low' ? 'verified' : s.riskLevel === 'medium' ? 'warning' : 'error'}
                      className="text-[10px] font-black uppercase tracking-widest px-3"
                    >
                      {RISK_META[s.riskLevel].label}
                    </Badge>
                 ),
                 status: (
                   <div className="flex items-center gap-2">
                      {s.verification ? (
                        s.verification.isVerified ? (
                          <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-tighter">
                             <ShieldCheck size={12}/> SEALED
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-500 font-black text-[10px] uppercase tracking-tighter">
                             <AlertTriangle size={12}/> CORRUPTED
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-1 text-slate-300 font-black text-[10px] uppercase tracking-tighter">
                           <RefreshCw size={12}/> PENDING_SYNC
                        </div>
                      )}
                   </div>
                 ),
                 actions: (
                   <div className="flex gap-2">
                      <Button 
                        variant={s.aiConfidence < 80 ? "primary" : "glass"} 
                        size="sm" 
                        className={cn("h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest", s.aiConfidence < 80 && "shadow-lg shadow-blue-500/20")}
                        onClick={() => handleVerify(s.id)}
                        loading={verifyingId === s.id}
                      >
                         {s.aiConfidence < 80 ? '人工複核' : '重新校驗'}
                      </Button>
                      <Button variant="glass" size="sm" className="w-9 h-9 p-0 rounded-xl" onClick={() => setSelected(s)}>
                        <FileSearch size={16}/>
                      </Button>
                   </div>
                 )
               }))}
             />
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      
      {/* Detail Modal: AI Audit Evidence */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#003262]/40 backdrop-blur-xl" 
              onClick={() => setSelected(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white/95 backdrop-blur-2xl rounded-[48px] border border-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] p-12 max-w-3xl w-full"
            >
              <header className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[32px] bg-[#003262] text-white flex items-center justify-center shadow-2xl shadow-[#003262]/30">
                      <Brain size={40}/>
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-[#003262] tracking-tight">{selected.name}</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">AI-Driven Evidence Verification · RBA v8.0</p>
                    </div>
                 </div>
                 <Button variant="glass" size="sm" className="w-12 h-12 p-0 rounded-full" onClick={() => setSelected(null)}>
                  <X size={24}/>
                 </Button>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Left: OCR Preview */}
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Eye size={12}/> OCR Vision Analysis
                    </h4>
                    <div className="aspect-[3/4] bg-slate-100 rounded-[32px] border-2 border-dashed border-slate-200 relative overflow-hidden flex items-center justify-center">
                       {/* Mock Bounding Boxes */}
                       <div className="absolute inset-0 p-8">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                            className="absolute top-10 left-10 w-32 h-6 border border-emerald-500 bg-emerald-500/10 rounded flex items-center justify-end"
                          >
                             <span className="text-[6px] font-black text-emerald-600 px-1 uppercase tracking-tighter">99.2% MATCH</span>
                          </motion.div>
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
                            className="absolute top-20 left-10 w-48 h-10 border border-blue-500 bg-blue-500/10 rounded flex items-center justify-end"
                          >
                             <span className="text-[6px] font-black text-blue-600 px-1 uppercase tracking-tighter">OCR_ID: RBA_VAP_CERT</span>
                          </motion.div>
                          {selected.aiConfidence < 80 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
                              className="absolute bottom-20 left-10 w-40 h-8 border border-red-500 bg-red-500/10 rounded flex items-center justify-end"
                            >
                               <span className="text-[6px] font-black text-red-600 px-1 uppercase tracking-tighter">LOW_CONFIDENCE: 42%</span>
                            </motion.div>
                          )}
                       </div>
                       <FileSearch size={48} className="text-slate-300" />
                       <p className="absolute bottom-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">RBA_Sustainability_Report.pdf</p>
                    </div>
                 </div>

                 {/* Right: Integrity Matrix */}
                 <div className="space-y-8">
                    <Card className="p-8 bg-slate-50/50 border-slate-100 rounded-[32px]">
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6">AI Audit Results</h4>
                       <div className="space-y-6">
                          {[
                            { label: '文字真偽校對', value: selected.aiConfidence > 80 ? 'PASSED' : 'FLAGGED', score: selected.aiConfidence },
                            { label: '印章與簽名檢測', value: 'VERIFIED', score: 94 },
                            { label: 'GRI/RBA 格式對齊', value: 'SYNCHRONIZED', score: 88 },
                          ].map(check => (
                            <div key={check.label} className="space-y-2">
                               <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-slate-600">{check.label}</span>
                                  <span className={cn("text-[10px] font-black tracking-widest", check.value === 'FLAGGED' ? "text-red-500" : "text-emerald-500")}>{check.value}</span>
                               </div>
                               <div className="h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                                  <motion.div 
                                    className="h-full rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${check.score}%` }}
                                    style={{ backgroundColor: check.score >= 80 ? '#10B981' : check.score >= 50 ? '#FDB515' : '#EF4444' }}
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                    </Card>

                    {selected.aiConfidence < 80 ? (
                      <Card className="p-6 bg-red-50/80 backdrop-blur-md rounded-[24px] border border-red-100">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                               <AlertTriangle size={20} />
                            </div>
                            <div className="space-y-1">
                               <p className="text-sm font-bold text-red-900">建議人工抽樣稽核</p>
                               <p className="text-[10px] text-red-700 leading-relaxed">
                                AI 模型偵測到憑證影像品質不佳或標準欄位不匹配。為確保 RBA v8.0 合規性，建議審核人員啟動「遠距查證 (Remote Verification)」。
                               </p>
                            </div>
                         </div>
                      </Card>
                    ) : (
                      <Card className="p-6 bg-emerald-50/80 backdrop-blur-md rounded-[24px] border border-emerald-100 text-center">
                         <div className="flex flex-col items-center gap-2">
                            <ShieldCheck size={32} className="text-emerald-500" />
                            <p className="text-sm font-bold text-emerald-900">AI 自動核對通過</p>
                            <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-black">Ready for 5T Sealing</p>
                         </div>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                       <Button variant="glass" fullWidth size="lg" className="rounded-2xl h-14 font-black flex items-center justify-center gap-3">
                          <Activity size={18} />
                          <span>進入遠距查證環境 (Remote Audit)</span>
                       </Button>
                    </div>
                 </div>
              </div>

              <footer className="mt-12 flex gap-4">
                 <Button variant="glass" fullWidth size="lg" className="rounded-[24px] h-16 text-lg font-bold" onClick={() => setSelected(null)}>
                  暫存並退出
                 </Button>
                 <Button variant="primary" fullWidth size="lg" className="rounded-[24px] h-16 text-lg font-bold shadow-2xl shadow-[#003262]/20" onClick={() => setSelected(null)}>
                  核准並封印 5T 憑證
                 </Button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

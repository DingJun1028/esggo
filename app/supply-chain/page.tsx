'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Search, AlertTriangle, CheckCircle, Star, Plus, X, 
  ShieldCheck, TrendingDown, Globe, MoreHorizontal, ArrowUpRight, 
  CheckCircle2, AlertCircle, MapPin, Network, Zap, Shield, Database, Lock
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
  verification?: SupplierVerificationResult;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S1', name: '台積電供應鏈 TSM-A', country: '台灣', industry: '半導體', riskLevel: 'low', pledgeSigned: true, lastAudit: '2024-03-15' },
  { id: 'S2', name: '鴻海精密工業', country: '台灣', industry: '電子製造', riskLevel: 'low', pledgeSigned: true, lastAudit: '2024-02-20' },
  { id: 'S3', name: 'ABC 原料供應商', country: '中國', industry: '化工原料', riskLevel: 'high', pledgeSigned: false, lastAudit: '2023-11-10' },
  { id: 'S4', name: 'EcoTech Materials', country: '德國', industry: '綠色材料', riskLevel: 'low', pledgeSigned: true, lastAudit: '2024-04-01' },
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
      masterSeal: id === 'S3' ? 'BROKEN_SEAL' : 'VALID_SEAL',
      t1_traceable: { hash: 'h1' },
      t4_trustworthy: { hash: 'h4' },
      t5_trackable: { chainBlock: { hash: '00_hash' } }
    };
    
    // Use engine to verify
    const result = await supplierIntegrityEngine.verifySupplierAttestation(id, mockAttestation);
    
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, verification: result } : s));
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
    title: '供應鏈誠信 Supply Chain 5T',
    subtitle: 'Cascading Integrity · Scope 3 實證 · 跨境治理：將 5T 誠信協議延伸至全球供應鏈。',
    icon: <Truck size={32} />,
    griReference: 'GRI 308, 414',
    activeT5Tags: ['T1', 'T2', 'T4', 'T5'],
    primaryActions: [
      { id: 'request', label: '要求 5T 憑證', icon: <Lock size={16}/>, onClick: () => alert('要求已送出...') }
    ],
    kpis: [
      { key: 'total', label: '供應商總數', value: suppliers.length, icon: <Globe size={18}/>, color: '#003262' },
      { key: 'verified', label: '5T 驗證率', value: `${Math.round(verifiedCount / suppliers.length * 100)}%`, icon: <ShieldCheck size={18}/>, color: '#10B981', verified: true },
      { key: 'score', label: '鏈結誠信分數', value: aggregateScore, unit: 'pts', icon: <Zap size={18}/>, color: '#8B5CF6', verified: true },
      { key: 'high', label: '高風險家數', value: suppliers.filter(s => s.riskLevel === 'high').length, icon: <AlertTriangle size={18}/>, color: '#EF4444' },
    ],
    sections: [
      {
        id: 'map',
        title: '全球誠信拓撲圖',
        columns: 12,
        component: (
          <div className="bg-slate-900 rounded-[32px] border border-white/10 shadow-2xl h-72 relative overflow-hidden flex items-center justify-center group">
             {/* Dynamic background */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
             <motion.div 
               className="absolute inset-0 bg-gradient-to-tr from-[#003262]/40 to-transparent"
               animate={{ opacity: [0.2, 0.4, 0.2] }}
               transition={{ duration: 5, repeat: Infinity }}
             />

             <div className="relative z-10 flex gap-16 items-center">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-[#003262] shadow-[0_0_50px_rgba(0,50,98,0.6)] flex items-center justify-center border-2 border-white/20 backdrop-blur-md"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                   <Shield size={40} className="text-[#FDB515]" />
                </motion.div>
                
                <div className="flex gap-6">
                   {suppliers.map((s, i) => (
                     <motion.div 
                       key={s.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.15 }}
                       className="relative"
                     >
                        <div className="w-px h-16 bg-gradient-to-t from-white/20 to-transparent absolute -top-16 left-1/2" />
                        <div className={cn(
                          "w-12 h-12 rounded-2xl border-2 flex items-center justify-center bg-slate-800/80 backdrop-blur-md transition-all duration-500",
                          s.verification?.isVerified ? "border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : 
                          s.verification ? "border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "border-slate-600 text-slate-500"
                        )}>
                           <Database size={20} />
                        </div>
                        <p className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{s.id}</p>
                     </motion.div>
                   ))}
                </div>
             </div>
             <div className="absolute bottom-6 left-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Integrity Mesh Active</p>
             </div>
          </div>
        )
      },
      {
        id: 'table',
        title: '供應商誠信清單',
        columns: 12,
        component: (
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden">
             <BrandTable 
               columns={[
                 { label: '供應商名稱', key: 'name' },
                 { label: '地區 / 產業', key: 'info' },
                 { label: '5T 驗證狀態', key: 'status' },
                 { label: '誠信分數', key: 'score' },
                 { label: '操作', key: 'actions' },
               ]}
               data={filtered.map(s => ({
                 name: (
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#003262]/5 flex items-center justify-center text-[#003262]">
                        <Truck size={18}/>
                      </div>
                      <span className="font-bold text-[#003262]">{s.name}</span>
                   </div>
                 ),
                 info: (
                   <div className="flex items-center gap-2">
                      <Badge variant="draft" className="bg-slate-100/50 text-slate-500 border-slate-200">{s.country}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.industry}</span>
                   </div>
                 ),
                 status: (
                   <div className="flex items-center gap-2">
                      {s.verification ? (
                        s.verification.isVerified ? (
                          <Badge variant="verified">SEALED</Badge>
                        ) : (
                          <Badge variant="error">INVALID</Badge>
                        )
                      ) : (
                        <Badge variant="draft">UNVERIFIED</Badge>
                      )}
                   </div>
                 ),
                 score: (
                   <div className="flex items-center gap-4 w-32">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                         <motion.div 
                          className="h-full rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.verification?.score || 0}%` }}
                          style={{ backgroundColor: (s.verification?.score || 0) >= 80 ? '#10B981' : '#EF4444' }} 
                         />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700">{s.verification?.score || '--'}</span>
                   </div>
                 ),
                 actions: (
                   <div className="flex gap-2">
                      <Button 
                        variant={s.verification ? "glass" : "primary"} 
                        size="sm" 
                        className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                        onClick={() => handleVerify(s.id)}
                        isLoading={verifyingId === s.id}
                        disabled={!!s.verification}
                      >
                         {s.verification ? 'Re-Verify' : 'Verify_5T'}
                      </Button>
                      <Button variant="glass" size="sm" className="w-9 h-9 p-0 rounded-xl" onClick={() => setSelected(s)}>
                        <MoreHorizontal size={16}/>
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
      
      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#003262]/40 backdrop-blur-xl" 
              onClick={() => setSelected(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white/90 backdrop-blur-2xl rounded-[48px] border border-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] p-12 max-w-2xl w-full"
            >
              <header className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[24px] bg-[#003262] text-white flex items-center justify-center shadow-xl shadow-[#003262]/20">
                      <Truck size={32}/>
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-[#003262] tracking-tight">{selected.name}</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">{selected.country} · {selected.industry}</p>
                    </div>
                 </div>
                 <Button variant="glass" size="sm" className="w-12 h-12 p-0 rounded-full" onClick={() => setSelected(null)}>
                  <X size={24}/>
                 </Button>
              </header>

              <div className="space-y-8">
                 <Card className="p-8 bg-slate-50/50 border-slate-100 rounded-[32px]">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6">5T Integrity Evidence Matrix</h4>
                    {selected.verification ? (
                      <div className="grid grid-cols-5 gap-4">
                         {Object.entries(selected.verification.integrityMatrix).map(([gate, passed]) => (
                           <div key={gate} className="text-center space-y-3">
                              <p className="text-[9px] font-bold text-[#003262]/40 uppercase tracking-widest">{gate}</p>
                              <div className={cn(
                                "h-2 rounded-full shadow-inner", 
                                passed ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                              )} />
                              <Badge variant={passed ? 'verified' : 'error'} className="text-[8px] px-1.5 py-0 h-4">
                                {passed ? 'PASS' : 'FAIL'}
                              </Badge>
                           </div>
                         ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-[24px] bg-white/40">
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">No 5T Payload Received</p>
                      </div>
                    )}
                 </Card>

                 {selected.verification && !selected.verification.isVerified && (
                   <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-5 bg-red-50/80 backdrop-blur-md rounded-[24px] border border-red-100 flex items-start gap-4 shadow-lg shadow-red-500/5"
                   >
                      <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-sm font-bold text-red-900">5T 封印破損 (Seal Broken)</p>
                         <p className="text-xs text-red-700 leading-relaxed">
                          偵測到數據指紋不匹配。此供應商報告的 Scope 3 數據可能存在非授權篡改，或憑證來源 (T1) 無法驗證。
                         </p>
                      </div>
                   </motion.div>
                 )}

                 <div className="grid grid-cols-2 gap-6">
                    <Card className="p-6 bg-slate-50/50 border-slate-100 rounded-[24px] flex flex-col justify-center items-center text-center">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">風險分級 Risk Level</p>
                       <Badge 
                        variant={selected.riskLevel === 'low' ? 'verified' : selected.riskLevel === 'medium' ? 'warning' : 'error'}
                        className="text-sm px-6 py-1.5 h-auto rounded-full shadow-sm"
                       >
                        {RISK_META[selected.riskLevel].label}
                       </Badge>
                    </Card>
                    <Card className="p-6 bg-slate-50/50 border-slate-100 rounded-[24px] flex flex-col justify-center items-center text-center">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Last Audit Date</p>
                       <span className="text-xl font-bold text-[#003262] font-mono tracking-tight">{selected.lastAudit}</span>
                    </Card>
                 </div>
              </div>

              <footer className="mt-12">
                 <Button variant="primary" fullWidth size="lg" className="rounded-[24px] h-16 text-lg font-bold shadow-2xl shadow-[#003262]/20" onClick={() => setSelected(null)}>
                  關閉詳情並返回中心
                 </Button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

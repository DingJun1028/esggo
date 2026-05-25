'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Search, AlertTriangle, CheckCircle, Star, Plus, X, 
  ShieldCheck, TrendingDown, Globe, MoreHorizontal, ArrowUpRight, 
  CheckCircle2, AlertCircle, MapPin, Network, Zap, Shield, Database, Lock
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, 
  BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { supplierIntegrityEngine, SupplierVerificationResult } from '../../lib/supplier-integrity-engine';
import { cn } from '../../lib/utils';

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
          <BrandCard padding="none" className="bg-slate-900 border-none shadow-premium h-64 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             <div className="relative z-10 flex gap-12 items-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.6)] flex items-center justify-center border-2 border-white">
                   <Shield size={32} className="text-white" />
                </div>
                <div className="flex gap-4">
                   {suppliers.map((s, i) => (
                     <motion.div 
                       key={s.id}
                       initial={{ opacity: 0, scale: 0 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.1 }}
                       className="relative"
                     >
                        <div className="w-px h-12 bg-white/20 absolute -top-12 left-1/2" />
                        <div className={cn(
                          "w-10 h-10 rounded-xl border-2 flex items-center justify-center bg-slate-800",
                          s.verification?.isVerified ? "border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : 
                          s.verification ? "border-red-500 text-red-500" : "border-slate-600 text-slate-500"
                        )}>
                           <Database size={18} />
                        </div>
                        <p className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-white/40 uppercase tracking-widest">{s.id}</p>
                     </motion.div>
                   ))}
                </div>
             </div>
             <p className="absolute bottom-4 left-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Integrity Mesh Network v1.0</p>
          </BrandCard>
        )
      },
      {
        id: 'table',
        title: '供應商誠信清單',
        columns: 12,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
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
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-berkeley-blue"><Truck size={14}/></div>
                      <span className="font-black text-berkeley-blue">{s.name}</span>
                   </div>
                 ),
                 info: (
                   <div className="flex items-center gap-2">
                      <BrandBadge variant="outline" size="xs" className="opacity-60">{s.country}</BrandBadge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{s.industry}</span>
                   </div>
                 ),
                 status: (
                   <div className="flex items-center gap-2">
                      {s.verification ? (
                        s.verification.isVerified ? (
                          <BrandBadge variant="success" size="xs">SEALED</BrandBadge>
                        ) : (
                          <BrandBadge variant="error" size="xs">INVALID</BrandBadge>
                        )
                      ) : (
                        <BrandBadge variant="default" size="xs">UNVERIFIED</BrandBadge>
                      )}
                   </div>
                 ),
                 score: (
                   <div className="flex items-center gap-3 w-24">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.verification?.score || 0}%`, backgroundColor: (s.verification?.score || 0) >= 80 ? '#10B981' : '#EF4444' }} />
                      </div>
                      <span className="font-mono text-[10px] font-black">{s.verification?.score || '--'}</span>
                   </div>
                 ),
                 actions: (
                   <div className="flex gap-2">
                      <BrandButton 
                        variant="primary" size="xs" className="h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest"
                        onClick={() => handleVerify(s.id)}
                        loading={verifyingId === s.id}
                        disabled={!!s.verification}
                      >
                         {s.verification ? 'Re-Verify' : 'Verify_5T'}
                      </BrandButton>
                      <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => setSelected(s)}><MoreHorizontal size={14}/></BrandButton>
                   </div>
                 )
               }))}
             />
          </BrandCard>
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
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setSelected(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[40px] border border-white shadow-extreme p-10 max-w-xl w-full"
            >
              <header className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-berkeley-blue"><Truck size={24}/></div>
                    <div>
                       <h3 className="text-xl font-black text-berkeley-blue">{selected.name}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selected.country} · {selected.industry}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelected(null)} className="text-slate-300 hover:text-slate-600 transition-colors"><X size={24}/></button>
              </header>

              <div className="space-y-6">
                 <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">5T Integrity Evidence</h4>
                    {selected.verification ? (
                      <div className="grid grid-cols-5 gap-2">
                         {Object.entries(selected.verification.integrityMatrix).map(([gate, passed]) => (
                           <div key={gate} className="text-center space-y-2">
                              <p className="text-[8px] font-black text-berkeley-blue/40 uppercase">{gate}</p>
                              <div className={cn("w-full h-1.5 rounded-full", passed ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                           </div>
                         ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No 5T Payload Received</p>
                      </div>
                    )}
                 </div>

                 {selected.verification && !selected.verification.isVerified && (
                   <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                      <AlertTriangle size={20} className="text-red-600 mt-1" />
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-red-800">5T 封印破損 (Seal Broken)</p>
                         <p className="text-[10px] text-red-600">偵測到數據指紋不匹配。此供應商報告的 Scope 3 數據可能存在非授權篡改，或憑證來源 (T1) 無法驗證。</p>
                      </div>
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">風險分級</p>
                       <BrandBadge variant="outline" size="xs" style={{ color: RISK_META[selected.riskLevel].color, backgroundColor: RISK_META[selected.riskLevel].bg, borderColor: 'transparent' }}>{RISK_META[selected.riskLevel].label}</BrandBadge>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Last Audit</p>
                       <span className="text-xs font-bold text-berkeley-blue font-mono">{selected.lastAudit}</span>
                    </div>
                 </div>
              </div>

              <footer className="mt-10">
                 <BrandButton variant="primary" fullWidth className="rounded-2xl h-14 font-black shadow-xl" onClick={() => setSelected(null)}>關閉詳情</BrandButton>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

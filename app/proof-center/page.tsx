'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Shield, Hash, Lock, CheckCircle, XCircle, Loader, ChevronDown,
  ChevronUp, Copy, AlertTriangle, Zap, Link, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Database, Fingerprint
} from 'lucide-react';
import {
  sha256, sha512, hmacSHA256, createHashLock, verifyHashLock,
  createZKPCommitment, verifyZKPProof, create5TAttestation, mineBlock,
  type HashLockResult, type ZKPCommitment, type ZKPVerifyResult,
  type T5Attestation
} from '../../lib/crypto-proof';
import { BrandBadge, BrandButton, BrandCard, BrandStatusDot } from '../../components/brand';

type Tab = 'dashboard' | 'hash' | 'zkp' | '5t' | 'verify';

const TABS: { id: Tab; label: string; sub: string; icon: any; color: string }[] = [
  { id: 'dashboard', label: '信任儀表板', sub: 'Trust Index', icon: ShieldCheck, color: '#003262' },
  { id: '5t',        label: '5T 誠信封印', sub: 'Full Attestation', icon: Lock, color: '#FDB515' },
  { id: 'zkp',       label: '零知識證明', sub: 'ZKP Laboratory', icon: Fingerprint, color: '#3B7EA1' },
  { id: 'hash',      label: '雜湊指紋', sub: 'SHA-256 Engine', icon: Hash, color: '#8B5CF6' },
  { id: 'verify',    label: '即時驗算', sub: 'Live Verify', icon: CheckCircle, color: '#10B981' },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${copied ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-[#003262] hover:bg-slate-50'}`}
    >
      <Copy size={12} />
      <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function CodeBlock({ value, label, variant = 'dark' }: { value: string; label?: string; variant?: 'dark' | 'light' }) {
  return (
    <div className="space-y-2">
      {label && <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</p>}
      <div className={`relative group p-5 rounded-[20px] font-mono text-sm border transition-all ${variant === 'dark' ? 'bg-[#0f172a] text-blue-300 border-slate-800' : 'bg-white text-slate-600 border-slate-100'}`}>
        <div className="break-all leading-relaxed pr-16">{value}</div>
        <div className="absolute top-4 right-4">
          <CopyBtn text={value} />
        </div>
      </div>
    </div>
  );
}

// ─── Component: Trust Index Dashboard ───────────────────────────
function TrustDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BrandCard padding="lg" className="text-center space-y-4 bg-gradient-to-br from-white to-blue-50/30">
          <div className="w-16 h-16 rounded-3xl bg-[#003262]/5 flex items-center justify-center mx-auto text-[#003262]">
            <Shield size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Digital Trust Index</p>
            <h3 className="text-5xl font-black text-[#003262] tracking-tighter mt-1">98.4</h3>
          </div>
          <BrandBadge variant="gold" size="sm" className="font-black px-4">SOVEREIGN_LEVEL</BrandBadge>
        </BrandCard>
        
        <BrandCard padding="lg" className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
            <Lock size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Sealed Assets</p>
            <h3 className="text-5xl font-black text-[#003262] tracking-tighter mt-1">1,284</h3>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">GRI_COMMITTED</p>
        </BrandCard>

        <BrandCard padding="lg" className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
            <Sparkles size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ZKP Verified Proofs</p>
            <h3 className="text-5xl font-black text-[#003262] tracking-tighter mt-1">452</h3>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ZERO_LEAK_POLICY</p>
        </BrandCard>
      </div>

      <BrandCard padding="none" className="overflow-hidden border-none shadow-2xl">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-[#003262] tracking-tight">近期封印軌跡</h3>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">Recent 5T Sealing Events</p>
          </div>
          <BrandButton variant="ghost" size="sm" className="text-[11px] font-black tracking-widest">VIEW_FULL_AUDIT</BrandButton>
        </div>
        <div className="divide-y divide-slate-50">
          {[1,2,3].map(i => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#003262] group-hover:border-[#003262]/20 transition-all shadow-sm">
                  <Hash size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-[#003262]">GRI 305-1: 範疇一碳排數據封印</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator: System Agent · 3 mins ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <code className="text-[10px] font-mono text-slate-300 group-hover:text-blue-400 transition-colors hidden sm:block">SHA256: 8a4c...d9f2</code>
                <BrandBadge variant="success" size="xs" dot>T5_LOCKED</BrandBadge>
              </div>
            </div>
          ))}
        </div>
      </BrandCard>
    </div>
  );
}

// ─── Component: 5T Attestation ──────────────────────────────────
function T5AttestationDemo() {
  const [metric, setMetric] = useState('範疇二電力間接排放');
  const [value, setValue] = useState('6,847');
  const [unit, setUnit] = useState('tCO₂e');
  const [source, setSource] = useState('台電 2024Q3 電費帳單與排放係數庫');
  const [attestation, setAttestation] = useState<T5Attestation | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const a = await create5TAttestation(metric, value, unit, source, `電力排放係數法 (Bureau of Energy, MOEA)`);
    setTimeout(() => {
      setAttestation(a);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">治理對象與元數據</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 ml-1 uppercase">Metric Name</label>
                <input className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-[#003262] focus:border-transparent outline-none transition-all" value={metric} onChange={e => setMetric(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 ml-1 uppercase">Value</label>
                <input className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-[#003262] focus:border-transparent outline-none transition-all font-mono" value={value} onChange={e => setValue(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 ml-1 uppercase">Unit</label>
                <input className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-[#003262] focus:border-transparent outline-none transition-all" value={unit} onChange={e => setUnit(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 ml-1 uppercase">Source</label>
                <input className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-[#003262] focus:border-transparent outline-none transition-all" value={source} onChange={e => setSource(e.target.value)} />
              </div>
            </div>
          </div>
          <BrandButton variant="primary" fullWidth size="lg" className="h-16 rounded-[20px] shadow-2xl shadow-[#003262]/20" onClick={generate} disabled={loading}>
            {loading ? <Loader size={20} className="animate-spin mr-3" /> : <Lock size={20} className="mr-3 text-[#FDB515]" />}
            <span className="font-black text-lg tracking-tight">啟動 5T 誠信封印</span>
          </BrandButton>
        </div>

        <div className="flex flex-col justify-center p-8 bg-[#003262]/5 rounded-[32px] border border-[#003262]/5 space-y-4">
           <Shield className="text-[#003262] opacity-20 mb-2" size={48} />
           <h4 className="text-lg font-black text-[#003262] tracking-tight">何謂 5T 誠信封印？</h4>
           <p className="text-sm text-slate-500 leading-relaxed font-medium">
             這是一個基於 Berkeley 學術架構的密碼學流程。它會將您的數據、原始來源文件、計算公式與時間戳進行 **哈希聚合 (Hash Aggregation)**。
             封印後，數據將進入「不可篡改」狀態，任何對數據的微小改動都將被 ZKP 驗證器偵測。
           </p>
        </div>
      </section>

      {attestation && (
        <div className="space-y-8 animate-in slide-up duration-700">
           <BrandCard padding="none" className="bg-[#003262] border-none shadow-extreme overflow-hidden p-10 relative">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <Shield size={200} color="#fff" />
              </div>
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <BrandBadge variant="gold" size="sm" className="font-black px-4">MASTER_SEAL_LOCKED</BrandBadge>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-[11px] font-black text-blue-200/50 uppercase tracking-[0.4em]">Master Integrity Hash (SHA-256)</p>
                    <code className="text-2xl font-black text-[#FDB515] block break-all font-mono tracking-tighter leading-tight">{attestation.masterSeal}</code>
                 </div>
                 <div className="flex flex-wrap items-center gap-8 pt-4">
                    <div>
                       <p className="text-[10px] font-black text-blue-200/30 uppercase tracking-widest mb-1">Attestation Node</p>
                       <p className="text-sm font-bold text-white uppercase tracking-widest">Sovereign_Node_01</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-blue-200/30 uppercase tracking-widest mb-1">Timestamp</p>
                       <p className="text-sm font-bold text-white uppercase tracking-widest font-mono">{new Date().toISOString()}</p>
                    </div>
                 </div>
              </div>
           </BrandCard>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BrandCard padding="lg" className="border-none shadow-lg bg-white/80">
                 <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003262]"><Database size={18} /></div>
                    <h5 className="text-sm font-black text-[#003262] uppercase tracking-widest">T1 Traceable</h5>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">來源文件哈希鎖定，確保原始單據真實存在且未更動。</p>
                 <code className="text-[10px] font-mono text-slate-400 block break-all bg-slate-50 p-3 rounded-xl border border-slate-100">{attestation.t1_traceable.hash}</code>
              </BrandCard>

              <BrandCard padding="lg" className="border-none shadow-lg bg-white/80">
                 <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-gold-50 flex items-center justify-center text-[#FDB515]"><Eye size={18} /></div>
                    <h5 className="text-sm font-black text-[#003262] uppercase tracking-widest">T2 Transparent</h5>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">計算公式完全公開，允許審計師在不取得原始值下驗證算法。</p>
                 <code className="text-[10px] font-mono text-slate-400 block break-all bg-slate-50 p-3 rounded-xl border border-slate-100">{attestation.t2_transparent.outputHash}</code>
              </BrandCard>

              <BrandCard padding="lg" className="border-none shadow-lg bg-white/80">
                 <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><ShieldCheck size={18} /></div>
                    <h5 className="text-sm font-black text-[#003262] uppercase tracking-widest">T4 Trustworthy</h5>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">數據已完成 ZKP 承諾，任何篡改都將導致驗算失敗。</p>
                 <code className="text-[10px] font-mono text-slate-400 block break-all bg-slate-50 p-3 rounded-xl border border-slate-100">{attestation.t4_trustworthy.hash}</code>
              </BrandCard>
           </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page Wrapper ────────────────────────────────────────────
export default function ProofCenterPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-[1500px] mx-auto p-8 lg:p-12 space-y-12 pb-24 fade-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.2em] px-4">SOVEREIGN_PROOF v8.5</BrandBadge>
             <div className="flex items-center gap-2.5 bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/60 shadow-sm">
                <BrandStatusDot status="active" pulse size="sm" />
                <span className="text-[10px] font-black text-[#003262] uppercase tracking-widest">Integrity Node Active</span>
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-[#003262] tracking-tight leading-none uppercase">
              誠信證明中心
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
              使用 Berkeley 級密碼學建立 **5T 治理主權**。所有封印紀錄均使用 Web Crypto API 原生運算，具備不可篡改性。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white/40 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-[20px] transition-all duration-500 ${active ? 'bg-[#003262] text-white shadow-xl shadow-[#003262]/20 scale-105' : 'text-slate-400 hover:text-[#003262] hover:bg-white/50'}`}
              >
                <Icon size={18} className={active ? 'text-[#FDB515]' : ''} />
                <div className="text-left leading-tight hidden xl:block">
                   <p className="text-[13px] font-black uppercase tracking-tight">{t.label}</p>
                   <p className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-white/40' : 'text-slate-400/60'}`}>{t.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      <div className="relative">
        {/* Background Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FDB515]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 min-h-[600px]">
           {tab === 'dashboard' && <TrustDashboard />}
           {tab === '5t' && <T5AttestationDemo />}
           {tab === 'zkp' && (
             <div className="p-12 text-center glass-panel rounded-[40px] border-none">
                <Fingerprint size={64} className="mx-auto text-[#003262] opacity-10 mb-6" />
                <h3 className="text-2xl font-black text-[#003262] mb-3 uppercase tracking-tight">零知識證明實驗室</h3>
                <p className="text-slate-500 font-medium mb-8">ZKP 模組正在進行最終安全性審核，預計 v8.6 正式啟用</p>
                <BrandButton variant="primary" size="lg" className="rounded-2xl" onClick={() => setTab('dashboard')}>返回儀表板</BrandButton>
             </div>
           )}
           {tab === 'hash' && (
             <div className="p-12 text-center glass-panel rounded-[40px] border-none">
                <Hash size={64} className="mx-auto text-[#003262] opacity-10 mb-6" />
                <h3 className="text-2xl font-black text-[#003262] mb-3 uppercase tracking-tight">雜湊指紋引擎</h3>
                <p className="text-slate-500 font-medium mb-8">底層引擎已升級至 SHA-512，目前整合至 5T 封印流程中</p>
                <BrandButton variant="primary" size="lg" className="rounded-2xl" onClick={() => setTab('5t')}>執行 5T 封印</BrandButton>
             </div>
           )}
           {tab === 'verify' && (
             <div className="p-12 text-center glass-panel rounded-[40px] border-none">
                <CheckCircle size={64} className="mx-auto text-[#003262] opacity-10 mb-6" />
                <h3 className="text-2xl font-black text-[#003262] mb-3 uppercase tracking-tight">即時驗算驗證器</h3>
                <p className="text-slate-500 font-medium mb-8">請使用行動端掃描佐證文件上的 VerifyLink QR Code 進行即時驗證</p>
                <BrandButton variant="primary" size="lg" className="rounded-2xl" onClick={() => window.location.href='/audit-verify'}>前往 VerifyLink™</BrandButton>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
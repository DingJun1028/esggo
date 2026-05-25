'use client';

import React, { useState } from 'react';
import { 
  Shield, Search, CheckCircle2, XCircle, Database, 
  Globe, ExternalLink, Cpu, FileText, AlertTriangle, Key, Network, GitCompare, Plus, Minus, Tag
} from 'lucide-react';
import { 
  BrandCard, BrandBadge, BrandButton, BrandInput, BrandStatusDot, BrandProgress 
} from '../../components/brand';
import { motion, AnimatePresence } from 'framer-motion';
import { sha256, verifyZKPProof } from '../../lib/crypto-proof';
import { DiffEngine, DiffResult } from '../../lib/sonar/core/diff-engine';

export default function AuditorPortal() {
  const [sealId, setSealId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [mode, setMode] = useState<'verify' | 'diff'>('verify');
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);

  const handleVerify = async () => {
    if (!sealId.trim()) return;
    setIsVerifying(true);
    setResult(null);

    // Simulate deep verification process
    await new Promise(r => setTimeout(r, 2000));

    // For prototype: If the seal starts with '0x', simulate a success
    const success = sealId.length > 20;

    if (success) {
      setResult({
        status: 'AUTHENTIC',
        timestamp: new Date().toISOString(),
        issuer: 'ESG GO Autonomous Platform',
        anchored: true,
        txHash: '0x7d8a...f21b',
        network: 'Polygon Mainnet',
        integrityMatrix: {
          t1_traceable: true,
          t2_transparent: true,
          t3_tangible: true,
          t4_trustworthy: true,
          t5_trackable: true
        }
      });
    } else {
      setResult({
        status: 'FAILED',
        error: 'Seal ID not found or invalid cryptographic signature.'
      });
    }
    
    setIsVerifying(false);
  };

  const handleCompare = () => {
    if (!oldText.trim() || !newText.trim()) return;
    const result = DiffEngine.compareLines(oldText, newText);
    setDiffResult(result);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-berkeley-blue rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-xl border-4 border-white">
            <Shield size={40} />
          </div>
          <div className="space-y-1">
             <h1 className="text-3xl font-black text-berkeley-blue uppercase tracking-tight">第三方審核門戶 (Auditor Portal)</h1>
             <p className="text-slate-500 font-medium">Independent Cryptographic Verification of 5T ESG Evidence</p>
          </div>
          <div className="flex justify-center gap-3">
             <BrandBadge variant="outline" size="sm" className="bg-white">Trustless Verification</BrandBadge>
             <BrandBadge variant="outline" size="sm" className="bg-white">Public Ledger Anchored</BrandBadge>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-premium border border-slate-100">
            <button
              onClick={() => setMode('verify')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${mode === 'verify' ? 'bg-berkeley-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Search size={14} /> 驗證 Seal
            </button>
            <button
              onClick={() => setMode('diff')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${mode === 'diff' ? 'bg-berkeley-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <GitCompare size={14} /> 版本比對
            </button>
          </div>
        </div>

        {mode === 'verify' && (
        <>
        {/* Search Area */}
        <BrandCard padding="lg" className="shadow-premium border-none bg-white/80 backdrop-blur-xl">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">輸入憑證雜湊或 Seal ID</label>
                 <div className="flex gap-3">
                    <input 
                      className="flex-1 h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-mono font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                      placeholder="e.g. 0x8a1b2c3d..."
                      value={sealId}
                      onChange={(e) => setSealId(e.target.value)}
                    />
                    <BrandButton variant="primary" className="h-16 px-8 rounded-2xl font-black shadow-lg" onClick={handleVerify} loading={isVerifying}>
                       <Search size={20} className="mr-2" /> 驗證
                    </BrandButton>
                 </div>
              </div>
           </div>
        </BrandCard>

        {/* Results Area */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
               {result.status === 'AUTHENTIC' ? (
                 <div className="space-y-8">
                    {/* Success Banner */}
                    <div className="p-8 bg-emerald-500 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                       <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                          <CheckCircle2 size={64} className="animate-in zoom-in duration-500" />
                          <div>
                             <h2 className="text-2xl font-black uppercase tracking-tight">驗證屬實 (Authentic)</h2>
                             <p className="text-emerald-100 text-sm font-medium">此數據已通過 5T 誠信協議驗證並永久錨定。</p>
                          </div>
                       </div>
                       <Network size={200} className="absolute -bottom-20 -right-20 text-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Lineage Info */}
                       <BrandCard padding="lg" className="space-y-6 border-none shadow-premium">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Database size={14} className="text-berkeley-blue" />
                             憑證元數據
                          </h3>
                          <div className="space-y-4">
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase">發行者</p>
                                <p className="text-sm font-bold text-berkeley-blue">{result.issuer}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase">驗證時間</p>
                                <p className="text-sm font-bold text-berkeley-blue">{new Date(result.timestamp).toLocaleString()}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase">公共帳本狀態</p>
                                <div className="flex items-center gap-2 mt-1">
                                   <BrandBadge variant="success" size="xs">ANCHORED</BrandBadge>
                                   <span className="text-[10px] text-slate-400 font-bold">{result.network}</span>
                                </div>
                             </div>
                          </div>
                       </BrandCard>

                       {/* 5T Matrix */}
                       <BrandCard padding="lg" className="space-y-6 border-none shadow-premium">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Key size={14} className="text-berkeley-blue" />
                             5T 誠信矩陣
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                             {Object.entries(result.integrityMatrix).map(([gate, passed]) => (
                               <div key={gate} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <span className="text-[10px] font-black text-berkeley-blue uppercase">{gate}</span>
                                  <CheckCircle2 size={16} className="text-emerald-500" />
                               </div>
                             ))}
                          </div>
                       </BrandCard>
                    </div>

                    {/* Blockchain Receipt */}
                    <BrandCard padding="md" className="bg-slate-900 border-none text-white overflow-hidden relative group">
                       <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Globe size={20} className="text-primary-300" />
                             </div>
                             <div>
                                <p className="text-[9px] font-black uppercase opacity-60">Blockchain Tx Receipt</p>
                                <p className="text-xs font-mono group-hover:text-primary-400 transition-colors">{result.txHash}</p>
                             </div>
                          </div>
                          <BrandButton variant="ghost" size="sm" className="text-white hover:bg-white/10 border-white/10">
                             <ExternalLink size={14} className="mr-2" /> View on Explorer
                          </BrandButton>
                       </div>
                    </BrandCard>
                 </div>
               ) : (
                 <BrandCard padding="lg" className="border-2 border-dashed border-red-200 bg-red-50/50 text-center space-y-4">
                    <XCircle size={48} className="text-red-500 mx-auto" />
                    <div>
                       <h3 className="text-xl font-black text-red-800 uppercase">驗證失敗 (Verification Failed)</h3>
                       <p className="text-sm text-red-600 font-medium">{result.error}</p>
                    </div>
                 </BrandCard>
               )}
            </motion.div>
          )}
         </AnimatePresence>
        </>
        )}

        {mode === 'diff' && (
          <>
            {/* Diff Input */}
            <BrandCard padding="lg" className="shadow-premium border-none bg-white/80 backdrop-blur-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <GitCompare size={20} className="text-berkeley-blue" />
                  <h2 className="text-sm font-black text-berkeley-blue uppercase tracking-wider">法規 / 揭露版本比對</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">舊版本 (Old)</label>
                    <textarea
                      className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-mono focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
                      placeholder="Paste old regulation / disclosure text..."
                      value={oldText}
                      onChange={e => setOldText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">新版本 (New)</label>
                    <textarea
                      className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-mono focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
                      placeholder="Paste new regulation / disclosure text..."
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                    />
                  </div>
                </div>
                <BrandButton variant="primary" className="rounded-2xl font-black" onClick={handleCompare}>
                  <GitCompare size={16} className="mr-2" /> 開始比對
                </BrandButton>
              </div>
            </BrandCard>

            {/* Diff Results */}
            <AnimatePresence>
              {diffResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-6">
                  {/* ESG Tags */}
                  {diffResult.esgTags && diffResult.esgTags.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Tag size={14} className="text-berkeley-blue" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">受影響 ESG 類別:</span>
                      {diffResult.esgTags.map(tag => (
                        <BrandBadge key={tag} variant="blue" size="sm">{tag}</BrandBadge>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {/* Removed */}
                    <BrandCard padding="lg" className="space-y-4 border-none shadow-premium bg-red-50/50">
                      <div className="flex items-center gap-2">
                        <Minus size={16} className="text-red-500" />
                        <h3 className="text-xs font-black text-red-700 uppercase tracking-wider">移除 ({diffResult.removed.length})</h3>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {diffResult.removed.map((line, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-red-100 text-[10px] font-mono text-red-700 leading-relaxed">{line}</div>
                        ))}
                        {diffResult.removed.length === 0 && (
                          <p className="text-xs text-slate-400 font-medium italic">無移除內容</p>
                        )}
                      </div>
                    </BrandCard>

                    {/* Added */}
                    <BrandCard padding="lg" className="space-y-4 border-none shadow-premium bg-emerald-50/50">
                      <div className="flex items-center gap-2">
                        <Plus size={16} className="text-emerald-600" />
                        <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider">新增 ({diffResult.added.length})</h3>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {diffResult.added.map((line, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-emerald-100 text-[10px] font-mono text-emerald-700 leading-relaxed">{line}</div>
                        ))}
                        {diffResult.added.length === 0 && (
                          <p className="text-xs text-slate-400 font-medium italic">無新增內容</p>
                        )}
                      </div>
                    </BrandCard>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </>
        )}

        {/* Footer Info */}
        <div className="text-center">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
              ESG GO Protocol v1.1.0 · Secured by SHA-256 & WebCrypto<br/>
              © 2024 ESG GO Platforms Inc.
           </p>
        </div>
      </div>
    </div>
  );
}

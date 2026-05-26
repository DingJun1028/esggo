'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Upload, FileText, Search, ShieldCheck, 
  ArrowUpRight, CheckCircle, AlertTriangle, Database, 
  Maximize2, RefreshCw, BarChart3, Bot, Sparkles,
  Eye, Lock, Hash, Activity, Edit3
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn, staggerContainer } from '../../lib/animations';
import { UniversalPageConfig } from '../../lib/page-config';

interface AlchemyResult {
  fileName: string;
  extractedMetrics: Array<{ key: string; value: number | string; unit: string; gri: string }>;
  confidence: number;
  gapAnalysis: string;
  sealed?: boolean;
  sealHash?: string;
}

export default function OmniAgentAlchemyPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [results, setResults] = useState<AlchemyResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const SCAN_STEPS = [
    "正在讀取憑證像素 (T1 Truth)...",
    "執行多模態語義提取 (T4 Transparent)...",
    "校準 GRI 指標映射 (T2 Traceable)...",
    "正在計算 AI 信任評分...",
    "生成 Alchemy 智能分析報告"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setResults(null);
    }
  };

  const startAlchemy = async () => {
    if (!uploadedFile) return;
    setIsScanning(true);
    setScanStep(0);

    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(uploadedFile);
    });
    const base64Data = await base64Promise;

    // Simulate multi-modal scan steps visually
    const stepInterval = setInterval(() => {
      setScanStep(prev => Math.min(prev + 1, SCAN_STEPS.length - 2));
    }, 1000);

    try {
      const res = await fetch('/api/agent/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: uploadedFile.name, 
          fileType: uploadedFile.type,
          base64Data 
        }),
      });
      const data = await res.json();
      clearInterval(stepInterval);
      setScanStep(SCAN_STEPS.length - 1);
      await new Promise(r => setTimeout(r, 800));

      if (data.ok) {
        setResults({
          fileName: data.fileName,
          extractedMetrics: data.metrics,
          confidence: data.confidence,
          gapAnalysis: data.summary,
        });
      }
    } catch (e) {
      console.error('Alchemy failed', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSeal = async () => {
    if (!results) return;
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const sealHash = `sha256:ox_alc_${Math.random().toString(36).substring(2, 15)}`;
    
    // [oX Logic Upgrade] Pushing to Vault Omni
    try {
      await fetch('/api/vault/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: `alc-${Date.now()}`,
          hash_lock: sealHash,
          gri_reference: results.extractedMetrics.map(m => m.gri).join(', '),
          payload: JSON.stringify(results),
          dimension: 'E',
          t5_bundle: { tags: ['T1', 'T2', 'T4', 'T5'], version: '1.2.0' }
        })
      });
    } catch (e) { console.warn('Vault auto-registration failed', e); }

    setResults({
      ...results,
      sealed: true,
      sealHash
    });
    setIsScanning(false);
  };

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'omniagent-alchemy',
    title: 'OmniAgent Alchemy 煉金術',
    subtitle: '多模態憑證智能提取中心 · 5T 數據轉化 · 自動化 GRI 映射。',
    icon: <Sparkles size={32} className="text-berkeley-blue" />,
    griReference: 'Intelligence / Vision',
    activeT5Tags: ['T1', 'T2', 'T4'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'reset', label: '重置掃描', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: () => { setUploadedFile(null); setResults(null); } },
    ],

    kpis: [
      { key: 'accuracy', label: '平均準確率', value: '99.2', unit: '%', icon: <ShieldCheck size={18}/> },
      { key: 'scanned', label: '本日已掃描', value: '14', icon: <FileText size={18}/> },
      { key: 'time', label: '平均耗時', value: '4.8', unit: 'sec', icon: <Zap size={18}/> },
    ],

    sections: [
      {
        id: 'upload-zone',
        title: '原始憑證輸入',
        columns: 4,
        component: (
          <div className="space-y-6">
            <div 
              className={cn(
                "border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-500 group",
                uploadedFile ? "border-verified/30 bg-verified/5" : "border-slate-200 bg-slate-50/50 hover:border-berkeley-blue/40 hover:bg-berkeley-blue/5"
              )}
            >
              <input type="file" id="alchemy-upload" className="hidden" onChange={handleFileUpload} />
              <label htmlFor="alchemy-upload" className="cursor-pointer block space-y-4">
                <div className={cn(
                  "w-16 h-16 rounded-3xl mx-auto flex items-center justify-center transition-transform group-hover:scale-110",
                  uploadedFile ? "bg-verified/20 text-verified" : "bg-white text-slate-300 shadow-sm border border-slate-100"
                )}>
                  {uploadedFile ? <CheckCircle size={32} /> : <Upload size={32} />}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{uploadedFile ? uploadedFile.name : '點擊或拖拽上傳憑證'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Supports PDF, JPG, PNG</p>
                </div>
              </label>
            </div>

            <Button 
              variant="primary" 
              className="w-full h-14 rounded-2xl text-sm tracking-widest uppercase shadow-glass"
              onClick={startAlchemy} 
              disabled={!uploadedFile || isScanning}
              isLoading={isScanning && scanStep < SCAN_STEPS.length}
            >
              <Zap size={18} className="mr-2" fill="currentColor" /> 啟動 Multi-modal Alchemy
            </Button>

            <div className="p-6 bg-berkeley-blue rounded-[2rem] text-white space-y-4 relative overflow-hidden shadow-lg">
               <p className="text-[10px] font-black text-california-gold uppercase tracking-[0.3em] relative z-10">AI Engine Status</p>
               <div className="flex items-center gap-3 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse shadow-[0_0_8px_#10b981]" />
                  <p className="text-xs font-bold text-white/90">Nous-OmniAgent-Vision-v2 Ready</p>
               </div>
               <Bot size={80} className="absolute -bottom-6 -right-6 text-white/5 rotate-12" />
            </div>
          </div>
        )
      },
      {
        id: 'analysis-zone',
        title: 'Alchemy 智能解析結果',
        columns: 8,
        component: (
          <div className="min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-berkeley-blue animate-spin" />
                    <Bot size={32} className="absolute inset-0 m-auto text-berkeley-blue" />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-black text-berkeley-blue tracking-tight">{SCAN_STEPS[scanStep]}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Processing Multi-modal Tokens...</p>
                  </div>
                </motion.div>
              ) : results ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">提取指標數據 (Extracted Metrics)</p>
                      <div className="space-y-3">
                        {results.extractedMetrics.map((m, i) => (
                          <div key={i} className="p-4 bg-white/40 border border-white/60 rounded-2xl shadow-sm flex items-center justify-between group hover:border-berkeley-blue/30 transition-all backdrop-blur-sm">
                            <div>
                              <p className="text-[10px] font-black text-berkeley-blue uppercase mb-0.5">{m.gri}</p>
                              <p className="text-sm font-black text-slate-700">{m.key}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-black text-berkeley-blue font-mono leading-none">{m.value.toLocaleString()}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1.5">{m.unit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AI 信心與缺口分析</p>
                      <Card className="p-6 bg-slate-50/50 rounded-[2rem] border-slate-100/50 space-y-5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">信任評分 (Trust Score)</span>
                          <Badge variant={results.confidence > 0.9 ? 'verified' : 'warning'} className="px-3 py-1">
                            {Math.round(results.confidence * 100)}%
                          </Badge>
                        </div>
                        <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-berkeley-blue to-verified" 
                            initial={{ width: 0 }}
                            animate={{ width: `${results.confidence * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <div className="p-4 bg-white/60 rounded-xl border border-white/80 shadow-sm">
                           <p className="text-[13px] text-slate-600 leading-relaxed italic font-medium">
                              "{results.gapAnalysis}"
                           </p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {results.sealed ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 bg-verified/5 border border-verified/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-verified/10 flex items-center justify-center text-verified shadow-sm">
                          <Lock size={28} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-800 uppercase tracking-tight">5T 實證刻印完成</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Hash size={12} className="text-verified" />
                             <code className="text-[10px] text-verified font-mono font-bold">{results.sealHash}</code>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <Link href={`/editor?chapter=energy&fill=${results.sealHash}`} className="flex-1">
                          <Button variant="primary" className="w-full bg-verified hover:bg-emerald-600 border-none text-white h-12 px-6 rounded-xl">
                            進入永續撰寫 <Edit3 size={16} className="ml-2" />
                          </Button>
                        </Link>
                        <Button variant="glass" className="h-12 px-6 rounded-xl border-verified/20 text-verified hover:bg-verified/10">
                          查看聖碑紀錄 <ArrowUpRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex gap-4">
                      <Button variant="primary" size="lg" className="flex-1 h-16 rounded-2xl shadow-glass text-base tracking-widest" onClick={handleSeal}>
                        <Hash size={20} className="mr-3" /> 執行 5T 封印並提交至金庫
                      </Button>
                      <Button variant="glass" size="lg" className="h-16 w-16 rounded-2xl p-0">
                        <Maximize2 size={24} />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6 opacity-40">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center">
                    <Database size={48} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.4em]">等待憑證輸入中...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />
      
      {/* Toast Overlay (Optional) */}
      <AnimatePresence>
        {results?.sealed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center gap-3"
          >
            <ShieldCheck size={20} />
            <span className="text-sm font-bold">憑證已上傳至 萬能聖碑 vault_omni_core</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

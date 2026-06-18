'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const OmniBaseCard = dynamic(() => import('@/components/ui/omni/OmniBaseCard'), { ssr: false });
const OmniBadge = dynamic(() => import('@/components/ui/omni/OmniBadge'), { ssr: false });
import { FileText, Cpu, CheckCircle2, ShieldCheck, FileKey, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportBuilderUI() {
  const [loading, setLoading] = useState(false);
  const [reportDoc, setReportDoc] = useState<string | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const companyInfo = JSON.parse(
        localStorage.getItem('esg_company_info') || '{"name":"ESGGO 示範企業"}'
      );
      const userInfo = JSON.parse(
        localStorage.getItem('esg_user_info') || '{"fullName":"陳永續 (Sustainability Manager)"}'
      );

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'task_ui_001',
          companyId: companyInfo.name,
          actorId: userInfo.fullName,
          reportYear: '2026',
          triggerSource: 'user',
          evidenceVault: {
            elec_bill: '5000000',
            water_bill: '250000',
          },
          privacyConfig: { isConfidential: true },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReportDoc(data.document);
        setChapters(data.chapters);
      } else {
        setErrorMsg('生成失敗: ' + (data.error || '未知的錯誤'));
      }
    } catch (err) {
      setErrorMsg('發生網路或伺服器錯誤');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-teal-500/30">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-600/20 flex items-center justify-center border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.15)] relative">
              <FileText className="text-teal-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge
                  variant="default"
                  size="sm"
                  icon={<Cpu size={12} />}
                  className="bg-teal-500/20 text-teal-300 border-teal-500/30"
                >
                  Zero-Compute Engine
                </OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  SWRITE-GEN
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                永續報告生成器
              </h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">
                SustainWrite Automated Reporting
              </p>
            </div>
          </div>
        </header>

        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          透過 OmniCore 5T 治理矩陣與 ZKP (零知識證明) 技術，將企業的 ESG
          數據全自動編譯成符合國際標準的永續報告書，全程保障資料隱私。
        </p>

        <OmniBaseCard
          variant="glass"
          className="p-8 border-teal-500/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 flex-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileKey size={20} className="text-teal-400" /> 啟動生成引擎
              </h2>
              <p className="text-sm text-slate-400">
                即將編譯 <strong>2026 年度報告</strong>。系統將自動匯入 `Evidence Vault` 中已完成
                Hash Lock 的可信數據，並應用 5T 驗證機制。
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !!reportDoc}
              className="min-w-[240px] relative overflow-hidden rounded-xl bg-teal-500/10 border border-teal-500/30 p-4 transition-all hover:bg-teal-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 transition-all duration-500 ease-out group-hover/btn:w-full" />
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <Loader2 size={20} className="text-teal-400 animate-spin" />
                ) : reportDoc ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : (
                  <Cpu size={20} className="text-teal-400" />
                )}
                <span className="text-teal-100 font-bold tracking-widest uppercase text-sm">
                  {loading ? '引擎運轉中 (ZKP)...' : reportDoc ? '報告已生成' : '開始生成報告'}
                </span>
              </div>
            </button>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </OmniBaseCard>

        <AnimatePresence>
          {reportDoc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <OmniBadge
                  variant="success"
                  icon={<CheckCircle2 size={12} />}
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                >
                  成功生成 {chapters?.length || 0} 個章節
                </OmniBadge>
                <OmniBadge
                  variant="outline"
                  icon={<ShieldCheck size={12} />}
                  className="border-cyan-500/30 text-cyan-400"
                >
                  Tri-Sync 異地備援完成
                </OmniBadge>
              </div>

              <OmniBaseCard variant="glass" className="overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-sm font-bold text-slate-300 font-mono">
                    報告結果預覽 (Document Preview)
                  </h3>
                </div>
                <div className="p-8 h-[600px] overflow-y-auto font-serif prose prose-invert prose-slate max-w-none whitespace-pre-wrap selection:bg-teal-500/30 bg-black/20 text-slate-300">
                  {reportDoc}
                </div>
              </OmniBaseCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

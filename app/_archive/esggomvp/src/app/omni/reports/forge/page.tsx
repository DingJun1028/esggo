'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, FileText, Send, Plus, Trash2, Loader2, Sparkles, Binary, ShieldCheck, Zap, Award } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { ReportCard, type ReportStatus } from '@/components/omni/liquid-glass/ReportCard';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';
import { DigitalReportViewer } from '@/components/omni/reports/DigitalReportViewer';
import { reportsApi, type SustainabilityReport } from '@/lib/ncb-service';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function ReportFactoryPage() {
  const { locale } = useLanguage();
  const langKey = locale === 'en' ? 'en' : 'tw';

  const [reports, setReports] = useState<SustainabilityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    reportsApi.list({ signal: controller.signal })
      .then(({ data, error }) => {
        if (!cancelled && data?.data) setReports(data.data);
        if (!cancelled && error) throw new Error(error);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(langKey === 'tw' ? '無法載入報告數據' : 'Failed to load report data');
        toast.error(langKey === 'tw' ? '載入失敗' : 'Load failed');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [langKey]);

  const sortedDrafts = useMemo(
    () =>
      reports
        .filter((r) => r.status === 'Draft' || !r.status)
        .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()),
    [reports],
  );

  const reportComicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
    {
      id: 'r1',
      title: '數據孤島',
      description: '各部門的 ESG 數據分散，收集整理曠日費時，且難以確保最終準確性。',
      color: 'danger'
    },
    {
      id: 'r2',
      title: '萬能收斂',
      description: 'Gnosis 引擎即時爬梳全域 24 項服務，將碎裂數據自動整合為標準化指標。',
      color: 'primary'
    },
    {
      id: 'r3',
      title: '5T 合規驗算',
      description: '對收集到的數據進行嚴格 5T 協議檢核，確保報表的真實溯源與不可篡改。',
      color: 'accent'
    },
    {
      id: 'r4',
      title: '報告資產化',
      description: '一鍵生成符合國際標準的報告，化無形影響力為可證明的企業核心資產。',
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-omni-primary blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-omni-accent blur-[100px] rounded-full animate-pulse [animation-delay:1s]" />
      </div>

      <PageHeader
        title={langKey === 'tw' ? '報告工廠' : 'Report Factory'}
        subtitle={langKey === 'tw' ? '一鍵生成符合國際標準的永續報告。' : 'One-click generation of sustainability reports following international standards.'}
      />

      <div className="max-w-7xl mx-auto mb-16 relative z-10">
        <OmniComicStrip panels={reportComicPanels} />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Gnosis Intelligence Scanner Section */}
        <LiquidGlassContainer className="p-8 overflow-hidden relative border-slate-200 bg-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Binary size={120} className="text-omni-primary" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-omni-primary mb-4 font-mono text-sm tracking-widest font-black uppercase">
                <Sparkles size={16} className="animate-spin-slow" />
                Gnosis Intelligence Hub
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight leading-tight text-slate-900">
                {langKey === 'tw' ? '即服務即學習，知識及資產' : 'Service as Learning, Knowledge as Asset'}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {langKey === 'tw'
                  ? 'Gnosis 引擎正在實時整合全域 24 項 MECE 服務數據，確保每一份報告都具備 5T 協議的真實性與透明度。'
                  : 'The Gnosis engine is integrating global 24 MECE service data in real-time, ensuring every report possesses 5T Protocol authenticity and transparency.'}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-omni-primary/10 rounded-full border border-omni-primary/20 text-xs font-bold text-omni-primary">
                  <ShieldCheck size={14} />
                  5T AUDIT: ACTIVE
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full border border-amber-200 text-xs font-bold text-amber-600">
                  <Zap size={14} />
                  SYNC: 98.4%
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 166, 176, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-omni-primary text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-omni-primary/20 mt-4 md:mt-0"
            >
              <Plus size={24} strokeWidth={3} />
              {langKey === 'tw' ? '開啟新草稿' : 'Create New Draft'}
            </motion.button>
          </div>
        </LiquidGlassContainer>

        {/* Reports List Section */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
              <div className="w-1 h-6 bg-omni-primary rounded-full transition-all group-hover:h-8" />
              {langKey === 'tw' ? '報告草稿列表' : 'Sustainability Drafts'}
              {isLoading && <Loader2 size={18} className="animate-spin text-omni-primary ml-2" />}
            </h2>
            <div className="text-xs font-mono text-slate-500">
              COUNT: {sortedDrafts.length}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center rounded-3xl border border-red-200 bg-red-50/80 backdrop-blur-md"
              >
                <p className="text-red-500 font-bold mb-4">⚠ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-white hover:bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 transition-all text-slate-700"
                >
                  {langKey === 'tw' ? '重新整理' : 'Retry Connection'}
                </button>
              </motion.div>
            ) : sortedDrafts.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-12 text-center rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm"
              >
                <div className="w-16 h-16 bg-omni-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-omni-primary/60">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  {langKey === 'tw' ? '尚無報告草稿' : 'No Drafts Found'}
                </h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  {langKey === 'tw' ? '點擊上方按鈕開始您的第一份 5T 合規永續報告。' : 'Click the button above to start your first 5T-compliant report.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
                  ))
                  : sortedDrafts.map((draft) => (
                    <motion.div key={draft.id} variants={itemVariants}>
                      <ReportCard
                        uuid={`REP-${draft.id}`}
                        title={draft.title}
                        subtitle={draft.company_name}
                        version={draft.version?.toString() || '1.0'}
                        status={(draft.status as ReportStatus) || 'Draft'}
                        icon={FileText}
                        category={draft.reporting_year?.toString() || '2026'}
                        completionRate={draft.compliance_score || 0}
                        standardRef="GRI / SASB / IFRS S1&S2"
                        onClick={() => setSelectedReportId(`REP-${draft.id}`)}
                      />
                    </motion.div>
                  ))
                }
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Background Auto-pilot Status */}
        <LiquidGlassContainer className="mt-16 p-8 border-dashed bg-white border-slate-200">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-omni-primary blur-lg opacity-20 animate-pulse" />
                <div className="relative size-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-omni-primary/20">
                  <Loader2 className="animate-spin text-omni-primary" size={32} />
                </div>
              </div>
              <div>
                <h4 className="font-black tracking-tight text-slate-900 mb-1">
                  {langKey === 'tw' ? 'AI 實時導航中' : 'AI Real-time Navigation'}
                </h4>
                <p className="text-sm text-slate-500">
                  {langKey === 'tw' ? '正在背景掃描全域 24 項服務及其 5T 證據鏈...' : 'Scanning global 24 services and 5T evidence chains in background...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [8, i % 2 === 0 ? 32 : 16, 8],
                    opacity: [0.2, 1, 0.2]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-1.5 rounded-full bg-omni-primary"
                />
              ))}
              <span className="text-xs font-mono text-omni-primary font-bold ml-4">GNOSIS ACTIVE</span>
            </div>
          </div>
        </LiquidGlassContainer>

        {/* Footer info */}
        <div className="py-12 mt-12 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-400 tracking-widest uppercase">
          <div>OS: OMNI-LAYER v12.4.0</div>
          <div>STITCH_ID: {sortedDrafts[0]?.id || 'N/A'}</div>
          <div>PROTOCOL: 5T-COMPLIANT-SENTIENT</div>
        </div>
      </div>

      <AnimatePresence>
        {selectedReportId && (
          <DigitalReportViewer reportId={selectedReportId} onClose={() => setSelectedReportId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

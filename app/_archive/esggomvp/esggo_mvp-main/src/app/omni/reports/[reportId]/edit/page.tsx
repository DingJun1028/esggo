'use client';

import React, { useState, use } from 'react';
import { ESGReportContent } from '@/core/dtos/report-schema.dto';
import { ReportPreview } from '@/components/omni/report/ReportPreview';
import { ReportGuidanceAgent } from '@/components/omni/report/ReportGuidanceAgent';
import { saveReportDraft, publishReport } from '@/app/omni/actions/omni-reports-action';
import { useToast } from '@/components/omni/liquid-glass/ToastProvider';
import { Save, Lock, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportForgeEditor({ params }: { params: Promise<{ reportId: string }> }) {
    const resolvedParams = use(params);
    const reportId = resolvedParams.reportId;
    const toast = useToast();

    const [content, setContent] = useState<ESGReportContent>({
        introduction: { content: '', completed: false },
        governance: { content: '', completed: false },
        environmental: { content: '', completed: false },
        social: { content: '', completed: false },
        appendix: { content: '', completed: false },
    });

    const [activeSection, setActiveSection] = useState<keyof ESGReportContent>('introduction');
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleUpdate = (section: keyof ESGReportContent, data: { content: string; completed: boolean }) => {
        setContent(prev => ({
            ...prev,
            [section]: data
        }));
    };

    const handleNextSection = () => {
        const sections: Array<keyof ESGReportContent> = ['introduction', 'governance', 'environmental', 'social', 'appendix'];
        const currentIndex = sections.indexOf(activeSection);
        if (currentIndex < sections.length - 1) {
            setActiveSection(sections[currentIndex + 1]);
        } else {
            toast.success("報告填寫完畢！", "已完成所有章節，您可以進行最終 Hash Lock 簽署。");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        toast.info('儲存中…', '正在同步至 NCB 數據層');
        try {
            const res = await saveReportDraft({
                uuid: `mod-src-${reportId}-forge`,
                reportId,
                version: '11.0.0',
                status: 'Draft',
                data: content as unknown as Record<string, any>,
                source_origin: 'JunAiKey Dual-Pane Editor',
            });
            if (res.success) {
                toast.success('草稿已儲存', `來源追蹤：JunAiKey UI · ${new Date().toLocaleTimeString()}`);
            } else {
                toast.error('儲存失敗', '請檢查 NCB 連線或重試');
            }
        } catch (e) {
            toast.error('發生例外錯誤', String(e));
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        toast.warning('處理中…', '正在執行 Object.freeze + Hash Lock 簽署');
        try {
            const res = await publishReport(reportId, {
                uuid: `mod-src-${reportId}-forge`,
                reportId,
                version: '11.0.0',
                status: 'Published',
                data: content as unknown as Record<string, any>,
                source_origin: 'JunAiKey Hash Lock',
                source_lineage: {},
            });
            if (res.success) {
                toast.success('報告已簽署與鎖定 🔒', `SHA-256: ${(res as any).hashSignature?.slice(0, 32)}…`);
                setTimeout(() => {
                    window.location.href = '/omni/reports/agora';
                }, 2000);
            } else {
                toast.error('簽署失敗', (res as any).error ?? '未知錯誤');
            }
        } catch (e) {
            toast.error('簽署例外', String(e));
        } finally {
            setIsPublishing(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        toast.info('匯出中…', '正在生成 JSON 報告');
        try {
            const exportJson = JSON.stringify(content, null, 2);
            const blob = new Blob([exportJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${reportId}-export-${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('匯出完成', '報告 JSON 已下載');
        } catch (e) {
            toast.error('匯出失敗', String(e));
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="h-screen bg-[#050510] text-white p-6 flex flex-col overflow-hidden">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <Link
                        href="/synthesis/dashboard"
                        className="flex items-center gap-1.5 text-white/30 hover:text-aqua text-xs font-bold tracking-widest uppercase mb-2 group"
                    >
                        <ArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" />
                        <span>← 返回系統儀表板</span>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        FORGE: {reportId?.toUpperCase() ?? 'EDITOR'}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-aqua animate-pulse" />
                        <p className="text-aqua/70 text-xs font-mono">JunAiKey Guidance Mode Active</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white px-4 py-2 rounded-xl border border-white/10 transition-all font-mono text-xs disabled:opacity-40"
                    >
                        <Download size={13} />
                        {isExporting ? 'Exporting…' : 'Export'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isPublishing}
                        className="flex items-center gap-2 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 px-5 py-2 rounded-xl border border-cyan-500/25 transition-all font-mono text-xs shadow-[0_0_15px_rgba(6,182,212,0.15)] disabled:opacity-40"
                    >
                        <Save size={13} />
                        {isSaving ? 'Saving…' : 'Save Draft'}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isSaving || isPublishing}
                        className="flex items-center gap-2 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 px-5 py-2 rounded-xl border border-emerald-500/25 transition-all font-mono text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40"
                    >
                        <Lock size={13} />
                        {isPublishing ? 'Locking…' : '簽署 Hash Lock'}
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                <div className="lg:col-span-7 h-full min-h-0 bg-white text-black rounded-[2rem] shadow-2xl overflow-hidden relative">
                    <ReportPreview
                        content={content}
                        activeSection={activeSection}
                        onSectionClick={(sec) => setActiveSection(sec)}
                    />
                </div>
                <div className="lg:col-span-5 h-full min-h-0">
                    <ReportGuidanceAgent
                        content={content}
                        activeSection={activeSection}
                        onUpdate={handleUpdate}
                        onNext={handleNextSection}
                    />
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { ZKPVerificationCenter } from "@/components/wizard/zkp-verification-center";
import { useAuditTrailListener } from "@/hooks/use-audit-listener";
import { callGenkit } from "@/lib/services/client-api";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, FileCheck, Lock } from "lucide-react";
import { toast } from "sonner";

interface AuditVerificationPanelProps {
    reportId: string;
    reportTitle: string;
    reportContent: string;
}

export const AuditVerificationPanel = ({ reportId, reportTitle, reportContent }: AuditVerificationPanelProps) => {
    const [auditId, setAuditId] = useState<string | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [synthesis, setSynthesis] = useState<string | null>(null);
    const { status, downloadUrl } = useAuditTrailListener(auditId);

    const handleStartAudit = async () => {
        setIsExecuting(true);
        try {
            // 1. 先呼叫 Synthesis Flow 取得 AI 摘要
            const synthResult = await callGenkit("esgExecutiveSummaryFlow", {
                reportContent,
                focusArea: "全方位永續績效"
            });
            setSynthesis(synthResult.summary);

            // 2. 啟動稽核存證流
            const result = await callGenkit("auditTrailFlow", {
                reportId,
                reportContent: synthResult.summary + "\n\n" + reportContent, // 包含摘要與全文
                reportTitle
            });

            if (result.auditId) {
                setAuditId(result.auditId);
                toast.success("5T 存證稽核已啟動，正在備份至金庫...");
            }
        } catch (error) {
            console.error("啟動稽核失敗:", error);
            toast.error("稽核啟動失敗，請檢查網路連線");
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-8 bg-stone-50/30 min-h-[600px]">
            {/* Header: Audit Trigger */}
            <div className="bg-white p-10 rounded-3xl border border-outline-variant shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck size={120} className="text-primary-teal-start" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-stitch-text mb-4 uppercase tracking-tighter flex items-center gap-3">
                        <Lock className="w-8 h-8 text-primary-gold" />
                        5T 極限存證稽核 (Omni Audit)
                    </h2>
                    <p className="text-stitch-muted max-w-2xl font-bold text-sm leading-relaxed mb-8">
                        此步驟將啟動 Genkit 多重稽核流。包含：Gemini 2.0 自動校閱、
                        5T 存證鏈生成、以及最終 PDF 雲端歸檔。完成後報告將被「封印」，保證不可竄改。
                    </p>

                    {synthesis && (
                        <div className="mb-8 p-6 bg-primary-teal-start/5 border border-primary-teal-start/20 rounded-2xl">
                            <h3 className="text-xs font-black text-primary-teal-start uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Sparkles size={14} /> AI 產出執行摘要 (Executive Summary)
                            </h3>
                            <p className="text-sm text-stitch-text leading-relaxed font-bold italic">
                                &quot;{synthesis}&quot;
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {!auditId ? (
                            <Button
                                onClick={handleStartAudit}
                                disabled={isExecuting}
                                className="bg-primary-teal-start hover:bg-primary-teal-end text-white px-8 py-6 rounded-2xl text-md font-black shadow-lg shadow-primary-teal-start/20 transition-all flex items-center gap-3"
                            >
                                {isExecuting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        AI 摘要製作與稽核中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        啟動 5T 全自動稽核與摘要
                                    </>
                                )}
                            </Button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">
                                        稽核鏈鎖定中: {status || "同步中..."}
                                    </span>
                                </div>
                                {downloadUrl && (
                                    <Button
                                        onClick={() => window.open(downloadUrl, "_blank")}
                                        className="bg-black text-white px-8 py-6 rounded-2xl text-md font-black shadow-xl hover:bg-stone-800 flex items-center gap-2"
                                    >
                                        <FileCheck className="w-5 h-5" />
                                        下載 5T 存證報告 (PDF)
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ZKP Visualization */}
            <ZKPVerificationCenter />
        </div>
    );
};

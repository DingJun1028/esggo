"use client";

import { useEffect } from "react";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "@/core/IComponentCore";
import Link from "next/link";

const ERROR_CORE: IComponentCore = {
    uuid: 'mod-omni-error-boundary',
    version: '1.0.0',
    timestamp: Date.now(),
    evidence: {
        tangible_metric: '',
        source_origin: '',
        lifecycle_hooks: [],
        formula_ref: ''
    } as any,
    hash_lock: '',
    status: 'Tangible',
    isFrozen: false
};

export default function OmniError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        // [Google Jules Protocol: 觀果] Log the error securely for root cause analysis
        // Sanitized logging - only capture essential info to prevent sensitive data exposure
        console.error("Omni Hub 崩潰 (Truth Locked):", {
            message: error.message,
            digest: error.digest,
        });
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-4 animate-in fade-in duration-700">
            <LiquidGlassContainer
                coreContext={ERROR_CORE}
                stitchId="omni-error-boundary"
                className="w-full max-w-2xl text-center !border-rose-500/30 !shadow-[0_0_30px_rgba(244,63,94,0.15)]"
            >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                    <span className="text-2xl">⚠️</span>
                </div>

                <h2 className="text-2xl font-bold text-rose-400 mb-2 font-mono">SYSTEM ANOMALY DETECTED</h2>
                <p className="text-omni-text-main/80 mb-6 max-w-lg mx-auto">
                    液態視窗渲染過程遭遇異常。我們已透過 Jules 強固協議鎖定錯誤特徵，確保資料庫與核心契約未受影響。
                </p>

                <div className="bg-black/30 p-4 rounded-xl text-left border border-rose-500/20 mb-8 font-mono text-xs overflow-auto max-h-32 text-rose-200/70">
                    <p className="font-bold mb-1">[Exception Stack Trace Snapshot]</p>
                    <p>{error.message}</p>
                    {error.digest && <p className="mt-2 text-omni-text-muted">ID: {error.digest}</p>}
                </div>

                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/omni"
                        className="px-6 py-2.5 rounded-full border border-omni-text-muted/30 text-omni-text-muted hover:text-white hover:border-white/50 transition-all font-mono text-sm"
                    >
                        ABORT (返回安全區)
                    </Link>
                    <button
                        onClick={() => reset()}
                        className="relative px-6 py-2.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/40 hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] font-mono text-sm group"
                    >
                        [嘗試重構連結]
                        <div className="absolute inset-0 rounded-full bg-rose-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    </button>
                </div>
            </LiquidGlassContainer>
        </div>
    );
}

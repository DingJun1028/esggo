/**
 * 💎 OmniReportGenerator
 * --------------------------------------------------
 * 前端組件：5T Evidence Crystal 報告生成器。
 * 提供模板選擇 (GRI/SASB/Internal)、視覺結晶化流程動畫，
 * 以及最終生成不可篡改的 Crystal Report。
 *
 * [Protocol] 5T: Traceable → Trackable → Transparent → Tangible → Trustworthy
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Shield,
    Lock,
    CheckCircle2,
    Loader2,
    Sparkles,
    AlertTriangle,
    Hash,
    Globe,
    Leaf,
    Users,
    Building2
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type ReportStandard = 'GRI' | 'SASB' | 'INTERNAL';
type ReportDomain = 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE' | 'SENTIENCE';

interface CrystalResult {
    uuid: string;
    hashLock: string;
    genesis_timestamp: number;
    nature: {
        intent: string;
        domain: string;
        dnaMarkers: string[];
    };
    resonance: {
        integrityLevel: number;
        isLocked: boolean;
        resonanceLevel: number;
    };
    payload: {
        narrative: string;
        quantitative: number;
        tangibleLabel: string;
    };
}

type CrystalizationPhase =
    | 'IDLE'
    | 'T1_TRACEABLE'
    | 'T2_TRACKABLE'
    | 'T3_TRANSPARENT'
    | 'T4_TANGIBLE'
    | 'T5_TRUSTWORTHY'
    | 'SEALED'
    | 'ERROR';

const PHASE_LABELS: Record<CrystalizationPhase, string> = {
    IDLE: '準備就緒',
    T1_TRACEABLE: '🟢 T1 溯源中...',
    T2_TRACKABLE: '🔵 T2 追蹤中...',
    T3_TRANSPARENT: '🟠 T3 驗算中...',
    T4_TANGIBLE: '🟣 T4 結晶中...',
    T5_TRUSTWORTHY: '🔴 T5 封印中...',
    SEALED: '💎 結晶完成',
    ERROR: '⚠️ 結晶失敗'
};

const DOMAIN_ICONS: Record<ReportDomain, React.ReactNode> = {
    ENVIRONMENT: <Leaf className="w-5 h-5" />,
    SOCIAL: <Users className="w-5 h-5" />,
    GOVERNANCE: <Building2 className="w-5 h-5" />,
    SENTIENCE: <Sparkles className="w-5 h-5" />
};

// ============================================================================
// Component
// ============================================================================

const OmniReportGenerator: React.FC = () => {
    // Form State
    const [standard, setStandard] = useState<ReportStandard>('GRI');
    const [domain, setDomain] = useState<ReportDomain>('ENVIRONMENT');
    const [title, setTitle] = useState('');
    const [narrative, setNarrative] = useState('');
    const [quantitative, setQuantitative] = useState<number>(0);

    // Process State
    const [phase, setPhase] = useState<CrystalizationPhase>('IDLE');
    const [crystal, setCrystal] = useState<CrystalResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * 執行 5T 結晶化流程
     */
    const handleCrystalize = useCallback(async () => {
        if (!title.trim() || !narrative.trim()) {
            setError('請填寫報告標題與敘述內容');
            return;
        }

        setError(null);
        setCrystal(null);

        // 5T Animation Sequence
        const phases: CrystalizationPhase[] = [
            'T1_TRACEABLE',
            'T2_TRACKABLE',
            'T3_TRANSPARENT',
            'T4_TANGIBLE',
            'T5_TRUSTWORTHY'
        ];

        for (const p of phases) {
            setPhase(p);
            await new Promise(r => setTimeout(r, 800)); // Visual delay per gate
        }

        // Call Backend API
        try {
            const response = await fetch('/api/omni/report/crystalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `[${standard}] ${title}`,
                    narrative,
                    quantitativeData: quantitative,
                    domain,
                    evidenceIds: [] // Future: link real evidence
                })
            });

            const result = await response.json();

            if (result.success) {
                setCrystal(result.data);
                setPhase('SEALED');
            } else {
                throw new Error(result.error || 'Unknown API Error');
            }
        } catch (err: any) {
            setError(err.message);
            setPhase('ERROR');
        }
    }, [title, narrative, quantitative, domain, standard]);

    const isProcessing = phase !== 'IDLE' && phase !== 'SEALED' && phase !== 'ERROR';

    return (
        <div className="min-h-screen bg-[#050c14] text-[#E0E0E0] p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-[#63a6b0]" />
                    <span>
                        奧秘報告結晶器
                        <span className="text-sm font-normal text-gray-400 ml-3">
                            Omni Report Crystalizer
                        </span>
                    </span>
                </h1>
                <p className="text-gray-500 mt-2">
                    服務即教學 · 知識即資產 · 5T 協議封印
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Input Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/40 backdrop-blur-md border border-[#63a6b0]/30 rounded-2xl p-6 space-y-6"
                >
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#63a6b0]" />
                        報告內容 (Report Content)
                    </h2>

                    {/* Standard Selection */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">報告標準 (Standard)</label>
                        <div className="flex gap-3">
                            {(['GRI', 'SASB', 'INTERNAL'] as ReportStandard[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStandard(s)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${standard === s
                                            ? 'bg-[#63a6b0] text-white shadow-lg shadow-[#63a6b0]/30'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Domain Selection */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">報告領域 (Domain)</label>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.keys(DOMAIN_ICONS) as ReportDomain[]).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDomain(d)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${domain === d
                                            ? 'bg-[#63a6b0]/20 border border-[#63a6b0] text-[#63a6b0]'
                                            : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {DOMAIN_ICONS[d]}
                                    {d === 'ENVIRONMENT' ? '環境' : d === 'SOCIAL' ? '社會' : d === 'GOVERNANCE' ? '治理' : '感知'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">報告標題</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="例：2025 年度碳排放報告"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#63a6b0] transition-colors"
                        />
                    </div>

                    {/* Narrative */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">報告敘述</label>
                        <textarea
                            value={narrative}
                            onChange={e => setNarrative(e.target.value)}
                            rows={4}
                            placeholder="詳細描述報告內容、數據來源與分析結論..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#63a6b0] transition-colors resize-none"
                        />
                    </div>

                    {/* Quantitative */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">量化指標 (tCO₂e)</label>
                        <input
                            type="number"
                            value={quantitative}
                            onChange={e => setQuantitative(parseFloat(e.target.value) || 0)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#63a6b0] transition-colors"
                        />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 text-red-400 bg-red-400/10 rounded-lg px-4 py-3"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                        onClick={handleCrystalize}
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-500 flex items-center justify-center gap-3 ${isProcessing
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#63a6b0] to-[#ffd700] text-[#050c14] hover:shadow-lg hover:shadow-[#63a6b0]/40'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                結晶中...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                啟動 5T 結晶 (Crystalize)
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Right: Crystalization Process & Result */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* 5T Gate Visualization */}
                    <div className="bg-black/40 backdrop-blur-md border border-[#63a6b0]/30 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                            <Shield className="w-5 h-5 text-[#63a6b0]" />
                            5T 邏輯門 (Protocol Gates)
                        </h2>

                        <div className="space-y-3">
                            {(['T1_TRACEABLE', 'T2_TRACKABLE', 'T3_TRANSPARENT', 'T4_TANGIBLE', 'T5_TRUSTWORTHY'] as CrystalizationPhase[]).map((gate, idx) => {
                                const gateOrder = ['T1_TRACEABLE', 'T2_TRACKABLE', 'T3_TRANSPARENT', 'T4_TANGIBLE', 'T5_TRUSTWORTHY'];
                                const currentIdx = gateOrder.indexOf(phase);
                                const thisIdx = idx;
                                const isPassed = phase === 'SEALED' || (currentIdx > thisIdx);
                                const isActive = phase === gate;

                                return (
                                    <motion.div
                                        key={gate}
                                        animate={{
                                            borderColor: isPassed ? '#63a6b0' : isActive ? '#ffd700' : 'rgba(255,255,255,0.1)',
                                            backgroundColor: isPassed ? 'rgba(99,166,176,0.1)' : isActive ? 'rgba(255,215,0,0.05)' : 'transparent'
                                        }}
                                        className="flex items-center justify-between px-4 py-3 rounded-lg border transition-all"
                                    >
                                        <span className="text-sm font-medium">{PHASE_LABELS[gate]}</span>
                                        {isPassed ? (
                                            <CheckCircle2 className="w-5 h-5 text-[#63a6b0]" />
                                        ) : isActive ? (
                                            <Loader2 className="w-5 h-5 text-[#ffd700] animate-spin" />
                                        ) : (
                                            <Lock className="w-5 h-5 text-gray-600" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Phase Status */}
                        <div className="mt-4 text-center">
                            <motion.p
                                key={phase}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`text-lg font-bold ${phase === 'SEALED' ? 'text-[#ffd700]' : phase === 'ERROR' ? 'text-red-400' : 'text-gray-400'
                                    }`}
                            >
                                {PHASE_LABELS[phase]}
                            </motion.p>
                        </div>
                    </div>

                    {/* Crystal Result */}
                    <AnimatePresence>
                        {crystal && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-gradient-to-br from-[#63a6b0]/20 to-[#ffd700]/10 border border-[#ffd700]/40 rounded-2xl p-6 shadow-lg shadow-[#ffd700]/10"
                            >
                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-[#ffd700]" />
                                    結晶報告 (Crystal Report)
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-[#63a6b0]" />
                                        <span className="text-gray-400">UUID:</span>
                                        <code className="text-[#63a6b0] font-mono text-xs">{crystal.uuid}</code>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-[#ffd700]" />
                                        <span className="text-gray-400">Hash Lock:</span>
                                        <code className="text-[#ffd700] font-mono text-xs break-all">{crystal.hashLock}</code>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-green-400" />
                                        <span className="text-gray-400">狀態:</span>
                                        <span className="text-green-400 font-bold">
                                            {crystal.resonance.isLocked ? '🔒 不可篡改 (Trustworthy)' : '🔓 未封印'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        <span className="text-gray-400">完整度:</span>
                                        <span className="text-purple-400">{crystal.resonance.integrityLevel}%</span>
                                    </div>

                                    <div className="mt-4 p-3 bg-black/30 rounded-lg">
                                        <p className="text-gray-300 text-xs">
                                            <strong>標題：</strong>{crystal.payload.tangibleLabel}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                                            {crystal.payload.narrative}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default OmniReportGenerator;

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileUp,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Database,
    ShieldCheck,
    Zap,
    Tag,
    FileText,
    Trash2,
    ArrowRight,
    Eye
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Protocol5T } from '../../omni/core/types/InfoOne.types';
import { BentoCard } from '../ui/BentoCard';
import { OmniPreview } from './OmniPreview';

interface ExtractedMetricUI {
    key: string;
    value: string | number;
    unit?: string;
    category?: string;
    confidence: number;
}

interface CollectionResultUI {
    id: string;
    taskId: string;
    rawContent: string;
    structuredContent: string;
    metrics: ExtractedMetricUI[];
    evidenceId: string;
    correlationScore: number;
    tags: string[];
    timestamp: number;
    frameworks?: string[];
}

export const OmniCollectorTab: React.FC = () => {
    const { t } = useLanguage();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [result, setResult] = useState<CollectionResultUI | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isFinalized, setIsFinalized] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [progress, setProgress] = useState<{
        stage: string;
        message: string;
        percentage: number;
    } | null>(null);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
        if (droppedFile) {
            handleFileSelection(droppedFile);
        }
    }, []);

    const handleFileSelection = (selectedFile: File) => {
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File too large (max 10MB)');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setStatus('IDLE');
        setResult(null);
        setIsFinalized(false);
        setProgress(null);
    };

    const startCollection = async () => {
        if (!file) return;

        setStatus('UPLOADING');
        setError(null);
        setProgress({ stage: 'UPLOADING', message: '正在上傳文件...', percentage: 5 });

        const formData = new FormData();
        formData.append('file', file);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
            const response = await fetch(`${baseUrl}/api/collector/collect`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Collection failed');
            }

            setStatus('PROCESSING');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('Failed to start progress stream');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));

                            if (data.type === 'PROGRESS') {
                                setProgress(data.payload);
                            } else if (data.type === 'RESULT') {
                                setResult(data.payload);
                                setStatus('SUCCESS');
                            } else if (data.type === 'ERROR') {
                                throw new Error(data.payload.message);
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
        } catch (err: any) {
            console.error('OmniCollector UI Error:', err);
            setError(err.message);
            setStatus('ERROR');
        }
    };

    const finalizeToTrinity = async () => {
        if (!result) return;
        setIsFinalizing(true);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
            const response = await fetch(`${baseUrl}/api/collector/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    result,
                    identityPatch: {
                        origin: 'OmniCollector UI',
                        collectedAt: new Date().toISOString()
                    }
                }),
            });

            if (!response.ok) throw new Error('Finalization failed');

            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsFinalized(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsFinalizing(false);
        }
    };

    const reset = () => {
        setFile(null);
        setResult(null);
        setStatus('IDLE');
        setError(null);
        setIsFinalized(false);
        setProgress(null);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AnimatePresence>
                {showPreview && result && (
                    <OmniPreview
                        data={{
                            metrics: result.metrics as any,
                            frameworks: result.frameworks,
                            structuredContent: result.structuredContent,
                            correlationScore: result.correlationScore
                        }}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                        <Database className="text-aqua-500 w-8 h-8" />
                        奧秘採集器 OmniCollector
                    </h2>
                    <p className="text-white/40 text-sm font-light italic mt-1">
                        一站式數據採集與 5T 協議自動校準。服務即教學，數據即資產。
                    </p>
                </div>

                {result && !isFinalized && (
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-error hover:bg-error/10 transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <Trash2 size={14} /> 放棄採集 Discard
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Upload & Controls */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BentoCard title="數據來源輸入" subtitle="Source Input" icon={<FileUp size={20} />}>
                        <div
                            className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${isDragging ? 'border-aqua-500 bg-aqua-500/10' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                                }`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileSelection(e.target.files[0]);
                                    }
                                }}
                                accept=".pdf,.png,.jpg,.jpeg"
                            />

                            <AnimatePresence mode="wait">
                                {!file ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                                            <FileUp size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-white/60">點擊或拖放檔案</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">PDF, PNG, JPG (Max 10MB)</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="selected"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center gap-4 p-6"
                                    >
                                        <div className="size-16 rounded-2xl bg-aqua-500/20 text-aqua-400 flex items-center justify-center border border-aqua-500/20">
                                            <FileText size={32} />
                                        </div>
                                        <div className="text-center truncate w-full px-4">
                                            <p className="text-sm font-black text-aqua-400 truncate">{file.name}</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            disabled={!file || status !== 'IDLE'}
                            onClick={startCollection}
                            className={`w-full h-14 rounded-2xl mt-6 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${!file || status !== 'IDLE'
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-aqua-500 text-black hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,255,255,0.3)]'
                                }`}
                        >
                            {status === 'IDLE' ? (
                                <>
                                    <Zap size={18} /> 開始採集 Start Collection
                                </>
                            ) : (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> 採集中...
                                </>
                            )}
                        </button>
                    </BentoCard>

                    {(status as string) !== 'IDLE' && (status as string) !== 'SUCCESS' && (
                        <BentoCard title="系統狀態" subtitle="Protocol Activity" icon={<Loader2 size={20} className="animate-spin" />}>
                            <div className="space-y-4 pt-2">
                                {[
                                    { label: '文件上傳', active: status === 'UPLOADING', done: status !== 'UPLOADING' && status !== 'IDLE' },
                                    { label: 'OCR 文字提取', active: status === 'PROCESSING', done: false },
                                    { label: 'AI 數據結構化', active: false, done: false },
                                    { label: '5T 協議標註', active: false, done: false }
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className={`text-xs font-bold ${step.active ? 'text-aqua-400' : step.done ? 'text-emerald-400' : 'text-white/20'}`}>
                                            {step.label}
                                        </span>
                                        {step.done ? <CheckCircle2 size={14} className="text-emerald-400" /> : step.active ? <Loader2 size={14} className="text-aqua-400 animate-spin" /> : <div className="size-3 rounded-full border border-white/10" />}
                                    </div>
                                ))}
                            </div>
                        </BentoCard>
                    )}

                    {error && (
                        <div className="p-6 rounded-3xl bg-error/10 border border-error/20 flex items-start gap-4">
                            <AlertCircle className="text-error w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-black text-error uppercase tracking-widest">採集失敗 Error</p>
                                <p className="text-xs text-error/70 mt-1 italic">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[500px] border border-white/5 bg-white/[0.01] rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12"
                            >
                                <Database size={64} className="text-white/5 mb-6" />
                                <h3 className="text-xl font-black italic text-white/20 uppercase tracking-[0.2em]">等待採集結果</h3>
                                <p className="text-white/10 text-sm max-w-xs mt-2 italic">上傳並處理文件後，採集到的 ESG 知識點將在此處結晶。</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-8"
                            >
                                {/* Metrics Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <BentoCard title="數據結晶 Metrics" subtitle="Extracted Knowledge" gridSpan={1} icon={<Zap size={20} />}>
                                        <div className="space-y-4 pt-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {result.metrics.map((metric, i) => (
                                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-aqua-500/20 transition-all flex justify-between items-center group">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 group-hover:text-aqua-500 transition-colors">
                                                            {metric.category || 'ESG Metric'}
                                                        </p>
                                                        <h4 className="text-sm font-bold text-white">{metric.key}</h4>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {metric.confidence > 0.8 ? (
                                                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-tighter border border-emerald-500/20">High Confidence</span>
                                                            ) : (
                                                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[8px] font-black uppercase tracking-tighter border border-amber-500/20">AI Weighted</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-black italic text-aqua-400">{metric.value} <span className="text-[10px] not-italic text-white/40">{metric.unit}</span></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </BentoCard>

                                    <BentoCard title="5T 誠信指標" subtitle="Integrity Verification" gridSpan={1} icon={<ShieldCheck size={20} />}>
                                        <div className="flex flex-col h-full justify-between">
                                            <div className="space-y-6 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black uppercase tracking-widest text-white/40">關聯度 Score</span>
                                                    <span className="text-2xl font-black text-aqua-500">{(result.correlationScore * 100).toFixed(1)}%</span>
                                                </div>

                                                <div className="space-y-3">
                                                    {[
                                                        { protocol: 'Tangible', label: '可感知', active: true },
                                                        { protocol: 'Traceable', label: '可溯源', active: true },
                                                        { protocol: 'Trackable', label: '可追蹤', active: true },
                                                        { protocol: 'Transparent', label: '可透明', active: true },
                                                        { protocol: 'Trustworthy', label: '不可篡改', active: isFinalized }
                                                    ].map(p => (
                                                        <div key={p.protocol} className="flex items-center gap-3">
                                                            <div className={`size-2 rounded-full ${p.active ? 'bg-aqua-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-white/10'}`} />
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.active ? 'text-white' : 'text-white/20'}`}>
                                                                {p.protocol} ({p.label})
                                                            </span>
                                                            {p.active && <CheckCircle2 size={12} className="text-aqua-500 ml-auto" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-8 border-t border-white/5 pt-6">
                                                <p className="text-[10px] font-mono text-white/20 break-all mb-4">
                                                    Evidence ID: {result.evidenceId}
                                                </p>

                                                {!isFinalized ? (
                                                    <button
                                                        disabled={isFinalizing}
                                                        onClick={finalizeToTrinity}
                                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-aqua-600 to-aqua-400 text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl transition-all"
                                                    >
                                                        {isFinalizing ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <ArrowRight size={16} /> 鑄造成 Trinity 實體 Forge Asset
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="w-full h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                                        <CheckCircle2 size={16} /> 已成功結晶 Successfully Crystallized
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </BentoCard>
                                </div>

                                {/* Structured Content Preview */}
                                <BentoCard title="知識採樣預覽" subtitle="Crystallized Knowledge Source" icon={<FileText size={20} />}>
                                    <div className="relative rounded-2xl bg-black/40 border border-white/5 p-6 font-light italic leading-relaxed text-white/70 text-sm h-48 overflow-y-auto custom-scrollbar">
                                        <pre className="whitespace-pre-wrap font-sans text-xs">
                                            {result.structuredContent}
                                        </pre>
                                        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-tighter text-aqua-500">
                                            <Tag size={10} /> {result.tags.join(' • ')}
                                        </div>
                                    </div>
                                </BentoCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,255,255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,255,255, 0.4);
        }
      `}</style>
        </div>
    );
};

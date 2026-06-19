'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Upload, File, CheckCircle2, XCircle, Link2, Sparkles } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { IComponentCore } from '@/core/IComponentCore';
import { motion, AnimatePresence } from 'framer-motion';

interface EvidenceFile {
    id: string;
    name: string;
    size: number;
    type: string;
    hashSha256?: string;
    uploadedAt: number;
    status: 'processing' | 'verified' | 'error';
}

interface EvidenceUploaderProps {
    reportId: string;
    onUpload?: (files: EvidenceFile[]) => void;
    onAiScan?: (file: EvidenceFile) => void;
    scanningFileId?: string | null; // Phase 6: 外部掃描狀態
}

/** SHA-256 hash of an ArrayBuffer (browser-native SubtleCrypto) */
async function computeSha256(buffer: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EvidenceUploader({ reportId, onUpload, onAiScan, scanningFileId }: EvidenceUploaderProps) {
    const [files, setFiles] = useState<EvidenceFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    // [Task 7.3] 監聽溯源高亮事件
    useEffect(() => {
        const handleHighlight = (e: any) => {
            const { evidenceId } = e.detail;
            setHighlightedId(evidenceId);
            setTimeout(() => setHighlightedId(null), 3000);
        };
        window.addEventListener('omni:highlight-evidence', handleHighlight);
        return () => window.removeEventListener('omni:highlight-evidence', handleHighlight);
    }, []);

    const editorCore: IComponentCore = {
        uuid: `evidence-uploader-${reportId}`,
        version: '1.0.0',
        timestamp: Date.now(),
        evidence: [], // EvidenceVaultUrl[] — 上傳後由父元件更新
        hash_lock: '',
        status: 'Tangible',
        isFrozen: false,
    };

    const processFile = useCallback(async (file: globalThis.File) => {
        const id = `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newFile: EvidenceFile = {
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: Date.now(),
            status: 'processing',
        };

        setFiles(prev => [...prev, newFile]);

        try {
            const buffer = await file.arrayBuffer();
            const hash = await computeSha256(buffer);
            setFiles(prev => prev.map(f =>
                f.id === id ? { ...f, hashSha256: hash, status: 'verified' } : f
            ));
        } catch {
            setFiles(prev => prev.map(f =>
                f.id === id ? { ...f, status: 'error' } : f
            ));
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        Array.from(e.dataTransfer.files).forEach(processFile);
    }, [processFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        Array.from(e.target.files ?? []).forEach(processFile);
    }, [processFile]);

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <LiquidGlassContainer coreContext={editorCore} stitchId="evidence-uploader">
            <div className="space-y-4 p-1">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white/30 border-b border-white/5 pb-3">
                    <Link2 size={13} />
                    Evidence Vault 佐證文件庫
                </div>

                {/* 拖曳上傳區 */}
                <label
                    className={`block relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${isDragging
                        ? 'border-omni-primary/60 bg-omni-primary/10 scale-[1.01]'
                        : 'border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5'
                        }`}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileInput}
                    />
                    <div className="p-8 flex flex-col items-center gap-3 text-center pointer-events-none">
                        <div className="p-3 rounded-2xl bg-white/5">
                            <Upload size={24} className={isDragging ? 'text-omni-primary' : 'text-white/25'} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white/50">拖曳文件或點擊上傳</p>
                            <p className="text-[10px] font-mono text-white/20 mt-1">PDF · XLSX · CSV · JPG · PNG · 每檔最大 20MB</p>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-omni-primary/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-omni-primary/50 animate-pulse" />
                            SHA-256 自動雜湊驗證
                        </div>
                    </div>
                </label>

                {/* 文件列表 */}
                <AnimatePresence>
                    {files.map(f => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: highlightedId === f.id ? 1.02 : 1,
                                borderColor: highlightedId === f.id ? 'var(--theme-primary-muted)' : 'rgba(255, 255, 255, 0.08)',
                                backgroundColor: highlightedId === f.id ? 'var(--theme-primary-muted)' : 'rgba(255, 255, 255, 0.05)'
                            }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-start gap-3 p-3 rounded-xl border transition-all duration-500 group"
                        >
                            <div className="mt-0.5 flex-shrink-0">
                                {f.status === 'processing' && (
                                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-omni-primary animate-spin" />
                                )}
                                {f.status === 'verified' && scanningFileId !== f.id && (
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                )}
                                {f.status === 'verified' && scanningFileId === f.id && (
                                    <div className="relative">
                                        <Sparkles size={16} className="text-omni-primary animate-pulse" />
                                        <div className="absolute inset-0 bg-omni-primary/20 blur-sm rounded-full animate-ping" />
                                    </div>
                                )}
                                {f.status === 'error' && (
                                    <XCircle size={16} className="text-rose-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white/80 truncate">{f.name}</p>
                                <p className="text-[10px] font-mono text-white/25 mt-0.5">{formatBytes(f.size)}</p>
                                {f.hashSha256 && (
                                    <p className="text-[9px] font-mono text-emerald-500/50 mt-1 truncate">
                                        🔒 {f.hashSha256.slice(0, 20)}…
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {f.status === 'verified' && (
                                    <button
                                        onClick={() => onAiScan?.(f)}
                                        disabled={!!scanningFileId}
                                        className={`p-1.5 rounded-lg transition-all group/btn ${scanningFileId === f.id
                                            ? 'bg-omni-primary/20 text-omni-primary ring-2 ring-omni-primary/50'
                                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                            } ${scanningFileId && scanningFileId !== f.id ? 'opacity-20 translate-x-1 cursor-not-allowed' : ''}`}
                                        title="AI 智能提取數據"
                                    >
                                        <Sparkles size={14} className={scanningFileId === f.id ? 'animate-spin' : 'group-hover/btn:scale-110 transition-transform'} />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeFile(f.id)}
                                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-rose-400 transition-all text-xs p-1.5"
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {files.length > 0 && (
                    <p className="text-[10px] font-mono text-white/20 text-center">
                        {files.filter(f => f.status === 'verified').length} / {files.length} 份文件已哈希驗證
                    </p>
                )}
            </div>
        </LiquidGlassContainer>
    );
}

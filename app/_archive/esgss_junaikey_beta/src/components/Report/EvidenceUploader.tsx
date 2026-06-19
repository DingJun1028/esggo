import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ShieldCheck, FileIcon, AlertCircle, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export interface EvidenceFile {
    id: string;
    file: File;
    status: 'uploading' | 'completed' | 'error';
    progress: number;
}

interface EvidenceUploaderProps {
    onUploadComplete: (assetId: string) => void;
    label?: string;
}

const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ onUploadComplete, label = "上傳佐證資料 (Voucher)" }) => {
    const [files, setFiles] = useState<EvidenceFile[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(f => ({
            id: Math.random().toString(36).substring(7),
            file: f,
            status: 'uploading' as const,
            progress: 0
        }));
        setFiles(prev => [...prev, ...newFiles]);

        // Simulate upload
        newFiles.forEach(nf => {
            let p = 0;
            const interval = setInterval(() => {
                p += 20;
                setFiles(prev => prev.map(f => f.id === nf.id ? { ...f, progress: p } : f));
                if (p >= 100) {
                    clearInterval(interval);
                    setFiles(prev => prev.map(f => f.id === nf.id ? { ...f, status: 'completed' } : f));
                    onUploadComplete(`evid-${nf.id}`);
                }
            }, 300);
        });
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${isDragActive ? 'border-[#63a6b0] bg-[#63a6b0]/10 scale-95' : 'border-white/10 hover:border-[#63a6b0]/50 bg-white/[0.02]'
                    }`}
            >
                <input {...getInputProps()} />
                <div className={`p-3 rounded-xl transition-all ${isDragActive ? 'bg-[#63a6b0] text-slate-950' : 'bg-white/5 text-white/40 group-hover:text-[#63a6b0]'}`}>
                    <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-[#63a6b0] mb-1">{label}</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-tighter">拖拽或點擊上傳 (JPG, PNG, PDF)</p>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        {files.map((f) => (
                            <div key={f.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-[#63a6b0]/10 rounded-lg flex items-center justify-center text-[#63a6b0]">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="max-w-[150px]">
                                        <p className="text-xs font-bold truncate text-white/80">{f.file.name}</p>
                                        <p className="text-[9px] text-white/20 uppercase font-black">{(f.file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {f.status === 'uploading' ? (
                                        <div className="size-5 rounded-full border-2 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#63a6b0]/20 border border-[#63a6b0]/40 text-[#63a6b0] text-[8px] font-black uppercase tracking-tighter">
                                                <ShieldCheck className="w-3 h-3" />
                                                Traceable
                                            </div>
                                            <button
                                                onClick={() => removeFile(f.id)}
                                                className="text-white/20 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EvidenceUploader;

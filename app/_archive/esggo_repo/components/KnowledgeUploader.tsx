'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSustainWriteStore } from '../store/useSustainWriteStore';

interface KnowledgeUploaderProps {
    onUploadSuccess?: () => void;
}

export function KnowledgeUploader({ onUploadSuccess }: KnowledgeUploaderProps) {
    const companyId = useSustainWriteStore(state => state.companyId);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setUploadStatus({ type: 'error', message: '目前僅支援上傳 PDF 格式的檔案' });
            return;
        }

        setIsUploading(true);
        setUploadStatus({ type: 'idle', message: '上傳並解析中...' });

        // 利用 FormData 打包檔案與參數
        const formData = new FormData();
        formData.append('file', file);
        formData.append('companyId', companyId);

        try {
            const res = await fetch('/api/ai/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                setUploadStatus({
                    type: 'success',
                    message: `上傳成功！檔案已被解析並切割為 ${result.chunksProcessed} 個知識記憶區塊，已同步至向量資料庫。`
                });
                // 觸發重新整列表
                if (onUploadSuccess) onUploadSuccess();
            } else {
                setUploadStatus({ type: 'error', message: result.error || '解析失敗' });
            }
        } catch (error) {
            console.error('[KnowledgeUploader] Upload Error:', error);
            setUploadStatus({ type: 'error', message: '網路連線異常，請稍後再試' });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // 清空 input 狀態
            }
        }
    };

    return (
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Database size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">企業智庫上傳 (RAG)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                上傳企業過往的永續報告書、內部政策或相關法規 (PDF)。OmniAgent 將會透過向量化學習這些內容，並在擴寫時自動引用最相關的段落，確保生成內容具備「企業主權」。
            </p>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        id="knowledge-upload"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="knowledge-upload"
                        className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 border shadow-sm ${isUploading
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer active:scale-95'
                            }`}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin" />
                                <span>Processing_Knowledge...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                <span>選擇 PDF 知識文件</span>
                            </>
                        )}
                    </label>
                </div>

                {uploadStatus.type !== 'idle' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl text-xs font-bold leading-relaxed border ${uploadStatus.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}
                    >
                        <div className="flex gap-2">
                            {uploadStatus.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                            {uploadStatus.message}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

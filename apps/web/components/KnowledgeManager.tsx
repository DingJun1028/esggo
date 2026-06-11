'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, Layers, RefreshCw, Trash2 } from 'lucide-react';
import { useSustainWriteStore } from '../store/useSustainWriteStore';
import { KnowledgeUploader } from './KnowledgeUploader';

interface KnowledgeFile {
    title: string;
    chunks: number;
    createdAt: string;
}

export function KnowledgeManager() {
    const companyId = useSustainWriteStore(state => state.companyId);
    const [files, setFiles] = useState<KnowledgeFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingTitle, setDeletingTitle] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/knowledge/list?companyId=${companyId}`);
            const data = await res.json();
            if (data.success) {
                setFiles(data.files);
            }
        } catch (error) {
            console.error('Failed to fetch knowledge files:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId]);

    const handleDelete = async (title: string) => {
        if (!confirm(`確定要刪除「${title}」嗎？這將會從向量資料庫中移除所有相關的知識區塊，且無法復原。`)) return;

        setDeletingTitle(title);
        try {
            const res = await fetch('/api/knowledge/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId, title })
            });
            const data = await res.json();

            if (data.success) {
                await fetchFiles(); // 刪除成功後重新拉取列表
            } else {
                alert(data.error || '刪除失敗');
            }
        } catch (error) {
            console.error('Failed to delete knowledge file:', error);
            alert('網路連線異常，請稍後再試');
        } finally {
            setDeletingTitle(null);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return (
        <div className="space-y-6">
            {/* 上傳區塊，傳入 onUploadSuccess 以便上傳後自動重整列表 */}
            <KnowledgeUploader onUploadSuccess={fetchFiles} />

            {/* 檔案列表區塊 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">已入庫文件</h3>
                        <p className="text-xs text-slate-500 mt-1">目前 Firestore 向量資料庫中可供 OmniAgent 檢索的文獻</p>
                    </div>
                    <button
                        onClick={fetchFiles}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="重新整理"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <FileText size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-600">尚無任何知識庫文件</p>
                        <p className="text-xs text-slate-400 mt-1">請使用上方工具上傳企業 PDF</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white rounded-xl text-indigo-500 shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{file.title}</p>
                                        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-500">
                                            <span className="flex items-center gap-1"><Layers size={12} className="text-slate-400" /> {file.chunks} 個知識區塊</span>
                                            <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {new Date(file.createdAt).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-emerald-100">
                                        ACTIVE
                                    </div>
                                    <button
                                        onClick={() => handleDelete(file.title)}
                                        disabled={deletingTitle === file.title}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        title="刪除此文件"
                                    >
                                        {deletingTitle === file.title ? (
                                            <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
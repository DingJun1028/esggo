'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSustainWriteStore } from '../store/useSustainWriteStore';
export function KnowledgeUploader({ onUploadSuccess }) {
    const companyId = useSustainWriteStore(state => state.companyId);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({ type: 'idle', message: '' });
    const fileInputRef = useRef(null);
    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
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
                if (onUploadSuccess)
                    onUploadSuccess();
            }
            else {
                setUploadStatus({ type: 'error', message: result.error || '解析失敗' });
            }
        }
        catch (error) {
            console.error('[KnowledgeUploader] Upload Error:', error);
            setUploadStatus({ type: 'error', message: '網路連線異常，請稍後再試' });
        }
        finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // 清空 input 狀態
            }
        }
    };
    return (_jsxs("div", { className: "p-6 bg-white border border-slate-200 rounded-xl shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "p-2 bg-indigo-50 rounded-lg text-indigo-600", children: _jsx(Database, { size: 20 }) }), _jsx("h3", { className: "text-lg font-black text-slate-800 uppercase tracking-tight", children: "\u4F01\u696D\u667A\u5EAB\u4E0A\u50B3 (RAG)" })] }), _jsx("p", { className: "text-xs text-slate-500 mb-6 leading-relaxed", children: "\u4E0A\u50B3\u4F01\u696D\u904E\u5F80\u7684\u6C38\u7E8C\u5831\u544A\u66F8\u3001\u5167\u90E8\u653F\u7B56\u6216\u76F8\u95DC\u6CD5\u898F (PDF)\u3002OmniAgent \u5C07\u6703\u900F\u904E\u5411\u91CF\u5316\u5B78\u7FD2\u9019\u4E9B\u5167\u5BB9\uFF0C\u4E26\u5728\u64F4\u5BEB\u6642\u81EA\u52D5\u5F15\u7528\u6700\u76F8\u95DC\u7684\u6BB5\u843D\uFF0C\u78BA\u4FDD\u751F\u6210\u5167\u5BB9\u5177\u5099\u300C\u4F01\u696D\u4E3B\u6B0A\u300D\u3002" }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "file", accept: "application/pdf", ref: fileInputRef, onChange: handleUpload, className: "hidden", id: "knowledge-upload", disabled: isUploading }), _jsx("label", { htmlFor: "knowledge-upload", className: `px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 border shadow-sm ${isUploading
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                    : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer active:scale-95'}`, children: isUploading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin" }), _jsx("span", { children: "Processing_Knowledge..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Upload, { size: 16 }), _jsx("span", { children: "\u9078\u64C7 PDF \u77E5\u8B58\u6587\u4EF6" })] })) })] }), uploadStatus.type !== 'idle' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `p-4 rounded-xl text-xs font-bold leading-relaxed border ${uploadStatus.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'}`, children: _jsxs("div", { className: "flex gap-2", children: [uploadStatus.type === 'success' ? _jsx(CheckCircle, { size: 14 }) : _jsx(AlertTriangle, { size: 14 }), uploadStatus.message] }) }))] })] }));
}
//# sourceMappingURL=KnowledgeUploader.js.map
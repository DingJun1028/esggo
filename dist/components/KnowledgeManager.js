'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, Layers, RefreshCw, Trash2 } from 'lucide-react';
import { useSustainWriteStore } from '../store/useSustainWriteStore';
import { KnowledgeUploader } from './KnowledgeUploader';
export function KnowledgeManager() {
    const companyId = useSustainWriteStore(state => state.companyId);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingTitle, setDeletingTitle] = useState(null);
    const fetchFiles = useCallback(async () => {
        if (!companyId)
            return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/knowledge/list?companyId=${companyId}`);
            const data = await res.json();
            if (data.success) {
                setFiles(data.files);
            }
        }
        catch (error) {
            console.error('Failed to fetch knowledge files:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [companyId]);
    const handleDelete = async (title) => {
        if (!confirm(`確定要刪除「${title}」嗎？這將會從向量資料庫中移除所有相關的知識區塊，且無法復原。`))
            return;
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
            }
            else {
                alert(data.error || '刪除失敗');
            }
        }
        catch (error) {
            console.error('Failed to delete knowledge file:', error);
            alert('網路連線異常，請稍後再試');
        }
        finally {
            setDeletingTitle(null);
        }
    };
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(KnowledgeUploader, { onUploadSuccess: fetchFiles }), _jsxs("div", { className: "p-6 bg-white border border-slate-200 rounded-xl shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-black text-slate-800 uppercase tracking-tight", children: "\u5DF2\u5165\u5EAB\u6587\u4EF6" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "\u76EE\u524D Firestore \u5411\u91CF\u8CC7\u6599\u5EAB\u4E2D\u53EF\u4F9B OmniAgent \u6AA2\u7D22\u7684\u6587\u737B" })] }), _jsx("button", { onClick: fetchFiles, className: "p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors", title: "\u91CD\u65B0\u6574\u7406", children: _jsx(RefreshCw, { size: 18, className: isLoading ? "animate-spin" : "" }) })] }), isLoading ? (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx("div", { className: "w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" }) })) : files.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200", children: [_jsx(FileText, { size: 32, className: "mx-auto text-slate-300 mb-3" }), _jsx("p", { className: "text-sm font-medium text-slate-600", children: "\u5C1A\u7121\u4EFB\u4F55\u77E5\u8B58\u5EAB\u6587\u4EF6" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "\u8ACB\u4F7F\u7528\u4E0A\u65B9\u5DE5\u5177\u4E0A\u50B3\u4F01\u696D PDF" })] })) : (_jsx("div", { className: "grid gap-3", children: files.map((file, idx) => (_jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-2.5 bg-white rounded-xl text-indigo-500 shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-colors", children: _jsx(FileText, { size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors", children: file.title }), _jsxs("div", { className: "flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Layers, { size: 12, className: "text-slate-400" }), " ", file.chunks, " \u500B\u77E5\u8B58\u5340\u584A"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12, className: "text-slate-400" }), " ", new Date(file.createdAt).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })] })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-emerald-100", children: "ACTIVE" }), _jsx("button", { onClick: () => handleDelete(file.title), disabled: deletingTitle === file.title, className: "p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50", title: "\u522A\u9664\u6B64\u6587\u4EF6", children: deletingTitle === file.title ? (_jsx("div", { className: "w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" })) : (_jsx(Trash2, { size: 16 })) })] })] }, idx))) }))] })] }));
}
//# sourceMappingURL=KnowledgeManager.js.map
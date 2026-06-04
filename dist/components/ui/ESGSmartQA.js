import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Send, Bot, User, BookOpen, Loader2, UploadCloud, ThumbsUp, ThumbsDown, Download } from 'lucide-react';
import { motion } from 'framer-motion';
export const ESGSmartQA = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState({});
    const fileInputRef = useRef(null);
    const handleSend = async () => {
        if (!query.trim() || isLoading || isStreaming || isUploading)
            return;
        const newQuery = query;
        setQuery('');
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: newQuery }]);
        setIsLoading(true);
        // 提取歷史對話作為語意記憶 (Semantic Memory)
        const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));
        try {
            const res = await fetch('/api/rag/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: newQuery, history: historyForApi })
            });
            const data = await res.json();
            setIsLoading(false);
            setIsStreaming(true);
            const botMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: '' }]);
            let i = 0;
            const fullText = data.answer || '未能取得有效回應。';
            const interval = setInterval(() => {
                setMessages(prev => prev.map(msg => {
                    if (msg.id === botMsgId) {
                        const nextText = fullText.substring(0, i + 1);
                        const isDone = i + 1 >= fullText.length;
                        return {
                            ...msg,
                            text: nextText,
                            sources: isDone ? data.sources : undefined
                        };
                    }
                    return msg;
                }));
                i++;
                if (i >= fullText.length) {
                    clearInterval(interval);
                    setIsStreaming(false);
                }
            }, 30);
        }
        catch (e) {
            setIsLoading(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: '系統發生震盪，無法連線至 OmniAgent 知識庫。' }]);
        }
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setIsUploading(true);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: `正在解析文獻：${file.name}...` }]);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/rag/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: `✅ 檔案 \`${data.fileName}\` 解析成功！已將文本切割為 ${data.chunksCount} 個向量區塊 (Chunks) 並寫入 OmniVector Store。現在您可以針對該文件進行問答。` }]);
            }
            else {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: `❌ 檔案上傳失敗：${data.error}` }]);
            }
        }
        catch (err) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: '系統發生震盪，無法上傳文獻。' }]);
        }
        finally {
            setIsUploading(false);
            if (fileInputRef.current)
                fileInputRef.current.value = ''; // 重置 input
        }
    };
    const handleFeedback = async (messageId, feedback, queryText, answerText) => {
        setFeedbackStatus(prev => ({ ...prev, [messageId]: feedback }));
        try {
            await fetch('/api/rag/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId, query: queryText, answer: answerText, feedback })
            });
        }
        catch (error) {
            console.error('[Evolution Loop] Feedback failed:', error);
        }
    };
    const handleExportPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('請允許彈出視窗以匯出 PDF 稽核軌跡。');
            return;
        }
        const htmlContent = `
            <html>
            <head>
                <title>ESG GO - RAG 稽核軌跡紀錄</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .message { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
                    .user { background-color: #f0f7ff; border-left: 4px solid #0ea5e9; }
                    .bot { background-color: #f8fafc; border-left: 4px solid #64748b; }
                    .role { font-weight: bold; margin-bottom: 8px; font-size: 0.9em; text-transform: uppercase; }
                    .user .role { color: #0ea5e9; }
                    .bot .role { color: #64748b; }
                    .sources { margin-top: 10px; font-size: 0.85em; color: #10b981; font-weight: 600; }
                    .footer { margin-top: 50px; font-size: 0.8em; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ESG GO - OmniAgent 知識庫稽核軌跡 (Audit Log)</h1>
                    <p>匯出時間：${new Date().toLocaleString()}</p>
                    <p>此文件詳實記錄 RAG 引擎對話與文獻溯源 (5T Protocol - Traceable Record)</p>
                </div>
                ${messages.filter(msg => msg.id !== 'welcome').map(msg => `
                    <div class="message ${msg.role}">
                        <div class="role">${msg.role === 'user' ? '👤 稽核人員 (User)' : '🤖 OmniAgent (System)'}</div>
                        <div>${msg.text.replace(/\n/g, '<br/>')}</div>
                        ${msg.sources && msg.sources.length > 0 ? `<div class="sources">📎 溯源文獻：${msg.sources.map(s => `${s.title} (${(s.score * 100).toFixed(0)}%)`).join('、 ')}</div>` : ''}
                    </div>
                `).join('')}
                <div class="footer">ESG GO Sovereign Governance Operating System</div>
            </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        // 等待資源載入後觸發列印，並於完成後自動關閉視窗
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            setTimeout(() => printWindow.close(), 500);
        };
    };
    return (_jsxs("div", { className: "flex flex-col h-[400px] bg-black/20 rounded-xl border border-white/5 overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl pointer-events-none" }), _jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest uppercase", children: [_jsx(Bot, { size: 14, className: "text-blue-400" }), "OmniAgent Knowledge Interface"] }), _jsxs("button", { onClick: handleExportPDF, disabled: messages.length === 0, className: "flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed", title: "\u532F\u51FA\u5C0D\u8A71\u7D00\u9304 (PDF)", children: [_jsx(Download, { size: 12 }), "\u532F\u51FA\u7A3D\u6838\u8ECC\u8DE1"] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar relative z-10", children: [messages.length === 0 && (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2", children: [_jsx(Bot, { size: 32, className: "text-blue-500/50" }), _jsx("p", { children: "\u5DF2\u9023\u7DDA\u81F3 RAG \u6C38\u7E8C\u77E5\u8B58\u5EAB\u3002\u60A8\u53EF\u4EE5\u8A62\u554F CBAM\u3001GRI \u6216 TCFD \u76F8\u95DC\u898F\u7BC4..." })] })), messages.map((msg) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: `flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`, children: [_jsx("div", { className: `p-2 rounded-full h-fit border ${msg.role === 'user' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`, children: msg.role === 'user' ? _jsx(User, { size: 16 }) : _jsx(Bot, { size: 16 }) }), _jsxs("div", { className: `flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`, children: [_jsx("div", { className: `px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500/10 text-cyan-50 border border-cyan-500/20 rounded-tr-sm' : 'bg-slate-800/50 text-slate-200 border border-white/10 rounded-tl-sm backdrop-blur-sm'}`, children: msg.text }), msg.sources && msg.sources.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: msg.sources.map((src, idx) => (_jsxs("div", { className: "flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-400 shadow-sm", children: [_jsx(BookOpen, { size: 10, className: "text-emerald-400" }), src.title, " ", _jsxs("span", { className: "opacity-50", children: ["(", (src.score * 100).toFixed(0), "%)"] })] }, idx))) })), msg.role === 'bot' && msg.id !== 'welcome' && (_jsxs("div", { className: "flex items-center gap-2 mt-1 opacity-60 hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => handleFeedback(msg.id, 'good', messages[messages.findIndex(m => m.id === msg.id) - 1]?.text || '', msg.text), className: `p-1 rounded hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors ${feedbackStatus[msg.id] === 'good' ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400'}`, title: "\u9019\u56DE\u7B54\u6709\u5E6B\u52A9 (\u89F8\u767C\u9032\u5316\u74B0\u540C\u6B65)", children: _jsx(ThumbsUp, { size: 12 }) }), _jsx("button", { onClick: () => handleFeedback(msg.id, 'bad', messages[messages.findIndex(m => m.id === msg.id) - 1]?.text || '', msg.text), className: `p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 transition-colors ${feedbackStatus[msg.id] === 'bad' ? 'text-rose-400 bg-rose-500/20' : 'text-slate-400'}`, title: "\u9019\u56DE\u7B54\u9700\u8981\u6539\u9032", children: _jsx(ThumbsDown, { size: 12 }) })] }))] })] }, msg.id))), isLoading && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex gap-3", children: [_jsx("div", { className: "p-2 rounded-full h-fit bg-blue-500/10 text-blue-400 border border-blue-500/20", children: _jsx(Bot, { size: 16 }) }), _jsxs("div", { className: "px-4 py-2.5 rounded-2xl text-sm bg-slate-800/50 text-slate-300 border border-white/10 rounded-tl-sm flex items-center gap-3 backdrop-blur-sm", children: [_jsx(Loader2, { size: 14, className: "animate-spin text-blue-400" }), " \u6AA2\u7D22\u5411\u91CF\u77E5\u8B58\u5EAB\u4E2D..."] })] }))] }), _jsx("div", { className: "p-3 bg-black/40 border-t border-white/10 relative z-10", children: _jsxs("div", { className: "flex items-center gap-2 relative", children: [_jsx("input", { type: "file", accept: ".pdf", className: "hidden", ref: fileInputRef, onChange: handleFileUpload }), _jsx("button", { onClick: () => fileInputRef.current?.click(), disabled: isLoading || isStreaming || isUploading, className: "p-2.5 bg-[#020617] border border-white/10 text-slate-400 rounded-full hover:text-cyan-400 hover:border-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0", title: "\u4E0A\u50B3 PDF \u64F4\u5145\u77E5\u8B58\u5EAB", children: isUploading ? _jsx(Loader2, { size: 16, className: "animate-spin text-cyan-400" }) : _jsx(UploadCloud, { size: 16 }) }), _jsx("input", { type: "text", value: query, onChange: e => setQuery(e.target.value), onKeyDown: e => e.key === 'Enter' && handleSend(), placeholder: "\u8F38\u5165 ESG \u77E5\u8B58\u6AA2\u7D22\u610F\u5716...", disabled: isLoading || isStreaming || isUploading, className: "flex-1 bg-[#020617] border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner disabled:opacity-50" }), _jsx("button", { onClick: handleSend, disabled: !query.trim() || isLoading || isStreaming || isUploading, className: "absolute right-2 p-1.5 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30", children: _jsx(Send, { size: 16, className: isLoading || isStreaming ? 'opacity-0' : 'opacity-100' }) })] }) })] }));
};
//# sourceMappingURL=ESGSmartQA.js.map
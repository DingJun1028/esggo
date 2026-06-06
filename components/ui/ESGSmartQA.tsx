import React, { useState, useRef } from 'react';
import { Send, Bot, User, BookOpen, Loader2, UploadCloud, ThumbsUp, ThumbsDown, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface RagSource {
  title: string;
  score: number;
}

export const ESGSmartQA = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<{ id: string, role: 'user' | 'bot', text: string, sources?: RagSource[] }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'good' | 'bad'>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = async () => {
        if (!query.trim() || isLoading || isStreaming || isUploading) return;
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
        } catch (e) {
            setIsLoading(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: '系統發生震盪，無法連線至 OmniAgent 知識庫。' }]);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
            } else {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: `❌ 檔案上傳失敗：${data.error}` }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: '系統發生震盪，無法上傳文獻。' }]);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // 重置 input
        }
    };

    const handleFeedback = async (messageId: string, feedback: 'good' | 'bad', queryText: string, answerText: string) => {
        setFeedbackStatus(prev => ({ ...prev, [messageId]: feedback }));

        try {
            await fetch('/api/rag/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId, query: queryText, answer: answerText, feedback })
            });
        } catch (error) {
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

    return (
        <div className="flex flex-col h-[400px] bg-black/20 rounded-xl border border-white/5 overflow-hidden relative">
            {/* 神經形態背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl pointer-events-none" />

            {/* 工具列 Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40 relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest uppercase">
                    <Bot size={14} className="text-blue-400" />
                    OmniAgent Knowledge Interface
                </div>
                <button
                    onClick={handleExportPDF}
                    disabled={messages.length === 0}
                    className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="匯出對話紀錄 (PDF)"
                >
                    <Download size={12} />
                    匯出稽核軌跡
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar relative z-10">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                        <Bot size={32} className="text-blue-500/50" />
                        <p>已連線至 RAG 永續知識庫。您可以詢問 CBAM、GRI 或 TCFD 相關規範...</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`p-2 rounded-full h-fit border ${msg.role === 'user' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500/10 text-cyan-50 border border-cyan-500/20 rounded-tr-sm' : 'bg-slate-800/50 text-slate-200 border border-white/10 rounded-tl-sm backdrop-blur-sm'}`}>
                                {msg.text}
                            </div>
                            {/* RAG 來源標註 */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {msg.sources.map((src, idx) => (
                                        <div key={idx} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-400 shadow-sm">
                                            <BookOpen size={10} className="text-emerald-400" />
                                            {src.title} <span className="opacity-50">({(src.score * 100).toFixed(0)}%)</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Evolution Loop 萬能進化環回饋 */}
                            {msg.role === 'bot' && msg.id !== 'welcome' && (
                                <div className="flex items-center gap-2 mt-1 opacity-60 hover:opacity-100 transition-opacity">
                                    <button
                                        aria-label="這回答有幫助"
                                        onClick={() => handleFeedback(msg.id, 'good', messages[messages.findIndex(m => m.id === msg.id) - 1]?.text || '', msg.text)}
                                        className={`p-1 rounded hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${feedbackStatus[msg.id] === 'good' ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400'}`}
                                        title="這回答有幫助 (觸發進化環同步)"
                                    >
                                        <ThumbsUp size={12} />
                                    </button>
                                    <button
                                        aria-label="這回答需要改進"
                                        onClick={() => handleFeedback(msg.id, 'bad', messages[messages.findIndex(m => m.id === msg.id) - 1]?.text || '', msg.text)}
                                        className={`p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${feedbackStatus[msg.id] === 'bad' ? 'text-rose-400 bg-rose-500/20' : 'text-slate-400'}`}
                                        title="這回答需要改進"
                                    >
                                        <ThumbsDown size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="p-2 rounded-full h-fit bg-blue-500/10 text-blue-400 border border-blue-500/20"><Bot size={16} /></div>
                        <div className="px-4 py-2.5 rounded-2xl text-sm bg-slate-800/50 text-slate-300 border border-white/10 rounded-tl-sm flex items-center gap-3 backdrop-blur-sm">
                            <Loader2 size={14} className="animate-spin text-blue-400" /> 檢索向量知識庫中...
                        </div>
                    </motion.div>
                )}
            </div>

            {/* 輸入區 */}
            <div className="p-3 bg-black/40 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-2 relative">
                    <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <button
                        aria-label="上傳 PDF 擴充知識庫"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isStreaming || isUploading}
                        className="p-2.5 bg-[#020617] border border-white/10 text-slate-400 rounded-full hover:text-cyan-400 hover:border-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        title="上傳 PDF 擴充知識庫"
                    >
                        {isUploading ? <Loader2 size={16} className="animate-spin text-cyan-400" /> : <UploadCloud size={16} />}
                    </button>

                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="輸入 ESG 知識檢索意圖..."
                        disabled={isLoading || isStreaming || isUploading}
                        className="flex-1 bg-[#020617] border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner disabled:opacity-50"
                    />
                    <button
                        aria-label="發送訊息"
                        onClick={handleSend}
                        disabled={!query.trim() || isLoading || isStreaming || isUploading}
                        className="absolute right-2 p-1.5 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                        <Send size={16} className={isLoading || isStreaming ? 'opacity-0' : 'opacity-100'} />
                    </button>
                </div>
            </div>
        </div>
    );
};

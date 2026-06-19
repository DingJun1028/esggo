
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
    StickyNote, Zap, Brain, Sparkles, Filter, Plus, Save, 
    ArrowRight, Loader2, Database, Code, ShieldCheck, 
    Layout, Layers, History, Terminal, X, Trash2, 
    CheckCircle2, Flame, GitBranch, PenTool, MessageSquare,
    Palette, BookOpen, Target, Activity, ChevronRight, Info,
    FileText, Lightbulb, Compass, Send, RefreshCw, Search,
    SearchX, Copy, Download, Image as ImageIcon, ExternalLink,
    FileDown, FileType, Check, Maximize2, Edit3, Atom
} from 'lucide-react';
import { Language, NoteItem, NoteLevel, QuantumNode } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { streamChat, generateNoteSummary } from '../services/ai-service';
import { universalIntelligence } from '../services/evolutionEngine';
import { marked } from 'marked';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const LEVEL_CONFIG = {
    L1: { label: '快速擷取層', color: 'text-gray-400', bg: 'bg-white/5', icon: Zap, desc: '捕捉關鍵信息與初步反應' },
    L2: { label: '結構整理層', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Layout, desc: '組織信息並建立 MECE 關聯' },
    L3: { label: '深度分析層', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Brain, desc: '批判性思考與多角度解析' },
    L4: { label: '實踐轉化層', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Target, desc: '轉化知識為 SMART 行動計畫' },
    L5: { label: '元認知層', color: 'text-celestial-gold', bg: 'bg-amber-500/10', icon: Sparkles, desc: '反思學習過程與系統迭代' }
};

export const UniversalNotes: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const { universalNotes, addNote, deleteNote, updateNote, companyName } = useCompany();
    const { activePersona } = useUniversalAgent();

    const [activeLevel, setActiveLevel] = useState<NoteLevel | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [noteDraft, setNoteDraft] = useState({ title: '', content: '', level: 'L1' as NoteLevel });
    const [editBuffer, setEditBuffer] = useState({ title: '', content: '' });
    const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
    const [viewMode, setViewMode] = useState<'manifested' | 'raw'>('manifested');
    
    // RAG State
    const [ragNodes, setRagNodes] = useState<QuantumNode[]>([]);
    const [isRagLoading, setIsRagLoading] = useState(false);
    
    const searchInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Clear RAG results if search is cleared
    useEffect(() => {
        if (!searchQuery) {
            setRagNodes([]);
        }
    }, [searchQuery]);

    const filteredNotes = useMemo(() => {
        return universalNotes.filter(n => {
            const matchesLevel = activeLevel === 'All' || n.level === activeLevel;
            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesLevel;
            
            const matchesSearch = 
                (n.title?.toLowerCase().includes(q)) || 
                (n.content.toLowerCase().includes(q)) || 
                (n.tags?.some(t => t.toLowerCase().includes(q)));
            
            return matchesLevel && matchesSearch;
        });
    }, [universalNotes, activeLevel, searchQuery]);

    const handleDeepRetrieval = () => {
        if (!searchQuery.trim()) return;
        setIsRagLoading(true);
        addToast('info', isZh ? '正在啟動量子向量檢索 (RAG)...' : 'Initiating Quantum Vector Retrieval (RAG)...', 'Infinity Engine');

        // Simulate async RAG latency for UX
        setTimeout(() => {
            try {
                // Split query into keywords for the vector search simulation
                const keywords = searchQuery.split(/\s+/);
                const nodes = universalIntelligence.retrieveContextualNodes({ keywords });
                
                setRagNodes(nodes);
                
                if (nodes.length > 0) {
                    addToast('success', isZh ? `檢索完成：${nodes.length} 個關聯節點` : `Retrieval Complete: ${nodes.length} nodes linked`, 'RAG System');
                } else {
                    addToast('warning', isZh ? '未發現相關向量關聯' : 'No vector correlations found', 'RAG System');
                }
            } catch (e) {
                addToast('error', 'Retrieval Logic Fault', 'System');
            } finally {
                setIsRagLoading(false);
            }
        }, 800);
    };

    const handleSummarize = async (note: NoteItem) => {
        if (isProcessing) return;
        setIsProcessing(true);
        addToast('info', isZh ? '正在從知識聖所檢索關聯資訊...' : 'Retrieving related shards from sanctuary...', 'RAG Engine');
        
        try {
            const keywords = note.content.split(/\s+/).filter(k => k.length > 2).slice(0, 5);
            const contextNodes = universalIntelligence.retrieveContextualNodes({ keywords });
            const contextStrings = contextNodes.map(n => n.atom);

            const summary = await generateNoteSummary(note.content, language, contextStrings);
            const updatedMetadata = { ...note.aiMetadata, summary };
            
            updateNote(note.id, note.content, note.title, note.tags, updatedMetadata);
            addToast('success', isZh ? '智慧結晶已存入元數據' : 'Wisdom crystal saved to metadata', 'Evolution');
            
            if (selectedNote?.id === note.id) {
                setSelectedNote(prev => prev ? { ...prev, aiMetadata: updatedMetadata } : null);
            }
        } catch (e) {
            addToast('error', 'Summary generation failed', 'System');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditStart = () => {
        if (!selectedNote) return;
        setEditBuffer({ title: selectedNote.title || '', content: selectedNote.content });
        setIsEditing(true);
    };

    const handleEditSave = () => {
        if (!selectedNote) return;
        updateNote(selectedNote.id, editBuffer.content, editBuffer.title, selectedNote.tags);
        setIsEditing(false);
        setSelectedNote({ ...selectedNote, title: editBuffer.title, content: editBuffer.content });
        addToast('success', isZh ? '筆記已更新' : 'Note updated', 'Registry');
    };

    const handlePrecipitation = async (note: NoteItem) => {
        setIsProcessing(true);
        addToast('info', isZh ? '啟動 [智慧沉澱引擎]：內核邏輯注入...' : 'Activating Wisdom Precipitation...', 'Kernel');
        
        try {
            const nextLevelIndex = (['L1','L2','L3','L4','L5'].indexOf(note.level) + 1);
            const targetLevel = (['L1','L2','L3','L4','L5'] as NoteLevel[])[Math.min(4, nextLevelIndex)];
            
            const prompt = `
            你現在是高級智慧沉澱導師。請對以下內容執行深度沉澱轉化。
            目標層次：${LEVEL_CONFIG[targetLevel].label}
            內容：${note.content}
            請以美觀的 Markdown 輸出。語系：${isZh ? '繁體中文' : 'English'}
            `;

            const stream = streamChat(prompt, language, "你精通 [萬能知識智慧沉澱奧義]。你的目標是將資訊熵減，轉化為具備實踐價值的智慧結晶。", [], [], 'gemini-3-pro-preview', true);
            
            let fullResult = '';
            for await (const chunk of stream) {
                fullResult += chunk.text || '';
            }
            
            updateNote(note.id, note.content, note.title, note.tags, { ...note.aiMetadata });
            const updatedNote = { ...note, level: targetLevel, manifestedContent: fullResult };
            setSelectedNote(updatedNote);
            
            addToast('success', isZh ? `智慧沉澱：已提升至 ${targetLevel}` : `Level up to ${targetLevel}`, 'Evolution');
        } catch (e) {
            addToast('error', 'Precipitation Fault', 'System');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast('success', isZh ? '已複製到剪貼簿' : 'Copied', 'System');
    };

    const handleExportPDF = () => {
        if (!selectedNote || !contentRef.current) return;
        setIsExporting(true);
        addToast('info', isZh ? '正在渲染極致美觀 PDF...' : 'Rendering premium PDF...', 'Manifest');

        const opt = {
            margin: [15, 10, 15, 10],
            filename: `JAK_Note_${selectedNote.title?.replace(/\s/g, '_') || 'Manifest'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const printContainer = document.createElement('div');
        printContainer.style.padding = '40px';
        printContainer.style.background = '#FFFFFF';
        printContainer.style.color = '#020617';
        printContainer.style.fontFamily = "'Inter', 'Noto Sans TC', sans-serif";
        
        printContainer.innerHTML = `
            <div style="border-bottom: 2px solid #020617; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900;">${selectedNote.title || 'Knowledge Shard'}</h1>
                    <p style="margin: 5px 0 0 0; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">ENTITY: ${companyName.toUpperCase()} • LEVEL: ${selectedNote.level}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 8px; color: #94a3b8; font-weight: bold;">JAK_SYSTEM_v16.1</p>
                    <p style="margin: 0; font-size: 10px; font-weight: bold;">${new Date(selectedNote.timestamp).toLocaleDateString()}</p>
                </div>
            </div>
            ${selectedNote.aiMetadata?.summary ? `<div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 12px; margin-bottom: 30px;"><div style="font-size: 10px; font-weight: 900; color: #16a34a; text-transform: uppercase; margin-bottom: 8px;">AI_Summary_Shard</div><p style="margin: 0; font-style: italic; font-size: 13px; color: #166534;">"${selectedNote.aiMetadata.summary}"</p></div>` : ''}
            <div style="font-size: 13px; line-height: 1.8; color: #1e293b;">
                ${marked.parse(viewMode === 'manifested' ? (selectedNote.manifestedContent || selectedNote.content) : selectedNote.content)}
            </div>
            <div style="margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 9px; color: #94a3b8; text-align: center;">
                CONFIDENTIAL • AUTOMATICALLY MANIFESTED BY JUNAIKEY AIOS
            </div>
        `;

        html2pdf().set(opt).from(printContainer).save().then(() => {
            setIsExporting(false);
            addToast('success', isZh ? 'PDF 導出成功' : 'PDF Exported', 'Success');
        });
    };

    return (
        <div className="h-full flex flex-col space-y-3 animate-fade-in overflow-hidden">
            <UniversalPageHeader 
                icon={StickyNote}
                title={{ zh: '萬能筆記：影子備份中心', en: 'Universal Notes: Shadow Hub' }}
                description={{ zh: '所有系統產出自動存證，具備 RAW 與 AI 顯化雙模視覺', en: 'All outputs archived. RAW vs AI Manifested dual-mode enabled.' }}
                language={language}
                tag={{ zh: '備份內核 v16.1', en: 'SHADOW_BACKUP_v16.1' }}
            />

            <div className="flex flex-wrap justify-between items-center gap-3 shrink-0 px-1">
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit backdrop-blur-xl">
                        <button 
                            onClick={() => setActiveLevel('All')}
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeLevel === 'All' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            ALL_LEVELS
                        </button>
                        {(['L1', 'L2', 'L3', 'L4', 'L5'] as NoteLevel[]).map(lvl => (
                            <button 
                                key={lvl}
                                onClick={() => setActiveLevel(lvl)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeLevel === lvl ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-80 backdrop-blur-xl relative group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within/search:text-celestial-purple transition-colors" />
                        <input 
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleDeepRetrieval()}
                            className="w-full bg-transparent border-none pl-9 pr-10 py-1 text-[9px] font-black text-white focus:outline-none placeholder:text-gray-800 uppercase tracking-widest"
                            placeholder={isZh ? "按 / 搜尋或 Enter 觸發 RAG..." : "SEARCH / HIT ENTER FOR RAG..."}
                        />
                        <button 
                            onClick={handleDeepRetrieval}
                            disabled={!searchQuery || isRagLoading}
                            className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${isRagLoading ? 'bg-transparent' : 'bg-celestial-purple/20 hover:bg-celestial-purple hover:text-white text-celestial-purple'}`}
                            title="Deep RAG Retrieval"
                        >
                            {isRagLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-celestial-purple" /> : <Sparkles className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => { setNoteDraft({ title: '', content: '', level: 'L1' }); setIsAdding(true); }}
                        className="px-6 py-2.5 bg-white/5 text-gray-400 font-black rounded-xl flex items-center gap-2 border border-white/5 hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest"
                    >
                        <Plus className="w-3.5 h-3.5" /> {isZh ? '手動記錄' : 'MANUAL_LOG'}
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden px-1">
                {/* 筆記 Feed (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 overflow-y-auto no-scrollbar pb-10">
                    
                    {/* RAG Results Section */}
                    {ragNodes.length > 0 && (
                        <div className="p-4 bg-gradient-to-br from-celestial-purple/10 to-blue-900/20 border border-celestial-purple/30 rounded-2xl animate-slide-up shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-[10px] font-black text-celestial-purple uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-3.5 h-3.5" /> 
                                    {isZh ? '量子檢索結果' : 'RAG Context'}
                                </h4>
                                <button onClick={() => setRagNodes([])} className="text-[9px] text-gray-500 hover:text-white transition-colors">CLEAR</button>
                            </div>
                            <div className="space-y-2">
                                {ragNodes.map((node, i) => (
                                    <div key={node.id || i} className="p-3 bg-black/40 rounded-xl border border-white/5 hover:border-celestial-purple/40 transition-all group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Atom className="w-3 h-3 text-emerald-400" />
                                            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter truncate">{node.source}</span>
                                            <div className="flex-1 border-b border-white/5" />
                                            <span className="text-[8px] text-celestial-purple font-bold">{(node.weight * 100).toFixed(0)}%</span>
                                        </div>
                                        <p className="text-[10px] text-gray-300 leading-relaxed line-clamp-2">
                                            {node.atom}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredNotes.length === 0 ? (
                        <div className="flex-1 glass-bento border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center opacity-30 rounded-2xl animate-fade-in">
                            <History className="w-16 h-16 mb-4 text-gray-500" />
                            <p className="zh-main text-base uppercase tracking-widest text-white">No Shards</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredNotes.map(note => (
                                <div 
                                    key={note.id}
                                    onClick={() => { setSelectedNote(note); setIsEditing(false); }}
                                    className={`glass-bento p-5 bg-slate-900/40 border-white/5 rounded-2xl group transition-all cursor-pointer relative overflow-hidden
                                        ${selectedNote?.id === note.id ? 'border-celestial-purple/40 bg-purple-500/[0.03] scale-[1.01]' : 'hover:border-white/20 shadow-lg'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg bg-white/5 ${LEVEL_CONFIG[note.level].color}`}>
                                                {React.createElement(LEVEL_CONFIG[note.level].icon, { className: "w-3.5 h-3.5" })}
                                            </div>
                                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{LEVEL_CONFIG[note.level].label}</span>
                                        </div>
                                        {note.aiMetadata?.summary && <Sparkles className="w-3 h-3 text-celestial-gold animate-pulse" />}
                                    </div>
                                    <h3 className="zh-main text-sm text-white truncate mb-1.5">{note.title || 'Untitled Shard'}</h3>
                                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed italic">"{note.content.substring(0, 100)}..."</p>
                                    
                                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex gap-1 flex-wrap">
                                            {note.tags?.slice(0, 2).map(t => <span key={t} className="text-[7px] px-1.5 py-0.5 bg-white/5 rounded text-gray-700">#{t}</span>)}
                                        </div>
                                        <span className="text-[8px] font-mono text-gray-800 whitespace-nowrap ml-2">{new Date(note.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 沉澱詳情 (8/12) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 overflow-hidden pb-10">
                    {selectedNote ? (
                        <div className="flex-1 glass-bento bg-slate-950/40 border-white/5 rounded-[2.5rem] p-0 flex flex-col overflow-hidden shadow-2xl relative animate-slide-up">
                            {/* Note Toolbar */}
                            <div className="p-6 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0 z-10">
                                <div className="flex gap-2">
                                    {!isEditing && (
                                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                                            <button 
                                                onClick={() => setViewMode('manifested')}
                                                className={`px-4 py-1.5 rounded-md text-[8px] font-black transition-all flex items-center gap-2 ${viewMode === 'manifested' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                <Sparkles className="w-3 h-3" /> MANIFEST
                                            </button>
                                            <button 
                                                onClick={() => setViewMode('raw')}
                                                className={`px-4 py-1.5 rounded-md text-[8px] font-black transition-all flex items-center gap-2 ${viewMode === 'raw' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                <Code className="w-3 h-3" /> RAW
                                            </button>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => handleSummarize(selectedNote)}
                                        disabled={isProcessing || isEditing}
                                        className="px-4 py-1.5 bg-celestial-gold/10 hover:bg-celestial-gold/20 text-celestial-gold rounded-lg text-[8px] font-black flex items-center gap-2 border border-celestial-gold/20 transition-all disabled:opacity-30"
                                    >
                                        {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                                        SUMMARIZE
                                    </button>
                                </div>
                                
                                <div className="flex gap-2">
                                    {!isEditing ? (
                                        <>
                                            <button onClick={handleEditStart} className="p-2.5 bg-white/5 hover:bg-white/10 text-emerald-400 rounded-xl border border-white/5 transition-all"><Edit3 className="w-4 h-4"/></button>
                                            <button onClick={() => handleCopy(viewMode === 'manifested' ? (selectedNote.manifestedContent || selectedNote.content) : selectedNote.content)} className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-500 rounded-xl border border-white/5 transition-all"><Copy className="w-4 h-4"/></button>
                                            <button onClick={handleExportPDF} disabled={isExporting} className="px-5 py-2.5 bg-white text-black font-black rounded-xl text-[9px] flex items-center gap-2 hover:bg-celestial-gold transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest">
                                                {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />} Export
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={handleEditSave} className="px-5 py-2.5 bg-emerald-500 text-black font-black rounded-xl text-[9px] flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-xl uppercase tracking-widest">
                                                <Save className="w-3 h-3" /> Save Changes
                                            </button>
                                            <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-white/5 text-gray-400 font-black rounded-xl text-[9px] flex items-center gap-2 hover:bg-white/10 transition-all border border-white/5 uppercase tracking-widest">
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => { deleteNote(selectedNote.id); setSelectedNote(null); }} className="p-2.5 bg-white/5 hover:bg-rose-500/20 text-gray-700 hover:text-rose-400 rounded-xl border border-white/5 transition-all"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar p-8 relative">
                                {isProcessing && <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-20 flex items-center justify-center animate-fade-in"><Loader2 className="w-10 h-10 text-celestial-gold animate-spin" /></div>}
                                
                                <div className="max-w-4xl mx-auto space-y-8" ref={contentRef}>
                                    {isEditing ? (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Edit_Title</label>
                                                <input 
                                                    value={editBuffer.title}
                                                    onChange={e => setEditBuffer({...editBuffer, title: e.target.value})}
                                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-xl text-white focus:border-celestial-purple outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Edit_Raw_Content</label>
                                                <textarea 
                                                    value={editBuffer.content}
                                                    rows={15}
                                                    onChange={e => setEditBuffer({...editBuffer, content: e.target.value})}
                                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-xs text-white font-mono focus:border-celestial-purple outline-none transition-all resize-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${LEVEL_CONFIG[selectedNote.level].color} ${LEVEL_CONFIG[selectedNote.level].bg} border border-current opacity-60`}>{selectedNote.level}</span>
                                                    <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Shard_0x{selectedNote.id.substring(selectedNote.id.length - 4)}</span>
                                                </div>
                                                <h2 className="zh-main text-4xl text-white tracking-tighter leading-tight">{selectedNote.title || 'Knowledge Shard'}</h2>
                                            </div>

                                            {selectedNote.aiMetadata?.summary && (
                                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-fade-in relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform"><Sparkles className="w-16 h-16 text-emerald-400" /></div>
                                                    <div className="text-[9px] font-black text-emerald-400 uppercase mb-2 flex items-center gap-2 tracking-[0.2em]">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        AI_Wisdom_Crystal
                                                    </div>
                                                    <p className="text-sm text-gray-200 italic leading-relaxed font-light">"{selectedNote.aiMetadata.summary}"</p>
                                                </div>
                                            )}

                                            {selectedNote.imageUrl && (
                                                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl group relative">
                                                    <img src={selectedNote.imageUrl} className="w-full object-cover max-h-[350px]" alt="Note Asset" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                        <button className="px-5 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-black text-white flex items-center gap-2 uppercase"><Maximize2 className="w-3 h-3"/> View_High_Res</button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`markdown-body prose prose-invert max-w-none transition-all duration-700 ${viewMode === 'manifested' ? 'prose-sm' : 'prose-xs opacity-40 font-mono bg-black/30 p-6 rounded-2xl border border-white/5'}`}>
                                                <div dangerouslySetInnerHTML={{ __html: marked.parse(viewMode === 'manifested' ? (selectedNote.manifestedContent || selectedNote.content) : selectedNote.content) as string }} />
                                            </div>

                                            {viewMode === 'manifested' && !selectedNote.manifestedContent && (
                                                <div className="p-10 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center flex flex-col items-center">
                                                    <Flame className="w-10 h-10 text-gray-800 mb-4" />
                                                    <p className="text-gray-600 text-xs mb-6 italic max-w-xs">"RAW content detected. Trigger manifestation for premium layout."</p>
                                                    <button 
                                                        onClick={() => handlePrecipitation(selectedNote)}
                                                        className="px-10 py-3 bg-white text-black font-black rounded-xl flex items-center gap-2 hover:bg-celestial-gold transition-all text-[10px] uppercase tracking-widest shadow-xl"
                                                    >
                                                        <Sparkles className="w-3.5 h-3.5" /> Manifest_Wisdom
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 grayscale animate-pulse">
                            <PenTool className="w-32 h-32 text-gray-600 mb-6" />
                            <h3 className="zh-main text-4xl text-white uppercase tracking-widest">Select Shard</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* 手動新增筆記 Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
                    <div className="w-full max-w-xl glass-bento bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-celestial-purple/20 rounded-xl text-celestial-purple border border-celestial-purple/30">
                                    <PenTool className="w-5 h-5" />
                                </div>
                                <h4 className="text-base font-bold text-white uppercase tracking-widest">CAPTURE_L1_SHARD</h4>
                            </div>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-all"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Directive_Title</label>
                                <input 
                                    value={noteDraft.title}
                                    onChange={e => setNoteDraft({...noteDraft, title: e.target.value})}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3.5 text-lg text-white focus:border-celestial-purple outline-none transition-all placeholder:text-gray-800"
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Raw_Input_Stream</label>
                                <textarea 
                                    value={noteDraft.content}
                                    rows={5}
                                    onChange={e => setNoteDraft({...noteDraft, content: e.target.value})}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:border-celestial-purple outline-none transition-all resize-none placeholder:text-gray-800 leading-relaxed shadow-inner"
                                    placeholder="Log your insight..."
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    addNote(noteDraft.content, [], noteDraft.title);
                                    setIsAdding(false);
                                    setNoteDraft({ title: '', content: '', level: 'L1' });
                                    addToast('success', isZh ? '靈感已存入 L1 擷取層' : 'Shard saved to L1 Capture', 'Memory');
                                }}
                                disabled={!noteDraft.content.trim()}
                                className="w-full py-4 bg-white text-black font-black rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3"
                            >
                                <Save className="w-4 h-4" /> COMMIT_TO_CACHE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

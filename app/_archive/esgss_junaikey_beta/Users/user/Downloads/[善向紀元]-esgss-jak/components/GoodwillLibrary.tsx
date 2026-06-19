import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language, View, QuantumNode } from '../types';
import { 
    BookOpen, Calendar, Users, Database, Search, ArrowRight, Heart, 
    Share2, Star, Download, ExternalLink, Library, FileText, 
    BarChart2, Lightbulb, GraduationCap, MessageSquare, X, Send, 
    Loader2, Sparkles, Book as BookIcon, ShieldCheck, Filter, Hash, GitBranch, Terminal, Eye, BrainCircuit,
    Activity, Bookmark, Info, Flame, Target, Cpu, Zap
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence } from '../services/evolutionEngine';
import { streamChat } from '../services/ai-service';
import { marked } from 'marked';

const UniNode: React.FC<{ label: string, en: string, icon: any, color?: string }> = ({ label, en, icon: Icon, color = "text-white" }) => (
    <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
        <div className={`p-2 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}><Icon className="w-4 h-4" /></div>
        <div className="flex flex-col">
            <span className="zh-main text-xs text-white leading-none">{label}</span>
            <span className="en-sub !mt-0.5 text-[8px] opacity-40 uppercase tracking-tighter">{en}</span>
        </div>
    </div>
);

interface ChatMessage {
    role: 'user' | 'assistant';
    text: string;
    sources?: QuantumNode[];
    isRetrieving?: boolean;
}

const BOOK_RAG_DATA: Record<string, { atom: string, vector: string[] }[]> = {
    "Net Positive": [
        { atom: "Net Positive 定義：一家公司如果能改善它所影響的每個人、每個規模的福祉，它就是『淨正向』的公司。", vector: ["definition", "impact"] }
    ],
    "Speed & Scale": [
        { atom: "2050 淨零計畫：電氣化一切、清理電網、修復食物系統、保護自然、清理工業。", vector: ["plan", "net zero"] }
    ]
};

export const GoodwillLibrary: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'reports' | 'books' | 'rag'>('reports');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  
  useEffect(() => {
      Object.entries(BOOK_RAG_DATA).forEach(([bookTitle, chunks]) => {
          universalIntelligence.injectQuantumNodes(chunks, `Book_${bookTitle.replace(/\s/g, '_')}`);
      });
  }, []);

  const pageData = {
      title: { zh: '善向知識聖所', en: 'Goodwill Knowledge Sanctuary' },
      desc: { zh: '全球永續典籍、年度報告與 RAG 原子知識之終極匯流點', en: 'The ultimate nexus of global ESG classics, reports, and RAG knowledge shards.' },
      tag: { zh: '知識內核 v16.1', en: 'KNOWLEDGE_CORE_V16.1' }
  };

  const enterpriseReports = [
      { id: 'r1', company: 'TSMC 台積電', year: '2023', sector: 'Semiconductor', score: 'AA', highlight: 'Water Stewardship', color: 'bg-emerald-600', icon: ChipIcon },
      { id: 'r2', company: 'Delta 台達電', year: '2023', sector: 'Electronics', score: 'AAA', highlight: 'Energy Efficiency', color: 'bg-blue-600', icon: ZapIcon },
      { id: 'r3', company: 'Apple Inc.', year: '2023', sector: 'Consumer Tech', score: 'AA+', highlight: 'Circular Supply Chain', color: 'bg-slate-700', icon: AppleIcon },
  ];

  const filteredReports = enterpriseReports.filter(r => r.company.toLowerCase().includes(reportSearchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-4 overflow-hidden">
        <UniversalPageHeader 
            icon={Library}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shrink-0">
            {[
                { id: 'reports', label: isZh ? '永續年鑑' : 'Yearbook', icon: FileText },
                { id: 'books', label: isZh ? '經典聖典' : 'Classics', icon: BookIcon },
                { id: 'rag', label: isZh ? '向量記憶' : 'Vector Mem', icon: Database },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            {/* 左側內容區 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-6">
                    {activeTab === 'reports' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            {filteredReports.map(report => (
                                <div key={report.id} className="glass-bento flex flex-col group hover:bg-white/[0.03] transition-all border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className={`h-32 ${report.color} relative p-8 flex flex-col justify-between overflow-hidden shrink-0`}>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
                                        <div className="relative z-10 flex justify-between items-start">
                                            <span className="text-[10px] font-black bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white uppercase tracking-widest border border-white/10">{report.year}_ANNUAL_MANIFEST</span>
                                            <div className="text-3xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">{report.score}</div>
                                        </div>
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                                                <report.icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="zh-main text-2xl text-white tracking-tight">{report.company}</h3>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-8 flex-1 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Strategic_Highlights</div>
                                            <div className="zh-main text-lg text-emerald-400 flex items-center gap-3">
                                                <Sparkles className="w-5 h-5 fill-current"/> {report.highlight}
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed font-light italic">"Verified alignment with GRI 2024 standards and Wangdao Altruism Logic Matrix."</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2">
                                                <Target className="w-3.5 h-3.5" /> Analyze_Gaps
                                            </button>
                                            <button className="py-3 bg-emerald-500 text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-emerald-500/10">
                                                READ_REPORT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'books' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                            {[
                                { t: 'Net Positive', a: 'Paul Polman', c: 'Legendary', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', color: 'amber' },
                                { t: 'Speed & Scale', a: 'John Doerr', c: 'Epic', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', color: 'purple' },
                                { t: 'The Future We Choose', a: 'Christiana Figueres', c: 'Rare', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80', color: 'blue' },
                            ].map((book, i) => (
                                <div key={i} className="glass-bento flex flex-col group hover:-translate-y-2 transition-all border-white/5 rounded-3xl overflow-hidden shadow-2xl bg-black/40">
                                    <div className="h-48 relative overflow-hidden shrink-0">
                                        <img src={book.img} className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-${book.color}-500/50 text-${book.color}-400 text-[8px] font-black uppercase tracking-widest`}>{book.c}</div>
                                    </div>
                                    <div className="p-6 flex flex-col h-full">
                                        <h4 className="zh-main text-lg text-white mb-2 leading-tight group-hover:text-celestial-gold transition-colors">{book.t}</h4>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">By {book.a}</div>
                                        <button className="mt-auto w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black rounded-xl border border-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                            <BookOpen className="w-3 h-3" /> Start_Reading
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'rag' && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20 grayscale py-20">
                            <Activity className="w-32 h-32 text-white mb-8 animate-neural-pulse" />
                            <h3 className="zh-main text-4xl text-white uppercase tracking-[0.4em]">Vector_Memory_Active</h3>
                            <p className="text-gray-500 text-xl font-light italic mt-4 max-w-md">"Every concept integrated into the library is automatically shards into the Infinity engine for global recall."</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 右側：過濾與統計 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 flex flex-col bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl shrink-0">
                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-4 relative z-10">
                        <Search className="w-5 h-5 text-celestial-gold" /> KNOWLEDGE_RETRIEVAL
                    </h4>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-celestial-gold transition-colors" />
                            <input 
                                value={reportSearchQuery}
                                onChange={e => setReportSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 pl-12 text-sm text-white focus:ring-1 focus:ring-celestial-gold outline-none transition-all placeholder:text-gray-800"
                                placeholder={isZh ? "檢索年報、書名或作者..." : "Search codex..."}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Sector_Taxonomy</div>
                            <div className="flex flex-wrap gap-2">
                                {['Finance', 'Technology', 'Manufacturing', 'Energy', 'Consumer'].map(s => (
                                    <button key={s} className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 flex flex-col bg-slate-900/40 border-white/5 rounded-[3rem] shadow-xl overflow-hidden min-h-0">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                         <h4 className="zh-main text-lg text-white tracking-widest uppercase">Atomic_Trace</h4>
                         <span className="text-[10px] font-mono text-emerald-500">SYNC: 99.8%</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                        {[
                            { l: "GRI 2-22", e: "CEO_Statement", icon: Target, color: "text-emerald-400" },
                            { l: "IFRS S2", e: "Climate_Risk", icon: ShieldCheck, color: "text-blue-400" },
                            { l: "SROI 1:1.2", e: "Impact_Calc", icon: Activity, color: "text-celestial-gold" },
                            { l: "ISO 14064", e: "Carbon_Audit", icon: Flame, color: "text-rose-400" }
                        ].map((node, i) => (
                            <UniNode key={i} label={node.l} en={node.e} icon={node.icon} color={node.color} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// Fix: Cpu and Zap are now imported from lucide-react
const ChipIcon = (props: any) => <Cpu {...props} />;
const ZapIcon = (props: any) => <Zap {...props} />;
const AppleIcon = (props: any) => <Star {...props} />;
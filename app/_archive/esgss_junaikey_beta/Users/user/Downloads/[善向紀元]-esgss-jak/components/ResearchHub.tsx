
import React, { useState, useEffect, useRef } from 'react';
import { Language, QuantumNode, UniversalKnowledgeNode } from '../types';
import { 
    Microscope, Search, Scan, Loader2, Database, Activity, Sparkles, Hash, 
    FileText, Table, Zap, Layout, ChevronDown, CheckCircle, Flame, Save
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { runMcpAction } from '../services/ai-service';
import { universalIntelligence } from '../services/evolutionEngine';
import { useCompany } from './providers/CompanyProvider';

export const ResearchHub: React.FC<{ language: Language, setGlobalAnalysisResult?: (result: any) => void }> = ({ language, setGlobalAnalysisResult }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addNote } = useCompany();
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleRunDeepDoc = async () => {
      if (!inputQuery.trim()) return;
      setIsAnalyzing(true);
      addToast('info', isZh ? '啟動 RAGFlow DeepDoc 解析 (Recall Target: 95%+)...' : 'Starting RAGFlow DeepDoc...', 'RAGFlow');
      
      try {
          const res = await runMcpAction('perform_deep_doc_analysis', { query: inputQuery }, language);
          if (res.success) {
              setAnalysisResult(res.result);
              setGlobalAnalysisResult?.(res.result);
              addToast('success', isZh ? '文檔解析成功，智慧片段已注入智庫' : 'DeepDoc Parse complete. Knowledge injected.', 'Kernel');
              // Record Interaction for AIOS Synergy
              universalIntelligence.recordInteraction({
                  componentId: 'ResearchHub',
                  eventType: 'ai-trigger',
                  timestamp: Date.now(),
                  payload: { query: inputQuery }
              });
          }
      } catch (e) {
          addToast('error', 'DeepDoc Logic Breach', 'Fault');
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleSaveToNotes = () => {
      if (!analysisResult) return;
      const content = `### RAGFlow Analysis: ${inputQuery}\n\n**Summary:** ${analysisResult.summary}\n\n**Chunks:**\n${analysisResult.chunks.map((c: any) => `- [${c.tag}] ${c.text}`).join('\n')}`;
      const manifested = `## DeepDoc 研究報告: ${inputQuery}\n\n> ${analysisResult.summary}\n\n${analysisResult.chunks.map((c: any) => `### ${c.tag}\n${c.text}`).join('\n\n')}`;
      addNote(content, ['Research', 'RAGFlow'], `DeepDoc_${new Date().getTime()}`, manifested, undefined, 'ResearchHub');
      addToast('success', isZh ? '已儲存至萬能筆記' : 'Saved to Universal Notes', 'Memory');
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden p-6 bg-slate-50">
        <UniversalPageHeader 
            icon={Microscope}
            title={{ zh: 'RAGFlow 智慧研究中心', en: 'RAGFlow Research Hub' }}
            description={{ zh: '全知之眼：基於 DeepDoc 的佈局識別與 95% 召回率對標', en: 'The All-Seeing Eye: DeepDoc Layout Awareness & 95% Recall.' }}
            language={language}
            tag={{ zh: 'RAG 引擎 v0.23', en: 'RAG_ENGINE_v0.23' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0 overflow-hidden">
                <div className="glass-bento p-10 flex flex-col bg-white border-slate-100 rounded-[3rem] shadow-2xl relative overflow-hidden flex-1">
                    <div className="flex gap-4 mb-10 shrink-0 relative z-10">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                value={inputQuery}
                                onChange={e => setInputQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRunDeepDoc()}
                                className="w-full bg-slate-100 border-none rounded-2xl px-8 py-5 pl-16 text-lg text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300"
                                placeholder={isZh ? "輸入企業網址或 ESG 文檔路徑..." : "Enter URL or Document Path..."}
                            />
                        </div>
                        <button 
                            onClick={handleRunDeepDoc} 
                            disabled={isAnalyzing || !inputQuery} 
                            className="px-12 bg-blue-600 text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs"
                        >
                            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />} RUN_DEEPDOC
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
                        {analysisResult ? (
                            <div className="space-y-8 animate-fade-in">
                                <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><CheckCircle className="w-32 h-32 text-emerald-500" /></div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Knowledge_Crystal_Summary</div>
                                        <button onClick={handleSaveToNotes} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white text-[9px] font-black rounded-xl shadow-lg hover:scale-105 transition-all">
                                            <Save className="w-3 h-3" /> SAVE_TO_SHARDS
                                        </button>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed italic text-xl font-light">"{analysisResult.summary}"</p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {analysisResult.chunks.map((chunk: any, i: number) => (
                                        <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group flex gap-6">
                                            <div className={`p-4 rounded-2xl ${chunk.tag === 'Table' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} shrink-0 h-fit`}>
                                                {chunk.tag === 'Table' ? <Table className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase">Shard_0{i+1} • {chunk.tag}</span>
                                                    <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-500 font-bold">RECALL: {(chunk.score * 100).toFixed(1)}%</div>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{chunk.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center gap-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
                                    <Database className="absolute inset-0 m-auto w-10 h-10 text-blue-500 animate-pulse" />
                                </div>
                                <p className="zh-main text-slate-400 text-lg animate-pulse tracking-widest uppercase">DeepDoc_Parsing_Sequence...</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center grayscale">
                                <Database className="w-40 h-40 mb-10" />
                                <h4 className="zh-main text-3xl uppercase tracking-widest text-slate-800 leading-none">Awaiting Shard Influx</h4>
                                <p className="text-slate-400 mt-4 font-light italic">"Knowledge is power; recall is divine."</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-10 bg-slate-900 text-white rounded-[3.5rem] shadow-2xl shrink-0">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Activity className="w-4 h-4 text-emerald-400" /> INF_VECTOR_VITALS</h4>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-slate-400">Recall Precision</span>
                            <span className="text-2xl font-mono font-black text-emerald-400">95.4%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '95.4%' }} />
                        </div>
                    </div>
                </div>
                
                <div className="glass-bento p-8 flex-1 bg-white border-slate-100 rounded-[3rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><Flame className="w-4 h-4 text-amber-500" /> RECENT_NODES</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                        {[
                            { l: "GRI 305: Emissions", v: "0xBF32" },
                            { l: "IFRS S1 Framework", v: "0x12A9" },
                            { l: "ACX Listing Rules", v: "0x5921" }
                        ].map((node, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-blue-50 transition-all cursor-pointer border border-transparent hover:border-blue-100">
                                <div className="flex items-center gap-3">
                                    <Hash className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                                    <span className="text-xs font-bold text-slate-600">{node.l}</span>
                                </div>
                                <span className="text-[9px] font-mono text-slate-400">{node.v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

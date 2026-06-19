
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { generateReportChapter, runMcpAction } from '../services/ai-service';
import { Language, View } from '../types';
import { REPORT_STRUCTURE } from '../constants';
import { 
    FileText, Sparkles, Download, Loader2, Archive, ShieldCheck, 
    Database, Activity, CheckCircle2, ChevronRight, Layout, PenTool,
    Globe, Zap, FileSearch, Eye, Award, Fingerprint, Info, CheckCircle,
    Target, Star, X, MessageSquare, AlertTriangle, TrendingUp, Compass, Flame, ArrowUpRight,
    Crown, History, Gem, Gavel
} from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const ReportGen: React.FC<{ language: Language }> = ({ language }) => {
  const { companyName, esgScores, level, industrySector, awardXp, addJournalEntry, addNote, carbonData } = useCompany();
  const { observeAction } = useUniversalAgent();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'generator' | 'weekly' | 'board' | 'archive'>('generator');
  const [activeSectionId, setActiveSectionId] = useState<string>('cover');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Action States
  const [isGeneratingWeekly, setIsGeneratingWeekly] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);

  const [isGeneratingBoard, setIsGeneratingBoard] = useState(false);
  const [boardReport, setBoardReport] = useState<any>(null);
  const [showRitual, setShowRitual] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh-TW';

  const completionRate = useMemo(() => {
    const total = REPORT_STRUCTURE.reduce((acc, c) => acc + (c.subSections?.length || 0), 0);
    const done = Object.keys(generatedContent).length;
    return Math.round((done / total) * 100);
  }, [generatedContent]);

  const handleGenerateSection = async () => {
    if (activeSectionId === 'cover') return;
    setIsGenerating(true);
    try {
      const activeSection = REPORT_STRUCTURE.flatMap(c => [c, ...(c.subSections || [])]).find(s => s.id === activeSectionId);
      if (!activeSection) return;
      const fullContext = { company: companyName, scores: esgScores, industry: industrySector };
      const content = await generateReportChapter(activeSection.title, (activeSection as any).template || "", (activeSection as any).example || "", fullContext, language);
      setGeneratedContent(prev => ({ ...prev, [activeSection.id]: content }));
      addToast('success', isZh ? `[${activeSection.title}] 顯化完成` : `[${activeSection.title}] Manifested`, 'Scribe');
      observeAction('AI_GEN', activeSection.title);
    } catch (error) { 
      addToast('error', 'Kernel Logic Interrupted', 'Error'); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  const handleManifestWeekly = async () => {
      setIsGeneratingWeekly(true);
      setWeeklyReport(null);
      addToast('info', isZh ? '正在啟動 [戰略提純] 序列...' : 'Initiating [Strategic Distillation]...', 'CSO Agent');
      try {
          const res = await runMcpAction('weekly_insight_manifestation', {
              weeklyStats: { carbonSaved: 12450, complianceGrowth: 15, gapsFound: 3, projectEfficiency: 94 }
          }, language);
          if (res.success) {
              setWeeklyReport(res.result);
              awardXp(300);
              const manifestedNote = `## 2026_W01 CSO 戰略週報\n\n${res.result.strategicNarrative}`;
              addNote(manifestedNote, ['Weekly', 'Strategy'], 'CSO_Weekly_Manifest', manifestedNote, undefined, 'CSO_Agent');
              addToast('reward', isZh ? '週報顯化成功！獲得 300 XP' : 'Weekly Manifested! +300 XP', 'Evolution');
          }
      } catch (e) { addToast('error', 'Manifestation fault.', 'Error'); }
      finally { setIsGeneratingWeekly(false); }
  };

  const handleManifestBoard = async () => {
      setIsGeneratingBoard(true);
      setShowRitual(true);
      setBoardReport(null);
      addToast('info', isZh ? '正在舉行 [董事會報告] 顯化儀式...' : 'Performing Board Report Ritual...', 'Architect');
      
      try {
          const res = await runMcpAction('board_report_grand_manifestation', {
              annualMetrics: {
                  carbonSavedTotal: 158200,
                  globalComplianceScore: 94.5,
                  totalImpactXp: 12500,
                  currentEsgScores: esgScores,
                  industry: industrySector
              }
          }, language);

          if (res.success) {
              // Ceremony Delay for aesthetics
              await new Promise(r => setTimeout(r, 2500));
              setBoardReport(res.result);
              awardXp(1200);
              const manifestedNote = `## 2026_Executive_Board_Manifest\n\n${res.result.futureBlueprint}`;
              addNote(manifestedNote, ['Board', 'Executive'], 'Executive_Board_Report', manifestedNote, undefined, 'Board_Synthesizer');
              addJournalEntry(
                  isZh ? '完成董事會報告顯化' : 'Board Report Manifested',
                  isZh ? '最高級別數據合成已完成，報告已存入永恆聖櫃。' : 'High-level synthesis complete, codified in archive.',
                  1200, 'milestone', ['Board', 'Manifest']
              );
              addToast('reward', isZh ? '神跡顯現！獲得 1,200 XP' : 'Grand Manifestation! +1,200 XP', 'Evolution');
              observeAction('BOARD_MANIFEST', 'Grand Executive Report');
          }
      } catch (e) {
          addToast('error', 'Ritual sequence interrupted.', 'Error');
      } finally {
          setIsGeneratingBoard(false);
          setShowRitual(false);
      }
  };

  const handleExportPDF = (ref: React.RefObject<HTMLDivElement>, filename: string) => {
      if (!ref.current) return;
      setIsExporting(true);
      const opt = { 
          margin: 10, 
          filename: filename, 
          html2canvas: { scale: 3, useCORS: true }, 
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const } 
      };
      html2pdf().set(opt).from(ref.current).save().then(() => { 
          setIsExporting(false); 
          addToast('success', 'Document Exported', 'System'); 
      });
  };

  return (
    <div className="h-full w-full flex flex-col bg-black overflow-hidden animate-fade-in relative">
        {/* The Ritual Overlay */}
        {showRitual && (
            <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 animate-fade-in">
                <div className="relative">
                    <div className="absolute inset-0 bg-celestial-gold blur-[100px] opacity-40 animate-pulse" />
                    <div className="w-64 h-64 rounded-full border border-celestial-gold/30 animate-[spin_8s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border-2 border-celestial-gold/50 animate-[spin_12s_linear_infinite_reverse]" />
                    <div className="absolute inset-0 m-auto w-24 h-24 bg-celestial-gold rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.8)] animate-prism-pulse">
                        <Crown className="w-12 h-12 text-black" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="zh-main text-3xl text-celestial-gold tracking-[0.3em] uppercase animate-pulse">Manifesting_Grand_Codex</h3>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Aggregating L16.1 Shards for Executive Review...</p>
                </div>
            </div>
        )}

        {/* Top Management HUD */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl shrink-0 z-10 shadow-2xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-celestial-gold/20 rounded-xl border border-celestial-gold/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        <FileText className="w-5 h-5 text-celestial-gold" />
                    </div>
                    <div>
                        <h3 className="zh-main text-xl text-white uppercase tracking-tighter">{isZh ? '報告顯化終端' : 'Report Manifest Terminal'}</h3>
                        <span className="en-sub !text-[8px] text-gray-500 font-black">AIOS_SCRIBE_PROTOCOL_v16.1</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 shadow-inner">
                    <button onClick={() => setActiveTab('generator')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'generator' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>FULL_REPORT</button>
                    <button onClick={() => setActiveTab('weekly')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'weekly' ? 'bg-celestial-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>WEEKLY_CSO</button>
                    <button onClick={() => setActiveTab('board')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'board' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>BOARD_EXE</button>
                    <button onClick={() => setActiveTab('archive')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'archive' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>ARCHIVE</button>
                </div>
                {activeTab === 'generator' && (
                    <button onClick={() => handleExportPDF(reportRef, `${companyName}_ESG_Report.pdf`)} disabled={isExporting || Object.keys(generatedContent).length === 0} className="px-6 py-1.5 bg-white text-black hover:bg-celestial-gold transition-all rounded-lg text-[10px] font-black flex items-center gap-2 shadow-xl disabled:opacity-20">
                        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} EXPORT_PDF
                    </button>
                )}
            </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden relative">
            {activeTab === 'generator' && (
                <div className="flex h-full animate-fade-in">
                    <div className="w-72 border-r border-white/5 bg-slate-950/40 flex flex-col overflow-hidden shrink-0">
                         <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
                             <button onClick={() => setActiveSectionId('cover')} className={`w-full p-4 rounded-xl border text-left text-[11px] ${activeSectionId === 'cover' ? 'border-celestial-gold bg-celestial-gold/5 text-white' : 'border-white/5 text-gray-500'}`}>Cover Overview</button>
                             {REPORT_STRUCTURE.map(c => (
                                 <div key={c.id} className="pt-4">
                                     <div className="px-2 text-[9px] font-black text-gray-700 uppercase mb-2">{c.title}</div>
                                     {c.subSections?.map(s => (
                                         <button key={s.id} onClick={() => setActiveSectionId(s.id)} className={`w-full p-3 rounded-lg text-left text-[10px] mb-1 transition-all ${activeSectionId === s.id ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}>
                                             {s.title}
                                         </button>
                                     ))}
                                 </div>
                             ))}
                         </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-12 bg-[#020617] relative no-scrollbar">
                         <div ref={reportRef} className="max-w-4xl mx-auto bg-white p-16 shadow-2xl text-slate-900 min-h-full">
                             {activeSectionId === 'cover' ? (
                                 <div className="py-20 text-center space-y-10">
                                     <h1 className="text-6xl font-serif font-black">{companyName}</h1>
                                     <div className="h-2 w-20 bg-slate-950 mx-auto" />
                                     <p className="text-xl uppercase tracking-[0.3em] text-slate-400">2024 Sustainability Report</p>
                                 </div>
                             ) : (
                                 <div className="prose prose-slate max-w-none">
                                     {generatedContent[activeSectionId] ? (
                                         <div dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent[activeSectionId]) as string }} />
                                     ) : (
                                         <div className="py-40 text-center opacity-10">
                                             <PenTool className="w-20 h-20 mx-auto mb-6" />
                                             <h3 className="text-2xl font-bold uppercase">Awaiting Logic Influx</h3>
                                         </div>
                                     )}
                                 </div>
                             )}
                         </div>
                         <button onClick={handleGenerateSection} disabled={isGenerating} className="fixed bottom-10 right-10 p-5 bg-celestial-gold text-black rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
                             {isGenerating ? <Loader2 className="w-6 h-6 animate-spin"/> : <Sparkles className="w-6 h-6"/>}
                         </button>
                    </div>
                </div>
            )}

            {activeTab === 'weekly' && (
                <div className="h-full p-10 overflow-y-auto no-scrollbar animate-fade-in bg-[#020617] relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                    <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-celestial-blue/20 rounded-[1.8rem] text-celestial-blue border border-celestial-blue/30 shadow-lg">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="zh-main text-3xl text-white tracking-tighter uppercase">{isZh ? '永續長戰略提純週報' : 'CSO Weekly Strategy Manifest'}</h3>
                                    <p className="text-gray-500 text-sm mt-1">Distilling high-level insights from all project nodes.</p>
                                </div>
                            </div>
                            <button onClick={handleManifestWeekly} disabled={isGeneratingWeekly} className="px-12 py-4 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-celestial-blue hover:text-white transition-all shadow-xl flex items-center gap-3">
                                {isGeneratingWeekly ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} MANIFEST_INSIGHTS
                            </button>
                        </div>
                        {weeklyReport && (
                            <div className="grid grid-cols-12 gap-6 animate-slide-up pb-20">
                                <div className="col-span-12 lg:col-span-8 glass-bento p-10 bg-slate-900/60 border-white/5 rounded-[3.5rem] shadow-2xl">
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><Star className="w-4 h-4 text-celestial-gold" /> EXECUTIVE_HIGHLIGHTS</h4>
                                    <div className="space-y-6">
                                        {weeklyReport.executiveHighlights.map((h: string, i: number) => (
                                            <div key={i} className="flex gap-6 items-start group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-celestial-gold mt-2.5 shrink-0 shadow-[0_0_8px_#fbbf24]" />
                                                <p className="text-xl text-gray-200 font-light leading-relaxed italic">"{h}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-12 lg:col-span-4 glass-bento p-10 bg-slate-950 border-emerald-500/20 rounded-[3.5rem] shadow-2xl flex flex-col justify-center text-center">
                                    <div className="text-6xl font-mono font-black text-white tracking-tighter">{weeklyReport.esgMetrics.env}%</div>
                                    <div className="text-[8px] text-gray-600 uppercase mt-2">Global_Efficiency</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'board' && (
                <div className="h-full p-10 overflow-y-auto no-scrollbar animate-fade-in bg-[#020617] relative">
                    {/* Golden Ambient Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.08)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                        {/* Board Header */}
                        <div className="flex flex-col xl:flex-row justify-between items-end gap-10 mb-16 border-b border-celestial-gold/20 pb-12">
                            <div className="flex items-center gap-10">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-celestial-gold to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)] animate-prism-pulse shrink-0">
                                    <Crown className="w-12 h-12 text-black" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="zh-main text-5xl text-white tracking-tighter uppercase">{isZh ? '董事會戰略合成聖典' : 'Board Executive Synthesis'}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-celestial-gold/10 border border-celestial-gold/30 text-celestial-gold text-[10px] font-black uppercase tracking-widest">
                                            <ShieldCheck className="w-3.5 h-3.5" /> High_Authority_Access
                                        </div>
                                        <span className="text-gray-500 font-mono text-xs uppercase tracking-tighter">v16.1_DECISION_MATRIX</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleManifestBoard} 
                                disabled={isGeneratingBoard} 
                                className="px-16 py-5 bg-celestial-gold text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(251,191,36,0.3)] flex items-center gap-3 uppercase tracking-[0.4em] text-xs"
                            >
                                {isGeneratingBoard ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gavel className="w-5 h-5" />}
                                MANIFEST_GRAND_REPORT
                            </button>
                        </div>

                        {boardReport ? (
                            <div className="grid grid-cols-12 gap-8 animate-slide-up pb-32">
                                {/* 1. Executive Summary Shard */}
                                <div className="col-span-12 lg:col-span-8 glass-bento p-12 bg-slate-900/60 border-celestial-gold/10 rounded-[4rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Gem className="w-64 h-64 text-celestial-gold" /></div>
                                    <h4 className="text-[11px] font-black text-celestial-gold uppercase tracking-[0.5em] mb-10 border-b border-white/5 pb-4">EXECUTIVE_SUMMARY_CODEX</h4>
                                    <p className="text-2xl text-gray-200 font-light leading-relaxed italic mb-12">
                                        "{boardReport.executiveSummary}"
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {boardReport.strategicHighlights.map((sh: any, i: number) => (
                                            <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] group hover:border-celestial-gold/40 transition-all">
                                                <div className="text-[10px] font-black text-emerald-400 uppercase mb-3 flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> SHARD_0{i+1}</div>
                                                <h5 className="zh-main text-xl text-white mb-2">{sh.title}</h5>
                                                <p className="text-xs text-gray-500 leading-relaxed italic">"{sh.impact}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Performance Scorecard */}
                                <div className="col-span-12 lg:col-span-4 glass-bento p-12 bg-slate-950 border-white/10 rounded-[4rem] shadow-2xl flex flex-col justify-between text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-celestial-gold/5 to-transparent pointer-events-none" />
                                    <div>
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10">Consolidated_Resonance</div>
                                        <div className="text-9xl font-mono font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">{boardReport.scorecard.grade}</div>
                                        <div className="text-[11px] font-black text-celestial-gold uppercase tracking-[0.3em]">Board_Rating: Superior</div>
                                    </div>
                                    <div className="space-y-6 mt-12 border-t border-white/5 pt-12">
                                        {[
                                            { l: 'ENV', v: boardReport.scorecard.env, c: 'text-emerald-400' },
                                            { l: 'SOC', v: boardReport.scorecard.soc, c: 'text-blue-400' },
                                            { l: 'GOV', v: boardReport.scorecard.gov, c: 'text-purple-400' }
                                        ].map(s => (
                                            <div key={s.l} className="flex justify-between items-center px-4">
                                                <span className="text-[10px] font-black text-gray-600 tracking-widest">{s.l}</span>
                                                <span className={`text-xl font-mono font-bold ${s.c}`}>{s.v}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Future Blueprint Shard */}
                                <div className="col-span-12 glass-bento p-16 bg-black border-celestial-gold/20 rounded-[5rem] shadow-2xl relative overflow-hidden group">
                                     <div className="absolute bottom-0 right-0 p-16 opacity-5 group-hover:scale-110 transition-transform duration-1000"><History className="w-96 h-96 text-celestial-gold" /></div>
                                     <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                                         <div className="text-center space-y-4">
                                             <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-celestial-gold/10 border border-celestial-gold/30 text-celestial-gold text-xs font-black uppercase tracking-[0.5em]">
                                                 <Compass className="w-5 h-5" /> Vision_2027_Blueprint
                                             </div>
                                             <h4 className="zh-main text-4xl text-white tracking-tighter">邁向文明再生的演化路徑</h4>
                                         </div>
                                         <div className="markdown-body prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-light first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-celestial-gold" dangerouslySetInnerHTML={{ __html: marked.parse(boardReport.futureBlueprint) as string }} />
                                         
                                         <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                                             <div className="flex gap-16">
                                                 <div><div className="text-[9px] text-gray-600 font-black uppercase mb-1">Integrity_Hash</div><div className="text-xs font-mono text-emerald-500">0x{boardReport.auditHash}</div></div>
                                                 <div><div className="text-[9px] text-gray-600 font-black uppercase mb-1">Status</div><div className="text-xs font-bold text-white uppercase flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Witnessed</div></div>
                                             </div>
                                             <button 
                                                onClick={() => handleExportPDF(boardRef, `${companyName}_Executive_Report_2026.pdf`)}
                                                className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-celestial-gold transition-all text-xs uppercase tracking-widest shadow-2xl"
                                             >
                                                DOWNLOAD_SACRED_PDF
                                             </button>
                                         </div>
                                     </div>
                                     
                                     {/* Hidden element for PDF printing */}
                                     <div className="hidden">
                                         <div ref={boardRef} className="p-20 bg-white text-slate-900 font-sans">
                                             <div className="border-b-4 border-slate-900 pb-10 mb-20 flex justify-between items-end">
                                                 <div>
                                                     <h1 className="text-4xl font-black uppercase">{companyName}</h1>
                                                     <p className="text-slate-500 text-sm mt-2 tracking-widest">EXECUTIVE BOARD REPORT • 2026_MANIFEST</p>
                                                 </div>
                                                 <div className="text-right text-xs font-bold text-slate-400">JAK_CODEX_v16.1</div>
                                             </div>
                                             <div className="space-y-12">
                                                 <section>
                                                     <h2 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Executive Summary</h2>
                                                     <p className="text-xl font-light italic leading-relaxed text-slate-700">"{boardReport.executiveSummary}"</p>
                                                 </section>
                                                 <section>
                                                     <h2 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Performance Scorecard</h2>
                                                     <div className="grid grid-cols-4 gap-4">
                                                         <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                                                             <div className="text-4xl font-black">{boardReport.scorecard.grade}</div>
                                                             <div className="text-[9px] uppercase font-bold text-slate-400">Consolidated Grade</div>
                                                         </div>
                                                     </div>
                                                 </section>
                                                 <div className="prose prose-slate max-w-none pt-20" dangerouslySetInnerHTML={{ __html: marked.parse(boardReport.futureBlueprint) as string }} />
                                                 <div className="mt-32 pt-10 border-t border-slate-100 text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
                                                     Manifested by ESGss JunAiKey • Verified via Blockchain Shard 0x{boardReport.auditHash}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-40 flex flex-col items-center justify-center text-center opacity-10 grayscale select-none">
                                <Crown className="w-64 h-64 text-gray-700 mb-8 animate-float-gentle" />
                                <h4 className="zh-main text-5xl text-white uppercase tracking-[0.4em] mb-4">Awaiting Grand Ritual</h4>
                                <p className="text-gray-500 text-xl font-light italic">"Combine all action shards into a single, board-level decision圣典."</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'archive' && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale text-center">
                    <Archive className="w-32 h-32 mb-6" />
                    <h4 className="zh-main text-2xl text-white uppercase tracking-widest">Archive_Vault_Securing</h4>
                </div>
            )}
        </div>
    </div>
  );
};

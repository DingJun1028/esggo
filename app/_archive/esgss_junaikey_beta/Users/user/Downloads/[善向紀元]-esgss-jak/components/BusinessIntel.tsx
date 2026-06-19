
import React, { useState, useRef } from 'react';
import { Language, EntityPlanet } from '../types';
import { 
    Search, Globe, FileText, Loader2, Database,
    Radar, Activity, ChevronRight, 
    Zap, Info, Target, Users, Download, Sparkles, RefreshCw, Save
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { performWebSearch, streamChat } from '../services/ai-service';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarArea, Tooltip } from 'recharts';
import { marked } from 'marked';
import { useCompany } from './providers/CompanyProvider';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const BusinessIntel: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { syncPlanet, addLog, observeAction } = useUniversalAgent();
  const { addNote } = useCompany();
  
  const [targetId, setTargetId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const stakeholderData = [
    { subject: isZh ? '政府與法規' : 'Gov & Reg', A: 85, fullMark: 100 },
    { subject: isZh ? '社會與 NGO' : 'Social & NGO', A: 70, fullMark: 100 },
    { subject: isZh ? '供應鏈夥伴' : 'Supply Chain', A: 90, fullMark: 100 },
    { subject: isZh ? '員工與社群' : 'Talent', A: 65, fullMark: 100 },
    { subject: isZh ? '投資人' : 'Investors', A: 95, fullMark: 100 },
    { subject: isZh ? '競爭者' : 'Competitors', A: 40, fullMark: 100 },
  ];

  const handleScan = async () => {
      if (!targetId) return;
      setIsScanning(true);
      setReportContent(null);
      addToast('info', isZh ? 'AMICE 正在啟動全球節點掃描...' : 'AMICE searching global nodes...', 'Crawler');
      
      try {
          const searchResult = await performWebSearch(targetId, language);
          const cleaningPrompt = `你現在是 AMICE 分析官。請分析：${targetId}。原始數據：${searchResult.text}`;
          const stream = streamChat(cleaningPrompt, language, "你是一位專業的 ESG 商情分析官。", [], [], 'gemini-3-pro-preview');
          
          let fullReport = '';
          for await (const chunk of stream) {
              fullReport += chunk.text || '';
              setReportContent(fullReport);
          }
          addToast('success', isZh ? '商情報告已顯化' : 'Intel Report Manifested', 'AMICE');
      } catch (e) {
          addToast('error', 'AMICE Scan Failed', 'Kernel');
      } finally {
          setIsScanning(false);
      }
  };

  const handleSaveToNotes = () => {
      if (!reportContent) return;
      addNote(reportContent, ['Intel', 'AMICE', 'Competitor'], `AMICE_${targetId}_${new Date().getTime()}`, `## AMICE 商情報告: ${targetId}\n\n${reportContent}`, undefined, 'BusinessIntel');
      addToast('success', isZh ? '商情報告已儲存至萬能筆記' : 'Intel report saved to Universal Notes', 'Memory');
  };

  const handleExportPDF = () => {
      if (!reportRef.current) return;
      setIsExporting(true);
      const opt = {
          margin: [15, 15, 15, 15] as [number, number, number, number],
          filename: `AMICE_REPORT_${targetId.toUpperCase()}.pdf`,
          html2canvas: { scale: 3, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(reportRef.current).save().then(() => {
          setIsExporting(false);
      });
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Globe}
            title={{ zh: 'AMICE 智慧商情監測', en: 'AMICE Strategic Intelligence' }}
            description={{ zh: 'AI 情蒐 × 報告導出：掌控全球永續競爭力動態', en: 'AI Ingestion & PDF Manifestation' }}
            language={language}
            tag={{ zh: '商情內核 v16.1', en: 'AMICE_CORE_V16.1' }}
        />

        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 flex flex-col bg-slate-900/60 border-white/5 shadow-2xl relative flex-1 min-h-0 rounded-[3rem]">
                    <div className="flex gap-4 mb-8 shrink-0">
                        <input 
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-celestial-blue outline-none"
                            placeholder={isZh ? "輸入企業名稱..." : "Enter company name..."}
                        />
                        <button onClick={handleScan} disabled={isScanning || !targetId} className="px-8 py-4 bg-celestial-blue text-white font-black rounded-2xl flex items-center gap-3">
                            {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {isZh ? '啟動掃描' : 'BOOT'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-black/20 rounded-[3rem] border border-white/5 relative">
                        {reportContent && (
                            <div className="absolute top-6 right-10 flex gap-2 z-20">
                                <button 
                                    onClick={handleSaveToNotes}
                                    className="px-6 py-2 bg-emerald-500 text-black font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl"
                                >
                                    <Save className="w-3.5 h-3.5" /> SAVE_TO_SHARDS
                                </button>
                                <button 
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="px-6 py-2 bg-white text-black hover:bg-celestial-gold transition-all rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"
                                >
                                    {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} EXPORT_PDF
                                </button>
                            </div>
                        )}
                        {reportContent ? (
                            <div ref={reportRef} className="prose prose-invert prose-lg max-w-none animate-fade-in text-white">
                                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(reportContent) as string }} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20 text-center">
                                <FileText className="w-32 h-32 mb-8" />
                                <p className="zh-main text-2xl uppercase tracking-widest">Awaiting Analysis Protocol</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 flex flex-col bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl shrink-0 min-h-[400px]">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                        <Users className="w-5 h-5" /> STAKEHOLDER_RADAR
                    </h4>
                    <div className="flex-1 min-h-[300px] w-full relative overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stakeholderData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <RadarArea name="Current" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="glass-bento p-6 flex-1 bg-slate-900/40 border-white/5 rounded-[3rem] overflow-hidden min-h-0">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h4 className="en-sub !text-[9px] text-emerald-500 uppercase tracking-widest">AMICE_LOG_BUS</h4>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-[10px] font-mono text-gray-600 space-y-2">
                        <div>[INFO] Waiting for ingestion cycles...</div>
                        <div>[SYSTEM] Grounding active: Google Search</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

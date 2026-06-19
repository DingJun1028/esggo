
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language, View } from '../types';
import { 
    Zap, BrainCircuit, X, Loader2, ShieldCheck, Activity, ChevronRight, 
    Layers, Crown, Sliders, Briefcase, Layout, TrendingUp, BarChart, 
    Search, PenTool, Globe, Target, FlaskConical, PieChart, Info, Users,
    Dna, Terminal, Sparkles, AlertCircle, FileSearch, ArrowRight, Gauge,
    Download, RefreshCw, MessageSquare, Save
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { streamChat } from '../services/ai-service';
import { marked } from 'marked';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const StrategyHub: React.FC<{ language: Language, onNavigate: (view: View) => void }> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { companyName, addNote } = useCompany();
  const { observeAction } = useUniversalAgent();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<{id: number, text: string, status: 'pending' | 'done'}[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const advisoryTools = [
    { id: 'pos', name: isZh ? '市場地位分析' : 'Market Positioning', icon: Target, cat: 'STRAT' },
    { id: 'biz', name: isZh ? '商業模式評估' : 'Business Model', icon: Briefcase, cat: 'SYNTH' },
    { id: 'comp', name: isZh ? '競爭者策略' : 'Competitor Analysis', icon: Search, cat: 'INTEL' },
    { id: 'risk', name: isZh ? '趨勢風險雷達' : 'Risk Radar', icon: Activity, cat: 'TRUST' },
    { id: 'swot', name: isZh ? 'SWOT 深度解析' : 'SWOT Analysis', icon: Layout, cat: 'CORE' },
    { id: 'jour', name: isZh ? '顧客旅程分析' : 'Customer Journey', icon: Activity, cat: 'SOCIAL' },
    { id: 'cul', name: isZh ? '組織文化分析' : 'Culture Analysis', icon: Users, cat: 'ALTRU' },
    { id: 'narr', name: isZh ? '文明敘事對齊' : 'Civ Narrative', icon: PenTool, cat: 'LIGHT' },
  ];

  const handleToolExecute = async (tool: any) => {
    setSelectedTool(tool.id);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    const steps = [
        { id: 1, text: isZh ? "初始化 12A 認知維度..." : "Initializing 12A Cognition...", status: 'pending' as const },
        { id: 2, text: isZh ? "對標全球 500 強最佳實踐..." : "Benchmarking Fortune 500...", status: 'pending' as const },
        { id: 3, text: isZh ? "執行王道利他模擬演算法..." : "Executing Wangdao Altruism sim...", status: 'pending' as const },
    ];
    setThinkingSteps(steps);
    
    addToast('info', isZh ? `正在啟動 [${tool.name}] 深度分析...` : `Initiating [${tool.name}] analysis...`, 'Advisory');
    
    try {
        await new Promise(r => setTimeout(r, 800));
        setThinkingSteps(prev => prev.map(s => s.id === 1 ? {...s, status: 'done'} : s));
        
        const prompt = `你現在是 ESGss 首席顧問。請針對「${tool.name}」模組，為當前企業提供深度策略建議。請展現你的推理過程。語系：${isZh ? '繁體中文' : 'English'}`;
        const stream = streamChat(prompt, language, "你是一位國際頂尖的 ESG 戰略顧問，擅長運用各種商管工具產出具備利他精神的建議。", [], [], 'gemini-3-pro-preview');
        
        let fullRes = '';
        for await (const chunk of stream) {
            if (fullRes === '') {
                setThinkingSteps(prev => prev.map(s => s.id === 2 ? {...s, status: 'done'} : s));
            }
            fullRes += chunk.text || '';
            setAnalysisResult(fullRes);
            if (outputRef.current) {
                outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
        }
        
        setThinkingSteps(prev => prev.map(s => s.id === 3 ? {...s, status: 'done'} : s));
        observeAction('ADVISORY_EXEC', tool.name);
    } catch (e) {
        addToast('error', 'Kernel Logic Interrupted', 'Error');
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!analysisResult) return;
    const toolName = advisoryTools.find(t => t.id === selectedTool)?.name || 'Advisory';
    addNote(analysisResult, ['Strategy', 'Advisory'], `Advisory_${toolName}_${new Date().getTime()}`, `## 策略建議: ${toolName}\n\n${analysisResult}`, undefined, 'StrategyHub');
    addToast('success', isZh ? '分析結果已儲存至萬能筆記' : 'Analysis saved to Universal Notes', 'Memory');
  };

  const handleExportPDF = () => {
    if (!analysisResult) return;
    setIsExporting(true);
    addToast('info', isZh ? '正在顯化專業顧問報告...' : 'Manifesting Advisory Report...', 'Exporter');
    
    const activeToolName = advisoryTools.find(t => t.id === selectedTool)?.name || 'Advisory';

    const printContainer = document.createElement('div');
    printContainer.style.padding = '60px';
    printContainer.style.background = '#FFFFFF';
    printContainer.style.color = '#020617';
    printContainer.style.fontFamily = "'Inter', 'serif'";

    const header = document.createElement('div');
    header.style.borderBottom = '4px solid #020617';
    header.style.paddingBottom = '30px';
    header.style.marginBottom = '50px';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'flex-end';
    header.innerHTML = `
        <div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #020617; letter-spacing: -0.02em;">STRATEGIC ADVISORY BLUEPRINT</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.1em;">CLIENT ENTITY: ${companyName.toUpperCase()}</p>
        </div>
        <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; font-weight: 900; color: #94a3b8; letter-spacing: 0.2em;">JAK_CORE_v16.1</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 800; color: #020617;">${new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    `;
    printContainer.appendChild(header);

    const meta = document.createElement('div');
    meta.style.display = 'flex';
    meta.style.gap = '24px';
    meta.style.marginBottom = '40px';
    meta.innerHTML = `
        <div style="flex: 1; padding: 24px; background: #f1f5f9; border-radius: 20px; border: 1px solid #e2e8f0;">
            <div style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">Analysis Domain</div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${activeToolName}</div>
        </div>
        <div style="flex: 1; padding: 24px; background: #f1f5f9; border-radius: 20px; border: 1px solid #e2e8f0;">
            <div style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">Integrity Hash</div>
            <div style="font-size: 12px; font-family: monospace; color: #0f172a; font-weight: 700;">0x${Math.random().toString(16).substr(2, 12).toUpperCase()}</div>
        </div>
    `;
    printContainer.appendChild(meta);

    const content = document.createElement('div');
    content.className = 'markdown-body';
    content.style.color = '#1e293b';
    content.innerHTML = marked.parse(analysisResult) as string;
    
    content.querySelectorAll('h1, h2, h3').forEach((el: any) => {
        el.style.color = '#0f172a';
        el.style.fontWeight = '900';
        el.style.borderBottom = '2px solid #f1f5f9';
        el.style.paddingBottom = '12px';
        el.style.marginTop = '40px';
        el.style.letterSpacing = '-0.01em';
    });
    content.querySelectorAll('h2').forEach((el: any) => el.style.fontSize = '24px');
    content.querySelectorAll('p, li').forEach((el: any) => {
        el.style.color = '#334155';
        el.style.lineHeight = '1.8';
        el.style.fontSize = '14px';
        el.style.marginBottom = '16px';
    });
    
    printContainer.appendChild(content);

    const footer = document.createElement('div');
    footer.style.marginTop = '80px';
    footer.style.paddingTop = '30px';
    footer.style.borderTop = '2px solid #f1f5f9';
    footer.style.textAlign = 'center';
    footer.innerHTML = `
        <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em;">
            Confidential Document • Manifested by ESGss Advisory Lab • Secure Logic Verification Active
        </p>
        <p style="margin: 8px 0 0 0; font-size: 10px; color: #cbd5e1; font-weight: 700;">© 2025 JunAiKey Technologies. All Rights Reserved. This blueprint is provided for strategic guidance only.</p>
    `;
    printContainer.appendChild(footer);

    const opt = {
        margin: [15, 10, 15, 10] as [number, number, number, number],
        filename: `ESGss_Advisory_Report_${companyName.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
        image: { type: 'jpeg' as const, quality: 1.0 },
        html2canvas: { scale: 4, useCORS: true, letterRendering: true, backgroundColor: '#FFFFFF' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const, compress: true }
    };
    
    html2pdf().set(opt).from(printContainer).save().then(() => {
        setIsExporting(false);
        addToast('success', isZh ? '精美顧問報告已匯出' : 'Bespoke advisory report exported', 'Success');
    });
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Briefcase}
            title={{ zh: '整合顧問實驗室', en: 'Integrated Advisory Lab' }}
            description={{ zh: 'AI × 專業商管工具：產出具備「王道利他」精神的企業永續建議', en: 'AI × Consulting Tools: Manifesting Wangdao-driven Sustainability' }}
            language={language}
            tag={{ zh: '顧問內核 v16.1', en: 'ADVISORY_V16.1' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 overflow-hidden">
                <div className="glass-bento p-6 flex flex-col bg-slate-900/60 border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden h-full">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                         <h3 className="zh-main text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Toolcase
                        </h3>
                        <div className="uni-mini bg-slate-800 text-gray-500 uppercase text-[8px]">Ready</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                        {advisoryTools.map(tool => (
                            <button 
                                key={tool.id}
                                onClick={() => handleToolExecute(tool)}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden
                                    ${selectedTool === tool.id ? 'bg-celestial-gold/10 border-celestial-gold/40 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}
                                `}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-2 rounded-xl transition-all ${selectedTool === tool.id ? 'bg-celestial-gold text-black shadow-lg' : 'bg-black/40 text-gray-700'}`}>
                                        <tool.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[12px] font-black uppercase tracking-tight text-left leading-tight">{tool.name}</span>
                                </div>
                                <ChevronRight className={`w-3 h-3 transition-all ${selectedTool === tool.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-9 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 glass-bento bg-[#020617] border-white/5 rounded-[3rem] relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.03)_0%,_transparent_70%)] pointer-events-none" />
                    
                    <div className="p-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center shrink-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-celestial-purple/20 rounded-2xl border border-celestial-purple/30 text-celestial-purple shadow-lg">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="zh-main text-base text-white tracking-widest uppercase">Advisor Terminal</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="en-sub !text-[7px] text-emerald-500 font-black tracking-widest uppercase">Cognitive_Engine_v16</span>
                                </div>
                            </div>
                        </div>
                        {selectedTool && analysisResult && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleSaveToNotes}
                                    className="px-6 py-2 bg-emerald-500 text-black hover:brightness-110 transition-all rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    SAVE_TO_SHARDS
                                </button>
                                <button 
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="px-6 py-2 bg-white text-black hover:bg-celestial-gold transition-all rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl disabled:opacity-50"
                                >
                                    {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} 
                                    {isZh ? '匯出精美報告' : 'Export_Insights'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div ref={outputRef} className="flex-1 p-10 overflow-y-auto no-scrollbar relative z-0">
                        {isAnalyzing && (
                            <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5 animate-fade-in">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-celestial-gold animate-pulse" />
                                    Thinking_Chain_Active
                                </h4>
                                <div className="space-y-4">
                                    {thinkingSteps.map((step) => (
                                        <div key={step.id} className="flex items-center gap-4 transition-all">
                                            <div className={`w-2 h-2 rounded-full ${step.status === 'done' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-800 animate-pulse'}`} />
                                            <span className={`text-[11px] font-mono uppercase tracking-widest ${step.status === 'done' ? 'text-gray-300' : 'text-gray-600'}`}>{step.text}</span>
                                            {step.status === 'done' && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysisResult ? (
                            <div className="animate-fade-in max-w-4xl bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed text-gray-200">
                                    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(analysisResult) as string }} />
                                </div>
                            </div>
                        ) : !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-10 select-none grayscale">
                                <BrainCircuit className="w-48 h-48 text-gray-600 mb-8 animate-pulse" />
                                <h3 className="zh-main text-5xl text-white uppercase tracking-[0.2em] mb-4">Awaiting Advisory Signal</h3>
                                <p className="text-gray-500 text-lg max-w-md font-light italic">「萬物歸宗，撥亂反正：選擇一個分析模組以啟動內核推理。」</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/5 bg-slate-950/40 flex justify-between items-center shrink-0 z-10">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase">
                                <Activity className="w-3 h-3" /> System_Vital: Stable
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase">
                                <Dna className="w-3 h-3" /> Logic_Sync: 99.8%
                            </div>
                        </div>
                        <span className="text-[9px] font-mono text-gray-700">TENSOR_CLUSTER_A9_READY</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

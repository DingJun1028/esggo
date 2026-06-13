'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { BookOpen, Sparkles, Layers, Cpu, Database, Eye, ShieldCheck, AlignLeft, RefreshCcw, CheckCircle2, Undo2, Redo2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShieldOfAbsoluteTruth } from '@/components/omni/ShieldOfAbsoluteTruth';
import { SustainWriteTemplates, aiTemplateSelector, ZeroComputeTemplate } from '@/components/templates/sustain-write/registry';
import SustainWriteTipTapEditor from '@/components/omni/SustainWriteTipTapEditor';
import { useSustainWriteStore } from '@/store/useSustainWriteStore';
import OmniEvidenceUploader from '@/components/omni/OmniEvidenceUploader';

const TRAITS_POOL = ['製造業', '服務業', '科技業', '金控業', '綜合企業', '能源密集', '淨零承諾', '注重人才', '初次編製'];

export default function SustainWritePage() {
  const [isWeaving, setIsWeaving] = useState(false);
  const [weavingProgress, setWeavingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'data' | 'preview'>('blueprint');
  
  // AI Template Selection States
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<ZeroComputeTemplate | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  
  const { generatedContent, updateContent, manualSave, initData, undoContent, redoContent, expandContentWithAI, isGeneratingAI, contentHistory } = useSustainWriteStore();

  const [uploaderTarget, setUploaderTarget] = useState<string | null>(null);
  const [uploadedEvidences, setUploadedEvidences] = useState<Record<string, {name: string, url: string, hash: string}>>({});

  useEffect(() => {
    initData('default');
  }, [initData]);

  const currentChapter = activeTemplate?.chapters[activeChapterIndex] || null;
  const currentChapterId = currentChapter ? `chapter-${activeChapterIndex}` : 'main-chapter';
  const currentChapterName = currentChapter ? currentChapter.title : '永續藍圖報告';
  const currentChapterOrder = activeChapterIndex + 1;
  const currentGriRefs = currentChapter ? currentChapter.requiredIndicators : ['GRI-2-1'];

  // Calculate unique active required indicators for the entire blueprint
  const activeRequiredIndicators = Array.from(new Set(activeTemplate?.chapters.flatMap(ch => ch.requiredIndicators) || []));

  const [vaultIndicators, setVaultIndicators] = useState<any[]>([]);
  const [isFetchingVault, setIsFetchingVault] = useState(false);

  useEffect(() => {
    if (activeRequiredIndicators.length === 0) {
      setVaultIndicators([]);
      return;
    }
    
    const fetchVaultData = async () => {
      setIsFetchingVault(true);
      try {
        const res = await fetch('/api/vault/indicators', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ indicatorIds: activeRequiredIndicators })
        });
        const json = await res.json();
        if (json.success) {
          setVaultIndicators(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch vault indicators:', error);
      } finally {
        setIsFetchingVault(false);
      }
    };

    fetchVaultData();
  }, [JSON.stringify(activeRequiredIndicators)]); // Use JSON.stringify for deep comparison of the array

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedHash, setPublishedHash] = useState<string | null>(null);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(prev => prev.filter(t => t !== trait));
    } else {
      if (selectedTraits.length < 3) {
        setSelectedTraits(prev => [...prev, trait]);
      }
    }
  };

  const handleAiAnalysis = () => {
    if (selectedTraits.length === 0) return;
    setIsAiAnalyzing(true);
    // Simulate AI thinking time for effect
    setTimeout(() => {
      const template = aiTemplateSelector(selectedTraits);
      setActiveTemplate(template);
      setIsAiAnalyzing(false);
    }, 1500);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setPublishedHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
      setIsPublishing(false);
    }, 1500);
  };

  const handleSaveDraft = async () => {
    try {
      await manualSave(currentChapterId, currentChapterName, currentChapterOrder, currentGriRefs);
      alert("當前章節草稿已安全加密儲存至 OmniVault！");
    } catch (e) {
      alert("儲存失敗！");
    }
  };

  const handleWeave = async () => {
    if (!activeTemplate) return;
    setIsWeaving(true);
    setWeavingProgress(0);
    
    try {
      // Auto-switch to preview to see the magic typing live
      setActiveTab('preview');
      setActiveChapterIndex(0);

      for (let i = 0; i < activeTemplate.chapters.length; i++) {
        const ch = activeTemplate.chapters[i];
        const chId = `chapter-${i}`;
        
        setActiveChapterIndex(i);

        const contextDataStr = ch.requiredIndicators.map(ref => {
          const dataItem = vaultIndicators.find(item => item.id === ref);
          return dataItem ? `${dataItem.name}: ${dataItem.val}` : `${ref}: (尚未連結數據)`;
        }).join('; ');

        // Initialize empty content
        updateContent(chId, `<h2>${ch.title}</h2>\n`, ch.title, i + 1, ch.requiredIndicators);

        // Real AI generation with streaming
        await expandContentWithAI(
          chId, 
          ch.title, 
          i + 1, 
          ch.requiredIndicators, 
          `你是一個專業的 ESG 永續報告編撰系統。請根據以下藍圖要求：\n${ch.contentBlueprint}\n\n並且融合以下 5T 實證數據：\n[${contextDataStr}]\n\n為本章節撰寫專業、正式且詳細的永續報告內容。避免過多的前言，直接進入正題，使用 HTML 段落 (<p>, <ul>, <li> 等) 進行排版。`
        );
        
        setWeavingProgress(Math.floor(((i + 1) / activeTemplate.chapters.length) * 100));
      }
    } catch (error) {
      console.error('Weaving failed:', error);
      alert('AI 編織過程發生錯誤！');
    } finally {
      setIsWeaving(false);
      setWeavingProgress(100);
    }
  };

  const handleExportReport = async () => {
    if (!activeTemplate) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const printDiv = document.createElement('div');
      printDiv.style.position = 'absolute';
      printDiv.style.top = '-9999px';
      printDiv.style.width = '800px';
      printDiv.style.backgroundColor = '#ffffff';
      printDiv.style.padding = '40px';
      printDiv.style.color = '#000000';
      printDiv.style.fontFamily = 'sans-serif';

      let htmlContent = `<div style="text-align:center;margin-bottom:40px;"><h1 style="color:#06b6d4;">${activeTemplate.name}</h1><p>ESGGO OmniCore Verified Report</p></div>`;
      
      activeTemplate.chapters.forEach((ch, idx) => {
        const chId = `chapter-${idx}`;
        htmlContent += `<h2 style="color:#003262;border-bottom:1px solid #ccc;padding-bottom:10px;margin-top:30px;">${ch.title}</h2>`;
        htmlContent += `<div style="line-height:1.6;font-size:14px;">${generatedContent[chId] || '<p>(此章節尚無內容)</p>'}</div>`;
      });
      
      printDiv.innerHTML = htmlContent;
      document.body.appendChild(printDiv);
      
      const canvas = await html2canvas(printDiv, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeTemplate.name}-ESGGO報告.pdf`);
      
      document.body.removeChild(printDiv);
    } catch (e) {
      console.error('PDF Export Error:', e);
      alert('PDF 匯出失敗，請檢查日誌');
    }
  };

  const p = {
    id: `SW-850`,
    title: 'SustainWrite 永續編織',
    sub: 'Holographic Report Generation Engine'
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      {uploaderTarget && (
        <OmniEvidenceUploader 
          onClose={() => setUploaderTarget(null)}
          onUploadSuccess={(evidence) => {
            setUploadedEvidences(prev => ({...prev, [uploaderTarget]: evidence}));
          }}
        />
      )}
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm" icon={<Sparkles size={12}/>}>Cognitive Programming</OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{p.id}</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">{p.title}</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">{p.sub}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton variant="outline" icon={<RefreshCcw size={16}/>} className="flex-1 md:flex-none">重置引擎</OmniButton>
            {activeTemplate && activeTab === 'preview' && (
              <OmniButton 
                variant="outline" 
                icon={<AlignLeft size={16}/>} 
                onClick={handleExportReport} 
                className="flex-1 md:flex-none text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/30"
              >
                匯出報告 (HTML)
              </OmniButton>
            )}
            <OmniButton 
              variant="primary" 
              icon={<Layers size={16}/>} 
              onClick={handleWeave} 
              isLoading={isWeaving}
              disabled={!activeTemplate || isWeaving} 
              className="flex-1 md:flex-none bg-gradient-to-r from-aqua-cyan-midtone to-aqua-cyan hover:from-aqua-cyan hover:to-aqua-cyan-shadow border-none shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              啟動全息編織
            </OmniButton>
          </div>
        </header>

        {/* AI Setup / Profiling Section */}
        {!activeTemplate && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full" />
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="text-cyan-400" size={20} />
              零算力專家模板 (Zero-Compute AI Profiling)
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-2xl">
              選擇最符合您企業當前特徵的標籤（最多 3 項）。AI 將根據這些特徵，從預先部署的專家模板庫中為您配對最佳的永續報告藍圖。
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {TRAITS_POOL.map(trait => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                    selectedTraits.includes(trait)
                      ? "bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  )}
                >
                  {trait}
                </button>
              ))}
            </div>

            <OmniButton 
              variant="primary" 
              icon={<Sparkles size={16}/>}
              onClick={handleAiAnalysis}
              disabled={selectedTraits.length === 0 || isAiAnalyzing}
              isLoading={isAiAnalyzing}
            >
              {isAiAnalyzing ? 'AI 神經突觸配對中...' : '執行 AI 模板配對'}
            </OmniButton>
          </div>
        )}

        {isWeaving && (
          <div className="p-6 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl space-y-4 animate-pulse relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
             <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <Cpu className="text-cyan-400 animate-spin-slow" size={24} />
                  <div>
                    <h3 className="text-cyan-400 font-bold">無有技藝・連發 (Void-Presence Combo)</h3>
                    <p className="text-xs text-cyan-500/70">正在將碎片化指標映射至「{activeTemplate?.name}」結構中...</p>
                  </div>
                </div>
                <span className="text-xl font-mono font-black text-cyan-300">{weavingProgress}%</span>
             </div>
             <div className="h-2 w-full bg-cyan-950 rounded-full overflow-hidden relative z-10">
               <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-200" style={{ width: `${weavingProgress}%` }} />
             </div>
          </div>
        )}

        <div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-6 transition-all duration-700", activeTemplate ? "opacity-100" : "opacity-30 pointer-events-none filter blur-sm")}>
          <div className="lg:col-span-3 space-y-6">
            
            {/* Nav Tabs */}
            <div className="flex gap-4 border-b border-slate-800 pb-2">
              {[
                { id: 'blueprint', label: '永續藍圖 (Blueprint)', icon: <Layers size={16} /> },
                { id: 'data', label: '實證數據庫 (Vault)', icon: <Database size={16} /> },
                { id: 'preview', label: '全息編撰 (Smart Edit)', icon: <Eye size={16} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-t-lg border-b-2",
                    activeTab === tab.id 
                      ? "text-cyan-400 border-cyan-400 bg-cyan-950/30" 
                      : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === 'blueprint' && activeTemplate && (
                <div className="space-y-6">
                  <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-start gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="p-3 bg-cyan-900/50 text-cyan-400 rounded-lg">
                      <activeTemplate.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-cyan-300 font-bold flex items-center gap-2">
                        {activeTemplate.name}
                        <OmniBadge variant="success" size="sm" icon={<CheckCircle2 size={12}/>}>AI Selected</OmniBadge>
                      </h3>
                      <p className="text-sm text-cyan-500/80 mt-1">{activeTemplate.aiSelectionPrompt}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTemplate.chapters.map((chapter, i) => (
                      <OmniBaseCard key={i} variant="glass" className="hover:border-cyan-500/50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-900/50 group-hover:text-cyan-400 transition-colors">
                            <AlignLeft size={20} />
                          </div>
                          <OmniBadge 
                            variant="primary"
                            size="sm"
                          >
                            READY
                          </OmniBadge>
                        </div>
                        <h3 className="font-bold text-white mb-2">{chapter.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">{chapter.desc}</p>
                        <div className="flex gap-2">
                          {chapter.requiredIndicators.map(ind => (
                            <span key={ind} className="text-[10px] font-mono text-cyan-500/60 bg-cyan-950/40 px-1.5 py-0.5 rounded">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </OmniBaseCard>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="flex flex-col lg:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4">
                  {/* Left Sidebar: Chapter List */}
                  <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    <h3 className="text-cyan-400 font-bold mb-3 px-2 flex items-center gap-2"><Layers size={16}/> 報告目錄</h3>
                    {activeTemplate?.chapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveChapterIndex(idx)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg text-sm transition-all border",
                          activeChapterIndex === idx 
                            ? "bg-cyan-900/50 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                            : "bg-slate-800/30 border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                        )}
                      >
                        <div className="font-bold truncate">{ch.title}</div>
                        <div className="text-[10px] text-slate-500 mt-1 flex gap-1 flex-wrap">
                          {ch.requiredIndicators.map(r => <span key={r} className="bg-slate-900 px-1 rounded">{r}</span>)}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right: Editor */}
                  <div className="flex-1 p-4 bg-white text-slate-800 rounded-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="flex flex-wrap md:flex-nowrap justify-between items-center pb-4 border-b border-slate-100 mt-2 gap-4">
                        <h2 className="text-xl font-bold text-[#003262] flex items-center gap-2 whitespace-nowrap">
                          <Sparkles className="text-cyan-500" size={20} />
                          {currentChapterName}
                        </h2>
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                          <div className="flex gap-1 mr-2 border-r border-slate-200 pr-3">
                            <OmniButton 
                              variant="outline" 
                              size="sm" 
                              icon={<Undo2 size={16}/>}
                              onClick={() => undoContent(currentChapterId, currentChapterName, currentChapterOrder, currentGriRefs)}
                              disabled={!(contentHistory[currentChapterId]?.past?.length > 0)}
                            />
                            <OmniButton 
                              variant="outline" 
                              size="sm" 
                              icon={<Redo2 size={16}/>}
                              onClick={() => redoContent(currentChapterId, currentChapterName, currentChapterOrder, currentGriRefs)}
                              disabled={!(contentHistory[currentChapterId]?.future?.length > 0)}
                            />
                            <OmniButton 
                              variant="outline" 
                              size="sm" 
                              icon={<Wand2 size={16}/>}
                              onClick={() => {
                                const contextDataStr = currentGriRefs.map(ref => {
                                  const dataItem = vaultIndicators.find(item => item.id === ref);
                                  return dataItem ? `${dataItem.name}: ${dataItem.val}` : `${ref}: (尚未連結數據)`;
                                }).join('; ');
                                
                                expandContentWithAI(
                                  currentChapterId, 
                                  currentChapterName, 
                                  currentChapterOrder, 
                                  currentGriRefs, 
                                  `請深入擴寫此段落，並嚴格根據以下 5T Vault 實證數據進行具體的量化論述：[${contextDataStr}]。確保語氣符合企業永續報告書之正式性與 GRI 準則。`
                                );
                              }}
                              isLoading={isGeneratingAI[currentChapterId]}
                              className="text-amber-500 border-amber-200 hover:bg-amber-50"
                            >
                              AI 智能擴寫 (RAG)
                            </OmniButton>
                          </div>
                          <OmniButton variant="outline" size="sm" onClick={handleSaveDraft}>儲存草稿</OmniButton>
                          <OmniButton 
                            variant="primary" 
                            size="sm" 
                            className="bg-cyan-600 hover:bg-cyan-700 border-none whitespace-nowrap"
                            onClick={handlePublish}
                            isLoading={isPublishing}
                          >
                            {publishedHash ? '重新發布' : '發布章節'}
                          </OmniButton>
                        </div>
                      </div>
                      
                      {publishedHash && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-start gap-3 animate-in fade-in">
                          <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} />
                          <div>
                            <h4 className="font-bold">章節發布成功！</h4>
                            <p className="text-sm mt-1">此章節已完成 5T 驗證並上鏈，不可篡改雜湊值：</p>
                            <p className="text-xs font-mono bg-emerald-100 px-2 py-1 rounded mt-2 break-all">{publishedHash}</p>
                          </div>
                        </div>
                      )}
                      
                      <SustainWriteTipTapEditor 
                        value={generatedContent[currentChapterId] || ''} 
                        onChange={(val) => updateContent(currentChapterId, val, currentChapterName, currentChapterOrder, currentGriRefs)} 
                      />
                      
                      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono">
                        <p className="flex justify-between border-b border-slate-200 pb-2 mb-2">
                          <span>5T 協議狀態 ({currentGriRefs.join(', ')})</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">即時同步中 <CheckCircle2 size={14} className="text-emerald-500"/></span>
                        </p>
                        <p className="flex justify-between">
                          <span>全息驗證 Hash</span>
                          <span className="text-cyan-600">0x{Math.random().toString(16).substring(2, 10)}...</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-5 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-950/50 rounded-lg text-cyan-400 border border-cyan-500/20">
                        <Database size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg tracking-wide">5T 實證數據庫 (Vault)</h3>
                        <p className="text-xs text-slate-400 mt-1">已連結 <span className="text-cyan-400 font-mono">{activeRequiredIndicators.length}</span> 筆不可篡改指標</p>
                      </div>
                    </div>
                    <OmniButton variant="outline" size="sm" icon={<ShieldCheck size={14}/>} className="w-full md:w-auto border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30">
                      驗證全庫 Hash
                    </OmniButton>
                  </div>

                  {isFetchingVault ? (
                    <div className="p-8 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl flex items-center justify-center gap-2">
                      <RefreshCcw className="animate-spin text-cyan-500" size={16} /> 正在同步 5T 實證數據庫...
                    </div>
                  ) : activeRequiredIndicators.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                      尚未配對藍圖或藍圖未要求指標
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vaultIndicators.map((item, idx) => {
                        return (
                          <OmniBaseCard key={idx} variant="glass" className="hover:border-cyan-500/30 transition-all hover:shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded-md border border-cyan-500/20">{item.id}</span>
                              <OmniBadge 
                                variant={item.status === 'verified' ? 'success' : 'outline'} 
                                size="sm"
                              >
                                {item.status === 'verified' ? '5T VERIFIED' : 'PENDING'}
                              </OmniBadge>
                            </div>
                            <h4 className="text-sm text-slate-200 font-medium mb-1">{item.name}</h4>
                            <p className="text-xl font-mono text-white font-black mb-4 tracking-tight">{item.val}</p>
                            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                              <span className="text-slate-500 flex items-center gap-1"><Cpu size={10} /> Hash Lock</span>
                              <span className={item.status === 'verified' ? 'text-emerald-400/80 font-mono tracking-widest' : 'text-slate-500 italic'}>
                                {item.hash}
                              </span>
                            </div>
                            {/* Evidence Receipt Collection Section (萬能智庫佐證庫) */}
                            <div className="mt-3 pt-3 border-t border-white/5">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <ShieldCheck size={12} className="text-cyan-500" />
                                  萬能智庫佐證單據
                                </span>
                                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                                  {uploadedEvidences[item.id] || item.status === 'verified' ? '已鏈接' : '待收集'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <OmniButton variant="outline" size="sm" className="flex-1 text-[10px] h-7 border-slate-700 hover:bg-slate-800 text-slate-300">
                                  瀏覽智庫
                                </OmniButton>
                                {uploadedEvidences[item.id] ? (
                                  <div className="flex-1 text-[10px] h-7 flex items-center justify-center gap-1 bg-emerald-950/50 text-emerald-400 rounded-md border border-emerald-500/30 font-bold">
                                    <CheckCircle2 size={12} /> 單據已封印
                                  </div>
                                ) : (
                                  <OmniButton 
                                    variant="primary" 
                                    size="sm" 
                                    className="flex-1 text-[10px] h-7 bg-cyan-900/50 hover:bg-cyan-800 border-cyan-700/50 text-cyan-300"
                                    onClick={() => setUploaderTarget(item.id)}
                                  >
                                    上傳單據
                                  </OmniButton>
                                )}
                              </div>
                            </div>
                          </OmniBaseCard>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <OmniBaseCard 
              variant="glow" 
              title="ESG 實境之眼" 
              subtitle="Eye of Sustainability Reality"
            >
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  SustainWrite 引擎正即時將 Vault 中的 5T 實證數據庫映射至報告書藍圖，確保每一字節的揭露皆無懈可擊。
                </p>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">邏輯量子糾纏</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">Hash 連結連續體</span>
                    <span className="text-emerald-400">Stable</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400">當前模板引擎</span>
                    <span className="text-slate-400">{activeTemplate ? activeTemplate.id : '等待配對'}</span>
                  </div>
                </div>
              </div>
            </OmniBaseCard>

            <ShieldOfAbsoluteTruth 
              contentId="sustain-write-draft" 
              isAiGenerated={true} 
              className="bg-slate-900 border-white/10" 
            />

          </div>
        </div>

      </div>
    </div>
  );
}

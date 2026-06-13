'use client';

import React, { useState, useEffect } from 'react';
import { Factory, Library, Wrench, ChevronRight, Activity, Code, Zap, Database, CheckCircle, ShieldCheck, CircleDot, Terminal } from 'lucide-react';
import OmniBookCaseRegistry from '@/components/omni/OmniBookCaseRegistry';

export default function OmniFactoryBasePage() {
  const [activeTab, setActiveTab] = useState<'factory' | 'bookshelf' | 'oneness' | 'tools'>('factory');
  const [dslInput, setDslInput] = useState(`Component: CustomESGWidget\nVersion: v1.0.0\nAuthor: user-123\nCategory: molecule\n\nDesignTokens:\n  primary: "#10B981"\n  surface: "rgba(255,255,255,0.85)"\n\n5T_Integration:\n  Tangible: "數值動態顯示"`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [swarmLogs, setSwarmLogs] = useState<string[]>([
    '[OmniAgent] Swarm Commander online.',
    '[L-Hub] Awaiting delegation cues...',
    '[Jules] Karma protocol standby. Zero hallucinations.'
  ]);

  // Simulate Swarm Chatter
  useEffect(() => {
    if (activeTab !== 'tools') return;
    const interval = setInterval(() => {
      const messages = [
        '[L-Hub] Processing OCR vector embedding...',
        '[Jules] Validating component syntax integrity...',
        '[OmniNexus] Dispatched 5T ZKP telemetry...',
        '[OmniAgent] Optimizing background thread usage.',
        '[DataConnect] Syncing user profile delta.'
      ];
      setSwarmLogs(prev => [...prev, messages[Math.floor(Math.random() * messages.length)]].slice(-6));
    }, 3500);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSubmitDsl = () => {
    setIsSubmitting(true);
    setPipelineLogs(['[SYS] Parsing OmniFactory DSL...', '[SYS] Validating schema against OMNIFACTORY_DSL.md...']);
    
    setTimeout(() => setPipelineLogs(prev => [...prev, '[ZKP] Checking 5T compliance (Traceable, Trackable)... Passed!']), 800);
    setTimeout(() => setPipelineLogs(prev => [...prev, '[BUILD] Compiling React AST...']), 1600);
    setTimeout(() => setPipelineLogs(prev => [...prev, '[SEAL] Applying Cryptographic Hash Lock...']), 2400);
    setTimeout(() => {
      setPipelineLogs(prev => [...prev, '[SUCCESS] Component published to OmniBookCaseRegistry.']);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-mono relative selection:bg-cyan-500/30 selection:text-white">
      {/* Liquid Glass Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] bg-cyan-500 opacity-20 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 opacity-15 blur-[110px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_95%,rgba(6,182,212,0.015)_95%)] bg-[length:100%_40px] pointer-events-none" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        {/* Header Dashboard */}
        <header className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center bg-cyan-950/40 border border-cyan-500/30 rounded-xl shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Factory className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-widest">OMNI CORE</span>
                <span className="text-xs text-slate-500 font-bold"><ShieldCheck size={12} className="inline mr-1 text-emerald-400"/>5T-VERIFIED</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 mt-1" style={{ textShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                萬能元件中心基地
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-black/50 border border-white/5 px-4 py-2 rounded-lg flex items-center gap-3">
              <Code className="text-emerald-400" size={18} />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">元件庫儲備</div>
                <div className="text-lg font-bold font-mono text-emerald-400">1,204</div>
              </div>
            </div>
            <div className="bg-black/50 border border-white/5 px-4 py-2 rounded-lg flex items-center gap-3">
              <ShieldCheck className="text-indigo-400" size={18} />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">5T Hash 封印率</div>
                <div className="text-lg font-bold font-mono text-indigo-400">99.8%</div>
              </div>
            </div>
            <div className="bg-black/50 border border-white/5 px-4 py-2 rounded-lg flex items-center gap-3">
              <Activity className="text-cyan-400" size={18} />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">工廠運作狀態</div>
                <div className="text-lg font-bold font-mono text-cyan-400">OPTIMAL</div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('factory')}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'factory' ? 'bg-cyan-950/50 text-cyan-400 border-t border-l border-r border-cyan-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <Factory size={16} /> 萬能工廠 (Factory)
          </button>
          <button 
            onClick={() => setActiveTab('bookshelf')}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'bookshelf' ? 'bg-emerald-950/50 text-emerald-400 border-t border-l border-r border-emerald-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <Library size={16} /> 萬能書櫃 (Bookshelf)
          </button>
          <button 
            onClick={() => setActiveTab('oneness')}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'oneness' ? 'bg-indigo-950/50 text-indigo-400 border-t border-l border-r border-indigo-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <CircleDot size={16} /> 圓通同心圓 (Oneness)
          </button>
          <button 
            onClick={() => setActiveTab('tools')}
            className={`px-6 py-3 rounded-t-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'tools' ? 'bg-purple-950/50 text-purple-400 border-t border-l border-r border-purple-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <Wrench size={16} /> 萬能工具 (Tools)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-black/40 backdrop-blur-md rounded-b-2xl rounded-tr-2xl p-6 border border-white/5 relative overflow-hidden min-h-[600px]">
          
          {/* TAB 1: FACTORY */}
          {activeTab === 'factory' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <h2 className="text-lg font-bold text-cyan-100 tracking-wider">萬能工廠 DSL 提交器</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left: Input */}
                <div className="flex flex-col gap-4">
                  <div className="bg-black/50 border border-cyan-500/20 rounded-xl p-4 flex-1 flex flex-col">
                    <label className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Code size={14} /> OmniFactory DSL 腳本定義
                    </label>
                    <textarea 
                      value={dslInput}
                      onChange={(e) => setDslInput(e.target.value)}
                      className="w-full flex-1 bg-black/50 border border-white/10 rounded-lg p-4 text-cyan-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      placeholder="請輸入需求單 (OmniAssistant-REQ) 的 YAML DSL..."
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-slate-500">遵循 OMNIFACTORY_DSL.md 標準</span>
                      <button 
                        onClick={handleSubmitDsl}
                        disabled={isSubmitting}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold tracking-widest text-sm flex items-center gap-2 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      >
                        {isSubmitting ? <span className="animate-pulse">編譯中...</span> : submitStatus === 'success' ? <><CheckCircle size={16}/> 提交成功</> : <><Zap size={16}/> 啟動生成</>}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Pipeline Status */}
                <div className="flex flex-col gap-4">
                  <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex-1 flex flex-col">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Database size={14} /> 生產線與審核狀態 (Pipeline Status)
                    </label>
                    
                    {/* Live Streaming Logs */}
                    <div className="bg-black/80 border border-white/5 rounded-lg p-4 flex-1 font-mono text-xs overflow-y-auto max-h-[300px]">
                      {pipelineLogs.length === 0 ? (
                        <span className="text-slate-600">Awaiting DSL submission to start pipeline...</span>
                      ) : (
                        pipelineLogs.map((log, i) => (
                          <div key={i} className={`mb-1 ${log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[ZKP]') ? 'text-indigo-400' : 'text-slate-300'}`}>
                            &gt; {log}
                          </div>
                        ))
                      )}
                      {isSubmitting && <div className="text-cyan-400 animate-pulse mt-2">_</div>}
                    </div>

                    <div className="space-y-3 mt-4">
                      {/* Item 1 */}
                      <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-lg flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-emerald-400">OmniBookCaseRegistry</span>
                          <span className="text-[10px] text-slate-500 font-mono">v8.5.0-Alpha • 12 mins ago</span>
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">PUBLISHED</span>
                      </div>
                      
                      {/* Item 2 */}
                      <div className="bg-cyan-950/20 border border-cyan-500/20 p-3 rounded-lg flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-cyan-400">SustainWriteEditor</span>
                          <span className="text-[10px] text-slate-500 font-mono">v1.2.0 • 45 mins ago</span>
                        </div>
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded border border-cyan-500/30">TESTING</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKSHELF */}
          {activeTab === 'bookshelf' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <h2 className="text-lg font-bold text-emerald-100 tracking-wider">萬能書櫃總表 (BookCase Registry)</h2>
              </div>
              <div className="h-[700px] overflow-hidden rounded-xl border border-white/10 relative">
                {/* Embedded OmniBookCaseRegistry */}
                <div className="absolute inset-0 overflow-y-auto">
                  <OmniBookCaseRegistry />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ONENESS CIRCLE */}
          {activeTab === 'oneness' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col items-center justify-center relative min-h-[600px]">
              <div className="absolute top-0 left-0 w-full flex items-center gap-2 mb-4 p-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <h2 className="text-lg font-bold text-indigo-100 tracking-wider">全通之心：無作妙德，圓通無礙</h2>
              </div>
              
              {/* Concentric Circles Visualization */}
              <div className="relative w-[500px] h-[500px] flex items-center justify-center mt-8 group/oneness">
                {/* Outer Circle (全息之腦 - Evolution) */}
                <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-[spin_40s_linear_infinite] flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.1)] group/item transition-all hover:border-indigo-500/60 cursor-crosshair">
                  <div className="absolute top-0 -translate-y-1/2 bg-[#020617] px-2 text-indigo-400 text-xs font-bold tracking-widest border border-indigo-500/30 rounded-full">全息之腦 (Evolution)</div>
                  {/* Tooltip */}
                  <div className="absolute top-[-40px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-indigo-950 border border-indigo-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap">
                    Telemetry: 0 Tech Debt detected. Self-healing active.
                  </div>
                </div>

                {/* Layer 2 (全境之骨 - Integrity) */}
                <div className="absolute w-[400px] h-[400px] border-2 border-cyan-500/30 rounded-full animate-[spin_35s_linear_infinite_reverse] flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] group/item transition-all hover:border-cyan-500/60 cursor-crosshair">
                  <div className="absolute left-0 -translate-x-1/2 bg-[#020617] px-2 text-cyan-400 text-xs font-bold tracking-widest border border-cyan-500/30 rounded-full">全境之骨 (Integrity)</div>
                  {/* Tooltip */}
                  <div className="absolute left-[-180px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-cyan-950 border border-cyan-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap">
                    Telemetry: 99.8% 5T Protocol Compliance.
                  </div>
                </div>

                {/* Layer 3 (全域之脈 - Flow) */}
                <div className="absolute w-[300px] h-[300px] border-2 border-emerald-500/40 rounded-full animate-[spin_25s_linear_infinite] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] group/item transition-all hover:border-emerald-500/60 cursor-crosshair">
                  <div className="absolute top-1/4 left-[5%] -translate-x-1/2 bg-[#020617] px-2 text-emerald-400 text-xs font-bold tracking-widest border border-emerald-500/30 rounded-full">全域之脈</div>
                  {/* Tooltip */}
                  <div className="absolute top-0 opacity-0 group-hover/item:opacity-100 transition-opacity bg-emerald-950 border border-emerald-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap">
                    Telemetry: 0 ms Latency. Data flowing seamlessly.
                  </div>
                </div>

                {/* Layer 4 (全能之核 - Decisiveness) */}
                <div className="absolute w-[200px] h-[200px] border-[3px] border-purple-500/50 rounded-full animate-[spin_15s_linear_infinite_reverse] flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.3)] group/item transition-all hover:border-purple-500/80 cursor-crosshair">
                  <div className="absolute top-0 -translate-y-1/2 bg-[#020617] px-2 text-purple-400 text-xs font-bold tracking-widest border border-purple-500/30 rounded-full">全能之核</div>
                  {/* Tooltip */}
                  <div className="absolute bottom-[-30px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-purple-950 border border-purple-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap">
                    Telemetry: Swarm Commander Ready.
                  </div>
                </div>

                {/* Layer 5 (全知之眼 - Traceability) */}
                <div className="absolute w-[120px] h-[120px] border-[4px] border-blue-500/60 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] group/item transition-all hover:border-blue-500/80 cursor-crosshair">
                  <div className="absolute bottom-0 translate-y-1/2 bg-[#020617] px-2 text-blue-400 text-[10px] font-bold tracking-widest border border-blue-500/30 rounded-full">全知之眼</div>
                </div>

                {/* Center Core (全通之心 - Oneness) */}
                <div className="absolute w-[60px] h-[60px] bg-gradient-to-br from-white via-indigo-200 to-cyan-200 rounded-full animate-pulse shadow-[0_0_40px_rgba(255,255,255,0.8)] flex items-center justify-center z-10 border border-white/50 cursor-crosshair group/core">
                  <div className="w-[30px] h-[30px] bg-white rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"></div>
                  <div className="absolute top-[-40px] opacity-0 group-hover/core:opacity-100 transition-opacity bg-white text-black font-bold text-xs p-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                    TRANSCENDENCE ACHIEVED.
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center max-w-lg z-10">
                <h3 className="text-xl font-bold text-white mb-2 tracking-widest" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>全通之心 (The Heart of Omni Connectivity)</h3>
                <p className="text-sm text-indigo-200 leading-relaxed opacity-80">
                  當數據在全知、全能、全域、全境、全息間流轉時，不存在任何技術瓶頸與延遲。<br/>
                  滑鼠懸停於軌道上即可查看即時遙測 (Telemetry) 數據。
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TOOLS */}
          {activeTab === 'tools' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <h2 className="text-lg font-bold text-purple-100 tracking-wider">萬能工具樞紐 (Omni Tools Hub)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tool 1 */}
                <a href="/sustain-write" className="group block bg-black/40 border border-white/10 hover:border-purple-500/50 rounded-xl p-5 transition-all hover:bg-purple-950/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-purple-950/50 rounded-lg flex items-center justify-center border border-purple-500/30 mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-purple-100 mb-1">永續寫手 (SustainWrite)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">內建 Agnes AI 專屬文法工具、萬能智庫佐證對接，以及 5T 全息編織引擎的專業永續報告編輯器。</p>
                  </div>
                  <ChevronRight className="absolute bottom-5 right-5 text-purple-500/50 group-hover:text-purple-400 transition-colors" />
                </a>

                {/* Tool 2 */}
                <a href="/think-tank" className="group block bg-black/40 border border-white/10 hover:border-cyan-500/50 rounded-xl p-5 transition-all hover:bg-cyan-950/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-cyan-950/50 rounded-lg flex items-center justify-center border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-100 mb-1">萬能智庫 (ThinkTank)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">管理 ESG 領域知識庫、RAG 檢索向量數據庫，與外部政策文檔的同步中心。</p>
                  </div>
                  <ChevronRight className="absolute bottom-5 right-5 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                </a>

                {/* Tool 3 */}
                <a href="/design-library" className="group block bg-black/40 border border-white/10 hover:border-emerald-500/50 rounded-xl p-5 transition-all hover:bg-emerald-950/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-950/50 rounded-lg flex items-center justify-center border border-emerald-500/30 mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-100 mb-1">元件設計市集 (Design Library)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">瀏覽所有已發布至市集的 Trinity UIUX 元件，支援 Light/Dark 主題熱切換展示。</p>
                  </div>
                  <ChevronRight className="absolute bottom-5 right-5 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                </a>
              </div>

              {/* Swarm Console */}
              <div className="mt-6 bg-black border border-indigo-500/20 rounded-xl flex flex-col flex-1 max-h-[300px]">
                <div className="bg-indigo-950/40 px-4 py-2 border-b border-indigo-500/20 flex items-center gap-2">
                  <Terminal size={14} className="text-indigo-400" />
                  <span className="text-xs text-indigo-300 font-bold tracking-widest">OMNI-AGENT SWARM CONSOLE</span>
                </div>
                <div className="p-4 font-mono text-[11px] text-slate-400 flex flex-col gap-1 overflow-y-auto">
                  {swarmLogs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-indigo-500">{new Date().toISOString().split('T')[1].slice(0,8)}</span>
                      <span className={log.includes('[Jules]') ? 'text-emerald-400' : log.includes('[OmniAgent]') ? 'text-cyan-400' : 'text-slate-300'}>{log}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-1">
                    <span className="text-indigo-500">{new Date().toISOString().split('T')[1].slice(0,8)}</span>
                    <span className="text-indigo-400 animate-pulse">_</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

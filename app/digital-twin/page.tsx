'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Brain, Book, Dna, MessageSquare, Lock, Zap, Plus, Send, 
  ChevronDown, ChevronUp, Upload, FileText, CheckCircle, 
  RefreshCw, Shield, AlertCircle, Info 
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTabs, BrandStatusDot, 
  BrandProgress, BrandScoreRing, BrandPageHeader, BrandCardHeader
} from '../../components/brand';
import { addToKnowledgeBase, KNOWLEDGE_BASE } from '../../lib/agent/rag-engine';
import SelectionHouse, { SelectionCategory } from '../../components/ui/SelectionHouse';
import ProvenanceDrawer, { ProvenanceStep } from '../../components/ui/ProvenanceDrawer';
import { ScenarioVisualizer } from '../../components/ui/ScenarioVisualizer';
import { digitalTwinEngine, ProjectionResult } from '../../lib/digital-twin-engine';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'overview', label: '狀態總覽', icon: <Brain size={14} /> },
  { id: 'knowledge', label: '知識倉庫', icon: <Book size={14} /> },
  { id: 'simulation', label: '模擬實驗室', icon: <Zap size={14} /> },
  { id: 'dna', label: '道德 DNA', icon: <Dna size={14} /> },
  { id: 'chat', label: '智慧對話', icon: <MessageSquare size={14} /> },
  { id: 'ledger', label: '主權帳本', icon: <Lock size={14} /> },
];

const defaultDna = {
  integrity: 90,
  transparency: 85,
  empathy: 70,
  decisiveness: 60
};

const dnaLabels = {
  integrity: { label: '誠信度 (Integrity)', desc: '確保資料真實無篡改' },
  transparency: { label: '透明度 (Transparency)', desc: '決策過程可解釋性' },
  empathy: { label: '共情力 (Empathy)', desc: '利害關係人利益平衡' },
  decisiveness: { label: '果斷力 (Decisiveness)', desc: '面對衝突的決斷速度' }
};

const ledgerEntries = [
  { action: 'DNA 初始化', time: '2023-10-01 10:00:00', detail: '設定初始 DNA 參數', hash: 'a1b2c3d4e5f6g7h8' },
  { action: '知識庫更新', time: '2023-10-02 11:30:00', detail: '載入 GRI 2021 標準', hash: '8h7g6f5e4d3c2b1a' }
];

export default function DigitalTwinPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dna, setDna] = useState(defaultDna);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是您的數位分身。我已載入 GRI 2021 完整框架與您的公司永續報告書。請問有什麼可以協助您？' },
  ]);
  const [input, setInput] = useState('');
  const [awakeningStage, setAwakeningStage] = useState(2);
  const [uploading, setUploading] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [selectedKb, setSelectedKb] = useState<any>(null);
  const [isKbSelectionOpen, setIsKbSelectionOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [knowledge, setKnowledge] = useState(KNOWLEDGE_BASE);

  // Simulation State
  const [simulationResult, setSimulationResult] = useState<ProjectionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [modifiers, setModifiers] = useState({
    carbonEmissions: -0.15,
    energyUsage: -0.10
  });

  const kbCategories: SelectionCategory[] = [
    {
      id: 'internal',
      title: '企業內部文件',
      icon: <Shield size={14} />,
      items: [
        { id: 'ar', label: '2023 年度報告', sub: '財務與治理核心數據', tag: 'FINANCE' },
        { id: 'sr', label: '2023 永續報告書', sub: 'GRI/SASB 歷史揭露', tag: 'ESG' },
      ]
    },
    {
      id: 'standards',
      title: '國際準則庫',
      icon: <Book size={14} />,
      items: [
        { id: 'gri', label: 'GRI 2021 Standard', sub: '全球通用報告準則', tag: 'ISO' },
        { id: 'csrd', label: 'EU CSRD Directive', sub: '歐盟永續申報指令', tag: 'EU' },
      ]
    }
  ];

  const provenanceSteps: ProvenanceStep[] = [
    { id: '1', type: 'source', title: '原始憑證載入', description: '從證據金庫 (Vault) 讀取 2024_Electricity_Bill.pdf', actor: 'System', timestamp: '10:00:24' },
    { id: '2', type: 'processing', title: 'AI 數據提取', description: 'OmniHermes 辨識出用電量為 12,450 kWh', actor: 'Hermes-2', timestamp: '10:00:26', details: 'Confidence: 0.98' },
    { id: '3', type: 'review', title: '人工覆核', description: '環安衛主任確認數值與電費單吻合', actor: 'Admin', timestamp: '11:15:00' },
    { id: '4', type: 'result', title: '5T 封印寫入', description: '將數值鎖定至主權帳本並生成 Hash Lock', actor: '5T_Engine', timestamp: '11:15:05' },
  ];

  const overallDna = Math.round(Object.values(dna).reduce((a, b) => a + b, 0) / 4);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    await new Promise(r => setTimeout(r, 1200));
    const botMsg = { role: 'assistant', content: '根據您的知識庫與 5T 數據，我建議在重大性矩陣中將「碳風險」權重提升 15%，以符合 CSRD 最新規範。' };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setExtractionProgress(0);

    // Simulate PDF to Markdown Extraction
    const steps = [15, 42, 68, 89, 100];
    for (const s of steps) {
      await new Promise(r => setTimeout(r, 400));
      setExtractionProgress(s);
    }

    const newFragment = {
      id: `f_${Date.now()}`,
      source: file.name,
      text: `已從 ${file.name} 中提取 ESG 相關內容。`,
      metadata: { type: 'user-upload', size: file.size },
      date: '今天',
      category: 'User Upload'
    };

    await addToKnowledgeBase([newFragment]);
    setKnowledge([...KNOWLEDGE_BASE]);
    setUploading(false);
    setExtractionProgress(0);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    await new Promise(r => setTimeout(r, 1500)); // AI calculation feel

    const baseline = {
      carbonEmissions: 1250,
      energyUsage: 50000,
      waterUsage: 800,
      wasteGenerated: 120
    };

    const scenario = {
      id: 'pivot-2026',
      name: '綠能轉型計畫',
      modifiers: [
        { targetField: 'carbonEmissions' as const, valueChange: modifiers.carbonEmissions },
        { targetField: 'energyUsage' as const, valueChange: modifiers.energyUsage },
      ]
    };

    const result = await digitalTwinEngine.simulate(scenario, baseline);
    setSimulationResult(result);
    setIsSimulating(false);
    
    // Auto-update message
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `已完成「${scenario.name}」模擬。預計碳排放將減少 ${Math.abs(modifiers.carbonEmissions * 100)}%，法規符合度評分提升至 ${result.complianceProjections.carbonEmissions.score}%。` 
    }]);
  };

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      <SelectionHouse 
        isOpen={isKbSelectionOpen}
        onClose={() => setIsKbSelectionOpen(false)}
        onSelect={(item) => setSelectedKb({ source: item.label, text: '模擬從選擇的庫存中提取的內容...', category: item.tag })}
        categories={kbCategories}
        title="選擇知識庫來源"
        placeholder="搜尋文件名或類別..."
      />

      <ProvenanceDrawer 
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
        title="電費排放量溯源"
        currentValue="12,450"
        unit="kWh"
        steps={provenanceSteps}
      />

      <BrandPageHeader 
        title="OmniHermes 數位分身" 
        subtitle="Digital Twin · 知識共鳴 · 道德建模 · 5T 主權帳本"
        icon={<Brain size={24}/>}
      />

      <BrandTabs 
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t as any)}
        tabs={tabs}
      />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-in">
           <div className="lg:col-span-4">
              <BrandCard className="text-center h-full flex flex-col justify-center items-center" padding="lg">
                 <div style={{ width: '100%', maxWidth: 240, margin: '0 auto' }}>
                   <BrandScoreRing 
                     score={overallDna} 
                     size={220} 
                     strokeWidth={12} 
                     color="var(--blue-700)" 
                   />
                 </div>
                 <div className="mt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DNA 整合指數</p>
                    <p className="text-sm font-bold text-slate-700">Governance Alignment: HIGH</p>
                 </div>
              </BrandCard>
           </div>

           <div className="lg:col-span-8 flex flex-col gap-6">
              <BrandCard padding="md">
                 <BrandCardHeader 
                   title="覺醒狀態與進度" 
                   subtitle="System Cognitive Evolution"
                 />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {['休眠 (Dormant)', '初始化 (Bootstrap)', '活躍 (Active)', '進化 (Evolution)'].map((stage, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-50 bg-slate-50/30">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${awakeningStage > idx ? 'bg-blue-700 text-white' : awakeningStage === idx ? 'bg-gold-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {idx + 1}
                         </div>
                         <span className={`text-sm font-bold ${awakeningStage === idx ? 'text-slate-900' : 'text-slate-400'}`}>{stage}</span>
                         {awakeningStage > idx && <CheckCircle size={14} className="ml-auto text-green-500"/>}
                         {awakeningStage === idx && <RefreshCw size={14} className="ml-auto text-gold-500 animate-spin"/>}
                      </div>
                    ))}
                 </div>
              </BrandCard>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   { label: '知識碎片', value: knowledge.length * 12, icon: <Book size={16}/> },
                   { label: '實證鏈結', value: 247, icon: <Lock size={16}/> },
                   { label: '共鳴頻率', value: '4.2 Hz', icon: <Zap size={16}/> },
                 ].map(s => (
                   <BrandCard key={s.label} padding="md" className="text-center">
                      <div className="text-blue-700 mb-2 flex justify-center">{s.icon}</div>
                      <p className="text-xl font-bold text-slate-900">{s.value}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{s.label}</p>
                   </BrandCard>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="space-y-6 fade-in">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                 <h2 className="text-xl font-bold text-slate-900">RAG 知識倉庫</h2>
                 <p className="text-xs text-slate-500">數位分身的底層知識來源，支援 PDF/DOCX 向量化檢索</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <BrandButton variant="primary" onClick={() => fileInputRef.current?.click()} loading={uploading} className="w-full sm:w-auto">
                 <Upload size={16}/> 上傳企業文件
              </BrandButton>
           </div>

           {uploading && (
             <BrandCard padding="md" className="border-blue-200 bg-blue-50/20 animate-pulse">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                      <RefreshCw size={20} className="animate-spin" />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between mb-2">
                         <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">正在提取知識... (PDF to Markdown)</span>
                         <span className="text-sm font-mono font-bold text-blue-700">{extractionProgress}%</span>
                      </div>
                      <BrandProgress value={extractionProgress} color="blue" size="sm" animated />
                   </div>
                </div>
             </BrandCard>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {knowledge.map(kb => (
                <BrandCard key={kb.id} hover padding="md">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                         <FileText size={20}/>
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate max-w-[120px]">{kb.source}</h4>
                            <BrandBadge variant="success" size="xs">已索引</BrandBadge>
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{kb.category || 'Standard'} · 向量化</p>
                         <div className="flex justify-between items-center mt-2">
                            <p className="text-[9px] text-slate-300">索引日期: {kb.date || '2025-01-10'}</p>
                            <BrandButton variant="ghost" size="sm" className="h-6 p-0 px-2 text-[10px]" onClick={() => setSelectedKb(kb)}>檢視原文</BrandButton>
                         </div>
                      </div>
                   </div>
                </BrandCard>
              ))}
           </div>

           {selectedKb && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedKb(null)} />
                <BrandCard padding="lg" className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                   <BrandCardHeader title={`原文提取詳情: ${selectedKb.source}`} icon={<FileText size={18}/>} />
                   <div className="flex-1 overflow-y-auto mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs leading-relaxed text-slate-600">
                      {selectedKb.text}
                   </div>
                   <div className="mt-6 flex justify-end">
                      <BrandButton variant="primary" onClick={() => setSelectedKb(null)}>關閉</BrandButton>
                   </div>
                </BrandCard>
             </div>
           )}
        </div>
      )}

      {activeTab === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-in">
           <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              <BrandCard padding="md sm:padding-lg">
                 <BrandCardHeader title="決策模擬因子" subtitle="Adjust Scenario Modifiers" />
                 <div className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
                    <div className="space-y-3 sm:space-y-4">
                       <div className="flex justify-between">
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase">再生能源比例</span>
                          <span className="text-xs font-black text-blue-700">{Math.abs(modifiers.carbonEmissions * 100)}%</span>
                       </div>
                       <input 
                         type="range" min="-100" max="0" value={modifiers.carbonEmissions * 100} 
                         onChange={e => setModifiers({...modifiers, carbonEmissions: parseInt(e.target.value) / 100})}
                         className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-700"
                       />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                       <div className="flex justify-between">
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase">節能設備投資</span>
                          <span className="text-xs font-black text-blue-700">{Math.abs(modifiers.energyUsage * 100)}%</span>
                       </div>
                       <input 
                         type="range" min="-100" max="0" value={modifiers.energyUsage * 100} 
                         onChange={e => setModifiers({...modifiers, energyUsage: parseInt(e.target.value) / 100})}
                         className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-700"
                       />
                    </div>
                    <BrandButton variant="primary" fullWidth size="lg" onClick={runSimulation} loading={isSimulating} className="h-14 sm:h-16">
                       <Zap size={18} className="mr-2" /> 執行數位分身演算
                    </BrandButton>
                 </div>
              </BrandCard>
              
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                 <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    模擬引擎將根據「證據金庫」中的 5T 歷史基準數據進行外推演算法。
                 </p>
              </div>
           </div>

           <div className="lg:col-span-8">
              {!simulationResult && !isSimulating ? (
                <div className="h-full min-h-[300px] border-2 border-dashed border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center bg-slate-50/30 text-slate-400 p-8 sm:p-12 text-center">
                   <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white shadow-sm flex items-center justify-center mb-4"><Brain size={28} className="opacity-20 sm:w-8 sm:h-8" /></div>
                   <p className="text-xs sm:text-sm font-bold uppercase tracking-widest">等待演算指令...</p>
                   <p className="text-[10px] sm:text-xs mt-2 max-w-xs">調整左側參數並啟動數位分身，即可預覽決策對 5T 指標的長期衝擊。</p>
                </div>
              ) : isSimulating ? (
                <div className="h-full min-h-[300px] border-2 border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center bg-white p-8 sm:p-12 text-center">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-700 border-t-transparent animate-spin mb-6" />
                   <h3 className="text-base sm:text-lg font-black text-berkeley-blue uppercase tracking-widest">AI 智慧模擬中</h3>
                   <p className="text-[10px] sm:text-xs text-slate-400 mt-2">正在計算 5T 數據外推與法規符合度...</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                   {simulationResult && <ScenarioVisualizer result={simulationResult} />}
                   <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <BrandButton variant="ghost" fullWidth className="rounded-2xl border-slate-200 h-12 sm:h-14">
                         保存為策略草稿
                      </BrandButton>
                      <BrandButton variant="secondary" fullWidth className="rounded-2xl h-12 sm:h-14" onClick={() => setActiveTab('chat')}>
                         詢問 AI 建議
                      </BrandButton>
                   </div>
                </motion.div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'dna' && (
        <BrandCard padding="lg">
           <BrandCardHeader 
             title="道德 DNA 建模" 
             subtitle="調整數位分身的決策取向與人格權重"
           />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
              {Object.entries(dna).map(([key, val]) => (
                <div key={key} className="space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-sm font-bold text-slate-800">{dnaLabels[key as keyof typeof dnaLabels].label}</p>
                         <p className="text-xs text-slate-400">{dnaLabels[key as keyof typeof dnaLabels].desc}</p>
                      </div>
                      <span className="text-xl font-bold text-blue-700">{val}%</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" value={val} 
                     onChange={e => setDna(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                     className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-700"
                   />
                </div>
              ))}
           </div>
           <div className="mt-12 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20"><Dna size={80}/></div>
              <div className="relative z-10">
                 <h3 className="font-bold mb-2">人格特質摘要 (Identity Brief)</h3>
                 <p className="text-sm text-blue-100/70 leading-relaxed max-w-xl">
                    當前數位分身傾向於 <strong>高誠信、中等果斷</strong> 的治理風格。在面對碳揭露爭議時，
                    分身將優先選擇透明化揭露（Integrity 90%）而非規備風險，並會主動尋求 5T 實證鏈結。
                 </p>
              </div>
           </div>
        </BrandCard>
      )}

      {activeTab === 'chat' && (
        <BrandCard padding="none" className="min-h-[600px] flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <BrandStatusDot status="active" pulse size="sm" />
                 <span className="text-sm font-bold text-slate-700">分身共鳴對話 (Grounding Active)</span>
              </div>
              <BrandBadge variant="info" size="xs">Gemini 2.0 Flash</BrandBadge>
           </div>
           
           <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-700 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                      {msg.content}
                   </div>
                </div>
              ))}
           </div>

           <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex gap-3">
                 <input 
                   className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:border-blue-600 outline-none transition-all"
                   placeholder="向數位分身提問..."
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && sendMessage()}
                 />
                 <BrandButton variant="primary" className="rounded-2xl w-14 h-14 p-0 flex items-center justify-center" onClick={sendMessage}>
                    <Send size={20}/>
                 </BrandButton>
              </div>
           </div>
        </BrandCard>
      )}

      {activeTab === 'ledger' && (
        <BrandCard padding="none">
           <BrandCardHeader 
             title="主權帳本" 
             subtitle="數位分身的所有認知與決策演進軌跡 (SHA-256 Verified)"
           />
           <div className="p-6">
              <div className="space-y-4">
                 {ledgerEntries.map((e, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                         <Shield size={18}/>
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{e.action}</span>
                            <span className="text-[10px] font-bold text-slate-400">{e.time}</span>
                         </div>
                         <p className="text-xs text-slate-500">{e.detail}</p>
                      </div>
                      <code className="text-[10px] text-blue-700 bg-blue-50 px-2 py-1 rounded font-mono">#{e.hash}</code>
                   </div>
                 ))}
              </div>
           </div>
        </BrandCard>
      )}

    </div>
  );
}

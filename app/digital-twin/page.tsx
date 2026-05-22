'use client';
import { useState, useRef } from 'react';
import { Brain, Book, Dna, MessageSquare, Lock, Zap, Plus, Send, ChevronDown, ChevronUp, Upload, FileText, CheckCircle, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTabs, BrandStatusDot, BrandProgress, BrandScoreRing, BrandPageHeader, BrandCardHeader
} from '../../components/brand';
import { addToKnowledgeBase, KNOWLEDGE_BASE } from '../../lib/agent/rag-engine';

const tabs = [
  { id: 'overview', label: '狀態總覽', icon: <Brain size={14} /> },
  { id: 'knowledge', label: '知識倉庫', icon: <Book size={14} /> },
  { id: 'dna', label: '道德 DNA', icon: <Dna size={14} /> },
  { id: 'chat', label: '智慧對話', icon: <MessageSquare size={14} /> },
  { id: 'ledger', label: '主權帳本', icon: <Lock size={14} /> },
];

// ... (dnaLabels and ledgerEntries)

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [knowledge, setKnowledge] = useState(KNOWLEDGE_BASE);

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

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">

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
                         <p className="text-[9px] text-slate-300 mt-2">索引日期: {kb.date || '2025-01-10'}</p>
                      </div>
                   </div>
                </BrandCard>
              ))}
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
                    分身將優先選擇透明化揭露（Integrity 90%）而非規避風險，並會主動尋求 5T 實證鏈結。
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

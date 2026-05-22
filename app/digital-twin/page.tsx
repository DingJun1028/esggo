'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Brain, Book, Dna, MessageSquare, Lock, Zap, Plus, Send, ChevronDown, ChevronUp, Upload, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { BrandButton, BrandCard, BrandBadge, BrandProgress } from '../../components/brand';

const tabs = [
  { key: 'overview', label: '總覽', icon: <Brain size={14} /> },
  { key: 'knowledge', label: '知識庫 (RAG)', icon: <Book size={14} /> },
  { key: 'dna', label: '道德 DNA', icon: <Dna size={14} /> },
  { key: 'chat', label: '智慧對話', icon: <MessageSquare size={14} /> },
  { key: 'ledger', label: '主權帳本', icon: <Lock size={14} /> },
];

const dnaLabels = {
  intelligence: { label: '智 Intelligence', desc: '資訊處理與決策分析能力' },
  benevolence: { label: '仁 Benevolence', desc: '利害關係人關懷與社會影響' },
  courage: { label: '勇 Courage', desc: '面對挑戰的決策果斷力' },
  integrity: { label: '誠 Integrity', desc: '數據誠信與透明揭露承諾' },
};

const ledgerEntries = [
  { time: '2025-05-10 14:32', action: '知識庫更新', detail: '新增 GRI 305-1 排放盤查方法論', hash: 'a1b2c3d4' },
  { time: '2025-05-09 09:15', action: '道德 DNA 調整', detail: '誠 Integrity 指數更新至 90', hash: 'e5f6g7h8' },
  { time: '2025-05-08 16:40', action: '對話記憶', detail: '儲存 3 筆 TCFD 相關諮詢紀錄', hash: 'i9j0k1l2' },
];

const defaultDna = { intelligence: 75, benevolence: 80, courage: 65, integrity: 90 };

export default function DigitalTwinPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dna, setDna] = useState(defaultDna);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是您的數位分身。我已載入 GRI 2021 完整框架與您的公司永續報告書。請問有什麼可以協助您？' },
  ]);
  const [input, setInput] = useState('');
  const [awakeningStage, setAwakeningStage] = useState(2);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [knowledge, setKnowledge] = useState([
    { id: 1, title: 'GRI 2021 完整框架', category: 'Standard', status: 'active', entries: 47, date: '2025-01-10' },
    { id: 2, title: '公司 2024 永續報告書', category: 'Report', status: 'active', entries: 23, date: '2025-03-15' },
    { id: 3, title: 'TCFD 氣候情境分析', category: 'Analysis', status: 'active', entries: 15, date: '2025-04-02' },
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 2000));
    const newEntry = {
      id: Date.now(),
      title: file.name,
      category: 'User Upload',
      status: 'active',
      entries: Math.floor(Math.random() * 20) + 5,
      date: new Date().toISOString().split('T')[0]
    };
    setKnowledge(prev => [newEntry, ...prev]);
    setUploading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const thinkingMsg = { role: 'assistant', content: '正在檢索知識庫並思考中...' };
    setMessages(prev => [...prev, thinkingMsg]);

    await new Promise(r => setTimeout(r, 1200));

    const responses = [
      '根據「GRI 2021 框架」，您的揭露應包含對環境、社會及人的經濟衝擊分析。',
      '在您的「2024 永續報告書」草稿中，範疇一碳排數據顯示有 15% 的增長，這與您的減碳目標存在缺口。',
      '檢索到最新上傳的文件內容：建議優先處理供應鏈中的範疇三數據透明度問題。',
    ];
    
    const botMsg = { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] };
    setMessages(prev => [...prev.slice(0, -1), botMsg]);
  };

  const overallDna = Math.round(Object.values(dna).reduce((a, b) => a + b, 0) / 4);

  return (
    <div className="page-container max-w-5xl mx-auto">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">OmniHermes 數位分身</h1>
          <p className="page-subtitle">Digital Twin · RAG 知識倉庫 · 道德 DNA · 主權帳本</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--surface-section)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: awakeningStage >= 2 ? '#22c55e' : '#f59e0b', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--blue-700)' }}>{['休眠', '初始化', '活躍', '進化'][awakeningStage]}</span>
        </div>
      </div>

      <div className="tabs mb-8">
        {tabs.map(tab => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in">
          <BrandCard padding="lg" className="text-center">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #003262, #005DAA)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,50,98,0.2)' }}>
              <Brain size={40} color="#fff" />
            </div>
            <div className="text-3xl font-bold text-[#003262] mb-1">{overallDna}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">道德 DNA 綜合指數</p>
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
              <div>
                <div className="font-bold text-[#003262]">{knowledge.length}</div>
                <div className="text-[10px] text-slate-400 uppercase">知識域</div>
              </div>
              <div>
                <div className="font-bold text-[#003262]">{knowledge.reduce((a, b) => a + b.entries, 0)}</div>
                <div className="text-[10px] text-slate-400 uppercase">知識條目</div>
              </div>
              <div>
                <div className="font-bold text-[#003262]">{ledgerEntries.length}</div>
                <div className="text-[10px] text-slate-400 uppercase">帳本記錄</div>
              </div>
            </div>
          </BrandCard>
          
          <BrandCard padding="lg">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Zap size={14} className="text-gold-500" />
              分身覺醒階段 (Awakening)
            </h3>
            {['休眠 (Dormant)', '初始化 (Bootstrap)', '活躍 (Active)', '進化 (Evolution)'].map((stage, idx) => (
              <div key={stage} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-none">
                <div style={{ 
                  width: 28, height: 28, borderRadius: '50%', 
                  background: awakeningStage > idx ? 'var(--blue-700)' : awakeningStage === idx ? 'var(--gold-500)' : 'var(--slate-100)',
                  color: awakeningStage >= idx ? '#fff' : 'var(--slate-400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 
                }}>
                  {idx + 1}
                </div>
                <span className={`text-sm font-bold ${awakeningStage === idx ? 'text-[#003262]' : 'text-slate-400'}`}>{stage}</span>
                {awakeningStage > idx && <CheckCircle size={14} className="ml-auto text-green-500" />}
                {awakeningStage === idx && <RefreshCw size={14} className="ml-auto text-gold-500 animate-spin" />}
              </div>
            ))}
          </BrandCard>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="fade-in">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#003262]">RAG 知識倉庫</h2>
              <p className="text-sm text-slate-500">數位分身的底層知識來源，支援 PDF/DOCX 向量化檢索</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
            <BrandButton variant="primary" onClick={() => fileInputRef.current?.click()} loading={uploading}>
              <Upload size={14} /> 上傳企業文件
            </BrandButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledge.map(kb => (
              <BrandCard key={kb.id} padding="md" hover>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF2FA] flex items-center justify-center text-[#003262] flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800">{kb.title}</h4>
                      <BrandBadge variant="success" size="xs">已索引</BrandBadge>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{kb.category} · {kb.entries} 知識碎片</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">索引日期: {kb.date}</span>
                      <button className="text-[10px] font-bold text-[#003262] hover:underline">管理碎片</button>
                    </div>
                  </div>
                </div>
              </BrandCard>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dna' && (
        <div className="fade-in">
          <BrandCard padding="lg">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#003262]">道德 DNA 建模</h3>
              <BrandBadge variant="gold">綜合評分 {overallDna}</BrandBadge>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {Object.entries(dna).map(([key, val]) => {
                const info = dnaLabels[key as keyof typeof dnaLabels];
                return (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-bold text-slate-800">{info.label}</span>
                        <span className="text-xs text-slate-400 ml-3">{info.desc}</span>
                      </div>
                      <span className="font-bold text-[#003262]">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={e => setDna(prev => ({ ...prev, [key]: +e.target.value }))}
                      style={{ width: '100%', accentColor: 'var(--blue-700)' }}
                    />
                  </div>
                );
              })}
            </div>
          </BrandCard>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="fade-in">
          <BrandCard padding="none" className="overflow-hidden" style={{ height: 600, display: 'flex', flexDirection: 'column' }}>
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <MessageSquare size={16} />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">分身共鳴對話 (Grounding Active)</h3>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.875rem 1.125rem',
                    borderRadius: msg.role === 'user' ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                    background: msg.role === 'user' ? 'var(--blue-700)' : '#f1f5f9',
                    color: msg.role === 'user' ? '#fff' : '#1e293b',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <input
                className="input flex-1"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="向您的數位分身提問，AI 將檢索知識庫..."
                style={{ borderRadius: '1rem' }}
              />
              <BrandButton onClick={sendMessage} variant="primary" style={{ borderRadius: '1rem', width: 44, height: 44, padding: 0 }}>
                <Send size={18} />
              </BrandButton>
            </div>
          </BrandCard>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="fade-in">
          <BrandCard padding="lg">
            <h3 className="text-xl font-bold text-[#003262] mb-6 flex items-center gap-2">
              <Lock size={18} />
              主權帳本 (Sovereign Ledger)
            </h3>
            <div className="space-y-3">
              {ledgerEntries.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-sm">{entry.action}</span>
                      <span className="text-[10px] font-bold text-slate-400">{entry.time}</span>
                    </div>
                    <p className="text-xs text-slate-500">{entry.detail}</p>
                  </div>
                  <code className="text-[10px] font-mono p-1.5 px-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-100 transition-all">
                    #{entry.hash}
                  </code>
                </div>
              ))}
            </div>
          </BrandCard>
        </div>
      )}
    </div>
  );
}

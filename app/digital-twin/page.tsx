'use client';
import { useState } from 'react';
import { Brain, Book, Dna, MessageSquare, Lock, Zap, Plus, Send, ChevronDown, ChevronUp } from 'lucide-react';

const tabs = [
  { key: 'overview', label: '總覽', icon: <Brain size={14} /> },
  { key: 'knowledge', label: '知識庫', icon: <Book size={14} /> },
  { key: 'dna', label: '道德 DNA', icon: <Dna size={14} /> },
  { key: 'chat', label: '對話', icon: <MessageSquare size={14} /> },
  { key: 'ledger', label: '主權帳本', icon: <Lock size={14} /> },
];

const defaultDna = { intelligence: 75, benevolence: 80, courage: 65, integrity: 90 };

const dnaLabels = {
  intelligence: { label: '智 Intelligence', desc: '資訊處理與決策分析能力' },
  benevolence: { label: '仁 Benevolence', desc: '利害關係人關懷與社會影響' },
  courage: { label: '勇 Courage', desc: '面對挑戰的決策果斷力' },
  integrity: { label: '誠 Integrity', desc: '數據誠信與透明揭露承諾' },
};

const knowledgeBase = [
  { id: 1, title: 'GRI 2021 完整框架', category: 'Standard', status: 'active', entries: 47 },
  { id: 2, title: '公司 2024 永續報告書', category: 'Report', status: 'active', entries: 23 },
  { id: 3, title: 'TCFD 氣候情境分析', category: 'Analysis', status: 'active', entries: 15 },
  { id: 4, title: '台灣碳交所最新法規', category: 'Regulation', status: 'pending', entries: 8 },
];

const ledgerEntries = [
  { time: '2025-05-10 14:32', action: '知識庫更新', detail: '新增 GRI 305-1 排放盤查方法論', hash: 'a1b2c3d4' },
  { time: '2025-05-09 09:15', action: '道德 DNA 調整', detail: '誠 Integrity 指數更新至 90', hash: 'e5f6g7h8' },
  { time: '2025-05-08 16:40', action: '對話記憶', detail: '儲存 3 筆 TCFD 相關諮詢紀錄', hash: 'i9j0k1l2' },
];

export default function DigitalTwinPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dna, setDna] = useState(defaultDna);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是您的數位分身。我已載入 GRI 2021 完整框架與您的公司永續報告書。請問有什麼可以協助您？' },
  ]);
  const [input, setInput] = useState('');
  const [awakeningStage, setAwakeningStage] = useState(2);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const responses = [
      '根據您的知識庫，GRI 305-1 要求揭露範疇一直接排放量，建議以 tCO₂e 為單位，並說明所使用的計算方法論。',
      '依據您公司的永續目標，2030 碳中和目標需要每年平均減少約 6.6% 的碳排放量。',
      '我在您的知識庫中找到 TCFD 相關內容：氣候相關財務揭露需涵蓋治理、策略、風險管理及指標目標四大支柱。',
      '基於您的 5T 誠信協議，建議所有 ESG 數據都應附有可溯源的原始憑證，以確保可查核性。',
    ];
    const botMsg = { role: 'assistant', content: responses[messages.length % responses.length] };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const overallDna = Math.round(Object.values(dna).reduce((a, b) => a + b, 0) / 4);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">數位分身</h1>
          <p className="page-subtitle">Digital Twin · 知識倉庫 · 道德 DNA · 主權帳本</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: awakeningStage >= 2 ? '#22c55e' : '#f59e0b', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{['休眠', '初始化', '活躍', '進化'][awakeningStage]}</span>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {tabs.map(tab => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header"><h3 className="card-title">分身狀態</h3></div>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--berkeley-blue)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={36} color="#fff" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--berkeley-blue)', marginBottom: '0.25rem' }}>{overallDna}</div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>道德 DNA 綜合指數</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{knowledgeBase.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>知識域</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{knowledgeBase.reduce((a, b) => a + b.entries, 0)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>知識條目</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{ledgerEntries.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>帳本記錄</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">覺醒進度</h3></div>
            <div className="card-body">
              {['休眠', '初始化', '活躍', '進化'].map((stage, idx) => (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: idx < 3 ? '1px solid var(--border-light)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: awakeningStage > idx ? 'var(--berkeley-blue)' : awakeningStage === idx ? '#FDB515' : 'var(--bg-secondary)', color: awakeningStage >= idx ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontWeight: awakeningStage === idx ? 600 : 400, color: awakeningStage === idx ? 'var(--berkeley-blue)' : 'var(--text-secondary)' }}>{stage}</span>
                  {awakeningStage > idx && <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: '0.8rem' }}>✓ 完成</span>}
                  {awakeningStage === idx && <span style={{ marginLeft: 'auto', color: '#FDB515', fontSize: '0.8rem' }}>進行中</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">RAG 知識倉庫</h3>
            <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}><Plus size={14} style={{ display: 'inline', marginRight: 4 }} />新增知識域</button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {knowledgeBase.map(kb => (
                <div key={kb.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <Book size={20} color="var(--berkeley-blue)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{kb.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{kb.category} · {kb.entries} 條知識條目</div>
                  </div>
                  <span className={`badge ${kb.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                    {kb.status === 'active' ? '已啟用' : '待確認'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dna' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">道德 DNA 建模</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>綜合指數：{overallDna}</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.entries(dna).map(([key, val]) => {
                const info = dnaLabels[key as keyof typeof dnaLabels];
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{info.label}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 8 }}>{info.desc}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--berkeley-blue)' }}>{val}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={e => setDna(prev => ({ ...prev, [key]: +e.target.value }))}
                      style={{ width: '100%', accentColor: 'var(--berkeley-blue)' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
          <div className="card-header">
            <h3 className="card-title">與數位分身對話</h3>
          </div>
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: msg.role === 'user' ? 'var(--berkeley-blue)' : 'var(--bg-secondary)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.75rem' }}>
            <input
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="向您的數位分身提問..."
              style={{ flex: 1 }}
            />
            <button onClick={sendMessage} className="btn btn-primary"><Send size={16} /></button>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Lock size={16} style={{ display: 'inline', marginRight: 6 }} />主權帳本</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ledgerEntries.map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: '3px solid var(--berkeley-blue)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{entry.action}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{entry.time}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entry.detail}</div>
                  </div>
                  <code style={{ fontSize: '0.75rem', color: '#003262', background: '#003262' + '15', padding: '0.25rem 0.5rem', borderRadius: 4, alignSelf: 'center' }}>
                    #{entry.hash}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
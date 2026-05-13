'use client';
import React, { useState, useEffect } from 'react';
import { Fingerprint, Brain, Shield, MessageSquare, BookOpen, Lock, Plus, Trash2, Save, Sliders, ChevronRight, CheckCircle, Loader } from 'lucide-react';
import { getDigitalTwin, upsertDigitalTwin, logAudit, type DigitalTwin } from '../../lib/db';

interface KnowledgeEntry { id: string; title: string; content: string; source: string; domain: string; createdAt: string; }
interface ChatMessage { role: 'user' | 'twin'; content: string; }

const domains = ['ESG 策略', '環境管理', '社會責任', '公司治理', '風險管理', '永續財務'];

const twinResponses = [
  '根據您提供的知識庫，我對這個議題的看法是：中小企業在 ESG 轉型初期應優先建立數據基礎，從可量化的指標開始，如用電量、用水量與廢棄物量，這三個指標成本低、可操作性強，且能直接對應 GRI 302、303、306。',
  '我的決策邏輯傾向於「實質影響優先」——不是因為法規要求，而是因為真實的改善能創造競爭差異。建議從供應商 ESG 評估開始，這能同時滿足客戶要求與降低供應鏈風險。',
  '這與我的信念高度一致。永續不應是合規的附屬品，而應成為商業模式的核心。Berkeley Haas 的研究證明，ESG 成熟度高的企業在長期資本成本上有顯著優勢。',
];

export default function DigitalTwinPage() {
  const [tab, setTab] = useState<'overview' | 'knowledge' | 'dna' | 'chat' | 'ledger'>('overview');
  const [twin, setTwin] = useState<DigitalTwin | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([
    { id: '1', title: 'ESG 數據基礎建設', content: '企業 ESG 轉型的第一步是建立可靠的數據收集機制...', source: '內部研究報告', domain: 'ESG 策略', createdAt: '2025-01-10' },
    { id: '2', title: '碳排放計算方法論', content: 'GHG Protocol 範疇一、二、三的計算邏輯與實務挑戰...', source: 'ISO 14064-1', domain: '環境管理', createdAt: '2025-01-15' },
  ]);
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: 'twin', content: '您好！我是您的數位分身，承載您的知識、價值觀與決策邏輯。請向我提問，我會以您的思維框架給出回答。' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [dna, setDna] = useState({ intelligence: 78, benevolence: 85, courage: 72, integrity: 90 });
  const [newEntry, setNewEntry] = useState({ title: '', content: '', source: '', domain: 'ESG 策略' });
  const [showAdd, setShowAdd] = useState(false);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    getDigitalTwin().then(data => {
      if (data) {
        setTwin(data);
        if (data.moral_dna) setDna(data.moral_dna as typeof dna);
      } else {
        setTwin({ name: '我的數位分身', description: '承載我的知識、價值觀與 ESG 決策智慧', awakening_stage: 'initializing', version: '1.0.0' });
      }
      setLoading(false);
    });
  }, []);

  const handleSaveDNA = async () => {
    if (!twin) return;
    setSaving(true);
    const saved = await upsertDigitalTwin({ ...twin, moral_dna: dna });
    if (saved) { setTwin(saved); await logAudit({ action: 'UPDATE_TWIN_DNA', resource: '道德 DNA', user_name: 'User', t5_tag: 'T4' }); }
    setSaving(false);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || replying) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setReplying(true);
    await new Promise(r => setTimeout(r, 1000));
    const reply = twinResponses[Math.floor(Math.random() * twinResponses.length)];
    setChat(prev => [...prev, { role: 'twin', content: reply }]);
    setReplying(false);
  };

  const handleAddKnowledge = () => {
    if (!newEntry.title) return;
    setKnowledge(prev => [...prev, { ...newEntry, id: Date.now().toString(), createdAt: new Date().toISOString().slice(0, 10) }]);
    setShowAdd(false);
    setNewEntry({ title: '', content: '', source: '', domain: 'ESG 策略' });
  };

  const stageConfig = {
    dormant:       { label: '休眠', color: 'var(--text-muted)', pct: 10 },
    initializing:  { label: '初始化', color: 'var(--warning)', pct: 30 },
    active:        { label: '活躍', color: 'var(--success)', pct: 65 },
    evolved:       { label: '進化', color: '#7c3aed', pct: 95 },
  };
  const stage = stageConfig[twin?.awakening_stage as keyof typeof stageConfig || 'initializing'];

  const tabs = [
    { id: 'overview', label: '總覽', icon: Fingerprint },
    { id: 'knowledge', label: '知識倉庫', icon: BookOpen },
    { id: 'dna', label: '道德 DNA', icon: Sliders },
    { id: 'chat', label: '與分身對話', icon: MessageSquare },
    { id: 'ledger', label: '主權帳本', icon: Lock },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fingerprint size={18} color="#fff" />
              </div>
              <h1 className="page-title">數位分身</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-purple">Digital Twin</span>
              <span className="badge badge-blue">5T 一致性驗證</span>
              <span style={{ color: 'var(--text-muted)' }}>· 主權帳本 · RAG 知識倉庫</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSaveDNA} disabled={saving}>
            {saving ? <Loader size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> : <Save size={14} />}
            儲存分身
          </button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id as typeof tab)}>
              <Icon size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, var(--berkeley-blue), var(--founders-rock))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fingerprint size={28} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{twin?.name || '我的數位分身'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{twin?.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, background: `${stage.color}15`, color: stage.color, fontWeight: 600 }}>{stage.label}</span>
                  <span className="badge badge-gray">v{twin?.version || '1.0.0'}</span>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>分身成熟度</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.pct}%</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${stage.pct}%`, background: stage.color }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>知識條目</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--berkeley-blue)' }}>{knowledge.length}</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>5T 完整性</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>97%</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>道德 DNA 概覽</h3>
            {Object.entries(dna).map(([key, val]) => {
              const labels: Record<string, string> = { intelligence: '智 Intelligence', benevolence: '仁 Benevolence', courage: '勇 Courage', integrity: '誠 Integrity' };
              const colors: Record<string, string> = { intelligence: '#2563eb', benevolence: '#059669', courage: '#d97706', integrity: '#7c3aed' };
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{labels[key]}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: colors[key] }}>{val}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${val}%`, background: colors[key] }} />
                  </div>
                </div>
              );
            })}
            <button className="btn btn-secondary btn-sm w-full" style={{ marginTop: 8 }} onClick={() => setTab('dna')}>
              <Sliders size={13} />調整道德 DNA
            </button>
          </div>
        </div>
      )}

      {tab === 'knowledge' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
              <Plus size={14} />新增知識
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {knowledge.map(k => (
              <div key={k.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>{k.domain}</span>
                  <button onClick={() => setKnowledge(prev => prev.filter(e => e.id !== k.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{k.title}</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{k.content.slice(0, 80)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{k.source}</span>
                  <span>{k.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
          {showAdd && (
            <div className="modal-overlay" onClick={() => setShowAdd(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header"><h2 style={{ fontSize: 18 }}>新增知識條目</h2><button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>✕</button></div>
                <div className="modal-body">
                  <div className="form-group"><label className="form-label">標題</label><input className="form-input" value={newEntry.title} onChange={e => setNewEntry(p => ({ ...p, title: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">內容</label><textarea className="form-textarea" value={newEntry.content} onChange={e => setNewEntry(p => ({ ...p, content: e.target.value }))} /></div>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">來源</label><input className="form-input" value={newEntry.source} onChange={e => setNewEntry(p => ({ ...p, source: e.target.value }))} /></div>
                    <div className="form-group"><label className="form-label">領域</label>
                      <select className="form-select" value={newEntry.domain} onChange={e => setNewEntry(p => ({ ...p, domain: e.target.value }))}>
                        {domains.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowAdd(false)}>取消</button><button className="btn btn-primary" onClick={handleAddKnowledge} disabled={!newEntry.title}>新增</button></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'dna' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>道德 DNA 調校</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>映射您的核心價值觀，確保分身決策與您一致</p>
            {Object.entries(dna).map(([key, val]) => {
              const labels: Record<string, { zh: string; desc: string }> = {
                intelligence: { zh: '智 Intelligence', desc: '分析問題的深度與廣度' },
                benevolence:  { zh: '仁 Benevolence', desc: '對利害關係人的關懷程度' },
                courage:      { zh: '勇 Courage', desc: '面對困難議題的決心' },
                integrity:    { zh: '誠 Integrity', desc: '數據透明與承諾履行' },
              };
              const colors: Record<string, string> = { intelligence: '#2563eb', benevolence: '#059669', courage: '#d97706', integrity: '#7c3aed' };
              const l = labels[key];
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: colors[key] }}>{l.zh}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{l.desc}</span>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: colors[key] }}>{val}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={val}
                    onChange={e => setDna(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                    style={{ width: '100%', accentColor: colors[key] }} />
                </div>
              );
            })}
            <button className="btn btn-primary w-full" onClick={handleSaveDNA} disabled={saving}>
              {saving ? <Loader size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> : <Save size={14} />}
              儲存道德 DNA
            </button>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>DNA 解讀</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: '智', val: dna.intelligence, threshold: 70, high: '善於數據驅動決策，能快速識別複雜 ESG 問題的根因。', low: '建議加強量化分析與數據解讀能力。' },
                { key: '仁', val: dna.benevolence, threshold: 75, high: '高度關注利害關係人需求，適合推動社會影響力倡議。', low: '建議增加與利害關係人的互動與傾聽。' },
                { key: '勇', val: dna.courage, threshold: 65, high: '敢於挑戰現狀，推動高影響力但困難的 ESG 轉型。', low: '建議從小規模改變開始，逐步建立信心。' },
                { key: '誠', val: dna.integrity, threshold: 80, high: '高度重視數據可信度，是 5T 協議的最佳執行者。', low: '建議加強佐證文件管理與數據驗證流程。' },
              ].map(item => (
                <div key={item.key} style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 8, borderLeft: `3px solid ${item.val >= item.threshold ? 'var(--success)' : 'var(--warning)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{item.key}</span>
                    {item.val >= item.threshold ? <CheckCircle size={13} color="var(--success)" /> : <Brain size={13} color="var(--warning)" />}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.val >= item.threshold ? item.high : item.low}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {chat.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 16, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'twin' && (
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--berkeley-blue), var(--founders-rock))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Fingerprint size={16} color="#fff" />
                  </div>
                )}
                <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? 'var(--berkeley-blue)' : 'var(--bg-tertiary)', color: m.role === 'user' ? '#fff' : 'var(--text-primary)', fontSize: 14, lineHeight: 1.6 }}>
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageSquare size={16} color="#fff" />
                  </div>
                )}
              </div>
            ))}
            {replying && (
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--berkeley-blue), var(--founders-rock))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Fingerprint size={16} color="#fff" />
                </div>
                <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: '14px 14px 14px 4px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 10 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="詢問您的數位分身..." className="form-input" style={{ flex: 1 }} disabled={replying} />
            <button onClick={handleSendChat} className="btn btn-primary" disabled={replying || !chatInput.trim()}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {tab === 'ledger' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>主權帳本</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>您的數位分身歷史版本與演化軌跡，不可篡改地儲存於主權帳本</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { version: 'v1.2.0', date: '2025-01-15', changes: '新增 ESG 數據基礎建設知識條目，調整誠信維度至 90%', hash: 'sha256:a1b2c3d4...' },
              { version: 'v1.1.0', date: '2025-01-08', changes: '初始化道德 DNA，設定知識倉庫基礎架構', hash: 'sha256:e5f6g7h8...' },
              { version: 'v1.0.0', date: '2025-01-01', changes: '數位分身建立，完成覺醒引導問答流程', hash: 'sha256:i9j0k1l2...' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{v.version}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{v.changes}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.date}</span>
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Lock size={10} />{v.hash}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
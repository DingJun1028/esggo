'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, RefreshCw, User, Zap, Shield, Leaf, Lightbulb, Clock, Save, Trash2 } from 'lucide-react';
import { saveAdvisorySession, getAdvisorySessions, logAudit } from '../../lib/db';

const personas = [
  { id: 'compliance', label: '合規守衛', en: 'Compliance Guard', icon: Shield, color: '#2563eb', desc: '專注 GRI 指標對齊與法規風險控管' },
  { id: 'harmony', label: '共榮引導', en: 'Harmony Guide', icon: Leaf, color: '#059669', desc: '提供利害關係人與 DEI 文化視角' },
  { id: 'innovation', label: '創新先行', en: 'Innovation Lead', icon: Lightbulb, color: '#d97706', desc: '探索永續技術、循環經濟與轉型方案' },
  { id: 'berkeley', label: 'Berkeley 導師', en: 'Berkeley Mentor', icon: Zap, color: '#7c3aed', desc: 'Haas 商學院 ESG 策略與商業模式框架' },
];

const quickPrompts = [
  '我應從哪個 GRI 指標開始揭露？',
  '如何計算範疇三 Scope 3 排放量？',
  '中小企業如何應對 TCFD 氣候財務風險？',
  '供應鏈 ESG 稽核的最佳實踐是什麼？',
  '如何避免永續報告中的綠漂風險？',
  'ISSB S2 對台灣企業的實務影響？',
];

const personaResponses: Record<string, string[]> = {
  compliance: [
    '依據 GRI 2021 通用準則，建議優先從 GRI 2-1（組織詳情）與 GRI 2-6（活動、價值鏈）開始，這是所有框架的共同基礎。完成後再依重大性評估決定 GRI 300 或 400 系列的揭露順序。',
    '範疇三排放計算依 GHG Protocol 分為 15 個類別。對中小企業建議優先盤查：類別 1（採購商品/服務）與類別 11（使用銷售產品），這兩類通常佔範疇三排放的 70% 以上。建議取得供應商的初級數據，若無法取得則使用產業平均排放係數。',
    'TCFD 四大核心要素：治理、策略、風險管理、指標目標。建議先完成氣候情境分析（1.5°C 與 4°C），評估實體風險（颱風、洪水、乾旱）與轉型風險（碳費、法規、市場偏好），再對應財務衝擊。金管會已要求特定企業 2026 年前完成 TCFD 揭露。',
    '綠漂風險識別三大警訊：1) 模糊用語如「致力於」、「友善環境」未附具體目標；2) 選擇性揭露只報告正面數據；3) 缺乏第三方驗證。建議所有環境聲明都附上計量數據、時間目標與查證機構。',
  ],
  harmony: [
    '從利害關係人視角，建議先進行雙重重大性評估，了解員工、客戶、投資人與社區最關注的 ESG 議題。透過問卷、深度訪談與焦點團體蒐集意見，再決定揭露優先順序。這樣的由外而內策略更具說服力，也符合 GRI 3-1 要求。',
    'ESG 文化建立需要由上而下的承諾與由下而上的參與。建議：1) 設立跨部門 ESG 大使計畫；2) 將個人 ESG 貢獻納入績效考核；3) 舉辦內部永續黑客松；4) 定期分享量化進展。讓永續不只是企業義務，更是個人價值實踐。',
    '供應鏈管理建議分三層：第一層直接供應商 100% ESG 問卷評估；第二層重點高風險供應商現場稽核；第三層要求簽署永續行為準則。EU CSRD 要求企業對整個供應鏈進行盡職調查，台灣出口商需提前準備。',
  ],
  innovation: [
    '建議採用數位化 ESG 數據平台整合 IoT 感測器，實現用電、用水、廢棄物的即時監控與預測性節能管理。AI 驅動的能源優化系統可將碳排放降低 15-25%。結合 5T 數據架構確保數據可溯源性，通過第三方零幻覺驗算。',
    '循環經濟在製造業三大商業模式：1) 產品即服務 (PaaS) — 租賃替代購買；2) 工業共生 — 與周邊企業交換廢棄物與副產品；3) 再製造 — 回收舊品翻新。預計 2030 年前循環經濟市場規模將達 4.5 兆美元，先行者可取得競爭優勢。',
    'ISSB S2 對台灣企業最大衝擊是供應鏈透明度要求。建議投資建立碳足跡追蹤系統，使用 LCA（生命週期評估）方法量化產品碳足跡，並與主要客戶建立數據共享機制，這將成為未來供應商資格審核的必要條件。',
  ],
  berkeley: [
    '根據 Haas 商學院 ESG 研究，「由合規到創造」轉型框架分三個階段：防守期（基礎合規揭露）→ 進攻期（ESG 差異化競爭）→ 轉型期（商業模式創新）。大多數台灣中小企業目前在防守期，建議在鞏固基礎揭露的同時，積極識別 ESG 帶來的商業機會。',
    'Berkeley 開放創新方法論在 ESG 領域的應用：與學術機構合作開發低碳技術、透過 ESG 加速器引入新創解決方案、參與產業聯盟共同推動標準制定。這種多邊協作模式比單打獨鬥更能快速提升 ESG 成熟度，同時降低轉型成本。',
  ],
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  persona?: string;
}

export default function AdvisoryPage() {
  const [activePersona, setActivePersona] = useState(personas[0]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `您好！我是您的 ${personas[0].label}，專門提供 ESG 合規策略與 GRI 指標對齊建議。請問有什麼永續治理議題我可以協助您？`, timestamp: new Date(), persona: personas[0].id }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');
    const userMsg: Message = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const responses = personaResponses[activePersona.id] || personaResponses.compliance;
    const reply = responses[Math.floor(Math.random() * responses.length)];
    setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date(), persona: activePersona.id }]);
    setLoading(false);
  };

  const switchPersona = (p: typeof personas[0]) => {
    setActivePersona(p);
    setMessages([{ role: 'assistant', content: `您好！我是 ${p.label}，${p.desc}。請問有什麼 ESG 治理問題需要我協助？`, timestamp: new Date(), persona: p.id }]);
  };

  const handleSaveSession = async () => {
    await saveAdvisorySession({
      persona: activePersona.id,
      title: `${activePersona.label} — ${messages[1]?.content.slice(0, 20)}...`,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });
    await logAudit({ action: 'SAVE_SESSION', resource: `${activePersona.label} 諮詢記錄`, user_name: 'User', t5_tag: 'T1+T5' });
    setSessions(prev => [...prev, activePersona.id]);
  };

  return (
    <div className="page-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={18} color="#fff" />
              </div>
              <h1 className="page-title">專家諮詢</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-purple">SPIRIT Personas</span>
              <span className="badge badge-blue">AI 驅動</span>
              <span style={{ color: 'var(--text-muted)' }}>· Berkeley Haas × ESG GO</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleSaveSession} disabled={messages.length < 2}>
              <Save size={14} />儲存記錄
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => switchPersona(activePersona)}>
              <RefreshCw size={14} />重置
            </button>
          </div>
        </div>
      </div>

      {/* Persona Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {personas.map(p => {
          const Icon = p.icon;
          const active = p.id === activePersona.id;
          return (
            <button key={p.id} onClick={() => switchPersona(p)} style={{
              padding: '14px 16px', border: `2px solid ${active ? p.color : 'var(--border-light)'}`,
              borderRadius: 10, background: active ? `${p.color}08` : 'var(--bg-card)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon size={16} color={p.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: active ? p.color : 'var(--text-primary)' }}>{p.label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{p.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 16, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${activePersona.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Bot size={16} color={activePersona.color} />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? 'var(--berkeley-blue)' : 'var(--bg-tertiary)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: 14, lineHeight: 1.6,
                }}>
                  {msg.content}
                  <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={9} />
                    {msg.timestamp.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <User size={16} color="#fff" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${activePersona.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} color={activePersona.color} />
                </div>
                <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: '14px 14px 14px 4px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-light)', overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p)} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px 16px', display: 'flex', gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`詢問 ${activePersona.label}...`}
              className="form-input"
              style={{ flex: 1 }}
              disabled={loading}
            />
            <button onClick={() => sendMessage()} className="btn btn-primary" disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Send, RefreshCw, Trash2, User, Sparkles } from 'lucide-react';
import { saveAdvisorySession, getAdvisorySession, logAudit, type AdvisoryMessage } from '../../lib/db';

const PERSONAS = [
  { id: 'compliance', label: '合規守衛', sub: 'Compliance', color: '#003262', bg: '#EBF2FA', desc: '專注 GRI/SASB/TCFD 指標對齊、綠漂風險偵測與合規缺口分析' },
  { id: 'harmony',    label: '共榮引導', sub: 'Harmony',    color: '#22C55E', bg: '#DCFCE7', desc: '提供利害關係人視角、社區影響分析與企業文化永續建議' },
  { id: 'innovation', label: '創新先行', sub: 'Innovation',  color: '#8B5CF6', bg: '#F5F3FF', desc: '探索淨零技術路徑、綠色金融工具與產業轉型替代方案' },
  { id: 'berkeley',   label: 'Berkeley 導師', sub: 'Berkeley Haas', color: '#FDB515', bg: '#FEF3C7', desc: 'UC Berkeley ESG 學術觀點、研究方法論與國際最佳實踐' },
];

const QUICK_PROMPTS: Record<string, string[]> = {
  compliance: ['我的 GRI 305-1 揭露有哪些缺口？', '如何避免綠漂風險？', '金管會規範最新要求為何？'],
  harmony:    ['如何識別主要利害關係人？', '重大性評估如何進行？', '社區投資如何量化效益？'],
  innovation: ['2030 淨零路徑如何規劃？', 'CBAM 碳邊境稅對我有何影響？', '再生能源採購策略建議？'],
  berkeley:   ['TCFD 四大支柱如何實踐？', 'ISSB S2 與 GRI 的差異？', '企業 ESG 評分如何改善？'],
};

const PERSONA_RESPONSES: Record<string, (q: string) => string> = {
  compliance: (q) => `**[合規守衛分析]**\n\n針對您的問題「${q}」：\n\n**GRI 框架對應：**\n- GRI 2-1~2-5：一般揭露基本資訊\n- GRI 305-1/2/3：溫室氣體排放揭露\n\n**合規要點：**\n1. 確保數據可溯源至原始憑證（T1 可溯源）\n2. 計算方法須符合 ISO 14064-1 標準\n3. 第三方查證建議採用 ISSA 5000 準則\n\n**行動建議：** 建議立即檢視 evidence_vault 中對應指標的佐證文件完整性，並執行 ZKP 封印確保不可篡改性。`,
  harmony: (q) => `**[共榮引導觀點]**\n\n關於「${q}」的利害關係人視角：\n\n**識別框架：**\n- 內部：員工、董事會、股東\n- 外部：客戶、供應商、社區、政府\n\n**議合方式：**\n1. 問卷調查（GRI 2-29）\n2. 深度訪談與焦點團體\n3. 年度說明會與永續報告書\n\n**重大性評估：** 建議採用 GRI 3-1~3-3 雙重重大性矩陣，同時考量「對企業影響」與「對社會/環境影響」。`,
  innovation: (q) => `**[創新先行方案]**\n\n關於「${q}」的創新路徑：\n\n**技術選項：**\n- 短期：能效提升、再生能源採購（T-REC）\n- 中期：製程電氣化、循環經濟設計\n- 長期：碳捕捉、氫能導入\n\n**金融工具：**\n- 永續連結貸款（SLL）\n- 綠色債券發行\n- 內部碳定價機制\n\n**SBTi 建議：** 設定科學基礎目標，對齊 1.5°C 路徑，2030 年前實現 46% 減排。`,
  berkeley: (q) => `**[Berkeley Haas 學術觀點]**\n\n基於「${q}」的研究與實踐：\n\n**學術框架：**\n- Porter & Kramer 共享價值創造理論\n- Freeman 利害關係人理論\n- TCFD 氣候相關財務揭露\n\n**實證研究：**\n- ESG 評分高的企業長期 ROE 平均高出 23%\n- 永續供應鏈管理可降低 15-20% 採購風險\n\n**建議閱讀：** GRI 2021 全套標準、ISSB S1/S2、UC Berkeley ESG Lab 研究報告。`,
};

export default function AdvisoryPage() {
  const [persona, setPersona] = useState(PERSONAS[0].id);
  const [messages, setMessages] = useState<AdvisoryMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [toast, setToast] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try { const hist = await getAdvisorySession(persona); setMessages(hist); }
    finally { setLoadingHistory(false); }
  }, [persona]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput('');

    const userMsg: AdvisoryMessage = { role: 'user', content, timestamp: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setSending(true);

    try {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      const respFn = PERSONA_RESPONSES[persona] ?? PERSONA_RESPONSES.compliance;
      const aiMsg: AdvisoryMessage = { role: 'assistant', content: respFn(content), timestamp: new Date().toISOString() };
      const final = [...updated, aiMsg];
      setMessages(final);
      await saveAdvisorySession(persona, final);
      await logAudit({ action: 'ADVISORY_CHAT', resource: `${PERSONAS.find(p => p.id === persona)?.label} 諮詢`, user_name: 'User', t5_tag: 'T2', details: content.slice(0, 80) });
    } finally { setSending(false); }
  };

  const clearChat = async () => {
    setMessages([]);
    await saveAdvisorySession(persona, []);
    showToast('對話已清除');
  };

  const currentPersona = PERSONAS.find(p => p.id === persona)!;

  return (
    <div className="page-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h) - var(--space-8))' }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#003262', color: '#fff', padding: '10px 18px', borderRadius: 'var(--radius-xl)', fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}

      <div className="page-header mb-4">
        <div className="flex items-start gap-4">
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>SPIRIT AI 專家諮詢</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-base)', marginTop: 4 }}>4 位 AI 人格 · 持久對話記憶 · GRI 合規建議</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 1, minHeight: 0 }}>
        {/* Persona Panel */}
        <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PERSONAS.map(p => (
            <button key={p.id} onClick={() => setPersona(p.id)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-lg)', background: persona === p.id ? p.bg : 'var(--surface-card)', border: `1.5px solid ${persona === p.id ? p.color : 'var(--border-default)'}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', transition: 'all var(--duration-fast)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, marginTop: 5, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: persona === p.id ? p.color : 'var(--text-primary)' }}>{p.label}</p>
                <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>{p.sub}</p>
              </div>
            </button>
          ))}
          <div className="card card-sm mt-2">
            <div className="card-body" style={{ padding: 'var(--space-3)' }}>
              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{currentPersona.desc}</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="card-header">
            <div className="flex items-center gap-2">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: currentPersona.color }} />
              <span style={{ fontWeight: 700, color: currentPersona.color, fontSize: 'var(--font-size-sm)' }}>{currentPersona.label}</span>
              {loadingHistory && <RefreshCw size={12} className="spin" style={{ color: 'var(--text-tertiary)' }} />}
            </div>
            <button onClick={clearChat} className="btn btn-ghost btn-xs flex items-center gap-1" aria-label="清除對話">
              <Trash2 size={12} /> 清除
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-2xl)', background: currentPersona.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: currentPersona.color }}>
                  <Bot size={28} />
                </div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{currentPersona.label} 準備就緒</p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginBottom: 16 }}>{currentPersona.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {QUICK_PROMPTS[persona]?.map(q => (
                    <button key={q} onClick={() => sendMessage(q)}
                      style={{ fontSize: 12, padding: '6px 14px', borderRadius: 'var(--radius-full)', background: currentPersona.bg, color: currentPersona.color, border: `1px solid ${currentPersona.color}30`, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: currentPersona.bg, color: currentPersona.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={14} />
                  </div>
                )}
                <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.role === 'user' ? 'var(--blue-700)' : 'var(--surface-section)', color: msg.role === 'user' ? '#fff' : 'var(--text-primary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--blue-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: currentPersona.bg, color: currentPersona.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={14} />
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--surface-section)' }}>
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: currentPersona.color, animation: `bounce 1s ${d * 0.2}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--border-default)', display: 'flex', gap: 8 }}>
            <input className="input" style={{ flex: 1 }} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={`詢問 ${currentPersona.label}...`} disabled={sending} aria-label="輸入訊息" />
            <button className="btn btn-primary btn-icon" onClick={() => sendMessage()} disabled={!input.trim() || sending} aria-label="送出">
              {sending ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        @media (max-width: 767px) { .persona-panel { display: none; } }
      `}</style>
    </div>
  );
}
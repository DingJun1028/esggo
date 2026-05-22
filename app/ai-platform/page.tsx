'use client';
import { useState } from 'react';
import { Sparkles, Search, ShieldCheck, MessageSquare, TrendingUp, Cpu, Code, Brain, ChevronRight, Zap, BarChart2, FileText, Globe } from 'lucide-react';

const AI_APPS = [
  { id: 'greenwash', title: '綠漂風險掌控', icon: ShieldCheck, desc: '掃描文本中的誇大或不實永續聲明，提供修正建議。', color: '#16a34a', tag: 'GRI T2' },
  { id: 'gri-gen', title: 'GRI 自動織稿', icon: Code, desc: '根據數據自動生成符合 GRI 2021 標準的章節草稿。', color: '#003262', tag: 'SustainWrite' },
  { id: 'sentiment', title: '利害關係人輿情', icon: MessageSquare, desc: '分析社群與新聞，評估企業 ESG 聲譽。', color: '#7c3aed', tag: 'S-Hub' },
  { id: 'predictor', title: '碳排放預測', icon: TrendingUp, desc: '基於歷史數據，預測未來 12 個月的排放趨勢。', color: '#ea580c', tag: 'E-Hub' },
  { id: 'compliance', title: '合規差距分析', icon: BarChart2, desc: '對照 GRI/SASB/TCFD 自動識別揭露缺口。', color: '#0891b2', tag: 'Compliance' },
  { id: 'summary', title: '報告摘要生成', icon: FileText, desc: '一鍵生成執行摘要，適合董事會或投資者閱讀。', color: '#d97706', tag: 'Publish' },
];

const LOGS = [
  { time: '14:32:18', op: 'GREENWASH_SCAN', detail: '分析 GRI 2-23 政策聲明，偵測到 2 項潛在風險。' },
  { time: '14:31:55', op: 'GRI_GEN', detail: '為 GRI 302-1 章節生成 1,200 字草稿完成。' },
  { time: '14:30:40', op: 'CARBON_FORECAST', detail: '2024 Q3 範疇一排放預測：1,180 tCO₂e。' },
];

export default function AIPlatformPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, type: 'query' }),
      });
      const data = await res.json();
      setResult(data.content || data.error || '無法獲取回應');
    } catch {
      setResult('AI 服務連線失敗，請稍後重試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003262', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="#FDB515" />
          AI 整合平台
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>Powered by Gemini 2.0 Flash · ESG-RAG 知識庫 · 5T 誠信驗算</p>
      </div>

      {/* Main Search Box */}
      <div style={{ background: 'linear-gradient(135deg, #001e3c, #003262)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={28} color="#FDB515" />
          </div>
          <div>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0 }}>Omni-Intelligence 搜尋</h2>
            <p style={{ color: 'rgba(147,197,253,0.7)', fontSize: '13px', margin: '4px 0 0' }}>詢問 ESG 法規、標竿對標或數據分析</p>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="請輸入您的問題，例如：分析 GRI 305-1 與 TCFD 的關聯性..."
            style={{ width: '100%', padding: '16px 120px 16px 48px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '8px 20px', background: '#FDB515', color: '#003262', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
          >
            {loading ? '思考中...' : '啟動 AI'}
          </button>
        </div>
        {result && (
          <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {result}
          </div>
        )}
      </div>

      {/* AI Micro-Apps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {AI_APPS.map(app => (
          <div key={app.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: `${app.color}15`, flexShrink: 0 }}>
                <app.icon size={22} color={app.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{app.title}</h3>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: `${app.color}15`, color: app.color, fontWeight: '600' }}>{app.tag}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{app.desc}</p>
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: app.color }}>
                  立即開啟 <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h4 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', margin: 0 }}>最新 AI 實證日誌</h4>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: '600' }}>● Active</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {LOGS.map((l, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: '11px', borderBottom: '1px solid #1e293b', paddingBottom: '8px', display: 'flex', gap: '12px', color: '#94a3b8' }}>
              <span style={{ color: '#475569', flexShrink: 0 }}>[{l.time}]</span>
              <span style={{ color: '#60a5fa', flexShrink: 0 }}>{l.op}</span>
              <span style={{ color: '#cbd5e1' }}>{l.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
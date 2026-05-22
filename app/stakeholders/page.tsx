'use client';
import { useState } from 'react';
import { Users, TrendingUp, MessageSquare, Star, Plus, Filter } from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  type: string;
  influence: number;
  concern: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  engagements: number;
  lastContact: string;
  topics: string[];
}

const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: '1', name: '機構投資者聯盟', type: '投資者', influence: 9, concern: 8, sentiment: 'positive', engagements: 12, lastContact: '2024-04-10', topics: ['ESG 評級', 'TCFD 揭露', '股東回報'] },
  { id: '2', name: '台灣環保聯盟', type: '非政府組織', influence: 7, concern: 9, sentiment: 'neutral', engagements: 5, lastContact: '2024-03-22', topics: ['碳排放', '廢水處理', '生物多樣性'] },
  { id: '3', name: '員工代表委員會', type: '員工', influence: 8, concern: 7, sentiment: 'positive', engagements: 24, lastContact: '2024-04-15', topics: ['薪酬福利', '工作安全', '多元共融'] },
  { id: '4', name: '主要客戶群 (B2B)', type: '客戶', influence: 9, concern: 6, sentiment: 'positive', engagements: 18, lastContact: '2024-04-20', topics: ['供應鏈透明', '碳足跡', '綠色產品'] },
  { id: '5', name: '地方社區代表', type: '社區', influence: 5, concern: 8, sentiment: 'neutral', engagements: 8, lastContact: '2024-02-28', topics: ['環境影響', '就業機會', '社區投資'] },
];

export default function StakeholdersPage() {
  const [stakeholders] = useState<Stakeholder[]>(MOCK_STAKEHOLDERS);
  const [activeTab, setActiveTab] = useState<'list' | 'matrix'>('matrix');
  const [selected, setSelected] = useState<Stakeholder | null>(null);

  const sentimentColor = (s: string) => s === 'positive' ? '#22c55e' : s === 'neutral' ? '#f59e0b' : '#ef4444';
  const sentimentLabel = (s: string) => s === 'positive' ? '正向' : s === 'neutral' ? '中立' : '負向';

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003262', margin: 0 }}>利害關係人 Stakeholders</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>GRI 2-29 · 影響力矩陣 · 情感追蹤</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#003262', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          <Plus size={14} /> 新增利害關係人
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '利害關係人總數', value: stakeholders.length.toString(), color: '#003262' },
          { label: '正向情感比例', value: `${Math.round(stakeholders.filter(s => s.sentiment === 'positive').length / stakeholders.length * 100)}%`, color: '#22c55e' },
          { label: '本季議合次數', value: stakeholders.reduce((a, s) => a + s.engagements, 0).toString(), color: '#3b7ea1' },
          { label: '高影響力關係人', value: stakeholders.filter(s => s.influence >= 8).length.toString(), color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[{ id: 'matrix', label: '影響力矩陣' }, { id: 'list', label: '清單視圖' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: activeTab === t.id ? '#003262' : '#f1f5f9', color: activeTab === t.id ? '#fff' : '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'matrix' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#003262', marginBottom: '20px' }}>影響力 vs 關注度 矩陣</h3>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '50%', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {/* Grid lines */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '25% 25%' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '2px dashed #cbd5e1' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '2px dashed #cbd5e1' }} />
            {/* Quadrant labels */}
            <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>高關注/低影響 → 知情</div>
            <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px', color: '#94a3b8', fontWeight: '600', textAlign: 'right' }}>高關注/高影響 → 深度協作</div>
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>低關注/低影響 → 監控</div>
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '10px', color: '#94a3b8', fontWeight: '600', textAlign: 'right' }}>低關注/高影響 → 管理期望</div>
            {/* Stakeholder dots */}
            {stakeholders.map(s => (
              <div key={s.id} onClick={() => setSelected(s)} style={{
                position: 'absolute',
                left: `${(s.influence / 10) * 100}%`,
                bottom: `${(s.concern / 10) * 100}%`,
                transform: 'translate(-50%, 50%)',
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: sentimentColor(s.sentiment),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff', fontSize: '10px', fontWeight: '700',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 10,
                title: s.name,
              }}>
                {s.name.charAt(0)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            {stakeholders.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: sentimentColor(s.sentiment) }} />
                <span style={{ color: '#64748b' }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                {['名稱', '類型', '影響力', '關注度', '情感傾向', '議合次數', '最後聯絡'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '700', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stakeholders.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{s.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '20px', background: '#dbeafe', color: '#1e40af', fontWeight: '600' }}>{s.type}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#003262' }}>{s.influence}/10</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#003262' }}>{s.concern}/10</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: `${sentimentColor(s.sentiment)}15`, color: sentimentColor(s.sentiment), fontWeight: '700' }}>{sentimentLabel(s.sentiment)}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{s.engagements}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8' }}>{s.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003262', marginBottom: '8px' }}>{selected.name}</h3>
            <span style={{ fontSize: '12px', padding: '4px 10px', background: '#dbeafe', color: '#1e40af', borderRadius: '20px', fontWeight: '600' }}>{selected.type}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '20px 0' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>影響力</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#003262' }}>{selected.influence}/10</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>關注度</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#003262' }}>{selected.concern}/10</div>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>關注議題</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selected.topics.map((t, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '4px 10px', background: '#f1f5f9', color: '#475569', borderRadius: '20px' }}>{t}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ width: '100%', padding: '12px', background: '#003262', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>關閉</button>
          </div>
        </div>
      )}
    </div>
  );
}
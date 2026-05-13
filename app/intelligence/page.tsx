'use client';
import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Globe, ExternalLink, Clock, Tag, Filter, Search, Plus, BookOpen } from 'lucide-react';

const reports = [
  { id: 1, title: '金管會 2025 年永續報告書指引更新', source: '金融監督管理委員會', url: 'https://www.fsc.gov.tw', date: '2025-01-15', category: '法規更新', tags: ['GRI', 'TCFD', '金管會'], impact: 'high', daysAgo: 2 },
  { id: 2, title: 'ISSB S2 氣候相關揭露標準實施指南', source: 'IFRS Foundation', url: 'https://www.ifrs.org', date: '2025-01-10', category: '國際標準', tags: ['ISSB', 'S2', 'TCFD'], impact: 'high', daysAgo: 7 },
  { id: 3, title: '台灣 2024 上市公司 ESG 評比報告', source: '台灣永續能源研究基金會', url: 'https://www.taise.org.tw', date: '2024-12-20', category: '市場情報', tags: ['ESG評比', '台灣', '上市公司'], impact: 'medium', daysAgo: 28 },
  { id: 4, title: 'EU CSRD 指令對台灣供應鏈的影響分析', source: 'Deloitte Taiwan', url: 'https://www.deloitte.com', date: '2024-12-15', category: '供應鏈', tags: ['CSRD', 'EU', '供應鏈'], impact: 'high', daysAgo: 33 },
  { id: 5, title: '2025 碳交易市場展望：亞太區趨勢', source: 'S&P Global', url: 'https://www.spglobal.com', date: '2025-01-05', category: '碳市場', tags: ['碳交易', '亞太', '淨零'], impact: 'medium', daysAgo: 12 },
];

const riskAlerts = [
  { level: 'high', label: 'CSRD 供應鏈合規風險', desc: '歐盟客戶要求 2026 Q1 前提交 CSRD 問卷' },
  { level: 'medium', label: 'GRI 413 社區影響揭露不足', desc: '建議補充當地社區互動記錄' },
  { level: 'low', label: '綠漂風險偵測', desc: '報告中「致力於」等模糊用語需量化' },
];

const benchmarks = [
  { company: '台積電', score: 94, industry: '半導體' },
  { company: '日月光', score: 88, industry: '封測' },
  { company: '鴻海', score: 82, industry: '電子製造' },
  { company: '聯發科', score: 79, industry: '半導體' },
  { company: '您的企業', score: 62, industry: '目標產業', highlight: true },
];

export default function IntelligencePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');

  const categories = ['全部', ...Array.from(new Set(reports.map(r => r.category)))];
  const filtered = reports.filter(r =>
    (category === '全部' || r.category === category) &&
    (r.title.includes(search) || r.source.includes(search) || r.tags.some(t => t.includes(search)))
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={18} color="#fff" />
              </div>
              <h1 className="page-title">商情中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Intelligence Hub</span>
              <span className="badge badge-gold">即時情報</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Main Feed */}
        <div>
          {/* Search & Filter */}
          <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋情報..." className="form-input" style={{ paddingLeft: 36 }} />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-select" style={{ width: 140 }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(r => (
              <div key={r.id} className="card" style={{ padding: 20, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1, paddingRight: 12 }}>{r.title}</h3>
                  <span className={`badge ${r.impact === 'high' ? 'badge-red' : 'badge-gold'}`}>
                    {r.impact === 'high' ? '高影響' : '中影響'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Globe size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.source}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.daysAgo} 天前</span>
                  </div>
                  <span className="badge badge-blue">{r.category}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {r.tags.map(t => <span key={t} className="gri-chip">{t}</span>)}
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                  <ExternalLink size={12} />查看原始報導
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Risk Alerts */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={15} color="var(--warning)" />風險預警
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {riskAlerts.map((a, i) => (
                <div key={i} className={`alert ${a.level === 'high' ? 'alert-danger' : a.level === 'medium' ? 'alert-warning' : 'alert-info'}`}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.label}</div>
                    <div style={{ fontSize: 12, marginTop: 2, opacity: 0.8 }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Benchmark */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={15} color="var(--founders-rock)" />產業標竿
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {benchmarks.map((b, i) => (
                <div key={i} style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: b.highlight ? 'rgba(253,181,21,0.1)' : 'var(--bg-tertiary)',
                  border: b.highlight ? '1px solid rgba(253,181,21,0.3)' : '1px solid transparent',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: b.highlight ? 700 : 500, color: b.highlight ? 'var(--medalist)' : 'var(--text-primary)' }}>{b.company}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: b.score >= 80 ? 'var(--success)' : b.score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{b.score}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${b.score}%`, background: b.highlight ? 'var(--california-gold)' : undefined }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
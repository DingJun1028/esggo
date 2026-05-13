'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Clock, Tag, Search, Plus, Globe, FileText, TrendingUp, Scale, Download } from 'lucide-react';
import { getReadingRoomReports, addReadingRoomReport, type ReadingRoomReport } from '../../lib/db';

const tabs = [
  { id: 'intelligence', label: '情報中心', icon: TrendingUp },
  { id: 'regulations', label: 'ESG 法規庫', icon: Scale },
  { id: 'yearbook', label: '台灣年鑑', icon: FileText },
  { id: 'benchmark', label: '標竿報告', icon: Globe },
];

const regulations = [
  { title: '金管會永續發展路徑圖 2.0', source: '金融監督管理委員會', url: 'https://www.fsc.gov.tw', region: '台灣', year: 2025, tags: ['金管會', 'ESG揭露', '上市公司'], impact: 'high' },
  { title: 'EU Corporate Sustainability Reporting Directive (CSRD)', source: 'European Commission', url: 'https://ec.europa.eu', region: 'EU', year: 2024, tags: ['CSRD', 'ESRS', 'EU'], impact: 'high' },
  { title: 'ISSB IFRS S1/S2 氣候相關揭露準則', source: 'IFRS Foundation', url: 'https://www.ifrs.org', region: '國際', year: 2023, tags: ['ISSB', 'IFRS S2', 'TCFD'], impact: 'high' },
  { title: '美國 SEC 氣候相關揭露規則', source: 'U.S. Securities and Exchange Commission', url: 'https://www.sec.gov', region: '美國', year: 2024, tags: ['SEC', '氣候揭露', '美國'], impact: 'high' },
  { title: '台灣碳費法規與碳交易市場機制', source: '環境部', url: 'https://www.moenv.gov.tw', region: '台灣', year: 2024, tags: ['碳費', '碳交易', '台灣'], impact: 'high' },
  { title: 'GRI Universal Standards 2021 更新版', source: 'Global Reporting Initiative', url: 'https://www.globalreporting.org', region: '國際', year: 2021, tags: ['GRI', 'GRI 2021', '揭露標準'], impact: 'medium' },
];

const yearbook = [
  { year: 2024, title: '2024 台灣企業永續發展年鑑', publisher: 'CSRone', reportCount: 1200, topics: ['氣候變遷', '循環經濟', 'DEI'], url: 'https://csrone.com', highlights: '中小企業 ESG 揭露比例創新高，達 38%' },
  { year: 2023, title: '2023 台灣永續報告書統計分析', publisher: 'TAISE', reportCount: 1150, topics: ['TCFD', '供應鏈透明', '員工福利'], url: 'https://www.taise.org.tw', highlights: 'TCFD 框架採用率突破 60%' },
  { year: 2022, title: '2022 台灣 ESG 調查報告', publisher: 'KPMG Taiwan', reportCount: 980, topics: ['碳中和', '人權盡職調查', '董事會多元化'], url: 'https://kpmg.com/tw', highlights: '超過 50% 企業設立 2050 碳中和目標' },
  { year: 2021, title: '2021 台灣上市公司永續資訊揭露', publisher: '台灣交易所', reportCount: 850, topics: ['GRI標準', 'ESG評分', '重大性評估'], url: 'https://www.twse.com.tw', highlights: 'GRI 準則採用率超過 80%' },
  { year: 2020, title: '2020 台灣 CSR 年度調查', publisher: 'CommonWealth', reportCount: 780, topics: ['SDGs', '社區投資', '環境管理'], url: 'https://csr.cw.com.tw', highlights: '首次將 SDGs 納入主流評估框架' },
];

interface BenchmarkReport { company: string; industry: string; year: number; score: number; frameworks: string[]; highlight: string; url: string; }
const benchmarks: BenchmarkReport[] = [
  { company: '台積電', industry: '半導體', year: 2024, score: 94, frameworks: ['GRI', 'TCFD', 'SASB', 'ISSB'], highlight: '全球首家取得科學基礎碳排放目標 (SBTi) 認證的半導體公司', url: 'https://csr.tsmc.com' },
  { company: '鴻海精密', industry: '電子製造', year: 2024, score: 85, frameworks: ['GRI', 'TCFD', 'SASB'], highlight: '供應鏈碳足跡追蹤覆蓋前 50 大供應商', url: 'https://esg.foxconn.com' },
  { company: '台達電子', industry: '電力電子', year: 2024, score: 92, frameworks: ['GRI', 'TCFD', 'CDP'], highlight: 'CDP 氣候變遷評級獲 A 級，連續 5 年', url: 'https://esg.deltaww.com' },
  { company: '聯發科技', industry: '半導體設計', year: 2024, score: 88, frameworks: ['GRI', 'TCFD', 'ISSB'], highlight: '2024 年成功達成辦公室 100% 再生能源目標', url: 'https://esg.mediatek.com' },
  { company: '中鋼集團', industry: '鋼鐵', year: 2024, score: 82, frameworks: ['GRI', 'TCFD'], highlight: '全台首家鋼鐵業完成 ISO 14064-1 第三方查證', url: 'https://csr.csc.com.tw' },
];

const fallbackReports: ReadingRoomReport[] = [
  { id: '1', title: '金管會 2025 年永續報告書指引更新', source: '金融監督管理委員會', source_url: 'https://www.fsc.gov.tw', category: 'intelligence', tags: ['GRI', 'TCFD', '金管會'], impact_level: 'high', published_date: '2025-01-15' },
  { id: '2', title: 'ISSB S2 氣候相關揭露標準實施指南', source: 'IFRS Foundation', source_url: 'https://www.ifrs.org', category: 'intelligence', tags: ['ISSB', 'S2', 'TCFD'], impact_level: 'high', published_date: '2025-01-10' },
  { id: '3', title: 'EU CSRD 指令對台灣供應鏈的影響分析', source: 'Deloitte Taiwan', source_url: 'https://www.deloitte.com', category: 'intelligence', tags: ['CSRD', 'EU', '供應鏈'], impact_level: 'high', published_date: '2024-12-15' },
  { id: '4', title: '2025 碳交易市場展望：亞太區趨勢', source: 'S&P Global', source_url: 'https://www.spglobal.com', category: 'intelligence', tags: ['碳交易', '亞太', '淨零'], impact_level: 'medium', published_date: '2025-01-05' },
];

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return '今天';
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  if (days < 365) return `${Math.floor(days / 30)} 個月前`;
  return `${Math.floor(days / 365)} 年前`;
}

export default function ReadingRoomPage() {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [reports, setReports] = useState<ReadingRoomReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newReport, setNewReport] = useState({ title: '', source: '', source_url: '', category: 'intelligence', tags: '', impact_level: 'medium' });

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    const data = await getReadingRoomReports();
    setReports(data.length > 0 ? data : fallbackReports);
    setLoading(false);
  }

  async function handleAdd() {
    const report: ReadingRoomReport = {
      ...newReport,
      tags: newReport.tags.split(',').map(t => t.trim()).filter(Boolean),
      published_date: new Date().toISOString().slice(0, 10),
    };
    const saved = await addReadingRoomReport(report);
    if (saved) setReports(prev => [saved, ...prev]);
    setShowAdd(false);
    setNewReport({ title: '', source: '', source_url: '', category: 'intelligence', tags: '', impact_level: 'medium' });
  }

  const filteredReports = reports.filter(r =>
    r.title.includes(search) || r.source.includes(search) || (r.tags || []).some(t => t.includes(search))
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} color="#fff" />
              </div>
              <h1 className="page-title">永續閱覽室</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Reading Room</span>
              <span className="badge badge-gold">法規情報</span>
              <span className="badge badge-green">標竿報告</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={14} />新增情報
          </button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <Icon size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'intelligence' && (
        <div>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋情報標題、來源、標籤..." className="form-input" style={{ paddingLeft: 36 }} />
            </div>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredReports.map((r, i) => (
                <div key={r.id || i} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1, paddingRight: 12 }}>{r.title}</h3>
                    <span className={`badge ${r.impact_level === 'high' ? 'badge-red' : 'badge-gold'}`}>
                      {r.impact_level === 'high' ? '高影響' : '中影響'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Globe size={12} />{r.source}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />{timeAgo(r.published_date)} · {r.published_date}
                    </span>
                  </div>
                  {(r.tags || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {(r.tags || []).map(t => <span key={t} className="gri-chip">{t}</span>)}
                    </div>
                  )}
                  {r.source_url && (
                    <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                      <ExternalLink size={12} />追蹤原始來源
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'regulations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {regulations.map((r, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, flex: 1, paddingRight: 12 }}>{r.title}</h3>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <span className="badge badge-blue">{r.region}</span>
                  <span className={`badge ${r.impact === 'high' ? 'badge-red' : 'badge-gold'}`}>{r.year}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Globe size={12} />{r.source}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {r.tags.map(t => <span key={t} className="gri-chip">{t}</span>)}
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                <ExternalLink size={12} />查看原始法規
              </a>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'yearbook' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {yearbook.map((y, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ width: 48, height: 26, background: 'var(--berkeley-blue)', color: '#fff', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{y.year}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{y.title}</h3>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{y.publisher} · 收錄 {y.reportCount.toLocaleString()} 份報告</div>
                </div>
              </div>
              <div className="alert alert-info" style={{ marginBottom: 12, fontSize: 13 }}>
                <TrendingUp size={14} /><span>{y.highlights}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {y.topics.map(t => <span key={t} className="gri-chip">{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={y.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                  <ExternalLink size={12} />查看來源
                </a>
                <button className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                  <Download size={12} />下載年鑑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'benchmark' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {benchmarks.map((b, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{b.company}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.industry} · {b.year}</div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: b.score >= 90 ? 'var(--success)' : b.score >= 80 ? 'var(--warning)' : 'var(--founders-rock)' }}>
                  {b.score}
                </div>
              </div>
              <div className="progress-bar" style={{ marginBottom: 12 }}>
                <div className="progress-fill" style={{ width: `${b.score}%`, background: b.score >= 90 ? 'var(--success)' : undefined }} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{b.highlight}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {b.frameworks.map(f => <span key={f} className="gri-chip">{f}</span>)}
              </div>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                <ExternalLink size={12} />查看報告書
              </a>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>新增情報</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">標題</label>
                <input className="form-input" value={newReport.title} onChange={e => setNewReport(p => ({ ...p, title: e.target.value }))} placeholder="情報標題" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">來源機構</label>
                  <input className="form-input" value={newReport.source} onChange={e => setNewReport(p => ({ ...p, source: e.target.value }))} placeholder="如：金管會" />
                </div>
                <div className="form-group">
                  <label className="form-label">原始 URL</label>
                  <input className="form-input" value={newReport.source_url} onChange={e => setNewReport(p => ({ ...p, source_url: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">影響程度</label>
                  <select className="form-select" value={newReport.impact_level} onChange={e => setNewReport(p => ({ ...p, impact_level: e.target.value }))}>
                    <option value="high">高影響</option>
                    <option value="medium">中影響</option>
                    <option value="low">低影響</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">標籤 (逗號分隔)</label>
                  <input className="form-input" value={newReport.tags} onChange={e => setNewReport(p => ({ ...p, tags: e.target.value }))} placeholder="GRI, TCFD, 法規" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={!newReport.title}>新增情報</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
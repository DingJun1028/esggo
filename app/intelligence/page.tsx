'use client';
import { useState } from 'react';
import { TrendingUp, AlertTriangle, BookOpen, Bookmark, ExternalLink, Filter, Search, BarChart2, Shield, Globe } from 'lucide-react';

const newsItems = [
  { id: 1, title: '金管會發布上市櫃公司永續報告書新規範，2025年全面適用', category: '法規動態', impact: 'high', date: '2025-05-10', source: '金管會', url: 'https://www.fsc.gov.tw', tags: ['GRI 2021', 'ISSB', '金管會'], summary: '金管會宣布修訂永續報告書指引，要求上市公司依 GRI 2021 及 ISSB S1/S2 雙軌揭露，並需第三方確信。' },
  { id: 2, title: 'CBAM 碳邊境調整機制正式生效，台灣出口商須準備碳足跡文件', category: '碳政策', impact: 'high', date: '2025-05-08', source: '歐盟執委會', url: 'https://taxation-customs.ec.europa.eu', tags: ['CBAM', '碳邊境', 'EU', '供應鏈'], summary: 'EU CBAM 第一階段對鋼鐵、鋁、水泥、電力、肥料及氫氣課徵碳關稅，台灣供應商須建立碳足跡追蹤機制。' },
  { id: 3, title: 'SBTi 正式採納 ISSB S2 氣候相關揭露標準', category: '國際標準', impact: 'medium', date: '2025-05-06', source: 'SBTi', url: 'https://sciencebasedtargets.org', tags: ['SBTi', 'ISSB S2', 'Scope 3'], summary: '科學基礎減碳倡議組織宣布與 ISSB S2 接軌，要求企業提供更嚴謹的 Scope 3 排放數據。' },
  { id: 4, title: 'ISSA 5000 永續確信標準發布，強化第三方查證要求', category: '確信標準', impact: 'medium', date: '2025-05-03', source: 'IAASB', url: 'https://www.iaasb.org', tags: ['ISSA 5000', 'ESG 確信', '第三方查證'], summary: '國際審計與確信準則委員會發布 ISSA 5000，為 ESG 資訊確信建立全球一致性框架。' },
  { id: 5, title: '台灣 2024 年企業 ESG 評比結果出爐，製造業表現顯著提升', category: '產業動態', impact: 'low', date: '2025-04-28', source: 'TAISE', url: 'https://www.taise.org.tw', tags: ['台灣', 'ESG 評比', 'TAISE', '製造業'], summary: '台灣永續能源研究基金會發布年度企業永續獎名單，製造業環境績效改善幅度最大。' },
];

const benchmarks = [
  { company: '台積電 (TSMC)', industry: '半導體', eScore: 92, sScore: 88, gScore: 94, overall: 91, certified: true },
  { company: '鴻海精密', industry: '電子製造', eScore: 78, sScore: 82, gScore: 85, overall: 82, certified: true },
  { company: '台達電子', industry: '電子零組件', eScore: 88, sScore: 79, gScore: 87, overall: 85, certified: false },
  { company: '中鋼公司', industry: '鋼鐵', eScore: 71, sScore: 84, gScore: 80, overall: 78, certified: false },
];

const riskAlerts = [
  { level: 'critical', title: '漂綠風險預警', desc: '偵測到報告中「致力於」等模糊承諾語句，建議改為具體量化目標', gri: 'GRI 2-22' },
  { level: 'high', title: 'Scope 3 數據缺漏', desc: '供應鏈碳排放 (範疇三) 尚未納入盤查，2025年強制揭露', gri: 'GRI 305-3' },
  { level: 'medium', title: '第三方確信未完成', desc: '建議在報告書發布前完成 ISSA 5000 確信程序', gri: 'ISSA 5000' },
  { level: 'low', title: 'DEI 數據揭露不足', desc: '多元平等包容指標揭露僅達 60%，建議補充性別薪酬比', gri: 'GRI 405-2' },
];

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('news');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const categories = ['全部', '法規動態', '碳政策', '國際標準', '確信標準', '產業動態'];

  const filtered = newsItems.filter(item => {
    const matchSearch = item.title.includes(searchTerm) || item.summary.includes(searchTerm);
    const matchCat = selectedCategory === '全部' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const stats = [
    { label: '情報總數', value: newsItems.length, icon: <BookOpen size={18} />, color: 'var(--berkeley-blue)' },
    { label: '高衝擊事件', value: newsItems.filter(n => n.impact === 'high').length, icon: <AlertTriangle size={18} />, color: '#ef4444' },
    { label: '風險警示', value: riskAlerts.length, icon: <Shield size={18} />, color: '#f59e0b' },
    { label: '已書籤', value: bookmarked.length, icon: <Bookmark size={18} />, color: '#22c55e' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">商情中心</h1>
          <p className="page-subtitle">Intelligence Hub · ESG 法規情報 · 產業標竿 · 風險預警</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: s.color }}>
              {s.icon}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label}</span>
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {[
          { key: 'news', label: '情報中心', icon: <Globe size={14} /> },
          { key: 'benchmark', label: '產業標竿', icon: <BarChart2 size={14} /> },
          { key: 'risk', label: '風險預警', icon: <AlertTriangle size={14} /> },
        ].map(tab => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'news' && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                className="form-input"
                placeholder="搜尋情報、法規、標準..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: 20,
                    border: selectedCategory === cat ? '2px solid var(--berkeley-blue)' : '1px solid var(--border-light)',
                    background: selectedCategory === cat ? 'var(--berkeley-blue)' : 'var(--bg-card)',
                    color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(item => (
              <div key={item.id} className="card" style={{ borderLeft: `4px solid ${item.impact === 'high' ? '#ef4444' : item.impact === 'medium' ? '#f59e0b' : '#22c55e'}` }}>
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${item.impact === 'high' ? 'badge-red' : item.impact === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                          {item.impact === 'high' ? '高衝擊' : item.impact === 'medium' ? '中等' : '低'}
                        </span>
                        <span className="badge badge-blue">{item.category}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.date}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>來源：{item.source}</span>
                      </div>
                      <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{item.summary}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {item.tags.map(tag => (
                          <span key={tag} style={{ padding: '0.2rem 0.6rem', background: 'var(--bg-secondary)', borderRadius: 12, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                      <button onClick={() => toggleBookmark(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: bookmarked.includes(item.id) ? '#FDB515' : 'var(--text-secondary)' }}>
                        <Bookmark size={18} fill={bookmarked.includes(item.id) ? '#FDB515' : 'none'} />
                      </button>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--berkeley-blue)' }}>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'benchmark' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">產業標竿企業 ESG 評分</h3>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>企業</th>
                    <th>產業</th>
                    <th>環境 (E)</th>
                    <th>社會 (S)</th>
                    <th>治理 (G)</th>
                    <th>綜合</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map(b => (
                    <tr key={b.company}>
                      <td style={{ fontWeight: 600 }}>
                        {b.company}
                        {b.certified && <span className="badge badge-green" style={{ marginLeft: 6 }}>認證</span>}
                      </td>
                      <td>{b.industry}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                            <div style={{ width: `${b.eScore}%`, height: '100%', background: '#22c55e', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.eScore}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                            <div style={{ width: `${b.sScore}%`, height: '100%', background: '#3b7ea1', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.sScore}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                            <div style={{ width: `${b.gScore}%`, height: '100%', background: '#FDB515', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.gScore}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--berkeley-blue)' }}>{b.overall}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {riskAlerts.map((alert, idx) => (
            <div key={idx} className="card" style={{ borderLeft: `4px solid ${alert.level === 'critical' ? '#7c3aed' : alert.level === 'high' ? '#ef4444' : alert.level === 'medium' ? '#f59e0b' : '#22c55e'}` }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <AlertTriangle size={20} color={alert.level === 'critical' ? '#7c3aed' : alert.level === 'high' ? '#ef4444' : alert.level === 'medium' ? '#f59e0b' : '#22c55e'} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className={`badge ${alert.level === 'critical' ? 'badge-red' : alert.level === 'high' ? 'badge-red' : alert.level === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {alert.level === 'critical' ? '嚴重' : alert.level === 'high' ? '高風險' : alert.level === 'medium' ? '中等' : '低'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#003262', fontWeight: 600 }}>{alert.gri}</span>
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{alert.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{alert.desc}</p>
                  </div>
                  <TrendingUp size={18} color="var(--berkeley-blue)" style={{ flexShrink: 0 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
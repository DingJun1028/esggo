'use client';
import { useState } from 'react';
import { Grid, List, Plus, Save } from 'lucide-react';

const initialTopics = [
  { id: 1, name: '溫室氣體排放', category: 'E', gri: 'GRI 305', impact: 4.5, concern: 4.8, status: 'critical' },
  { id: 2, name: '能源管理', category: 'E', gri: 'GRI 302', impact: 4.2, concern: 4.5, status: 'material' },
  { id: 3, name: '水資源管理', category: 'E', gri: 'GRI 303', impact: 3.8, concern: 4.0, status: 'material' },
  { id: 4, name: '廢棄物管理', category: 'E', gri: 'GRI 306', impact: 3.5, concern: 3.8, status: 'watchlist' },
  { id: 5, name: '員工健康安全', category: 'S', gri: 'GRI 403', impact: 4.7, concern: 4.9, status: 'critical' },
  { id: 6, name: '人才培育發展', category: 'S', gri: 'GRI 404', impact: 4.0, concern: 4.2, status: 'material' },
  { id: 7, name: '多元共融政策', category: 'S', gri: 'GRI 405', impact: 3.6, concern: 3.9, status: 'watchlist' },
  { id: 8, name: '供應鏈管理', category: 'S', gri: 'GRI 308', impact: 4.1, concern: 4.3, status: 'material' },
  { id: 9, name: '公司治理結構', category: 'G', gri: 'GRI 2-9', impact: 4.8, concern: 4.7, status: 'critical' },
  { id: 10, name: '反貪腐政策', category: 'G', gri: 'GRI 205', impact: 4.3, concern: 4.4, status: 'material' },
  { id: 11, name: '稅務透明度', category: 'G', gri: 'GRI 207', impact: 3.7, concern: 3.8, status: 'watchlist' },
  { id: 12, name: '資訊安全隱私', category: 'G', gri: 'GRI 418', impact: 4.0, concern: 4.2, status: 'material' },
];

export default function MaterialityPage() {
  const [topics, setTopics] = useState(initialTopics);
  const [viewMode, setViewMode] = useState<'matrix' | 'table'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);

  const filtered = selectedCategory === 'ALL' ? topics : topics.filter(t => t.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'material': return '#003262';
      case 'watchlist': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical': return '核心重大';
      case 'material': return '重大議題';
      case 'watchlist': return '觀察關注';
      default: return status;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">重大性矩陣</h1>
          <p className="page-subtitle">Materiality Matrix · GRI 3-1/3-2 · 雙重重大性評估</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className={`btn ${viewMode === 'matrix' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('matrix')}>
            <Grid size={14} style={{ display: 'inline', marginRight: 4 }} />矩陣圖
          </button>
          <button className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('table')}>
            <List size={14} style={{ display: 'inline', marginRight: 4 }} />列表
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'E', 'S', 'G'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.375rem 1rem',
              borderRadius: 20,
              border: selectedCategory === cat ? '2px solid var(--berkeley-blue)' : '1px solid var(--border-light)',
              background: selectedCategory === cat ? 'var(--berkeley-blue)' : 'var(--bg-card)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {cat === 'ALL' ? '全部' : cat === 'E' ? '環境 (E)' : cat === 'S' ? '社會 (S)' : '治理 (G)'}
          </button>
        ))}
      </div>

      {viewMode === 'matrix' ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">雙重重大性矩陣</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>X 軸：衝擊重大性 | Y 軸：利害關係人關注度</p>
          </div>
          <div className="card-body">
            <div style={{ position: 'relative', height: 400, background: 'linear-gradient(to top right, #fafafa, #f0f4ff)', border: '1px solid var(--border-light)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '10%', left: '50%', right: 0, bottom: 0, background: 'rgba(0, 50, 98, 0.04)', borderRadius: '0 0 0 0' }} />
              <div style={{ position: 'absolute', top: 8, right: 12, fontSize: '0.75rem', color: '#003262', fontWeight: 600 }}>核心重大區</div>
              <div style={{ position: 'absolute', bottom: 8, left: 12, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>觀察關注區</div>
              <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>利害關係人關注度 →</div>
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>衝擊重大性 →</div>

              {filtered.map(topic => {
                const x = ((topic.impact - 3) / 2) * 80 + 10;
                const y = 90 - (((topic.concern - 3) / 2) * 80);
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
                    style={{
                      position: 'absolute',
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: getStatusColor(topic.status),
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      border: selectedTopic?.id === topic.id ? '3px solid #000' : '2px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      zIndex: 2,
                      transition: 'transform 0.15s',
                    }}
                    title={topic.name}
                  >
                    {topic.id}
                  </div>
                );
              })}
            </div>

            {selectedTopic && (
              <div className="card" style={{ marginTop: '1rem', borderLeft: `4px solid ${getStatusColor(selectedTopic.status)}` }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className={`badge ${selectedTopic.category === 'E' ? 'badge-green' : selectedTopic.category === 'S' ? 'badge-blue' : 'badge-yellow'}`}>{selectedTopic.category}</span>
                        <span style={{ fontSize: '0.75rem', color: '#003262', fontWeight: 600 }}>{selectedTopic.gri}</span>
                        <span className="badge badge-red">{getStatusLabel(selectedTopic.status)}</span>
                      </div>
                      <h4 style={{ fontWeight: 600, margin: '0 0 0.5rem' }}>{selectedTopic.name}</h4>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>衝擊重大性：<strong>{selectedTopic.impact}</strong></span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>利害關係人關注度：<strong>{selectedTopic.concern}</strong></span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedTopic(null)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>關閉</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">重大議題列表</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>議題名稱</th>
                    <th>類別</th>
                    <th>GRI 對應</th>
                    <th>衝擊重大性</th>
                    <th>利害關係人關注度</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(topic => (
                    <tr key={topic.id}>
                      <td>{topic.id}</td>
                      <td style={{ fontWeight: 600 }}>{topic.name}</td>
                      <td><span className={`badge ${topic.category === 'E' ? 'badge-green' : topic.category === 'S' ? 'badge-blue' : 'badge-yellow'}`}>{topic.category}</span></td>
                      <td style={{ fontSize: '0.8rem', color: '#003262', fontWeight: 600 }}>{topic.gri}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 60, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                            <div style={{ width: `${(topic.impact / 5) * 100}%`, height: '100%', background: 'var(--berkeley-blue)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{topic.impact}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 60, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                            <div style={{ width: `${(topic.concern / 5) * 100}%`, height: '100%', background: '#3b7ea1', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{topic.concern}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: getStatusColor(topic.status) }}>{getStatusLabel(topic.status)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import ClientLayout from '../ClientLayout';
import { Building2 } from 'lucide-react';

const metrics = [
  { category: 'board', metric: '董事會人數', value: 9, unit: '人', gri: 'GRI 2-9', verified: true },
  { category: 'board', metric: '獨立董事比例', value: 33.3, unit: '%', gri: 'GRI 2-9', verified: true },
  { category: 'board', metric: '女性董事比例', value: 22.2, unit: '%', gri: 'GRI 2-10', verified: true },
  { category: 'ethics', metric: '貪腐事件數', value: 0, unit: '件', gri: 'GRI 205-3', verified: true },
  { category: 'ethics', metric: '反貪腐培訓覆蓋率', value: 100, unit: '%', gri: 'GRI 205-2', verified: true },
  { category: 'tax', metric: '實際稅率', value: 18.5, unit: '%', gri: 'GRI 207-1', verified: false },
  { category: 'tax', metric: '稅務透明度指數', value: 87, unit: '分', gri: 'GRI 207-4', verified: false },
  { category: 'risk', metric: 'ESG 風險識別數', value: 23, unit: '項', gri: 'GRI 2-12', verified: true },
];

const TAB_DATA: Record<string, { label: string; gri: string }> = {
  board: { label: '董事會結構', gri: 'GRI 2-9/2-10' },
  ethics: { label: '商業道德', gri: 'GRI 205' },
  tax: { label: '稅務透明', gri: 'GRI 207' },
  risk: { label: '風險管理', gri: 'GRI 2-12' },
};

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState('board');
  const tabMetrics = metrics.filter(m => m.category === activeTab);

  return (
    <ClientLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">公司治理 Governance</h1>
          <p className="page-subtitle">G-Hub · GRI 2, 205-207 · 董事會 · 誠信 · 稅務 · 風險</p>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {Object.entries(TAB_DATA).map(([key, val]) => {
            const catMetrics = metrics.filter(m => m.category === key);
            return (
              <div key={key} className="kpi-card" onClick={() => setActiveTab(key)} style={{ cursor: 'pointer', borderColor: activeTab === key ? 'var(--berkeley-blue)' : 'var(--gray-200)' }}>
                <div className="kpi-value">{catMetrics.length}</div>
                <div className="kpi-label">{val.label}</div>
              </div>
            );
          })}
        </div>

        <div className="tabs" style={{ marginBottom: 20 }}>
          {Object.entries(TAB_DATA).map(([key, val]) => (
            <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
              {val.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{TAB_DATA[activeTab].label}</strong>
              <span className="badge badge-blue" style={{ marginLeft: 8 }}>{TAB_DATA[activeTab].gri}</span>
            </div>
          </div>
          <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>指標</th>
                  <th>數值</th>
                  <th>單位</th>
                  <th>GRI 標準</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                {tabMetrics.map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{m.metric}</td>
                    <td style={{ fontWeight: 700, color: 'var(--berkeley-blue)' }}>{m.value}</td>
                    <td><span className="badge badge-gray">{m.unit}</span></td>
                    <td><span className="badge badge-blue">{m.gri}</span></td>
                    <td><span className={`badge ${m.verified ? 'badge-green' : 'badge-gold'}`}>{m.verified ? '✓ 已驗證' : '待驗證'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
'use client';

import { useState } from 'react';
import ClientLayout from '../ClientLayout';
import { Users, Plus, Edit2 } from 'lucide-react';

const metrics = [
  { category: 'workforce', metric: '全職員工人數', value: 1250, unit: '人', gri: 'GRI 2-7', verified: true },
  { category: 'workforce', metric: '女性員工比例', value: 38.5, unit: '%', gri: 'GRI 2-7', verified: true },
  { category: 'safety', metric: '失能傷害頻率 (FR)', value: 0.45, unit: '次/百萬工時', gri: 'GRI 403-2', verified: true },
  { category: 'safety', metric: '職業安全訓練覆蓋率', value: 96, unit: '%', gri: 'GRI 403-5', verified: false },
  { category: 'training', metric: '平均訓練時數', value: 28.5, unit: '小時/人', gri: 'GRI 404-1', verified: true },
  { category: 'training', metric: '績效考核覆蓋率', value: 100, unit: '%', gri: 'GRI 404-3', verified: true },
  { category: 'supply', metric: '在地採購比例', value: 65, unit: '%', gri: 'GRI 204-1', verified: false },
  { category: 'supply', metric: '供應商 ESG 評核完成率', value: 78, unit: '%', gri: 'GRI 308-1', verified: false },
];

const TAB_DATA: Record<string, { label: string; gri: string }> = {
  workforce: { label: '員工結構', gri: 'GRI 2-7, 401-405' },
  safety: { label: '職業安全衛生', gri: 'GRI 403' },
  training: { label: '人才培育', gri: 'GRI 404' },
  supply: { label: '供應鏈管理', gri: 'GRI 308, 414' },
};

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('workforce');
  const tabMetrics = metrics.filter(m => m.category === activeTab);

  return (
    <ClientLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">社會影響 Social Impact</h1>
          <p className="page-subtitle">S-Hub · GRI 401-414 · 員工 · 安全 · 培訓 · 供應鏈</p>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {Object.entries(TAB_DATA).map(([key, val]) => {
            const catMetrics = metrics.filter(m => m.category === key);
            const verified = catMetrics.filter(m => m.verified).length;
            return (
              <div key={key} className="kpi-card" onClick={() => setActiveTab(key)} style={{ cursor: 'pointer', borderColor: activeTab === key ? 'var(--berkeley-blue)' : 'var(--gray-200)' }}>
                <div className="kpi-value">{catMetrics.length}</div>
                <div className="kpi-label">{val.label}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4 }}>
                  {verified}/{catMetrics.length} 已驗證
                </div>
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
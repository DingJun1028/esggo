'use client';
import React, { useState } from 'react';
import { Layers, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Shield, Globe, BarChart2 } from 'lucide-react';

const tcfdPillars = [
  { id: 'governance', label: '治理', desc: '董事會與管理層對氣候相關風險的監督機制', completion: 88, gri: 'GRI 2-9', color: '#7c3aed' },
  { id: 'strategy', label: '策略', desc: '氣候風險與機會對業務、策略及財務的影響', completion: 72, gri: 'TCFD S', color: '#2563eb' },
  { id: 'risk', label: '風險管理', desc: '識別、評估、管理氣候相關風險的流程', completion: 65, gri: 'GRI 2-25', color: '#d97706' },
  { id: 'metrics', label: '指標與目標', desc: '評估氣候相關風險機會的指標及目標', completion: 58, gri: 'GRI 305', color: '#059669' },
];

const esgRoi = [
  { initiative: '太陽能屋頂安裝', investment: 8500, annualSaving: 2200, payback: 3.9, category: 'E', co2Reduction: 450, status: 'active' },
  { initiative: 'LED 照明全面換裝', investment: 1200, annualSaving: 380, payback: 3.2, category: 'E', co2Reduction: 85, status: 'active' },
  { initiative: '廢熱回收系統', investment: 3600, annualSaving: 920, payback: 3.9, category: 'E', co2Reduction: 210, status: 'planned' },
  { initiative: 'ESG 培訓計畫', investment: 450, annualSaving: 680, payback: 0.7, category: 'S', co2Reduction: 0, status: 'active' },
  { initiative: '供應商 ESG 稽核系統', investment: 280, annualSaving: 520, payback: 0.5, category: 'S', co2Reduction: 0, status: 'active' },
  { initiative: '數位 ESG 報告平台', investment: 360, annualSaving: 890, payback: 0.4, category: 'G', co2Reduction: 15, status: 'active' },
];

const carbonScenarios = [
  { scenario: '1.5°C 情境', carbonPrice2030: 150, financialRisk: '低', ebitdaImpact: -2.8, color: '#059669' },
  { scenario: '2°C 情境', carbonPrice2030: 80, financialRisk: '中', ebitdaImpact: -5.2, color: '#d97706' },
  { scenario: '4°C 情境 (不作為)', carbonPrice2030: 20, financialRisk: '高', ebitdaImpact: -14.6, color: '#dc2626' },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'tcfd' | 'roi' | 'carbon'>('tcfd');

  const totalInvestment = esgRoi.reduce((s, r) => s + r.investment, 0);
  const totalSaving = esgRoi.reduce((s, r) => s + r.annualSaving, 0);
  const avgPayback = (esgRoi.reduce((s, r) => s + r.payback, 0) / esgRoi.length).toFixed(1);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} color="#fff" />
              </div>
              <h1 className="page-title">永續財務中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Finance Hub</span>
              <span className="gri-chip">TCFD</span>
              <span className="gri-chip">GRI 201</span>
              <span className="badge badge-gold">ESG ROI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value text-success">NT${(totalSaving / 10).toFixed(0)}萬</div><div className="stat-label">年度 ESG 節省</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>NT${(totalInvestment / 10).toFixed(0)}萬</div><div className="stat-label">ESG 投資總額</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{avgPayback}年</div><div className="stat-label">平均回收期</div></div>
        <div className="stat-card"><div className="stat-value text-danger">-5.2%</div><div className="stat-label">EBITDA 碳風險</div></div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'tcfd' ? 'active' : ''}`} onClick={() => setActiveTab('tcfd')}><Shield size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />TCFD 揭露</button>
        <button className={`tab-btn ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}><TrendingUp size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />ESG 投資回報</button>
        <button className={`tab-btn ${activeTab === 'carbon' ? 'active' : ''}`} onClick={() => setActiveTab('carbon')}><Globe size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'text-bottom' }} />碳風險情境</button>
      </div>

      {activeTab === 'tcfd' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {tcfdPillars.map(p => (
            <div key={p.id} className="card" style={{ padding: 24, borderTop: `3px solid ${p.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.label}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: p.color }}>{p.completion}%</div>
                  <span className="gri-chip">{p.gri}</span>
                </div>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${p.completion}%`, background: p.color }} />
              </div>
              <div className="alert alert-info" style={{ marginTop: 12, fontSize: 12 }}>
                <BarChart2 size={12} /><span>{p.completion >= 80 ? '揭露完整，達到國際最佳實踐水準' : p.completion >= 60 ? '基礎揭露完成，建議補充情境分析' : '需加強揭露深度，建議諮詢 TCFD 專家'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roi' && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ESG 投資項目</th><th>分類</th><th>投資金額 (萬元)</th><th>年度節省 (萬元)</th><th>回收期 (年)</th><th>CO₂ 減少 (tCO₂e)</th><th>狀態</th></tr>
              </thead>
              <tbody>
                {esgRoi.map((r, i) => {
                  const catColors: Record<string, string> = { E: '#059669', S: '#2563eb', G: '#7c3aed' };
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 500, fontSize: 13 }}>{r.initiative}</td>
                      <td><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 5, background: `${catColors[r.category]}20`, color: catColors[r.category], fontWeight: 700, fontSize: 11 }}>{r.category}</span></td>
                      <td><span style={{ fontWeight: 700, color: 'var(--danger)' }}>NT${(r.investment / 10).toFixed(0)}萬</span></td>
                      <td><span style={{ fontWeight: 700, color: 'var(--success)' }}>NT${(r.annualSaving / 10).toFixed(0)}萬</span></td>
                      <td>
                        <span style={{ fontWeight: 600, color: r.payback <= 1 ? 'var(--success)' : r.payback <= 4 ? 'var(--warning)' : 'var(--danger)' }}>
                          {r.payback}年
                        </span>
                      </td>
                      <td><span style={{ fontWeight: 600, color: '#059669' }}>{r.co2Reduction > 0 ? `-${r.co2Reduction}` : '—'}</span></td>
                      <td><span className={`badge ${r.status === 'active' ? 'badge-green' : 'badge-gold'}`}>{r.status === 'active' ? '進行中' : '規劃中'}</span></td>
                    </tr>
                  );
                })}
                <tr style={{ background: 'var(--bg-tertiary)', fontWeight: 700 }}>
                  <td>合計</td><td>—</td>
                  <td style={{ color: 'var(--danger)' }}>NT${(totalInvestment / 10).toFixed(0)}萬</td>
                  <td style={{ color: 'var(--success)' }}>NT${(totalSaving / 10).toFixed(0)}萬</td>
                  <td>{avgPayback}年</td>
                  <td style={{ color: '#059669' }}>{esgRoi.reduce((s, r) => s + r.co2Reduction, 0)} tCO₂e</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'carbon' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {carbonScenarios.map((s, i) => (
            <div key={i} className="card" style={{ padding: 24, borderTop: `4px solid ${s.color}` }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.scenario}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>2030 年碳價預測</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>USD {s.carbonPrice2030}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ tCO₂e</div>
                </div>
                <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>財務風險等級</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.financialRisk}</div>
                </div>
                <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>EBITDA 影響</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.ebitdaImpact < -10 ? 'var(--danger)' : s.ebitdaImpact < -5 ? 'var(--warning)' : 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s.ebitdaImpact < 0 ? <TrendingDown size={22} /> : <TrendingUp size={22} />}{s.ebitdaImpact}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
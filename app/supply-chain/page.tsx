'use client';
import React, { useState } from 'react';
import { Globe, Plus, Search, Filter, Star, AlertTriangle, CheckCircle, TrendingUp, Eye, X } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  country: string;
  industry: string;
  tier: number;
  esgScore: number;
  environmental: number;
  social: number;
  governance: number;
  risk: 'low' | 'medium' | 'high';
  commitment: boolean;
  lastAudit: string;
  issues: string[];
}

const initialSuppliers: Supplier[] = [
  { id: '1', name: '台灣精密零件股份有限公司', country: '台灣', industry: '精密製造', tier: 1, esgScore: 82, environmental: 78, social: 85, governance: 88, risk: 'low', commitment: true, lastAudit: '2024-09-15', issues: [] },
  { id: '2', name: '上海材料供應有限公司', country: '中國', industry: '原材料', tier: 1, esgScore: 61, environmental: 52, social: 68, governance: 64, risk: 'medium', commitment: true, lastAudit: '2024-07-20', issues: ['廢水處理不合規', '員工工時超時'] },
  { id: '3', name: 'Green Tech Components LLC', country: '美國', industry: '電子元件', tier: 1, esgScore: 91, environmental: 94, social: 89, governance: 92, risk: 'low', commitment: true, lastAudit: '2024-11-01', issues: [] },
  { id: '4', name: '越南成衣加工廠', country: '越南', industry: '紡織加工', tier: 2, esgScore: 45, environmental: 42, social: 38, governance: 58, risk: 'high', commitment: false, lastAudit: '2024-03-10', issues: ['童工風險', '無安全設備', '未簽署永續承諾書'] },
  { id: '5', name: '韓國半導體材料株式會社', country: '韓國', industry: '半導體', tier: 1, esgScore: 88, environmental: 90, social: 85, governance: 90, risk: 'low', commitment: true, lastAudit: '2024-10-22', issues: [] },
  { id: '6', name: '印度軟體外包服務', country: '印度', industry: 'IT服務', tier: 2, esgScore: 72, environmental: 65, social: 76, governance: 78, risk: 'medium', commitment: true, lastAudit: '2024-08-05', issues: ['多元包容政策待改善'] },
];

const riskConfig = {
  low:    { color: 'var(--success)',  label: '低風險',  bg: 'var(--success-light)' },
  medium: { color: 'var(--warning)',  label: '中風險',  bg: 'var(--warning-light)' },
  high:   { color: 'var(--danger)',   label: '高風險',  bg: 'var(--danger-light)' },
};

export default function SupplyChainPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selected, setSelected] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(s =>
    (riskFilter === 'all' || s.risk === riskFilter) &&
    (tierFilter === 'all' || s.tier === parseInt(tierFilter)) &&
    (s.name.includes(search) || s.country.includes(search) || s.industry.includes(search))
  );

  const avgScore = Math.round(suppliers.reduce((sum, s) => sum + s.esgScore, 0) / suppliers.length);
  const highRisk = suppliers.filter(s => s.risk === 'high').length;
  const commitmentRate = Math.round((suppliers.filter(s => s.commitment).length / suppliers.length) * 100);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} color="#fff" />
              </div>
              <h1 className="page-title">供應鏈透明中心</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Supply Chain</span>
              <span className="gri-chip">GRI 204</span>
              <span className="gri-chip">GRI 308</span>
              <span className="gri-chip">GRI 414</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm"><Plus size={14} />新增供應商</button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{suppliers.length}</div><div className="stat-label">供應商總數</div></div>
        <div className="stat-card"><div className="stat-value text-success">{avgScore}</div><div className="stat-label">平均 ESG 評分</div></div>
        <div className="stat-card"><div className="stat-value text-danger">{highRisk}</div><div className="stat-label">高風險供應商</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{commitmentRate}%</div><div className="stat-label">永續承諾書簽署率</div></div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋供應商名稱、國家、產業..." className="form-input" style={{ paddingLeft: 36 }} />
        </div>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="form-select" style={{ width: 120 }}>
          <option value="all">全部風險</option>
          <option value="low">低風險</option>
          <option value="medium">中風險</option>
          <option value="high">高風險</option>
        </select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="form-select" style={{ width: 110 }}>
          <option value="all">全部層級</option>
          <option value="1">第一層</option>
          <option value="2">第二層</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>供應商名稱</th>
                <th>國家 / 產業</th>
                <th>層級</th>
                <th>ESG 評分</th>
                <th>E / S / G</th>
                <th>風險等級</th>
                <th>承諾書</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const rc = riskConfig[s.risk];
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>最近稽核：{s.lastAudit}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{s.country}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.industry}</div>
                    </td>
                    <td><span className={`badge ${s.tier === 1 ? 'badge-blue' : 'badge-gray'}`}>T{s.tier}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${s.esgScore}%`, background: s.esgScore >= 80 ? 'var(--success)' : s.esgScore >= 60 ? 'var(--california-gold)' : 'var(--danger)' }} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: s.esgScore >= 80 ? 'var(--success)' : s.esgScore >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{s.esgScore}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, display: 'flex', gap: 6 }}>
                        <span style={{ color: '#059669' }}>E:{s.environmental}</span>
                        <span style={{ color: '#2563eb' }}>S:{s.social}</span>
                        <span style={{ color: '#7c3aed' }}>G:{s.governance}</span>
                      </div>
                    </td>
                    <td><span className="badge" style={{ background: rc.bg, color: rc.color }}>{rc.label}</span></td>
                    <td>{s.commitment ? <CheckCircle size={16} color="var(--success)" /> : <AlertTriangle size={16} color="var(--warning)" />}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => setSelected(s)}><Eye size={13} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18 }}>{selected.name}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-3" style={{ marginBottom: 20 }}>
                {[['環境', selected.environmental, '#059669'], ['社會', selected.social, '#2563eb'], ['治理', selected.governance, '#7c3aed']].map(([l, v, c]) => (
                  <div key={l as string} style={{ textAlign: 'center', padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: c as string }}>{v}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="grid-2">
                <div><div className="form-label">國家</div><div>{selected.country}</div></div>
                <div><div className="form-label">產業</div><div>{selected.industry}</div></div>
                <div><div className="form-label">層級</div><div>第 {selected.tier} 層供應商</div></div>
                <div><div className="form-label">最近稽核</div><div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{selected.lastAudit}</div></div>
              </div>
              {selected.issues.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="form-label">待改善事項</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {selected.issues.map((issue, i) => (
                      <div key={i} className="alert alert-danger" style={{ fontSize: 13 }}>
                        <AlertTriangle size={13} />{issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>關閉</button>
              <button className="btn btn-primary"><TrendingUp size={14} />排程稽核</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
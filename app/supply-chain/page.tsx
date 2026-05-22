'use client';
import { useState, useEffect } from 'react';
import { Truck, Search, Filter, AlertTriangle, CheckCircle, Star, ExternalLink, Plus, Download } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  country: string;
  industry: string;
  esgScore: number;
  envScore: number;
  socialScore: number;
  govScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  certified: boolean;
  localProcurement: boolean;
  pledgeSigned: boolean;
  lastAudit: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: '台積電供應鏈 TSM-A', country: '台灣', industry: '半導體', esgScore: 88, envScore: 90, socialScore: 85, govScore: 89, riskLevel: 'low', certified: true, localProcurement: true, pledgeSigned: true, lastAudit: '2024-03-15' },
  { id: '2', name: '鴻海精密工業', country: '台灣', industry: '電子製造', esgScore: 76, envScore: 72, socialScore: 78, govScore: 78, riskLevel: 'low', certified: true, localProcurement: true, pledgeSigned: true, lastAudit: '2024-02-20' },
  { id: '3', name: 'ABC 原料供應商', country: '中國', industry: '化工原料', esgScore: 54, envScore: 48, socialScore: 56, govScore: 58, riskLevel: 'high', certified: false, localProcurement: false, pledgeSigned: false, lastAudit: '2023-11-10' },
  { id: '4', name: 'EcoTech Materials', country: '德國', industry: '綠色材料', esgScore: 92, envScore: 95, socialScore: 90, govScore: 91, riskLevel: 'low', certified: true, localProcurement: false, pledgeSigned: true, lastAudit: '2024-04-01' },
  { id: '5', name: '全球物流夥伴 GLP', country: '新加坡', industry: '物流', esgScore: 67, envScore: 63, socialScore: 70, govScore: 68, riskLevel: 'medium', certified: false, localProcurement: false, pledgeSigned: true, lastAudit: '2023-12-20' },
];

export default function SupplyChainPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selected, setSelected] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.country.includes(search) || s.industry.includes(search);
    const matchRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const riskColor = (r: string) => r === 'low' ? '#22c55e' : r === 'medium' ? '#f59e0b' : '#ef4444';
  const riskLabel = (r: string) => r === 'low' ? '低風險' : r === 'medium' ? '中等' : '高風險';

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003262', margin: 0 }}>供應鏈透明 Supply Chain</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>GRI 308/414 · 供應商 ESG 評分 · 風險分級管理</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#003262', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          <Plus size={14} /> 新增供應商
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '供應商總數', value: suppliers.length.toString(), color: '#003262' },
          { label: '高風險供應商', value: suppliers.filter(s => s.riskLevel === 'high').length.toString(), color: '#ef4444' },
          { label: '已簽署永續承諾', value: `${suppliers.filter(s => s.pledgeSigned).length}/${suppliers.length}`, color: '#22c55e' },
          { label: '平均 ESG 分數', value: `${Math.round(suppliers.reduce((a, s) => a + s.esgScore, 0) / suppliers.length)}`, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋供應商名稱、國家、產業..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {['all', 'low', 'medium', 'high'].map(r => (
          <button key={r} onClick={() => setRiskFilter(r)}
            style={{ padding: '10px 16px', border: '1px solid', borderColor: riskFilter === r ? '#003262' : '#e2e8f0', borderRadius: '8px', background: riskFilter === r ? '#003262' : '#fff', color: riskFilter === r ? '#fff' : '#64748b', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
            {r === 'all' ? '全部' : riskLabel(r)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              {['供應商名稱', '國家/地區', '產業', 'ESG 評分', '風險等級', '永續承諾', '操作'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '700', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelected(s)}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {s.certified && <Star size={12} color="#f59e0b" fill="#f59e0b" />}
                    {s.name}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{s.country}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{s.industry}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.esgScore}%`, height: '100%', background: s.esgScore >= 80 ? '#22c55e' : s.esgScore >= 60 ? '#f59e0b' : '#ef4444', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{s.esgScore}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: `${riskColor(s.riskLevel)}15`, color: riskColor(s.riskLevel), fontWeight: '700' }}>{riskLabel(s.riskLevel)}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {s.pledgeSigned ? <CheckCircle size={16} color="#22c55e" /> : <AlertTriangle size={16} color="#f59e0b" />}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ fontSize: '11px', padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: '#fff', color: '#64748b' }}>查看詳情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003262', marginBottom: '20px' }}>{selected.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: '環境評分 (E)', value: selected.envScore, color: '#22c55e' },
                { label: '社會評分 (S)', value: selected.socialScore, color: '#3b7ea1' },
                { label: '治理評分 (G)', value: selected.govScore, color: '#8b5cf6' },
                { label: '綜合 ESG', value: selected.esgScore, color: '#003262' },
              ].map((m, i) => (
                <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{m.label}</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {selected.certified && <span style={{ fontSize: '11px', padding: '4px 10px', background: '#fef3c7', color: '#92400e', borderRadius: '20px', fontWeight: '600' }}>✓ 認證供應商</span>}
              {selected.pledgeSigned && <span style={{ fontSize: '11px', padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: '600' }}>✓ 已簽永續承諾</span>}
              {selected.localProcurement && <span style={{ fontSize: '11px', padding: '4px 10px', background: '#dbeafe', color: '#1e40af', borderRadius: '20px', fontWeight: '600' }}>✓ 在地採購</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>最後稽核日期：{selected.lastAudit}</div>
            <button onClick={() => setSelected(null)} style={{ width: '100%', padding: '12px', background: '#003262', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>關閉</button>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import {
  Star, Hash, Shield, CheckCircle, AlertTriangle, Clock,
  Plus, Search, Filter, Download, Eye, Lock, Unlock,
  FileText, Zap, Database, Globe, ChevronDown, X,
  Activity, BarChart3, Leaf
} from 'lucide-react';

interface OmniRecord {
  id: string;
  uuid: string;
  version: string;
  timestamp: string;
  hashLock: string;
  formula: string;
  isoStandard: string;
  griReference: string;
  sourceOrigin: string;
  status: 'sealed' | 'verified' | 'pending' | 'revoked';
  category: 'E' | 'S' | 'G' | 'System';
  evidence: Record<string, unknown>;
  t5Tags: string[];
}

const MOCK_RECORDS: OmniRecord[] = [
  {
    id: '1',
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    version: '1.0.0',
    timestamp: '2026-05-20T09:42:00Z',
    hashLock: 'sha256:a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    formula: '範疇一排放量 = Σ(活動數據 × 排放係數)',
    isoStandard: 'ISO 14064-1:2018',
    griReference: 'GRI 305-1',
    sourceOrigin: 'env_module/ghg_scope1',
    status: 'verified',
    category: 'E',
    evidence: { value: 1250, unit: 'tCO₂e', year: 2025 },
    t5Tags: ['T1', 'T2', 'T4', 'T5'],
  },
  {
    id: '2',
    uuid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    version: '1.0.0',
    timestamp: '2026-05-20T08:15:00Z',
    hashLock: 'sha256:b2c3d4e5f6a78901bcdef12345678901bcdef12345678901bcdef1234567890a',
    formula: '範疇二排放量 = 用電度數(kWh) × 電力排放係數',
    isoStandard: 'ISO 14064-1:2018',
    griReference: 'GRI 305-2',
    sourceOrigin: 'env_module/ghg_scope2',
    status: 'verified',
    category: 'E',
    evidence: { value: 890, unit: 'tCO₂e', year: 2025 },
    t5Tags: ['T1', 'T4', 'T5'],
  },
  {
    id: '3',
    uuid: 'c3d4e5f6-a7b8-9012-cdef-012345678902',
    version: '1.0.0',
    timestamp: '2026-05-19T14:30:00Z',
    hashLock: 'sha256:c3d4e5f6a7b89012cdef012345678902cdef012345678902cdef01234567890b',
    formula: '員工離職率 = 離職人數 / 期初員工數 × 100%',
    isoStandard: 'GRI 2021',
    griReference: 'GRI 401-1',
    sourceOrigin: 'social_module/employee_turnover',
    status: 'sealed',
    category: 'S',
    evidence: { value: 8.5, unit: '%', year: 2025 },
    t5Tags: ['T1', 'T3', 'T5'],
  },
  {
    id: '4',
    uuid: 'd4e5f6a7-b8c9-0123-def0-123456789003',
    version: '1.0.0',
    timestamp: '2026-05-19T11:00:00Z',
    hashLock: 'sha256:d4e5f6a7b8c90123def0123456789003def0123456789003def0123456789003',
    formula: '獨立董事比例 = 獨立董事人數 / 董事會總人數 × 100%',
    isoStandard: 'GRI 2021',
    griReference: 'GRI 2-9',
    sourceOrigin: 'governance_module/board_composition',
    status: 'pending',
    category: 'G',
    evidence: { value: 33.3, unit: '%', year: 2025 },
    t5Tags: ['T1'],
  },
  {
    id: '5',
    uuid: 'e5f6a7b8-c9d0-1234-ef01-234567890004',
    version: '2.0.0',
    timestamp: '2026-05-18T09:00:00Z',
    hashLock: 'sha256:e5f6a7b8c9d01234ef01234567890004ef01234567890004ef01234567890004',
    formula: 'GRI 合規率 = 已揭露指標 / 應揭露指標 × 100%',
    isoStandard: 'GRI 2021',
    griReference: 'GRI 全套',
    sourceOrigin: 'system/compliance_engine',
    status: 'verified',
    category: 'System',
    evidence: { value: 78, unit: '%', year: 2025 },
    t5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
  },
];

const STATUS_CFG = {
  verified: { label: '已驗算', color: '#16a34a', bg: '#dcfce7' },
  sealed:   { label: '已封印', color: '#003262', bg: '#dbeafe' },
  pending:  { label: '待驗算', color: '#d97706', bg: '#fef3c7' },
  revoked:  { label: '已撤銷', color: '#dc2626', bg: '#fef2f2' },
};

const CAT_CFG = {
  E:      { label: 'E 環境', color: '#16a34a', bg: '#dcfce7' },
  S:      { label: 'S 社會', color: '#7c3aed', bg: '#ede9fe' },
  G:      { label: 'G 治理', color: '#d97706', bg: '#fef3c7' },
  System: { label: 'System', color: '#003262', bg: '#dbeafe' },
};

export default function VaultOmniPage() {
  const [records, setRecords] = useState<OmniRecord[]>(MOCK_RECORDS);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<OmniRecord | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  const filtered = records.filter(r => {
    if (catFilter !== 'all' && r.category !== catFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.griReference.toLowerCase().includes(q) ||
        r.uuid.toLowerCase().includes(q) ||
        r.formula.toLowerCase().includes(q) ||
        r.isoStandard.toLowerCase().includes(q);
    }
    return true;
  });

  const handleVerify = async (id: string) => {
    setVerifying(id);
    await new Promise(r => setTimeout(r, 1800));
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' as const, t5Tags: [...new Set([...r.t5Tags, 'T2', 'T4', 'T5'])] } : r));
    setVerifying(null);
  };

  const stats = {
    total: records.length,
    verified: records.filter(r => r.status === 'verified').length,
    sealed: records.filter(r => r.status === 'sealed').length,
    pending: records.filter(r => r.status === 'pending').length,
    fullT5: records.filter(r => r.t5Tags.length === 5).length,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003262 0%, #1a4d7a 60%, #3b7ea1 100%)', borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(253,181,21,0.08)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} color="#FDB515" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'white', lineHeight: 1 }}>萬能聖碑 vault_omni_core</h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '5px' }}>
              不可篡改帳本 · SHA-256 Hash Lock · 5T 誠信協議 · ZKP 零知識驗算
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '20px' }}>
          {[
            { label: '總記錄數', value: stats.total, color: 'white' },
            { label: '已驗算', value: stats.verified, color: '#86efac' },
            { label: '已封印', value: stats.sealed, color: '#93c5fd' },
            { label: '待驗算', value: stats.pending, color: '#fde68a' },
            { label: '5T 完整', value: stats.fullT5, color: '#FDB515' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋 GRI 代碼、UUID、公式…" style={{ width: '100%', paddingLeft: '32px', padding: '9px 12px 9px 32px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'E', 'S', 'G', 'System'].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid', borderColor: catFilter === c ? '#003262' : '#e5e7eb', background: catFilter === c ? '#003262' : 'white', color: catFilter === c ? 'white' : '#374151', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {c === 'all' ? '全部' : CAT_CFG[c as keyof typeof CAT_CFG]?.label ?? c}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none', background: 'white' }}>
          <option value="all">全部狀態</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Records Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #e5e7eb' }}>
              {['UUID', 'GRI 指標', '類別', '狀態', '5T 標籤', 'Hash Lock', '時間', '操作'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec, i) => {
              const stCfg = STATUS_CFG[rec.status];
              const catCfg = CAT_CFG[rec.category];
              const isVerifying = verifying === rec.id;
              return (
                <tr key={rec.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <code style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'monospace' }}>
                      {rec.uuid.slice(0, 8)}…
                    </code>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#003262' }}>{rec.griReference}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>{rec.isoStandard}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700, background: catCfg.bg, color: catCfg.color }}>{catCfg.label}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: stCfg.bg, color: stCfg.color }}>
                      {rec.status === 'verified' && <CheckCircle size={11} />}
                      {rec.status === 'sealed' && <Lock size={11} />}
                      {rec.status === 'pending' && <Clock size={11} />}
                      {stCfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                      {['T1','T2','T3','T4','T5'].map(t => (
                        <span key={t} style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, background: rec.t5Tags.includes(t) ? '#003262' : '#f3f4f6', color: rec.t5Tags.includes(t) ? 'white' : '#d1d5db' }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <code style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'monospace' }}>
                      {rec.hashLock.slice(0, 20)}…
                    </code>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    {new Date(rec.timestamp).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setSelected(rec)} style={{ padding: '5px 10px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#374151' }}>
                        <Eye size={11} />查看
                      </button>
                      {rec.status === 'pending' && (
                        <button onClick={() => handleVerify(rec.id)} disabled={isVerifying} style={{ padding: '5px 10px', background: isVerifying ? '#e5e7eb' : '#003262', border: 'none', borderRadius: '6px', cursor: isVerifying ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: isVerifying ? '#9ca3af' : 'white' }}>
                          {isVerifying ? '驗算中…' : <><Zap size={11} />驗算</>}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelected(null)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '22px 26px', background: 'linear-gradient(135deg, #003262, #1a4d7a)', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>萬能聖碑記錄詳情</div>
                <code style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontFamily: 'monospace' }}>{selected.uuid}</code>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: 'white', fontSize: '16px' }}>×</button>
            </div>
            <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: '計算公式', value: selected.formula, mono: true, highlight: true },
                { label: 'GRI 指標', value: selected.griReference },
                { label: 'ISO 標準', value: selected.isoStandard },
                { label: '數據來源', value: selected.sourceOrigin, mono: true },
                { label: '版本', value: selected.version },
                { label: '刻印時間', value: new Date(selected.timestamp).toLocaleString('zh-TW') },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '90px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', flexShrink: 0, paddingTop: '2px' }}>{f.label}</div>
                  <div style={{ flex: 1, fontSize: '13px', color: '#1f2937', fontFamily: f.mono ? 'monospace' : 'inherit', background: f.highlight ? '#fff7ed' : 'transparent', padding: f.highlight ? '6px 10px' : '0', borderRadius: f.highlight ? '7px' : '0', lineHeight: 1.5 }}>
                    {f.value}
                  </div>
                </div>
              ))}
              {/* Hash Lock */}
              <div style={{ padding: '14px 16px', background: '#f0f4ff', borderRadius: '12px', border: '1.5px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Hash size={13} color="#003262" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#003262' }}>SHA-256 Hash Lock</span>
                  <span style={{ marginLeft: 'auto', padding: '1px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: STATUS_CFG[selected.status].bg, color: STATUS_CFG[selected.status].color }}>{STATUS_CFG[selected.status].label}</span>
                </div>
                <code style={{ fontSize: '11px', color: '#374151', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {selected.hashLock}
                </code>
              </div>
              {/* 5T Tags */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '8px' }}>5T 誠信標籤</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { tag: 'T1', label: '可感知', color: '#003262' },
                    { tag: 'T2', label: '可溯源', color: '#1a4d7a' },
                    { tag: 'T3', label: '可追蹤', color: '#3b7ea1' },
                    { tag: 'T4', label: '透明', color: '#16a34a' },
                    { tag: 'T5', label: '不可篡改', color: '#7c3aed' },
                  ].map(t => {
                    const active = selected.t5Tags.includes(t.tag);
                    return (
                      <div key={t.tag} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: active ? t.color : '#f3f4f6', color: active ? 'white' : '#d1d5db', textAlign: 'center', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800 }}>{t.tag}</div>
                        <div style={{ fontSize: '9px', marginTop: '2px', opacity: 0.8 }}>{t.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Evidence JSON */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '8px' }}>Evidence Payload</div>
                <pre style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: '#374151', overflow: 'auto', border: '1px solid #e5e7eb', margin: 0 }}>
                  {JSON.stringify(selected.evidence, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
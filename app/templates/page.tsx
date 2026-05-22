'use client';
import { useState } from 'react';
import ClientLayout from '../ClientLayout';
import { Layers, ChevronRight, FileText, Calculator, CheckCircle } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'ghg',
    title: 'GHG 溫室氣體盤查模板',
    gri: 'GRI 305-1~305-5',
    standard: 'ISO 14064-1',
    category: 'E',
    fields: [
      { name: '範疇一直接排放量', unit: 'tCO₂e', formula: 'Σ(活動量 × 排放係數)' },
      { name: '範疇二間接排放量', unit: 'tCO₂e', formula: '用電量(kWh) × 台電排放係數(0.494)' },
      { name: '範疇三其他間接排放', unit: 'tCO₂e', formula: '依 WRI/WBCSD 方法學' },
    ],
    docs: ['ISO 14064-1 盤查清冊', '查證聲明書', '冷媒填充紀錄', '台電帳單'],
  },
  {
    id: 'energy',
    title: '能源管理模板',
    gri: 'GRI 302-1~302-5',
    standard: 'ISO 50001',
    category: 'E',
    fields: [
      { name: '總用電量', unit: 'kWh', formula: 'Σ各廠電表讀數' },
      { name: '化石燃料使用量', unit: 'GJ', formula: '耗油量(L) × 燃料熱值 × 單位換算' },
      { name: '再生能源佔比', unit: '%', formula: '再生能源量 ÷ 總能源消耗量 × 100%' },
    ],
    docs: ['台電電費帳單', 'T-REC 綠電憑證', '油資發票或採購單'],
  },
  {
    id: 'governance',
    title: '治理架構模板',
    gri: 'GRI 2-9~2-21',
    standard: 'TWSE 法規',
    category: 'G',
    fields: [
      { name: '董事會人數', unit: '人', formula: '直接計數' },
      { name: '獨立董事比例', unit: '%', formula: '獨立董事數 ÷ 董事總人數 × 100%' },
      { name: '女性董事比例', unit: '%', formula: '女性董事數 ÷ 董事總人數 × 100%' },
    ],
    docs: ['董事會名冊', '董事會績效評估報告', '公司章程'],
  },
  {
    id: 'labor',
    title: '勞工關係模板',
    gri: 'GRI 401-1~403-10',
    standard: 'ISO 45001',
    category: 'S',
    fields: [
      { name: '新聘員工率', unit: '%', formula: '新聘員工數 ÷ 期末員工數 × 100%' },
      { name: '離職率', unit: '%', formula: '離職員工數 ÷ 平均員工數 × 100%' },
      { name: '失能傷害頻率 FR', unit: '次/百萬工時', formula: '失能傷害件數 × 10⁶ ÷ 總工時' },
    ],
    docs: ['人資系統匯出報表', '員工名冊', '勞保局職災申報單'],
  },
];

export default function TemplatesPage() {
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('全部');

  const filtered = TEMPLATES.filter(t => filter === '全部' || t.category === filter);
  const CAT_COLORS: Record<string, string> = { E: '#22c55e', S: '#3b7ea1', G: '#8b5cf6' };

  return (
    <ClientLayout>
      <div className="page-header">
        <h1>專家零算力模板</h1>
        <p>Expert Templates · GRI 2021 全套框架 · 自動公式計算 · 佐證文件清單</p>
        <div className="page-header-meta">
          <span className="t5-badge t5-t2">T2: 透明驗算</span>
          <span className="badge badge-blue">{TEMPLATES.length} 套模板</span>
        </div>
      </div>

      {!selected ? (
        <div>
          <div className="filter-pills" style={{ marginBottom: 16 }}>
            {['全部', 'E', 'S', 'G'].map(c => <button key={c} className={`filter-pill${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>{c === '全部' ? '全部' : `${c} 類`}</button>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(t => (
              <div key={t.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(t)}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: CAT_COLORS[t.category] + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={18} style={{ color: CAT_COLORS[t.category] }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.standard}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  <span className="gri-tag">{t.gri}</span>
                  <span className="badge" style={{ background: CAT_COLORS[t.category] + '15', color: CAT_COLORS[t.category] }}>{t.category}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{t.fields.length} 項指標 · {t.docs.length} 份佐證文件</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-green"><CheckCircle size={10} />零算力套用</span>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: 16 }}>← 返回模板列表</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">{selected.title}</div>
                <span className="gri-tag">{selected.gri}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {selected.fields.map((f, i) => (
                  <div key={i}>
                    <label className="form-label">{f.name} <span className="badge badge-gray">{f.unit}</span></label>
                    <input className="form-input" value={formValues[f.name] || ''} onChange={e => setFormValues(p => ({ ...p, [f.name]: e.target.value }))} placeholder="請填入數值..." />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
                      <Calculator size={11} />
                      <code>{f.formula}</code>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button className="btn btn-primary">套用至永續撰寫</button>
                <button className="btn btn-outline">匯出 CSV</button>
              </div>
            </div>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>必備佐證文件清單</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selected.docs.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: 12, background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                    <FileText size={16} style={{ color: '#003262', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13 }}>{d}</span>
                    <span className="badge badge-yellow" style={{ marginLeft: 'auto', flexShrink: 0 }}>必要</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
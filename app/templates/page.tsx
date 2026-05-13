'use client';
import React, { useState } from 'react';
import { FileCheck, ChevronDown, ChevronRight, CheckCircle, AlertTriangle, Download, Copy, BookOpen } from 'lucide-react';

interface TemplateField {
  name: string;
  unit: string;
  required: boolean;
  formula?: string;
  doc: string;
  dept: string;
}

interface TemplateModule {
  id: string;
  name: string;
  gri: string;
  category: 'E' | 'S' | 'G';
  color: string;
  fields: TemplateField[];
  pages: number;
}

const templates: TemplateModule[] = [
  {
    id: 'ghg', name: 'GHG 溫室氣體盤查', gri: 'GRI 305', category: 'E', color: '#059669', pages: 28,
    fields: [
      { name: '範疇一直接排放量', unit: 'tCO₂e', required: true, formula: 'Σ(活動數據 × 排放係數)', doc: 'ISO 14064-1 盤查清冊', dept: '廠務/環安衛' },
      { name: '範疇二間接排放量', unit: 'tCO₂e', required: true, formula: '用電量(kWh) × 電力排放係數', doc: '台電帳單', dept: '廠務/總務' },
      { name: '範疇三價值鏈排放', unit: 'tCO₂e', required: false, formula: '採購量 × 供應商排放強度', doc: '供應商問卷', dept: '採購' },
      { name: '碳排放強度', unit: 'tCO₂e/百萬元', required: true, formula: '總排放量 / 營收', doc: '財報', dept: '財務' },
      { name: '再生能源使用比例', unit: '%', required: true, formula: '再生能源用量 / 總用能', doc: 'T-REC 憑證', dept: '廠務' },
    ]
  },
  {
    id: 'energy', name: '能源管理', gri: 'GRI 302', category: 'E', color: '#d97706', pages: 18,
    fields: [
      { name: '組織內總能耗', unit: 'GJ', required: true, formula: '用電(kWh×0.0036) + 化石燃料(MJ×0.001)', doc: '台電帳單 + 油資發票', dept: '廠務/總務' },
      { name: '化石燃料使用量', unit: 'GJ', required: true, formula: '柴油公升 × 35.86 MJ/L + ...', doc: '油資發票、採購單', dept: '廠務' },
      { name: '能源密集度', unit: 'GJ/百萬元', required: true, formula: '總能耗(GJ) / 營收(百萬元)', doc: '財報', dept: '財務' },
      { name: '節能量', unit: 'GJ', required: false, formula: '(基準年能耗 - 當年能耗)', doc: '節能設備清單', dept: '廠務' },
    ]
  },
  {
    id: 'water', name: '水資源管理', gri: 'GRI 303', category: 'E', color: '#2563eb', pages: 16,
    fields: [
      { name: '總取水量', unit: 'm³', required: true, formula: '自來水 + 地下水 + 雨水', doc: '自來水帳單 + 水權狀', dept: '廠務' },
      { name: '廢水排放量', unit: 'm³', required: true, formula: '取水量 - 蒸發量 - 產品含水量', doc: '廢水處理廠水質報告', dept: '環安衛' },
      { name: '水資源回收率', unit: '%', required: true, formula: '回收水量 / 總取水量 × 100', doc: '回收設備流量計', dept: '廠務' },
      { name: '水資源密集度', unit: 'm³/百萬元', required: false, formula: '總取水量 / 營收', doc: '財報', dept: '財務' },
    ]
  },
  {
    id: 'workforce', name: '員工與職場', gri: 'GRI 401-405', category: 'S', color: '#2563eb', pages: 24,
    fields: [
      { name: '全職員工人數', unit: '人', required: true, formula: '直接計數', doc: '人資系統', dept: '人資' },
      { name: '女性員工比例', unit: '%', required: true, formula: '女性員工 / 總員工 × 100', doc: '人資系統', dept: '人資' },
      { name: '員工自願離職率', unit: '%', required: true, formula: '自願離職人數 / 年均員工數 × 100', doc: '人資系統匯出報表', dept: '人資' },
      { name: '薪酬男女比', unit: '比值', required: true, formula: '女性平均薪資 / 男性平均薪資', doc: '薪資結算表', dept: '人資' },
      { name: '人均受訓時數', unit: '小時/人', required: true, formula: '總受訓時數 / 員工人數', doc: '教育訓練簽到表', dept: '人資' },
    ]
  },
  {
    id: 'safety', name: '職業安全衛生', gri: 'GRI 403', category: 'S', color: '#dc2626', pages: 20,
    fields: [
      { name: '失能傷害頻率 (FR)', unit: '次/百萬工時', required: true, formula: '失能傷害次數 × 1,000,000 / 總工時', doc: '職災申報單、勞保', dept: '環安衛' },
      { name: '嚴重傷害率 (SR)', unit: '工時/百萬工時', required: true, formula: '失能傷害損失工時 × 1,000,000 / 總工時', doc: '工安事件調查報告', dept: '環安衛' },
      { name: '總工時', unit: '工時', required: true, formula: 'Σ(員工在職天數 × 每日工時)', doc: '出勤紀錄', dept: '人資/環安衛' },
      { name: '安全訓練覆蓋率', unit: '%', required: true, formula: '完成安全訓練員工 / 總員工 × 100', doc: '訓練紀錄', dept: '環安衛' },
    ]
  },
  {
    id: 'governance', name: '公司治理', gri: 'GRI 2-9, 205', category: 'G', color: '#7c3aed', pages: 22,
    fields: [
      { name: '董事會總人數', unit: '人', required: true, formula: '直接計數', doc: '董事會名冊', dept: '董事會秘書室' },
      { name: '獨立董事比例', unit: '%', required: true, formula: '獨立董事 / 全體董事 × 100', doc: '公司登記文件', dept: '董事會秘書室' },
      { name: '女性董事比例', unit: '%', required: true, formula: '女性董事 / 全體董事 × 100', doc: '董事會名冊', dept: '董事會秘書室' },
      { name: '貪腐事件數', unit: '件', required: true, formula: '直接計數（含調查中案件）', doc: '內部稽核報告', dept: '稽核/法務' },
      { name: '違規罰款總額', unit: '萬元', required: true, formula: '所有行政裁處金額總和', doc: '法務裁罰通知書', dept: '法務' },
    ]
  },
  {
    id: 'supply', name: '供應鏈管理', gri: 'GRI 204, 308, 414', category: 'S', color: '#059669', pages: 18,
    fields: [
      { name: '在地採購比例', unit: '%', required: true, formula: '在地供應商採購金額 / 總採購金額 × 100', doc: '採購系統', dept: '採購' },
      { name: '供應商 ESG 稽核覆蓋率', unit: '%', required: true, formula: '已稽核供應商 / 關鍵供應商 × 100', doc: 'ESG 稽核評分表', dept: '採購' },
      { name: '簽署永續承諾書比例', unit: '%', required: true, formula: '已簽署供應商 / 總供應商 × 100', doc: '永續承諾書', dept: '採購' },
      { name: '供應商碳足跡覆蓋率', unit: '%', required: false, formula: '提供碳足跡數據的供應商 / 重點供應商', doc: '供應商問卷', dept: '採購/環安衛' },
    ]
  },
  {
    id: 'tax', name: '稅務透明', gri: 'GRI 207', category: 'G', color: '#2563eb', pages: 12,
    fields: [
      { name: '有效稅率', unit: '%', required: true, formula: '實際繳納所得稅 / 稅前淨利 × 100', doc: '財務報告、稅務申報書', dept: '財務' },
      { name: '繳納所得稅', unit: '萬元', required: true, formula: '直接取財報數字', doc: '財務報告', dept: '財務' },
      { name: '政府補貼金額', unit: '萬元', required: true, formula: '所有政府補助金額', doc: '財務報告', dept: '財務' },
    ]
  },
];

export default function TemplatesPage() {
  const [expanded, setExpanded] = useState<string | null>('ghg');
  const [filter, setFilter] = useState<'all' | 'E' | 'S' | 'G'>('all');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = templates.filter(t => filter === 'all' || t.category === filter);
  const totalPages = filtered.reduce((s, t) => s + t.pages, 0);
  const categoryColors: Record<string, string> = { E: '#059669', S: '#2563eb', G: '#7c3aed' };

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={18} color="#fff" />
              </div>
              <h1 className="page-title">專家零算力模板</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Expert Templates</span>
              <span className="badge badge-gold">零幻覺驗算</span>
              <span className="badge badge-green">GRI 2021 全套</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{filtered.length}</div><div className="stat-label">模板模組</div></div>
        <div className="stat-card"><div className="stat-value text-success">{filtered.reduce((s, t) => s + t.fields.length, 0)}</div><div className="stat-label">數據欄位</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{totalPages}</div><div className="stat-label">預估報告頁數</div></div>
        <div className="stat-card"><div className="stat-value text-danger">{filtered.reduce((s, t) => s + t.fields.filter(f => f.required).length, 0)}</div><div className="stat-label">必填欄位</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'E', 'S', 'G'] as const).map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}
            style={{ borderLeft: f !== 'all' ? `3px solid ${categoryColors[f]}` : undefined }}>
            {f === 'all' ? '全部模板' : f === 'E' ? '環境 E' : f === 'S' ? '社會 S' : '治理 G'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(tmpl => {
          const isOpen = expanded === tmpl.id;
          return (
            <div key={tmpl.id} className="card">
              <div
                style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                onClick={() => setExpanded(isOpen ? null : tmpl.id)}
              >
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${tmpl.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileCheck size={16} color={tmpl.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{tmpl.name}</span>
                    <span className="gri-chip">{tmpl.gri}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 4, background: `${categoryColors[tmpl.category]}20`, color: categoryColors[tmpl.category], fontWeight: 700, fontSize: 11 }}>{tmpl.category}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {tmpl.fields.length} 個數據欄位 · {tmpl.fields.filter(f => f.required).length} 個必填 · 預估 {tmpl.pages} 頁
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 12 }} onClick={e => { e.stopPropagation(); handleCopy(tmpl.fields.map(f => f.name).join('\n'), tmpl.id); }}>
                    {copied === tmpl.id ? <CheckCircle size={12} color="var(--success)" /> : <Copy size={12} />}
                    {copied === tmpl.id ? '已複製' : '複製欄位'}
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }} onClick={e => e.stopPropagation()}>
                    <Download size={12} />匯出
                  </button>
                  {isOpen ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border-light)', padding: '16px 20px' }}>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>數據欄位</th>
                          <th>單位</th>
                          <th>必填</th>
                          <th>計算公式</th>
                          <th>必備文件</th>
                          <th>負責單位</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tmpl.fields.map((f, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 500, fontSize: 13 }}>{f.name}</td>
                            <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--founders-rock)' }}>{f.unit}</span></td>
                            <td>
                              {f.required
                                ? <CheckCircle size={14} color="var(--success)" />
                                : <AlertTriangle size={14} color="var(--text-muted)" />}
                            </td>
                            <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', maxWidth: 200 }}>{f.formula || '直接填報'}</td>
                            <td style={{ fontSize: 12 }}>{f.doc}</td>
                            <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{f.dept}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="alert alert-info" style={{ marginTop: 12, fontSize: 13 }}>
                    <BookOpen size={13} />
                    <span>此模板預估可生成 <strong>{tmpl.pages} 頁</strong>報告內容，包含數據表格、趨勢圖表與管理方法說明。</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
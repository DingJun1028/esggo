'use client';

import { useState, useMemo } from 'react';
import { documentChecklist, categoryMeta, statusMeta, type DocStatus, type ESGDocument } from '../../lib/document-checklist-data';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw, ChevronDown, ChevronUp, Star, FileText, BarChart3, Shield } from 'lucide-react';

const CATEGORIES = ['全部', 'D', 'E', 'S', 'T', 'G'] as const;
const STATUSES: DocStatus[] = ['pending', 'completed', 'in_progress', 'missing', 'needs_update'];

export default function DocumentChecklistPage() {
  const [docs, setDocs] = useState<ESGDocument[]>(documentChecklist);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('全部');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [deptFilter, setDeptFilter] = useState<string>('全部');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['D', 'E', 'S', 'T', 'G']));
  const [selectedDoc, setSelectedDoc] = useState<ESGDocument | null>(null);
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);

  const departments = useMemo(() => {
    const deps = Array.from(new Set(docs.map(d => d.department)));
    return ['全部', ...deps.sort()];
  }, [docs]);

  const filtered = useMemo(() => docs.filter(d => {
    const matchSearch = d.name.includes(search) || d.id.includes(search) || d.standard.includes(search) || d.department.includes(search);
    const matchCat = catFilter === '全部' || d.category === catFilter;
    const matchStatus = statusFilter === '全部' || d.status === statusFilter;
    const matchDept = deptFilter === '全部' || d.department === deptFilter;
    const matchPriority = !showPriorityOnly || d.priority === 'high';
    return matchSearch && matchCat && matchStatus && matchDept && matchPriority;
  }), [docs, search, catFilter, statusFilter, deptFilter, showPriorityOnly]);

  const stats = useMemo(() => {
    const total = docs.length;
    const completed = docs.filter(d => d.status === 'completed').length;
    const missing = docs.filter(d => d.status === 'missing').length;
    const inProgress = docs.filter(d => d.status === 'in_progress').length;
    const needsUpdate = docs.filter(d => d.status === 'needs_update').length;
    const highPriority = docs.filter(d => d.priority === 'high').length;
    return { total, completed, missing, inProgress, needsUpdate, highPriority, rate: Math.round((completed / total) * 100) };
  }, [docs]);

  const byCat = useMemo(() => {
    const cats: Record<string, ESGDocument[]> = {};
    filtered.forEach(d => {
      if (!cats[d.category]) cats[d.category] = [];
      cats[d.category].push(d);
    });
    return cats;
  }, [filtered]);

  const updateStatus = (id: string, status: DocStatus) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    if (selectedDoc?.id === id) setSelectedDoc(prev => prev ? { ...prev, status } : null);
  };

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const exportCSV = () => {
    const header = '編號,文件名稱,所屬規範,負責部門,填報狀態,高優先,備註';
    const rows = docs.map(d =>
      `${d.id},"${d.name}",${d.standard},${d.department},${statusMeta[d.status].label},${d.priority === 'high' ? '⭐' : ''},${d.notes || ''}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ESG永續報告書文件主清單_v2.0.csv';
    a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003262 0%, #1a4a7c 50%, #003262 100%)', color: '#fff', padding: '2rem 2rem 1.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FileText size={28} color="#FDB515" />
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>ESG 永續報告書文件主清單</h1>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem' }}>Document Master List v2.0 · GRI 2021 · SASB · TCFD · 金管會規範 · 2026-03-22</p>
            </div>
          </div>
          {/* Stats Strip */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: '文件總數', value: stats.total, icon: FileText, color: '#FDB515' },
              { label: '已完成', value: stats.completed, icon: CheckCircle, color: '#4ade80' },
              { label: '進行中', value: stats.inProgress, icon: RefreshCw, color: '#60a5fa' },
              { label: '缺漏', value: stats.missing, icon: XCircle, color: '#f87171' },
              { label: '需更新', value: stats.needsUpdate, icon: AlertTriangle, color: '#fbbf24' },
              { label: '高優先', value: stats.highPriority, icon: Star, color: '#f97316' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(8px)' }}>
                <s.icon size={16} color={s.color} />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.6rem 1rem', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: 4 }}>完成率</div>
              <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${stats.rate}%`, background: '#4ade80', borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, marginTop: 2 }}>{stats.rate}%</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 2rem' }}>
        {/* Priority Alert */}
        {docs.filter(d => d.priority === 'high' && d.status !== 'completed').length > 0 && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Star size={18} color="#e65100" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#e65100', fontSize: '0.9rem' }}>⭐ 高優先補齊項目（{docs.filter(d => d.priority === 'high').length}項）</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                {docs.filter(d => d.priority === 'high').map(d => (
                  <span key={d.id} onClick={() => setSelectedDoc(d)} style={{ background: '#fff', border: '1px solid #e65100', borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.78rem', color: '#e65100', cursor: 'pointer', fontWeight: 600 }}>
                    {d.id} {d.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜尋文件名稱、編號、規範..."
              style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', background: '#fff' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === '全部' ? '全部章節' : `${c} - ${categoryMeta[c as keyof typeof categoryMeta]?.label}`}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', background: '#fff' }}>
            <option value="全部">全部狀態</option>
            {STATUSES.map(s => <option key={s} value={s}>{statusMeta[s].label}</option>)}
          </select>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', background: '#fff' }}>
            {departments.map(d => <option key={d} value={d}>{d === '全部' ? '全部部門' : d}</option>)}
          </select>
          <button
            onClick={() => setShowPriorityOnly(!showPriorityOnly)}
            style={{ padding: '0.5rem 0.9rem', borderRadius: 8, border: `1px solid ${showPriorityOnly ? '#e65100' : '#e5e7eb'}`, background: showPriorityOnly ? '#fff3cd' : '#fff', color: showPriorityOnly ? '#e65100' : '#374151', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: showPriorityOnly ? 700 : 400 }}
          >
            <Star size={14} /> 高優先
          </button>
          <button onClick={exportCSV} style={{ padding: '0.5rem 1rem', background: '#003262', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <Download size={14} /> 匯出 CSV
          </button>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: 'auto' }}>
            顯示 {filtered.length} / {docs.length} 項
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '1fr 360px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
          {/* Main Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(['D', 'E', 'S', 'T', 'G'] as const).map(cat => {
              const catDocs = byCat[cat] || [];
              if (catDocs.length === 0) return null;
              const meta = categoryMeta[cat];
              const expanded = expandedCats.has(cat);
              const catTotal = docs.filter(d => d.category === cat).length;
              const catDone = docs.filter(d => d.category === cat && d.status === 'completed').length;
              return (
                <div key={cat} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <div
                    onClick={() => toggleCat(cat)}
                    style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: meta.bg, borderBottom: expanded ? `2px solid ${meta.color}` : 'none' }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{meta.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: meta.color, fontSize: '0.95rem' }}>
                        {cat} — {meta.label}
                        {catDocs.some(d => d.isNew) && <span style={{ marginLeft: '0.5rem', background: meta.color, color: '#fff', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: 10, fontWeight: 600 }}>含新增</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{catDocs.length} 項顯示（共 {catTotal} 項）</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{catDone}/{catTotal} 完成</div>
                        <div style={{ width: 80, height: 4, background: '#e5e7eb', borderRadius: 2, marginTop: 2 }}>
                          <div style={{ height: '100%', width: `${catTotal > 0 ? (catDone / catTotal) * 100 : 0}%`, background: meta.color, borderRadius: 2 }} />
                        </div>
                      </div>
                      {expanded ? <ChevronUp size={16} color={meta.color} /> : <ChevronDown size={16} color={meta.color} />}
                    </div>
                  </div>
                  {expanded && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                        <thead>
                          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                            <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>編號</th>
                            <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: '#6b7280', fontWeight: 600 }}>文件名稱</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>所屬規範</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>負責部門</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>填報狀態</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: '#6b7280', fontWeight: 600 }}>備註</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catDocs.map((doc, i) => {
                            const sm = statusMeta[doc.status];
                            const isSelected = selectedDoc?.id === doc.id;
                            return (
                              <tr
                                key={doc.id}
                                onClick={() => setSelectedDoc(isSelected ? null : doc)}
                                style={{ borderBottom: '1px solid #f3f4f6', background: isSelected ? '#f0f4ff' : i % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer', transition: 'background 0.15s' }}
                              >
                                <td style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
                                  <span style={{ fontWeight: 700, color: meta.color, fontSize: '0.82rem' }}>{doc.id}</span>
                                  {doc.priority === 'high' && <span style={{ marginLeft: 4, color: '#e65100' }}>⭐</span>}
                                  {doc.isNew && <span style={{ marginLeft: 4, background: '#dbeafe', color: '#1d4ed8', fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: 8, fontWeight: 600 }}>NEW</span>}
                                </td>
                                <td style={{ padding: '0.65rem 1rem', fontWeight: 500, color: '#1f2937', maxWidth: 320 }}>{doc.name}</td>
                                <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }}>
                                  <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.75rem' }}>{doc.standard}</span>
                                </td>
                                <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap', color: '#4b5563', fontSize: '0.82rem' }}>{doc.department}</td>
                                <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }}>
                                  <select
                                    value={doc.status}
                                    onChange={e => { e.stopPropagation(); updateStatus(doc.id, e.target.value as DocStatus); }}
                                    onClick={e => e.stopPropagation()}
                                    style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.color}40`, borderRadius: 20, padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                                  >
                                    {STATUSES.map(s => <option key={s} value={s}>{statusMeta[s].label}</option>)}
                                  </select>
                                </td>
                                <td style={{ padding: '0.65rem 0.75rem', color: '#9ca3af', fontSize: '0.78rem' }}>{doc.notes || ''}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selectedDoc && (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', position: 'sticky', top: '1rem', overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${categoryMeta[selectedDoc.category].color}, ${categoryMeta[selectedDoc.category].color}cc)`, color: '#fff', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>{selectedDoc.id}</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.4 }}>{selectedDoc.name}</div>
                  </div>
                  <button onClick={() => setSelectedDoc(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 6, padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                </div>
                {selectedDoc.priority === 'high' && (
                  <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Star size={13} color="#FDB515" /> <strong>高優先補齊項目</strong> — {selectedDoc.notes}
                  </div>
                )}
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[
                    { label: '章節', value: `${selectedDoc.category} — ${categoryMeta[selectedDoc.category].label}` },
                    { label: '所屬規範', value: selectedDoc.standard },
                    { label: '負責部門', value: selectedDoc.department },
                    { label: '是否新增', value: selectedDoc.isNew ? '✅ 新增項目' : '原有項目' },
                  ].map(item => (
                    <div key={item.label} style={{ background: '#f9fafb', borderRadius: 8, padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.25rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1f2937' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 600 }}>填報狀態</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {STATUSES.map(s => {
                      const sm = statusMeta[s];
                      const isActive = selectedDoc.status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedDoc.id, s)}
                          style={{ padding: '0.4rem 0.8rem', borderRadius: 20, border: `1.5px solid ${isActive ? sm.color : '#e5e7eb'}`, background: isActive ? sm.bg : '#fff', color: isActive ? sm.color : '#9ca3af', fontSize: '0.78rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                          {sm.icon} {sm.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '0.9rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#003262', marginBottom: '0.5rem' }}>📋 填報建議</div>
                  <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.6 }}>
                    {selectedDoc.category === 'D' && '基礎治理文件是永續報告書的根基。建議先確認公司法律架構，取得最新版本的相關文件並進行內部審核。'}
                    {selectedDoc.category === 'E' && '環境數據需要精確量測與第三方查證。建議與環境顧問合作，確保數據符合 ISO 14064-1 標準與 GRI 揭露要求。'}
                    {selectedDoc.category === 'S' && '社會面數據涉及員工隱私，填報時需取得人資授權並確認數據口徑一致性。建議由 HR 系統直接匯出。'}
                    {selectedDoc.category === 'T' && '資訊安全文件需定期更新。建議與 CISO 協作，確保政策文件與實際操作程序一致。'}
                    {selectedDoc.category === 'G' && '治理文件需要董事會層級的審核與簽署。建議提前排入董事會議程，確保法遵時程。'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.location.href = '/editor';
                  }}
                  style={{ width: '100%', padding: '0.75rem', background: '#003262', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <FileText size={15} /> 在永續撰寫中開啟此章節
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', marginTop: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <BarChart3 size={18} color="#003262" />
            <h3 style={{ margin: 0, color: '#003262', fontSize: '0.95rem', fontWeight: 700 }}>各章節填報統計</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {(['D', 'E', 'S', 'T', 'G'] as const).map(cat => {
              const meta = categoryMeta[cat];
              const catDocs = docs.filter(d => d.category === cat);
              const done = catDocs.filter(d => d.status === 'completed').length;
              const missing = catDocs.filter(d => d.status === 'missing').length;
              const rate = Math.round((done / catDocs.length) * 100);
              return (
                <div key={cat} style={{ background: meta.bg, borderRadius: 10, padding: '0.9rem', border: `1px solid ${meta.color}20` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: meta.color, fontSize: '0.9rem' }}>{meta.emoji} {cat}</span>
                    <span style={{ fontSize: '0.72rem', color: meta.color, fontWeight: 600 }}>{catDocs.length}項</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.4rem' }}>{meta.label}</div>
                  <div style={{ width: '100%', height: 6, background: `${meta.color}20`, borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${rate}%`, background: meta.color, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.72rem' }}>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>✅ {done}</span>
                    {missing > 0 && <span style={{ color: '#dc2626', fontWeight: 600 }}>❌ {missing}</span>}
                    <span style={{ color: meta.color, fontWeight: 700 }}>{rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
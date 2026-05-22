'use client';
import { useState } from 'react';
import { BookOpen, Search, ExternalLink, Star, Filter, Download, Globe, FileText, Award } from 'lucide-react';

const STANDARDS = [
  {
    id: 'gri-2021',
    name: 'GRI 2021',
    fullName: 'Global Reporting Initiative Standards 2021',
    category: '通用標準',
    region: '國際',
    relevance: 98,
    description: '全球最廣泛使用的永續報告標準，涵蓋組織基本揭露、管理方針及主題標準。',
    url: 'https://www.globalreporting.org',
    tags: ['E', 'S', 'G', '必備'],
    color: '#003262',
    updates: '2021',
  },
  {
    id: 'tcfd',
    name: 'TCFD',
    fullName: 'Task Force on Climate-related Financial Disclosures',
    category: '氣候財務',
    region: '國際',
    relevance: 95,
    description: '聚焦氣候相關財務風險揭露，包含治理、策略、風險管理、指標與目標四大支柱。',
    url: 'https://www.fsb-tcfd.org',
    tags: ['E', '氣候', '財務'],
    color: '#0891b2',
    updates: '2017',
  },
  {
    id: 'sasb',
    name: 'SASB',
    fullName: 'Sustainability Accounting Standards Board',
    category: '產業標準',
    region: '國際',
    relevance: 88,
    description: '依產業別（77種）制定的永續會計標準，著重財務重大性。',
    url: 'https://www.sasb.org',
    tags: ['產業', 'E', 'S', 'G'],
    color: '#7c3aed',
    updates: '2018',
  },
  {
    id: 'issb-s1',
    name: 'ISSB S1/S2',
    fullName: 'IFRS Sustainability Disclosure Standards',
    category: '永續揭露',
    region: '國際',
    relevance: 92,
    description: 'IFRS基金會發布，S1為一般永續揭露，S2專注氣候相關揭露，為下世代主流標準。',
    url: 'https://www.ifrs.org/groups/international-sustainability-standards-board/',
    tags: ['E', '新興', '必備'],
    color: '#059669',
    updates: '2023',
  },
  {
    id: 'twse',
    name: '金管會規範',
    fullName: '台灣上市上櫃公司永續報告書規範',
    category: '台灣法規',
    region: '台灣',
    relevance: 100,
    description: '台灣金管會要求上市櫃公司強制揭露，依公司規模分階段實施，2026年全面適用。',
    url: 'https://www.twse.com.tw',
    tags: ['強制', '台灣', '法規'],
    color: '#dc2626',
    updates: '2024',
  },
  {
    id: 'iso14064',
    name: 'ISO 14064-1',
    fullName: 'Greenhouse Gas Quantification & Reporting',
    category: '環境標準',
    region: '國際',
    relevance: 90,
    description: '組織層次溫室氣體盤查、量化及報告的國際標準，為GHG認證基礎。',
    url: 'https://www.iso.org/standard/66453.html',
    tags: ['E', 'GHG', '認證'],
    color: '#22c55e',
    updates: '2018',
  },
];

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('全部');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<typeof STANDARDS[0] | null>(null);

  const categories = ['全部', ...Array.from(new Set(STANDARDS.map(s => s.category)))];

  const filtered = STANDARDS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.description.includes(search);
    const matchCat = catFilter === '全部' || s.category === catFilter;
    return matchSearch && matchCat;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003262', margin: 0 }}>永續智庫 SustainLibrary</h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>GRI · SASB · TCFD · ISSB · ISO · 台灣法規 — 一站式國際標準資源庫</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '收錄標準數', value: STANDARDS.length.toString(), color: '#003262' },
          { label: '國際框架', value: '5', color: '#3b7ea1' },
          { label: '台灣法規', value: '1', color: '#dc2626' },
          { label: '已書籤', value: bookmarks.size.toString(), color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋標準名稱或關鍵字..."
            style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            style={{ padding: '10px 16px', border: 'none', borderRadius: '8px', background: catFilter === c ? '#003262' : '#f1f5f9', color: catFilter === c ? '#fff' : '#64748b', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {filtered.map(s => (
          <div key={s.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            onClick={() => setSelected(s)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={22} color={s.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#003262', margin: 0 }}>{s.name}</h3>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.category} · {s.region} · 更新 {s.updates}</div>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleBookmark(s.id); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <Star size={18} color={bookmarks.has(s.id) ? '#f59e0b' : '#cbd5e1'} fill={bookmarks.has(s.id) ? '#f59e0b' : 'none'} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>{s.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {s.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', background: `${s.color}15`, color: s.color, fontWeight: '700' }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                  <div style={{ width: `${s.relevance}%`, height: '100%', background: s.color, borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: s.color }}>{s.relevance}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '520px', maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: `${selected.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={28} color={selected.color} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#003262', margin: 0 }}>{selected.name}</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>{selected.fullName}</p>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, marginBottom: '20px' }}>{selected.description}</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {selected.tags.map((t, i) => (
                <span key={i} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: `${selected.color}15`, color: selected.color, fontWeight: '700' }}>{t}</span>
              ))}
            </div>
            <a href={selected.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', background: selected.color, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', marginBottom: '12px' }}>
              <ExternalLink size={16} /> 前往官方網站
            </a>
            <button onClick={() => setSelected(null)} style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>關閉</button>
          </div>
        </div>
      )}
    </div>
  );
}
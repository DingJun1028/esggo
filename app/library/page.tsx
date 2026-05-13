'use client';
import React, { useState } from 'react';
import { Landmark, Search, ExternalLink, BookOpen, Star, Download, Filter } from 'lucide-react';

interface Standard {
  id: string;
  name: string;
  fullName: string;
  category: string;
  region: string;
  version: string;
  relevance: number;
  description: string;
  keyTopics: string[];
  url: string;
  mandatory: boolean;
}

const standards: Standard[] = [
  { id: '1', name: 'GRI 2021', fullName: 'Global Reporting Initiative Universal Standards 2021', category: '通用框架', region: '國際', version: '2021', relevance: 98, description: '全球最廣泛使用的永續報告框架，涵蓋一般揭露、管理方法及議題特定準則。', keyTopics: ['一般揭露', '管理方法', 'GRI 300 環境', 'GRI 400 社會'], url: 'https://www.globalreporting.org', mandatory: true },
  { id: '2', name: 'TCFD', fullName: 'Task Force on Climate-related Financial Disclosures', category: '氣候財務', region: '國際', version: '2023', relevance: 95, description: '氣候相關財務揭露框架，聚焦治理、策略、風險管理及指標目標四大核心要素。', keyTopics: ['氣候風險治理', '情境分析', '轉型風險', '實體風險'], url: 'https://www.fsb-tcfd.org', mandatory: true },
  { id: '3', name: 'ISSB S1/S2', fullName: 'IFRS Sustainability Disclosure Standards S1 & S2', category: '國際準則', region: '國際', version: '2023', relevance: 92, description: 'IFRS 基金會發布的永續揭露準則，S1 一般要求，S2 氣候相關揭露，整合 TCFD。', keyTopics: ['IFRS S1', 'IFRS S2', '氣候相關財務', '重要性評估'], url: 'https://www.ifrs.org/sustainability', mandatory: true },
  { id: '4', name: 'SASB', fullName: 'Sustainability Accounting Standards Board', category: '產業標準', region: '國際', version: '2023', relevance: 88, description: '依產業別制定的永續會計標準，提供 77 個產業的特定指標與計量方式。', keyTopics: ['產業特定指標', '財務重大性', '77 個產業'], url: 'https://www.sasb.org', mandatory: false },
  { id: '5', name: 'CDP', fullName: 'Carbon Disclosure Project', category: '碳揭露', region: '國際', version: '2024', relevance: 85, description: '全球最大的環境資訊揭露平台，涵蓋氣候變遷、水安全、森林三大主題。', keyTopics: ['氣候變遷', '水安全', '森林', 'A 級評分'], url: 'https://www.cdp.net', mandatory: false },
  { id: '6', name: 'SBTi', fullName: 'Science Based Targets initiative', category: '碳中和', region: '國際', version: '2023', relevance: 83, description: '科學基礎減碳目標倡議，提供企業設定符合 1.5°C 目標的減碳路徑。', keyTopics: ['1.5°C 目標', '範疇一二三', '淨零準則'], url: 'https://sciencebasedtargets.org', mandatory: false },
  { id: '7', name: 'ISO 14064-1', fullName: 'ISO 14064-1:2018 温室氣體盤查', category: '管理系統', region: '國際', version: '2018', relevance: 90, description: '溫室氣體盤查與查證國際標準，為範疇一、二、三排放量計算提供規範方法。', keyTopics: ['GHG 盤查', '第三方查證', '排放係數', '基準年'], url: 'https://www.iso.org', mandatory: true },
  { id: '8', name: 'ISO 14001', fullName: 'ISO 14001:2015 環境管理系統', category: '管理系統', region: '國際', version: '2015', relevance: 80, description: '環境管理系統國際標準，協助企業建立系統性環境管理框架。', keyTopics: ['環境管理', 'PDCA 循環', '環境影響評估'], url: 'https://www.iso.org', mandatory: false },
  { id: '9', name: 'TNFD', fullName: 'Taskforce on Nature-related Financial Disclosures', category: '自然資本', region: '國際', version: '2023', relevance: 75, description: '自然相關財務揭露框架，2023 年 v1.0 正式發布，為 TCFD 的自然版本。', keyTopics: ['生物多樣性', 'LEAP 方法', '自然風險', 'TNFD v1.0'], url: 'https://tnfd.global', mandatory: false },
  { id: '10', name: '金管會永續路徑圖', fullName: '台灣金融監督管理委員會永續發展路徑圖 2.0', category: '台灣法規', region: '台灣', version: '2025', relevance: 99, description: '台灣上市公司 ESG 揭露要求，2026 年起資本額 20 億以上企業強制揭露。', keyTopics: ['強制揭露', '台灣法規', 'GRI 對齊', 'TCFD 整合'], url: 'https://www.fsc.gov.tw', mandatory: true },
  { id: '11', name: 'EU CSRD', fullName: 'Corporate Sustainability Reporting Directive', category: 'EU 法規', region: 'EU', version: '2024', relevance: 87, description: '歐盟企業永續報告指令，要求供應鏈揭露，影響台灣出口企業。', keyTopics: ['ESRS 準則', '供應鏈盡職調查', '雙重重大性', 'CSRD 2026'], url: 'https://ec.europa.eu', mandatory: false },
  { id: '12', name: 'ISO 45001', fullName: 'ISO 45001:2018 職業安全衛生管理系統', category: '管理系統', region: '國際', version: '2018', relevance: 78, description: '職業安全衛生管理系統國際標準，取代 OHSAS 18001。', keyTopics: ['職業安全', '危害辨識', '風險評估', '事故調查'], url: 'https://www.iso.org', mandatory: false },
];

const categories = ['全部', ...Array.from(new Set(standards.map(s => s.category)))];
const regions = ['全部', ...Array.from(new Set(standards.map(s => s.region)))];

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [region, setRegion] = useState('全部');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set(['1', '2', '3', '7', '10']));
  const [showMandatory, setShowMandatory] = useState(false);

  const filtered = standards.filter(s =>
    (category === '全部' || s.category === category) &&
    (region === '全部' || s.region === region) &&
    (!showMandatory || s.mandatory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
     s.fullName.toLowerCase().includes(search.toLowerCase()) ||
     s.keyTopics.some(t => t.includes(search)) ||
     s.description.includes(search))
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Landmark size={18} color="#fff" />
              </div>
              <h1 className="page-title">永續智庫</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">SustainLibrary</span>
              <span className="badge badge-gold">{standards.length} 項標準</span>
              <span style={{ color: 'var(--text-muted)' }}>· 國際框架索引</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--berkeley-blue)' }}>{standards.length}</div><div className="stat-label">收錄標準框架</div></div>
        <div className="stat-card"><div className="stat-value text-danger">{standards.filter(s => s.mandatory).length}</div><div className="stat-label">強制揭露框架</div></div>
        <div className="stat-card"><div className="stat-value text-warning">{bookmarked.size}</div><div className="stat-label">已收藏</div></div>
        <div className="stat-card"><div className="stat-value text-success">{Math.round(standards.reduce((s, x) => s + x.relevance, 0) / standards.length)}%</div><div className="stat-label">平均相關性</div></div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋標準名稱、關鍵字..." className="form-input" style={{ paddingLeft: 36 }} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="form-select" style={{ width: 130 }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={region} onChange={e => setRegion(e.target.value)} className="form-select" style={{ width: 110 }}>
          {regions.map(r => <option key={r}>{r}</option>)}
        </select>
        <button className={`btn btn-sm ${showMandatory ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowMandatory(!showMandatory)}>
          <Filter size={13} />{showMandatory ? '強制揭露' : '全部'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map(s => (
          <div key={s.id} className="card" style={{ padding: 20, position: 'relative', border: bookmarked.has(s.id) ? '1px solid var(--california-gold)' : undefined }}>
            {s.mandatory && (
              <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--danger)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: '8px 0 8px 0', letterSpacing: '0.5px' }}>
                強制揭露
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, marginTop: s.mandatory ? 8 : 0 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--berkeley-blue)', marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.fullName}</div>
              </div>
              <button onClick={() => setBookmarked(prev => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: bookmarked.has(s.id) ? 'var(--california-gold)' : 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
                <Star size={16} fill={bookmarked.has(s.id) ? 'var(--california-gold)' : 'none'} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{s.category}</span>
              <span className="badge badge-gray">{s.region}</span>
              <span className="badge badge-gray">v{s.version}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{s.description}</p>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>與您的相關性</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.relevance >= 90 ? 'var(--danger)' : s.relevance >= 80 ? 'var(--warning)' : 'var(--success)' }}>{s.relevance}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${s.relevance}%`, background: s.relevance >= 90 ? 'var(--danger)' : s.relevance >= 80 ? 'var(--warning)' : undefined }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {s.keyTopics.slice(0, 3).map(t => <span key={t} className="gri-chip">{t}</span>)}
              {s.keyTopics.length > 3 && <span className="gri-chip">+{s.keyTopics.length - 3}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 12, flex: 1, justifyContent: 'center' }}>
                <ExternalLink size={12} />查看官方文件
              </a>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                <BookOpen size={12} />快速指引
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
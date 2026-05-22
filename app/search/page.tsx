'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, FileText, BarChart3, Shield, Leaf, Users, Building2, BookOpen, Hash, ChevronRight } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  module: string;
  href: string;
  category: 'page' | 'gri' | 'standard' | 'feature';
  tags: string[];
  icon: React.ReactNode;
}

const ALL_ITEMS: SearchResult[] = [
  { id: '1', title: 'Dashboard', titleZh: '控制台', description: 'KPI 儀表板、GRI 覆蓋率、5T 活動日誌、模組進度追蹤', module: 'CORE', href: '/', category: 'page', tags: ['KPI', 'GRI', '5T'], icon: <BarChart3 size={14} /> },
  { id: '2', title: 'SustainWrite', titleZh: '永續撰寫', description: '208頁 GRI 2021 完整框架，SPIRIT AI 人格協助撰寫，5T 封印', module: 'CORE', href: '/editor', category: 'page', tags: ['GRI', 'AI', 'ZKP'], icon: <FileText size={14} /> },
  { id: '3', title: 'Evidence Vault', titleZh: '證據金庫', description: '佐證文件管理、ZKP 零知識驗算、SHA-256 Hash Lock', module: 'GOVERNANCE', href: '/vault', category: 'page', tags: ['ZKP', 'SHA-256', '5T'], icon: <Shield size={14} /> },
  { id: '4', title: 'Environmental Hub', titleZh: '環境指揮', description: 'GHG 盤查、能源管理、水資源、廢棄物，GRI 302-306', module: 'E-S-G', href: '/environmental', category: 'page', tags: ['GHG', 'GRI 305', 'ISO 14064'], icon: <Leaf size={14} /> },
  { id: '5', title: 'GRI Tracker', titleZh: 'GRI 追蹤器', description: '28項 GRI 2021 指標狀態追蹤，完成度儀表板，CSV 匯出', module: 'REPORT', href: '/gri-tracker', category: 'page', tags: ['GRI 2021', '合規', '追蹤'], icon: <BarChart3 size={14} /> },
  { id: '6', title: 'CBAM Calculator', titleZh: 'CBAM 試算器', description: '歐盟碳邊境稅試算，6大產業，年度費用計算', module: 'REPORT', href: '/cbam-calculator', category: 'page', tags: ['CBAM', 'EU', '碳稅'], icon: <Hash size={14} /> },
  { id: '7', title: 'Standards Library', titleZh: '規範書總庫', description: 'GRI/SASB/TCFD/ISSB/ISO/金管會/CSRD 規範索引', module: 'REPORT', href: '/standards', category: 'page', tags: ['GRI', 'TCFD', 'ISSB', 'ISO'], icon: <BookOpen size={14} /> },
  { id: '8', title: 'Net-Zero Roadmap', titleZh: '淨零路線圖', description: 'SBTi 減碳里程碑、碳排趨勢圖、2030 目標追蹤', module: 'INSIGHTS', href: '/roadmap', category: 'page', tags: ['SBTi', '淨零', '2030'], icon: <Leaf size={14} /> },
  { id: '9', title: 'Digital Twin', titleZh: '數位分身', description: '知識倉庫 RAG、道德 DNA 建模、主權帳本、AI 對話', module: 'CORE', href: '/digital-twin', category: 'page', tags: ['RAG', 'AI', '知識庫'], icon: <Hash size={14} /> },
  { id: '10', title: 'Health Check', titleZh: '企業健檢', description: '15題 ESG 自評、E/S/G 分類評分、90天改善路線圖', module: 'CORE', href: '/health-check', category: 'page', tags: ['健檢', 'ESG', '路線圖'], icon: <BarChart3 size={14} /> },
  { id: '11', title: 'GRI 305-1', titleZh: '直接溫室氣體排放', description: '範疇一直接排放量，公式：Σ(活動數據 × 排放係數)，單位：tCO₂e', module: 'GRI', href: '/gri-tracker', category: 'gri', tags: ['GRI 305', '範疇一', 'tCO₂e'], icon: <Leaf size={14} /> },
  { id: '12', title: 'GRI 305-2', titleZh: '能源間接排放', description: '範疇二電力排放，公式：用電度數 × 電力排放係數', module: 'GRI', href: '/gri-tracker', category: 'gri', tags: ['GRI 305', '範疇二', '電力'], icon: <Leaf size={14} /> },
  { id: '13', title: 'GRI 302-1', titleZh: '組織內部能源消耗', description: '燃料消耗 + 外購電力，單位：GJ', module: 'GRI', href: '/gri-tracker', category: 'gri', tags: ['GRI 302', '能源', 'GJ'], icon: <BarChart3 size={14} /> },
  { id: '14', title: 'TCFD', titleZh: '氣候相關財務揭露', description: '治理、策略、風險管理、指標與目標四大支柱', module: 'Standard', href: '/standards', category: 'standard', tags: ['TCFD', '氣候', '財務'], icon: <BookOpen size={14} /> },
  { id: '15', title: 'ISSB S2', titleZh: 'IFRS S2 氣候揭露', description: 'Scope 1/2/3 排放、氣候情境分析、碳強度指標', module: 'Standard', href: '/standards', category: 'standard', tags: ['ISSB', 'IFRS', 'S2'], icon: <BookOpen size={14} /> },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_ITEMS.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.titleZh.includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.module.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach(r => {
      if (!map[r.module]) map[r.module] = [];
      map[r.module].push(r);
    });
    return map;
  }, [results]);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>全域搜尋</h1>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋頁面、GRI 指標、規範、功能…"
            style={{ width: '100%', paddingLeft: '44px', padding: '14px 16px 14px 44px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            onFocus={e => e.target.style.borderColor = '#003262'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        {query && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>找到 {results.length} 個結果</div>}
      </div>

      {!query && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', marginBottom: '14px' }}>快速訪問</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {ALL_ITEMS.slice(0, 8).map(item => (
              <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '14px 16px', background: 'white', borderRadius: '12px', border: '1.5px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#003262'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px', color: '#003262' }}>
                    {item.icon}
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af' }}>{item.module}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>{item.titleZh}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{item.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af' }}>
          <Search size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <div style={{ fontSize: '16px', fontWeight: 600 }}>找不到「{query}」相關結果</div>
          <div style={{ fontSize: '13px', marginTop: '8px' }}>試試其他關鍵字，如 GRI、CBAM、ZKP、碳排放</div>
        </div>
      )}

      {Object.entries(grouped).map(([module, items]) => (
        <div key={module} style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ height: '1px', flex: 1, background: '#e5e7eb' }} />
            {module}
            <div style={{ height: '1px', flex: 1, background: '#e5e7eb' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {items.map(item => (
              <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '14px 16px', background: 'white', borderRadius: '12px', border: '1.5px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#003262'; e.currentTarget.style.background = '#f0f7ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#f3f4f6', color: '#003262', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{item.titleZh}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {item.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', color: '#9ca3af' }}>載入中…</div>}>
      <SearchContent />
    </Suspense>
  );
}
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen, Search, Filter, ExternalLink, ChevronRight,
  CheckCircle, Clock, AlertTriangle, Shield, Leaf, Globe,
  FileText, BarChart3, Calendar, Star, Info, ChevronDown,
  Download, Zap, Hash, Scale
} from 'lucide-react';
import {
  STANDARDS, STANDARD_CATEGORIES, CATEGORY_COLORS,
  COMPLIANCE_TIMELINE, type Standard, type DisclosureItem
} from '../../lib/standards-data';

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
      background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
    }}>
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:     { label: '現行有效', color: '#16a34a', bg: '#dcfce7' },
    draft:      { label: '草案中',   color: '#d97706', bg: '#fef3c7' },
    superseded: { label: '已廢止',   color: '#9ca3af', bg: '#f3f4f6' },
  };
  const cfg = map[status] ?? map.active;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
      background: cfg.bg, color: cfg.color,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function DisclosureCard({ item }: { item: DisclosureItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: '12px 16px', background: open ? '#eff6ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
      >
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#003262', fontFamily: 'monospace', flexShrink: 0 }}>{item.code}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{item.titleZh}</div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{item.title}</div>
        </div>
        <span style={{
          padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 600,
          background: item.required ? '#fef2f2' : '#f3f4f6',
          color: item.required ? '#dc2626' : '#9ca3af',
        }}>
          {item.required ? '必填' : '選填'}
        </span>
        {open ? <ChevronDown size={14} color="#9ca3af" /> : <ChevronRight size={14} color="#9ca3af" />}
      </div>
      {open && (
        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', background: '#fafbfc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>指引說明</div>
            <div style={{ fontSize: '13px', color: '#374151' }}>{item.guidance}</div>
          </div>
          {item.formula && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', marginBottom: '3px' }}>計算公式</div>
              <code style={{ fontSize: '12px', color: '#374151', fontFamily: 'monospace' }}>{item.formula}</code>
              {item.unit && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#9ca3af' }}>單位：{item.unit}</span>}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>數據點</div>
              {item.dataPoints.map((dp, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px', fontSize: '12px', color: '#374151' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#003262', flexShrink: 0 }} />
                  {dp}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>所需佐證</div>
              {item.evidenceRequired.map((ev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px', fontSize: '12px', color: '#374151' }}>
                  <Shield size={9} color="#22c55e" style={{ flexShrink: 0 }} />
                  {ev}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StandardCard({ standard, onClick }: { standard: Standard; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb',
        padding: '20px', cursor: 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#003262';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,50,98,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <CategoryBadge category={standard.category} />
          <StatusBadge status={standard.status} />
          {standard.mandatory && (
            <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: '#fef2f2', color: '#dc2626' }}>
              強制揭露
            </span>
          )}
        </div>
        <ChevronRight size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
      </div>

      <div style={{ fontSize: '14px', fontWeight: 800, color: '#003262', marginBottom: '4px' }}>{standard.code}</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginBottom: '8px', lineHeight: 1.4 }}>{standard.nameZh}</div>
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '14px' }}>{standard.summary.slice(0, 100)}…</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#9ca3af' }}>
          <Calendar size={11} />
          生效：{standard.effectiveDate}
        </div>
        <div style={{ fontSize: '11px', color: '#003262', fontWeight: 600 }}>
          {standard.disclosureItems.length} 項揭露要求
        </div>
      </div>

      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>適用對象</div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {standard.applicableTo.slice(0, 2).map((a, i) => (
            <span key={i} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', background: '#f3f4f6', color: '#374151' }}>{a}</span>
          ))}
          {standard.applicableTo.length > 2 && (
            <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', background: '#f3f4f6', color: '#9ca3af' }}>+{standard.applicableTo.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StandardDetail({ standard, onClose }: { standard: Standard; onClose: () => void }) {
  const colors = CATEGORY_COLORS[standard.category] ?? { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px 28px', background: `linear-gradient(135deg, ${colors.bg}, white)`, borderBottom: '1px solid #e5e7eb', borderRadius: '20px 20px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <CategoryBadge category={standard.category} />
                <StatusBadge status={standard.status} />
                {standard.mandatory && (
                  <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: '#fef2f2', color: '#dc2626' }}>強制揭露</span>
                )}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a2e', marginBottom: '4px' }}>{standard.code}</div>
              <div style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>{standard.nameZh}</div>
            </div>
            <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ×
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>規範摘要</div>
            <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, background: '#f9fafb', borderRadius: '10px', padding: '14px' }}>
              {standard.summary}
            </div>
          </div>

          {/* Key Requirements */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px' }}>核心要求</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {standard.keyRequirements.map((req, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 12px', background: '#f9fafb', borderRadius: '8px', fontSize: '13px', color: '#374151' }}>
                  <CheckCircle size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: '1px' }} />
                  {req}
                </div>
              ))}
            </div>
          </div>

          {/* Disclosure Items */}
          {standard.disclosureItems.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px' }}>
                揭露項目 ({standard.disclosureItems.length})
              </div>
              {standard.disclosureItems.map((item) => (
                <DisclosureCard key={item.code} item={item} />
              ))}
            </div>
          )}

          {/* Applicable To */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>適用對象</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {standard.applicableTo.map((a, i) => (
                <span key={i} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: '#f3f4f6', color: '#374151', fontWeight: 500 }}>{a}</span>
              ))}
            </div>
          </div>

          {/* Related Standards */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>相關規範</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {standard.relatedStandards.map((rel, i) => (
                <span key={i} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: '#eff6ff', color: '#003262', fontWeight: 600 }}>{rel}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <a href={standard.officialUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'linear-gradient(135deg, #003262, #3b7ea1)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}>
              <ExternalLink size={14} />前往官方文件
            </a>
            <Link href="/editor" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 20px', background: '#f3f4f6', color: '#374151', textDecoration: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
              <FileText size={14} />套用至撰寫
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StandardsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Standard | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'timeline' | 'matrix'>('library');

  const filtered = useMemo(() => {
    let list = STANDARDS;
    if (activeCategory !== 'all') list = list.filter(s => s.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.code.toLowerCase().includes(q) ||
        s.nameZh.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const mandatoryCount = STANDARDS.filter(s => s.mandatory).length;
  const activeCount = STANDARDS.filter(s => s.status === 'active').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #003262, #3b7ea1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>永續規範書總庫</h1>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Standards Library · GRI · SASB · TCFD · ISSB · ISO · 金管會 · 歐盟法規
            </p>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px' }}>
          {[
            { label: '規範總數', value: STANDARDS.length, icon: <BookOpen size={16} />, color: '#003262' },
            { label: '現行有效', value: activeCount, icon: <CheckCircle size={16} />, color: '#22c55e' },
            { label: '強制揭露', value: mandatoryCount, icon: <AlertTriangle size={16} />, color: '#dc2626' },
            { label: '申報時程', value: COMPLIANCE_TIMELINE.length, icon: <Calendar size={16} />, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e5e7eb', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '4px', borderRadius: '10px', marginBottom: '20px', width: 'fit-content' }}>
        {[
          { id: 'library', label: '規範庫', icon: <BookOpen size={14} /> },
          { id: 'timeline', label: '申報時程', icon: <Calendar size={14} /> },
          { id: 'matrix', label: '對照矩陣', icon: <BarChart3 size={14} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              background: activeTab === t.id ? 'white' : 'transparent',
              color: activeTab === t.id ? '#003262' : '#6b7280',
              boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Tab: Library */}
      {activeTab === 'library' && (
        <>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {STANDARD_CATEGORIES.map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                    padding: '6px 14px', borderRadius: '8px', border: '1.5px solid',
                    borderColor: active ? '#003262' : '#e5e7eb',
                    background: active ? '#003262' : 'white',
                    color: active ? 'white' : '#374151',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {cat.label}
                  <span style={{ padding: '1px 5px', borderRadius: '4px', fontSize: '10px', background: active ? 'rgba(255,255,255,0.25)' : '#f3f4f6', color: active ? 'white' : '#9ca3af' }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜尋規範名稱、代碼或說明…"
              style={{ width: '100%', paddingLeft: '38px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filtered.map(std => (
              <StandardCard key={std.id} standard={std} onClick={() => setSelected(std)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af' }}>
              <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <div style={{ fontSize: '16px', fontWeight: 600 }}>找不到符合條件的規範</div>
            </div>
          )}
        </>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #e5e7eb', padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e', marginBottom: '20px' }}>📅 ESG 申報合規時程表</div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '59px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, #003262, #e5e7eb)' }} />
            {COMPLIANCE_TIMELINE.map((item, i) => {
              const colors = CATEGORY_COLORS[item.category] ?? { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
              return (
                <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '60px', flexShrink: 0, textAlign: 'right' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#003262' }}>{item.year}</span>
                  </div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.urgent ? '#dc2626' : '#003262', flexShrink: 0, marginTop: '4px', position: 'relative', zIndex: 1, boxShadow: item.urgent ? '0 0 0 4px #fee2e2' : '0 0 0 4px #dbeafe' }} />
                  <div style={{ flex: 1, background: item.urgent ? '#fef2f2' : '#f9fafb', borderRadius: '10px', padding: '12px 16px', border: `1px solid ${item.urgent ? '#fecaca' : '#e5e7eb'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <CategoryBadge category={item.category} />
                      {item.urgent && (
                        <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: '#fef2f2', color: '#dc2626' }}>
                          🔴 緊急
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#1f2937', lineHeight: 1.5 }}>{item.event}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Matrix */}
      {activeTab === 'matrix' && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>📊 規範對照矩陣</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>各規範框架與揭露主題的對應關係</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6b7280', borderBottom: '1px solid #e5e7eb', minWidth: '140px' }}>揭露主題</th>
                  {['GRI 2021', 'GRI 305', 'TCFD', 'ISSB S2', 'ISO 14064', '金管會', 'CSRD'].map(h => (
                    <th key={h} style={{ padding: '12px 10px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { topic: '治理結構', gri2021: true, gri305: false, tcfd: true, issbS2: true, iso14064: false, fsc: true, csrd: true },
                  { topic: 'GHG 範疇一排放', gri2021: false, gri305: true, tcfd: true, issbS2: true, iso14064: true, fsc: true, csrd: true },
                  { topic: 'GHG 範疇二排放', gri2021: false, gri305: true, tcfd: true, issbS2: true, iso14064: true, fsc: true, csrd: true },
                  { topic: 'GHG 範疇三排放', gri2021: false, gri305: true, tcfd: false, issbS2: true, iso14064: true, fsc: false, csrd: true },
                  { topic: '氣候情境分析', gri2021: false, gri305: false, tcfd: true, issbS2: true, iso14064: false, fsc: true, csrd: true },
                  { topic: '能源管理', gri2021: false, gri305: true, tcfd: false, issbS2: false, iso14064: false, fsc: true, csrd: true },
                  { topic: '水資源管理', gri2021: false, gri305: false, tcfd: false, issbS2: false, iso14064: false, fsc: false, csrd: true },
                  { topic: '員工揭露', gri2021: true, gri305: false, tcfd: false, issbS2: false, iso14064: false, fsc: true, csrd: true },
                  { topic: '重大性評估', gri2021: true, gri305: false, tcfd: false, issbS2: true, iso14064: false, fsc: true, csrd: true },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>{row.topic}</td>
                    {[row.gri2021, row.gri305, row.tcfd, row.issbS2, row.iso14064, row.fsc, row.csrd].map((val, j) => (
                      <td key={j} style={{ padding: '12px 10px', textAlign: 'center' }}>
                        {val
                          ? <CheckCircle size={16} color="#22c55e" style={{ margin: '0 auto' }} />
                          : <span style={{ color: '#e5e7eb', fontSize: '14px' }}>—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && <StandardDetail standard={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
'use client';
import { useState, useMemo } from 'react';
import {
  Globe, Database, TrendingUp, Shield, AlertTriangle,
  Search, Filter, ExternalLink, ChevronDown, ChevronRight,
  Activity, Zap, Eye, Target, BarChart3, Layers,
  BookOpen, Package, MapPin, Ship, DollarSign, Users,
  CheckCircle, ArrowUpRight, Info, Star, Radio
} from 'lucide-react';
import {
  DATA_SOURCES, INTEL_MODULES, GROUP_COLORS, GROUP_LABELS,
  CASE_STUDY, type DataSource, type IntelModule
} from '../../lib/data-sources-data';

const GROUP_ICONS: Record<string, any> = {
  A: Globe, B: BookOpen, C: Shield, D: Target,
  E: DollarSign, F: Package, G: AlertTriangle,
  H: MapPin, I: Users
};

const MODULE_ICONS: Record<string, any> = {
  M1: Radio, M2: Eye, M3: BarChart3, M4: Activity,
  M5: Target, M6: Ship, M7: Star, M8: TrendingUp,
  M9: AlertTriangle, M10: CheckCircle
};

export default function DataSourcesPage() {
  const [activeTab, setActiveTab] = useState<'sources' | 'modules' | 'case' | 'map'>('sources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<IntelModule | null>(null);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const groups = useMemo(() => {
    const g = new Set(DATA_SOURCES.map(s => s.groupCode));
    return ['all', ...Array.from(g)];
  }, []);

  const filteredSources = useMemo(() => {
    return DATA_SOURCES.filter(s => {
      const matchGroup = selectedGroup === 'all' || s.groupCode === selectedGroup;
      const matchSearch = !searchQuery ||
        s.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchGroup && matchSearch;
    });
  }, [selectedGroup, searchQuery]);

  const groupStats = useMemo(() => {
    const stats: Record<string, number> = {};
    DATA_SOURCES.forEach(s => {
      stats[s.groupCode] = (stats[s.groupCode] || 0) + 1;
    });
    return stats;
  }, []);

  const tabs = [
    { id: 'sources', label: '資料來源庫', icon: Database, count: DATA_SOURCES.length },
    { id: 'modules', label: '商情偵測模組', icon: Layers, count: INTEL_MODULES.length },
    { id: 'case', label: '個案展示', icon: Activity, count: null },
    { id: 'map', label: '模組串聯地圖', icon: Target, count: null },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #003262 0%, #1d4ed8 50%, #003262 100%)',
        padding: '2.5rem 2rem 2rem',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(253,181,21,0.2)', border: '1px solid rgba(253,181,21,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Radio size={28} style={{ color: '#FDB515' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem', lineHeight: 1.2 }}>
                ESG 情報中心
              </h1>
              <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>
                Data Sources & Intelligence Hub · 永續商情偵測 · M1–M10 模組
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {[
              { label: '資料來源', value: DATA_SOURCES.length + '+', icon: Database },
              { label: '商情模組', value: '10', icon: Layers },
              { label: '來源類別', value: '9', icon: Filter },
              { label: '覆蓋框架', value: '15+', icon: Shield },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '1rem', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <stat.icon size={16} style={{ color: '#FDB515' }} />
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#FDB515' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '1rem 1.25rem', border: 'none', cursor: 'pointer',
                  fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab.id ? '2px solid #003262' : '2px solid transparent',
                  background: 'transparent',
                  color: activeTab === tab.id ? '#003262' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.count !== null && (
                  <span style={{
                    background: activeTab === tab.id ? '#003262' : 'var(--bg-tertiary)',
                    color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                    borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: '600'
                  }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>

        {/* ─── Tab: Data Sources ─── */}
        {activeTab === 'sources' && (
          <div>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="搜尋機構、內容類型、標籤..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                    border: '1px solid var(--border-light)', borderRadius: '8px',
                    background: 'var(--bg-secondary)', fontSize: '0.875rem', color: 'var(--text-primary)',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {groups.map(g => {
                  const label = g === 'all' ? '全部' : GROUP_LABELS[g] || g;
                  const Icon = g === 'all' ? Database : GROUP_ICONS[g] || Globe;
                  const color = g === 'all' ? '#003262' : GROUP_COLORS[g];
                  const isActive = selectedGroup === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setSelectedGroup(g)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.5rem 0.875rem', borderRadius: '8px', cursor: 'pointer',
                        border: isActive ? `2px solid ${color}` : '1px solid var(--border-light)',
                        background: isActive ? `${color}15` : 'var(--bg-secondary)',
                        color: isActive ? color : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={13} />
                      {label}
                      {g !== 'all' && (
                        <span style={{
                          background: isActive ? color : 'var(--bg-tertiary)',
                          color: isActive ? '#fff' : 'var(--text-muted)',
                          borderRadius: '999px', padding: '0 5px', fontSize: '0.7rem', fontWeight: '600'
                        }}>{groupStats[g] || 0}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(['grid', 'table'] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{
                    padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
                    border: '1px solid var(--border-light)',
                    background: viewMode === mode ? '#003262' : 'var(--bg-secondary)',
                    color: viewMode === mode ? '#fff' : 'var(--text-muted)'
                  }}>
                    {mode === 'grid' ? '格狀' : '表格'}
                  </button>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              顯示 {filteredSources.length} / {DATA_SOURCES.length} 筆來源
            </p>

            {viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {filteredSources.map(source => {
                  const Icon = GROUP_ICONS[source.groupCode] || Globe;
                  const color = GROUP_COLORS[source.groupCode] || '#003262';
                  return (
                    <div key={source.id} style={{
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                      borderRadius: '12px', padding: '1.25rem',
                      borderLeft: `3px solid ${color}`,
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Icon size={16} style={{ color }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {source.groupCode} · {GROUP_LABELS[source.groupCode]}
                            </div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{source.updateFreq}</div>
                          </div>
                        </div>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', lineHeight: 1 }}>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                        {source.institution}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                        {source.contentType}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {source.tags.slice(0, 4).map(tag => (
                          <span key={tag} style={{
                            padding: '2px 8px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: '500',
                            background: `${color}12`, color, border: `1px solid ${color}30`
                          }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-light)' }}>
                      {['#', '類別', '機構', '內容類型', '更新頻率', '連結'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSources.map((s, i) => {
                      const color = GROUP_COLORS[s.groupCode] || '#003262';
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)' }}>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.id}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600',
                              background: `${color}15`, color
                            }}>{s.groupCode}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{s.institution}</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>{s.contentType}</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{s.updateFreq}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#003262', fontSize: '0.8rem', textDecoration: 'none' }}>
                              <ExternalLink size={12} /> 開啟
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Tab: Intel Modules ─── */}
        {activeTab === 'modules' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: selectedModule ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
              {/* Module Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', alignContent: 'start' }}>
                {INTEL_MODULES.map(mod => {
                  const Icon = MODULE_ICONS[mod.code] || Activity;
                  const isSelected = selectedModule?.id === mod.id;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => setSelectedModule(isSelected ? null : mod)}
                      style={{
                        background: 'var(--bg-secondary)', border: isSelected ? `2px solid ${mod.color}` : '1px solid var(--border-light)',
                        borderRadius: '14px', padding: '1.25rem', cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? `0 0 0 3px ${mod.color}20` : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: `${mod.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Icon size={20} style={{ color: mod.color }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: mod.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{mod.code}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{mod.name}</div>
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)', transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {mod.nameZh}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {mod.purpose}
                      </div>
                      <div style={{
                        marginTop: '1rem', padding: '0.625rem 0.875rem', borderRadius: '8px',
                        background: `${mod.color}08`, border: `1px solid ${mod.color}20`,
                        fontSize: '0.75rem', color: mod.color, lineHeight: 1.4
                      }}>
                        <strong>ESG 對接：</strong>{mod.esgLink}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Module Detail Panel */}
              {selectedModule && (
                <div style={{
                  background: 'var(--bg-secondary)', border: `2px solid ${selectedModule.color}`,
                  borderRadius: '16px', padding: '1.5rem', alignSelf: 'start',
                  position: 'sticky', top: '80px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    {(() => {
                      const Icon = MODULE_ICONS[selectedModule.code] || Activity;
                      return (
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '14px',
                          background: `${selectedModule.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Icon size={24} style={{ color: selectedModule.color }} />
                        </div>
                      );
                    })()}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: selectedModule.color, fontWeight: '700', textTransform: 'uppercase' }}>
                        {selectedModule.code} · {selectedModule.name}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedModule.nameZh}</div>
                    </div>
                  </div>

                  {[
                    { label: '主要輸入來源', items: selectedModule.inputs, color: '#3b7ea1' },
                    { label: '產出內容', items: selectedModule.outputs, color: '#27ae60' },
                    { label: '主要使用者', items: selectedModule.primaryUsers, color: '#8e44ad' },
                  ].map(section => (
                    <div key={section.label} style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: section.color, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {section.label}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {section.items.map((item, i) => (
                          <span key={i} style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem',
                            background: `${section.color}12`, color: section.color,
                            border: `1px solid ${section.color}25`
                          }}>{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div style={{
                    padding: '0.875rem', borderRadius: '10px',
                    background: `${selectedModule.color}10`, border: `1px solid ${selectedModule.color}30`
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: selectedModule.color, textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                      ESG GO 對接點
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {selectedModule.esgLink}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedModule(null)}
                    style={{
                      marginTop: '1rem', width: '100%', padding: '0.625rem',
                      border: '1px solid var(--border-light)', borderRadius: '8px',
                      background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)'
                    }}
                  >
                    關閉詳情
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Tab: Case Study ─── */}
        {activeTab === 'case' && (
          <div>
            {/* Case Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '16px', padding: '2rem', marginBottom: '2rem', color: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(253,181,21,0.2)', border: '1px solid rgba(253,181,21,0.4)', fontSize: '0.75rem', color: '#FDB515', fontWeight: '600' }}>
                  Full-stack Demo
                </div>
                <div style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', fontSize: '0.75rem', color: '#ccc' }}>
                  M1–M9 完整演示
                </div>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {CASE_STUDY.title}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                從地緣衝突到企業決策 Intelligence 鏈：九個模組如何串聯成完整的商情判讀
              </p>
            </div>

            {/* Conclusion Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #003262, #1d4ed8)', color: '#fff',
              borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem',
              display: 'flex', alignItems: 'flex-start', gap: '1rem'
            }}>
              <Zap size={20} style={{ color: '#FDB515', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>創價型 ESG 結論</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.6 }}>
                  這個主題考驗三件事——能源韌性、物流韌性、治理韌性。
                  ESG GO 不只報風險，而是把風險轉譯成董事會語言、供應鏈語言、財務語言，
                  以及最重要的，轉成能力升級與市場信任的機會語言。
                </div>
              </div>
            </div>

            {/* Module Findings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {CASE_STUDY.modules.map((item, idx) => {
                const mod = INTEL_MODULES.find(m => m.code === item.module);
                if (!mod) return null;
                const Icon = MODULE_ICONS[mod.code] || Activity;
                const isExpanded = expandedCase === item.module;
                return (
                  <div key={item.module} style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                    borderRadius: '14px', overflow: 'hidden',
                    borderLeft: `4px solid ${mod.color}`
                  }}>
                    <button
                      onClick={() => setExpandedCase(isExpanded ? null : item.module)}
                      style={{
                        width: '100%', padding: '1.25rem 1.5rem',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left'
                      }}
                    >
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                        background: `${mod.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon size={20} style={{ color: mod.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: mod.color, fontWeight: '700', textTransform: 'uppercase' }}>
                            {mod.code} · {mod.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>│ {mod.nameZh}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {item.finding}
                        </div>
                      </div>
                      <ChevronDown size={16} style={{
                        color: 'var(--text-muted)', flexShrink: 0,
                        transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'
                      }} />
                    </button>

                    {isExpanded && (
                      <div style={{
                        padding: '0 1.5rem 1.25rem', borderTop: '1px solid var(--border-light)'
                      }}>
                        <div style={{ paddingTop: '1rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
                            偵測信號
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            {item.signals.map((signal, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '0.625rem',
                                padding: '0.5rem 0.875rem', borderRadius: '8px',
                                background: `${mod.color}08`, border: `1px solid ${mod.color}20`
                              }}>
                                <div style={{
                                  width: '6px', height: '6px', borderRadius: '50%',
                                  background: mod.color, flexShrink: 0
                                }} />
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{signal}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{
                            marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)'
                          }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '600', textTransform: 'uppercase' }}>
                              ESG GO 對接點
                            </div>
                            <div style={{ fontSize: '0.8rem', color: mod.color }}>{mod.esgLink}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Tab: Module Map ─── */}
        {activeTab === 'map' && (
          <div>
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
              borderRadius: '16px', padding: '2rem', marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                M1–M10 商情偵測模組串聯地圖
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                從海量信號到可交辦行動包的完整 Intelligence 鏈
              </p>

              {/* Flow Visualization */}
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem', minWidth: '900px', paddingBottom: '1rem' }}>
                  {INTEL_MODULES.slice(0, 9).map((mod, idx) => {
                    const Icon = MODULE_ICONS[mod.code] || Activity;
                    return (
                      <div key={mod.id} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          flex: 1, background: `${mod.color}12`, border: `1px solid ${mod.color}30`,
                          borderRadius: '10px', padding: '0.875rem', textAlign: 'center'
                        }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', margin: '0 auto 0.5rem',
                            background: `${mod.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Icon size={18} style={{ color: mod.color }} />
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: mod.color }}>{mod.code}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{mod.nameZh}</div>
                        </div>
                        {idx < 8 && (
                          <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* M10 CTA */}
              <div style={{
                marginTop: '1.5rem',
                background: 'linear-gradient(135deg, #2c3e50, #34495e)', borderRadius: '12px',
                padding: '1.5rem', color: '#fff', textAlign: 'center'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px', margin: '0 auto 0.75rem',
                  background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CheckCircle size={24} style={{ color: '#FDB515' }} />
                </div>
                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.375rem' }}>M10 · 90天行動包</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  把 M1–M9 的信號與評分，轉成可交辦的 What / Why / What-to-do / Evidence Pack
                </div>
              </div>
            </div>

            {/* Data Sources to Modules Mapping */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem'
            }}>
              {[
                {
                  title: '輸入層：9 大來源群組',
                  color: '#003262',
                  items: Object.entries(GROUP_LABELS).map(([k, v]) => `${k}. ${v}`)
                },
                {
                  title: '處理層：10 商情模組',
                  color: '#FDB515',
                  items: INTEL_MODULES.map(m => `${m.code} ${m.nameZh}`)
                },
                {
                  title: '輸出層：ESG GO 行動',
                  color: '#27ae60',
                  items: [
                    '即時儀表板 KPI 更新',
                    '任務指揮中心 派工',
                    '審計日誌 5T 自動記錄',
                    '永續撰寫 草稿生成',
                    '董事會一頁式報告',
                    '90天合規待辦清單',
                    '供應鏈風險評分',
                    '機會清單與補助匹配',
                    '競品對標雷達圖',
                    '證據金庫 Hash Lock'
                  ]
                }
              ].map(section => (
                <div key={section.title} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                  borderRadius: '12px', padding: '1.25rem',
                  borderTop: `3px solid ${section.color}`
                }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: section.color, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {section.title}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {section.items.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '0.375rem 0.625rem',
                        borderRadius: '6px', background: `${section.color}06`
                      }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: section.color, flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
/**
 * Daily Observer Report — 永續觀察者日報專區
 * Page /daily — Today's ESG digest with archive & severity filter
 * WHW: Why — Users need to browse historical reports and filter by severity
 *      How — Date selector + severity toggles + archive API
 *      What — Full archive browsing with real-time filtering
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Solid Card Tokens
const SC = {
  bg: '#0A0F1A',
  surface: '#111827',
  surfaceHover: '#1E293B',
  border: '#1E3A5F',
  teal: '#009EB0',
  gold: '#D4AF37',
  zkp: '#3B82F6',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
};

// Types
interface ReportItem {
  id: string;
  itemType: string;
  title: string;
  summary: string;
  sourceName: string | null;
  sourceUrl: string | null;
  severity: string;
  esgPillar: string;
}

interface DailyReportData {
  id: string;
  reportDate: string;
  title: string;
  summary: string;
  highlights: string[];
  tagStats: Record<string, number>;
  sourceCount: number;
  alertCount: number;
  topSources: string[];
  status: string;
  items: ReportItem[];
  editorNote: string | null;
}

// Severity badge colors
const SEV_COLORS: Record<string, string> = {
  low: SC.success,
  medium: SC.zkp,
  high: SC.warning,
  critical: SC.error,
};

const TYPE_ICONS: Record<string, string> = {
  regulation: '📜',
  report: '📊',
  company: '🏢',
  topic: '🔍',
  opinion: '💬',
};

function csvEscape(value: string): string {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 4,
      background: `${SEV_COLORS[severity] || SC.textMuted}22`,
      color: SEV_COLORS[severity] || SC.textMuted,
    }}>
      {severity === 'low' ? '低' : severity === 'medium' ? '中' : severity === 'high' ? '高' : '急'}
    </span>
  );
}

function ReportItemCard({ item }: { item: ReportItem }) {
  return (
    <div style={{
      background: SC.surfaceHover,
      border: `1px solid ${SC.border}`,
      borderRadius: 8,
      padding: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      transition: 'border-color 0.2s',
    }}>
      <span style={{ fontSize: 22 }}>{TYPE_ICONS[item.itemType] || '📄'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <a
            href={item.sourceUrl || '#'}
            target="_blank"
            rel="noopener"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: SC.text,
              textDecoration: 'none',
            }}
          >
            {item.title}
          </a>
          <SeverityBadge severity={item.severity} />
        </div>
        <p style={{ fontSize: 13, color: SC.textSecondary, margin: '4px 0' }}>
          {item.summary}
        </p>
        {item.sourceName && (
          <span style={{ fontSize: 11, color: SC.teal }}>
            📍 {item.sourceName}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DailyReportPage() {
  const [report, setReport] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [archiveDates, setArchiveDates] = useState<string[]>([]);
  const [evolution, setEvolution] = useState({ level: 1, xp: 0, nextXp: 120 });
  const [evolving, setEvolving] = useState(false);

  // Severity-filtered items
  const filteredItems = useMemo(() => {
    if (!report) return [];
    if (severityFilter === 'all') return report.items;
    return report.items.filter(item => item.severity === severityFilter);
  }, [report, severityFilter]);

  // Export helpers
  const exportCSV = useCallback(() => {
    if (!report) return;
    const headers = ['id', 'type', 'title', 'summary', 'source', 'source_url', 'severity', 'esg_pillar'];
    const rows = filteredItems.map(item => [
      item.id,
      item.itemType,
      csvEscape(item.title),
      csvEscape(item.summary),
      csvEscape(item.sourceName || ''),
      item.sourceUrl || '',
      item.severity,
      item.esgPillar,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csv, `daily-report-${selectedDate}.csv`, 'text/csv');
  }, [report, filteredItems, selectedDate]);

  const exportJSON = useCallback(() => {
    if (!report) return;
    const data = {
      reportDate: report.reportDate,
      title: report.title,
      summary: report.summary,
      highlights: report.highlights,
      topSources: report.topSources,
      sourceCount: report.sourceCount,
      alertCount: report.alertCount,
      items: filteredItems,
      exportedAt: new Date().toISOString(),
    };
    downloadFile(JSON.stringify(data, null, 2), `daily-report-${selectedDate}.json`, 'application/json');
  }, [report, filteredItems, selectedDate]);

  const fetchReport = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/daily-report?date=${date}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setReport(null);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArchiveDates = useCallback(async () => {
    try {
      const res = await fetch('/api/daily-report?limit=30');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reports) {
          const dates = [...new Set(data.reports.map((r: DailyReportData) => r.reportDate))] as string[];
          setArchiveDates(dates.sort().reverse());
        }
      }
    } catch {
      // Silent fail — archive is optional
    }
  }, []);

  useEffect(() => {
    fetchReport(selectedDate);
    fetchArchiveDates();
  }, [selectedDate, fetchReport, fetchArchiveDates]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const res = await fetch('/api/daily-report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
        fetchArchiveDates();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  // Severity counts
  const severityCounts = useMemo(() => {
    if (!report) return {};
    const counts: Record<string, number> = { all: report.items.length };
    for (const item of report.items) {
      counts[item.severity] = (counts[item.severity] || 0) + 1;
    }
    return counts;
  }, [report]);

  const evolveDaily = async () => {
    if (evolving) return;
    setEvolving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      setEvolution(prev => {
        const nextXp = prev.nextXp + (typeof report?.alertCount === 'number' ? Math.min(report.alertCount * 2, 260) : 0);
        const xp = prev.xp + 15;
        let level = prev.level;
        let cap = prev.nextXp;
        while (xp >= cap) {
          level += 1;
          cap = Math.floor(cap * 1.18);
        }
        return { level, xp: xp % cap, nextXp: cap };
      });
    } finally {
      setEvolving(false);
    }
  };

  // Generate date options (last 30 days)
  const _dateOptions = useMemo(() => {
    const dates: string[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  if (loading && !report) {
    return (
      <div style={{ background: SC.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${SC.teal}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ color: SC.teal, fontSize: 14 }}>載入永續動態...</div>
      </div>
    );
  }

  return (
    <div style={{ background: SC.bg, minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <header style={{
          borderBottom: `1px solid ${SC.border}`,
          paddingBottom: 16,
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <h1 style={{ color: SC.text, fontSize: 24, fontWeight: 700 }}>
              📰 永續觀察者日報 — ESGGO ∞ Evolution
            </h1>
            <p style={{ color: SC.textSecondary, fontSize: 14, marginTop: 4 }}>
              {report?.reportDate || selectedDate} · ESG 動態觀測 · 永續發展無限進化
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                padding: '6px 12px',
                background: SC.surface,
                border: `1px solid ${SC.border}`,
                borderRadius: 8,
                color: SC.text,
                fontSize: 13,
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                padding: '8px 16px',
                background: generating ? SC.surfaceHover : SC.teal,
                color: SC.bg,
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: generating ? 'not-allowed' : 'pointer',
                opacity: generating ? 0.6 : 1,
              }}
            >
              {generating ? '生成中...' : '🔄 重新生成'}
            </button>
            {report && (
              <>
                <button
                  onClick={exportCSV}
                  style={{
                    padding: '8px 12px',
                    background: SC.surface,
                    color: SC.gold,
                    border: `1px solid ${SC.gold}40`,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="匯出 CSV"
                >
                  CSV
                </button>
                <button
                  onClick={exportJSON}
                  style={{
                    padding: '8px 12px',
                    background: SC.surface,
                    color: SC.zkp,
                    border: `1px solid ${SC.zkp}40`,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="匯出 JSON"
                >
                  JSON
                </button>
              </>
            )}
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div style={{
            background: `${SC.error}15`,
            border: `1px solid ${SC.error}40`,
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: SC.error, fontSize: 13 }}>✕ {error}</span>
            <button
              onClick={() => { setError(null); fetchReport(selectedDate); }}
              style={{ color: SC.error, fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              重試
            </button>
          </div>
        )}

        {/* Archive Dates (if available) */}
        {archiveDates.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: SC.textMuted, marginBottom: 6 }}>📅 歷史封存</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {archiveDates.slice(0, 10).map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    background: date === selectedDate ? SC.teal : SC.surface,
                    color: date === selectedDate ? SC.bg : SC.textSecondary,
                    border: `1px solid ${date === selectedDate ? SC.teal : SC.border}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        )}

        {report ? (
          <>
            {/* Summary Card */}
            <div style={{
              background: SC.surface,
              border: `1px solid ${SC.border}`,
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
            }}>
              <p style={{ fontSize: 15, color: SC.textSecondary, lineHeight: 1.7 }}>
                {report.summary}
              </p>
              <div style={{
                display: 'flex',
                gap: 24,
                marginTop: 16,
                paddingTop: 16,
                borderTop: `1px solid ${SC.border}`,
                fontSize: 14,
                color: SC.textMuted,
              }}>
                <span>📊 資訊源 <strong style={{ color: SC.teal }}>{report.sourceCount}</strong></span>
                <span>🔔 快訊 <strong style={{ color: SC.gold }}>{report.alertCount}</strong></span>
                <span>📅 {report.reportDate}</span>
              </div>
            </div>

            {/* ESGGO 今日進化 */}
            <div style={{
              background: `${SC.zkp}12`,
              border: `1px solid ${SC.zkp}40`,
              borderRadius: 12,
              padding: 16,
              marginBottom: 18,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: SC.textSecondary }}>🧬 ESGGO 今日進化</div>
                <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                  <div>
                    <div style={{ fontSize: 10, color: SC.textMuted }}>LEVEL</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: SC.gold }}>{evolution.level}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: SC.textMuted }}>XP</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: SC.teal }}>{evolution.xp}/{evolution.nextXp}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={evolveDaily}
                disabled={evolving}
                style={{
                  padding: '8px 18px',
                  background: evolving ? SC.surfaceHover : `${SC.zkp}25`,
                  color: SC.zkp,
                  border: `1px solid ${SC.zkp}50`,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: evolving ? 'not-allowed' : 'pointer',
                  opacity: evolving ? 0.7 : 1,
                }}
              >
                {evolving ? '🧬 進化中...' : '🧬 啟動今日進化'}
              </button>
            </div>

            {/* Severity Filter */}
            {report.items.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    style={{
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      background: sev === severityFilter
                        ? (sev === 'all' ? SC.teal : SEV_COLORS[sev] || SC.teal)
                        : SC.surface,
                      color: sev === severityFilter ? SC.bg : SC.textSecondary,
                      border: `1px solid ${sev === severityFilter ? 'transparent' : SC.border}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    {sev === 'all' ? '全部' : sev === 'critical' ? '急' : sev === 'high' ? '高' : sev === 'medium' ? '中' : '低'}
                    {' '}({severityCounts[sev] || 0})
                  </button>
                ))}
              </div>
            )}

            {/* Highlights */}
            {report.highlights.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: SC.gold, marginBottom: 12 }}>
                  ⭐ 今日焦點
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.highlights.map((h, i) => (
                    <div key={i} style={{
                      background: `${SC.gold}08`,
                      border: `1px solid ${SC.gold}33`,
                      borderRadius: 8,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                      <span style={{ fontSize: 18 }}>{['🔴', '🟠', '🟡', '🟢', '🔵'][i] || '⚪'}</span>
                      <span style={{ fontSize: 14, color: SC.text }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News Items */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: SC.teal, marginBottom: 12 }}>
                📋 詳細動態 ({filteredItems.length})
              </h2>
              {filteredItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filteredItems.map(item => (
                    <ReportItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div style={{
                  background: SC.surface,
                  border: `1px solid ${SC.border}`,
                  borderRadius: 12,
                  padding: 32,
                  textAlign: 'center' as const,
                }}>
                  <p style={{ color: SC.textMuted }}>
                    {severityFilter === 'all' ? '今日尚無新動態。點擊「重新生成」按鈕重新整理資料。' : '此嚴重度下暫無項目'}
                  </p>
                </div>
              )}
            </div>

            {/* Top Sources */}
            {report.topSources.length > 0 && (
              <div style={{
                marginTop: 24,
                background: SC.surface,
                border: `1px solid ${SC.border}`,
                borderRadius: 12,
                padding: 16,
              }}>
                <h3 style={{ fontSize: 14, color: SC.textMuted, marginBottom: 8 }}>今日主要來源</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {report.topSources.map((s, i) => (
                    <span key={i} style={{
                      fontSize: 12,
                      padding: '4px 10px',
                      background: SC.surfaceHover,
                      borderRadius: 6,
                      color: SC.textSecondary,
                    }}>
                      📍 {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{
            background: SC.surface,
            border: `1px solid ${SC.border}`,
            borderRadius: 12,
            padding: 48,
            textAlign: 'center' as const,
          }}>
            <p style={{ color: SC.textSecondary, fontSize: 16, marginBottom: 16 }}>
              此日期尚無永續觀察日報
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                padding: '10px 24px',
                background: generating ? SC.surfaceHover : SC.teal,
                color: SC.bg,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {generating ? '生成中...' : '⚡ 立即生成'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

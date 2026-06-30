/**
 * Daily Observer Report — 永續觀察者日報專區
 * Page /daily — Today's ESG digest with archive
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const fetchToday = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/daily-report?today=true');
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      }
    } catch (e) {
      console.error('Failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/daily-report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0] }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      }
    } catch (e) {
      console.error('Failed to generate report:', e);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: SC.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: SC.teal, fontSize: 18 }}>載入今日永續動態...</div>
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
        }}>
          <div>
            <h1 style={{ color: SC.text, fontSize: 24, fontWeight: 700 }}>
              📰 永續觀察者日報
            </h1>
            <p style={{ color: SC.textSecondary, fontSize: 14, marginTop: 4 }}>
              {report?.reportDate || new Date().toLocaleDateString('zh-TW')} · ESG 動態觀測
            </p>
          </div>
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
        </header>

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

            {/* Highlights */}
            {report.highlights.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: SC.gold, marginBottom: 12 }}>
                  ? 今日焦點
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
                      <span style={{ fontSize: 18 }}>{['?', '?', '🟡', '🟢', '🔵'][i] || '⚪'}</span>
                      <span style={{ fontSize: 14, color: SC.text }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News Items */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: SC.teal, marginBottom: 12 }}>
                📋 詳細動態 ({report.items.length})
              </h2>
              {report.items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {report.items.map(item => (
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
                  <p style={{ color: SC.textMuted }}>今日尚無新動態。點擊「重新生成」按鈕重新整理資料。</p>
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
              今日尚無永續觀察日報
            </p>
            <button
              onClick={handleGenerate}
              style={{
                padding: '10px 24px',
                background: SC.teal,
                color: SC.bg,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⚡ 立即生成
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Force TS to recognize CSS property
const _cssProp: React.CSSProperties = { textAlign: 'center' };

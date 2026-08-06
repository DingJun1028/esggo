/**
 * Data Export Page — /export
 * WHW: Why — Users need to export ESG data for external analysis
 *      How — Connected to /api/data/export (CSV/JSON)
 *      What — Filter controls + download buttons for crawl data
 */
'use client';

import { useState, useCallback } from 'react';

const SC = {
  bg: '#0A0F1A',
  surface: '#111827',
  surfaceHover: '#1E293B',
  border: '#1E3A5F',
  teal: '#009EB0',
  gold: '#D4AF37',
  zkp: '#3B82F6',
  success: '#10B981',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
};

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

export default function DataExportPage() {
  const [format, setFormat] = useState<'json' | 'csv'>('csv');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number; format: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [evolution, setEvolution] = useState({ level: 1, xp: 0, nextXp: 120 });
  const [evolving, setEvolving] = useState(false);

  const handleExport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const params = new URLSearchParams();
      params.set('format', format);
      if (category) params.set('category', category);
      if (region) params.set('region', region);
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
      params.set('limit', limit.toString());

      const res = await fetch(`/api/data/export?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (format === 'csv') {
        const text = await res.text();
        const lines = text.split('\n').length - 1;
        downloadFile(text, `esg-data-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        setResult({ count: lines, format: 'csv' });
      } else {
        const data = await res.json();
        const items = data?.data?.length || data?.meta?.total || 0;
        downloadFile(JSON.stringify(data, null, 2), `esg-data-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        setResult({ count: items, format: 'json' });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [format, category, region, fromDate, toDate, limit]);

  const evolveExport = async () => {
    if (evolving) return;
    setEvolving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      setEvolution(prev => {
        const xp = prev.xp + 20;
        let level = prev.level;
        let nextXp = prev.nextXp;
        while (xp >= nextXp) {
          level += 1;
          nextXp = Math.floor(nextXp * 1.2);
        }
        return { level, xp: xp % nextXp, nextXp };
      });
    } finally {
      setEvolving(false);
    }
  };

  return (
    <div style={{ background: SC.bg, minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <header style={{ borderBottom: `1px solid ${SC.border}`, paddingBottom: 16, marginBottom: 24 }}>
          <h1 style={{ color: SC.text, fontSize: 24, fontWeight: 700 }}>
            📥 ESG 資料匯出 ∞ Evolution
          </h1>
          <p style={{ color: SC.textSecondary, fontSize: 14, marginTop: 4 }}>
            匯出 ESG 爬蟲資料為 CSV 或 JSON 格式 — 永續發展無限進化
          </p>
        </header>

        {/* ESGGO 資料進化 */}
        <div style={{
          background: `${SC.gold}12`,
          border: `1px solid ${SC.gold}40`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: SC.textSecondary }}>🧬 ESGGO 資料進化</div>
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
            onClick={evolveExport}
            disabled={evolving}
            style={{
              padding: '8px 18px',
              background: evolving ? SC.surfaceHover : `${SC.gold}22`,
              color: SC.gold,
              border: `1px solid ${SC.gold}55`,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: evolving ? 'not-allowed' : 'pointer',
              opacity: evolving ? 0.7 : 1,
            }}
          >
            {evolving ? '🧬 進化中...' : '🧬 啟動資料進化'}
          </button>
        </div>

        {/* Filter Form */}
        <div style={{ background: SC.surface, border: `1px solid ${SC.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: SC.textSecondary, marginBottom: 4 }}>匯出格式</label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value as 'json' | 'csv')}
                style={{ width: '100%', padding: '8px 12px', background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, color: SC.text, fontSize: 13 }}
              >
                <option value="csv">CSV (Excel)</option>
                <option value="json">JSON (程式整合)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: SC.textSecondary, marginBottom: 4 }}>資料類別</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, color: SC.text, fontSize: 13 }}
              >
                <option value="">全部類別</option>
                <option value="environmental">環境 (Environmental)</option>
                <option value="social">社會 (Social)</option>
                <option value="governance">治理 (Governance)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: SC.textSecondary, marginBottom: 4 }}>區域</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, color: SC.text, fontSize: 13 }}
              >
                <option value="">全部區域</option>
                <option value="tw">台灣</option>
                <option value="eu">歐盟</option>
                <option value="us">美國</option>
                <option value="ap">亞太</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: SC.textSecondary, marginBottom: 4 }}>筆數上限</label>
              <input
                type="number"
                value={limit}
                onChange={e => setLimit(Math.min(parseInt(e.target.value) || 100, 5000))}
                min={1}
                max={5000}
                style={{ width: '100%', padding: '8px 12px', background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, color: SC.text, fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: SC.textSecondary, marginBottom: 4 }}>起始日期</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, color: SC.text, fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: SC.textSecondary, marginBottom: 4 }}>結束日期</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, color: SC.text, fontSize: 13 }}
              />
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: loading ? SC.surfaceHover : SC.teal,
              color: SC.bg,
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '匯出中...' : `匯出 ${format.toUpperCase()}`}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: `${SC.success}15`, border: `1px solid ${SC.success}40`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: SC.success, fontSize: 13 }}>
            已匯出 {result.count} 筆資料（{result.format.toUpperCase()} 格式）
          </div>
        )}

        {error && (
          <div style={{ background: '#EF444415', border: '1px solid #EF444440', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#EF4444', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Info */}
        <div style={{ background: SC.surface, border: `1px solid ${SC.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: SC.text, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>匯出欄位說明</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: SC.textSecondary }}>
            <div><span style={{ color: SC.teal }}>source_id</span> — 資料來源識別碼</div>
            <div><span style={{ color: SC.teal }}>source_name</span> — 資料來源名稱</div>
            <div><span style={{ color: SC.teal }}>category</span> — ESG 類別 (E/S/G)</div>
            <div><span style={{ color: SC.teal }}>region</span> — 區域 (tw/eu/us/ap)</div>
            <div><span style={{ color: SC.teal }}>title</span> — 標題</div>
            <div><span style={{ color: SC.teal }}>url</span> — 原始連結</div>
            <div><span style={{ color: SC.teal }}>date</span> — 發布日期</div>
            <div><span style={{ color: SC.teal }}>relevance_score</span> — 相關性分數</div>
          </div>
        </div>
      </div>
    </div>
  );
}

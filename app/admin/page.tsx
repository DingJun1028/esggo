'use client';

import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { signOut } from '@/lib/auth';

type ResourceItem = { id?: string; title: string; category?: string; url?: string };
type SurveyRow = {
  id?: string;
  week: number;
  date: string;
  topic: string;
  instructor: string;
  studentName?: string | null;
  organization?: string | null;
  ratings: Record<string, number>;
  feedbacks: { valuable?: string | null; improvement?: string | null; question?: string | null };
  submittedAt?: string;
};

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'surveys' | 'resources'>('surveys');
  const [surveys, setSurveys] = useState<SurveyRow[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSurveys = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/surveys');
      const data = await res.json();
      if (data?.ok) setSurveys(data.rows ?? []);
      else setError(data?.message || 'Failed to load surveys');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadResources = async () => {
    try {
      const res = await fetch('/api/admin/resources');
      const data = await res.json();
      if (data?.ok) setResources(data.rows ?? []);
    } catch {}
  };

  useEffect(() => {
    if (!user) return;
    loadSurveys();
    loadResources();
  }, [user]);

  const deleteSurvey = async (id?: string) => {
    if (!id) return;
    const res = await fetch('/api/admin/surveys?id=' + encodeURIComponent(id), { method: 'DELETE' });
    const data = await res.json();
    if (data?.ok) setSurveys((prev) => prev.filter((s) => s.id !== id));
  };

  const deleteResource = async (id?: string) => {
    if (!id) return;
    const res = await fetch('/api/admin/resources?id=' + encodeURIComponent(id), { method: 'DELETE' });
    const data = await res.json();
    if (data?.ok) setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const downloadCsv = () => {
    const rows = surveys.map((s) => ({
      week: s.week,
      date: s.date,
      topic: s.topic,
      instructor: s.instructor,
      studentName: s.studentName || '',
      organization: s.organization || '',
      ratings: JSON.stringify(s.ratings || {}),
      valuable: s.feedbacks?.valuable || '',
      improvement: s.feedbacks?.improvement || '',
      question: s.feedbacks?.question || '',
      submittedAt: s.submittedAt || '',
    }));
    const headers = Object.keys(rows[0] || { week: 1 });
    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = String((r as Record<string, unknown>)[h] ?? '');
            return '"' + v.replace(/"/g, '""') + '"';
          })
          .join(',')
      ),
    ].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surveys-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(surveys, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surveys-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', background: '#f6f8fb', padding: '24px 18px', fontFamily: "'Inter','Noto Sans TC','Noto Sans SC',system-ui,sans-serif" }}>
        <div style={{ maxWidth: 980, margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '28px 24px' }}>
          <h1 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Admin</h1>
          <p style={{ margin: 0, color: '#334155' }}>Please sign in to access admin.</p>
        </div>
      </main>
    );
  }

  const _avg = (key: string) => {
    const vals = surveys.flatMap((s) => (s.ratings?.[key] ? [s.ratings[key]] : []));
    if (!vals.length) return '—';
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f6f8fb', padding: '24px 18px', fontFamily: "'Inter','Noto Sans TC','Noto Sans SC',system-ui,sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>後台管理</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13.5 }}>{user.displayName || user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => signOut()} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#0f172a', cursor: 'pointer', fontWeight: 600 }}>登出</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <button onClick={() => setTab('surveys')} style={{ padding: '10px 14px', borderRadius: 10, border: tab === 'surveys' ? '1px solid #003262' : '1px solid #e2e8f0', background: tab === 'surveys' ? '#003262' : '#fff', color: tab === 'surveys' ? '#fff' : '#0f172a', cursor: 'pointer', fontWeight: 700 }}>問卷</button>
          <button onClick={() => setTab('resources')} style={{ padding: '10px 14px', borderRadius: 10, border: tab === 'resources' ? '1px solid #003262' : '1px solid #e2e8f0', background: tab === 'resources' ? '#003262' : '#fff', color: tab === 'resources' ? '#fff' : '#0f172a', cursor: 'pointer', fontWeight: 700 }}>資源</button>
        </div>

        {error ? <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 14px', borderRadius: 12, marginBottom: 14 }}>{error}</div> : null}

        {tab === 'surveys' ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: '#0f172a' }}>問卷回應（{surveys.length}）</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={downloadCsv} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>CSV</button>
                <button onClick={downloadJson} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>JSON</button>
                <button onClick={loadSurveys} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>重新整理</button>
              </div>
            </div>

            {loading ? <p style={{ color: '#64748b' }}>載入中...</p> : null}

            {!loading && surveys.length === 0 ? (
              <p style={{ color: '#64748b', margin: '10px 0' }}>尚無問卷。</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '10px 8px' }}>Week</th>
                      <th style={{ padding: '10px 8px' }}>Date</th>
                      <th style={{ padding: '10px 8px' }}>Topic</th>
                      <th style={{ padding: '10px 8px' }}>Instructor</th>
                      <th style={{ padding: '10px 8px' }}>Name</th>
                      <th style={{ padding: '10px 8px' }}>Avg</th>
                      <th style={{ padding: '10px 8px' }}>Feedbacks</th>
                      <th style={{ padding: '10px 8px' }}>Submitted</th>
                      <th style={{ padding: '10px 8px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveys.map((s) => {
                      const values = Object.values(s.ratings || {}).filter((v) => typeof v === 'number');
                      const mean = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '—';
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 8px' }}>{s.week}</td>
                          <td style={{ padding: '10px 8px' }}>{s.date}</td>
                          <td style={{ padding: '10px 8px' }}>{s.topic}</td>
                          <td style={{ padding: '10px 8px' }}>{s.instructor}</td>
                          <td style={{ padding: '10px 8px' }}>{s.studentName || '—'}</td>
                          <td style={{ padding: '10px 8px' }}>{mean}</td>
                          <td style={{ padding: '10px 8px', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#475569' }} title={[s.feedbacks?.valuable, s.feedbacks?.improvement, s.feedbacks?.question].filter(Boolean).join(' | ') || ''}>
                            {[s.feedbacks?.valuable, s.feedbacks?.improvement, s.feedbacks?.question].filter(Boolean).join(' | ') || '—'}
                          </td>
                          <td style={{ padding: '10px 8px', color: '#64748b' }}>{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—'}</td>
                          <td style={{ padding: '10px 8px' }}>
                            <button onClick={() => deleteSurvey(s.id)} style={{ background: 'transparent', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>刪除</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: '#0f172a' }}>資源列表（{resources.length}）</h2>
              <button onClick={loadResources} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>重新整理</button>
            </div>
            {resources.length === 0 ? (
              <p style={{ color: '#64748b', margin: '10px 0' }}>尚無資源，請到學習中心新增。</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '10px 8px' }}>Title</th>
                      <th style={{ padding: '10px 8px' }}>Category</th>
                      <th style={{ padding: '10px 8px' }}>URL</th>
                      <th style={{ padding: '10px 8px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 600 }}>{r.title}</td>
                        <td style={{ padding: '10px 8px' }}>{r.category || '—'}</td>
                        <td style={{ padding: '10px 8px' }}>
                          {r.url ? <a href={r.url} target="_blank" rel="noopener" style={{ color: '#003262' }}>Link</a> : '—'}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <button onClick={() => deleteResource(r.id)} style={{ background: 'transparent', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>刪除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

'use client';

/**
 * Next.js error.tsx — catches runtime errors for the entire app.
 * Must be a Client Component.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: 40,
      fontFamily: "'Noto Sans TC', sans-serif",
    }}>
      <div style={{ fontSize: 56 }}>💥</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>
        系統發生錯誤
      </h1>
      <p style={{ fontSize: 15, color: '#64748B', maxWidth: 480, textAlign: 'center', lineHeight: 1.7 }}>
        我們遇到一個技術問題。這不是您的錯，我們的團隊已收到通知。
        請稍後再試或重新整理頁面。
      </p>

      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: 16,
          padding: 20,
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: 12,
          maxWidth: 700,
          width: '100%',
          fontSize: 13,
          fontFamily: "'Fira Code', monospace",
          color: '#991B1B',
          whiteSpace: 'pre-wrap',
          overflow: 'auto',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>🐛 Debug Info (僅開發環境)</div>
          <div><strong>Message:</strong> {error.message}</div>
          {error.digest && <div><strong>Digest:</strong> {error.digest}</div>}
          {error.stack && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Stack Trace</summary>
              <div style={{ marginTop: 8, fontSize: 11 }}>{error.stack}</div>
            </details>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 24px',
            background: '#009EB0',
            color: '#FFF',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          🔄 重新嘗試
        </button>
        <a
          href="/"
          style={{
            padding: '12px 24px',
            background: '#F1F5F9',
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          🏠 返回首頁
        </a>
      </div>
    </div>
  );
}

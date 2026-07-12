'use client';

/**
 * Next.js error.tsx — catches runtime errors for the entire app.
 * Must be a Client Component.
 */
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5 p-10 font-sans bg-primary text-textPrimary">
      <div className="text-6xl">💥</div>
      <h1 className="text-2xl font-bold">
        系統發生錯誤
      </h1>
      <p className="text-sm text-textSecondary max-w-md text-center leading-relaxed">
        我們遇到一個技術問題。這不是您的錯，我們的團隊已收到通知。
        請稍後再試或重新整理頁面。
      </p>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl max-w-2xl w-full text-sm font-mono text-red-800 dark:text-red-300 whitespace-pre-wrap overflow-auto">
          <div className="font-bold mb-2">🐛 Debug Info (僅開發環境)</div>
          <div><strong>Message:</strong> {error.message}</div>
          {error.digest && <div><strong>Digest:</strong> {error.digest}</div>}
          {error.stack && (
            <details className="mt-3">
              <summary className="cursor-pointer font-semibold">Stack Trace</summary>
              <div className="mt-2 text-xs opacity-80">{error.stack}</div>
            </details>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-6 py-3 bg-accentTeal text-white border-none rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
        >
          🔄 重新嘗試
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-secondary text-textPrimary border border-borderColor rounded-xl font-semibold text-sm no-underline hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          🏠 返回首頁
        </Link>
      </div>
    </div>
  );
}

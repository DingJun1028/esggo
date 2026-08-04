import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5 p-10 font-sans bg-primary text-textPrimary">
      <div className="text-6xl">🔍</div>
      <h1 className="text-2xl font-bold">
        頁面未找到
      </h1>
      <p className="text-sm text-textSecondary max-w-md text-center leading-relaxed">
        抱歉，您訪問的頁面不存在或已被移動。
      </p>
      <div className="flex gap-3 mt-2">
        <Link
          href="/"
          className="px-6 py-3 bg-accentTeal text-white border-none rounded-xl font-semibold text-sm no-underline hover:opacity-90 transition-opacity"
        >
          🏠 返回首頁
        </Link>
      </div>
    </div>
  );
}
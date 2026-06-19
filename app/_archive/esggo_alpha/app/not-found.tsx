export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">404 - 找不到頁面</h2>
            <p className="text-slate-500 mb-6">抱歉，您請求的頁面不存在。</p>
            <a
                href="/"
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
                返回首頁
            </a>
        </div>
    );
}

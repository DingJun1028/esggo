import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-vh-100 p-6 text-center bg-white/30 backdrop-blur-xl">
            <h2 className="text-4xl font-black text-[#63a6b0] mb-4">404 - 空間迷失</h2>
            <p className="text-gray-600 mb-8">此座標在萬能宇宙中尚未顯化。</p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#63a6b0] text-white rounded-full font-bold shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
            >
                返回起源 (Back to Home)
            </Link>
        </div>
    );
}

import { Sidebar } from '@/components/layout/Sidebar.tsx';
import { Header } from '@/components/layout/Header.tsx';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#050c14] text-slate-200">
            {/* 側邊欄 */}
            <Sidebar />

            {/* 主要內容區 */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}

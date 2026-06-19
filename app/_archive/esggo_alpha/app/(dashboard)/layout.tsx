"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { SpiritModal } from "@/components/layout/spirit-modal";
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-h-screen p-4 md:p-6 lg:p-10 pt-24 lg:pt-10 pb-24 lg:pb-10 transition-all max-w-full overflow-x-hidden">
                <PageHeader />
                {children}
            </main>
            <SpiritModal />
        </div>
    );
}

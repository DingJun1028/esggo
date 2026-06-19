import { Metadata } from 'next';
import { SovereignDashboard } from "./components/SovereignDashboard";

export const metadata: Metadata = {
    title: '智遠導師戰略儀表板 | ESG GO',
    description: '全域 24 項 MECE 服務監控與 AI 策略洞察。',
};

/**
 * 🏛️ Dashboard Page - Sovereign Mentor Entry Point
 * 
 * 此頁面為 ESG 戰略的高層次作戰室。
 * 展現 5T 協議的即時狀態，並結合「上善若水」的儀表板設計，
 * 提供 Dr. Thoth 的 AI 驅動洞察。
 */
export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-white">
            <SovereignDashboard />
        </div>
    );
}

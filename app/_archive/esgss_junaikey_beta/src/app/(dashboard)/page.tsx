import { MetricCard } from '@/components/features/MetricCard.tsx';
import { Card } from '@/components/ui/Card.tsx';
import { createServerClient } from '@/lib/supabase/server.js';

export default async function DashboardPage() {
    const supabase = createServerClient();

    // 取得統計數據
    const { count: totalEvidence } = await supabase
        .from('evidence_vault')
        .select('*', { count: 'exact', head: true });

    const { count: verifiedCount } = await supabase
        .from('evidence_vault')
        .select('*', { count: 'exact', head: true })
        .eq('lifecycle_stage', 'verified');

    const verificationRate = totalEvidence ? ((verifiedCount! / totalEvidence) * 100).toFixed(1) : '0';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">儀表板</h1>
                    <p className="text-slate-500 mt-1">永續數據管理總覽</p>
                </div>
                <div className="text-xs font-mono text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    5T PROTOCOL ACTIVE
                </div>
            </div>

            {/* 指標卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="證據總數"
                    value={totalEvidence?.toString() || '0'}
                    unit="筆"
                    status="verified"
                />

                <MetricCard
                    title="已驗證證據"
                    value={verifiedCount?.toString() || '0'}
                    unit="筆"
                    status="verified"
                />

                <MetricCard
                    title="驗證率"
                    value={verificationRate}
                    unit="%"
                />
            </div>

            {/* 最近活動 */}
            <Card glow>
                <h2 className="text-xl font-bold mb-4 text-white">最近活動</h2>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <div>
                                <p className="text-sm font-medium">系統自動同步完成</p>
                                <p className="text-xs text-slate-500">來源: ISO-14064-1 API</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-slate-500 text-right">NOW</span>
                    </div>
                    <p className="text-center text-slate-600 text-sm italic py-8">
                        更多活動日誌載入中...
                    </p>
                </div>
            </Card>
        </div>
    );
}

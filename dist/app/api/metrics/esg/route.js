import { NextResponse } from 'next/server';
export async function GET() {
    // 實務上這裡會呼叫 Supabase 或 Blue.cc / AITable API
    // 為了展示真實連線架構，此處我們先回傳符合 KPI 結構的動態數據
    try {
        const kpiData = {
            success: true,
            data: {
                environmental: {
                    title: "溫室氣體總排量 (Scope 1+2)",
                    value: "14,210", // 模擬從資料庫抓取的最新值
                    unit: "tCO2e",
                    trend: -3.5,
                    trendLabel: "較前年同步",
                    fiveTStatus: [true, true, true, true, true],
                    dataSource: "NCBDB_ERP_SYNC"
                },
                social: {
                    title: "多元共融指數 (D&I Score)",
                    value: "84.2",
                    unit: "分",
                    trend: 5.2,
                    trendLabel: "較前季提升",
                    fiveTStatus: [true, true, true, true, false],
                    dataSource: "HR_SURVEY_VAULT"
                },
                governance: {
                    title: "董事會獨立性",
                    value: "66.7",
                    unit: "%",
                    trend: 1.7,
                    trendLabel: "新增獨董",
                    fiveTStatus: [true, true, true, true, true],
                    dataSource: "GOVERNANCE_LEDGER"
                }
            },
            timestamp: new Date().toISOString()
        };
        return NextResponse.json(kpiData);
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
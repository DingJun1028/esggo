import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    data: {
        environmental: {
            title: string;
            value: string;
            unit: string;
            trend: number;
            trendLabel: string;
            fiveTStatus: boolean[];
            dataSource: string;
        };
        social: {
            title: string;
            value: string;
            unit: string;
            trend: number;
            trendLabel: string;
            fiveTStatus: boolean[];
            dataSource: string;
        };
        governance: {
            title: string;
            value: string;
            unit: string;
            trend: number;
            trendLabel: string;
            fiveTStatus: boolean[];
            dataSource: string;
        };
    };
    timestamp: string;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map
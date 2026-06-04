import { NextResponse } from 'next/server';
/**
 * 外部資料源排程器 (Cron Job API)
 * 此端點負責模擬從外部感測器、ERP 或政府開放資料中萃取 ESG 數據。
 * 流程：
 * 1. 抓取外部數據 (Mock API Fetch)
 * 2. 數據清洗與標準化 (OmniAgent ETL - Transform)
 * 3. 打上系統主權刻印 (uuid, version, timestamp)
 * 4. 寫入資料庫並觸發 5T ZKP 封印
 */
export declare function GET(request: Request): Promise<NextResponse<{
    success: boolean;
    message: string;
    processed_count: number;
    data: {
        hash_lock: string;
        uuid: `${string}-${string}-${string}-${string}-${string}`;
        version: string;
        timestamp: number;
        date: string;
        metric_name: string;
        metric_value: number;
        unit: string;
        source_origin: string;
    }[];
    status: string;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map
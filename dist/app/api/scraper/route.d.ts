export declare const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
export declare const maxDuration = 30;
export declare const dynamic = "force-dynamic";
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    targets: {
        id: string;
        name: string;
        url: string;
        category: string;
    }[];
}> | NextResponse<{
    error: string;
}>>;
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    results: import("@/lib/puppeteer/scraper").ScrapeResult[];
    summary: {
        totalSources: number;
        successfulSources: number;
        totalArticles: number;
        scrapedAt: string;
    };
}> | NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    result: import("@/lib/puppeteer/scraper").ScrapeResult;
}> | NextResponse<{
    success: boolean;
    result: {
        title: string;
        content: string;
        links: string[];
        success: boolean;
        error?: string;
    };
}>>;
//# sourceMappingURL=route.d.ts.map
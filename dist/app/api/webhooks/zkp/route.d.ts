import { NextResponse } from 'next/server';
/**
 * ⚡️ ESG GO | ZKP External Validation Webhook
 *
 * 接收外部信任節點（如 Chainlink 或其他 ZKP 驗證器）的驗證回調，
 * 將 5T 協議的「信 (Trustworthy)」實作於系統深層。
 */
export declare function POST(request: Request): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    documentId: any;
    status: string;
    timestamp: string;
    message: string;
}>>;
//# sourceMappingURL=route.d.ts.map
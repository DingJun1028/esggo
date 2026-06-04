import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/src/shared/types';
/**
 * GET /api/vault/read?uuid=xxx
 * 讀取指定證據 (Traceable)
 */
export declare function GET(request: NextRequest): Promise<NextResponse<ApiResponse<unknown>>>;
//# sourceMappingURL=route.d.ts.map
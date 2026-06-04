import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/src/shared/types';
/**
 * POST /api/vault/verify
 * 驗證證據的 Hash Lock 完整性 (Trustworthy)
 */
export declare function POST(request: NextRequest): Promise<NextResponse<ApiResponse<unknown>>>;
//# sourceMappingURL=route.d.ts.map
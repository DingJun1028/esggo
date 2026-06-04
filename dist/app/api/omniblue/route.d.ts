import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    data: {
        supabase: any[];
        ncbdb: unknown[] | undefined;
        ncbdbError: string | undefined;
    };
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
//# sourceMappingURL=route.d.ts.map
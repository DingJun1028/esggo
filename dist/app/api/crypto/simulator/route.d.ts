import { NextResponse } from 'next/server';
export declare function POST(req: Request): Promise<NextResponse<{
    masked: string;
    l2KeyHex: string | undefined;
}> | NextResponse<{
    unmasked: string;
}> | NextResponse<{
    error: any;
}> | NextResponse<{
    commitments: {
        value: number;
        commitment: string;
    }[];
    expectedTotal: string;
    isValid: boolean;
}>>;
//# sourceMappingURL=route.d.ts.map
import { NextRequest, NextResponse } from "next/server";
export declare const CONFIG: {
    instance: string;
    dataApiUrl: string;
    authApiUrl: string;
    appUrl: string;
};
export declare function extractAuthCookies(cookieHeader: string): string;
export declare function getSessionUser(cookieHeader: string): Promise<{
    id: string;
} | null>;
export declare function proxyToNCB(req: NextRequest, path: string, body?: string): Promise<NextResponse<unknown>>;
export declare function proxyToNCBPublic(req: NextRequest, path: string, body?: string): Promise<NextResponse<unknown>>;
type RlsPolicies = Record<string, string>;
export declare function getRlsPolicies(): Promise<RlsPolicies>;
export declare function extractTableFromPath(pathStr: string): string;
export declare function allowsPublicRead(policy?: string): boolean;
export declare function allowsPublicWrite(policy?: string): boolean;
export declare function requiresOwnerScope(policy?: string): boolean;
export {};
//# sourceMappingURL=ncb-utils.d.ts.map
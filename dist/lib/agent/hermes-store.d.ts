export interface HermesCredentials {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    scope?: string;
    timestamp: number;
}
/**
 * 將 Hermes Agent (Google Workspace) 的憑證安全地存儲至 Supabase Vault
 */
export declare function saveHermesCredentials(userId: string | undefined, credentials: Omit<HermesCredentials, 'timestamp'>): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * 取得 Hermes Agent 的 Google Workspace 憑證 (需要解密)
 */
export declare function getHermesCredentials(userId?: string): Promise<HermesCredentials | null>;
//# sourceMappingURL=hermes-store.d.ts.map
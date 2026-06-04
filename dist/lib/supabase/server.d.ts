import { Database } from '../../src/server/lib/database.types';
/**
 * 創建伺服器端 Supabase 客戶端
 * 支援 Next.js App Router 的 Cookie 認證
 */
export declare function createServerClient(): Promise<import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", never, {
    PostgrestVersion: "12";
}>>;
/**
 * 檢查使用者認證並獲取使用者資料
 */
export declare function getAuthenticatedUser(): Promise<import("@supabase/auth-js").User>;
//# sourceMappingURL=server.d.ts.map
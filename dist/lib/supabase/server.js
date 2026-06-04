// lib/supabase/server.ts
import { createServerClient as createSsrClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
/**
 * 創建伺服器端 Supabase 客戶端
 * 支援 Next.js App Router 的 Cookie 認證
 */
export async function createServerClient() {
    const cookieStore = await cookies();
    return createSsrClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            get(name) {
                return cookieStore.get(name)?.value;
            },
            set(name, value, options) {
                try {
                    cookieStore.set({ name, value, ...options });
                }
                catch (error) {
                    // The `set` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
            remove(name, options) {
                try {
                    cookieStore.set({ name, value: '', ...options });
                }
                catch (error) {
                    // The `remove` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
        },
    });
}
/**
 * 檢查使用者認證並獲取使用者資料
 */
export async function getAuthenticatedUser() {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error('未授權訪問');
    }
    return user;
}
//# sourceMappingURL=server.js.map
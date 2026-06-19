/**
 * 🔒 Authentication Client — ESG GO Omni Layer
 * 
 * 這是前端使用的認證管理模組，封裝與 /api/auth 代理的互動。
 * 統一使用 next-auth/react 以達成最佳相容性。
 */

import { signIn, signOut as nextAuthSignOut, getSession as getNextAuthSession } from "next-auth/react";

export interface NcbUser {
    id: string;
    email: string;
    name?: string;
    image?: string;
}

export interface SessionData {
    user: NcbUser | null;
    session: any | null;
}

/**
 * 取得目前登入的使用者資訊。
 */
export async function getSession(): Promise<SessionData> {
    try {
        const session = await getNextAuthSession();
        if (!session || !session.user) return { user: null, session: null };
        return {
            user: session.user as NcbUser,
            session: session,
        };
    } catch (e) {
        console.error("Failed to get session:", e);
        return { user: null, session: null };
    }
}

/**
 * 使用 Google 進行 SSO 登入
 */
export const signInWithGoogle = () => {
    signIn('google', { callbackUrl: '/omni' });
};

/**
 * 登出目前帳號
 */
export async function signOut(): Promise<void> {
    try {
        await nextAuthSignOut({ callbackUrl: '/' });
    } catch (e) {
        console.error("Sign out failed:", e);
    }
}

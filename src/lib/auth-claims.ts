/**
 * Firebase Auth Claims Helper
 *
 * 提供：
 * 1. three-tier role enum / type guard
 * 2. 從 Firebase ID token 讀取 custom claims（含快取）
 * 3. 強制刷新 token 以取得最新 claims
 *
 * 使用限制：僅能在伺服器/API Route 使用
 */

import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from './firebase-admin';

export type UserRole = 'student' | 'TA' | 'admin';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  student: 0,
  TA: 1,
  admin: 2,
};

const ROLE_LIST: UserRole[] = ['student', 'TA', 'admin'];

export function isUserRole(v: unknown): v is UserRole {
  return ROLE_LIST.includes(v as UserRole);
}

export function minRole(allowed: UserRole[]): UserRole {
  return allowed.reduce((lowest, r) => (ROLE_HIERARCHY[r] < ROLE_HIERARCHY[lowest] ? r : lowest));
}

function getTokenCacheKey(uid: string): string {
  return `firebase:claims:${uid}`;
}

const memoryCache = new Map<string, { claims: Record<string, unknown>; exp: number }>();

export async function getIdTokenClaims(uid: string, force = false): Promise<Record<string, unknown> | null> {
  const cacheKey = getTokenCacheKey(uid);

  if (!force) {
    const mem = memoryCache.get(cacheKey);
    if (mem && Date.now() < mem.exp) {
      return mem.claims;
    }
  }

  try {
    const auth = getAuth(getAdminApp());
    const user = await auth.getUser(uid);
    const claims = (user.customClaims ?? {}) as Record<string, unknown>;
    memoryCache.set(cacheKey, { claims, exp: Date.now() + 60_000 });
    return claims;
  } catch {
    return null;
  }
}

export async function requireRole(uid: string, allowed: UserRole[]): Promise<UserRole | null> {
  const claims = await getIdTokenClaims(uid);
  if (!claims) return null;

  const role = claims.role;
  if (!isUserRole(role)) return null;

  const allowedSet = new Set(allowed);
  return allowedSet.has(role) ? role : null;
}

export async function forceRefreshIdToken(token: string): Promise<string | null> {
  try {
    const auth = getAuth(getAdminApp());
    const decoded = await auth.verifyIdToken(token, true);
    return decoded.uid ?? null;
  } catch {
    return null;
  }
}

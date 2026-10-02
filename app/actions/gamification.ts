"use server";

// import { prisma } from "@/src/lib/prisma"; // 假設已設置 Prisma Client
// import { createClient } from "@supabase/supabase-js"; // 或使用 Supabase Client

export async function syncGamificationState(
  userId: string,
  state: { level: number; xp: number; questsCompleted: string[] }
) {
  try {
    // 這裡模擬將資料寫入 Supabase / Prisma 的過程
    // await prisma.userGamification.upsert({
    //   where: { userId },
    //   update: { level: state.level, xp: state.xp },
    //   create: { userId, level: state.level, xp: state.xp }
    // });
    
    // 根據 5T Protocol (Trustworthy)，這裡可以加入 Hash Lock 驗證
    const hashLock = `hash_${Date.now()}_${userId}`;
    
    console.log(`[Supabase Sync] User ${userId} state synced. HashLock: ${hashLock}`);
    
    return { success: true, hashLock };
  } catch (error) {
    console.error("[Supabase Sync Error]", error);
    return { success: false, error: "Failed to sync gamification state" };
  }
}

export async function getLeaderboard() {
  // 模擬從 Supabase 獲取排行榜資料
  // return await prisma.userGamification.findMany({ orderBy: { xp: 'desc' }, take: 5 });
  
  return [
    { id: "u1", name: "JunAiKey", level: 99, xp: 99999, avatar: "👑" },
    { id: "u2", name: "OmniAgent", level: 50, xp: 45000, avatar: "🤖" },
    { id: "u3", name: "Antigravity", level: 42, xp: 38500, avatar: "✨" },
    { id: "u4", name: "User", level: 12, xp: 850, avatar: "👤" },
  ];
}

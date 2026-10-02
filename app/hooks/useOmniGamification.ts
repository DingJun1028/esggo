import { useState, useCallback } from "react";
import { syncGamificationState } from "@/app/actions/gamification";

// ==========================================
// Types
// ==========================================
export type Quest = {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
  type: "daily" | "weekly" | "epic";
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  iconName: "Target" | "Flame" | "Shield" | "Star";
  unlocked: boolean;
};

// Initial Mock Data
const INITIAL_QUESTS: Quest[] = [
  { id: "q1", title: "完成 Scope 1 碳排數據初審", xpReward: 50, completed: false, type: "daily" },
  { id: "q2", title: "清理 3 個系統熵增警告 (Entropy)", xpReward: 100, completed: false, type: "daily" },
  { id: "q3", title: "連續 5 天登入 ESG 儀表板", xpReward: 300, completed: false, type: "weekly" },
];

const INITIAL_BADGES: Badge[] = [
  { id: "b1", name: "淨零先鋒", description: "完成首次碳中和目標設定", iconName: "Target", unlocked: true },
  { id: "b2", name: "熵減煉金術士", description: "解決超過 50 個代碼/系統警告", iconName: "Flame", unlocked: true },
  { id: "b3", name: "守密者", description: "成功觸發 10 次 Hash Lock 驗證", iconName: "Shield", unlocked: false },
  { id: "b4", name: "萬能共鳴", description: "與全通之心達成 100% 同步率", iconName: "Star", unlocked: false },
];

export function useOmniGamification() {
  const [level, setLevel] = useState(12);
  const [xp, setXp] = useState(850);
  const xpNeeded = 1000;
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  
  // Special state for animations
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastGainedXp, setLastGainedXp] = useState(0);

  const completeQuest = useCallback(async (id: string, reward: number) => {
    // 1. Mark quest as complete locally
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
    );
    
    // 2. Add XP and check for level up
    setLastGainedXp(reward);
    let newLevel = level;
    let finalXp = xp + reward;
    
    setXp((prev) => {
      const updatedXp = prev + reward;
      if (updatedXp >= xpNeeded) {
        newLevel = level + 1;
        setLevel(newLevel);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
        finalXp = updatedXp - xpNeeded;
        return finalXp;
      }
      return updatedXp;
    });
    
    // 3. Trigger Supabase Server Action to securely record the transaction with 5T Hash Lock
    try {
      const result = await syncGamificationState("u4", {
        level: newLevel,
        xp: finalXp,
        questsCompleted: [id]
      });
      if (result.success) {
        console.log(`[5T Protocol] Gamification state synced. Hash Lock: ${result.hashLock}`);
      }
    } catch (error) {
      console.error("Failed to sync gamification state with Supabase", error);
    }
    
  }, [level, xp, xpNeeded]);

  const dismissLevelUp = () => setShowLevelUp(false);

  return {
    level,
    xp,
    xpNeeded,
    quests,
    badges,
    showLevelUp,
    lastGainedXp,
    completeQuest,
    dismissLevelUp
  };
}

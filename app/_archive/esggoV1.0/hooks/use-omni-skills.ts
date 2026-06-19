"use client";

/**
 * useOmniSkills — Persistent skill tree session hook
 * Connects OmniHeart to the Skill Memory Pool across the session.
 */

import { useState, useCallback, useEffect } from "react";
import { createOmniHeart, IOmniHeart } from "@/lib/omni-heart";
import {
    OmniRole,
    OmniSkill,
    OmniSkillTree,
    SkillMemoryLog,
    OmniMemoryPool,
    OMNI_SKILL_TREES,
    createMemoryPool,
    autoLearnPassives,
    learnSkill,
    activateSkill,
    getLearnableSkills,
    gainExperience,
} from "@/lib/omni-skill-engine";
import { useAuth } from "@/components/context/auth-context";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const STORAGE_KEY = "esggo_omni_skills_v1";

interface UseOmniSkillsReturn {
    role: OmniRole;
    tree: OmniSkillTree;
    pool: OmniMemoryPool;
    heart: IOmniHeart;
    unlockedIds: string[];
    learnableSkills: OmniSkill[];
    skillLogs: SkillMemoryLog[];
    memoryUsedPercent: number;
    learn: (skill: OmniSkill) => { success: boolean; reason?: string };
    activate: (skillId: string, context?: string) => boolean;
    gainExp: (xp: number, context?: string) => void;
    setRole: (role: OmniRole) => void;
}

export function useOmniSkills(initialRole: OmniRole = "ReportScribe"): UseOmniSkillsReturn {
    const [role, setRoleState] = useState<OmniRole>(initialRole);
    const [pool, setPool] = useState<OmniMemoryPool>(() => createMemoryPool());
    const [heart, setHeart] = useState<IOmniHeart>(() => createOmniHeart("OmniSkill", "SkillEngine", "OmniSkill_v1"));

    const { user } = useAuth();
    const tree = OMNI_SKILL_TREES[role];

    // Restore from Firestore (Cloud) or localStorage (Fallback)
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (user) {
            // Firestore Sync
            const skillDocRef = doc(db, "users", user.uid, "skills", "omni_v1");
            const unsubscribe = onSnapshot(skillDocRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    const restoredPool = createMemoryPool();
                    restoredPool.unlockedSkillIds = new Set(data.unlockedIds || []);
                    restoredPool.skillLogs = data.logs || [];
                    if (data.experience !== undefined) restoredPool.experience = data.experience;
                    if (data.level !== undefined) restoredPool.level = data.level;
                    if (data.totalCapacity !== undefined) restoredPool.totalCapacity = data.totalCapacity;
                    setPool(restoredPool);
                    if (data.role) setRoleState(data.role as OmniRole);
                }
            });
            return () => unsubscribe();
        } else {
            // LocalStorage Fallback
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const { savedRole, unlockedIds, logs, experience, level, totalCapacity } = JSON.parse(saved);
                    const restoredPool = createMemoryPool();
                    restoredPool.unlockedSkillIds = new Set(unlockedIds || []);
                    restoredPool.skillLogs = logs || [];
                    if (experience !== undefined) restoredPool.experience = experience;
                    if (level !== undefined) restoredPool.level = level;
                    if (totalCapacity !== undefined) restoredPool.totalCapacity = totalCapacity;
                    setPool(restoredPool);
                    if (savedRole) setRoleState(savedRole);
                } catch { /* ignore */ }
            }
        }
    }, [user]);

    // Auto-learn passives when role changes
    useEffect(() => {
        setPool((prev) => {
            const next = { ...prev, unlockedSkillIds: new Set(prev.unlockedSkillIds) };
            const { logs: newLogs, finalHeart } = autoLearnPassives(next, role, heart);
            // Advance heart to the chained state after passive-learning
            setHeart(finalHeart);
            return {
                ...next,
                skillLogs: [...prev.skillLogs, ...newLogs],
            };
        });
    }, [role, heart]);

    // Persist changes
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (user) {
            // Persistence to Firestore
            const skillDocRef = doc(db, "users", user.uid, "skills", "omni_v1");
            setDoc(skillDocRef, {
                role,
                unlockedIds: [...pool.unlockedSkillIds],
                logs: pool.skillLogs.slice(-100), // Cloud storage allows more history
                experience: pool.experience,
                level: pool.level,
                totalCapacity: pool.totalCapacity,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } else {
            // Persistence to LocalStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                savedRole: role,
                unlockedIds: [...pool.unlockedSkillIds],
                logs: pool.skillLogs.slice(-50),
                experience: pool.experience,
                level: pool.level,
                totalCapacity: pool.totalCapacity,
            }));
        }
    }, [role, pool, user]);

    const learn = useCallback((skill: OmniSkill) => {
        let result: { success: boolean; reason?: string } = { success: false };
        setPool((prev) => {
            const next = { ...prev, unlockedSkillIds: new Set(prev.unlockedSkillIds) };
            const res = learnSkill(next, skill, heart, `Manual learn: ${skill.name}`);
            result = res.reason !== undefined
                ? { success: res.success, reason: res.reason }
                : { success: res.success };

            if (res.log && res.newHeart) {
                // Advance heart to the new state
                setHeart(res.newHeart);
                return { ...next, skillLogs: [...prev.skillLogs, res.log] };
            }
            return next;
        });
        return result;
    }, [heart]);

    const activate = useCallback((skillId: string, context = "User activation") => {
        const res = activateSkill(pool, skillId, heart, context);
        return res.success;
    }, [pool, heart]);

    const gainExp = useCallback((xp: number, context = "System Award") => {
        setPool((prev) => gainExperience(prev, xp, context));
    }, []);

    const setRole = useCallback((newRole: OmniRole) => {
        setRoleState(newRole);
    }, []);

    return {
        role,
        tree,
        pool,
        heart,
        unlockedIds: [...pool.unlockedSkillIds],
        learnableSkills: getLearnableSkills(pool, role),
        skillLogs: pool.skillLogs,
        memoryUsedPercent: Math.round((pool.allocatedMemory / pool.totalCapacity) * 100),
        learn,
        activate,
        gainExp,
        setRole,
    };
}

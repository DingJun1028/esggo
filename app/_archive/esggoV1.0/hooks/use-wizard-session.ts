"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FirestoreService, ChapterSessionLog } from "@/lib/services/firestore-service";
import { WizardSessionState, EvidenceItem } from "@/lib/types/ncb-types";
import { toast } from "sonner";
import { useListUserEvidence } from "@dataconnect/generated/react";

// Get or create anonymous user ID
function getAnonymousUserId(): string {
    if (typeof window === "undefined") return "anon";
    let id = localStorage.getItem("esggo_user_id");
    if (!id) {
        id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("esggo_user_id", id);
    }
    return id;
}

export type WizardStep = "scope" | "evidence" | "alignment" | "writing" | "export" | "verification";

// WizardSessionState is now imported from @/lib/types/ncb-types

interface UseWizardSessionReturn {
    session: WizardSessionState;
    updateStep: (step: string) => void;
    updateActiveChapter: (chapter: string) => void;
    updateChapterWordCount: (chapterId: string, wordCount: number) => void;
    updateChapterStatus: (chapterId: string, status: WizardSessionState["chapterProgress"][string]["status"]) => void;
    updateCursor: (nodeId: string, position: number) => void;
    updateEvidenceList: (items: EvidenceItem[] | ((prev: EvidenceItem[]) => EvidenceItem[])) => void;
    logChapterExit: (chapterId: string, durationSeconds: number, wordsBefore: number, wordsAfter: number) => void;
    saveSession: () => Promise<void>;
    resetSession: () => void;
}

const SAVE_DEBOUNCE_MS = 15000; // save at most every 15s

export function useWizardSession(initialStep = "scope"): UseWizardSessionReturn {
    const userId = typeof window !== "undefined" ? getAnonymousUserId() : "anon";

    const [session, setSession] = useState<WizardSessionState>({
        userId,
        isLoading: true,
        currentStep: initialStep,
        activeChapter: "",
        totalWordCount: 0,
        lastEditedAt: null,
        chapterProgress: {},
        selectedIssues: [],
        evidenceList: [], // Initialized strictly empty; will sync from Data Connect
        sessionHistory: [],
    });

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingSave = useRef(false);

    // Fetch live postgres evidence data via Data Connect SDK
    const { data: fdcEvidenceData, isLoading: isEvidenceLoading } = useListUserEvidence();

    useEffect(() => {
        if (fdcEvidenceData?.evidences) {
            setSession(prev => {
                // To avoid redundant updates
                if (JSON.stringify(prev.evidenceList) === JSON.stringify(fdcEvidenceData.evidences)) {
                    return prev;
                }
                return { ...prev, evidenceList: fdcEvidenceData.evidences as unknown as EvidenceItem[] };
            });
        }
    }, [fdcEvidenceData]);

    // Load session from Firestore on mount
    useEffect(() => {
        async function load() {
            // First load from localStorage for instant UX
            const localSession = localStorage.getItem("esggo_wizardProgress_v2");
            if (localSession) {
                try {
                    const parsed = JSON.parse(localSession);
                    setSession(prev => ({ ...prev, ...parsed, isLoading: false }));
                } catch { }
            }

            // Then fetch from Firestore (authoritative source)
            try {
                const cloudSession = await FirestoreService.loadWizardSession(userId);
                if (cloudSession) {
                    setSession(prev => ({
                        ...prev,
                        currentStep: cloudSession.currentStep || prev.currentStep,
                        activeChapter: cloudSession.activeChapter || prev.activeChapter,
                        totalWordCount: cloudSession.totalWordCount || prev.totalWordCount,
                        lastEditedAt: cloudSession.lastEditedAt || prev.lastEditedAt,
                        chapterProgress: (cloudSession.chapterProgress as Record<string, any>) || prev.chapterProgress,
                        selectedIssues: cloudSession.selectedIssues || prev.selectedIssues,
                        evidenceList: (cloudSession as any).evidenceList || prev.evidenceList,
                        isLoading: false,
                    }));
                    // Update localStorage with cloud version
                    localStorage.setItem("esggo_wizardProgress_v2", JSON.stringify(cloudSession));
                } else {
                    setSession(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error("Failed to load session from cloud:", error);
                setSession(prev => ({ ...prev, isLoading: false }));
            }
        }
        load();
    }, [userId]);

    const debouncedSave = useCallback((updatedSession: WizardSessionState) => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        pendingSave.current = true;
        saveTimer.current = setTimeout(async () => {
            const { isLoading, ...toSave } = updatedSession;
            try {
                await FirestoreService.saveWizardSession(toSave);
                localStorage.setItem("esggo_wizardProgress_v2", JSON.stringify(toSave));
                pendingSave.current = false;
            } catch (error) {
                console.error("Auto-save failed", error);
                toast.error("自動儲存失敗，請檢查網路連線");
            }
        }, SAVE_DEBOUNCE_MS);
    }, [userId]);

    const updateStep = useCallback((step: string) => {
        setSession(prev => {
            const updated = { ...prev, currentStep: step };
            debouncedSave(updated);
            return updated;
        });
    }, [debouncedSave]);

    const updateActiveChapter = useCallback((chapter: string) => {
        setSession(prev => {
            const updated = { ...prev, activeChapter: chapter };
            debouncedSave(updated);
            return updated;
        });
    }, [debouncedSave]);

    const updateChapterWordCount = useCallback((chapterId: string, wordCount: number) => {
        setSession(prev => {
            const totalWordCount = Object.values({
                ...prev.chapterProgress,
                [chapterId]: { ...prev.chapterProgress[chapterId], wordCount }
            }).reduce((sum, p) => sum + (p.wordCount || 0), 0);

            const currentStatus = prev.chapterProgress[chapterId]?.status || 'pending';
            let newStatus = currentStatus;

            if (currentStatus === 'pending' && wordCount > 20) {
                newStatus = 'drafting';
            }

            const updated: WizardSessionState = {
                ...prev,
                totalWordCount,
                chapterProgress: {
                    ...prev.chapterProgress,
                    [chapterId]: {
                        ...(prev.chapterProgress[chapterId] || { content: "", status: "pending" }),
                        wordCount,
                        lastEditedAt: new Date().toISOString(),
                        status: newStatus,
                    }
                }
            };
            debouncedSave(updated);
            return updated;
        });
    }, [debouncedSave]);

    const updateChapterStatus = useCallback((chapterId: string, status: WizardSessionState["chapterProgress"][string]["status"]) => {
        setSession(prev => {
            const current = prev.chapterProgress[chapterId] || { content: "", wordCount: 0, lastEditedAt: new Date().toISOString(), status: "pending" };
            const updated: WizardSessionState = {
                ...prev,
                chapterProgress: {
                    ...prev.chapterProgress,
                    [chapterId]: {
                        ...current,
                        status,
                        lastEditedAt: new Date().toISOString(),
                    }
                }
            };
            debouncedSave(updated);
            return updated;
        });
    }, [debouncedSave]);

    const updateCursor = useCallback((nodeId: string, position: number) => {
        setSession(prev => {
            const updated = { ...prev, activeNodeId: nodeId, cursorPosition: position };
            debouncedSave(updated);
            return updated;
        });
    }, [debouncedSave]);

    const updateEvidenceList = useCallback((items: EvidenceItem[] | ((prev: EvidenceItem[]) => EvidenceItem[])) => {
        setSession(prev => {
            const newList = typeof items === 'function' ? items(prev.evidenceList || []) : items;
            const updated = { ...prev, evidenceList: newList };
            debouncedSave(updated);
            return updated;
        });
    }, [debouncedSave]);

    const logChapterExit = useCallback(async (
        chapterId: string,
        durationSeconds: number,
        wordsBefore: number,
        wordsAfter: number
    ) => {
        const log: ChapterSessionLog = {
            chapterId,
            sessionDuration: durationSeconds,
            wordCountBefore: wordsBefore,
            wordCountAfter: wordsAfter,
            timestamp: new Date().toISOString(),
        };
        try {
            await FirestoreService.logChapterSession(userId, log);
            setSession(prev => ({
                ...prev,
                sessionHistory: [
                    { chapterId, duration: durationSeconds, wordCount: wordsAfter, timestamp: log.timestamp },
                    ...prev.sessionHistory.slice(0, 19), // Keep last 20
                ]
            }));
        } catch (error) {
            console.error("Failed to log chapter session:", error);
        }
    }, [userId]);

    const saveSession = useCallback(async () => {
        const { isLoading, ...toSave } = session;
        try {
            await FirestoreService.saveWizardSession(toSave);
            localStorage.setItem("esggo_wizardProgress_v2", JSON.stringify(toSave));
            toast.success("進度已儲存至雲端");
        } catch (error) {
            toast.error("儲存失敗");
        }
    }, [session]);

    const resetSession = useCallback(() => {
        const fresh: WizardSessionState = {
            userId,
            isLoading: false,
            currentStep: "scope",
            activeChapter: "",
            totalWordCount: 0,
            lastEditedAt: null,
            chapterProgress: {},
            selectedIssues: [],
            evidenceList: [],
            sessionHistory: [],
        };
        setSession(fresh);
        localStorage.removeItem("esggo_wizardProgress_v2");
        // Also clear Firestore session
        try {
            FirestoreService.saveWizardSession({ ...fresh, lastEditedAt: '' } as any);
        } catch (error) {
            console.error("Failed to reset session in cloud:", error);
        }
    }, [userId]);

    return {
        session,
        updateStep,
        updateActiveChapter,
        updateChapterWordCount,
        updateChapterStatus,
        updateCursor,
        updateEvidenceList,
        logChapterExit,
        saveSession,
        resetSession,
    };
}

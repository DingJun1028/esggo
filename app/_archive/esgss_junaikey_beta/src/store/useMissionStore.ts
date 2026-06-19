import { create } from 'zustand';
import { MissionObjective, MissionProgress, MissionStatus } from '@/types/agency';

interface MissionState {
    activeMissions: Map<string, MissionObjective>;
    missionProgress: Map<string, MissionProgress>;

    addMission: (mission: MissionObjective) => void;
    updateProgress: (missionId: string, progress: Partial<MissionProgress>) => void;
    completeMission: (missionId: string) => void;
}

export const useMissionStore = create<MissionState>((set, get) => ({
    activeMissions: new Map(),
    missionProgress: new Map(),

    addMission: (mission) => set((state) => {
        const newMissions = new Map(state.activeMissions);
        newMissions.set(mission.missionId, mission);
        return { activeMissions: newMissions };
    }),

    updateProgress: (missionId, progress) => set((state) => {
        const currentProgress = state.missionProgress.get(missionId) || {
            missionId,
            mission_status: MissionStatus.IN_PROGRESS,
            completionRate: 0,
            qualityScore: 0,
            lastUpdated: Date.now() as any,
            resourceUsage: { cpuTime: 0, memoryPeak: 0, apiCalls: 0 },
            issues: [],
            milestones: []
        };

        const newProgressMap = new Map(state.missionProgress);
        newProgressMap.set(missionId, { ...currentProgress, ...progress });
        return { missionProgress: newProgressMap };
    }),

    completeMission: (missionId) => set((state) => {
        const newMissions = new Map(state.activeMissions);
        const mission = newMissions.get(missionId);
        if (mission) {
            // Logically we could move it to a history map
            newMissions.delete(missionId);
        }

        const newProgressMap = new Map(state.missionProgress);
        const progress = newProgressMap.get(missionId);
        if (progress) {
            newProgressMap.set(missionId, { ...progress, mission_status: MissionStatus.COMPLETED, completionRate: 100 });
        }

        return { activeMissions: newMissions, missionProgress: newProgressMap };
    }),
}));

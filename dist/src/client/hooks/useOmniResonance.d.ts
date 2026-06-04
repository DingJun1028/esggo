/**
 * useOmniResonance Hook
 * 計算全域系統共鳴算力 Rs 並管理任督二脈流轉狀態
 */
export declare function useOmniResonance(): {
    rs: number;
    streamStatus: {
        ren: number;
        du: number;
    };
    isCrystallizing: boolean;
    triggerCrystallization: () => Promise<boolean>;
    status: string;
};
//# sourceMappingURL=useOmniResonance.d.ts.map
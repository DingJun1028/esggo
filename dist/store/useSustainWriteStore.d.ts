import { StateStorage } from 'zustand/middleware';
import { type SustainWriteSection } from '../lib/dataconnect-memory';
interface SustainWriteState {
    companyId: string;
    sections: Record<string, SustainWriteSection>;
    fieldValues: Record<string, Record<string, string>>;
    notes: Record<string, string>;
    docStates: Record<string, boolean>;
    chapterStatuses: Record<string, string>;
    generatedContent: Record<string, string>;
    loading: boolean;
    syncError: boolean;
    lastSaved: Date | null;
    contentHistory: Record<string, {
        past: string[];
        future: string[];
    }>;
    isGeneratingAI: Record<string, boolean>;
    ragContexts: Record<string, string>;
    initData: (companyId: string) => Promise<void>;
    triggerAutoSave: (chapterId: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    updateFieldValue: (chapterId: string, fieldId: string, value: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    updateNote: (chapterId: string, note: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    updateDocState: (docId: string, uploaded: boolean, chapterId: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    updateContent: (chapterId: string, content: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    updateChapterStatus: (chapterId: string, status: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    setGeneratedContent: (contentMap: Record<string, string>) => void;
    manualSave: (chapterId: string, chapterName: string, chapterOrder: number, griRefs: string[]) => Promise<void>;
    commitHistory: (chapterId: string) => void;
    undoContent: (chapterId: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    redoContent: (chapterId: string, chapterName: string, chapterOrder: number, griRefs: string[]) => void;
    expandContentWithAI: (chapterId: string, chapterName: string, chapterOrder: number, griRefs: string[], customPrompt?: string) => Promise<void>;
}
export declare const idbStorage: StateStorage;
export declare const useSustainWriteStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<SustainWriteState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SustainWriteState, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SustainWriteState) => void) => () => void;
        onFinishHydration: (fn: (state: SustainWriteState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SustainWriteState, unknown>>;
    };
}>;
export {};
//# sourceMappingURL=useSustainWriteStore.d.ts.map
import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { saveSustainWriteSection, loadSustainWriteSections, type SustainWriteSection } from '../lib/dataconnect-memory';

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
    // 歷史紀錄狀態 (以 chapterId 為 key)
    contentHistory: Record<string, { past: string[]; future: string[] }>;
    // 追蹤個別章節是否正在進行 AI 生成
    isGeneratingAI: Record<string, boolean>;
    ragContexts: Record<string, string>;

    // Actions
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

let autoSaveTimeout: ReturnType<typeof setTimeout>;

// 1. 建立零依賴的 IndexedDB 儲存引擎 (避免 localStorage 5MB 容量被撐爆)
const getIDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        // 安全防護：避免在 SSR 伺服器端或缺乏 IndexedDB 的測試環境 (JSDOM) 中引發錯誤
        if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return reject('No IDB');
        const request = indexedDB.open('esggo-db', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('zustand-store');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const idbStorage: StateStorage = {
    getItem: async (name) => {
        try {
            const db = await getIDB();
            return new Promise((resolve) => {
                const request = db.transaction('zustand-store', 'readonly').objectStore('zustand-store').get(name);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => resolve(null);
            });
        } catch { return null; }
    },
    setItem: async (name, value) => {
        try {
            const db = await getIDB();
            return new Promise<void>((resolve) => {
                const request = db.transaction('zustand-store', 'readwrite').objectStore('zustand-store').put(value, name);
                request.onsuccess = () => resolve();
                request.onerror = () => resolve();
            });
        } catch { }
    },
    removeItem: async (name) => {
        try {
            const db = await getIDB();
            return new Promise<void>((resolve) => {
                const request = db.transaction('zustand-store', 'readwrite').objectStore('zustand-store').delete(name);
                request.onsuccess = () => resolve();
                request.onerror = () => resolve();
            });
        } catch { }
    },
};

export const useSustainWriteStore = create<SustainWriteState>()(
    persist(
        (set, get) => ({
            companyId: 'default',
            sections: {},
            fieldValues: {},
            notes: {},
            docStates: {},
            chapterStatuses: {},
            generatedContent: {},
            loading: true,
            syncError: false,
            lastSaved: null,
            contentHistory: {},
            isGeneratingAI: {},
            ragContexts: {},

            initData: async (companyId: string) => {
                set({ loading: true, companyId });
                try {
                    const savedSections = await loadSustainWriteSections(companyId);
                    const sectionMap: Record<string, SustainWriteSection> = {};
                    const fvMap: Record<string, Record<string, string>> = {};
                    const notesMap: Record<string, string> = {};
                    const docMap: Record<string, boolean> = {};
                    const statusMap: Record<string, string> = {};
                    const contentMap: Record<string, string> = {};

                    savedSections.forEach(s => {
                        sectionMap[s.chapter_id] = s;
                        if (s.field_values) fvMap[s.chapter_id] = s.field_values as Record<string, string>;
                        if (s.notes) notesMap[s.chapter_id] = s.notes;
                        if (s.documents_state) Object.assign(docMap, s.documents_state);
                        if (s.status) statusMap[s.chapter_id] = s.status;
                        if (s.content) contentMap[s.chapter_id] = s.content;
                    });

                    set({
                        sections: sectionMap,
                        fieldValues: fvMap,
                        notes: notesMap,
                        docStates: docMap,
                        chapterStatuses: statusMap,
                        generatedContent: contentMap,
                        loading: false
                    });
                } catch (error) {
                    console.error('[SustainWriteStore] Failed to init data:', error);
                    set({ loading: false, syncError: true });
                }
            },

            triggerAutoSave: (chapterId, chapterName, chapterOrder, griRefs) => {
                const { companyId, fieldValues, notes, docStates, chapterStatuses, generatedContent } = get();
                clearTimeout(autoSaveTimeout);

                const localKey = `esggo_sw_draft_${companyId}_${chapterId}`;
                const draftPayload = {
                    company_id: companyId, chapter_id: chapterId, chapter_name: chapterName,
                    content: generatedContent[chapterId] || '', field_values: fieldValues[chapterId] || {},
                    notes: notes[chapterId] || '', documents_state: docStates,
                    status: (chapterStatuses[chapterId] || 'draft') as SustainWriteSection['status'],
                    chapter_order: chapterOrder, gri_references: griRefs
                };

                try { localStorage.setItem(localKey, JSON.stringify(draftPayload)); } catch (e) { }

                autoSaveTimeout = setTimeout(() => {
                    saveSustainWriteSection(draftPayload)
                        .then(() => {
                            set({ lastSaved: new Date(), syncError: false });
                            localStorage.removeItem(localKey);
                        })
                        .catch((err) => {
                            console.error('[SustainWriteStore] Auto-save failed:', err);
                            set({ syncError: true });
                        });
                }, 1000);
            },

            updateFieldValue: (chapterId, fieldId, value, chapterName, chapterOrder, griRefs) => {
                set((s) => ({ fieldValues: { ...s.fieldValues, [chapterId]: { ...(s.fieldValues[chapterId] || {}), [fieldId]: value } } }));
                get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
            },

            updateNote: (chapterId, note, chapterName, chapterOrder, griRefs) => {
                set((s) => ({ notes: { ...s.notes, [chapterId]: note } }));
                get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
            },

            updateDocState: (docId, uploaded, chapterId, chapterName, chapterOrder, griRefs) => {
                set((s) => ({ docStates: { ...s.docStates, [docId]: uploaded } }));
                get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
            },

            updateContent: (chapterId, content, chapterName, chapterOrder, griRefs) => {
                set((s) => ({ generatedContent: { ...s.generatedContent, [chapterId]: content } }));
                get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
            },

            updateChapterStatus: (chapterId, status, chapterName, chapterOrder, griRefs) => {
                set((s) => ({ chapterStatuses: { ...s.chapterStatuses, [chapterId]: status } }));
                get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
            },

            setGeneratedContent: (contentMap) => set({ generatedContent: contentMap }),

            manualSave: async (chapterId, chapterName, chapterOrder, griRefs) => {
                const { companyId, fieldValues, notes, docStates, chapterStatuses, generatedContent } = get();
                const payload = {
                    company_id: companyId, chapter_id: chapterId, chapter_name: chapterName,
                    content: generatedContent[chapterId] || '', field_values: fieldValues[chapterId] || {},
                    notes: notes[chapterId] || '', documents_state: docStates,
                    status: (chapterStatuses[chapterId] || 'draft') as SustainWriteSection['status'],
                    chapter_order: chapterOrder, gri_references: griRefs,
                };

                try {
                    const result = await saveSustainWriteSection(payload);
                    set({ lastSaved: new Date(), syncError: false });
                    localStorage.removeItem(`esggo_sw_draft_${companyId}_${chapterId}`);
                    return result;
                } catch (err) {
                    console.error('[SustainWriteStore] Manual save failed:', err);
                    set({ syncError: true });
                    throw err;
                }
            },

            commitHistory: (chapterId) => {
                const { generatedContent, contentHistory } = get();
                const currentContent = generatedContent[chapterId] || '';
                const history = contentHistory[chapterId] || { past: [], future: [] };

                // 避免重複儲存相同的內容
                if (history.past.length > 0 && history.past[history.past.length - 1] === currentContent) return;

                set({
                    contentHistory: {
                        ...contentHistory,
                        [chapterId]: {
                            past: [...history.past, currentContent].slice(-50), // 最多保留 50 步
                            future: [] // 一旦有新改動，清除前進歷史
                        }
                    }
                });
            },

            undoContent: (chapterId, chapterName, chapterOrder, griRefs) => {
                const { generatedContent, contentHistory } = get();
                const history = contentHistory[chapterId];
                if (!history || history.past.length === 0) return;

                const currentContent = generatedContent[chapterId] || '';
                const previousContent = history.past[history.past.length - 1];
                const newPast = history.past.slice(0, -1);

                set({
                    generatedContent: { ...generatedContent, [chapterId]: previousContent },
                    contentHistory: {
                        ...contentHistory,
                        [chapterId]: {
                            past: newPast,
                            future: [currentContent, ...history.future]
                        }
                    }
                });
                get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
            },

            redoContent: (chapterId, chapterName, chapterOrder, griRefs) => {
                const { generatedContent, contentHistory } = get();
                const history = contentHistory[chapterId];
                if (!history || history.future.length === 0) return;

                const currentContent = generatedContent[chapterId] || '';
                const nextContent = history.future[0];
                const newFuture = history.future.slice(1);

                set({
                    generatedContent: { ...generatedContent, [chapterId]: nextContent },
                    contentHistory: {
                        ...contentHistory,
                        [chapterId]: {
                            past: [...history.past, currentContent],
                            future: newFuture
                        }
                    }
                });
                get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
            },

            expandContentWithAI: async (chapterId, chapterName, chapterOrder, griRefs, customPrompt) => {
                const { companyId, generatedContent, commitHistory } = get();

                // 1. 先把當前內容存入歷史紀錄，以便復原
                commitHistory(chapterId);

                set((s) => ({ isGeneratingAI: { ...s.isGeneratingAI, [chapterId]: true } }));

                try {
                    const res = await fetch('/api/ai/expand', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            companyId,
                            chapterName,
                            content: generatedContent[chapterId] || '',
                            prompt: customPrompt,
                            targetWordCount: 20000
                        })
                    });

                    if (!res.ok) throw new Error('AI Expansion API Failed');

                    const reader = res.body?.getReader();
                    const decoder = new TextEncoder();
                    if (!reader) throw new Error('Failed to get stream reader');

                    let expandedText = generatedContent[chapterId] || '';

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = new TextDecoder().decode(value);
                        expandedText += chunk;

                        // 即時更新 UI，產生打字機效果
                        set((s) => ({
                            generatedContent: { ...s.generatedContent, [chapterId]: expandedText }
                        }));
                    }

                } catch (error) {
                    console.error('[SustainWriteStore] AI Expansion Error:', error);
                } finally {
                    set((s) => ({ isGeneratingAI: { ...s.isGeneratingAI, [chapterId]: false } }));
                    get().triggerAutoSave(chapterId, chapterName, chapterOrder, griRefs);
                }
            }
        }),
        {
            name: 'sustain-write-history', // 儲存至 IndexedDB 時的 Key
            storage: createJSONStorage(() => idbStorage),
            // 🚀 核心優化：只攔截肥大的 contentHistory 進行持久化，其餘保持在記憶體中
            partialize: (state) => ({ contentHistory: state.contentHistory }),
        }
    )
);
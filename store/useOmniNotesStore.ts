import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncTaskAction } from '@/app/actions/omni-notes';

// 定義類似 Capacities 的物件類型 (Object Types)
export type NoteType = 'log' | 'idea' | 'meeting' | 'task' | 'research' | 'knowledge';

export interface OmniNote {
    id: string;
    content: string;
    type: NoteType;
    date: string;
    createdAt: number;
    source: 'local' | 'blue' | 'aitable' | 'capacities';
    externalId?: string;
    metadata: Record<string, any>;
}

interface OmniNotesState {
    notes: OmniNote[];
    isSyncing: boolean;
    addNote: (content: string, type: NoteType, date: string) => void;
    deleteNote: (id: string) => void;
    getNotesByDate: (date: string) => OmniNote[];
}

export const useOmniNotesStore = create<OmniNotesState>()(
    persist(
        (set, get) => ({
            notes: [],
            isSyncing: false,

            addNote: (content, type, date) => {
                const newNote: OmniNote = {
                    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    content,
                    type,
                    date,
                    createdAt: Date.now(),
                };
                set((state) => ({ notes: [newNote, ...state.notes] }));

                // 如果筆記類型是 'task'，則觸發同步到 OmniTable
                if (type === 'task') {
                    set({ isSyncing: true });
                    syncTaskAction(content)
                        .then(() => console.log('[OmniNotes] Task synced to OmniTable successfully.'))
                        .catch((err) => console.error('[OmniNotes] Failed to sync task:', err))
                        .finally(() => {
                            setTimeout(() => set({ isSyncing: false }), 1000); // 延遲一下，讓使用者看到成功狀態
                        });
                }
            },

            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                }));
            },

            getNotesByDate: (date) => {
                return get().notes.filter((note) => note.date === date).sort((a, b) => b.createdAt - a.createdAt);
            },
        }),
        {
            name: 'omni-notes-storage', // 儲存於 localStorage 的 Key
        }
    )
);
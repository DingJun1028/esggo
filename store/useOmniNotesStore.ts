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

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    synced: boolean;
    noteId?: string; // Optional reference to the note it was extracted from
}

interface OmniNotesState {
    notes: OmniNote[];
    tasks: Task[];
    isSyncing: boolean;
    addNote: (content: string, type: NoteType, date: string) => void;
    deleteNote: (id: string) => void;
    getNotesByDate: (date: string) => OmniNote[];
    addTasks: (newTasks: Task[]) => void;
    updateTaskStatus: (id: string, status: TaskStatus) => void;
    syncTasks: () => Promise<void>;
}

export const useOmniNotesStore = create<OmniNotesState>()(
    persist(
        (set, get) => ({
            notes: [],
            tasks: [],
            isSyncing: false,

            addNote: (content, type, date) => {
                const newNote: OmniNote = {
                    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    content,
                    type,
                    date,
                    createdAt: Date.now(),
                    source: 'local',
                    metadata: {},
                };
                set((state) => ({ notes: [newNote, ...state.notes] }));

                // 如果筆記類型是 'task'，則觸發同步到 OmniTable (legacy fallback)
                if (type === 'task') {
                    set({ isSyncing: true });
                    syncTaskAction(newNote.id, content, 'Todo')
                        .then(() => console.log('[OmniNotes] Note-Task synced to OmniTable successfully.'))
                        .catch((err) => console.error('[OmniNotes] Failed to sync note-task:', err))
                        .finally(() => {
                            setTimeout(() => set({ isSyncing: false }), 1000);
                        });
                }
            },

            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                    // Optional: remove associated tasks if necessary, though we might want to keep them if they were synced
                }));
            },

            getNotesByDate: (date) => {
                return get().notes.filter((note) => note.date === date).sort((a, b) => b.createdAt - a.createdAt);
            },

            addTasks: (newTasks) => {
                set((state) => {
                    const existingTaskIds = new Set(state.tasks.map(t => t.id));
                    const uniqueNewTasks = newTasks.filter(t => !existingTaskIds.has(t.id));
                    return { tasks: [...state.tasks, ...uniqueNewTasks] };
                });
            },

            updateTaskStatus: (id, status) => {
                set((state) => ({
                    tasks: state.tasks.map(t => t.id === id ? { ...t, status, synced: false } : t)
                }));
            },

            syncTasks: async () => {
                const { tasks } = get();
                const unsynced = tasks.filter(t => !t.synced);
                if (unsynced.length === 0) return;

                set({ isSyncing: true });

                for (const task of unsynced) {
                    try {
                        const result = await syncTaskAction(task.id, task.title, task.status);
                        if (result.success) {
                            set((state) => ({
                                tasks: state.tasks.map(t => t.id === task.id ? { ...t, synced: true } : t)
                            }));
                        }
                    } catch (error) {
                        console.error('[OmniNotes Store] Failed to sync task:', error);
                    }
                }

                set({ isSyncing: false });
            }
        }),
        {
            name: 'omni-notes-storage', // 儲存於 localStorage 的 Key
        }
    )
);
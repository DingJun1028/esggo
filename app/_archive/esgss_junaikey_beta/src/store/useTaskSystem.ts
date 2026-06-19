import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OmniTask, TaskStatus } from '../core/types';

interface TaskState {
  tasks: OmniTask[];

  // 動作
  addTask: (task: Partial<OmniTask>) => void;
  updateTask: (id: string, updates: Partial<OmniTask>) => void;
  completeTask: (id: string) => void;

  // 智慧查詢
  getTasksByContext: (contextId: string) => OmniTask[];
  getOverdueTasks: () => OmniTask[];
}

export const useTaskSystem = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: task =>
        set(state => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title: task.title || 'Untitled Protocol',
              status: 'TODO',
              priority: task.priority || 'MEDIUM',
              subTasks: [],
              tags: [],
              ...task,
            } as OmniTask,
          ],
        })),

      updateTask: (id, updates) =>
        set(state => ({
          tasks: state.tasks.map(t => (t.id === id ? { ...t, ...updates } : t)),
        })),

      completeTask: id =>
        set(state => ({
          tasks: state.tasks.map(t => (t.id === id ? { ...t, status: 'DONE' } : t)),
        })),

      getTasksByContext: ctxId => get().tasks.filter(t => t.contextId === ctxId),

      getOverdueTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter(t => {
          if (!t.dueDate) return false;
          const isOverdue = today && new Date(t.dueDate) < new Date(today) && t.status !== 'DONE';
          return isOverdue;
        });
      },
    }),
    { name: 'jun-ai-key-tasks' }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StrategicItem {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  timestamp: string;
  isAiProposed?: boolean;
  sourceNodeId?: string;
  confidence?: number;
}

interface StrategyState {
  queue: StrategicItem[];
  addItem: (item: StrategicItem) => void;
  removeItem: (id: string) => void;
  clearQueue: () => void;
}

export const useStrategyStore = create<StrategyState>()(
  persist(
    set => ({
      queue: [],
      addItem: item =>
        set(state => {
          // Prevent duplicates
          if (state.queue.find(i => i.id === item.id)) return state;
          return { queue: [...state.queue, item] };
        }),
      removeItem: id =>
        set(state => ({
          queue: state.queue.filter(i => i.id !== id),
        })),
      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: 'omni-strategy-store',
    }
  )
);

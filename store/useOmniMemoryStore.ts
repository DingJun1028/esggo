import { create } from 'zustand';
import { OmniMemoryService } from '@/lib/services/omni-memory.service';
import { MemoryShard, OmniShardUsageActionSchema } from '@/types/omni-memory';
import { z } from 'zod';

interface OmniMemoryState {
  shards: MemoryShard[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchShards: () => Promise<void>;
  addShard: (shard: Partial<MemoryShard>) => Promise<void>;
  logUsage: (shardId: string, action: z.infer<typeof OmniShardUsageActionSchema>, context?: string) => Promise<void>;
  syncWithNCB: () => Promise<void>;
}

export const useOmniMemoryStore = create<OmniMemoryState>((set, get) => ({
  shards: [],
  isLoading: false,
  error: null,

  fetchShards: async () => {
    set({ isLoading: true, error: null });
    try {
      const shards = await OmniMemoryService.fetchShards();
      set({ shards, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  syncWithNCB: async () => {
    set({ isLoading: true, error: null });
    try {
      await OmniMemoryService.syncFromNCB();
      // 拉取完 NCBDB 後重新讀取本地資料庫，以更新狀態
      await get().fetchShards();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addShard: async (shardData) => {
    set({ isLoading: true, error: null });
    try {
      const newShard = await OmniMemoryService.addShard(shardData);
      set((state) => ({
        shards: [newShard, ...state.shards],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logUsage: async (shardId, action, context) => {
    try {
      await OmniMemoryService.logShardUsage(shardId, action, context);
      // 可選擇在本地也更新 usage_count 以保持即時性
      set((state) => ({
        shards: state.shards.map((s) => 
          s.id === shardId ? { ...s, usage_count: s.usage_count + 1 } : s
        )
      }));
    } catch (error) {
      console.error('Failed to log usage:', error);
    }
  }
}));

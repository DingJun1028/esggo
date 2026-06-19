/**
 * 奧秘化身狀態管理 Store
 *
 * 使用 Zustand 管理代理化身狀態
 */

import { create } from 'zustand';
import type { ActiveAvatar, AvatarRepository } from '../types';

interface OmniAvatarState {
  // 狀態
  repositories: Map<string, AvatarRepository>;
  activeAvatars: Map<string, ActiveAvatar>;
  primaryAvatar: any | null; // The Personal Digital Avatar (InfoOneCore)

  // Actions
  setRepository: (agentId: string, repository: AvatarRepository) => void;
  setActiveAvatar: (agentId: string, avatar: ActiveAvatar) => void;
  setPrimaryAvatar: (avatar: any) => void;
  getActiveAvatar: (agentId: string) => ActiveAvatar | undefined;
  clearAll: () => void;
}

export const useOmniAvatar = create<OmniAvatarState>((set, get) => ({
  repositories: new Map(),
  activeAvatars: new Map(),
  primaryAvatar: null,

  setRepository: (agentId: string, repository: AvatarRepository) => {
    set(state => {
      const newRepositories = new Map(state.repositories);
      newRepositories.set(agentId, repository);
      return { repositories: newRepositories };
    });
  },

  setActiveAvatar: (agentId: string, avatar: ActiveAvatar) => {
    set(state => {
      const newActiveAvatars = new Map(state.activeAvatars);
      newActiveAvatars.set(agentId, avatar);
      return { activeAvatars: newActiveAvatars };
    });
  },

  setPrimaryAvatar: (avatar: any) => {
    set({ primaryAvatar: avatar });
  },

  getActiveAvatar: (agentId: string) => {
    return get().activeAvatars.get(agentId);
  },

  clearAll: () => {
    set({ repositories: new Map(), activeAvatars: new Map(), primaryAvatar: null });
  },
}));

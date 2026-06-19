/**
 * useSocial.ts
 * ----------------------------
 * 社交系統 Zustand Store
 * 
 * 核心理念：互助共生，知識資產化
 * 設計哲學：社交鏈條，永續連結
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Friend, FriendRequest, OmniClaw, ActivityFeedItem } from '../../server/src/services/UnifiedAdvancementSocial';

interface SocialState {
    friends: Friend[];
    friendRequests: FriendRequest[];
    omniClaws: OmniClaw[];
    activityFeed: ActivityFeedItem[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchFriends: (userId: string) => Promise<void>;
    fetchFriendRequests: (userId: string) => Promise<void>;
    sendFriendRequest: (fromUserId: string, fromUsername: string, toUserId: string, message?: string) => Promise<void>;
    respondToFriendRequest: (requestId: string, accept: boolean) => Promise<void>;

    fetchOmniClaws: () => Promise<void>;
    createOmniClaw: (name: string, leaderId: string, description?: string, category?: string) => Promise<void>;
    activateAgent: (omniClawId: string) => Promise<void>;

    fetchActivityFeed: () => Promise<void>;
    getSocialAdvice: (userId: string, context: string, omniClawId?: string) => Promise<string>;
}

export const useSocial = create<SocialState>()(
    persist(
        (set, get) => ({
            friends: [],
            friendRequests: [],
            omniClaws: [],
            activityFeed: [],
            loading: false,
            error: null,

            fetchFriends: async (userId: string) => {
                set({ loading: true });
                try {
                    const response = await fetch(`/api/social/friends/${userId}`);
                    const result = await response.json();
                    if (result.success) {
                        set({ friends: result.data, error: null });
                    } else {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to fetch friends' });
                } finally {
                    set({ loading: false });
                }
            },

            fetchFriendRequests: async (userId: string) => {
                set({ loading: true });
                try {
                    const response = await fetch(`/api/social/friend-requests/${userId}`);
                    const result = await response.json();
                    if (result.success) {
                        set({ friendRequests: result.data, error: null });
                    } else {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to fetch friend requests' });
                } finally {
                    set({ loading: false });
                }
            },

            sendFriendRequest: async (fromUserId, fromUsername, toUserId, message) => {
                set({ loading: true });
                try {
                    const response = await fetch('/api/social/friend-request', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fromUserId, fromUsername, toUserId, message }),
                    });
                    const result = await response.json();
                    if (!result.success) {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to send friend request' });
                } finally {
                    set({ loading: false });
                }
            },

            respondToFriendRequest: async (requestId, accept) => {
                set({ loading: true });
                try {
                    const response = await fetch(`/api/social/friend-request/${requestId}/respond`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ accept }),
                    });
                    const result = await response.json();
                    if (result.success) {
                        // Refresh requests
                        // Note: In real app, we might need the current userId
                    } else {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to respond to friend request' });
                } finally {
                    set({ loading: false });
                }
            },

            fetchOmniClaws: async () => {
                set({ loading: true });
                try {
                    const response = await fetch('/api/social/omniclaws');
                    const result = await response.json();
                    if (result.success) {
                        set({ omniClaws: result.data, error: null });
                    } else {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to fetch omniclaws' });
                } finally {
                    set({ loading: false });
                }
            },

            createOmniClaw: async (name, leaderId, description, category) => {
                set({ loading: true });
                try {
                    const response = await fetch('/api/social/omniclaw', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, leaderId, description, category }),
                    });
                    const result = await response.json();
                    if (result.success) {
                        await get().fetchOmniClaws();
                    } else {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to create omniclaw' });
                } finally {
                    set({ loading: false });
                }
            },

            activateAgent: async (omniClawId) => {
                set({ loading: true });
                try {
                    const response = await fetch(`/api/social/omniclaw/${omniClawId}/activate`, {
                        method: 'POST',
                    });
                    const result = await response.json();
                    if (result.success) {
                        await get().fetchOmniClaws();
                    } else {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to activate agent' });
                } finally {
                    set({ loading: false });
                }
            },

            fetchActivityFeed: async () => {
                set({ loading: true });
                try {
                    const response = await fetch('/api/social/activity-feed');
                    const result = await response.json();
                    if (result.success) {
                        set({ activityFeed: result.data, error: null });
                    } else {
                        set({ error: result.error });
                    }
                } catch (err) {
                    set({ error: 'Failed to fetch activity feed' });
                } finally {
                    set({ loading: false });
                }
            },

            getSocialAdvice: async (userId, context, omniClawId) => {
                try {
                    const response = await fetch('/api/social/advice', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, context, omniClawId }),
                    });
                    const result = await response.json();
                    if (result.success) {
                        return result.data.advice;
                    }
                    return 'AI 建議獲取失敗';
                } catch (err) {
                    console.error('Advice error:', err);
                    return 'AI 建議連線失敗';
                }
            },
        }),
        {
            name: 'omni-social-storage',
            partialize: (state) => ({
                friends: state.friends,
                omniClaws: state.omniClaws,
            }),
        }
    )
);

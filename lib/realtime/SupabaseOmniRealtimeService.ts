import { IOmniRealtimeService, OmniEvent, RealtimeCallbacks } from './IOmniRealtimeService';
import { supabase } from '../supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Fallback memory store for offline mode
const memoryEvents: OmniEvent[] = [];

export class SupabaseOmniRealtimeService implements IOmniRealtimeService {
    private channel: RealtimeChannel | null = null;
    private isConnected = false;

    connect(user: Record<string, any> | null, callbacks: RealtimeCallbacks): void {
        // NCBDB/Simulation Fallback Mode
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.log('[OmniRealtime] Supabase unavailable. Using NCBDB simulation mode.');
            this.isConnected = true;
            callbacks.onStatusChange(true);
            // Simulate presence
            callbacks.onPresenceSync([{ user_id: user?.uid || 'anon', email: user?.email || 'Anonymous Commander' }]);
            return;
        }

        this.channel = supabase.channel('omni-resonance-room');

        this.channel
            .on('presence', { event: 'sync' }, () => {
                if (!this.channel) return;
                const newState = this.channel.presenceState();
                const users = Object.values(newState).flatMap((arr) => arr || []) as Record<string, unknown>[];
                callbacks.onPresenceSync(users);
            })
            .on('presence', { event: 'join' }, ({ newPresences }: { newPresences: Record<string, unknown>[] }) => {
                console.log('[OmniRealtime] User joined:', newPresences);
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: Record<string, unknown>[] }) => {
                console.log('[OmniRealtime] User left:', leftPresences);
            })
            .on('broadcast', { event: 'omni_event' }, ({ payload }: { payload: OmniEvent }) => {
                callbacks.onEventReceived(payload);
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED' && this.channel) {
                    this.isConnected = true;
                    callbacks.onStatusChange(true);
                    const trackPayload = user
                        ? { user_id: user.uid, email: user.email, online_at: new Date().toISOString() }
                        : { user_id: `anon_${crypto.randomUUID()}`, email: 'Anonymous Commander', online_at: new Date().toISOString() };
                    await this.channel.track(trackPayload);
                } else {
                    this.isConnected = false;
                    callbacks.onStatusChange(false);
                }
            });
    }

    disconnect(): void {
        this.isConnected = false;
        if (this.channel) {
            this.channel.unsubscribe();
            this.channel = null;
        }
    }

    async emitEvent(event: Omit<OmniEvent, 'id' | 'timestamp'>, user: Record<string, any> | null): Promise<OmniEvent> {
        const newEvent: OmniEvent = {
            ...event,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            user_email: user?.email || 'Anonymous Commander'
        };

        if (this.channel && this.isConnected) {
            await this.channel.send({ type: 'broadcast', event: 'omni_event', payload: newEvent });
        }

        // Memory fallback
        memoryEvents.unshift(newEvent);
        if (memoryEvents.length > 50) memoryEvents.pop();

        // 非同步寫入遙測數據 (Fire-and-forget 模式)
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            fetch('/api/telemetry', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEvent)
            }).catch(error => console.error('[OmniRealtime] Failed to sync telemetry:', error));
        } else {
            console.log('[OmniRealtime] Offline event stored in memory:', newEvent.id);
        }

        return newEvent;
    }
}

export const omniRealtime = new SupabaseOmniRealtimeService();
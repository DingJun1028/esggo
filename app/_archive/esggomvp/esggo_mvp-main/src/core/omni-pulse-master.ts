/**
 * 💓 OmniPulse: System Heartbeat Master
 * Broadcaster for the Universal Life Rhythm.
 */

import { omniLogger, LogCategory } from './omniLogger';

/**
 * Global Pulse Events
 */
export enum PulseEvent {
    TICK = 'OMNI_PULSE_TICK',
    SYNC = 'OMNI_PULSE_SYNC'
}

type PulseListener = (tick: number) => void;

export class OmniOneMaster {
    private static bpm: number = 60; // Standard ESG Pulse
    private static intervalId: number | null = null;
    private static listeners: Set<PulseListener> = new Set();
    private static currentTick: number = 0;

    /**
     * 🚀 Start the Heartbeat
     */
    static startHeartbeat(bpm: number = 60) {
        this.bpm = bpm;
        const intervalMs = (60 / this.bpm) * 1000;

        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        omniLogger.info(LogCategory.SYSTEM, `💓 OmniPulse Started: ${this.bpm} BPM (${intervalMs}ms)`);

        this.intervalId = setInterval(() => {
            this.currentTick++;
            this.broadcast(this.currentTick);
        }, intervalMs) as any;
    }

    /**
     * 📡 Register Life Resonance
     */
    static subscribe(listener: PulseListener) {
        this.listeners.add(listener);
    }

    static unsubscribe(listener: PulseListener) {
        this.listeners.delete(listener);
    }

    private static broadcast(tick: number) {
        this.listeners.forEach(listener => {
            try {
                listener(tick);
            } catch (e) {
                omniLogger.error(LogCategory.SYSTEM, `Pulse Error in Resonance: ${e}`);
            }
        });
    }

    static stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        omniLogger.warn(LogCategory.SYSTEM, '💓 OmniPulse Stopped.');
    }
}

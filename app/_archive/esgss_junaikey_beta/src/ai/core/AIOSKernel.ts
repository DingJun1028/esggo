/**
 * AIOS Kernel (Artificial Intelligence Operating System Kernel)
 *
 * Central nervous system for JunAiKey.
 * Handles event dispatching, inter-component communication, and system heartbeat.
 */

import { omniLogger, LogCategory } from '../../services/omniLogger';

export type KernelEventType = 'INTERACTION' | 'SYSTEM' | 'ERROR' | 'EVOLUTION' | 'OMNI_SIGNAL';

export interface KernelEvent {
  type: KernelEventType;
  payload: any;
  timestamp: number;
  source: string;
}

type EventHandler = (event: KernelEvent) => void;

class AIOSKernelService {
  private listeners: Map<KernelEventType, EventHandler[]> = new Map();
  private _startTime: number = Date.now();

  /**
   * Dispatch an event to the kernel
   */
  dispatch(event: KernelEvent): void {
    const handlers = this.listeners.get(event.type) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (e) {
        omniLogger.error(LogCategory.SYSTEM, '[AIOSKernel] Error in event handler', { error: e });
      }
    });

    // Global logging for debugging
    if (process.env.NODE_ENV === 'development') {
      // console.debug(`[AIOSKernel] ⚡ ${event.type} from ${event.source}`, event.payload);
    }
  }

  /**
   * Subscribe to a specific event type
   * Returns an unsubscribe function
   */
  subscribe(type: KernelEventType, handler: EventHandler): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(handler);

    return () => {
      const handlers = this.listeners.get(type) || [];
      this.listeners.set(
        type,
        handlers.filter(h => h !== handler)
      );
    };
  }

  /**
   * System uptime
   */
  getUptime(): number {
    return Date.now() - this._startTime;
  }
}

export const AIOSKernel = new AIOSKernelService();

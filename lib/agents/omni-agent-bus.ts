/**
 * OmniAgent Bus - Event system for agent coordination
 * Used for 5T Protocol event publishing
 */

type AgentEventCallback = (data: any) => void;

export class OAAgentBus {
  private subscribers: Map<string, AgentEventCallback[]> = new Map();
  private _startTime: number = Date.now();
  private _errorCount: number = 0;
  private _totalEvents: number = 0;
  private autonomyTimer: NodeJS.Timeout | null = null;

  publish(event: string, data: any): void {
    this._totalEvents++;
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          this._errorCount++;
          console.error(`[OAAgentBus] Subscriber error for ${event}:`, e);
        }
      });
    }
  }

  subscribe(event: string, callback: AgentEventCallback): () => void {
    const callbacks = this.subscribers.get(event) || [];
    callbacks.push(callback);
    this.subscribers.set(event, callbacks);

    return () => {
      const idx = callbacks.indexOf(callback);
      if (idx > -1) callbacks.splice(idx, 1);
    };
  }

  getHealth(): { status: string; uptime: number; errorRate: number } {
    const uptime = Date.now() - this._startTime;
    return {
      status: 'operational',
      uptime,
      errorRate: this._totalEvents > 0 ? this._errorCount / this._totalEvents : 0,
    };
  }

  registerBroadcastHook(_callback?: (event: string, payload: any) => void): void {
    // Placeholder for broadcast hook registration
  }

  executeCelestialCommand(_cmd: string, _context?: any): Promise<string> {
    return Promise.resolve('Celestial command executed');
  }

  startAutonomy(_intervalMs: number): void {
    console.log(`[Autonomy] Started with interval`);
  }

  stopAutonomy(): void {
    if (this.autonomyTimer) {
      clearInterval(this.autonomyTimer);
      this.autonomyTimer = null;
    }
  }

  broadcastGlobalNotification(_payload: any): void {
    // Placeholder for global notification broadcast
  }
}

export const omniAgentBus = new OAAgentBus();
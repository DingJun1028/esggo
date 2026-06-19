/**
 * OmniAgent Bus - Event system for agent coordination
 * Used for 5T Protocol event publishing
 */

type AgentEventCallback = (data: any) => void;

export class OmniAgentBus {
  private subscribers: Map<string, AgentEventCallback[]> = new Map();
  private _uptime: number = 0;
  private _startTime: number = Date.now();
  private _errorCount: number = 0;
  private _totalEvents: number = 0;

  publish(event: string, data: any): void {
    this._totalEvents++;
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          this._errorCount++;
          console.error(`[OmniAgentBus] Subscriber error for ${event}:`, e);
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

  registerBroadcastHook(): void {
    // Placeholder for broadcast hook registration
  }
}

export const omniAgentBus = new OmniAgentBus();
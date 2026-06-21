// lib/omni-hub/realtime.ts
// 萬能中心 — 即時事件系統（SSE + 記憶體內事件匯流排）

export interface RealtimeEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

type EventHandler = (event: RealtimeEvent) => void;

class RealtimeBus {
  private handlers: Set<EventHandler> = new Set();
  private eventHistory: RealtimeEvent[] = [];
  private maxHistory = 200;

  get subscriberCount(): number {
    return this.handlers.size;
  }

  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  emit(type: string, payload: Record<string, unknown> = {}): void {
    const event: RealtimeEvent = { type, payload, timestamp: Date.now() };
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistory);
    }
    this.handlers.forEach((handler) => {
      try {
        handler(event);
      } catch (e) {
        // ignore handler errors
      }
    });
  }

  getHistory(type?: string, limit = 50): RealtimeEvent[] {
    let events = this.eventHistory;
    if (type) events = events.filter((e) => e.type === type);
    return events.slice(-limit);
  }

  clear(): void {
    this.eventHistory = [];
    this.handlers.clear();
  }
}

// 單例匯流排
export const realtime = new RealtimeBus();

// 便利函數
export function emitFacilityStatus(facilityId: string, status: string) {
  realtime.emit('facility_status', { facilityId, status, timestamp: Date.now() });
}

export function emitMemoryUpdate(memoryId: string, agentId: string, type: string) {
  realtime.emit('memory_update', { memoryId, agentId, type, timestamp: Date.now() });
}

export function emitTaskUpdate(taskId: string, status: string, assignedTo: string) {
  realtime.emit('task_update', { taskId, status, assignedTo, timestamp: Date.now() });
}

export function emitAgentMessage(fromAgentId: string, toAgentId: string, message: string) {
  realtime.emit('agent_message', { fromAgentId, toAgentId, message, timestamp: Date.now() });
}

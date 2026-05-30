export interface TelemetryEvent {
  id: string;
  agent: string;
  task: string;
  timestamp: string;
  duration: number;
  success: boolean;
  context?: unknown;
  error?: string;
  tokensUsed?: number;
  cost?: number;
  simulated?: boolean;
}

export interface AgentMetrics {
  agent: string;
  totalTasks: number;
  successRate: number;
  avgDuration: number;
  totalCost: number;
  lastRun: string;
}

class TelemetryService {
  private events: TelemetryEvent[] = [];
  private metrics: Map<string, AgentMetrics> = new Map();

  recordEvent(event: Omit<TelemetryEvent, 'id'>) {
    const fullEvent: TelemetryEvent = {
      ...event,
      id: `telemetry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    this.events.push(fullEvent);
    
    this.updateMetrics(fullEvent);
  }

  updateMetrics(event: TelemetryEvent) {
    const existing = this.metrics.get(event.agent);
    const agentMetrics: AgentMetrics = {
      agent: event.agent,
      totalTasks: (existing?.totalTasks || 0) + 1,
      successRate: existing ? 
        (existing.successRate * existing.totalTasks + (event.success ? 1 : 0)) / (existing.totalTasks + 1) :
        event.success ? 1 : 0,
      avgDuration: existing ? 
        (existing.avgDuration * existing.totalTasks + event.duration) / (existing.totalTasks + 1) :
        event.duration,
      totalCost: (existing?.totalCost || 0) + (event.cost || 0),
      lastRun: event.timestamp
    };
    this.metrics.set(event.agent, agentMetrics);
  }

  getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  getMetrics(): AgentMetrics[] {
    return Array.from(this.metrics.values());
  }

  getEventsByAgent(agent: string): TelemetryEvent[] {
    return this.events.filter(e => e.agent === agent);
  }

  clear(): void {
    this.events = [];
    this.metrics.clear();
  }
}

export const telemetryService = new TelemetryService();
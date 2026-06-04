class TelemetryService {
    constructor() {
        this.events = [];
        this.metrics = new Map();
    }
    recordEvent(event) {
        const fullEvent = {
            ...event,
            id: `telemetry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        this.events.push(fullEvent);
        this.updateMetrics(fullEvent);
    }
    updateMetrics(event) {
        const existing = this.metrics.get(event.agent);
        const agentMetrics = {
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
    getEvents() {
        return [...this.events];
    }
    getMetrics() {
        return Array.from(this.metrics.values());
    }
    getEventsByAgent(agent) {
        return this.events.filter(e => e.agent === agent);
    }
    clear() {
        this.events = [];
        this.metrics.clear();
    }
}
export const telemetryService = new TelemetryService();
//# sourceMappingURL=service.js.map
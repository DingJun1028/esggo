'use client';
import { useState, useEffect } from 'react';
import { telemetryService, TelemetryEvent } from '@/lib/telemetry/service';

export default function TelemetryDashboard() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [metrics, setMetrics] = useState<unknown[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedAgent]);

  const fetchData = async () => {
    try {
      const response = await fetch(selectedAgent ? 
        `/api/telemetry?agent=${selectedAgent}` : 
        '/api/telemetry'
      );
      const data = await response.json();
      setEvents(data.events || []);
      setMetrics(data.metrics || []);
    } catch (error) {
      console.error('Failed to fetch telemetry:', error);
    }
  };

  const clearTelemetry = () => {
    telemetryService.clear();
    fetchData();
  };

  const totalEvents = events.length;
  const successRate = events.length > 0 ? 
    (events.filter(e => e.success).length / events.length * 100).toFixed(1) : 
    '0';

  const uniqueAgents = [...new Set(events.map(e => e.agent))];
  const totalDuration = events.reduce((sum, e) => sum + e.duration, 0);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">OmniAgent Telemetry Dashboard</h1>
        <button 
          onClick={clearTelemetry}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Events</h3>
          <p className="text-2xl">{totalEvents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Success Rate</h3>
          <p className="text-2xl">{successRate}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Active Agents</h3>
          <p className="text-2xl">{uniqueAgents.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Duration</h3>
          <p className="text-2xl">{(totalDuration / 1000).toFixed(1)}s</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Agent</label>
          <select 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Agents</option>
            {uniqueAgents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold border-b">
            <div>Agent</div>
            <div>Task</div>
            <div>Success</div>
            <div>Duration</div>
            <div>Simulated</div>
            <div>Error</div>
          </div>
          <div className="divide-y">
            {events.slice().reverse().map((event, index) => (
              <div key={event.id} className="grid grid-cols-12 gap-4 p-4">
                <div className="truncate">{event.agent}</div>
                <div className="truncate">{event.task}</div>
                <div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    event.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {event.success ? '✓' : '✗'}
                  </span>
                </div>
                <div>{(event.duration / 1000).toFixed(2)}s</div>
                <div>
                  {event.simulated ? (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      Simulated
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </div>
                <div className="truncate text-red-600">{event.error || '-'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {metrics.length > 0 && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Agent Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map(metric => (
              <div key={metric.agent} className="border rounded p-4">
                <h4 className="font-semibold">{metric.agent}</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div>Tasks: {metric.totalTasks}</div>
                  <div>Success Rate: {metric.successRate.toFixed(1)}%</div>
                  <div>Avg Duration: {(metric.avgDuration / 1000).toFixed(2)}s</div>
                  <div>Total Cost: ${metric.totalCost.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
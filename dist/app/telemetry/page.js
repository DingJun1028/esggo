'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { telemetryService } from '@/lib/telemetry/service';
export default function TelemetryDashboard() {
    const [events, setEvents] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [selectedAgent]);
    const fetchData = async () => {
        try {
            const response = await fetch(selectedAgent ?
                `/api/telemetry?agent=${selectedAgent}` :
                '/api/telemetry');
            const data = await response.json();
            setEvents(data.events || []);
            setMetrics(data.metrics || []);
        }
        catch (error) {
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
    return (_jsxs("div", { className: "p-8 space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold", children: "OmniAgent Telemetry Dashboard" }), _jsx("button", { onClick: clearTelemetry, className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600", children: "Clear All Data" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Total Events" }), _jsx("p", { className: "text-2xl", children: totalEvents })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Success Rate" }), _jsxs("p", { className: "text-2xl", children: [successRate, "%"] })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Active Agents" }), _jsx("p", { className: "text-2xl", children: uniqueAgents.length })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Total Duration" }), _jsxs("p", { className: "text-2xl", children: [(totalDuration / 1000).toFixed(1), "s"] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Filter by Agent" }), _jsxs("select", { value: selectedAgent, onChange: (e) => setSelectedAgent(e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "", children: "All Agents" }), uniqueAgents.map(agent => (_jsx("option", { value: agent, children: agent }, agent)))] })] }), _jsxs("div", { className: "bg-white rounded shadow overflow-hidden", children: [_jsxs("div", { className: "grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold border-b", children: [_jsx("div", { children: "Agent" }), _jsx("div", { children: "Task" }), _jsx("div", { children: "Success" }), _jsx("div", { children: "Duration" }), _jsx("div", { children: "Simulated" }), _jsx("div", { children: "Error" })] }), _jsx("div", { className: "divide-y", children: events.slice().reverse().map((event, index) => (_jsxs("div", { className: "grid grid-cols-12 gap-4 p-4", children: [_jsx("div", { className: "truncate", children: event.agent }), _jsx("div", { className: "truncate", children: event.task }), _jsx("div", { children: _jsx("span", { className: `px-2 py-1 rounded text-sm ${event.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: event.success ? '✓' : '✗' }) }), _jsxs("div", { children: [(event.duration / 1000).toFixed(2), "s"] }), _jsx("div", { children: event.simulated ? (_jsx("span", { className: "px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm", children: "Simulated" })) : (_jsx("span", { children: "-" })) }), _jsx("div", { className: "truncate text-red-600", children: event.error || '-' })] }, event.id))) })] })] }), metrics.length > 0 && (_jsxs("div", { className: "bg-white rounded shadow p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Agent Metrics" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: metrics.map((metric) => (_jsxs("div", { className: "border rounded p-4", children: [_jsx("h4", { className: "font-semibold", children: metric.agent }), _jsxs("div", { className: "mt-2 space-y-1 text-sm", children: [_jsxs("div", { children: ["Tasks: ", metric.totalTasks] }), _jsxs("div", { children: ["Success Rate: ", metric.successRate.toFixed(1), "%"] }), _jsxs("div", { children: ["Avg Duration: ", (metric.avgDuration / 1000).toFixed(2), "s"] }), _jsxs("div", { children: ["Total Cost: $", metric.totalCost.toFixed(2)] })] })] }, metric.agent))) })] }))] }));
}
//# sourceMappingURL=page.js.map
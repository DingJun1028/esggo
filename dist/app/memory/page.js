'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export default function MemoryDashboard() {
    const [search, setSearch] = useState('');
    const [agent, setAgent] = useState('');
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchMemoryData();
    }, [search, agent]);
    const fetchMemoryData = async () => {
        try {
            const response = await fetch(`/api/memory${agent ? `?agent=${agent}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`);
            if (!response.ok) {
                throw new Error('Memory fetch failed');
            }
            const data = await response.json();
            setMemories(data.data || []);
            setLoading(false);
            setError(null);
        }
        catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };
    const clearMemory = () => {
        fetch('/api/memory/DELETE').then(() => {
            setMemories([]);
            setError(null);
        });
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Memory Management" }), error && _jsx("div", { className: "bg-red-100 p-4 rounded shadow", children: error }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded shadow overflow-hidden", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Search Memories" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search memories by task or context", className: "w-full p-2 border rounded" })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow overflow-hidden", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Filter by Agent" }), _jsxs("select", { value: agent, onChange: (e) => setAgent(e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "", children: "All Agents" }), ['ESG_Researcher', 'ESG_Auditor', 'ESG_Strategist', 'ESG_Consultant', 'Agent0']
                                        .map(opt => (_jsx("option", { value: opt, children: opt }, opt)))] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded shadow overflow-hidden", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Stored Memories" }), memories.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: memories.map((mem) => (_jsxs("div", { className: "bg-gray-50 p-4 rounded shadow", children: [_jsx("h3", { className: "text-xl font-medium", children: mem.task }), _jsx("p", { className: "text-sm text-gray-600", children: mem.timestamp }), _jsxs("div", { className: "mt-2 flex items-center", children: [_jsx("span", { className: "chip bg-green-200 text-green-800 px-2 py-1 rounded mr-2", children: mem.agentName }), _jsx("span", { className: "chip bg-blue-200 text-blue-800 px-2 py-1 rounded", children: mem.success ? '✓' : '✗' })] })] }, mem.id))) })) : (_jsx("p", { className: "text-center text-gray-600", children: "No memories found. Use search or execute tasks to create memories." })), _jsx("div", { className: "mt-6 text-sm text-gray-600", children: _jsx("button", { onClick: clearMemory, className: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600", children: "Clear All Memories" }) })] })] }));
}
//# sourceMappingURL=page.js.map
'use client';
import { useState, useEffect } from 'react';
import { memoryStore } from '@/lib/memory/memory-store';

export default function MemoryDashboard() {
  const [search, setSearch] = useState('');
  const [agent, setAgent] = useState('');
  const [memories, setMemories] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemoryData();
  }, [search, agent]);

  const fetchMemoryData = async () => {
    try {
      const response = await fetch(
        `/api/memory${agent ? `?agent=${agent}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      );
      if (!response.ok) {
        throw new Error('Memory fetch failed');
      }
      const data = await response.json();
      setMemories(data.data || []);
      setLoading(false);
      setError(null);
    } catch (error: any) {
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Memory Management</h1>
      
      {error && <div className="bg-red-100 p-4 rounded shadow" dangerouslySetInnerHTML={{__html: error}} />}
      
      <div className="flex flex-col gap-4">
        <div className="bg-white p-4 rounded shadow overflow-hidden">
          <h2 className="text-lg font-semibold mb-2">Search Memories</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories by task or context"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="bg-white p-4 rounded shadow overflow-hidden">
          <h2 className="text-lg font-semibold mb-2">Filter by Agent</h2>
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Agents</option>
            {['ESG_Researcher', 'ESG_Auditor', 'ESG_Strategist', 'ESG_Consultant', 'Agent0']
              .map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Stored Memories</h2>

        {memories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {memories.map((mem: any) => (
              <div key={mem.id} className="bg-gray-50 p-4 rounded shadow">
                <h3 className="text-xl font-medium">{mem.task}</h3>
                <p className="text-sm text-gray-600">{mem.timestamp}</p>
                <div className="mt-2 flex items-center">
                  <span className="chip bg-green-200 text-green-800 px-2 py-1 rounded mr-2">
                    {mem.agentName}</span>
                  <span className="chip bg-blue-200 text-blue-800 px-2 py-1 rounded">
                    {mem.success ? '✓' : '✗'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No memories found. Use search or execute tasks to create memories.</p>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <button
            onClick={clearMemory}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All Memories
          </button>
        </div>
      </div>
    </div>
  );
}
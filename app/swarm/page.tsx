'use client';
import { useState } from 'react';

export default function SwarmDashboard() {
  const [task, setTask] = useState('');
  const [context, setContext] = useState('{}');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const executeCollabTask = async () => {
    if (!task.trim()) return;
    
    setLoading(true);
    try {
      const parsedContext = JSON.parse(context);
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, context: parsedContext })
      });
      const data = await res.json();
      setResults(data);
    } catch (error: any) {
      setResults({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Swarm Intelligence Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded shadow overflow-hidden border">
          <h2 className="text-lg font-semibold mb-2">Collaborative Task</h2>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task description..."
            className="w-full p-2 border rounded h-32 resize-y mb-4"
          />
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter context (JSON format)"
            className="w-full p-2 border rounded h-24 mb-4"
          />
          <button
            onClick={executeCollabTask}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Executing...' : 'Execute Collaborative Task'}
          </button>
        </div>

        {results && (
          <div className="bg-white p-6 rounded shadow overflow-hidden border">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
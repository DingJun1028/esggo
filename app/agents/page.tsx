'use client';
import { useState } from 'react';

export default function AgentsDashboard() {
  const [agentName, setAgentName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskContext, setTaskContext] = useState('');
  const [agentOptions, setAgentOptions] = useState<string[]>([
    'ESG_Researcher',
    'ESG_Auditor',
    'ESG_Strategist',
    'ESG_Consultant',
    'Agent0',
  ]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<any>(null);

  const executeTask = async () => {
    if (!agentName || !taskDescription) return;
    
    setLoading(true);
    setResult(null);
    
    const body = {
      task: taskDescription,
      context: JSON.parse(taskContext || '{}')
    };

    try {
      const response = await fetch('/api/omni-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setResult(data.result || data.message || JSON.stringify(data));
      // Refresh telemetry
      const tele = await fetch('/api/telemetry?agent=' + agentName);
      const teleData = await tele.json();
      setTelemetry(teleData);
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Agent Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Selection */}
        <div className="bg-white p-4 rounded shadow overflow-hidden border">
          <h2 className="text-lg font-semibold mb-4">Select Agent</h2>
          <select
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choose Agent --</option>
            {agentOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Task Input */}
        <div className="bg-white p-4 rounded shadow overflow-hidden border">
          <h2 className="text-lg font-semibold mb-4">Task Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Task Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Describe the task you want the agent to perform..."
                className="w-full p-2 border rounded h-32 resize-y"
              ></textarea>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Task Context (JSON)</label>
              <textarea
                value={taskContext}
                onChange={(e) => setTaskContext(e.target.value)}
                placeholder="Optional JSON context..."
                className="w-full p-2 border rounded h-24"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="bg-white p-4 rounded shadow overflow-hidden border flex items-center justify-center">
          <button
            onClick={executeTask}
            disabled={!agentName || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Executing...' : 'Execute Task'}
          </button>
        </div>
      </div>

      {/* Task Result */}
      {result !== null && (
        <div className="bg-white p-6 rounded shadow overflow-hidden border">
          <h2 className="text-lg font-semibold mb-4">Agent Response</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {/* Telemetry Refresh */}
      {telemetry && (
        <div className="bg-white rounded shadow p-4 mt-6">
          <h2 className="text-lg font-semibold mb-2">Latest Telemetry</h2>
          <div className="overflow-x-auto text-sm">
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
{JSON.stringify(telemetry, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Auto-refresh telemetry every 5s */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              fetch('/api/telemetry')
                .then(r => r.json())
                .then(data => {
                  const el = document.querySelector('pre[data-telemetry]');
                  if (el) el.textContent = JSON.stringify(data, null, 2);
                })
            }, 5000);
          `
        }}
      />
    </div>
  );
}
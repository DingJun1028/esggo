import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';

interface AuditLog {
  timestamp: string;
  action: string;
  details: string;
  user_email: string;
}

const BloodlineBox: React.FC = () => {
  const { selectedEvidenceId } = useDashboard();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEvidenceId) {
      setLoading(true);
      // Simulate API Fetch
      fetch(`/api/evidence/${selectedEvidenceId}/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setLogs(data);
          else setLogs([]); // Handle error
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      // Default global logs (mock for now or fetch global)
      setLogs([
        {
          timestamp: new Date().toISOString(),
          action: 'SYSTEM_READY',
          details: 'Dashboard Initialized',
          user_email: 'system',
        },
      ]);
    }
  }, [selectedEvidenceId]);

  return (
    <div className="h-full p-4 overflow-hidden flex flex-col">
      <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 flex items-center justify-between">
        <span>Bloodline Tracker (T2)</span>
        {selectedEvidenceId && <span className="text-blue-400">ID: #{selectedEvidenceId}</span>}
      </h3>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 text-xs mt-4">Tracing provenance...</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-600 text-xs mt-4">No audit trail found.</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-3 text-xs">
              <div className="flex flex-col items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {i < logs.length - 1 && <div className="w-px h-full bg-gray-700 my-1"></div>}
              </div>
              <div className="pb-2">
                <div className="text-gray-300 font-medium">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="text-gray-400">{log.action.replace(/_/g, ' ')}</div>
                <div className="text-gray-500 text-[10px]">{log.user_email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BloodlineBox;

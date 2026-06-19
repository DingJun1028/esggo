import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity, Zap, Layers, RefreshCw } from 'lucide-react';

interface DaemonStatus {
  isRunning: boolean;
  cycleCount: number;
  agentsEvolved: number;
  lastRun: string | null;
}

export const AutoEvolutionStatus: React.FC = () => {
  const [status, setStatus] = useState<DaemonStatus>({
    isRunning: false,
    cycleCount: 0,
    agentsEvolved: 0,
    lastRun: null,
  });

  // Mock polling - In real app, this would use the MCP tool or a direct service subscription
  useEffect(() => {
    // Simulated backend connection
    const interval = setInterval(() => {
      // In a real environment, we would fetch from the server
      // fetch('/api/evolution/status').then(...)
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          Omni-Evolution Daemon
        </CardTitle>
        <Badge
          variant={status.isRunning ? 'default' : 'secondary'}
          className={
            status.isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
          }
        >
          {status.isRunning ? 'ACTIVE' : 'STANDBY'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Cycles Run
            </span>
            <span className="text-2xl font-bold font-mono">{status.cycleCount}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Zap className="h-3 w-3" /> Souls Evolved
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              {status.agentsEvolved}
            </span>
          </div>
        </div>

        {status.lastRun && (
          <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600 flex justify-between">
            <span>Last Scan:</span>
            <span className="font-mono">{new Date(status.lastRun).toLocaleTimeString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

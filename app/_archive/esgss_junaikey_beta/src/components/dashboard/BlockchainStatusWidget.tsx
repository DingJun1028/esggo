import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { blockchainAnchor, ChainStatus } from '@/omni/services/BlockchainAnchorService';
import { Activity, Box, GitCommit, Database } from 'lucide-react';

export const BlockchainStatusWidget: React.FC = () => {
  const [status, setStatus] = useState<ChainStatus>({
    currentHeight: 0,
    latestBlockHash: 'Loading...',
    pendingTxCount: 0,
    lastBlockTime: 0,
  });

  useEffect(() => {
    const updateStatus = () => {
      const current = blockchainAnchor.getChainStatus();
      setStatus(current);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000); // Update every 2s
    return () => clearInterval(interval);
  }, []);

  const timeSinceLastBlock = () => {
    if (status.lastBlockTime === 0) return 'Genesis';
    const seconds = Math.floor((Date.now() - status.lastBlockTime) / 1000);
    return `${seconds}s ago`;
  };

  return (
    <Card className="h-full bg-black/40 border-green-900/30 backdrop-blur-sm p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-green-900/30 pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-medium text-green-100">Blockchain Anchor</h3>
        </div>
        <Badge variant={status.pendingTxCount > 0 ? 'secondary' : 'default'} className="text-xs">
          {status.pendingTxCount > 0 ? 'Mining Needed' : 'Synced'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Box className="w-3 h-3" />
            <span>Height</span>
          </div>
          <div className="text-xl font-bold font-mono text-green-300">#{status.currentHeight}</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Activity className="w-3 h-3" />
            <span>Mempool</span>
          </div>
          <div className="text-xl font-bold font-mono text-yellow-300">
            {status.pendingTxCount} <span className="text-sm font-normal text-gray-500">txs</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <GitCommit className="w-3 h-3" />
          <span>Latest Root (Partial)</span>
        </div>
        <div className="text-xs font-mono text-gray-500 truncate" title={status.latestBlockHash}>
          {status.latestBlockHash.substring(0, 16)}...
        </div>
        <div className="text-[10px] text-right text-gray-600">Mined: {timeSinceLastBlock()}</div>
      </div>
    </Card>
  );
};

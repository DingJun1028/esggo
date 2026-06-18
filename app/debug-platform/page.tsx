'use client';

import React from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { Bug, Activity, Shield, Cpu, Zap } from 'lucide-react';
import { DebugPanel } from '@/lib/debug-platform';
import { debugService } from '@/lib/debug-platform/DebugService';
import { useDebug } from '@/lib/debug-platform/useDebug';

export default function DebugPlatformPage() {
  const { log, snapshot } = useDebug();

  const handleTestLog = () => {
    log('debug', 'test-action', '測試除錯訊息', { timestamp: Date.now() });
    log('info', 'test-action', '資訊級別訊息', { user: 'demo' });
    log('warn', 'test-action', '警告級別訊息', { warning: true });
  };

  const handleTestSnapshot = () => {
    snapshot(
      'platform-state',
      {
        activeAgents: 5,
        memoryUsage: Math.random() * 100,
        integrityScore: 98.5,
      },
      ['demo', 'test']
    );
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center gap-4 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Bug size={24} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              除錯平台 (Debug Platform)
            </h1>
            <p className="text-slate-400 mt-1">ESGGGO 系統的全域除錯與監控中心</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OmniBaseCard variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={20} className="text-cyan-400" />
              <h2 className="text-lg font-bold text-white">服務狀態</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">除錯服務</span>
                <span className="text-emerald-400 font-mono">已初始化</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">事件緩衝</span>
                <span className="text-cyan-400 font-mono">
                  {debugService.getMetrics().totalEvents}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">錯誤數</span>
                <span className="text-red-400 font-mono">
                  {debugService.getMetrics().errorCount}
                </span>
              </div>
            </div>
          </OmniBaseCard>

          <OmniBaseCard variant="default" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={20} className="text-amber-400" />
              <h2 className="text-lg font-bold text-white">快速測試</h2>
            </div>
            <div className="space-y-3">
              <OmniButton variant="outline" onClick={handleTestLog} className="w-full">
                生成測試日誌
              </OmniButton>
              <OmniButton variant="outline" onClick={handleTestSnapshot} className="w-full">
                建立狀態快照
              </OmniButton>
              <OmniButton variant="outline" onClick={() => debugService.clear()} className="w-full">
                清除所有記錄
              </OmniButton>
            </div>
          </OmniBaseCard>

          <OmniBaseCard variant="glow" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-emerald-400" />
              <h2 className="text-lg font-bold text-white">5T 合規</h2>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                  Traceable
                </span>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                  Transparent
                </span>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                  Tangible
                </span>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                  Trustworthy
                </span>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                  Trackable
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                此除錯平台遵循 ESGGGO 5T 協議，確保所有除錯資料具備完整的溯源與不可篡改特性。
              </p>
            </div>
          </OmniBaseCard>
        </div>

        <OmniBaseCard variant="default" className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">API 端點</h2>
          <div className="space-y-2 font-mono text-xs">
            <p className="text-cyan-400">GET /api/debug-platform</p>
            <p className="text-slate-400 ml-4">獲取所有除錯事件與指標</p>
            <p className="text-cyan-400">POST /api/debug-platform</p>
            <p className="text-slate-400 ml-4">發送除錯事件至伺服器</p>
            <p className="text-cyan-400">DELETE /api/debug-platform</p>
            <p className="text-slate-400 ml-4">清除所有除錯記錄</p>
          </div>
        </OmniBaseCard>
      </div>

      <DebugPanel defaultOpen={true} />
    </div>
  );
}

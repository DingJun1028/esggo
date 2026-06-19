import React, { memo, useMemo } from 'react';
import { Card } from '@/components/ui';
import { useCoreSystem } from '@/hooks/useCoreSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity, Clock, CircleDot } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
interface Cycle {
  readonly id: string;
  readonly startTime: number;
  readonly stage: 'perception' | 'cognition' | 'action';
  readonly trigger: string;
}

interface CycleRowProps {
  readonly cycle: Cycle;
}

// ==================== UTILITY FUNCTIONS ====================
const calculateProgress = (stage: Cycle['stage']): number => {
  const progressMap = {
    perception: 33,
    cognition: 66,
    action: 100,
  };
  return progressMap[stage];
};

const calculateElapsed = (startTime: number): number => {
  return Math.floor((Date.now() - startTime) / 1000);
};

// ==================== SUB-COMPONENTS ====================
const CycleRow = memo<CycleRowProps>(({ cycle }) => {
  const elapsed = useMemo(() => calculateElapsed(cycle.startTime), [cycle.startTime]);
  const progress = useMemo(() => calculateProgress(cycle.stage), [cycle.stage]);

  return (
    <div className="relative group">
      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-rose-900/10 rounded-lg -z-10"
        aria-hidden="true"
      />

      <article className="flex flex-col md:flex-row md:items-center gap-4 p-3 rounded-lg border border-slate-800 hover:border-indigo-500/50 transition-colors">
        {/* Alpha Node */}
        <div className="w-full md:w-32 shrink-0">
          <div className="text-[10px] uppercase text-emerald-500 font-bold mb-1">Alpha</div>
          <div className="text-xs text-slate-300 font-mono truncate">{cycle.id}</div>
          <div className="text-[10px] text-slate-500">
            {new Date(cycle.startTime).toLocaleTimeString()}
          </div>
        </div>

        {/* Flow Visualizer */}
        <div
          className="flex-1 relative h-8 bg-slate-900/50 rounded-full overflow-hidden flex items-center px-4"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Cycle progress: ${progress}%`}
        >
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-rose-500/20 transition-all duration-1000"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />

          <div className="flex justify-between w-full relative z-10">
            <div
              className={`w-2 h-2 rounded-full ${
                progress >= 33
                  ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                  : 'bg-slate-700'
              }`}
              aria-hidden="true"
            />
            <div
              className={`w-2 h-2 rounded-full ${
                progress >= 66
                  ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]'
                  : 'bg-slate-700'
              }`}
              aria-hidden="true"
            />
            <div
              className={`w-2 h-2 rounded-full ${
                progress >= 100
                  ? 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]'
                  : 'bg-slate-700'
              }`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Omega Node */}
        <div className="w-full md:w-32 shrink-0 text-right">
          <div className="text-[10px] uppercase text-rose-500 font-bold mb-1">Omega</div>
          <div className="text-xs text-slate-300 font-mono">{cycle.stage}</div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500">
            <Clock className="w-3 h-3" aria-hidden="true" /> {elapsed}s
          </div>
        </div>
      </article>
    </div>
  );
});

CycleRow.displayName = 'CycleRow';

// ==================== MAIN COMPONENT ====================
export const AlphaOmegaMatrix = memo(() => {
  const { activeCycles } = useCoreSystem();
  const { t } = useLanguage();

  const displayCycles = useMemo<Cycle[]>(() => {
    if (activeCycles.length > 0) return activeCycles;

    // Mock data for visualization
    return [
      {
        id: 'alpha-001',
        startTime: Date.now() - 100000,
        stage: 'perception',
        trigger: 'System Init',
      },
      {
        id: 'alpha-002',
        startTime: Date.now() - 50000,
        stage: 'cognition',
        trigger: 'User Request',
      },
      {
        id: 'alpha-003',
        startTime: Date.now() - 10000,
        stage: 'action',
        trigger: 'Auto-Optimization',
      },
    ];
  }, [activeCycles]);

  const cycleRows = useMemo(
    () => displayCycles.map(cycle => <CycleRow key={cycle.id} cycle={cycle} />),
    [displayCycles]
  );

  return (
    <Card
      className="p-4 bg-slate-950 border border-indigo-500/20 shadow-lg shadow-indigo-900/20"
      role="region"
      aria-labelledby="matrix-heading"
    >
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          <h3 id="matrix-heading" className="font-bold text-lg text-slate-100">
            {t('matrix.title')}
          </h3>
        </div>
        <div className="flex gap-4 text-xs font-mono text-slate-400" role="list">
          <div className="flex items-center gap-1" role="listitem">
            <CircleDot className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            {t('matrix.alpha')}
          </div>
          <div className="flex items-center gap-1" role="listitem">
            <CircleDot className="w-3 h-3 text-rose-400" aria-hidden="true" />
            {t('matrix.omega')}
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {displayCycles.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm" role="status">
            Matrix Idle. Waiting for Alpha Ignition.
          </div>
        ) : (
          cycleRows
        )}
      </div>
    </Card>
  );
});

AlphaOmegaMatrix.displayName = 'AlphaOmegaMatrix';

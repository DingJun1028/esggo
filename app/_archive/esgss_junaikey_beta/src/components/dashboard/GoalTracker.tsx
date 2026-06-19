import React, { memo, useState, useCallback, useMemo } from 'react';
import { Card, Button } from '@/components/ui';
import { Target, CheckCircle2, Circle, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import { useCoreSystem } from '@/hooks/useCoreSystem';
import type { Goal } from '@/core/goal/GoalManager';

// ==================== TYPE DEFINITIONS ====================
interface GoalCardProps {
  readonly goal: Goal;
}

// ==================== SUB-COMPONENTS ====================
const GoalCardBase: React.FC<GoalCardProps> = ({ goal }) => {
  const getStatusIcon = useMemo(() => {
    switch (goal.status) {
      case 'completed':
        return { Icon: CheckCircle2, color: 'text-emerald-500' };
      case 'failed':
        return { Icon: Circle, color: 'text-red-500' };
      case 'blocked':
        return { Icon: Circle, color: 'text-amber-500' };
      default: // pending, active
        return { Icon: Circle, color: 'text-indigo-400' };
    }
  }, [goal.status]);

  const { Icon, color: iconColor } = getStatusIcon;

  const priorityStyles = useMemo(() => {
    const styles = {
      critical: 'bg-rose-100 text-rose-600',
      high: 'bg-amber-100 text-amber-600',
      medium: 'bg-slate-100 text-slate-500',
      low: 'bg-slate-100 text-slate-500',
    };
    return styles[goal.priority];
  }, [goal.priority]);

  const priorityLabel = useMemo(() => {
    const labels = {
      critical: '緊急',
      high: '高優先',
      medium: '中等',
      low: '低',
    };
    return labels[goal.priority];
  }, [goal.priority]);

  const isCompleted = goal.status === 'completed';
  const isFailed = goal.status === 'failed';
  const isBlocked = goal.status === 'blocked';

  return (
    <article className="group relative p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all">
      <header className="flex justify-between items-start mb-2">
        <div className="flex gap-2">
          <Icon className={`w-4 h-4 ${iconColor} mt-0.5`} aria-hidden="true" />
          <div>
            <h4
              className={`text-sm font-medium ${isCompleted
                ? 'text-slate-400 line-through'
                : isFailed
                  ? 'text-red-500 line-through'
                  : isBlocked
                    ? 'text-amber-500'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
            >
              {goal.description}
            </h4>
            <div className="flex gap-1 mt-1" role="list">
              {goal.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500"
                  role="listitem"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${priorityStyles}`}
          role="status"
          aria-label={`Priority: ${priorityLabel}`}
        >
          {priorityLabel}
        </span>
      </header>

      <div
        className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={goal.progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-all duration-500 ${isCompleted
            ? 'bg-emerald-500'
            : isFailed
              ? 'bg-red-500'
              : isBlocked
                ? 'bg-amber-500'
                : 'bg-indigo-500'
            }`}
          style={{ width: `${goal.progress}%` }}
        />
      </div>
    </article>
  );
};

const GoalCard = memo(GoalCardBase);
GoalCard.displayName = 'GoalCard';

// ==================== MAIN COMPONENT ====================
export const GoalTracker = memo(() => {
  const { goals, actions } = useCoreSystem();
  const [newGoalText, setNewGoalText] = useState('');

  const handleAddGoal = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newGoalText.trim()) {
        actions.addManualGoal(newGoalText);
        setNewGoalText('');
      }
    },
    [newGoalText, actions]
  );

  const activeGoalCount = useMemo(
    () => goals.filter(g => g.status === 'active' || g.status === 'pending').length,
    [goals]
  );

  const goalCards = useMemo(
    () => goals.map(goal => <GoalCard key={goal.id} goal={goal} />),
    [goals]
  );

  return (
    <Card
      className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur border-indigo-200 dark:border-indigo-500/30"
      role="region"
      aria-labelledby="goal-tracker-heading"
    >
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <h3
            id="goal-tracker-heading"
            className="font-bold text-lg text-slate-800 dark:text-slate-100"
          >
            認知目標追蹤
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400" aria-live="polite">
          活躍目標: {activeGoalCount}
        </div>
      </header>

      <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-2" role="list">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm" role="status">
            尚未設定認知目標
          </div>
        ) : (
          goalCards
        )}
      </div>

      <form onSubmit={handleAddGoal} className="flex gap-2">
        <input
          type="text"
          value={newGoalText}
          onChange={e => setNewGoalText(e.target.value)}
          placeholder="輸入新目標..."
          className="flex-1 text-sm px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="New goal description"
        />
        <Button
          type="submit"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Add new goal"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
});

GoalTracker.displayName = 'GoalTracker';

import React, { useState } from 'react';
import { CheckCircle, Circle, AlertCircle, Sparkles, Plus } from './icons';

interface OmniTask {
  id: string;
  title: string;
  description?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  contextId?: string;
  dueDate?: string;
  aiSuggested?: boolean;
  tags: string[];
  subTasks?: OmniTask[];
}

interface OmniTaskMatrixProps {
  contextFilter?: string;
}

export const OmniTaskMatrix: React.FC<OmniTaskMatrixProps> = ({ contextFilter }) => {
  const [tasks, setTasks] = useState<OmniTask[]>([
    {
      id: 'task-1',
      title: '審核供應鏈碳足跡數據',
      priority: 'HIGH',
      status: 'TODO',
      contextId: 'carbon-supply-chain',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      tags: ['Carbon', 'Audit'],
      aiSuggested: true
    },
    {
      id: 'task-2',
      title: '優化ESG報告自動化流程',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      contextId: 'esg-reporting',
      tags: ['Automation', 'Reporting']
    }
  ]);

  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAlchemizing, setIsAlchemizing] = useState(false);

  // 智慧新增
  const handleSmartAdd = async () => {
    if (!newTaskInput) return;

    // 如果輸入包含AI關鍵字，觸發裂變
    if (newTaskInput.startsWith('/ai')) {
      setIsAlchemizing(true);
      const goal = newTaskInput.replace('/ai', '').trim();
      // 模擬AI任務裂變
      const subTasks: OmniTask[] = [
        {
          id: `sub-${Date.now()}-1`,
          title: `分析${goal}的關鍵指標`,
          priority: 'HIGH',
          status: 'TODO',
          contextId: contextFilter,
          tags: ['AI', 'Analysis']
        },
        {
          id: `sub-${Date.now()}-2`,
          title: `制定${goal}的執行計劃`,
          priority: 'MEDIUM',
          status: 'TODO',
          contextId: contextFilter,
          tags: ['Planning']
        }
      ];

      const newTask: OmniTask = {
        id: `task-${Date.now()}`,
        title: goal,
        priority: 'HIGH',
        status: 'TODO',
        contextId: contextFilter,
        aiSuggested: true,
        tags: ['AI'],
        subTasks
      };

      setTasks(prev => [newTask, ...prev]);
      setIsAlchemizing(false);
    } else {
      // 普通新增
      const newTask: OmniTask = {
        id: `task-${Date.now()}`,
        title: newTaskInput,
        priority: 'MEDIUM',
        status: 'TODO',
        contextId: contextFilter,
        tags: []
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setNewTaskInput('');
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'DONE' } : t
    ));
  };

  // 過濾顯示：如果有contextId，只顯示相關任務
  const displayTasks = contextFilter
    ? tasks.filter(t => t.contextId === contextFilter)
    : tasks;

  const pendingTasks = displayTasks.filter(t => t.status !== 'DONE');

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 flex flex-col h-full">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <CheckCircle className="text-emerald-400" />
        Universal Tasks {contextFilter && <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">CTX: {contextFilter}</span>}
      </h3>

      {/* Input Area */}
      <div className="relative mb-4 shrink-0">
        <input
          type="text"
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSmartAdd()}
          placeholder="輸入任務 (試試 /ai 優化ESG策略)"
          className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-3 pr-10 text-sm text-white placeholder-slate-600 focus:border-celestial-purple outline-none"
        />
        <button
          onClick={handleSmartAdd}
          disabled={!newTaskInput}
          className="absolute right-2 top-2 text-slate-400 hover:text-white disabled:opacity-30"
        >
          {isAlchemizing ? <Sparkles className="w-4 h-4 animate-spin text-purple-400" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {pendingTasks.length === 0 && (
          <div className="text-center text-slate-600 text-xs py-4">
            No active protocols. System is idle.
          </div>
        )}

        {pendingTasks.map(task => (
          <div key={task.id} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
            <button
              onClick={() => completeTask(task.id)}
              className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
            >
              <Circle className="w-4 h-4" />
            </button>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`text-sm text-slate-200 ${task.aiSuggested ? 'text-purple-200' : ''}`}>
                  {task.title}
                </span>
                {task.priority === 'CRITICAL' && <AlertCircle className="w-3 h-3 text-red-500" />}
              </div>

              <div className="flex gap-2 mt-1">
                {task.aiSuggested && (
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 rounded flex items-center gap-1">
                    <Sparkles className="w-2 h-2" /> AI
                  </span>
                )}
                {task.dueDate && (
                  <span className="text-xs bg-slate-700 text-slate-300 px-1.5 rounded">
                    Due: {task.dueDate}
                  </span>
                )}
              </div>

              {/* Subtasks (AI Generated) */}
              {task.subTasks && task.subTasks.length > 0 && (
                <div className="mt-2 pl-3 border-l border-slate-700 space-y-1">
                  {task.subTasks.map((sub, idx) => (
                    <div key={idx} className="text-xs text-slate-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>{sub.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
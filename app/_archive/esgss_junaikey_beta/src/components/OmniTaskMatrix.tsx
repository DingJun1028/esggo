import React, { useState, memo } from 'react';
import { useTaskSystem } from '../store/useTaskSystem';
import { CheckCircle, Circle, AlertCircle, Sparkles, Plus } from 'lucide-react';
import { OmniTask } from '../core/types';

// Using inline mock service for Alchemist to avoid another file dependency loop, can extract later
const TaskAlchemist = {
  decompose: async (_vagueGoal: string) => {
    // 實際應呼叫 Gemini API
    return [
      { title: '蒐集 Q1 電費單據', priority: 'HIGH', tags: ['Data'] },
      { title: '審查供應鏈碳係數', priority: 'MEDIUM', tags: ['Audit'] },
      { title: '更新 GRI 報告章節', priority: 'LOW', tags: ['Report'] },
    ];
  },
};

interface TaskItemProps {
  task: OmniTask;
  onComplete: (id: string) => void;
}

// ⚡ Bolt Optimization: Extract TaskItem and use memo to prevent re-renders of the entire list
// when the parent input state changes. This is a critical performance fix for list interactions.
const TaskItem = memo(({ task, onComplete }: TaskItemProps) => (
  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
    <button
      onClick={() => onComplete(task.id)}
      className="mt-0.5 text-slate-500 hover:text-celestial-emerald transition-colors"
      aria-label={`Complete task: ${task.title}`}
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

      <div className="flex gap-2 mt-1 items-center">
        {task.aiSuggested && (
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 rounded flex items-center gap-1">
            <Sparkles className="w-2 h-2" /> AI
          </span>
        )}
        {task.dueDate && (
          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 rounded">
            Due: {task.dueDate}
          </span>
        )}
        {task.contextId && (
          <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 rounded border border-slate-700">
            CTX: {task.contextId}
          </span>
        )}
      </div>

      {/* Subtasks (AI Generated) */}
      {task.subTasks && task.subTasks.length > 0 && (
        <div className="mt-2 pl-3 border-l border-slate-700 space-y-1">
          {task.subTasks.map((sub, idx) => (
            <div key={idx} className="text-xs text-slate-500 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              {sub.title}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
));

TaskItem.displayName = 'TaskItem';

export const OmniTaskMatrix: React.FC<{ contextFilter?: string }> = ({ contextFilter }) => {
  const { tasks, addTask, completeTask, getTasksByContext } = useTaskSystem();
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAlchemizing, setIsAlchemizing] = useState(false);

  // 過濾顯示：如果有傳入 contextId (如從 ESG Cell 點開)，只顯示相關任務
  const displayTasks = contextFilter ? getTasksByContext(contextFilter) : tasks;
  const pendingTasks = displayTasks.filter(t => t.status !== 'DONE');

  // ✨ AI 智慧新增
  const handleSmartAdd = async () => {
    if (!newTaskInput) return;

    // 如果輸入包含 "magic" 或 "AI"，觸發裂變
    if (newTaskInput.startsWith('/ai')) {
      setIsAlchemizing(true);
      const goal = newTaskInput.replace('/ai', '').trim();
      const subTasks = await TaskAlchemist.decompose(goal);

      // 創建父任務與子任務
      addTask({
        title: goal,
        priority: 'HIGH',
        aiSuggested: true,

        subTasks: subTasks as any, // 簡化型別處理 for demo
      });
      setIsAlchemizing(false);
    } else {
      // 普通新增
      addTask({
        title: newTaskInput,
        contextId: contextFilter,
      });
    }
    setNewTaskInput('');
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 flex flex-col h-full w-full">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <CheckCircle className="text-celestial-emerald" />
        Omni Tasks{' '}
        {contextFilter && (
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
            CTX: {contextFilter}
          </span>
        )}
      </h3>

      {/* Input Area */}
      <div className="relative mb-4">
        <input
          type="text"
          value={newTaskInput}
          onChange={e => setNewTaskInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSmartAdd()}
          placeholder="輸入任務 (試試 /ai 優化 ESG 策略)..."
          aria-label="New task title"
          className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-3 pr-10 text-sm text-white focus:border-celestial-purple outline-none placeholder:text-slate-500"
        />
        <button
          onClick={handleSmartAdd}
          className="absolute right-2 top-2 text-slate-400 hover:text-white"
          aria-label={isAlchemizing ? 'Generating subtasks...' : 'Add new task'}
        >
          {isAlchemizing ? (
            <Sparkles className="w-4 h-4 animate-spin text-celestial-purple" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
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
          <TaskItem key={task.id} task={task} onComplete={completeTask} />
        ))}
      </div>
    </div>
  );
};

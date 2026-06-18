'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  FileText,
  Save,
  ListTodo,
  Plus,
  Server,
  Activity,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type TaskStatus = 'Todo' | 'In Progress' | 'Done';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  synced: boolean;
}

export function OmniNotesWorkspace() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [noteContent, setNoteContent] = useState(
    '# OmniNotes 萬能筆記\n\n在此輸入您的內容...\n\n- [ ] 這是一個任務\n'
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>(['>> SYSTEM STANDBY']);

  useEffect(() => {
    setMounted(true);
    // Simulate initial loading of self-healing tasks
    setTimeout(() => {
      setTasks([
        { id: '1', title: 'Review CBAM mapping table', status: 'Todo', synced: true },
        { id: '2', title: 'Fix GRI-305-1 data anomaly', status: 'Done', synced: true },
      ]);
    }, 1500);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  const handleExtractTasks = () => {
    // Simple extraction logic: find markdown checklist items
    const regex = /- \[( |x)\] (.*)/g;
    let match;
    const newTasks: Task[] = [];
    while ((match = regex.exec(noteContent)) !== null) {
      newTasks.push({
        id: Math.random().toString(36).substr(2, 9),
        title: match[2],
        status: match[1] === 'x' ? 'Done' : 'Todo',
        synced: false,
      });
    }

    if (newTasks.length > 0) {
      setTasks((prev) => [...prev, ...newTasks]);
      setSyncLog((prev) => [
        `>> EXTRACTED ${newTasks.length} TASKS FROM MARKDOWN`,
        ...prev.slice(0, 4),
      ]);
    }
  };

  const handleSyncToOmniTable = async () => {
    setIsSyncing(true);
    setSyncLog((prev) => ['>> INITIATING OMNITABLE DATASHEET SYNC...', ...prev.slice(0, 4)]);

    const unsynced = tasks.filter((t) => !t.synced);
    if (unsynced.length === 0) {
      setSyncLog((prev) => ['>> NO UNSYNCED TASKS FOUND', ...prev.slice(0, 4)]);
      setIsSyncing(false);
      return;
    }

    try {
      const response = await fetch('/api/omni-notes/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: unsynced }),
      });

      if (response.ok) {
        setTasks((prev) => prev.map((t) => ({ ...t, synced: true })));
        setSyncLog((prev) => [
          `>> SUCCESSFULLY SYNCED ${unsynced.length} TASKS TO OMNITABLE`,
          `>> HASH LOCK VERIFIED (5T PROTOCOL)`,
          ...prev.slice(0, 3),
        ]);
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      setSyncLog((prev) => ['>> SYNC FAILED: UNABLE TO REACH OMNITABLE NODE', ...prev.slice(0, 4)]);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-stretch min-h-[calc(100vh-140px)]">
      {/* LEFT COLUMN: Markdown Editor */}
      <div
        className={cn(
          'flex-1 flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden  -md',
          isDark ? 'bg-[#111827]/75 border-gray-800/40' : ' border-gray-200/60'
        )}
      >
        <div className="h-14 px-5 flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
          <div className="flex items-center gap-2">
            <FileText className={cn('w-4.5 h-4.5', isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]')} />
            <span
              className={cn('font-bold tracking-wide', isDark ? 'text-gray-100' : 'text-gray-900')}
            >
              Omni Editor
            </span>
          </div>
          <button
            onClick={handleExtractTasks}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-1.5',
              isDark
                ? 'bg-[#0F172A] hover:bg-[#1E293B] text-[#34D399] border border-gray-800'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            )}
          >
            <Plus className="w-3.5 h-3.5" /> EXTRACT TASKS
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row">
          {/* Textarea */}
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className={cn(
              'flex-1 p-5 resize-none focus:outline-none font-mono text-sm leading-relaxed transition-colors duration-500 min-h-[300px]',
              isDark
                ? 'bg-transparent text-gray-300 placeholder-gray-600'
                : 'bg-transparent text-gray-700 placeholder-gray-400'
            )}
            placeholder="Type your markdown here..."
          />
          {/* Markdown Preview */}
          <div
            className={cn(
              'flex-1 p-5 border-t md:border-t-0 md:border-l transition-colors duration-500 overflow-y-auto prose prose-sm max-w-none min-h-[300px]',
              isDark ? 'border-gray-800/40 prose-invert' : 'border-gray-200/60'
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{noteContent}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Task List & OmniTable Sync Panel */}
      <div className="w-full md:w-[400px] flex flex-col gap-6">
        {/* Terminal Trace Box */}
        <div
          className={cn(
            'h-[120px] rounded-xl border flex flex-col p-4 overflow-hidden  -md relative',
            isDark ? 'bg-[#020617] border-gray-800/60' : 'bg-gray-50 border-gray-200'
          )}
        >
          <div className="flex items-center gap-2 mb-3 opacity-80">
            <Server className={cn('w-4 h-4', isDark ? 'text-amber-400' : 'text-amber-600')} />
            <span
              className={cn(
                'text-[10px] font-bold tracking-wider uppercase',
                isDark ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              OmniTable Sync Matrix
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1 overflow-y-auto font-mono text-[9.5px]">
            {syncLog.map((log, i) => (
              <div
                key={i}
                className={cn(
                  'truncate',
                  i === 0
                    ? isDark
                      ? 'text-[#22D3EE]'
                      : 'text-[#0891B2]'
                    : isDark
                    ? 'text-gray-500'
                    : 'text-gray-400'
                )}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Task Board */}
        <div
          className={cn(
            'flex-1 rounded-2xl border flex flex-col overflow-hidden  -md',
            isDark ? 'bg-[#111827]/75 border-gray-800/40' : ' border-gray-200/60'
          )}
        >
          <div className="h-14 px-5 flex items-center justify-between border-b border-gray-800/10 dark:border-gray-700/10">
            <div className="flex items-center gap-2">
              <ListTodo
                className={cn('w-4.5 h-4.5', isDark ? 'text-[#C084FC]' : 'text-[#9333EA]')}
              />
              <span
                className={cn(
                  'font-bold tracking-wide',
                  isDark ? 'text-gray-100' : 'text-gray-900'
                )}
              >
                Task Board
              </span>
            </div>

            <button
              onClick={handleSyncToOmniTable}
              disabled={isSyncing}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-1.5',
                isDark
                  ? 'bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/20'
                  : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200',
                isSyncing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isSyncing && 'animate-spin')} /> SYNC ALL
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {tasks.length === 0 ? (
              <div className="m-auto text-center opacity-50 flex flex-col items-center gap-2">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No tasks identified.</p>
                <p className="text-xs">Extract from notes to begin tracking.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    'p-3 rounded-xl border flex flex-col gap-2 transition-all group',
                    isDark ? 'bg-[#0F172A]/80 border-gray-800' : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        'text-sm font-medium leading-snug',
                        isDark ? 'text-gray-200' : 'text-gray-800'
                      )}
                    >
                      {task.title}
                    </span>
                    {task.synced ? (
                      <span title="Synced to OmniTable" className="text-emerald-500 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    ) : (
                      <span title="Unsynced locally" className="text-amber-500 shrink-0">
                        <Activity className="w-4 h-4 animate-pulse" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase',
                        task.status === 'Done'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : task.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-purple-500/10 text-purple-500'
                      )}
                    >
                      {task.status}
                    </div>
                    <span
                      className={cn(
                        'text-[9px] font-mono',
                        isDark ? 'text-gray-600' : 'text-gray-400'
                      )}
                    >
                      ID: {task.id}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

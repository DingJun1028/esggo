import React, { useState, useEffect } from 'react';
import { Save, Sparkles, Tag, Share2, Loader2, ClipboardList, Zap } from 'lucide-react';
import { executeAutomation } from '@/services/automationService';
import { useTaskSystem } from '@/store/useTaskSystem';
import { useNoteSystem } from '@/store/useNoteSystem';

interface OmniNoteProps {
  contextId: string; // 綁定的上下文 ID (例如 "ESG-Metric-01")
  initialContent?: string;
}

export const OmniNote: React.FC<OmniNoteProps> = ({ contextId, initialContent = '' }) => {
  const { notes, saveNote, getNote } = useNoteSystem();

  // Load existing note if available
  const existingNote = getNote(contextId);
  const [content, setContent] = useState(existingNote?.content || initialContent);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ tags: string[]; tasks: string[] }>({
    tags: [],
    tasks: [],
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [autoRefinement, setAutoRefinement] = useState(true); // "開啟auto accept and auto save"

  const { addTask } = useTaskSystem();

  // Save on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveNote(contextId, content);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, contextId, saveNote]);

  // 🧠 模擬 AI 意圖識別 (實際應連接後端 LLM)
  const analyzeIntent = async () => {
    setIsAnalyzing(true);

    // 模擬延遲與 AI 分析邏輯
    setTimeout(() => {
      const newTags = content.match(/#[\w\u4e00-\u9fa5]+/g) || [];
      const newTasks = content
        .split('\n')
        .filter(line => line.trim().startsWith('- [ ]') || line.trim().startsWith('TODO:'))
        .map(line => line.replace(/- \[ \] |TODO: /, '').trim());

      const newSuggestions = {
        tags: [...new Set(['#ESG', '#SystemLog', ...newTags])],
        tasks: newTasks,
      };

      setAiSuggestions(newSuggestions);
      setIsAnalyzing(false);

      // ⚡ Auto-Accept Logic: If autoRefinement is on, sync tasks automatically
      if (autoRefinement && newSuggestions.tasks.length > 0) {
        newSuggestions.tasks.forEach(taskTitle => {
          addTask({
            title: taskTitle,
            contextId,
            sourceNoteId: existingNote?.id,
            priority: 'MEDIUM',
          });
        });
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    }, 1000);
  };

  // ⚡ 觸發自動化：將筆記中的任務發送到 Make/Boost.space
  const handleSyncTasks = async () => {
    if (aiSuggestions.tasks.length === 0) return;

    setSyncStatus('syncing');
    try {
      // 1. Sync to internal Task System
      aiSuggestions.tasks.forEach(taskTitle => {
        addTask({
          title: taskTitle,
          contextId,
          sourceNoteId: existingNote?.id,
          priority: 'MEDIUM',
        });
      });

      // 2. Sync to automation (optional external)
      await executeAutomation(contextId, {
        type: 'NOTE_TASK_SYNC',
        content,
        extractedTasks: aiSuggestions.tasks,
      });
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (e) {
      setSyncStatus('error');
    }
  };

  // 當內容變更暫停時，自動觸發分析 (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.length > 10) analyzeIntent();
    }, 1500);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="relative group flex flex-col h-full bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden transition-all hover:border-slate-500/50 hover:shadow-2xl">
      {/* Header: 脈絡資訊 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-celestial-purple animate-pulse"></span>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            CTX: {contextId}
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setAutoRefinement(!autoRefinement)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all ${autoRefinement ? 'bg-celestial-blue/20 border-celestial-blue/40 text-celestial-blue' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
            title={autoRefinement ? 'Auto-Accept On' : 'Auto-Accept Off'}
            aria-label="Toggle auto-refinement"
            aria-pressed={autoRefinement}
          >
            <Zap className={`w-3 h-3 ${autoRefinement ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold">AUTO</span>
          </button>
          <div className="flex gap-2" role="status" aria-live="polite">
            {syncStatus === 'syncing' && (
              <Loader2 className="w-3 h-3 animate-spin text-celestial-blue" />
            )}
            {syncStatus === 'synced' && (
              <span className="text-xs text-celestial-emerald">Saved</span>
            )}
          </div>
        </div>
      </div>

      {/* Editor: 核心編輯區 */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default new line
            saveNote(contextId, content);
            // Optional: Provide visual feedback or sound
            setSyncStatus('synced');
            setTimeout(() => setSyncStatus('idle'), 1000);
          }
        }}
        placeholder="輸入筆記... (按 Enter 儲存，Shift+Enter 換行)"
        className="flex-1 w-full bg-transparent p-4 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none font-mono leading-relaxed"
        aria-label="Note content"
      />

      {/* Intelligence Layer: AI 建議區 */}
      {(aiSuggestions.tags.length > 0 || aiSuggestions.tasks.length > 0) && (
        <div className="px-4 py-3 bg-slate-950/30 border-t border-slate-800 space-y-3">
          {/* 🏷️ 智能標籤 */}
          {aiSuggestions.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700"
                >
                  <Tag className="w-3 h-3 opacity-50" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* ✅ 提取的任務 (可同步) */}
          {aiSuggestions.tasks.length > 0 && (
            <div className="flex items-center justify-between bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-2">
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>AI 識別到 {aiSuggestions.tasks.length} 個待辦事項</span>
              </div>
              <button
                onClick={handleSyncTasks}
                className="flex items-center gap-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors"
              >
                <Share2 className="w-3 h-3" />
                同步至自動化矩陣
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

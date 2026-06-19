import React, { useState, useEffect } from 'react';
import { Save, Sparkles, Tag, CheckSquare, Share2, Loader2 } from './icons';
import { useToast } from '../contexts/ToastContext';

interface OmniNoteProps {
  contextId: string;      // 綁定的上下文ID (例如 "ESG-Metric-01")
  initialContent?: string;
  onSave?: (content: string) => void;
}

export const OmniNote: React.FC<OmniNoteProps> = ({ contextId, initialContent = '', onSave }) => {
  const { addToast } = useToast();
  const [content, setContent] = useState(initialContent);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ tags: string[], tasks: string[] }>({ tags: [], tasks: [] });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // AI意圖識別 (模擬AI服務)
  const analyzeIntent = async () => {
    setIsAnalyzing(true);
    // 模擬延遲與AI分析邏輯
    setTimeout(() => {
      const newTags = content.match(/#[\w\u4e00-\u9fa5]+/g) || [];
      const newTasks = content.split('\n')
        .filter(line => line.trim().startsWith('- [ ]') || line.trim().startsWith('TODO:'))
        .map(line => line.replace(/- \[ \] |TODO: /, '').trim());
      setAiSuggestions({
        tags: [...new Set(['#ESG', '#SystemLog', ...newTags])], // AI自動補全標籤
        tasks: newTasks
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  // 觸發自動化：將筆記中的任務發送到Make/Boost.space
  const handleSyncTasks = async () => {
    if (aiSuggestions.tasks.length === 0) return;
    setSyncStatus('syncing');
    try {
      // TODO: 集成automationService
      // await executeAutomation(contextId, { tasks: aiSuggestions.tasks });
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
      addToast('success', 'Tasks synced to automation matrix', 'Neural Link');
    } catch (e) {
      setSyncStatus('error');
      addToast('error', 'Automation sync failed', 'Error');
    }
  };

  // 當內容變更時，暫停分析觸發分析 (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.length > 10) analyzeIntent();
    }, 1500);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="relative group flex flex-col bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden transition-all hover:border-slate-500 hover:shadow-2xl">
      {/* Header: 脈絡資訊 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-celestial-purple animate-pulse"></span>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            CTX: {contextId}
          </span>
        </div>
        <div className="flex gap-2">
          {syncStatus === 'syncing' && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
          {syncStatus === 'synced' && <span className="text-xs text-emerald-400">Synced</span>}
        </div>
      </div>

      {/* Editor: 核心編輯區 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="輸入筆記... (使用 - [ ] 建立任務，使用 # 添加標籤)"
        className="w-full h-40 bg-transparent p-4 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none font-mono leading-relaxed"
      />

      {/* Intelligence Layer: AI建議區 */}
      {(aiSuggestions.tags.length > 0 || aiSuggestions.tasks.length > 0) && (
        <div className="px-4 py-3 bg-slate-950/30 border-t border-slate-800 space-y-3">
          {/* AI智能標籤 */}
          {aiSuggestions.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                  <Tag className="w-3 h-3 opacity-50" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* 提取的任務 (可同步) */}
          {aiSuggestions.tasks.length > 0 && (
            <div className="flex items-center justify-between bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-2">
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>AI 識別到 {aiSuggestions.tasks.length} 個待辦事項</span>
              </div>
              <button
                onClick={handleSyncTasks}
                className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors"
              >
                <Share2 className="w-3 h-3" />
                同步至自動化矩陣
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onSave?.(content)}
          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
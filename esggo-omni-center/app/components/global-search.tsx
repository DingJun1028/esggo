'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Global Search Modal — triggered by Cmd/Ctrl + K
 * Searches across modules, notes, companies, and API endpoints
 */

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'module' | 'note' | 'company' | 'api' | 'page';
  url: string;
  icon: string;
}

const STATIC_RESULTS: SearchResult[] = [
  { id: 'omni-center', title: '萬能中心', description: '8 分頁儀表板', category: 'module', url: '/omni-center', icon: '◎' },
  { id: 'sustain-write', title: 'ESG 報告產生器', description: 'GRI/TCFD/投資人報告', category: 'module', url: '/sustain-write/v5', icon: '📊' },
  { id: 'sustain-center', title: '萬能永續中心', description: 'ESG 儀表板與碳排驗算', category: 'module', url: '/sustain-center', icon: '🌱' },
  { id: 'village', title: '村莊治理', description: '二次方投票與影響力專案', category: 'module', url: '/village', icon: '🏡' },
  { id: 'wiki', title: '知識庫', description: 'ESG 法規查詢', category: 'module', url: '/wiki', icon: '📚' },
  { id: 'omni-agent', title: 'AI 代理主控台', description: 'AI 聊天與子代理派遣', category: 'module', url: '/omni-agent', icon: '🤖' },
  { id: 'daily', title: '每日永續觀察', description: 'ESG 每日摘要', category: 'module', url: '/daily', icon: '📅' },
  { id: 'sonnar', title: 'ESG Sonnar', description: '資料爬取與雷達訊號', category: 'module', url: '/sonnar', icon: '🔍' },
  { id: 'emm', title: 'EMM 環境監控', description: '系統指標與模型監控', category: 'module', url: '/emm', icon: '💻' },
  { id: 'profile', title: '使用者成長系統', description: 'XP、成就、排行榜', category: 'module', url: '/profile', icon: '👤' },
  { id: 'omni-todo', title: 'OmniTodo', description: '統一任務管理', category: 'module', url: '/omni-todo', icon: '✅' },
  { id: 'omni-base', title: 'OmniBase 外掛系統', description: '外掛管理與 EventBus', category: 'module', url: '/omni-base', icon: '🔌' },
  { id: 'resources', title: '平台資源總覽', description: '模組、AI 模型、基礎設施', category: 'page', url: '/resources', icon: '📋' },
  { id: 'api-docs', title: 'API 路由文件', description: 'api-route_standard.md', category: 'api', url: '/api/health', icon: '🔗' },
];

export function GlobalSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(STATIC_RESULTS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults(STATIC_RESULTS);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(STATIC_RESULTS);
      setSelectedIndex(0);
      return;
    }
    const q = query.toLowerCase();
    const filtered = STATIC_RESULTS.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.includes(q)
    );
    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    window.location.href = result.url;
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  const categoryLabels: Record<string, string> = {
    module: '模組',
    note: '筆記',
    company: '公司',
    api: 'API',
    page: '頁面',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true" aria-label="全域搜尋">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary rounded-xl border border-borderColor shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-borderColor">
          <Search size={18} className="text-textSecondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜尋模組、頁面、API..."
            className="flex-1 bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary"
            aria-label="搜尋"
          />
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary" aria-label="關閉搜尋">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-textSecondary">
              無符合「{query}」的結果
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-accentTeal/10 text-accentTeal'
                    : 'hover:bg-primary text-textPrimary'
                }`}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <span className="text-lg shrink-0">{result.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{result.title}</div>
                  <div className="text-xs text-textSecondary truncate">{result.description}</div>
                </div>
                <span className="text-[10px] bg-primary border border-borderColor rounded px-1.5 py-0.5 shrink-0">
                  {categoryLabels[result.category]}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-borderColor flex items-center gap-4 text-[10px] text-textSecondary">
          <span><kbd className="px-1 py-0.5 bg-primary border border-borderColor rounded font-mono">↑↓</kbd> 導航</span>
          <span><kbd className="px-1 py-0.5 bg-primary border border-borderColor rounded font-mono">Enter</kbd> 選擇</span>
          <span><kbd className="px-1 py-0.5 bg-primary border border-borderColor rounded font-mono">Esc</kbd> 關閉</span>
        </div>
      </div>
    </div>
  );
}

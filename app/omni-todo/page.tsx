// ═══════════════════════════════════════════════════════════════
// 萬能待辦 OmniTodo Page
// ═══════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { OmniTodoPanel } from '@/components/omni-todo-panel';

export const metadata: Metadata = {
  title: '萬能待辦 OmniTodo | ESGGO',
  description: 'ESGGO 萬能待辦系統：統一管理 ESG 任務、工作事項、個人待辦',
};

export default function OmniTodoPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 max-w-5xl mx-auto">
      {/* 頁面標題 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
               style={{ background: 'var(--accent-teal)', color: 'var(--bg-primary)' }}>
            📋
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              萬能待辦 — ESGGO ∞ Evolution
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              OmniTodo — 統一管理 ESG 任務、工作事項、個人待辦 · 永續發展無限進化
            </p>
          </div>
        </div>
      </div>

      {/* OmniTodo Panel */}
      <OmniTodoPanel />
    </div>
  );
}

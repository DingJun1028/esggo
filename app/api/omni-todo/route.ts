// ═══════════════════════════════════════════════════════════════
// POST /api/omni-todo — 萬能待辦 API
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { OmniTodoEngine } from '@/core/omni-todo';
import type { TodoFilter, TodoSort, TodoPriority, TodoStatus, TodoCategory } from '@/core/omni-todo';

// Singleton engine (in-memory, resets on server restart)
let engine: OmniTodoEngine | null = null;

function getEngine(): OmniTodoEngine {
  if (!engine) engine = new OmniTodoEngine();
  return engine;
}

/**
 * POST /api/omni-todo
 * 
 * Actions:
 * - action: "list"     → 查詢待辦清單
 * - action: "create"   → 建立新待辦
 * - action: "update"   → 更新待辦
 * - action: "delete"   → 刪除待辦
 * - action: "start"    → 開始處理
 * - action: "complete" → 標記完成
 * - action: "archive"  → 歸檔
 * - action: "reopen"   → 重新開啟
 * - action: "stats"    → 獲取統計
 * - action: "overdue"  → 獲取逾期事項
 * - action: "export"   → 匯出
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    const eng = getEngine();

    switch (action) {
      // ── 查詢 ────────────────────────────────────────────
      case 'list': {
        const { filter, sort, page, pageSize } = body;
        const result = eng.query(
          filter || {},
          sort as TodoSort | undefined,
          page || 1,
          pageSize || 20
        );
        return NextResponse.json({ success: true, data: result });
      }

      // ── 建立 ────────────────────────────────────────────
      case 'create': {
        const { title, description, priority, category, tags, dueDate, reminderAt, esgTaskType, companyId, recurrence, parentId, createdBy } = body;
        if (!title) {
          return NextResponse.json(
            { success: false, error: 'title is required' },
            { status: 400 }
          );
        }
        const item = eng.createTodo({
          title, description, priority, category, tags, dueDate, reminderAt, esgTaskType, companyId, recurrence, parentId, createdBy,
        });
        return NextResponse.json({ success: true, data: item }, { status: 201 });
      }

      // ── 更新 ────────────────────────────────────────────
      case 'update': {
        const { id, ...patch } = body;
        if (!id) {
          return NextResponse.json(
            { success: false, error: 'id is required' },
            { status: 400 }
          );
        }
        const item = eng.updateTodo(id, patch);
        if (!item) {
          return NextResponse.json(
            { success: false, error: 'Todo not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: item });
      }

      // ── 刪除 ────────────────────────────────────────────
      case 'delete': {
        const { id } = body;
        if (!id) {
          return NextResponse.json(
            { success: false, error: 'id is required' },
            { status: 400 }
          );
        }
        const deleted = eng.deleteTodo(id);
        if (!deleted) {
          return NextResponse.json(
            { success: false, error: 'Todo not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: { deleted: true } });
      }

      // ── 狀態變更 ────────────────────────────────────────
      case 'start': {
        const { id } = body;
        const item = eng.startTodo(id);
        if (!item) {
          return NextResponse.json(
            { success: false, error: 'Todo not found or invalid status' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: item });
      }

      case 'complete': {
        const { id } = body;
        const item = eng.completeTodo(id);
        if (!item) {
          return NextResponse.json(
            { success: false, error: 'Todo not found or invalid status' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: item });
      }

      case 'archive': {
        const { id } = body;
        const item = eng.archiveTodo(id);
        if (!item) {
          return NextResponse.json(
            { success: false, error: 'Todo not found or invalid status' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: item });
      }

      case 'reopen': {
        const { id } = body;
        const item = eng.reopenTodo(id);
        if (!item) {
          return NextResponse.json(
            { success: false, error: 'Todo not found or invalid status' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: item });
      }

      // ── 統計 ────────────────────────────────────────────
      case 'stats': {
        const stats = eng.getStats();
        return NextResponse.json({ success: true, data: stats });
      }

      case 'overdue': {
        const items = eng.getOverdue();
        return NextResponse.json({ success: true, data: { items, total: items.length } });
      }

      case 'esg': {
        const { companyId } = body;
        const items = eng.getESGTodos(companyId);
        return NextResponse.json({ success: true, data: { items, total: items.length } });
      }

      // ── 匯出 ────────────────────────────────────────────
      case 'export': {
        const { format, filter } = body;
        if (format === 'markdown') {
          const md = eng.exportMarkdown(filter);
          return NextResponse.json({ success: true, data: { markdown: md } });
        }
        const json = eng.exportJSON(filter);
        return NextResponse.json({ success: true, data: { json } });
      }

      // ── 新增附註 ────────────────────────────────────────
      case 'addNote': {
        const { id, note } = body;
        if (!id || !note) {
          return NextResponse.json(
            { success: false, error: 'id and note are required' },
            { status: 400 }
          );
        }
        const item = eng.addNote(id, note);
        if (!item) {
          return NextResponse.json(
            { success: false, error: 'Todo not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: item });
      }

      // ── 新增子任務 ──────────────────────────────────────
      case 'addSubtask': {
        const { parentId, title, description, priority, dueDate } = body;
        if (!parentId || !title) {
          return NextResponse.json(
            { success: false, error: 'parentId and title are required' },
            { status: 400 }
          );
        }
        const subtask = eng.addSubtask(parentId, { title, description, priority, dueDate });
        return NextResponse.json({ success: true, data: subtask }, { status: 201 });
      }

      // ── 批次操作 ────────────────────────────────────────
      case 'batchUpdate': {
        const { ids, status } = body;
        if (!ids?.length || !status) {
          return NextResponse.json(
            { success: false, error: 'ids and status are required' },
            { status: 400 }
          );
        }
        const items = eng.batchUpdateStatus(ids, status);
        return NextResponse.json({ success: true, data: { updated: items.length, items } });
      }

      case 'batchDelete': {
        const { ids } = body;
        if (!ids?.length) {
          return NextResponse.json(
            { success: false, error: 'ids is required' },
            { status: 400 }
          );
        }
        const count = eng.batchDelete(ids);
        return NextResponse.json({ success: true, data: { deleted: count } });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[OmniTodo API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

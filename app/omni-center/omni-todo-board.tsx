"use client";

import { useState, useEffect, useCallback } from "react";

type TodoPriority = "low" | "medium" | "high" | "urgent";
type TodoStatus = "pending" | "in_progress" | "completed" | "archived" | "overdue";

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  priority?: TodoPriority;
  status?: TodoStatus;
  category?: string;
  tags?: string[];
  dueDate?: string;
  createdAt?: number;
  updatedAt?: number;
}

type TodoStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

async function callTodoApi<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/omni-todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`OmniTodo API failed: ${res.status}`);
  }

  return res.json();
}

const EMPTY_STATS: TodoStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
};

const PRIORITY_STYLES: Record<TodoPriority, string> = {
  low: "bg-accentGreen/15 text-accentGreen border-accentGreen/40",
  medium: "bg-accentGold/15 text-accentGold border-accentGold/40",
  high: "bg-accentRed/15 text-accentRed border-accentRed/40",
  urgent: "bg-accentPurple/15 text-accentPurple border-accentPurple/40",
};

const STATUS_LABELS: Record<TodoStatus, string> = {
  pending: "待處理",
  in_progress: "進行中",
  completed: "已完成",
  archived: "已歸檔",
  overdue: "已逾期",
};

export function OmniTodoBoard() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [stats, setStats] = useState<TodoStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [creatingForm, setCreatingForm] = useState({
    title: "",
    description: "",
    priority: "medium" satisfies TodoPriority,
    dueDate: "",
    category: "esg",
  });

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await callTodoApi<{
        items?: TodoItem[];
        data?: { items?: TodoItem[] };
      }>({
        action: "list",
        filter: {},
        page: 1,
        pageSize: 50,
      });

      const nested = data?.data?.items;
      const list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(nested)
          ? nested
          : [];

      const normalized = list.map((item) => ({
        ...item,
        createdAt: typeof item.createdAt === "number" ? item.createdAt : Date.now(),
        updatedAt: typeof item.updatedAt === "number" ? item.updatedAt : Date.now(),
      })) as TodoItem[];

      setTodos(normalized);
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "載入待辦失敗";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await callTodoApi<TodoStats>({ action: "stats" });
      setStats(data ?? EMPTY_STATS);
    } catch {
      setStats(EMPTY_STATS);
    }
  }, []);

  useEffect(() => {
    loadTodos();
    loadStats();
  }, [loadTodos, loadStats]);

  const onCreate = useCallback(async () => {
    const title = creatingForm.title.trim();
    if (!title) return;

    try {
      const item = await callTodoApi<TodoItem>({
        action: "create",
        title,
        description: creatingForm.description.trim() || undefined,
        priority: creatingForm.priority,
        dueDate: creatingForm.dueDate || undefined,
        category: creatingForm.category || undefined,
        tags: [],
        createdBy: "omni-center",
      });

      setTodos((prev) => [item, ...prev]);
      setCreatingForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        category: "esg",
      });
      setCreating(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : "建立待辦失敗";
      setError(message);
    }
  }, [creatingForm]);

  const updateStatus = useCallback(
    async (id: string, action: "start" | "complete" | "archive" | "reopen") => {
      try {
        const item = await callTodoApi<TodoItem>({ action, id });
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? { ...todo, ...item } : todo)),
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : "操作失敗";
        setError(message);
      }
    },
    []
  );

  const removeTodo = useCallback(async (id: string) => {
    try {
      await callTodoApi<{ deleted: boolean }>({ action: "delete", id });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (e) {
      const message = e instanceof Error ? e.message : "刪除失敗";
      setError(message);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-textSecondary tracking-wider">
          萬能待辦 (OmniTodo)
        </div>
        <button
          onClick={() => setCreating((prev) => !prev)}
          className="border-none rounded-lg px-3 py-1.5 text-xs font-semibold bg-accentTeal text-white hover:opacity-90 transition-opacity"
        >
          {creating ? "取消新增" : "+ 新增待辦"}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 text-center">
        <div className="bg-secondary rounded-lg border border-borderColor p-2">
          <div className="text-[10px] text-textSecondary">總計</div>
          <div className="text-base font-semibold text-textPrimary">{stats.total}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-borderColor p-2">
          <div className="text-[10px] text-textSecondary">待處理</div>
          <div className="text-base font-semibold text-accentGold">{stats.pending}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-borderColor p-2">
          <div className="text-[10px] text-textSecondary">進行中</div>
          <div className="text-base font-semibold text-accentTeal">{stats.inProgress}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-borderColor p-2">
          <div className="text-[10px] text-textSecondary">已完成</div>
          <div className="text-base font-semibold text-accentGreen">{stats.completed}</div>
        </div>
        <div className="bg-secondary rounded-lg border border-borderColor p-2">
          <div className="text-[10px] text-textSecondary">逾期</div>
          <div className="text-base font-semibold text-[#FF4D6D]">{stats.overdue}</div>
        </div>
      </div>

      {creating && (
        <div className="bg-secondary border border-accentTeal rounded-xl p-3">
          <div className="text-xs text-accentTeal font-semibold mb-2">新增待辦</div>
          <input
            className="w-full bg-primary border border-borderColor rounded-lg px-2.5 py-2 text-textPrimary text-[13px] outline-none mb-2 focus:border-accentTeal"
            placeholder="待辦標題"
            value={creatingForm.title}
            onChange={(e) =>
              setCreatingForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            className="w-full bg-primary border border-borderColor rounded-lg px-2.5 py-2 text-textPrimary text-[13px] outline-none min-h-[80px] resize-y block mb-2 focus:border-accentTeal"
            placeholder="描述"
            value={creatingForm.description}
            onChange={(e) =>
              setCreatingForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              className="w-full bg-primary border border-borderColor rounded-lg px-2.5 py-2 text-textPrimary text-[13px] outline-none focus:border-accentTeal cursor-pointer"
              value={creatingForm.priority}
              onChange={(e) =>
                setCreatingForm((prev) => ({
                  ...prev,
                  priority: e.target.value as TodoPriority,
                }))
              }
            >
              <option value="low">低優先</option>
              <option value="medium">中優先</option>
              <option value="high">高優先</option>
              <option value="urgent">緊急</option>
            </select>
            <input
              type="date"
              className="w-full bg-primary border border-borderColor rounded-lg px-2.5 py-2 text-textPrimary text-[13px] outline-none focus:border-accentTeal"
              value={creatingForm.dueDate}
              onChange={(e) =>
                setCreatingForm((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCreate}
              className="border-none rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-accentGreen text-white hover:opacity-90 transition-opacity"
            >
              儲存
            </button>
            <button
              onClick={() => setCreating(false)}
              className="border-none rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-primary text-textSecondary hover:opacity-90 transition-opacity"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-[#FF4D6D]/15 border border-[#FF4D6D] rounded-lg px-3 py-1.5 text-xs text-[#FF4D6D]">
          {error}
        </div>
      )}

      {loading && todos.length === 0 && (
        <div className="text-textSecondary text-xs text-center py-4">
          載入待辦中...
        </div>
      )}

      <div className="flex flex-col gap-2">
        {todos.length === 0 && !loading && (
          <div className="text-textSecondary text-xs text-center p-5">
            無待辦，點擊「新增待辦」開始
          </div>
        )}

        {todos.map((todo) => (
          <div
            key={todo.id}
            className="bg-primary rounded-xl p-3 border border-borderColor"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[13px] font-semibold text-textPrimary">
                    {todo.title}
                  </span>
                  {todo.priority && (
                    <span
                      className={`text-[10px] rounded px-1.5 py-[1px] border font-semibold ${PRIORITY_STYLES[todo.priority]}`}
                    >
                      {todo.priority}
                    </span>
                  )}
                  {todo.status && (
                    <span className="text-[10px] rounded px-1.5 py-[1px] border border-borderColor text-textSecondary">
                      {STATUS_LABELS[todo.status] ?? todo.status}
                    </span>
                  )}
                </div>
                {todo.description && (
                  <div className="text-xs text-textSecondary leading-relaxed mb-1 line-clamp-2">
                    {todo.description}
                  </div>
                )}
                <div className="flex gap-1 flex-wrap">
                  {(todo.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-accentTeal bg-accentTeal/10 rounded px-1.5 py-[1px]"
                    >
                      {tag}
                    </span>
                  ))}
                  {todo.dueDate && (
                    <span className="text-[10px] text-textSecondary">
                      到期：{todo.dueDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-1 shrink-0">
                {todo.status === "pending" && (
                  <button
                    onClick={() => updateStatus(todo.id, "start")}
                    className="border-none rounded-lg px-2 py-1 text-[11px] font-semibold bg-accentTeal text-white hover:opacity-90 transition-opacity"
                  >
                    開始
                  </button>
                )}
                {(todo.status === "pending" || todo.status === "in_progress") && (
                  <button
                    onClick={() => updateStatus(todo.id, "complete")}
                    className="border-none rounded-lg px-2 py-1 text-[11px] font-semibold bg-accentGreen text-white hover:opacity-90 transition-opacity"
                  >
                    完成
                  </button>
                )}
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="border-none rounded-lg px-2 py-1 text-[11px] font-semibold bg-[#FF4D6D] text-white hover:opacity-90 transition-opacity"
                >
                  刪除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

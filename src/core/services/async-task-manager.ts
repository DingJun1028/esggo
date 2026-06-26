/**
 * v5 非同步報告任務管理
 *
 * _zero依賴：用 Map + setTimeout，無需 Redis/外部套件
 * VPS 單進程部署，任務存储在記憶體中
 */

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface TaskProgress {
  readonly taskId: string;
  readonly status: TaskStatus;
  readonly currentChapter: number;
  readonly totalChapters: number;
  readonly chapterTitle: string;
  readonly wordsSoFar: number;
  readonly fiveTGate: string;
  readonly tagsCreated: number;
  readonly decisionsCount: number;
  readonly percent: number;
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly error?: string;
  readonly result?: {
    readonly totalWords: number;
    readonly totalTags: number;
    readonly trinityHash: string;
    readonly durationMs: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// In-Memory Store
// ═══════════════════════════════════════════════════════════════

const tasks = new Map<string, TaskProgress>();
const taskTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Auto-cleanup: 保留結果 1 小時後清除
const RESULT_TTL_MS = 3600000;

// ═══════════════════════════════════════════════════════════════
// Task Lifecycle
// ═══════════════════════════════════════════════════════════════

export function createTask(companyId: string): string {
  const taskId = `tsk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();

  const task: TaskProgress = {
    taskId,
    status: 'pending',
    currentChapter: 0,
    totalChapters: 28,
    chapterTitle: '',
    wordsSoFar: 0,
    fiveTGate: '',
    tagsCreated: 0,
    decisionsCount: 0,
    percent: 0,
    startedAt: now,
    updatedAt: now,
  };

  tasks.set(taskId, task);
  return taskId;
}

export function getTask(taskId: string): TaskProgress | null {
  return tasks.get(taskId) ?? null;
}

export function getAllTasks(): TaskProgress[] {
  return Array.from(tasks.values());
}

export function updateTask(taskId: string, partial: Partial<TaskProgress>): TaskProgress | null {
  const existing = tasks.get(taskId);
  if (!existing) return null;
  const updated = { ...existing, ...partial, updatedAt: new Date().toISOString() };
  tasks.set(taskId, updated);
  return updated;
}

export function cancelTask(taskId: string): boolean {
  const task = tasks.get(taskId);
  if (!task) return false;
  if (task.status === 'completed' || task.status === 'failed') return false;

  const timeout = taskTimeouts.get(taskId);
  if (timeout) {
    clearTimeout(timeout);
    taskTimeouts.delete(taskId);
  }

  tasks.set(taskId, {
    ...task,
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  });
  return true;
}

export function cleanupOldTasks(): number {
  const now = Date.now();
  let cleaned = 0;
  const entries = Array.from(tasks.entries());
  for (let i = 0; i < entries.length; i++) {
    const [id, task] = entries[i];
    if (task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') {
      if (task.completedAt) {
        const completedTime = new Date(task.completedAt).getTime();
        if (now - completedTime > RESULT_TTL_MS) {
          tasks.delete(id);
          cleaned++;
        }
      }
    }
  }
  return cleaned;
}

// ═══════════════════════════════════════════════════════════════
// Progress Simulation — 非同步逐章生成
// ═══════════════════════════════════════════════════════════════

export type ProgressCallback = (progress: TaskProgress) => void;

export function startAsyncTask(
  taskId: string,
  companyId: string,
  onProgress?: ProgressCallback,
): void {
  const task = tasks.get(taskId);
  if (!task) return;

  // Mark as running
  tasks.set(taskId, { ...task, status: 'running', updatedAt: new Date().toISOString() });

  let chapterIndex = 0;
  const totalChapters = 28;
  let wordsSoFar = 0;
  const baseWordsPerChapter = 10000;

  function processNextChapter() {
    const current = tasks.get(taskId);
    if (!current || current.status === 'cancelled') return;

    if (chapterIndex >= totalChapters) {
      // Task complete
      const completedAt = new Date().toISOString();
      const totalWords = wordsSoFar;
      const result: TaskProgress = {
        ...current,
        status: 'completed',
        currentChapter: totalChapters,
        wordsSoFar: totalWords,
        percent: 100,
        updatedAt: completedAt,
        completedAt,
        result: {
          totalWords,
          totalTags: totalChapters,
          trinityHash: `trinity-${taskId}-${totalWords}`,
          durationMs: Date.now() - new Date(current.startedAt).getTime(),
        },
      };
      tasks.set(taskId, result);
      onProgress?.(result);

      // Schedule cleanup
      setTimeout(() => {
        tasks.delete(taskId);
        taskTimeouts.delete(taskId);
      }, RESULT_TTL_MS);
      return;
    }

    const chNum = chapterIndex + 1;
    const gate = chNum <= 3 ? 'traceable' : chNum <= 5 ? 'transparent' : chNum <= 13 ? 'tangible' : chNum <= 24 ? 'trustworthy' : 'trackable';
    const chapterWords = baseWordsPerChapter + Math.floor(Math.random() * 2000) - 1000;
    wordsSoFar += chapterWords;
    chapterIndex++;

    const progress: TaskProgress = {
      ...current,
      status: 'running',
      currentChapter: chapterIndex,
      totalChapters,
      chapterTitle: `第${chNum}章`,
      wordsSoFar,
      fiveTGate: gate,
      tagsCreated: chapterIndex,
      decisionsCount: chapterIndex * 3,
      percent: Math.round((chapterIndex / totalChapters) * 100),
      updatedAt: new Date().toISOString(),
    };
    tasks.set(taskId, progress);
    onProgress?.(progress);

    // Simulate async work: 50-200ms per chapter
    const delay = 50 + Math.random() * 150;
    const timeout = setTimeout(processNextChapter, delay);
    taskTimeouts.set(taskId, timeout);
  }

  // Start processing after small initial delay
  const initialTimeout = setTimeout(processNextChapter, 100);
  taskTimeouts.set(taskId, initialTimeout);
}

// ═══════════════════════════════════════════════════════════════
// Global cleanup interval (runs every 5 min)
// ═══════════════════════════════════════════════════════════════

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startCleanupInterval(): void {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const cleaned = cleanupOldTasks();
    if (cleaned > 0) {
      // Silent cleanup — no console.log to avoid noise
    }
  }, 300000);
}

export function stopCleanupInterval(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

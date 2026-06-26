/**
 * ESGGO v5.1 — Redis 快取層
 * 
 * 用途：
 * 1. 報告生成進度追蹤
 * 2. 單章快取（避免重複生成）
 * 3. Task 狀態管理
 * 
 * 支援 Redis（生產環境）和 Memory Cache（開發環境）
 */

import { createHash } from 'crypto';

// 快取前綴首
const CACHE_PREFIX = 'esggo:v5:';
const CHAPTER_TTL = 24 * 60 * 60; // 24 小時
const TASK_TTL = 7 * 24 * 60 * 60; // 7 天
const PROGRESS_TTL = 60 * 60; // 1 小時

// Memory Cache Fallback（開發環境）
const memoryCache = new Map<string, { value: any; expiry: number }>();

function getMemoryCache(key: string): any {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

function setMemoryCache(key: string, value: any, ttl: number): void {
  memoryCache.set(key, { value, expiry: Date.now() + ttl * 1000 });
}

// Redis Client（延遲初始化）
let redisClient: any = null;

async function getRedisClient() {
  if (redisClient) return redisClient;
  try {
    const { default: Redis } = await import('ioredis');
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });
    return redisClient;
  } catch {
    redisClient = null;
    return null; // Fallback to memory cache
  }
}

// 快取鍵生成
export function chapterCacheKey(taskId: string, chapterNum: number): string {
  return `${CACHE_PREFIX}chapter:${taskId}:${chapterNum}`;
}

export function taskCacheKey(taskId: string): string {
  return `${CACHE_PREFIX}task:${taskId}`;
}

export function progressCacheKey(taskId: string): string {
  return `${CACHE_PREFIX}progress:${taskId}`;
}

// 取得章節快取
export async function getChapterCache(taskId: string, chapterNum: number): Promise<any> {
  const key = chapterCacheKey(taskId, chapterNum);
  const redis = await getRedisClient();
  if (redis) {
    const data = await redis.get(key);
    if (data) return JSON.parse(data);
  }
  return getMemoryCache(key);
}

// 設定章節快取
export async function setChapterCache(taskId: string, chapterNum: number, content: any): Promise<void> {
  const key = chapterCacheKey(taskId, chapterNum);
  const redis = await getRedisClient();
  if (redis) {
    await redis.setex(key, CHAPTER_TTL, JSON.stringify(content));
  }
  setMemoryCache(key, content, CHAPTER_TTL);
}

// Task 狀態
export interface TaskState {
  taskId: string;
  companyId: string;
  companyName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalChapters: number;
  completedChapters: number[];
  failedChapters: number[];
  chapters: Record<number, { status: string; words: number; content?: string }>;
  createdAt: string;
  updatedAt: string;
  format: 'json' | 'html' | 'markdown';
}

// 取得 Task 狀態
export async function getTaskState(taskId: string): Promise<TaskState | null> {
  const key = taskCacheKey(taskId);
  const redis = await getRedisClient();
  if (redis) {
    const data = await redis.get(key);
    if (data) return JSON.parse(data);
  }
  return getMemoryCache(key);
}

// 設定 Task 狀態
export async function setTaskState(state: TaskState): Promise<void> {
  const key = taskCacheKey(state.taskId);
  const redis = await getRedisClient();
  if (redis) {
    await redis.setex(key, TASK_TTL, JSON.stringify(state));
  }
  setMemoryCache(key, state, TASK_TTL);
}

// 更新章節進度
export async function updateChapterProgress(
  taskId: string,
  chapterNum: number,
  status: string,
  words: number = 0,
  content?: string
): Promise<TaskState | null> {
  const state = await getTaskState(taskId);
  if (!state) return null;
  
  state.chapters[chapterNum] = { status, words, content };
  state.updatedAt = new Date().toISOString();
  
  if (status === 'completed' && !state.completedChapters.includes(chapterNum)) {
    state.completedChapters.push(chapterNum);
  }
  if (status === 'failed' && !state.failedChapters.includes(chapterNum)) {
    state.failedChapters.push(chapterNum);
  }
  
  if (state.completedChapters.length === state.totalChapters) {
    state.status = 'completed';
  } else if (state.completedChapters.length > 0) {
    state.status = 'processing';
  }
  
  await setTaskState(state);
  return state;
}

// 取得進度百分比
export async function getProgress(taskId: string): Promise<{
  taskId: string;
  status: string;
  completed: number;
  total: number;
  percentage: number;
}> {
  const state = await getTaskState(taskId);
  if (!state) {
    return { taskId, status: 'not_found', completed: 0, total: 28, percentage: 0 };
  }
  return {
    taskId,
    status: state.status,
    completed: state.completedChapters.length,
    total: state.totalChapters,
    percentage: Math.round((state.completedChapters.length / state.totalChapters) * 100),
  };
}

// 清除快取
export async function clearTaskCache(taskId: string): Promise<void> {
  const state = await getTaskState(taskId);
  if (!state) return;
  
  const redis = await getRedisClient();
  for (const chapterNum of Object.keys(state.chapters)) {
    const key = chapterCacheKey(taskId, parseInt(chapterNum));
    if (redis) await redis.del(key);
    memoryCache.delete(key);
  }
  
  const taskKey = taskCacheKey(taskId);
  if (redis) await redis.del(taskKey);
  memoryCache.delete(taskKey);
}

export default {
  getChapterCache,
  setChapterCache,
  getTaskState,
  setTaskState,
  updateChapterProgress,
  getProgress,
  clearTaskCache,
};

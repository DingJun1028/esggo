/**
 * =============================================================================
 * OmniCore V5.1 — 健康檢查端點
 * =============================================================================
 *
 * GET /api/healthz
 *
 * 用途：
 * - Docker HEALTHCHECK CMD
 * - 負載均衡器健康探針
 * - CI/CD Smoke Test
 * - Prometheus Blackbox Exporter
 *
 * 響應格式：
 *   200 OK   → 系統健康
 *   503 Error → 子系統異常
 */

import { NextResponse } from 'next/server';

interface HealthCheck {
  name: string;
  status: 'ok' | 'warn' | 'error';
  latencyMs?: number;
  message?: string;
}

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  version: string;
  timestamp: string;
  uptime: number;
  environment: string;
  checks: HealthCheck[];
}

/**
 * 檢查資料庫連線
 */
async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // 嘗試動態引入 pg 進行快速 ping
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 3000,
      max: 1,
    });
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    await pool.end();

    return {
      name: 'database',
      status: 'ok',
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    // 若未配置 DATABASE_URL，回傳 warn 而非 error（允許無 DB 模式）
    if (!process.env.DATABASE_URL) {
      return { name: 'database', status: 'warn', message: 'DATABASE_URL 未設定' };
    }
    return {
      name: 'database',
      status: 'error',
      latencyMs: Date.now() - start,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 檢查 AI 模型可用性
 */
async function checkAI(): Promise<HealthCheck> {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY || process.env.AGNES_API
  );
  return {
    name: 'ai_model',
    status: hasKey ? 'ok' : 'warn',
    message: hasKey ? undefined : 'AI API Key 未設定',
  };
}

/**
 * 健康端點主路由
 */
export async function GET(): Promise<NextResponse<HealthResponse>> {
  const startTime = Date.now();

  // 並行執行所有健康檢查
  const [dbCheck, aiCheck] = await Promise.all([
    checkDatabase(),
    checkAI(),
  ]);

  const checks: HealthCheck[] = [dbCheck, aiCheck];

  // 決定整體狀態
  const hasError = checks.some((c) => c.status === 'error');
  const hasWarn = checks.some((c) => c.status === 'warn');
  const overallStatus: HealthResponse['status'] = hasError
    ? 'error'
    : hasWarn
    ? 'degraded'
    : 'ok';

  const response: HealthResponse = {
    status: overallStatus,
    version: process.env.npm_package_version ?? '5.1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV ?? 'unknown',
    checks,
  };

  const httpStatus = hasError ? 503 : 200;

  return NextResponse.json(response, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-OmniCore-Version': '5.1.0',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  });
}

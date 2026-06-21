// app/api/health/route.ts
// 健康檢查端點 — 提供記憶體、版本、服務狀態

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '2.0.0',
    node: process.version,
    uptime_seconds: Math.round(uptime),
    uptime_human: formatUptime(uptime),
    memory: {
      rss_mb: Math.round(memUsage.rss / 1024 / 1024),
      heap_used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
      external_mb: Math.round(memUsage.external / 1024 / 1024),
    },
    services: {
      nextjs: true,
      // 這些在實際環境中會檢查
      pm2: true,
      nginx: true,
    },
  });
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

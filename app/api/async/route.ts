import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chapterIds = [], expert = 'default', template = 'default' } = body;

  // Lazy import to avoid build-time env requirements
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  });

  const taskId = `task_${Date.now()}_${crypto.randomUUID()}`;

  for (const chapterId of chapterIds) {
    await redis.set('chapter:' + chapterId, JSON.stringify({ expert, template, status: 'pending' }));
    await redis.expire('chapter:' + chapterId, 3600);
  }

  return jsonResponse({ taskId, status: 'created' });
}

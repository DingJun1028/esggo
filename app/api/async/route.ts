import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chapterIds = [], expert = 'default', template = 'default' } = body;

  const taskId = `task_${Date.now()}_${crypto.randomUUID()}`;

  chapterIds.forEach((chapterId: string) => {
    redis.set('chapter:' + chapterId, JSON.stringify({ expert, template, status: 'pending' }));
    redis.expire('chapter:' + chapterId, 3600);
  });

  return NextResponse.json({ taskId, status: 'created' });
}
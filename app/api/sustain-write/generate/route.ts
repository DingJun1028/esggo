// app/api/sustain-write/generate/route.ts
// 24 萬字永續報告自動生成 API
// 分章節呼叫 AI → 自動組裝 → 回傳完整報告

import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore - path alias
import { generateFullReport, type GenerationProgress } from '@/lib/sustain-write/report-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST — 開始生成報告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, companyName, industry, customPrompt } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    // 回傳 SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          try {
            controller.enqueue(
              encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
            );
          } catch {
            /* closed */
          }
        };

        try {
          send('started', { message: '開始生成報告...', timestamp: Date.now() });

          const report = await generateFullReport(
            templateId,
            companyName || '示範企業',
            industry || '製造業',
            customPrompt || '',
            undefined,
            (progress: GenerationProgress) => {
              send('progress', {
                phase: progress.phase,
                currentChapter: progress.currentChapter,
                totalChapters: progress.totalChapters,
                chapterTitle: progress.chapterTitle,
                wordCount: progress.wordCount,
                totalWords: progress.totalWords,
                estimatedTotal: progress.estimatedTotal,
              });
            }
          );

          send('complete', {
            report: {
              templateId: report.templateId,
              templateName: report.templateName,
              companyName: report.companyName,
              industry: report.industry,
              totalWords: report.totalWords,
              generatedAt: report.generatedAt,
              chapterCount: report.chapters.length,
              chapters: report.chapters.map((ch) => ({
                id: ch.id,
                title: ch.title,
                wordCount: ch.wordCount,
                indicators: ch.indicators,
              })),
            },
          });

          // 將完整報告存到 response 中
          controller.enqueue(encoder.encode(`event: report\ndata: ${JSON.stringify(report)}\n\n`));
        } catch (err) {
          send('error', { error: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET — 取得生成狀態（給輪詢用）
export async function GET() {
  return NextResponse.json({ status: 'ready', maxConcurrent: 1 });
}

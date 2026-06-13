import { NextResponse } from 'next/server';
import {
  SustainWriteZeroComputeEngine,
  ZeroComputeExpansionTask,
} from '@/lib/agents/sustain-scribe-zero-compute';
import { writeAuditLog } from '@/lib/audit-logger';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const task: ZeroComputeExpansionTask = await req.json();

    // 初始化零算力引擎
    const engine = new SustainWriteZeroComputeEngine();

    // 執行全卷生成
    const result = await engine.generateFullReport(task);

    // 寫入 5T 協議不可篡改日誌 (Evidence Vault)
    await writeAuditLog({
      action: 'SustainWrite Report Generated',
      targetId: randomUUID(),
      userId: task.companyId || 'System',
      payload: {
        chapters: result.chapters.length,
        totalWords: result.totalWords,
        domain: 'SustainWrite',
      },
    });

    return NextResponse.json({
      success: true,
      chapters: result.chapters,
      totalWords: result.totalWords,
      document: `# 永續報告書\n\n本報告涵蓋 ${result.chapters.length} 個章節，總計約 ${result.totalWords} 字。`,
    });
  } catch (error: any) {
    console.error('[API] Report Generation Failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

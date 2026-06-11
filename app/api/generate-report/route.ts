import { NextResponse } from 'next/server';
import { SustainWriteZeroComputeEngine, ZeroComputeExpansionTask } from '@/lib/agents/sustain-scribe-zero-compute';

export async function POST(req: Request) {
  try {
    const task: ZeroComputeExpansionTask = await req.json();
    
    // 初始化零算力引擎
    const engine = new SustainWriteZeroComputeEngine();
    
    // 執行全卷生成
    const result = await engine.generateFullReport(task);
    
    return NextResponse.json({ 
      success: true, 
      document: result.document, 
      chapters: result.chapters,
      totalWords: result.totalWords
    });
  } catch (error: any) {
    console.error('[API] Report Generation Failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

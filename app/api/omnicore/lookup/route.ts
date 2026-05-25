import { NextResponse } from 'next/server';
import { omniCore } from '@/lib/omni-core';
import { ApiResponse } from '@/types/omni-core';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { 
          id: Date.now().toString(),
          status: 'error',
          content: 'Missing query parameter',
          timestamp: Date.now()
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 1. 在聖碑中尋找匹配的紀錄
    const memories = await omniCore.getMemories();
    const memory = memories.find(m => m.id === query || m.hash_lock.includes(query));

    if (!memory) {
      return NextResponse.json(
        { 
          id: Date.now().toString(),
          status: 'error',
          content: 'Record not found',
          timestamp: Date.now()
        } as ApiResponse,
        { status: 404 }
      );
    }

    // 2. 將 Eternal Memory 紀錄轉換為 IComponentCore 結構以利前端校驗
    const component = {
      uuid: memory.id,
      timestamp: memory.timestamp,
      version: '1.1.0',
      status: 'Trustworthy' as const,
      hash_lock: memory.hash_lock,
      evidence: {
        tangible_metric: memory.content.split('|')[0] || memory.content,
        source_origin: '/vault/evidence/' + memory.id,
        lifecycle_hooks: memory.tags,
        formula_ref: 'GRI Standard'
      }
    };

    return NextResponse.json({
      id: Date.now().toString(),
      status: 'success',
      content: 'Record found in Eternal Memory',
      data: component,
      timestamp: Date.now()
    } as ApiResponse);

  } catch (error: any) {
    return NextResponse.json(
      { 
        id: Date.now().toString(),
        status: 'error',
        content: error.message,
        timestamp: Date.now()
      } as ApiResponse,
      { status: 500 }
    );
  }
}

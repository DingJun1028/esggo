import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/memory/memory-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get('agent');
  const search = searchParams.get('search');
  
  try {
    let data: unknown[];
    
    if (search) {
      data = await memoryStore.search(search);
    } else if (agent) {
      data = await memoryStore.getByAgent(agent);
    } else {
      data = await memoryStore.getAll();
    }
    
    return NextResponse.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    memoryStore.clear();
    return NextResponse.json({ success: true, message: 'Memory cleared' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
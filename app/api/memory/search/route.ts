import { NextResponse } from 'next/server';
import { OmniMemoryService } from '@/lib/services/omni-memory.service';

export async function POST(req: Request) {
  try {
    const { query, match_threshold = 0.7, match_count = 5 } = await req.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const results = await OmniMemoryService.searchMemory(query, match_threshold, match_count);

    return NextResponse.json({ success: true, data: results });

  } catch (error: any) {
    console.error('[Memory Search] General Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

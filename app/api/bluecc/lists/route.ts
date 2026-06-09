import { NextRequest, NextResponse } from 'next/server';
import { BlueCcClient } from '@/lib/services/omni-blue';

/**
 * GET /api/bluecc/lists?projectId=xxx
 * 列出 Blue.cc 工作區中的所有 TodoLists
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') || undefined;

    const client = new BlueCcClient();
    const result = await client.listTodoLists(projectId);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      lists: result.data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

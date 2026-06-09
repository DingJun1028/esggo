import { NextRequest, NextResponse } from 'next/server';
import { BlueCcClient } from '@/lib/services/omni-blue';

/**
 * GET /api/bluecc/workspaces
 * 列出 Blue.cc 組織下所有工作區（Projects）
 */
export async function GET() {
  try {
    const client = new BlueCcClient();
    const result = await client.listProjects();

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      workspaces: result.data?.items || [],
      total: result.data?.totalItems || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { BlueCcClient } from '@/lib/services/omni-blue';

/**
 * GET /api/bluecc/records?listId=xxx
 * 列出 Blue.cc 工作區中的 Records（Todos）
 * 如果有傳入 listId，只取得該 list 的 todos
 * 否則取得專案中所有 list 的 todos
 *
 * POST /api/bluecc/records
 * 建立新紀錄 { title, listId, customFields }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listId = searchParams.get('listId') || undefined;

    const client = new BlueCcClient();
    const result = await client.listRecords(listId);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      records: result.data?.items || [],
      total: result.data?.totalItems || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, listId, customFields } = body;

    if (!title) {
      return NextResponse.json(
        { ok: false, error: 'title is required' },
        { status: 400 }
      );
    }

    const client = new BlueCcClient();
    const result = await client.createRecord(title, listId, customFields);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      record: result.data,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

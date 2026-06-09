import { NextRequest, NextResponse } from 'next/server';
import { BlueCcClient } from '@/lib/services/omni-blue';

/**
 * GET /api/bluecc/custom-fields
 * 列出 Blue.cc 工作區中的自訂欄位定義
 */
export async function GET() {
  try {
    const client = new BlueCcClient();
    const result = await client.listCustomFields();

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      customFields: result.data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

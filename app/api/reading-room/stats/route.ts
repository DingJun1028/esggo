import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: catData, error: catError } = await supabase
      .from('reading_room_documents')
      .select('category');
    if (catError) {
      console.error('Stats fetch error:', catError);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const categories: Record<string, number> = {};
    for (const doc of catData || []) {
      if (doc.category) {
        categories[doc.category] = (categories[doc.category] || 0) + 1;
      }
    }

    return NextResponse.json({
      totalDocuments: (catData || []).length,
      byCategory: categories,
    });
  } catch (err) {
    console.error('Stats handler error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    let query = supabase.from('reading_room_documents').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data } = await query;

    const docs = data || [];

    // Stats derivation formulas
    const totalDocs = docs.length;
    const indexedDocs = docs.filter((d: any) => d.file_url && d.file_url.length > 0).length;
    const pendingDocs = totalDocs - indexedDocs;
    const sealRate = totalDocs > 0 ? (indexedDocs / totalDocs) * 100 : 0;

    const categories = docs.reduce<Record<string, number>>((acc, d: any) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {});

    const esgCategories = docs.reduce<Record<string, number>>((acc, d: any) => {
      if (d.esg_category) acc[d.esg_category] = (acc[d.esg_category] || 0) + 1;
      return acc;
    }, {});

    const yearDistribution = docs.reduce<Record<number, number>>((acc, d: any) => {
      if (d.published_date) {
        const y = new Date(d.published_date).getFullYear();
        if (!isNaN(y)) acc[y] = (acc[y] || 0) + 1;
      }
      return acc;
    }, {});

    return NextResponse.json({
      stats: {
        totalDocs,
        indexedDocs,
        pendingDocs,
        sealRate: Number(sealRate.toFixed(1)),
        categories,
        esgCategories,
        yearDistribution: Object.entries(yearDistribution)
          .map(([year, count]) => ({ year: Number(year), count }))
          .sort((a: any, b: any) => a.year - b.year),
      },
    });
  } catch (err) {
    console.error('Reading room stats error:', err);
    return NextResponse.json({ stats: null }, { status: 500 });
  }
}

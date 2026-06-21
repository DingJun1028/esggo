import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const query = searchParams.get('q') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let dbQuery = supabase
      .from('reading_room_documents')
      .select('*', { count: 'exact' })
      .order('published_date', { ascending: false })
      .range(from, to);

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    if (query) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,source.ilike.%${query}%`
      );
    }

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Reading room query error:', error);
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      documents: data || [],
      pagination: {
        page,
        limit,
        totalDocs: count ?? 0,
        totalPages,
      },
    });
  } catch (err) {
    console.error('Reading room handler error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, filter } = body;

    if (action === 'export') {
      let dbQuery = supabase.from('reading_room_documents').select('*').order('published_date', { ascending: false });
      if (filter?.category) dbQuery = dbQuery.eq('category', filter.category);
      if (filter?.q) dbQuery = dbQuery.or(`title.ilike.%${filter.q}%,description.ilike.%${filter.q}%,source.ilike.%${filter.q}%`);
      const { data, error } = await dbQuery;
      if (error) return NextResponse.json({ error: 'Export failed' }, { status: 500 });
      const format = body.format || 'json';
      if (format === 'csv') {
        const headers = ['id', 'title', 'description', 'category', 'file_url', 'gri_reference', 'esg_category', 'source', 'published_date'];
        const csvRows = [headers.join(',')];
        for (const doc of data ?? []) {
          const row = headers.map((h) => {
            const val = (doc as any)[h];
            if (val === null || val === undefined) return '';
            if (h === 'tags') return `"${(Array.isArray(val) ? val.join(';') : val).replace(/"/g, '""')}"`;
            return `"${String(val).replace(/"/g, '""')}"`;
          }).join(',');
          csvRows.push(row);
        }
        return new NextResponse(csvRows.join('\n'), {
          headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="reading-room-export.csv"' },
        });
      }
      return NextResponse.json({ documents: data ?? [] });
    }

    if (action === 'create') {
      const { id, title, description, category, file_url, gri_reference, esg_category, tags, source, published_date } = body;
      if (!id || !title) return NextResponse.json({ error: 'id and title are required' }, { status: 400 });
      const insert: Record<string, any> = { id, title };
      if (description) insert.description = description;
      if (category) insert.category = category;
      if (file_url) insert.file_url = file_url;
      if (gri_reference) insert.gri_reference = gri_reference;
      if (esg_category) insert.esg_category = esg_category;
      if (tags) insert.tags = Array.isArray(tags) ? tags : [];
      if (source) insert.source = source;
      if (published_date) insert.published_date = published_date;
      const { data, error } = await supabase.from('reading_room_documents').insert(insert).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ document: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Reading room POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

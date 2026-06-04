import { NextResponse } from 'next/server';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
async function getAdminClient() {
    const { createClient } = await import('@supabase/supabase-js');
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase credentials not configured');
    }
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false }
    });
}
function getTableName(module) {
    if (module === 'env')
        return 'environmental_data';
    if (module === 'social')
        return 'social_metrics';
    if (module === 'gov')
        return 'governance_metrics';
    return null;
}
export async function GET(request, { params }) {
    try {
        const { module } = await params;
        const tableName = getTableName(module);
        if (!tableName)
            return NextResponse.json({ error: 'Invalid module' }, { status: 400 });
        const supabase = await getAdminClient();
        const { data, error } = await supabase.from(tableName).select('*').order('year', { ascending: false });
        if (error)
            throw error;
        return NextResponse.json({ success: true, data });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
export async function POST(request, { params }) {
    try {
        const { module } = await params;
        const tableName = getTableName(module);
        if (!tableName)
            return NextResponse.json({ error: 'Invalid module' }, { status: 400 });
        const body = await request.json();
        const supabase = await getAdminClient();
        const { data, error } = await supabase.from(tableName).insert([body]).select();
        if (error)
            throw error;
        return NextResponse.json({ success: true, data: data[0] });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
import { NextResponse } from 'next/server';
import { BestPracticeSchema } from '@/lib/agent/best-practice-registry';
import { omniBlueTableService } from '@/src/server/services/omni-blue-table.service';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
async function createClient() {
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    return createSupabaseClient(supabaseUrl, serviceRoleKey);
}
export async function POST(request) {
    try {
        const body = await request.json();
        const validatedData = BestPracticeSchema.parse(body);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('best_practices')
            .upsert({
            id: validatedData.id,
            category: validatedData.category,
            industry: validatedData.industry,
            title: validatedData.title,
            strategy: validatedData.strategy,
            benchmark_source: validatedData.benchmark_source,
            t5_compliance: validatedData.t5_compliance,
            impact_score: validatedData.impact_score,
            tags: validatedData.tags,
            last_verified: validatedData.last_verified,
            updated_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ data, message: 'Best practice saved successfully' }, { status: 201 });
    }
    catch (error) {
        if (error.errors) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
    }
}
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const industry = searchParams.get('industry');
        const { data, error } = await omniBlueTableService.getBestPracticesFromSupabase();
        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }
        let filtered = data || [];
        if (category) {
            filtered = filtered.filter((bp) => bp.category === category);
        }
        if (industry) {
            filtered = filtered.filter((bp) => bp.industry.includes(industry) || bp.industry === 'General Corporate');
        }
        return NextResponse.json({ data: filtered });
    }
    catch (error) {
        return NextResponse.json({ error: 'Failed to fetch best practices' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
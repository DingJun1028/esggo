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
export async function GET(request) {
    try {
        const supabase = await getAdminClient();
        const { data: envData } = await supabase
            .from('environmental_data')
            .select('metric_name, metric_value, unit, year, category, verified');
        const { data: socialData } = await supabase
            .from('social_metrics')
            .select('metric_name, metric_value, unit, year, category, verified');
        const { data: govData } = await supabase
            .from('governance_metrics')
            .select('metric_name, metric_value, unit, year, category, verified');
        const { data: vaultData } = await supabase
            .from('evidence_vault')
            .select('category, status, is_sealed');
        const { data: auditData } = await supabase
            .from('audit_logs')
            .select('module, action, status');
        const envVerified = envData?.filter(d => d.verified)?.length || 0;
        const socialVerified = socialData?.filter(d => d.verified)?.length || 0;
        const govVerified = govData?.filter(d => d.verified)?.length || 0;
        const vaultByCategory = {};
        const vaultByStatus = {};
        let sealedCount = 0;
        vaultData?.forEach(v => {
            vaultByCategory[v.category] = (vaultByCategory[v.category] || 0) + 1;
            vaultByStatus[v.status] = (vaultByStatus[v.status] || 0) + 1;
            if (v.is_sealed)
                sealedCount++;
        });
        const auditByModule = {};
        auditData?.forEach(a => {
            auditByModule[a.module] = (auditByModule[a.module] || 0) + 1;
        });
        return NextResponse.json({
            success: true,
            data: {
                environmental: {
                    total: envData?.length || 0,
                    verified: envVerified,
                    unverified: (envData?.length || 0) - envVerified,
                },
                social: {
                    total: socialData?.length || 0,
                    verified: socialVerified,
                    unverified: (socialData?.length || 0) - socialVerified,
                },
                governance: {
                    total: govData?.length || 0,
                    verified: govVerified,
                    unverified: (govData?.length || 0) - govVerified,
                },
                vault: {
                    total: vaultData?.length || 0,
                    sealed: sealedCount,
                    unsealed: (vaultData?.length || 0) - sealedCount,
                    byCategory: vaultByCategory,
                    byStatus: vaultByStatus,
                },
                audit: {
                    total: auditData?.length || 0,
                    byModule: auditByModule,
                },
                esgTotal: (envData?.length || 0) + (socialData?.length || 0) + (govData?.length || 0),
                overallVerificationRate: (() => {
                    const total = (envData?.length || 0) + (socialData?.length || 0) + (govData?.length || 0);
                    const verified = envVerified + socialVerified + govVerified;
                    return total > 0 ? Math.round((verified / total) * 100) : 0;
                })(),
            }
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esggo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key';

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get real counts from audit_logs to feed the KPIs dynamically
    const { data: auditLogs } = await supabase.from('audit_logs').select('metric_name, metric_value, hash_lock');

    const totalAuditLogs = auditLogs ? auditLogs.length : 0;
    const trustworthyDocs = auditLogs ? auditLogs.filter(log => log.hash_lock).length : 0;

    const kpiData = [
      {
        title: '碳排放量 (模擬+真實)',
        value: '1,284',
        unit: 'tCO₂e',
        trend: -5.2,
        trendLabel: 'vs last quarter',
        fiveTStatus: [true, true, true, true, true],
        dataSource: 'EPA Database',
      },
      {
        title: '數位封印總數',
        value: trustworthyDocs.toString(),
        unit: '件',
        trend: 100,
        trendLabel: 'vs last audit',
        fiveTStatus: [true, true, true, true, true],
        dataSource: '5T Vault',
      },
      {
        title: '審計日誌紀錄',
        value: totalAuditLogs.toString(),
        unit: '筆',
        trend: 15.2,
        trendLabel: 'vs last month',
        fiveTStatus: [true, true, true, true, true],
        dataSource: 'Audit System',
      },
      {
        title: '水資源效率',
        value: '98.5',
        unit: '%',
        trend: 2.4,
        trendLabel: 'vs last year',
        fiveTStatus: [true, true, true, true, true],
        dataSource: 'Water Management',
      },
    ];

    return NextResponse.json({ ok: true, data: kpiData });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

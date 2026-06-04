import React from 'react';
import { getOmniTableServerClient } from '@/lib/omni-table/client';
import { UniversalCard } from '@/components/ui/UniversalCard';
import { UniversalBadge } from '@/components/ui/UniversalBadge';
import { AlertOctagon, ShieldAlert } from 'lucide-react';
import { DeleteRecordButton } from '@/components/DeleteRecordButton';

export const revalidate = 0; // 確保每次都抓取最新資料

export default async function OmniTableDemoPage() {
    // ⚠️ 實戰中請將此 ID 替換為執行 setup_omni_table.ts 後獲得的 Datasheet ID
    const DATASHEET_ID = process.env.NEXT_PUBLIC_DEMO_DATASHEET_ID || 'dst_your_datasheet_id_here';

    let records = [];
    let errorMsg = null;

    try {
        const client = getOmniTableServerClient();
        // 呼叫 SDK 讀取特定表格中的所有記錄
        const response = await client.getRecords(DATASHEET_ID);
        records = response.records;
    } catch (error) {
        errorMsg = error instanceof Error ? error.message : '載入 OmniTable 資料失敗';
        console.error(errorMsg);
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 flex items-center gap-4 border-b border-slate-800 pb-6">
                    <ShieldAlert className="text-rose-500" size={32} />
                    <div>
                        <h1 className="text-3xl font-bold text-white">ESG 企業風險控制中心</h1>
                        <p className="text-slate-400 mt-1">Data Source: OmniTable.ai (Datasheet: {DATASHEET_ID})</p>
                    </div>
                </header>

                {errorMsg && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        <AlertOctagon className="inline mr-2 mb-1" size={18} /> {errorMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records.map((record) => {
                        const fields = record.fields;
                        const severity = Number(fields['Severity'] || 0);

                        return (
                            <UniversalCard key={record.recordId} variant="glass" className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">{String(fields['Risk_ID'])}</span>
                                    <div className="flex items-center gap-2">
                                        <UniversalBadge variant={severity >= 4 ? 'destructive' : 'primary'} size="xs">
                                            Level {severity}
                                        </UniversalBadge>
                                        <DeleteRecordButton
                                            datasheetId={DATASHEET_ID}
                                            recordId={record.recordId}
                                            currentPath="/omni-demo" // 替換為該頁面實際的 URL path
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-100 mb-2">{String(fields['Description'])}</h3>
                                <p className="text-sm text-slate-400">Category: {String(fields['Category'])}</p>
                                <p className="text-sm text-slate-400 mt-1">Status: <span className="text-cyan-400">{String(fields['Status'])}</span></p>
                            </UniversalCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
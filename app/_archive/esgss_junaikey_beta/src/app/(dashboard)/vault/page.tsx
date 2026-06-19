import { EvidenceTable } from '@/components/features/EvidenceTable.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { createServerClient } from '@/lib/supabase/server.js';
import { Plus, ShieldCheck } from 'lucide-react';

export default async function VaultPage() {
    const supabase = createServerClient();

    const { data: evidenceList } = await supabase
        .from('evidence_vault')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-[#63a6b0]/20 text-[#63a6b0]">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Evidence Vault</h1>
                        <p className="text-slate-500 mt-1 uppercase text-[10px] font-bold tracking-widest">
                            永恆宮殿 - 不可篡改的證據庫 (Crystallized Integrity)
                        </p>
                    </div>
                </div>

                <Button className="shadow-lg shadow-[#63a6b0]/20">
                    <Plus size={20} className="mr-2" />
                    新增證據
                </Button>
            </div>

            <EvidenceTable data={evidenceList || []} />

            <div className="flex justify-center py-4">
                <p className="text-[10px] text-slate-600 font-mono tracking-tighter">
                    5T PROTOCOL VERIFIED BY OMNI-PRIEST & INFOONE SYSTEM
                </p>
            </div>
        </div>
    );
}

'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useTransition } from 'react';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteOmniTableRecord } from '@/app/actions/omni-table';
export function DeleteRecordButton({ datasheetId, recordId, currentPath }) {
    // useTransition 可以讓我們在執行伺服器動作時，呈現 loading 狀態
    const [isPending, startTransition] = useTransition();
    const handleDelete = () => {
        if (confirm('⚠️ 警告：確定要刪除這筆資料嗎？此操作無法復原。')) {
            startTransition(async () => {
                try {
                    await deleteOmniTableRecord(datasheetId, recordId, currentPath);
                }
                catch (error) {
                    alert(error instanceof Error ? error.message : '刪除失敗');
                }
            });
        }
    };
    return (_jsx(UniversalButton, { variant: "ghost", onClick: handleDelete, disabled: isPending, className: "p-1 h-auto text-slate-500 hover:text-red-400 hover:bg-red-500/10", title: "\u522A\u9664\u8CC7\u6599", children: isPending ? _jsx(Loader2, { size: 16, className: "animate-spin text-red-400" }) : _jsx(Trash2, { size: 16 }) }));
}
//# sourceMappingURL=DeleteRecordButton.js.map
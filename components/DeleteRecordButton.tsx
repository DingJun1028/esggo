'use client';

import React, { useTransition } from 'react';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteOmniTableRecord } from '@/app/actions/omni-table';

interface DeleteRecordButtonProps {
    datasheetId: string;
    recordId: string;
    currentPath: string; // 傳入目前所在的路由，以便重新整理
}

export function DeleteRecordButton({ datasheetId, recordId, currentPath }: DeleteRecordButtonProps) {
    // useTransition 可以讓我們在執行伺服器動作時，呈現 loading 狀態
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('⚠️ 警告：確定要刪除這筆資料嗎？此操作無法復原。')) {
            startTransition(async () => {
                try {
                    await deleteOmniTableRecord(datasheetId, recordId, currentPath);
                } catch (error) {
                    alert(error instanceof Error ? error.message : '刪除失敗');
                }
            });
        }
    };

    return (
        <OmniButton
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="p-1 h-auto text-slate-500 hover:text-red-400 hover:bg-red-500/10"
            title="刪除資料"
        >
            {isPending ? <Loader2 size={16} className="animate-spin text-red-400" /> : <Trash2 size={16} />}
        </OmniButton>
    );
}
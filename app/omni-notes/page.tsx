import React from 'react';
import { DailyNotesView } from '@/store/DailyNotesView';

export const metadata = {
    title: '萬能筆記 OmniNotes - ESG GO',
    description: '基於物件與時間的強大筆記流',
};

export default function OmniNotesPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-8">
            <DailyNotesView />
        </div>
    );
}

import React from 'react';
import { DailyNotesView } from '@/components/omni-notes/DailyNotesView';

export const metadata = {
    title: '萬能筆記 OmniNotes - ESG GO',
    description: '基於物件與時間的強大筆記流',
};

export default function OmniNotesPage() {
    return (
        <div className="min-h-screen bg-void-stark p-6 md:p-8 selection:bg-cyan-500/30">
            <DailyNotesView />
        </div>
    );
}
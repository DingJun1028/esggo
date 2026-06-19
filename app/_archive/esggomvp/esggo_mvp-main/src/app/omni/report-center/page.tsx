'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { ReportLibrary } from '@/components/omni/ReportLibrary';

export default function ReportCenterPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[var(--theme-bg)]">
            <ReportLibrary />
        </div>
    );
}

import React from 'react';
import { AuditTrail } from '@/components/AuditTrail';
import { UnifiedAdminLayout } from '@/components/layout/UnifiedAdminLayout';

const AuditTrailPage: React.FC = () => {
    const [activeView, setActiveView] = React.useState('audit-trail');

    return (
        <UnifiedAdminLayout activeView={activeView} onViewChange={setActiveView}>
            <div className="bg-slate-950 min-h-screen">
                <AuditTrail language="zh-TW" />
            </div>
        </UnifiedAdminLayout>
    );
};

export default AuditTrailPage;

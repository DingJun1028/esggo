import React from 'react';
export interface WikiPageRow {
    id: number;
    journey: string;
    page_id: string;
    title: string;
    path: string;
    permission: string;
    core_purpose: string;
    ux_experience: string;
    ui_rwd: string;
    data_api: string;
    edge_cases: string;
    acceptance_5t: string;
}
export default function WikiClientPage({ pages }: {
    pages: WikiPageRow[];
}): React.JSX.Element;
//# sourceMappingURL=WikiClientPage.d.ts.map
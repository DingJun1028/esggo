import React from 'react';
export interface AtomicComponent {
    id: number;
    name: string;
    type: string;
    category: string;
    props_schema: string;
    styles: string;
    description: string;
    is_active: boolean;
}
export interface ToolSpec {
    id: number;
    tool_id: string;
    name: string;
    expert_route: string;
    ui_component: string;
    position_zone: string;
    is_active: boolean;
}
interface ComponentRendererProps {
    zone?: string;
    className?: string;
}
export declare function ComponentRenderer({ zone, className }: ComponentRendererProps): React.JSX.Element;
export {};
//# sourceMappingURL=ComponentRenderer.d.ts.map
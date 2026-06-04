export type ValidationStatus = 'pass' | 'fix' | 'block';
export interface ComponentCheck {
    id: string;
    label: string;
    required: boolean;
}
export interface ComponentSpec {
    name: string;
    category: 'base' | 'composite' | 'template';
    description: string;
    checks: ComponentCheck[];
    antiPatterns: string[];
}
export declare const COMPONENT_SPECS: ComponentSpec[];
export type PageTemplate = 'dashboard' | 'list' | 'detail' | 'form' | 'report';
export interface PageValidationItem {
    id: string;
    question: string;
    required: boolean;
    template: PageTemplate[];
}
export declare const PAGE_VALIDATION_ITEMS: PageValidationItem[];
export declare const BLOCK_CONDITIONS: string[];
//# sourceMappingURL=component-audit.d.ts.map
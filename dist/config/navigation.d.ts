export type Role = 'ADMIN' | 'CSO' | 'PM' | 'DATA_ENTRY' | 'AUDITOR' | 'IT_OPS';
export interface NavItem {
    id: string;
    title: string;
    path: string;
    icon: string;
    requiredRoles?: Role[];
    sub?: string;
}
export interface NavGroup {
    groupId: string;
    groupTitle: string;
    items: NavItem[];
}
export declare const SaaS_NAVIGATION: NavGroup[];
export declare const IT_OPS_NAVIGATION: NavGroup[];
//# sourceMappingURL=navigation.d.ts.map
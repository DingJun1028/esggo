interface CompanyProfile {
    company_name: string;
    industry: string;
    employees: number;
    revenue: number;
    reporting_year: number;
}
interface CompanyProfileState {
    profile: CompanyProfile;
    loading: boolean;
    saved: boolean;
    save: (profile: CompanyProfile) => Promise<void>;
    initData: () => void;
}
export declare const useCompanyProfileStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CompanyProfileState>>;
export type { CompanyProfile };
//# sourceMappingURL=useCompanyProfileStore.d.ts.map
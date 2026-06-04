interface CompanyProfileState {
    profile: Record<string, any>;
    loading: boolean;
    saved: boolean;
    isInitialized: boolean;
    initData: () => Promise<void>;
    save: (newProfile: Record<string, any>) => Promise<void>;
}
export declare const useCompanyProfileStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CompanyProfileState>>;
export {};
//# sourceMappingURL=useCompanyProfileStore.d.ts.map
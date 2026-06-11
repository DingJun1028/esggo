export type AppMode = 'light' | 'dark' | 'system';
export type AppFlavor = 'berkeley' | 'sustainable' | 'minimalist' | 'best-practice';
export type SidebarTheme = 'dark' | 'light' | 'glass';
interface ThemeStore {
    mode: AppMode;
    flavor: AppFlavor;
    sidebarTheme: SidebarTheme;
    setMode: (mode: AppMode) => void;
    setFlavor: (flavor: AppFlavor) => void;
    setSidebarTheme: (theme: SidebarTheme) => void;
}
export declare const useThemeStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ThemeStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<ThemeStore, ThemeStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: ThemeStore) => void) => () => void;
        onFinishHydration: (fn: (state: ThemeStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<ThemeStore, ThemeStore>>;
    };
}>;
export {};
//# sourceMappingURL=theme-store.d.ts.map
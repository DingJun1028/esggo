export interface DataSource {
    id: string;
    group: string;
    groupCode: string;
    institution: string;
    url: string;
    contentType: string;
    updateFreq: string;
    tags: string[];
}
export interface IntelModule {
    id: string;
    code: string;
    name: string;
    nameZh: string;
    purpose: string;
    inputs: string[];
    outputs: string[];
    primaryUsers: string[];
    esgLink: string;
    color: string;
}
export declare const DATA_SOURCES: DataSource[];
export declare const INTEL_MODULES: IntelModule[];
export declare const GROUP_COLORS: Record<string, string>;
export declare const GROUP_LABELS: Record<string, string>;
export declare const CASE_STUDY: {
    title: string;
    subtitle: string;
    modules: {
        module: string;
        finding: string;
        signals: string[];
    }[];
};
//# sourceMappingURL=data-sources-data.d.ts.map
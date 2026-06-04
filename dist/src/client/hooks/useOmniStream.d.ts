export interface OmniEvent {
    id: string;
    type: 'TRACE' | 'COMPUTE' | 'SEAL' | 'MEMORY';
    payload: string;
    timestamp: string;
    integrity_hash?: string;
}
export declare function useOmniStream(): {
    events: OmniEvent[];
    isStreaming: boolean;
};
//# sourceMappingURL=useOmniStream.d.ts.map
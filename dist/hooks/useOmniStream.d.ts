export declare function useOmniStream(url?: string): {
    events: {
        created_at: number;
        id: string;
        hash_lock: string;
        omni_card_uuid: string;
        event_type: string;
        payload: {
            status: "todo" | "doing" | "done";
            name: string;
            attributes: string[];
            uuid: string;
            abilities: string[];
            lastUpdated: number;
        };
        source_platform: string;
        cryptographic_seal?: string | undefined;
    }[];
    isConnected: boolean;
    error: Error | null;
    clearEvents: () => void;
};
//# sourceMappingURL=useOmniStream.d.ts.map
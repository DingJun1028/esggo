/**
 * OmniAgent | Context Gathering Service (MCP inspired)
 * Bridges AI agents with system data and external sources.
 */
export declare function gatherSystemContext(): Promise<{
    timestamp: string;
    metrics: {
        environmental: any;
        social: any;
    };
    runtime: any;
    cloud: any;
}>;
//# sourceMappingURL=context-gatherer.d.ts.map
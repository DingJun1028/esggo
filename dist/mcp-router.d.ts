export declare class MCPRouter {
    private static servers;
    static call(server: string, method: string, params: any): Promise<any>;
    static getAvailableServers(): string[];
    static getServerCapabilities(server: string): string[];
}
//# sourceMappingURL=mcp-router.d.ts.map
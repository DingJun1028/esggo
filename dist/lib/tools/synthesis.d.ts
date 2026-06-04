export interface ToolExecutionResult {
    success: boolean;
    result?: unknown;
    error?: string;
    executionTime?: number;
    generatedCode?: string;
    toolId?: string;
}
export declare class DynamicToolSynthesizer {
    private static instance;
    private toolRegistry;
    private constructor();
    static getInstance(): DynamicToolSynthesizer;
    /**
     * Synthesize a new tool based on a problem description
     */
    synthesizeTool(problem: string, context?: unknown, agentName?: string): Promise<ToolExecutionResult>;
    /**
     * Generate tool code using AI
     */
    private generateToolCode;
    /**
     * Execute tool in a secure sandbox
     */
    private executeSandboxedTool;
    /**
     * Get a synthesized tool by ID
     */
    getTool(toolId: string): {
        code: string;
        createdAt: string;
    } | undefined;
    /**
     * List all synthesized tools
     */
    listTools(): Array<{
        id: string;
        code: string;
        createdAt: string;
    }>;
    /**
     * Clear all synthesized tools
     */
    clearTools(): void;
}
export declare const toolSynthesizer: DynamicToolSynthesizer;
//# sourceMappingURL=synthesis.d.ts.map
/**
 * OmniAgent | AI Tool Registry
 * Defines functions that can be called by Gemini to fetch real ESG data.
 */
export declare const AI_TOOLS: ({
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            category: {
                type: string;
                enum: string[];
                description: string;
            };
        };
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            category?: undefined;
        };
    };
})[];
export declare function executeTool(name: string, args: unknown): Promise<any>;
//# sourceMappingURL=ai-tools.d.ts.map
import { z } from 'genkit';
/**
 * ADK Tools: Standard Genkit Tool Definitions
 */
export declare const fetchEnvironmentalMetrics: import("genkit").ToolAction<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>, z.ZodTypeAny>;
export declare const fetchSocialMetrics: import("genkit").ToolAction<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>, z.ZodTypeAny>;
export declare const fetchGovernanceMetrics: import("genkit").ToolAction<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>, z.ZodTypeAny>;
export declare const listEsgTasks: import("genkit").ToolAction<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodTypeAny>;
export declare const queryNotionDataSource: import("genkit").ToolAction<z.ZodObject<{
    dataSourceId: z.ZodString;
    filter: z.ZodOptional<z.ZodAny>;
    sorts: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    dataSourceId: string;
    filter?: any;
    sorts?: any;
}, {
    dataSourceId: string;
    filter?: any;
    sorts?: any;
}>, z.ZodTypeAny>;
export declare const createNotionPage: import("genkit").ToolAction<z.ZodObject<{
    parentId: z.ZodString;
    title: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    parentId: string;
    content?: string | undefined;
}, {
    title: string;
    parentId: string;
    content?: string | undefined;
}>, z.ZodTypeAny>;
export declare const syncToNCBDB: import("genkit").ToolAction<z.ZodObject<{
    tableName: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    data: Record<string, unknown>;
    tableName: string;
}, {
    data: Record<string, unknown>;
    tableName: string;
}>, z.ZodTypeAny>;
export declare const ADK_STANDARD_TOOLS: (import("genkit").ToolAction<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>, z.ZodTypeAny> | import("genkit").ToolAction<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodTypeAny> | import("genkit").ToolAction<z.ZodObject<{
    dataSourceId: z.ZodString;
    filter: z.ZodOptional<z.ZodAny>;
    sorts: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    dataSourceId: string;
    filter?: any;
    sorts?: any;
}, {
    dataSourceId: string;
    filter?: any;
    sorts?: any;
}>, z.ZodTypeAny> | import("genkit").ToolAction<z.ZodObject<{
    parentId: z.ZodString;
    title: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    parentId: string;
    content?: string | undefined;
}, {
    title: string;
    parentId: string;
    content?: string | undefined;
}>, z.ZodTypeAny> | import("genkit").ToolAction<z.ZodObject<{
    tableName: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    data: Record<string, unknown>;
    tableName: string;
}, {
    data: Record<string, unknown>;
    tableName: string;
}>, z.ZodTypeAny>)[];
//# sourceMappingURL=adk-tools.d.ts.map
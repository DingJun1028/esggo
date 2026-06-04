import { z } from 'genkit';
export declare const auditSealTool: import("genkit").ToolAction<z.ZodObject<{
    evidenceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    evidenceId: string;
}, {
    evidenceId: string;
}>, z.ZodTypeAny>;
export declare const auditSealValidationTool: import("genkit").ToolAction<z.ZodObject<{
    evidenceId: z.ZodString;
    action: z.ZodEnum<["verify", "reject"]>;
}, "strip", z.ZodTypeAny, {
    action: "verify" | "reject";
    evidenceId: string;
}, {
    action: "verify" | "reject";
    evidenceId: string;
}>, z.ZodTypeAny>;
//# sourceMappingURL=audit-seal.d.ts.map
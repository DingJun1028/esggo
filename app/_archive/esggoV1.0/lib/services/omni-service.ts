import { z } from "zod";
import { app, auth } from "@/lib/firebase";
import { getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import {
    createOmniHeart,
    logAuditAction,
    verifyHeartChain,
    getTrinityContext,
    IOmniHeart,
    IOmniTrinity
} from "@/lib/omni-heart";

/**
 * Omni Professional Service
 * Unified interface for all AI operations in ESG GO.
 */
export class OmniService {
    private static ai = typeof window !== "undefined" ? getAI(app, { backend: new GoogleAIBackend() }) : null;
    private static currentHeart: IOmniHeart | null = null;

    /**
     * Send a prompt directly to Gemini via Firebase AI Logic (Client-side)
     * Best for low-latency chat or simple queries.
     */
    static async promptDirect(text: string, options: { model?: string; system?: string } = {}) {
        if (!this.ai) throw new Error("AI Service not available on server-side");

        const modelName = options.model || "gemini-1.5-flash";
        const model = getGenerativeModel(this.ai, {
            model: modelName,
            ...(options.system ? { systemInstruction: options.system } : {})
        });

        const result = await model.generateContent(text);
        return result.response.text();
    }

    /**
     * Transcribe audio using direct Gemini multimodal capabilities
     */
    static async transcribeAudio(base64data: string, mimeType: string) {
        if (!this.ai) throw new Error("AI Service not available on server-side");

        const model = getGenerativeModel(this.ai, { model: "gemini-1.5-flash" });
        const result = await model.generateContent([
            { inlineData: { data: base64data, mimeType } },
            { text: "Please transcribe this audio accurately into Traditional Chinese (zh-TW). Only output the transcription, nothing else." },
        ]);

        return result.response.text().trim();
    }

    /**
     * Execute a Genkit Flow via the protected Backend API
     * Best for complex operations (ZKP, Data Audit, Tool calling)
     */
    static async callFlow(flowName: string, input: any, stream: boolean = false) {
        const user = auth.currentUser;
        if (!user) throw new Error("Authentication required for professional flows.");

        const token = await user.getIdToken();
        const res = await fetch("/api/genkit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                flowName,
                input,
                stream
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Flow execution failed");
        }

        if (stream) {
            return res.body; // Return readable stream for SSE
        }

        const data = await res.json();
        return data.result;
    }
    /**
     * Generate a ZKP Forensic Seal (OmniHeart) for an action.
     * This establishes a hash chain for auditability.
     */
    static async generateZkProof(action: string, domain: string = "ESG_Analysis"): Promise<IOmniHeart> {
        if (!this.currentHeart) {
            this.currentHeart = createOmniHeart(domain, "Clinic_Core", "Omni_System_Init");
        }

        const { newHeart, logEntry } = logAuditAction(this.currentHeart, action);
        this.currentHeart = newHeart;

        // In a real app, we would persist logEntry to a database/blockchain here
        console.log("ZKP Proof Generated:", logEntry);

        return newHeart;
    }

    /**
     * Verify a proof's integrity and return its Trinity context (Truth, Order, Flow)
     */
    static verifyProof(heart: IOmniHeart): { isValid: boolean; trinity: IOmniTrinity } {
        const isValid = verifyHeartChain(heart);
        const trinity = getTrinityContext(heart);
        return { isValid, trinity };
    }
}

/**
 * Dispatch a request to the Omni Manager for intent orchestration.
 */
export async function dispatchToOmniManager(query: string) {
    return await OmniService.callFlow("omniManagerFlow", { intent: query });
}

// Export pre-defined types and schemas
export const SynthesisPathSchema = z.enum(["conservative", "aggressive", "visionary"]);
export type EsgMetrics = z.infer<typeof EsgMetricsSchema>;
export const EsgMetricsSchema = z.object({
    totalEmissions: z.number().optional(),
    scope1Emissions: z.number().optional(),
    scope2Emissions: z.number().optional(),
    scope3Emissions: z.number().optional(),
    energyConsumption: z.number().optional(),
    waterUsage: z.number().optional(),
    hazardousWaste: z.number().optional(),
    nonHazardousWaste: z.number().optional(),
    femaleManagementPct: z.number().optional(),
    trainingHoursPerEmployee: z.number().optional(),
});

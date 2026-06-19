import { ocrBrain } from "./ocr-brain";
import { GeminiService, GeminiModel } from "@/core/GeminiService";
import { TypstGenerator, ITypstDraftData } from "./typst-generator";
import { omniLogger, LogCategory } from "@/core/omniLogger";
import { OmniOne } from "@/core/omni-one";
import { OmniWuzuoNoteService as WuzuoNote } from "@/core/wuzuo-note";
import { OMNI_MODULES } from "@/config/omni-modules";

/**
 * ⚡ OneClickDraftOrchestrator - The Orchestration Logic for "Sustainable Draft"
 */
export class OneClickDraftOrchestrator {
    /**
     * Executes the full "One-Click" drafting flow.
     */
    public static async execute(params: {
        fileBuffer: Buffer;
        fileName: string;
        mimeType: string;
        userAvatar: { title: string; virtues: any };
    }): Promise<{ typstContent: string; transcript: any[]; summary: string[]; atomUuid: string }> {
        omniLogger.info(LogCategory.SYSTEM, "OneClickDraft: Initiating orchestrator flow...");

        // 1. OCR Extraction
        const ocrResult = await ocrBrain.processEvidence(params.fileBuffer, params.fileName, params.mimeType);
        const extractedFields = (ocrResult.metadata?.extractedFields || {}) as Record<string, any>;

        // 2. Sentient Dialogue Generation (Sprite vs Twin)
        const dialogue = await this.generateDialogue({
            extractedData: extractedFields,
            avatar: params.userAvatar
        });

        // 3. Typst Compilation (Mock logic)
        const typstContent = TypstGenerator.generate({
            title: `永續底稿：${params.fileName}`,
            author: params.userAvatar.title,
            transcript: dialogue.transcript,
            summary: dialogue.summary,
            metrics: [
                {
                    name: (extractedFields.metric as string) || "未命名指標",
                    value: String(extractedFields.value || "0"),
                    unit: (extractedFields.unit as string) || "",
                    confidence: ocrResult.quality_score || 0
                }
            ]
        });

        // 4. [Phase 2] 5T Sentient Manifestation (Sealing)
        const atom = await OmniOne.manifest({
            intent: `生成永續底稿: ${params.fileName}`,
            type: 'Intelligence',
            payload: {
                typstContent,
                transcript: dialogue.transcript,
                extractedFields
            },
            domainRef: OMNI_MODULES.ONE_CLICK_DRAFT.uuid,
            impactMetric: extractedFields.value ? `${extractedFields.metric}: ${extractedFields.value} ${extractedFields.unit}` : '生成 ESG 底稿',
            sourceOrigin: params.fileName,
            formula: TypstGenerator.getFormulaByMetric(extractedFields.metric)
        });

        // 5. [Phase 2] Sync to Wuzuo Note
        await WuzuoNote.createNote(
            `[一鍵生成] ${params.fileName}`,
            typstContent
        );

        omniLogger.info(LogCategory.SYSTEM, `OneClickDraft: Atom ${atom.uuid} manifest & synced to Wuzuo Note.`);

        return {
            typstContent,
            transcript: dialogue.transcript,
            summary: dialogue.summary,
            atomUuid: atom.uuid
        };
    }

    private static async generateDialogue(params: { extractedData: any; avatar: any }) {
        const prompt = `
            You are facilitating a deep dialogue between the "Sustainability Sprite" and the user's "Digital Twin".
            
            Extracted ESG Data (from OCR):
            ${JSON.stringify(params.extractedData)}
            
            User's Digital Twin Profile (Virtues):
            ${JSON.stringify(params.avatar.virtues)}
            
            Requirements:
            1. The Sprite (永續精靈) should act as a guide.
            2. The Twin (數位分身) should express insights based on their virtues (Wisdom, Integrity, etc.).
            3. Generate a 4-turn dialogue transcript and a 3-point summary in Traditional Chinese.
            4. Output format: JSON { "transcript": [{ "role": "Sprite" | "Twin", "content": "..." }], "summary": ["..."] }
        `;

        const result = await GeminiService.generateStructuredContent<{
            transcript: Array<{ role: 'Sprite' | 'Twin'; content: string }>;
            summary: string[];
        }>(prompt, GeminiModel.FLASH_THINKING);

        return result;
    }
}

import { z } from 'zod';
/**
 * OmniCard: 萬能分身核心原子單位契約
 * 遵循 5T 協議（Traceable, Transparent, Tangible, Trackable, Trustworthy）
 */
export declare const OmniCardSchema: z.ZodObject<{
    uuid: z.ZodString;
    name: z.ZodString;
    attributes: z.ZodArray<z.ZodString>;
    abilities: z.ZodArray<z.ZodString>;
    status: z.ZodEnum<{
        todo: "todo";
        doing: "doing";
        done: "done";
    }>;
    lastUpdated: z.ZodNumber;
}, z.core.$strip>;
export type OmniCard = z.infer<typeof OmniCardSchema>;
export interface NotionPagePayload {
    id: string;
    url: string;
    last_edited_time: string;
    properties: Record<string, any>;
}
/**
 * OmniEvent: 全域處理日誌 (GPL) 事件契約
 * 實現 Event Sourcing 與 Hash Lock 審查
 */
export declare const OmniEventSchema: z.ZodObject<{
    id: z.ZodString;
    omni_card_uuid: z.ZodString;
    event_type: z.ZodString;
    payload: z.ZodObject<{
        uuid: z.ZodString;
        name: z.ZodString;
        attributes: z.ZodArray<z.ZodString>;
        abilities: z.ZodArray<z.ZodString>;
        status: z.ZodEnum<{
            todo: "todo";
            doing: "doing";
            done: "done";
        }>;
        lastUpdated: z.ZodNumber;
    }, z.core.$strip>;
    source_platform: z.ZodString;
    created_at: z.ZodNumber;
    hash_lock: z.ZodString;
    cryptographic_seal: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type OmniEvent = z.infer<typeof OmniEventSchema>;
//# sourceMappingURL=omni-card.types.d.ts.map
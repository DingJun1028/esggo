import { z } from 'zod';
/**
 * OmniCard: 萬能分身核心原子單位契約
 * 遵循 5T 協議（Traceable, Transparent, Tangible, Trackable, Trustworthy）
 */
export declare const OmniCardSchema: z.ZodObject<{
    uuid: z.ZodString;
    name: z.ZodString;
    attributes: z.ZodArray<z.ZodString, "many">;
    abilities: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["todo", "doing", "done"]>;
    lastUpdated: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "todo" | "doing" | "done";
    name: string;
    attributes: string[];
    uuid: string;
    abilities: string[];
    lastUpdated: number;
}, {
    status: "todo" | "doing" | "done";
    name: string;
    attributes: string[];
    uuid: string;
    abilities: string[];
    lastUpdated: number;
}>;
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
        attributes: z.ZodArray<z.ZodString, "many">;
        abilities: z.ZodArray<z.ZodString, "many">;
        status: z.ZodEnum<["todo", "doing", "done"]>;
        lastUpdated: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: "todo" | "doing" | "done";
        name: string;
        attributes: string[];
        uuid: string;
        abilities: string[];
        lastUpdated: number;
    }, {
        status: "todo" | "doing" | "done";
        name: string;
        attributes: string[];
        uuid: string;
        abilities: string[];
        lastUpdated: number;
    }>;
    source_platform: z.ZodString;
    created_at: z.ZodNumber;
    hash_lock: z.ZodString;
    cryptographic_seal: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export type OmniEvent = z.infer<typeof OmniEventSchema>;
//# sourceMappingURL=omni-card.types.d.ts.map
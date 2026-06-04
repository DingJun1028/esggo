import { z } from 'zod';
export var TagCategory;
(function (TagCategory) {
    TagCategory["ENTITY"] = "entity";
    TagCategory["ATTRIBUTE"] = "attribute";
    TagCategory["RELATION"] = "relation";
    TagCategory["TEMPORAL"] = "temporal";
    TagCategory["SPATIAL"] = "spatial";
    TagCategory["CONCEPT"] = "concept";
    TagCategory["CUSTOM"] = "custom";
})(TagCategory || (TagCategory = {}));
export var EntityType;
(function (EntityType) {
    EntityType["PERSON"] = "person";
    EntityType["ORGANIZATION"] = "organization";
    EntityType["LOCATION"] = "location";
    EntityType["EVENT"] = "event";
    EntityType["OBJECT"] = "object";
    EntityType["DOCUMENT"] = "document";
    EntityType["CONCEPT"] = "concept";
})(EntityType || (EntityType = {}));
export var AttributeType;
(function (AttributeType) {
    AttributeType["STRING"] = "string";
    AttributeType["NUMBER"] = "number";
    AttributeType["BOOLEAN"] = "boolean";
    AttributeType["DATE"] = "date";
    AttributeType["ARRAY"] = "array";
    AttributeType["OBJECT"] = "object";
})(AttributeType || (AttributeType = {}));
export var RelationType;
(function (RelationType) {
    RelationType["ASSOCIATED_WITH"] = "associated_with";
    RelationType["PART_OF"] = "part_of";
    RelationType["CREATED_BY"] = "created_by";
    RelationType["RELATED_TO"] = "related_to";
    RelationType["DEPENDS_ON"] = "depends_on";
    RelationType["REFERENCES"] = "references";
    RelationType["DERIVED_FROM"] = "derived_from";
})(RelationType || (RelationType = {}));
export var ElementType;
(function (ElementType) {
    ElementType["TEXT"] = "text";
    ElementType["IMAGE"] = "image";
    ElementType["VIDEO"] = "video";
    ElementType["AUDIO"] = "audio";
    ElementType["DOCUMENT"] = "document";
    ElementType["STRUCTURED_DATA"] = "structured_data";
    ElementType["BINARY"] = "binary";
})(ElementType || (ElementType = {}));
// ============================================
// Zod Schema 驗證器
// ============================================
export const UCCTagSchema = z.object({
    name: z.string().min(1).max(100),
    category: z.nativeEnum(TagCategory),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    icon: z.string().optional(),
    parent_tag_id: z.string().uuid().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});
export const UCCAttributeSchema = z.object({
    key: z.string().min(1),
    value: z.unknown(),
    type: z.nativeEnum(AttributeType),
    confidence: z.number().min(0).max(1),
    source: z.string().optional(),
});
export const UCCRelationSchema = z.object({
    from_entity_id: z.string().uuid(),
    to_entity_id: z.string().uuid(),
    relation_type: z.nativeEnum(RelationType),
    weight: z.number().min(0).max(1),
    bidirectional: z.boolean().default(false),
    metadata: z.record(z.string(), z.unknown()).optional(),
});
export const CreateUCCDTOSchema = z.object({
    evidence_id: z.string().uuid(),
    tags: z.array(z.string()).optional(),
    auto_extract: z.boolean().default(true),
    analyze_content: z.boolean().default(true),
    ocr_enabled: z.boolean().default(false),
});
export const UpdateUCCDTOSchema = z.object({
    tags: z.object({
        add: z.array(z.string()).optional(),
        remove: z.array(z.string()).optional(),
    }).optional(),
    think_tank: z.object({
        entity_name: z.string().optional(),
        attributes: z.array(UCCAttributeSchema).optional(),
        relations: z.array(UCCRelationSchema).optional(),
    }).optional(),
});
// ============================================
// 型別守衛
// ============================================
export function isUCCPackage(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const obj = value;
    return (typeof obj.evidence === 'object' &&
        Array.isArray(obj.tags) &&
        typeof obj.think_tank === 'object' &&
        Array.isArray(obj.elements));
}
//# sourceMappingURL=ucc.types.js.map
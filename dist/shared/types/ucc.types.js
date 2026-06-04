"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUCCDTOSchema = exports.CreateUCCDTOSchema = exports.UCCRelationSchema = exports.UCCAttributeSchema = exports.UCCTagSchema = exports.ElementType = exports.RelationType = exports.AttributeType = exports.EntityType = exports.TagCategory = void 0;
exports.isUCCPackage = isUCCPackage;
const zod_1 = require("zod");
var TagCategory;
(function (TagCategory) {
    TagCategory["ENTITY"] = "entity";
    TagCategory["ATTRIBUTE"] = "attribute";
    TagCategory["RELATION"] = "relation";
    TagCategory["TEMPORAL"] = "temporal";
    TagCategory["SPATIAL"] = "spatial";
    TagCategory["CONCEPT"] = "concept";
    TagCategory["CUSTOM"] = "custom";
})(TagCategory || (exports.TagCategory = TagCategory = {}));
var EntityType;
(function (EntityType) {
    EntityType["PERSON"] = "person";
    EntityType["ORGANIZATION"] = "organization";
    EntityType["LOCATION"] = "location";
    EntityType["EVENT"] = "event";
    EntityType["OBJECT"] = "object";
    EntityType["DOCUMENT"] = "document";
    EntityType["CONCEPT"] = "concept";
})(EntityType || (exports.EntityType = EntityType = {}));
var AttributeType;
(function (AttributeType) {
    AttributeType["STRING"] = "string";
    AttributeType["NUMBER"] = "number";
    AttributeType["BOOLEAN"] = "boolean";
    AttributeType["DATE"] = "date";
    AttributeType["ARRAY"] = "array";
    AttributeType["OBJECT"] = "object";
})(AttributeType || (exports.AttributeType = AttributeType = {}));
var RelationType;
(function (RelationType) {
    RelationType["ASSOCIATED_WITH"] = "associated_with";
    RelationType["PART_OF"] = "part_of";
    RelationType["CREATED_BY"] = "created_by";
    RelationType["RELATED_TO"] = "related_to";
    RelationType["DEPENDS_ON"] = "depends_on";
    RelationType["REFERENCES"] = "references";
    RelationType["DERIVED_FROM"] = "derived_from";
})(RelationType || (exports.RelationType = RelationType = {}));
var ElementType;
(function (ElementType) {
    ElementType["TEXT"] = "text";
    ElementType["IMAGE"] = "image";
    ElementType["VIDEO"] = "video";
    ElementType["AUDIO"] = "audio";
    ElementType["DOCUMENT"] = "document";
    ElementType["STRUCTURED_DATA"] = "structured_data";
    ElementType["BINARY"] = "binary";
})(ElementType || (exports.ElementType = ElementType = {}));
// ============================================
// Zod Schema 驗證器
// ============================================
exports.UCCTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    category: zod_1.z.nativeEnum(TagCategory),
    color: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    icon: zod_1.z.string().optional(),
    parent_tag_id: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
exports.UCCAttributeSchema = zod_1.z.object({
    key: zod_1.z.string().min(1),
    value: zod_1.z.unknown(),
    type: zod_1.z.nativeEnum(AttributeType),
    confidence: zod_1.z.number().min(0).max(1),
    source: zod_1.z.string().optional(),
});
exports.UCCRelationSchema = zod_1.z.object({
    from_entity_id: zod_1.z.string().uuid(),
    to_entity_id: zod_1.z.string().uuid(),
    relation_type: zod_1.z.nativeEnum(RelationType),
    weight: zod_1.z.number().min(0).max(1),
    bidirectional: zod_1.z.boolean().default(false),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
exports.CreateUCCDTOSchema = zod_1.z.object({
    evidence_id: zod_1.z.string().uuid(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    auto_extract: zod_1.z.boolean().default(true),
    analyze_content: zod_1.z.boolean().default(true),
    ocr_enabled: zod_1.z.boolean().default(false),
});
exports.UpdateUCCDTOSchema = zod_1.z.object({
    tags: zod_1.z.object({
        add: zod_1.z.array(zod_1.z.string()).optional(),
        remove: zod_1.z.array(zod_1.z.string()).optional(),
    }).optional(),
    think_tank: zod_1.z.object({
        entity_name: zod_1.z.string().optional(),
        attributes: zod_1.z.array(exports.UCCAttributeSchema).optional(),
        relations: zod_1.z.array(exports.UCCRelationSchema).optional(),
    }).optional(),
});
// ============================================
// 型別守衛
// ============================================
function isUCCPackage(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const obj = value;
    return (typeof obj.evidence === 'object' &&
        Array.isArray(obj.tags) &&
        typeof obj.think_tank === 'object' &&
        Array.isArray(obj.elements));
}
//# sourceMappingURL=ucc.types.js.map
"use strict";
/**
 * UCC Service
 * 實作「萬能元件心核」三位一體邏輯：標籤層、智庫層、元素層
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uccService = exports.UCCService = void 0;
const supabase_1 = require("../lib/supabase");
const ucc_types_1 = require("../../shared/types/ucc.types");
class UCCService {
    /**
     * 封裝證據為 UCC Package
     */
    async packageEvidence(dto) {
        try {
            // 1. 獲取原始證據
            const { data, error: evError } = await supabase_1.supabase
                .from('evidences')
                .select('*')
                .eq('id', dto.evidence_id)
                .single();
            const evidence = data;
            if (evError)
                (0, supabase_1.handleSupabaseError)(evError);
            if (!evidence)
                throw new Error('Evidence not found');
            // 2. 模擬 AI 提取智庫數據 (T2/T4)
            const mockThinkTank = {
                id: `tt_${dto.evidence_id}`,
                evidence_id: dto.evidence_id,
                entity_type: ucc_types_1.EntityType.DOCUMENT,
                entity_name: evidence.tag,
                attributes: [
                    { key: 'version', value: '8.1.0', type: 'string', confidence: 1.0 }
                ],
                relations: [],
                confidence_score: 0.98,
                extracted_at: new Date(),
                updated_at: new Date()
            };
            // 3. 模擬元素層提取
            const mockElement = {
                id: `el_${dto.evidence_id}`,
                evidence_id: dto.evidence_id,
                element_type: ucc_types_1.ElementType.TEXT,
                content: evidence.content,
                content_hash: evidence.content_hash,
                created_at: new Date()
            };
            // 4. 這裡應寫入資料庫，此處簡化為直接返回封裝包
            return {
                evidence: {
                    id: evidence.id,
                    tag: evidence.tag,
                    content_hash: evidence.content_hash
                },
                tags: [], // 實際應從 ucc_tags 查詢
                think_tank: mockThinkTank,
                elements: [mockElement],
                created_at: new Date(),
                version: '8.1.0'
            };
        }
        catch (error) {
            (0, supabase_1.handleSupabaseError)(error);
        }
    }
}
exports.UCCService = UCCService;
exports.uccService = new UCCService();
//# sourceMappingURL=ucc.service.js.map
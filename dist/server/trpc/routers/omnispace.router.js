"use strict";
/**
 * OmniSpace tRPC Router
 * 定義萬能空間核心 API：真理狀態查詢、卡牌自癒調和、ZKP 封印作業
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.omnispaceRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const types_1 = require("@/src/shared/types");
const omnispace_service_1 = require("../../services/omnispace.service");
exports.omnispaceRouter = (0, trpc_1.router)({
    // 1. 取得指定卡牌的真理狀態 (Truth State)
    getTruthState: trpc_1.publicProcedure
        .input(zod_1.z.object({ uuid: zod_1.z.string().uuid() }))
        .query(async ({ input }) => {
        return omnispace_service_1.omniSpaceService.getTruthState(input.uuid);
    }),
    // 2. 觸發 GlobalHealing 進行卡牌狀態調和
    healCard: trpc_1.publicProcedure
        .input(types_1.OmniCardSchema)
        .mutation(async ({ input }) => {
        return omnispace_service_1.omniSpaceService.healCard(input);
    }),
    // 3. 呼叫底層 CLI 進行 ZKP 封印
    sealDocument: trpc_1.publicProcedure
        .input(zod_1.z.object({ documentId: zod_1.z.string().min(1) }))
        .mutation(async ({ input }) => {
        return omnispace_service_1.omniSpaceService.sealDocument(input.documentId);
    }),
});
//# sourceMappingURL=omnispace.router.js.map
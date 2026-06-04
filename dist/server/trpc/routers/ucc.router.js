"use strict";
/**
 * UCC tRPC Router
 * 定義萬能元件心核的 API 介面
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uccRouter = void 0;
const trpc_1 = require("../trpc");
const types_1 = require("@/src/shared/types");
const ucc_service_1 = require("../../services/ucc.service");
exports.uccRouter = (0, trpc_1.router)({
    /**
     * 封裝為 UCC 包
     */
    package: trpc_1.publicProcedure
        .input(types_1.CreateUCCDTOSchema)
        .mutation(async ({ input }) => {
        return ucc_service_1.uccService.packageEvidence(input);
    }),
});
//# sourceMappingURL=ucc.router.js.map
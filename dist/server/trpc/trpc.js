"use strict";
/**
 * tRPC Foundational Config
 * 定義初始化、Middleware 與 Context
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
// 1. 初始化 tRPC
const t = server_1.initTRPC.context().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof zod_1.ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
// 2. 導出核心工具
exports.router = t.router;
exports.publicProcedure = t.procedure;
// 3. 認證 Middleware (示例)
const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            user: ctx.user,
        },
    });
});
exports.protectedProcedure = t.procedure.use(isAuthed);
//# sourceMappingURL=trpc.js.map
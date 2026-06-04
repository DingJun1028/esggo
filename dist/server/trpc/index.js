"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const evidence_router_1 = require("./routers/evidence.router");
const ucc_router_1 = require("./routers/ucc.router");
const omnispace_router_1 = require("./routers/omnispace.router");
exports.appRouter = (0, trpc_1.router)({
    evidence: evidence_router_1.evidenceRouter,
    ucc: ucc_router_1.uccRouter,
    omnispace: omnispace_router_1.omnispaceRouter,
});
//# sourceMappingURL=index.js.map
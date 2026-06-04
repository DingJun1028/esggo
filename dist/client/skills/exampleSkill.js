"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleSkill = void 0;
/**
 * ExampleSkill demonstrates how to implement a stateless atomic function.
 * It simply echoes the payload after a simulated processing delay.
 */
const exampleSkill = async (input) => {
    const start = Date.now();
    // Extract context & payload – no hidden state is used.
    const { context, payload } = input;
    // Simulate some deterministic processing.
    const processed = {
        echoed: payload,
        requestId: context.requestId,
        processedAt: new Date().toISOString()
    };
    return {
        success: true,
        data: processed,
        metadata: {
            executionTime: Date.now() - start,
            version: '1.0.0'
        }
    };
};
exports.exampleSkill = exampleSkill;
//# sourceMappingURL=exampleSkill.js.map
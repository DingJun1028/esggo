"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const omniagent_adapter_1 = require("./omniagent-adapter");
const adapter_registry_1 = require("./adapter-registry");
(0, vitest_1.describe)('OmniSpace OmniAgent Paperclip Adapter', () => {
    (0, vitest_1.it)('should detect the correct model and provider', async () => {
        const config = await omniagent_adapter_1.omniagentAdapter.detectModel();
        (0, vitest_1.expect)(config.model).toContain('omniagent');
        (0, vitest_1.expect)(config.provider).toBe('OpenRouter');
    });
    (0, vitest_1.it)('should execute a task and return a structured transcript', async () => {
        const transcript = await omniagent_adapter_1.omniagentAdapter.execute('test_session', 'Verify ESG Data');
        (0, vitest_1.expect)(transcript).toHaveLength(3);
        (0, vitest_1.expect)(transcript[0].type).toBe('thought');
        (0, vitest_1.expect)(transcript[1].toolName).toBe('omni_vault_scan');
        (0, vitest_1.expect)(transcript[2].type).toBe('response');
    });
    (0, vitest_1.it)('should correctly process raw output into clean markdown', () => {
        const raw = '+----------+\n|  TABLE   |\n+----------+\n======= HEADING =======';
        const processed = omniagent_adapter_1.omniagentAdapter.processOutput(raw);
        (0, vitest_1.expect)(processed).not.toContain('+--');
        (0, vitest_1.expect)(processed).toContain('--- HEADING ---');
    });
    (0, vitest_1.it)('should be registered in the adapter registry', () => {
        const manifest = adapter_registry_1.adapterRegistry.getAdapter('omniagent_local');
        (0, vitest_1.expect)(manifest).toBeDefined();
        (0, vitest_1.expect)(manifest?.name).toContain('OmniAgent Paperclip Adapter');
    });
});
//# sourceMappingURL=omniagent-adapter.test.js.map